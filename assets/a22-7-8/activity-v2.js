'use strict';
(() => {
  const BASE='assets/a22-7-8/';
  const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
  const audio=$('#narration'), popup=$('#word-popup');
  const storageKey='ispanyolcacim-a22-7-8-ifadeler-v2';
  const tokenPattern=/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:-[A-Za-z]+)?/g;
  const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const time=s=>`${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;
  const getJSON=async path=>{const r=await fetch(BASE+path);if(!r.ok)throw Error(`Dosya yüklenemedi: ${path}`);return r.json();};
  let content,sentences,boundaries=[],entries={},paragraphParts=[],saved=[],currentKey,activePhrase;
  let segment=-1,continuous=true,finished=false,starting=false,playRequest=0,lastGroup='',clipSource,audioContext,clipRequest=0;
  let status='Dinlemeye hazır · 7 paragraf';
  const positions=Array(7).fill(0),decoded=new Map();

  function prepareSentences() {
    const counts=Array(7).fill(0);paragraphParts=Array.from({length:7},()=>[]);
    sentences.forEach((s,i)=>{
      s.text=s.parts.map(p=>p[0]).join(' ');
      s.units=s.parts.map((p,j)=>{
        const count=p[0].match(tokenPattern).length,start=counts[s.paragraph];counts[s.paragraph]+=count;
        const entry={id:`s${i+1}-p${j+1}`,es:p[0],role:p[1],tr:p[2],en:p[3],note:p[4],paragraph:s.paragraph,start,end:counts[s.paragraph]-1};
        entries[entry.id]=entry;paragraphParts[s.paragraph].push(entry);return entry;
      });
    });
    content.paragraphs.forEach((p,i)=>{
      if(counts[i]!==boundaries[i].length)throw Error(`Paragraf ${i+1}: ses ve öbekler eşleşmiyor`);
      const rebuilt=sentences.filter(s=>s.paragraph===i).map(s=>s.text).join(' ');
      if(rebuilt!==p)throw Error(`Paragraf ${i+1}: özgün metin eşleşmiyor`);
    });
  }

  function phraseButton(entry) {
    const button=document.createElement('button');button.type='button';button.className='phrase-unit';button.lang='es';
    button.textContent=entry.es;button.dataset.phraseId=entry.id;
    button.setAttribute('aria-label',`${entry.es} — ${entry.role}: Türkçe ve İngilizce anlamını gör`);
    return button;
  }

  function appendSentence(target,s) {s.units.forEach((unit,i)=>{if(i)target.append(document.createTextNode(' '));target.append(phraseButton(unit));});}

  function renderStory(target) {
    content.paragraphs.forEach((text,i)=>{
      const section=document.createElement('section');section.className='paragraph';section.dataset.p=i;
      const header=document.createElement('div');header.className='paragraph-header';
      header.innerHTML=`<div class="paragraph-heading"><span class="paragraph-number">${String(i+1).padStart(2,'0')}</span><span>${escape(content.paragraphTitles[i])}</span></div><div class="paragraph-controls"><button class="paragraph-control start" data-paragraph-start="${i}" aria-label="${i+1}. paragrafı başlat">▶ Başlat</button><button class="paragraph-control stop" data-paragraph-stop="${i}" aria-label="${i+1}. paragrafı durdur" disabled>❚❚ Durdur</button></div>`;
      const p=document.createElement('p');
      sentences.filter(s=>s.paragraph===i).forEach((s,j)=>{if(j)p.append(document.createTextNode(' '));const span=document.createElement('span');span.className='sentence';appendSentence(span,s);p.append(span);});
      section.append(header,p);target.append(section);
    });
  }

  function renderGrammar() {
    sentences.forEach((s,i)=>{
      const details=document.createElement('details');details.className='grammar-card sentence-analysis';details.id=`frase-${i+1}`;details.open=i===0;
      details.innerHTML=`<summary><span class="frase-number" lang="es">${i+1}ª frase</span><span class="sentence-preview" lang="es">${escape(s.text)}</span><span class="expand" aria-hidden="true">+</span></summary><div class="grammar-content"><div class="sentence-location">PARAGRAF ${s.paragraph+1} · CÜMLE ${i+1} / 17</div></div>`;
      const body=$('.grammar-content',details),full=document.createElement('blockquote');full.className='full-sentence';full.lang='es';appendSentence(full,s);body.append(full);
      const translation=document.createElement('div');translation.className='sentence-translation';translation.innerHTML=`<p><strong>TR</strong>${escape(s.tr)}</p><p class="english"><strong>EN</strong>${escape(s.en)}</p>`;body.append(translation);
      const subject=document.createElement('p');subject.className='subject-note';subject.innerHTML=`<strong lang="es">Sujeto · Özne</strong> ${escape(s.subject)}`;body.append(subject);
      const title=document.createElement('h3');title.className='analysis-heading';title.innerHTML='<span lang="es">Elementos de la oración</span><small>Cümlenin anlamlı öbekleri</small>';body.append(title);
      const parts=document.createElement('div');parts.className='analysis-parts';
      s.units.forEach(unit=>{
        const row=document.createElement('div');row.className='analysis-part';
        const label=document.createElement('span');label.className='part-role';label.lang='es';label.textContent=unit.role;
        const phrase=document.createElement('div');phrase.className='part-spanish';phrase.append(phraseButton(unit));
        const tr=document.createElement('p');tr.className='part-translation';tr.textContent=unit.tr;
        const note=document.createElement('p');note.className='part-note';note.textContent=unit.note;
        row.append(label,phrase,tr,note);parts.append(row);
      });body.append(parts);
      const verbTitle=document.createElement('h3');verbTitle.className='analysis-heading';verbTitle.innerHTML='<span lang="es">Verbos y tiempos</span><small>Fiiller ve zamanlar</small>';body.append(verbTitle);
      const verbs=document.createElement('div');verbs.className='verb-analysis';
      s.verbs.forEach(([form,tense,note])=>{const row=document.createElement('div');row.className='verb-row';row.innerHTML=`<strong lang="es">${escape(form)}</strong><span>${escape(tense)}</span><p>${escape(note)}</p>`;verbs.append(row);});body.append(verbs);
      const tip=document.createElement('aside');tip.className='tip';tip.innerHTML='<strong>💡 Cümleyi nasıl okuyalım?</strong>';s.notes.forEach(n=>{const p=document.createElement('p');p.textContent=n;tip.append(p);});body.append(tip);
      $('#grammar-cards').append(details);
    });
  }

  function updateSaved() {
    try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch(_){}
    $('#saved-count').textContent=saved.length;
    $$('.phrase-unit').forEach(el=>el.classList.toggle('saved',saved.includes(el.dataset.phraseId)));
    const target=$('#saved-words');target.replaceChildren();
    if(!saved.length){const p=document.createElement('p');p.className='empty-note';p.textContent='Metindeki bir öbeğe dokun ve “Defterime ekle”yi seç. İfadeleri anlamlarıyla birlikte sakla. ✨';target.append(p);}
    saved.forEach(id=>{const entry=entries[id];if(!entry)return;const card=document.createElement('div');card.className='saved-card';card.innerHTML=`<div><strong lang="es">${escape(entry.es)}</strong><p class="saved-role" lang="es">${escape(entry.role)}</p><p>TR · ${escape(entry.tr)}</p><p class="en">EN · ${escape(entry.en)}</p></div><button class="remove-word" data-remove="${id}" aria-label="İfadeyi defterden çıkar">×</button>`;target.append(card);});
    if(currentKey)$('#save-word').textContent=saved.includes(currentKey)?'✓ Defterimde · Çıkar':'＋ Defterime ekle';
  }

  function positionPopup() {
    if(popup.hidden||!activePhrase?.isConnected)return;
    const rect=activePhrase.getBoundingClientRect(),box=popup.getBoundingClientRect(),margin=12;
    popup.style.left=`${Math.max(margin,Math.min(rect.left-15,innerWidth-box.width-margin))}px`;
    let top=rect.bottom+10;if(top+box.height>innerHeight-margin)top=rect.top-box.height-10;
    popup.style.top=`${Math.max(margin,Math.min(top,innerHeight-box.height-margin))}px`;
  }

  function stopClip(){clipRequest++;if(clipSource){try{clipSource.stop();}catch(_){}clipSource=null;}if('speechSynthesis'in window)speechSynthesis.cancel();}
  function closePopup(restore=true){const previous=activePhrase;popup.hidden=true;stopClip();activePhrase?.classList.remove('selected');activePhrase=null;currentKey=null;if(restore&&previous?.isConnected)previous.focus({preventScroll:true});}
  function openPhrase(button){
    closePopup(false);activePhrase=button;currentKey=button.dataset.phraseId;const e=entries[currentKey];if(!e)return;
    button.classList.add('selected');$('#popup-word').textContent=e.es;$('#popup-lemma').textContent=e.role;
    $('#popup-tr').textContent=e.tr;$('#popup-en').textContent=e.en;
    $('#popup-phrase').hidden=false;$('#phrase-es').textContent='Cümledeki görevi';$('#phrase-tr').textContent=e.note;$('#phrase-en').textContent='';
    $('#pronunciation-status').textContent='';popup.hidden=false;updateSaved();positionPopup();$('#close-popup').focus({preventScroll:true});
  }

  function switchTab(name,focus=false){
    if(!['reading','listening','grammar'].includes(name))return;closePopup(false);
    $$('.tab').forEach(t=>{const active=t.dataset.tab===name;t.classList.toggle('active',active);t.setAttribute('aria-selected',active);t.tabIndex=active?0:-1;});
    $$('.panel').forEach(p=>p.hidden=p.id!==name);if(focus)$(`#tab-${name}`).focus({preventScroll:true});history.replaceState(null,'',`#${name}`);
  }

  function updatePlayer(){
    const playing=!audio.paused&&!audio.ended;
    $$('[data-action="play"]').forEach(b=>{b.textContent=starting?'Ses hazırlanıyor…':playing?'❚❚ Duraklat':'▶ '+(segment<0?'Yapay zekâ sesiyle oku':finished?'Yeniden dinle':'Devam et');b.disabled=starting;});
    $$('[data-audio-status]').forEach(e=>e.textContent=status);$$('[data-time]').forEach(e=>e.textContent=`${time(audio.currentTime)} / ${time(audio.duration)}`);
    $$('[data-seek]').forEach(e=>{e.disabled=segment<0||!Number.isFinite(audio.duration);e.value=Number.isFinite(audio.duration)?audio.currentTime/audio.duration*100:0;});
    $$('[data-action="previous"]').forEach(b=>b.disabled=segment<=0);$$('[data-action="next"]').forEach(b=>b.disabled=segment>=6);
    $$('[data-paragraph-start]').forEach(b=>{const i=Number(b.dataset.paragraphStart),active=i===segment;b.disabled=active&&(playing||starting);b.textContent=active&&starting?'Hazırlanıyor…':active&&playing?'▶ Oynatılıyor':(active&&audio.currentTime>0&&!audio.ended)||positions[i]>0?'▶ Devam et':'▶ Başlat';b.setAttribute('aria-label',`${i+1}. paragrafı ${b.textContent.includes('Devam')?'kaldığın yerden başlat':'başlat'}`);});
    $$('[data-paragraph-stop]').forEach(b=>{b.disabled=Number(b.dataset.paragraphStop)!==segment||(!playing&&!starting);});
    $$('.paragraph').forEach(p=>p.classList.toggle('active-paragraph',Number(p.dataset.p)===segment&&(playing||starting)));
  }

  function highlight(){
    if(segment<0)return;
    let index=-1;boundaries[segment].forEach((b,i)=>{if(audio.currentTime>=b.start)index=i;});
    const group=paragraphParts[segment].find(p=>index>=p.start&&index<=p.end),id=group?.id||'';
    if(id===lastGroup)return;$$('.phrase-unit.speaking').forEach(el=>el.classList.remove('speaking'));
    if(id)$$(`.phrase-unit[data-phrase-id="${id}"]`).forEach(el=>el.classList.add('speaking'));lastGroup=id;
  }

  function pauseParagraph(index=segment){
    if(index!==segment)return;playRequest++;starting=false;stopClip();audio.pause();
    if(segment>=0){positions[segment]=audio.currentTime;status=`Durduruldu · Paragraf ${segment+1} / 7 · Başlat ile devam edebilirsin.`;}updatePlayer();
  }

  async function playSegment(index,wholeText=true,restart=false){
    if(index<0||index>6)return;
    const request=++playRequest;stopClip();
    if(segment>=0&&!audio.ended)positions[segment]=audio.currentTime;
    const same=index===segment;audio.pause();segment=index;continuous=wholeText;finished=false;starting=true;lastGroup='';
    $$('.phrase-unit.speaking').forEach(el=>el.classList.remove('speaking'));
    if(!same||restart||audio.ended){const resume=restart?0:positions[index];audio.src=BASE+`parrafo-${index+1}.mp3`;audio.currentTime=resume;}
    status=`Paragraf ${index+1} / 7 · ${content.paragraphTitles[index]}`;updatePlayer();
    if($('#follow-audio').checked){const p=$$('.panel:not([hidden]) .paragraph').find(p=>Number(p.dataset.p)===index);p?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});}
    try{await audio.play();if(request!==playRequest)return;starting=false;updatePlayer();}
    catch(error){if(request!==playRequest||error.name==='AbortError')return;starting=false;status='Ses başlatılamadı. Başlat düğmesine tekrar dokun.';updatePlayer();}
  }

  async function togglePlay(){if(!audio.paused||starting){pauseParagraph();return;}if(segment<0||finished){positions.fill(0);await playSegment(0,true,true);}else await playSegment(segment,true);}

  async function pronounce(){
    const key=currentKey,e=entries[key];if(!e)return;pauseParagraph();stopClip();const request=clipRequest;
    $('#pronunciation-status').textContent='İfadenin sesi hazırlanıyor…';
    try{
      const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)throw Error('Ses desteklenmiyor');audioContext=audioContext||new AudioCtx();await audioContext.resume();
      if(!decoded.has(e.paragraph)){const r=await fetch(BASE+`parrafo-${e.paragraph+1}.mp3`);if(!r.ok)throw Error('Ses yüklenemedi');decoded.set(e.paragraph,await audioContext.decodeAudioData(await r.arrayBuffer()));}
      if(currentKey!==key||popup.hidden||request!==clipRequest)return;
      const first=boundaries[e.paragraph][e.start],last=boundaries[e.paragraph][e.end],source=audioContext.createBufferSource();
      source.buffer=decoded.get(e.paragraph);source.connect(audioContext.destination);clipSource=source;source.start(0,Math.max(0,first.start-.025),last.end-first.start+.065);
      $('#pronunciation-status').textContent='İfade bir bütün olarak İspanyolca okunuyor.';
    }catch(_){
      if(currentKey!==key||popup.hidden||request!==clipRequest)return;
      if(!('speechSynthesis'in window)){$('#pronunciation-status').textContent='İfade sesi açılamadı. Paragrafı dinleyebilirsin.';return;}
      const u=new SpeechSynthesisUtterance(e.es);u.lang='es-ES';u.rate=.8;const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('es'));if(voice)u.voice=voice;speechSynthesis.speak(u);$('#pronunciation-status').textContent='İfade bir bütün olarak İspanyolca okunuyor.';
    }
  }

  async function init(){
    try{
      const results=await Promise.all([getJSON('content.json'),getJSON('sentences.json'),...Array.from({length:7},(_,i)=>getJSON(`parrafo-${i+1}.json`))]);
      content=results[0];sentences=results[1];boundaries=results.slice(2);prepareSentences();
      try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');if(Array.isArray(data))saved=[...new Set(data.filter(id=>entries[id]))];}catch(_){}
      renderStory($('#reading-text'));renderStory($('#listening-text'));renderGrammar();
      $('#word-count').textContent='17 cümle · 7 paragraf';$('#loading').hidden=true;updateSaved();updatePlayer();switchTab(location.hash.slice(1));
      document.addEventListener('click',event=>{
        const phrase=event.target.closest('.phrase-unit');if(phrase){openPhrase(phrase);return;}
        const tab=event.target.closest('[data-tab]');if(tab){switchTab(tab.dataset.tab);return;}
        const go=event.target.closest('[data-go]');if(go){switchTab(go.dataset.go,true);$('.tabs').scrollIntoView({block:'start'});return;}
        const start=event.target.closest('[data-paragraph-start]');if(start){playSegment(Number(start.dataset.paragraphStart),false);return;}
        const stop=event.target.closest('[data-paragraph-stop]');if(stop){pauseParagraph(Number(stop.dataset.paragraphStop));return;}
        const remove=event.target.closest('[data-remove]');if(remove){saved=saved.filter(id=>id!==remove.dataset.remove);updateSaved();return;}
        const expand=event.target.closest('[data-expand-sentences]');if(expand){$$('.sentence-analysis').forEach(d=>d.open=expand.dataset.expandSentences==='open');return;}
        const action=event.target.closest('[data-action]');if(action){switch(action.dataset.action){case'play':togglePlay();break;case'restart':positions.fill(0);playSegment(0,true,true);break;case'previous':playSegment(Math.max(0,segment-1),true,true);break;case'next':playSegment(Math.min(6,segment+1),true,true);break;}return;}
        if(!popup.hidden&&!popup.contains(event.target))closePopup(false);
      });
      $('.tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('.tab'),at=tabs.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?2:(at+(e.key==='ArrowRight'?1:2))%3;switchTab(tabs[next].dataset.tab,true);});
      $('#close-popup').addEventListener('click',()=>closePopup());document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden){e.preventDefault();closePopup();}});
      popup.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=$$('button',popup);if(e.shiftKey&&document.activeElement===focusable[0]){e.preventDefault();focusable.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===focusable.at(-1)){e.preventDefault();focusable[0].focus();}});
      $('#save-word').addEventListener('click',()=>{if(!currentKey)return;if(saved.includes(currentKey))saved=saved.filter(id=>id!==currentKey);else saved.push(currentKey);updateSaved();});$('#pronounce').addEventListener('click',pronounce);
      $('#toggle-notebook').addEventListener('click',()=>{const box=$('#notebook-content');box.hidden=!box.hidden;$('#toggle-notebook').textContent=box.hidden?'Defterimi aç ↓':'Defterimi kapat ↑';$('#toggle-notebook').setAttribute('aria-expanded',!box.hidden);});
      $('#toggle-transcript').addEventListener('click',()=>{const text=$('#listening-text');text.hidden=!text.hidden;$('#toggle-transcript').textContent=text.hidden?'📖 Metni göster':'🙈 Metni gizle';$('#toggle-transcript').setAttribute('aria-expanded',!text.hidden);closePopup(false);});
      $$('[data-speed]').forEach(select=>select.addEventListener('change',()=>{audio.playbackRate=Number(select.value);$$('[data-speed]').forEach(other=>other.value=select.value);}));
      $$('[data-seek]').forEach(range=>range.addEventListener('input',()=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(range.value)/100*audio.duration;updatePlayer();highlight();}));
      ['timeupdate','loadedmetadata','pause','play'].forEach(type=>audio.addEventListener(type,()=>{updatePlayer();highlight();}));
      audio.addEventListener('ended',()=>{positions[segment]=0;starting=false;$$('.phrase-unit.speaking').forEach(p=>p.classList.remove('speaking'));if(continuous&&segment<6)playSegment(segment+1,true,true);else{finished=continuous;status=continuous?'Dinleme tamamlandı. ¡Muy bien! 🎉':`${segment+1}. paragraf tamamlandı · Başlat ile yeniden dinleyebilirsin.`;updatePlayer();}});
      audio.addEventListener('error',()=>{if(segment>=0){starting=false;status='Ses dosyası açılamadı. Bağlantını kontrol edip Başlat düğmesine tekrar dokun.';updatePlayer();}});
      window.addEventListener('resize',positionPopup);window.addEventListener('scroll',positionPopup,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden)stopClip();});window.addEventListener('pagehide',()=>{audio.pause();stopClip();});
    }catch(error){$('#loading').replaceChildren(document.createTextNode('Etkinlik yüklenemedi. Bağlantını kontrol edip sayfayı yenile. '));const retry=document.createElement('button');retry.className='btn';retry.textContent='Yeniden yükle';retry.addEventListener('click',()=>location.reload());$('#loading').append(retry);console.error(error);}
  }
  init();
})();
