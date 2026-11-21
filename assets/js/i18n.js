/* ============================================================
   ZAVALA ASHANE BUILDERS — i18n.js
   English ⇄ Spanish switcher for the static site.

   How it works
   ------------
   The HTML stays in English (single source of truth). The dictionaries in
   i18n-data.js are keyed by the EXACT English text, so any copy edited in the
   HTML only needs its key updated here. On load we snapshot every text node
   and attribute, then swap in the Spanish version on demand.

   - TEXT   English text            -> Spanish text
   - ATTRS  English attribute value -> Spanish value (alt, placeholder, …)
   - BLOCKS [data-i18n-block="key"] -> Spanish innerHTML, for paragraphs that
            contain inline <strong>/<a> and would otherwise be translated as
            disconnected fragments.

   The choice is remembered in localStorage and applied on every page.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'zab-lang';
  var LANG_ATTR = 'lang';
  var data = window.ZAB_I18N || { TEXT: {}, ATTRS: {}, BLOCKS: {} };
  var TEXT = data.TEXT;
  var ATTRS = data.ATTRS;
  var BLOCKS = data.BLOCKS;

  var ATTR_NAMES = ['alt', 'placeholder', 'aria-label', 'title', 'content'];
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SVG: 1 };

  var textOriginals = new Map();   // Text node       -> original string
  var attrOriginals = new Map();   // Element         -> { attr: original }
  var blockOriginals = new Map();  // Element         -> original innerHTML
  var headOriginals = null;        // { title, description }
  var current = 'en';

  function norm(str) {
    return String(str).replace(/\s+/g, ' ').trim();
  }

  /* ---- snapshot the English DOM once ------------------------------- */
  function capture() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      if (!parent) continue;
      if (SKIP_TAGS[parent.tagName]) continue;
      if (parent.closest('[aria-hidden="true"]')) continue;
      if (norm(node.nodeValue).length < 2) continue;
      textOriginals.set(node, node.nodeValue);
    }

    ATTR_NAMES.forEach(function (attr) {
      document.querySelectorAll('[' + attr + ']').forEach(function (el) {
        if (el.tagName === 'META' && attr !== 'content') return;
        var value = el.getAttribute(attr);
        if (!value) return;
        if (!attrOriginals.has(el)) attrOriginals.set(el, {});
        attrOriginals.get(el)[attr] = value;
      });
    });

    document.querySelectorAll('[data-i18n-block]').forEach(function (el) {
      blockOriginals.set(el, el.innerHTML);
    });

    var titleEl = document.querySelector('title');
    var descEl = document.querySelector('meta[name="description"]');
    headOriginals = {
      title: titleEl ? titleEl.textContent : null,
      description: descEl ? descEl.getAttribute('content') : null
    };
  }

  /* ---- restore English --------------------------------------------- */
  function restore() {
    textOriginals.forEach(function (value, node) { node.nodeValue = value; });

    attrOriginals.forEach(function (map, el) {
      Object.keys(map).forEach(function (attr) { el.setAttribute(attr, map[attr]); });
    });

    blockOriginals.forEach(function (html, el) { el.innerHTML = html; });

    if (headOriginals) {
      var titleEl = document.querySelector('title');
      var descEl = document.querySelector('meta[name="description"]');
      if (titleEl && headOriginals.title !== null) titleEl.textContent = headOriginals.title;
      if (descEl && headOriginals.description !== null) {
        descEl.setAttribute('content', headOriginals.description);
      }
    }
  }

  /* ---- swap in Spanish --------------------------------------------- */
  function translate() {
    textOriginals.forEach(function (value, node) {
      var key = norm(value);
      var es = TEXT[key];
      if (!es) return;
      // Replace the trimmed original (which keeps its internal newlines) so that
      // multi-line text nodes match too, and preserve the surrounding whitespace.
      var trimmed = value.trim();
      if (trimmed) node.nodeValue = value.replace(trimmed, es);
    });

    attrOriginals.forEach(function (map, el) {
      Object.keys(map).forEach(function (attr) {
        var es = ATTRS[map[attr]];
        if (es) el.setAttribute(attr, es);
      });
    });

    blockOriginals.forEach(function (html, el) {
      var key = el.getAttribute('data-i18n-block');
      if (key && BLOCKS[key]) el.innerHTML = BLOCKS[key];
    });

    if (headOriginals) {
      var titleEl = document.querySelector('title');
      var descEl = document.querySelector('meta[name="description"]');
      if (titleEl && headOriginals.title && TEXT[headOriginals.title]) {
        titleEl.textContent = TEXT[headOriginals.title];
      }
      if (descEl && headOriginals.description && ATTRS[headOriginals.description]) {
        descEl.setAttribute('content', ATTRS[headOriginals.description]);
      }
    }
  }

  /* ---- button state ------------------------------------------------ */
  function paintButton() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.querySelectorAll('[data-lang]').forEach(function (opt) {
      opt.classList.toggle('is-active', opt.getAttribute('data-lang') === current);
    });
    btn.setAttribute('aria-label', current === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish');
    btn.setAttribute('title', current === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish');
  }

  /* ---- public ------------------------------------------------------ */
  function apply(lang) {
    current = lang === 'es' ? 'es' : 'en';
    restore();
    if (current === 'es') translate();
    document.documentElement.setAttribute(LANG_ATTR, current);
    paintButton();
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) { /* private mode */ }
  }

  function stored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === 'es' || v === 'en' ? v : null;
    } catch (e) { return null; }
  }

  function init() {
    capture();
    var btn = document.getElementById('lang-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        apply(current === 'es' ? 'en' : 'es');
      });
    }
    var start = stored();
    apply(start || 'en');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ZABapplyLanguage = apply;
  window.ZABuntranslated = function () {
    // Dev helper: list English strings with no Spanish entry that are still
    // attached to the document (detached nodes belong to replaced blocks).
    var missing = [];
    textOriginals.forEach(function (value, node) {
      if (!node.isConnected) return;
      var key = norm(value);
      if (key.length > 1 && !TEXT[key]) missing.push(key);
    });
    return missing;
  };
})();
