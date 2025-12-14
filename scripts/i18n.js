(function() {
  'use strict';

  const SUPPORTED_LANGUAGES = [
    { code: 'pt', name: 'Português', flag: '🇧🇷', region: 'Brasil' },
    { code: 'en', name: 'English', flag: '🇺🇸', region: 'Global' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', region: 'Восточная Европа' }
  ];

  const REGION_GROUPS = [
    { name: 'Americas', nameKey: 'americas', codes: ['pt', 'en'] },
    { name: 'Europe & Beyond', nameKey: 'europe', codes: ['ru'] }
  ];

  let currentLang = 'pt';
  let translations = {};

  function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || 'pt';
    const langCode = browserLang.split('-')[0].toLowerCase();
    const supported = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    return supported ? langCode : 'en';
  }

  function getSavedLanguage() {
    try {
      return localStorage.getItem('zetta_language');
    } catch (e) {
      return null;
    }
  }

  function saveLanguage(lang) {
    try {
      localStorage.setItem('zetta_language', lang);
    } catch (e) {}
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  function renderFeatureLists(lang) {
    if (!translations[lang]) return;
    const t = translations[lang];

    // Renderizar feature lists para todos os cards
    const featureSections = [
      { key: 'zbanck', selector: '#zbanck .feature-list' },
      { key: 'zion', selector: '#zion .feature-list' },
      { key: 'blockchain', selector: '#blockchain .feature-list' },
      { key:  'obelisk', selector: '#obelisk .feature-list' }
    ];

    featureSections.forEach(section => {
      const element = document.querySelector(section.selector);
      if (element && t[section.key] && t[section.key]. features) {
        element.innerHTML = '';
        t[section.key].features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          element.appendChild(li);
        });
      }
    });
  }

  function applyTranslations(lang) {
    if (!translations[lang]) return;
    
    const t = translations[lang];
    
    // Aplicar data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(t, key);
      if (value) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // Aplicar data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const value = getNestedValue(t, key);
      if (value) {
        el.innerHTML = value;
      }
    });

    // Renderizar feature lists
    renderFeatureLists(lang);

    // Atualizar dir e lang
    const html = document.documentElement;
    if (t.rtl) {
      html.setAttribute('dir', 'rtl');
      html.setAttribute('lang', lang);
    } else {
      html.setAttribute('dir', 'ltr');
      html.setAttribute('lang', lang);
    }

    updateLanguageSelectorDisplay(lang);
  }

  function updateLanguageSelectorDisplay(lang) {
    const langData = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    if (!langData) return;

    const currentFlag = document.querySelector('.lang-current-flag');
    const currentName = document.querySelector('.lang-current-name');
    
    if (currentFlag) currentFlag.textContent = langData.flag;
    if (currentName) currentName.textContent = langData.name;

    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList. toggle('active', opt.dataset.lang === lang);
    });
  }

  function setLanguage(lang) {
    if (!translations[lang]) {
      console.warn('Language not available:', lang);
      return;
    }
    currentLang = lang;
    saveLanguage(lang);
    applyTranslations(lang);
    
    document.dispatchEvent(new CustomEvent('zetta:languageChanged', { 
      detail: { language: lang } 
    }));
  }

  function createLanguageSelector() {
    const existingSelector = document.querySelector('.lang-selector');
    if (existingSelector) existingSelector.remove();
    const existingDropdown = document.querySelector('.lang-dropdown-portal');
    if (existingDropdown) existingDropdown.remove();

    const selector = document.createElement('div');
    selector.className = 'lang-selector';
    selector.innerHTML = `
      <button class="lang-trigger" aria-label="Select language" aria-expanded="false">
        <span class="lang-current-flag">🇧🇷</span>
        <span class="lang-current-name">Português</span>
        <svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
    `;

    const dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown lang-dropdown-portal';
    dropdown.setAttribute('role', 'listbox');
    dropdown.innerHTML = `
      <div class="lang-dropdown-inner">
        <div class="lang-search-wrap">
          <input type="text" class="lang-search" placeholder="Search language..." autocomplete="off">
          <svg class="lang-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <div class="lang-regions"></div>
      </div>
    `;

    document.body.appendChild(dropdown);

    const regionsContainer = dropdown.querySelector('.lang-regions');
    
    const uniqueLangs = new Set();
    REGION_GROUPS.forEach(region => {
      const regionDiv = document.createElement('div');
      regionDiv.className = 'lang-region';
      regionDiv.innerHTML = `<div class="lang-region-title">${region.name}</div>`;
      
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'lang-region-options';
      
      region.codes.forEach(code => {
        if (uniqueLangs.has(code)) return;
        const langData = SUPPORTED_LANGUAGES.find(l => l.code === code);
        if (!langData) return;
        
        const option = document.createElement('button');
        option.className = 'lang-option';
        option.dataset.lang = code;
        option.setAttribute('role', 'option');
        option.innerHTML = `
          <span class="lang-option-flag">${langData.flag}</span>
          <span class="lang-option-name">${langData.name}</span>
          <svg class="lang-option-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        `;
        optionsDiv.appendChild(option);
        uniqueLangs.add(code);
      });
      
      regionDiv.appendChild(optionsDiv);
      regionsContainer.appendChild(regionDiv);
    });

    const header = document.querySelector('.site-header . header-inner');
    if (header) {
      const nav = header.querySelector('.nav');
      if (nav) {
        header.insertBefore(selector, nav);
      } else {
        header.appendChild(selector);
      }
    }

    const trigger = selector.querySelector('.lang-trigger');
    const searchInput = dropdown.querySelector('.lang-search');
    const options = dropdown.querySelectorAll('. lang-option');
    const regions = dropdown.querySelectorAll('.lang-region');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('active');
      trigger.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        searchInput.value = '';
        filterLanguages('');
        setTimeout(() => searchInput.focus(), 50);
      }
    });

    function filterLanguages(query) {
      const q = query.toLowerCase().trim();
      regions.forEach(region => {
        let hasVisible = false;
        region.querySelectorAll('.lang-option').forEach(opt => {
          const name = opt.querySelector('.lang-option-name').textContent.toLowerCase();
          const matches = !q || name.includes(q);
          opt.style.display = matches ? '' : 'none';
          if (matches) hasVisible = true;
        });
        region.style.display = hasVisible ? '' : 'none';
      });
    }

    searchInput.addEventListener('input', (e) => {
      filterLanguages(e.target.value);
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        const lang = opt.dataset.lang;
        setLanguage(lang);
        dropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    return selector;
  }

  function injectStyles() {
    if (document.getElementById('zetta-i18n-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'zetta-i18n-styles';
    style.textContent = `
      .lang-selector {
        position: relative;
        z-index: 1000;
        order: 10;
        margin-left: auto;
      }

      @media (max-width: 900px) {
        .lang-selector {
          position: absolute;
          right: 60px;
          top: 50%;
          transform: translateY(-50%);
          margin: 0;
        }
      }

      .lang-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .lang-trigger:hover {
        background: rgba(0, 212, 255, 0.1);
        border-color: rgba(0, 212, 255, 0.3);
      }

      .lang-current-flag {
        font-size: 1.1rem;
        line-height: 1;
      }

      .lang-current-name {
        display: none;
      }

      @media (min-width: 768px) {
        .lang-current-name {
          display: inline;
        }
      }

      .lang-chevron {
        transition: transform 0.2s ease;
        opacity: 0.6;
      }

      .lang-dropdown.active + .lang-trigger . lang-chevron,
      .lang-trigger[aria-expanded="true"] .lang-chevron {
        transform: rotate(180deg);
      }

      .lang-dropdown {
        position: fixed;
        top: 70px;
        right: 16px;
        width: 320px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 100px);
        background: linear-gradient(180deg, rgba(13, 13, 18, 0.99) 0%, rgba(10, 10, 14, 1) 100%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 212, 255, 0.15);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px) scale(0.98);
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        z-index: 99999;
      }

      . lang-dropdown.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .lang-dropdown-inner {
        max-height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 212, 255, 0.3) transparent;
      }

      .lang-dropdown-inner::-webkit-scrollbar {
        width: 6px;
      }

      . lang-dropdown-inner::-webkit-scrollbar-track {
        background: transparent;
      }

      .lang-dropdown-inner::-webkit-scrollbar-thumb {
        background: rgba(0, 212, 255, 0.3);
        border-radius: 3px;
      }

      . lang-search-wrap {
        position: sticky;
        top: 0;
        padding: 0.75rem;
        background: rgba(13, 13, 18, 0.95);
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        z-index: 1;
      }

      .lang-search {
        width: 100%;
        padding: 0.625rem 0.875rem 0.625rem 2.25rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        color: #fff;
        font-size: 0.875rem;
        outline: none;
        transition: all 0.2s ease;
      }

      .lang-search:: placeholder {
        color: rgba(255, 255, 255, 0.4);
      }

      .lang-search:focus {
        background: rgba(0, 212, 255, 0.05);
        border-color: rgba(0, 212, 255, 0.4);
        box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
      }

      .lang-search-wrap {
        position: relative;
      }

      .lang-search-icon {
        position: absolute;
        left: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.4);
        pointer-events: none;
      }

      .lang-regions {
        padding: 0.5rem;
      }

      .lang-region {
        margin-bottom: 0.5rem;
      }

      .lang-region:last-child {
        margin-bottom: 0;
      }

      .lang-region-title {
        padding: 0.5rem 0.75rem;
        color: rgba(0, 212, 255, 0.8);
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .lang-region-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2px;
      }

      .lang-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 0.75rem;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: rgba(255, 255, 255, 0.85);
        font-size: 0.8rem;
        text-align: left;
        cursor: pointer;
        transition: all 0.15s ease;
        position: relative;
      }

      .lang-option:hover {
        background: rgba(0, 212, 255, 0.1);
        color: #fff;
      }

      .lang-option.active {
        background: rgba(0, 212, 255, 0.15);
        color: #00d4ff;
      }

      .lang-option-flag {
        font-size: 1rem;
        line-height: 1;
        flex-shrink: 0;
      }

      .lang-option-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .lang-option-check {
        opacity: 0;
        color: #00d4ff;
        flex-shrink: 0;
        transition: opacity 0.15s ease;
      }

      .lang-option.active .lang-option-check {
        opacity: 1;
      }

      [dir="rtl"] .lang-selector {
        margin-right: 0;
        margin-left: 1rem;
      }

      [dir="rtl"] .lang-dropdown {
        right: auto;
        left: 0;
      }

      [dir="rtl"] .lang-option {
        text-align: right;
      }

      @media (max-width: 900px) {
        .lang-dropdown {
          position: fixed;
          top: 64px;
          bottom: auto;
          left: 8px;
          right: 8px;
          width: auto;
          max-height: calc(100vh - 80px);
          border-radius: 12px;
          transform: translateY(-10px);
          opacity: 0;
          visibility:  hidden;
          z-index: 100000;
        }

        .lang-dropdown.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .lang-region-options {
          grid-template-columns: 1fr;
        }

        .lang-option {
          padding: 0.875rem 1rem;
        }

        . lang-dropdown-inner {
          padding-bottom: 16px;
          max-height: calc(100vh - 120px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lang-dropdown,
        .lang-trigger,
        .lang-option,
        .lang-chevron {
          transition: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (typeof ZETTA_TRANSLATIONS === 'undefined') {
      console.warn('ZETTA_TRANSLATIONS not loaded');
      return;
    }

    translations = ZETTA_TRANSLATIONS;
    
    injectStyles();
    createLanguageSelector();
    
    const savedLang = getSavedLanguage();
    const detectedLang = detectBrowserLanguage();
    currentLang = savedLang || detectedLang;
    
    if (translations[currentLang]) {
      setLanguage(currentLang);
    } else {
      setLanguage('en');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ZettaI18n = {
    setLanguage:  setLanguage,
    getCurrentLanguage: () => currentLang,
    getSupportedLanguages: () => SUPPORTED_LANGUAGES,
    getTranslation: (key) => getNestedValue(translations[currentLang], key)
  };

})();
