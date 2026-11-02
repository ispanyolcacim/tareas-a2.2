(function () {
  'use strict';

  // Student names only. Personal access codes are never requested or stored here.
  var LEVEL = "A2.2";
  var INITIAL_NAMES = ["Aysen Gurkan", "Birce Suzen", "Ecem Sukas", "Elif Bozkurt Alvurdu", "Emel Kanburoglu", "Ezgi Yurdumetin", "Gulce Eyibilir", "Leyla Gulyurt", "Kubra Cam", "Meryem Ozbek", "Seher Ercin", "Serra Sancakli Isik", "Yasemin Kurtulus Tunc", "Zeynep Geylan", "Zeynep Ozay", "Zeynep Oztaskin", "Begum Senturk", "Didem Dundar", "Ebru Ozgen", "Ece Turhanoglu", "Gulsah Gundogdu", "Irem Savas", "Sevde Ozdemir", "Kardelen Kuscu", "Zumeyra Dogan"];
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbw7BdcjAuCuD2cem_q7ixdHPDl51_gC4tyGuv9OsAW-v1Qr1TO-gxkXxD7WX1h37vO7FA/exec";
  var IDS = [
    'introName', 'resName2', 'studentSelect', 'student', 'studentName',
    'resName', 'name-sel', 'cf-sel', 'name-select', 'confirm-name-select',
    'writing-confirm-select', 'nameSelect', 'nameSelect2', 'wc-sel',
    'studentSel', 'confirmSel', 'ogrenciSec', 'selName', 'rName2', 'student2'
  ];
  var SELECTOR = IDS.map(function (id) { return 'select[id="' + id + '"]'; }).join(',');
  var collator = new Intl.Collator('tr', { sensitivity: 'base', numeric: true });
  var names = new Map();
  var scheduled = false;

  function clean(value) {
    return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  }

  function key(value) {
    return clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0131/g, 'i').toLowerCase();
  }

  function remember(value) {
    var name = clean(value);
    if (name && name.length <= 200 && !names.has(key(name))) names.set(key(name), name);
  }

  function optionName(option) {
    return clean(option.value.split('|||')[0]);
  }

  function currentNames() {
    return Array.from(names.values()).sort(collator.compare);
  }

  function mergeArray(array, additions) {
    if (!Array.isArray(array) || array.some(function (value) { return typeof value !== 'string'; })) return;
    var seen = new Set(array.map(key));
    additions.forEach(function (name) {
      if (!seen.has(key(name))) { array.push(name); seen.add(key(name)); }
    });
  }

  function legacyLists() {
    var arrays = [];
    var maps = [];
    try { if (typeof STUDENTS !== 'undefined' && Array.isArray(STUDENTS)) arrays.push(STUDENTS); } catch (_) {}
    try {
      if (typeof STUDENTS_BY_GROUP !== 'undefined' && STUDENTS_BY_GROUP && Array.isArray(STUDENTS_BY_GROUP[LEVEL])) {
        arrays.push(STUDENTS_BY_GROUP[LEVEL]);
      }
    } catch (_) {}
    try {
      if (typeof STUDENTS_DISPLAY !== 'undefined' && STUDENTS_DISPLAY && Array.isArray(STUDENTS_DISPLAY[LEVEL])) {
        arrays.push(STUDENTS_DISPLAY[LEVEL]);
      }
    } catch (_) {}
    try { if (typeof GROUPS !== 'undefined' && GROUPS && typeof GROUPS === 'object') maps.push(GROUPS); } catch (_) {}
    try {
      if (typeof STUDENT_GROUP_MAP !== 'undefined' && STUDENT_GROUP_MAP && typeof STUDENT_GROUP_MAP === 'object') {
        maps.push(STUDENT_GROUP_MAP);
      }
    } catch (_) {}
    return { arrays: arrays, maps: maps };
  }

  function fillSelect(select, allNames) {
    var original = Array.from(select.options);
    var placeholders = original.filter(function (option) { return !option.value; });
    var existing = new Map();
    original.forEach(function (option) {
      if (option.value && !existing.has(key(optionName(option)))) existing.set(key(optionName(option)), option);
    });
    var grouped = original.some(function (option) { return option.value.indexOf('|||') !== -1; });
    var groupLabels = original.some(function (option) { return option.value.indexOf('|||') !== -1 && /\([^)]*\)$/.test(option.textContent); });
    var selectedValue = select.value;
    var desired = placeholders.concat(allNames.map(function (name) {
      var oldOption = existing.get(key(name));
      if (oldOption) return oldOption;
      var option = document.createElement('option');
      option.value = grouped ? name + '|||' + LEVEL : name;
      option.textContent = groupLabels ? name + ' (' + LEVEL + ')' : name;
      return option;
    }));
    var unchanged = original.length === desired.length && original.every(function (option, i) {
      return option === desired[i];
    });
    if (unchanged) return;
    var fragment = document.createDocumentFragment();
    desired.forEach(function (option) { fragment.appendChild(option); });
    select.replaceChildren(fragment);
    // Keep the two selections independent: finishing an exercise may correct the first choice.
    if (desired.some(function (option) { return option.value === selectedValue; })) select.value = selectedValue;
    else if (placeholders.length) select.value = placeholders[0].value;
  }

  function refresh() {
    scheduled = false;
    var selects = Array.from(document.querySelectorAll(SELECTOR));
    selects.forEach(function (select) {
      Array.from(select.options).forEach(function (option) { if (option.value) remember(optionName(option)); });
    });
    var legacy = legacyLists();
    legacy.arrays.forEach(function (array) { array.forEach(remember); });
    var allNames = currentNames();
    legacy.arrays.forEach(function (array) { mergeArray(array, allNames); });
    legacy.maps.forEach(function (map) {
      allNames.forEach(function (name) {
        if (!Object.prototype.hasOwnProperty.call(map, name)) map[name] = LEVEL;
      });
    });
    selects.forEach(function (select) { fillSelect(select, allNames); });
  }

  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    Promise.resolve().then(refresh);
  }

  function isStudentNode(node) {
    return node.nodeType === 1 && (node.matches(SELECTOR) || node.querySelector(SELECTOR));
  }

  function loadLiveNames() {
    var callback = '__idaRoster_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
    var request = document.createElement('script');
    var finished = false;
    var timer;
    function cleanup() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (request.parentNode) request.parentNode.removeChild(request);
      // A response received after timeout must not throw or replace the working list.
      window[callback] = function () {};
    }
    window[callback] = function (data) {
      if (finished) return;
      if (data && data.success === true && Array.isArray(data.students)) {
        data.students.forEach(remember);
        refresh();
      }
      cleanup();
    };
    request.onerror = cleanup;
    var url = new URL(ENDPOINT);
    url.searchParams.set('action', 'students');
    url.searchParams.set('level', LEVEL);
    url.searchParams.set('callback', callback);
    request.src = url.toString();
    timer = setTimeout(cleanup, 15000);
    document.head.appendChild(request);
  }

  function start() {
    // Capture the original spelling and option values before adding the current spreadsheet snapshot.
    refresh();
    INITIAL_NAMES.forEach(remember);
    refresh();
    new MutationObserver(function (records) {
      if (records.some(function (record) {
        return isStudentNode(record.target) || Array.from(record.addedNodes).some(isStudentNode);
      })) scheduleRefresh();
    }).observe(document.body, { childList: true, subtree: true });
    loadLiveNames();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
