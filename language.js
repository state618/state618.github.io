
(function () {
  const STORAGE_KEY = 'state618_language';
  const MODES = ['bi', 'zh', 'en'];
  const han = /[\u3400-\u9fff]/;
  const splitNodes = [];
  const languageOnly = [];

  function explicitText(mode) {
    document.querySelectorAll('[data-i18n-zh][data-i18n-en]').forEach((el) => {
      const zh = el.dataset.i18nZh || '';
      const en = el.dataset.i18nEn || '';
      el.textContent = mode === 'zh' ? zh : mode === 'en' ? en : zh + ' / ' + en;
    });

    document.querySelectorAll('[data-placeholder-zh][data-placeholder-en]').forEach((el) => {
      const zh = el.dataset.placeholderZh || '';
      const en = el.dataset.placeholderEn || '';
      el.placeholder = mode === 'zh' ? zh : mode === 'en' ? en : zh + ' / ' + en;
    });
  }

  function detectPair(text) {
    const trimmed = text.trim();
    for (const sep of [' / ']) {
      const parts = trimmed.split(sep);
      if (parts.length !== 2) continue;
      const leftHan = han.test(parts[0]);
      const rightHan = han.test(parts[1]);
      if (leftHan === rightHan) continue;
      return {
        zh: leftHan ? parts[0] : parts[1],
        en: leftHan ? parts[1] : parts[0]
      };
    }
    return null;
  }

  function scanFallbackPairs() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION'].includes(parent.tagName)) continue;
      if (parent.closest('[data-i18n-zh]')) continue;
      const pair = detectPair(node.nodeValue || '');
      if (!pair) continue;
      splitNodes.push({
        node,
        original: node.nodeValue,
        zh: pair.zh,
        en: pair.en
      });
    }
  }

  function scanLanguageOnly() {
    document.querySelectorAll('.zh, .en').forEach((el) => {
      languageOnly.push({
        el,
        lang: el.classList.contains('zh') ? 'zh' : 'en'
      });
    });
  }

  function applyFallbackPairs(mode) {
    splitNodes.forEach((item) => {
      if (mode === 'bi') {
        item.node.nodeValue = item.original;
        return;
      }
      const leading = item.original.match(/^\s*/)?.[0] || '';
      const trailing = item.original.match(/\s*$/)?.[0] || '';
      item.node.nodeValue = leading + item[mode] + trailing;
    });
  }

  function setMode(mode) {
    if (!MODES.includes(mode)) mode = 'bi';
    document.documentElement.dataset.language = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    explicitText(mode);
    applyFallbackPairs(mode);

    languageOnly.forEach(({ el, lang }) => {
      el.hidden = mode !== 'bi' && mode !== lang;
    });

    document.querySelectorAll('.language-option').forEach((button) => {
      button.classList.toggle('active', button.dataset.language === mode);
    });

    const label = document.querySelector('.language-current');
    if (label) label.textContent = mode === 'zh' ? '繁中' : mode === 'en' ? 'EN' : '雙語';

    window.dispatchEvent(new CustomEvent('state618:languagechange', { detail: { language: mode } }));
  }

  function buildControl() {
    const details = document.createElement('details');
    details.className = 'language-switcher';
    details.innerHTML = `
      <summary aria-label="Language selector">
        <span>LANG</span>
        <strong class="language-current">雙語</strong>
      </summary>
      <div class="language-menu">
        <button type="button" class="language-option" data-language="bi">雙語 / Bilingual</button>
        <button type="button" class="language-option" data-language="zh">繁體中文</button>
        <button type="button" class="language-option" data-language="en">English</button>
        <div class="language-coming">更多語言可繼續加入 / More languages can be added</div>
      </div>
    `;
    document.body.appendChild(details);

    details.querySelectorAll('.language-option').forEach((button) => {
      button.addEventListener('click', () => {
        setMode(button.dataset.language);
        details.open = false;
      });
    });
  }

  buildControl();
  scanFallbackPairs();
  scanLanguageOnly();
  setMode(localStorage.getItem(STORAGE_KEY) || 'bi');
})();
