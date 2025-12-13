(function() {
  'use strict';

  const I18N = {
    currentLanguage: localStorage.getItem('zetta-lang') || 'pt-BR',
    
    init: function() {
      this.setupLanguageSwitcher();
      this.translate();
      document.addEventListener('languageChange', () => this.translate());
    },

    setLanguage: function(lang) {
      this.currentLanguage = lang;
      localStorage.setItem('zetta-lang', lang);
      this.translate();
      document.dispatchEvent(new CustomEvent('languageChange'));
    },

    getLanguage: function() {
      return this.currentLanguage;
    },

    translate: function() {
      if (typeof translations === 'undefined') {
        console.warn('Translations not loaded. Ensure translations.js is loaded before i18n.js');
        return;
      }

      const lang = this.currentLanguage;
      const langTranslations = translations[lang] || translations['pt-BR'];

      // Translate elements with data-i18n attribute
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langTranslations[key]) {
          el.textContent = langTranslations[key];
        }
      });

      // Translate elements with data-i18n-html attribute (for HTML content)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (langTranslations[key]) {
          el.innerHTML = langTranslations[key];
        }
      });

      // Update HTML lang attribute
      document.documentElement. lang = lang;
    },

    setupLanguageSwitcher:  function() {
      // Placeholder for future language switcher UI
    },

    t: function(key) {
      const lang = this.currentLanguage;
      const langTranslations = translations[lang] || translations['pt-BR'];
      return langTranslations[key] || key;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18N.init());
  } else {
    I18N.init();
  }

  // Expose to global scope
  window.I18N = I18N;
  window.i18n = I18N.t.bind(I18N);

})();
