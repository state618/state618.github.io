
(function () {
  const STORAGE_KEY = 'state618_language';
  const MODES = ['bi', 'zh', 'en'];
  const han = /[\u3400-\u9fff]/;
  const splitNodes = [];
  const smallPairs = [];
  const languageOnly = [];

  function detectPair(text) {
    const trimmed = text.trim();
    for (const sep of [' / ', ' · ']) {
      const parts = trimmed.split(sep);
      if (parts.length !== 2) continue;
      const leftHan = han.test(parts[0]);
      const rightHan = han.test(parts[1]);
      if (leftHan === rightHan) continue;
      return {
        original: trimmed,
        zh: leftHan ? parts[0] : parts[1],
        en: leftHan ? parts[1] : parts[0]
      };
    }
    return null;
  }

  function scanTextPairs() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) continue;
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

  function scanSmallPairs() {
    document.querySelectorAll('small').forEach((small) => {
      const parent = small.parentElement;
      if (!parent) return;
      const direct = Array.from(parent.childNodes).find(
        (n) => n.nodeType === Node.TEXT_NODE && n.nodeValue.trim()
      );
      if (!direct) return;
      const primary = direct.nodeValue.trim();
      const secondary = small.textContent.trim();
      if (!primary || !secondary) return;
      if (han.test(primary) === han.test(secondary)) return;
      smallPairs.push({
        direct,
        small,
        originalDirect: direct.nodeValue,
        primaryLang: han.test(primary) ? 'zh' : 'en',
        primary,
        secondary
      });
    });
  }

  function scanLanguageOnly() {
    document.querySelectorAll('.zh, .en, .zh-title').forEach((el) => {
      let lang = null;
      if (el.classList.contains('zh')) lang = 'zh';
      if (el.classList.contains('en')) lang = 'en';
      if (el.classList.contains('zh-title')) {
        lang = han.test(el.textContent) ? 'zh' : 'en';
        const prev = el.previousElementSibling;
        if (prev && /^H[1-3]$/.test(prev.tagName)) {
          const prevLang = han.test(prev.textContent) ? 'zh' : 'en';
          languageOnly.push({ el: prev, lang: prevLang });
        }
      }
      if (lang) languageOnly.push({ el, lang });
    });

    document.querySelectorAll('.intro.zh').forEach((zhEl) => {
      const prev = zhEl.previousElementSibling;
      if (prev && prev.classList.contains('intro')) {
        languageOnly.push({ el: prev, lang: 'en' });
      }
    });
  }

  function setMode(mode) {
    if (!MODES.includes(mode)) mode = 'bi';
    document.documentElement.dataset.language = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    splitNodes.forEach((item) => {
      if (mode === 'bi') item.node.nodeValue = item.original;
      else item.node.nodeValue = item.node.nodeValue.replace(item.node.nodeValue.trim(), item[mode]);
    });

    smallPairs.forEach((item) => {
      if (mode === 'bi') {
        item.direct.nodeValue = item.originalDirect;
        item.small.hidden = false;
        return;
      }
      if (item.primaryLang === mode) {
        item.direct.nodeValue = item.originalDirect;
        item.small.hidden = true;
      } else {
        item.direct.nodeValue = item.originalDirect.replace(item.primary, item.secondary);
        item.small.hidden = true;
      }
    });

    languageOnly.forEach(({ el, lang }) => {
      el.hidden = mode !== 'bi' && mode !== lang;
    });

    document.querySelectorAll('.language-option').forEach((button) => {
      button.classList.toggle('active', button.dataset.language === mode);
    });

    const label = document.querySelector('.language-current');
    if (label) {
      label.textContent = mode === 'zh' ? '繁中' : mode === 'en' ? 'EN' : '雙語';
    }
  }

  function buildControl() {
    const details = document.createElement('details');
    details.className = 'language-switcher';
    details.innerHTML = `
      <summary><span>LANG</span><strong class="language-current">雙語</strong></summary>
      <div class="language-menu">
        <button type="button" class="language-option" data-language="bi">雙語 / Bilingual</button>
        <button type="button" class="language-option" data-language="zh">繁體中文</button>
        <button type="button" class="language-option" data-language="en">English</button>
        <div class="language-coming">More languages can be added here.</div>
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
  scanTextPairs();
  scanSmallPairs();
  scanLanguageOnly();
  setMode(localStorage.getItem(STORAGE_KEY) || 'bi');
})();
