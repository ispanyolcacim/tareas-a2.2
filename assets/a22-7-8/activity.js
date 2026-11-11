'use strict';
(() => {
  const BASE = 'assets/a22-7-8/';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const audio = $('#narration');
  const popup = $('#word-popup');
  const storageKey = 'ispanyolcacim-a22-7-8-kelimeler-v1';
  const normalize = s => s.toLocaleLowerCase('es').normalize('NFC');
  const tokenPattern = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:-[A-Za-z]+)?/g;
  let content, phrases, dictionary = {}, boundaries = [], saved = [], currentWord, activeWord;
  let segment = -1, continuous = true, lastSpoken = -1, clipSource, audioContext;
  let finished = false, status = 'Dinlemeye hazır · 7 paragraf', playRequest = 0;
  const decoded = new Map();
  const escape = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time = seconds => `${Math.floor((seconds || 0) / 60)}:${String(Math.floor((seconds || 0) % 60)).padStart(2, '0')}`;
  const getJSON = async path => { const r = await fetch(BASE + path); if (!r.ok) throw Error(`Dosya yüklenemedi: ${path}`); return r.json(); };

  function annotate(text, paragraphIndex) {
    const fragment = document.createDocumentFragment();
    const lower = normalize(text);
    const matches = [];
    for (const phrase of phrases) {
      let pos = -1;
      while ((pos = lower.indexOf(normalize(phrase[0]), pos + 1)) !== -1) {
        const before = lower[pos - 1], after = lower[pos + phrase[0].length];
        if ((!before || !/[\p{L}]/u.test(before)) && (!after || !/[\p{L}]/u.test(after))) matches.push({start:pos,end:pos+phrase[0].length,phrase});
      }
    }
    matches.sort((a,b) => b.phrase[0].length - a.phrase[0].length);
    let cursor = 0, wordIndex = 0;
    for (const match of text.matchAll(tokenPattern)) {
      fragment.append(document.createTextNode(text.slice(cursor, match.index)));
      const word = document.createElement('button');
      word.type = 'button'; word.className = 'word'; word.textContent = match[0]; word.lang = 'es';
      word.dataset.key = normalize(match[0]);
      if (paragraphIndex !== undefined) { word.dataset.paragraph = paragraphIndex; word.dataset.index = wordIndex; }
      const phrase = matches.find(p => match.index >= p.start && match.index < p.end);
      if (phrase) word.dataset.phrase = JSON.stringify(phrase.phrase);
      word.setAttribute('aria-label', `${match[0]}: Türkçe ve İngilizce anlamını gör`);
      fragment.append(word); cursor = match.index + match[0].length; wordIndex++;
    }
    fragment.append(document.createTextNode(text.slice(cursor)));
    return fragment;
  }

  function renderStory(target) {
    content.paragraphs.forEach((text,i) => {
      const section = document.createElement('section'); section.className = 'paragraph'; section.dataset.p = i;
      const aside = document.createElement('div'); aside.className = 'paragraph-aside';
      aside.innerHTML = `<span class="paragraph-number">${String(i+1).padStart(2,'0')}</span><button class="paragraph-play" data-listen="${i}" aria-label="${i+1}. paragrafı dinle: ${escape(content.paragraphTitles[i])}">▶</button>`;
      const p = document.createElement('p'); p.append(annotate(text,i)); section.append(aside,p); target.append(section);
    });
  }

  function renderGrammar() {
    content.grammar.forEach((g,i) => {
      const details = document.createElement('details'); details.className = 'grammar-card'; details.id = g.id; details.open = i===0;
      details.innerHTML = `<summary><span class="grammar-number">${String(i+1).padStart(2,'0')}</span><span><strong>${escape(g.label)}</strong><small>${escape(g.title)}</small></span><span class="grammar-tag">${escape(g.tag)}</span><span class="expand" aria-hidden="true">+</span></summary><div class="grammar-content"><p class="rule">${escape(g.rule)}</p></div>`;
      const body = $('.grammar-content', details);
      if (g.formula) { const formula = document.createElement('div'); formula.className = 'formula'; formula.textContent = g.formula; body.append(formula); }
      g.examples.forEach(([es,tr,note]) => {
        const example = document.createElement('div'); example.className = 'example';
        const quote = document.createElement('blockquote'); quote.lang = 'es'; quote.append(annotate(es));
        example.append(quote);
        const translation = document.createElement('p'); translation.className='tr'; translation.textContent=tr;
        const explanation = document.createElement('p'); explanation.className='explanation'; explanation.textContent=note;
        example.append(translation,explanation); body.append(example);
      });
      if (g.forms) {const forms = document.createElement('div'); forms.className='forms'; forms.innerHTML='<span class="forms-label">METİNDEKİ BİÇİMLER</span>'; const es=document.createElement('span'); es.lang='es'; es.append(annotate(g.forms)); forms.append(es); body.append(forms);}
      const tip = document.createElement('aside'); tip.className='tip'; tip.innerHTML='<strong>💡 Dikkat edelim</strong>'; const note=document.createElement('p'); note.textContent=g.tip; tip.append(note); body.append(tip);
      $('#grammar-cards').append(details);
    });
    $$('[data-spanish]').forEach(el => { const text=el.textContent; el.replaceChildren(annotate(text)); });
  }

  function updateSaved() {
    try {localStorage.setItem(storageKey, JSON.stringify(saved));} catch (_) {}
    $('#saved-count').textContent = saved.length;
    $$('.word').forEach(w => w.classList.toggle('saved', saved.includes(w.dataset.key)));
    const target=$('#saved-words'); target.replaceChildren();
    if (!saved.length) {const p=document.createElement('p');p.className='empty-note';p.textContent='Metindeki bir kelimeye tıkla ve “Defterime ekle”yi seç. İlk kelimen burada seni beklesin. ✨';target.append(p);}
    saved.forEach(key => {
      const entry=dictionary[key]; if(!entry) return;
      const card=document.createElement('div');card.className='saved-card';
      card.innerHTML=`<div><strong lang="es">${escape(key)}</strong><p>TR · ${escape(entry.tr)}</p><p class="en">EN · ${escape(entry.en)}</p></div><button class="remove-word" data-remove="${escape(key)}" aria-label="${escape(key)} kelimesini defterden çıkar">×</button>`;
      target.append(card);
    });
    if(currentWord) $('#save-word').textContent=saved.includes(currentWord)?'✓ Defterimde · Çıkar':'＋ Defterime ekle';
  }

  function positionPopup() {
    if(popup.hidden || !activeWord || !activeWord.isConnected) return;
    const rect=activeWord.getBoundingClientRect();
    const box=popup.getBoundingClientRect(), margin=12;
    const left=Math.max(margin,Math.min(rect.left-15,innerWidth-box.width-margin));
    let top=rect.bottom+10;
    if(top+box.height>innerHeight-margin) top=rect.top-box.height-10;
    top=Math.max(margin,Math.min(top,innerHeight-box.height-margin));
    popup.style.left=`${left}px`;popup.style.top=`${top}px`;
  }

  function openWord(word) {
    closePopup(false); activeWord=word; currentWord=word.dataset.key; word.classList.add('selected');
    const entry=dictionary[currentWord];
    if(!entry) {closePopup(false);return;}
    $('#popup-word').textContent=word.textContent;
    $('#popup-lemma').textContent=`Sözlük biçimi: ${entry.lemma}`;
    $('#popup-tr').textContent=entry.tr;$('#popup-en').textContent=entry.en;
    const phrase=word.dataset.phrase ? JSON.parse(word.dataset.phrase) : null;
    $('#popup-phrase').hidden=!phrase;
    if(phrase) {$('#phrase-es').textContent=phrase[0];$('#phrase-tr').textContent=`TR · ${phrase[1]}`;$('#phrase-en').textContent=`EN · ${phrase[2]}`;}
    $('#pronunciation-status').textContent='';
    popup.hidden=false;updateSaved();positionPopup();$('#close-popup').focus({preventScroll:true});
  }

  function stopClip() {if(clipSource){try{clipSource.stop();}catch(_){}clipSource=null;} if('speechSynthesis' in window) window.speechSynthesis.cancel();}
  function closePopup(restoreFocus=true) {
    const previous=activeWord;popup.hidden=true;stopClip();
    if(activeWord) activeWord.classList.remove('selected'); activeWord=null;currentWord=null;
    if(restoreFocus && previous && previous.isConnected) previous.focus({preventScroll:true});
  }

  function switchTab(name, focus=false) {
    if(!['reading','listening','grammar'].includes(name)) return;
    closePopup(false);
    $$('.tab').forEach(t => {const active=t.dataset.tab===name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;});
    $$('.panel').forEach(p => p.hidden=p.id!==name);
    if(focus) $(`#tab-${name}`).focus({preventScroll:true});
    history.replaceState(null,'',`#${name}`);
  }

  function updatePlayer() {
    $$('[data-action="play"]').forEach(b => b.textContent=audio.paused?'▶ '+(segment<0?'Yapay zekâ sesiyle oku':finished?'Yeniden dinle':'Devam et'):'❚❚ Duraklat');
    $$('[data-audio-status]').forEach(e=>e.textContent=status);
    $$('[data-time]').forEach(e=>e.textContent=`${time(audio.currentTime)} / ${time(audio.duration)}`);
    $$('[data-seek]').forEach(e=>{e.disabled=segment<0 || !Number.isFinite(audio.duration);e.value=Number.isFinite(audio.duration)?(audio.currentTime/audio.duration)*100:0;});
    $$('[data-action="previous"]').forEach(b=>b.disabled=segment<=0);
    $$('[data-action="next"]').forEach(b=>b.disabled=segment>=content.paragraphs.length-1);
  }

  function highlight() {
    if(segment<0) return;
    const index=boundaries[segment].findIndex(b => audio.currentTime>=b.start && audio.currentTime<b.end);
    if(index===lastSpoken) return;
    $$('.word.speaking').forEach(el=>el.classList.remove('speaking'));
    if(index>=0) $$(`.word[data-paragraph="${segment}"][data-index="${index}"]`).forEach(el=>el.classList.add('speaking'));
    lastSpoken=index;
  }

  async function playSegment(index, wholeText=true) {
    if(index<0 || index>=content.paragraphs.length) return;
    const request=++playRequest;
    stopClip(); audio.pause(); segment=index;continuous=wholeText;finished=false;lastSpoken=-1;
    $$('.word.speaking').forEach(el=>el.classList.remove('speaking'));
    $$('.paragraph').forEach(p=>p.classList.toggle('active-paragraph',Number(p.dataset.p)===segment));
    audio.src=BASE+`parrafo-${segment+1}.mp3`;
    status=`Paragraf ${segment+1} / 7 · ${content.paragraphTitles[segment]}`;updatePlayer();
    if($('#follow-audio').checked) {
      const visible=$$('.panel:not([hidden]) .paragraph').find(p=>Number(p.dataset.p)===segment);
      if(visible) visible.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
    }
    try {await audio.play(); if(request!==playRequest)return;updatePlayer();}
    catch(error) {if(request!==playRequest || error.name==='AbortError')return;status='Ses başlatılamadı. Tekrar dinle düğmesine dokun.';updatePlayer();}
  }

  async function togglePlay() {
    stopClip();
    if(!audio.paused) {audio.pause();status=`Duraklatıldı · Paragraf ${segment+1} / 7`;updatePlayer();return;}
    if(segment<0 || finished) {await playSegment(0,true);return;}
    continuous=true;status=`Paragraf ${segment+1} / 7 · ${content.paragraphTitles[segment]}`;
    try{await audio.play();}catch(_){status='Ses başlatılamadı. Tekrar dene.';}updatePlayer();
  }

  async function pronounce() {
    const key=currentWord;if(!key)return;
    audio.pause();updatePlayer();stopClip();
    let pIndex=-1,wIndex=-1;
    for(let p=0;p<boundaries.length;p++) {const w=boundaries[p].findIndex(item=>normalize(item.text.replace(/[.,:;!?]/g,''))===key);if(w>=0){pIndex=p;wIndex=w;break;}}
    $('#pronunciation-status').textContent='Ses hazırlanıyor…';
    try {
      const AudioCtx=window.AudioContext||window.webkitAudioContext;
      if(!AudioCtx || pIndex<0) throw Error('Ses kesiti bulunamadı');
      audioContext=audioContext||new AudioCtx();await audioContext.resume();
      if(!decoded.has(pIndex)) {const r=await fetch(BASE+`parrafo-${pIndex+1}.mp3`);if(!r.ok)throw Error('Ses yüklenemedi');const buffer=await audioContext.decodeAudioData(await r.arrayBuffer());decoded.set(pIndex,buffer);}
      if(currentWord!==key || popup.hidden)return;
      const boundary=boundaries[pIndex][wIndex],source=audioContext.createBufferSource();source.buffer=decoded.get(pIndex);source.connect(audioContext.destination);clipSource=source;
      source.start(0,Math.max(0,boundary.start-.025),boundary.end-boundary.start+.065);
      $('#pronunciation-status').textContent='İspanyolca yapay zekâ sesinden kelime telaffuzu.';
    } catch(_) {
      if(!('speechSynthesis' in window)) {$('#pronunciation-status').textContent='Kelime sesi bu tarayıcıda açılamadı. Paragrafı dinleyebilirsin.';return;}
      const utterance=new SpeechSynthesisUtterance(key);utterance.lang='es-ES';utterance.rate=.8;
      const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('es'));if(voice)utterance.voice=voice;
      utterance.onerror=()=>$('#pronunciation-status').textContent='Kelime sesi açılamadı. Paragrafı dinleyebilirsin.';
      speechSynthesis.speak(utterance);$('#pronunciation-status').textContent='İspanyolca kelime telaffuzu.';
    }
  }

  async function init() {
    try {
      const results=await Promise.all([getJSON('content.json'),getJSON('phrases.json'),fetch(BASE+'lexicon.tsv').then(r=>{if(!r.ok)throw Error('Sözlük yüklenemedi');return r.text();}),...Array.from({length:7},(_,i)=>getJSON(`parrafo-${i+1}.json`))]);
      content=results[0];phrases=results[1];boundaries=results.slice(3);
      results[2].trim().split('\n').forEach(line=>{const[key,tr,en,lemma]=line.split('\t');dictionary[key]={tr,en,lemma};});
      try {const data=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(data))saved=[...new Set(data.filter(k=>typeof k==='string' && dictionary[k]))];} catch(_){}
      renderStory($('#reading-text'));renderStory($('#listening-text'));renderGrammar();
      $('#word-count').textContent=`${content.paragraphs.join(' ').match(tokenPattern).length} kelime · 7 paragraf`;
      $('#loading').hidden=true;updateSaved();updatePlayer();
      switchTab(location.hash.slice(1));

      document.addEventListener('click',event=>{
        const word=event.target.closest('.word');if(word){openWord(word);return;}
        const tab=event.target.closest('[data-tab]');if(tab){switchTab(tab.dataset.tab);return;}
        const go=event.target.closest('[data-go]');if(go){switchTab(go.dataset.go,true);$('.tabs').scrollIntoView({block:'start'});return;}
        const listen=event.target.closest('[data-listen]');if(listen){playSegment(Number(listen.dataset.listen),false);return;}
        const remove=event.target.closest('[data-remove]');if(remove){saved=saved.filter(k=>k!==remove.dataset.remove);updateSaved();return;}
        const action=event.target.closest('[data-action]');if(action){
          switch(action.dataset.action){case'play':togglePlay();break;case'restart':playSegment(0,true);break;case'previous':playSegment(Math.max(0,segment-1),true);break;case'next':playSegment(Math.min(6,segment+1),true);break;}return;
        }
        if(!popup.hidden && !popup.contains(event.target))closePopup(false);
      });
      $('.tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('.tab'),at=tabs.indexOf(document.activeElement);const next=e.key==='Home'?0:e.key==='End'?2:(at+(e.key==='ArrowRight'?1:2))%3;switchTab(tabs[next].dataset.tab,true);});
      $('#close-popup').addEventListener('click',()=>closePopup());
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden){e.preventDefault();closePopup();}});
      popup.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=$$('button',popup);if(e.shiftKey&&document.activeElement===focusable[0]){e.preventDefault();focusable.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===focusable.at(-1)){e.preventDefault();focusable[0].focus();}});
      $('#save-word').addEventListener('click',()=>{if(!currentWord)return;if(saved.includes(currentWord))saved=saved.filter(k=>k!==currentWord);else saved.push(currentWord);updateSaved();});
      $('#pronounce').addEventListener('click',pronounce);
      $('#toggle-notebook').addEventListener('click',()=>{const box=$('#notebook-content');box.hidden=!box.hidden;$('#toggle-notebook').textContent=box.hidden?'Defterimi aç ↓':'Defterimi kapat ↑';$('#toggle-notebook').setAttribute('aria-expanded',!box.hidden);});
      $('#toggle-transcript').addEventListener('click',()=>{const text=$('#listening-text');text.hidden=!text.hidden;$('#toggle-transcript').textContent=text.hidden?'📖 Metni göster':'🙈 Metni gizle';$('#toggle-transcript').setAttribute('aria-expanded',!text.hidden);closePopup(false);});
      $$('[data-speed]').forEach(select=>select.addEventListener('change',()=>{audio.playbackRate=Number(select.value);$$('[data-speed]').forEach(other=>other.value=select.value);}));
      $$('[data-seek]').forEach(range=>range.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=(Number(range.value)/100)*audio.duration;updatePlayer();highlight();}));
      ['timeupdate','loadedmetadata','pause','play'].forEach(type=>audio.addEventListener(type,()=>{updatePlayer();highlight();}));
      audio.addEventListener('ended',()=>{if(continuous&&segment<6){playSegment(segment+1,true);}else{finished=continuous;status=continuous?'Dinleme tamamlandı. ¡Muy bien! 🎉':`${segment+1}. paragraf tamamlandı · Diğer paragrafları da dinleyebilirsin.`;updatePlayer();$$('.word.speaking').forEach(w=>w.classList.remove('speaking'));}});
      audio.addEventListener('error',()=>{if(segment>=0){status='Ses dosyası açılamadı. Bağlantını kontrol edip yeniden dene.';updatePlayer();}});
      window.addEventListener('resize',positionPopup);window.addEventListener('scroll',positionPopup,{passive:true});
      document.addEventListener('visibilitychange',()=>{if(document.hidden)stopClip();});
      window.addEventListener('pagehide',()=>{audio.pause();stopClip();});
    } catch(error) {
      $('#loading').replaceChildren(document.createTextNode('Etkinlik yüklenemedi. Bağlantını kontrol edip sayfayı yenile. '));
      const retry=document.createElement('button');retry.className='btn';retry.textContent='Yeniden yükle';retry.addEventListener('click',()=>location.reload());$('#loading').append(retry);
      console.error(error);
    }
  }
  init();
})();
