(function() {
  'use strict';

  const SUPPORTED_LANGUAGES = [
    { code: 'pt', name: 'Português', flag: '🇧🇷', region: 'América Latina' },
    { code: 'en', name: 'English', flag: '🇺🇸', region: 'Global' },
    { code: 'es', name: 'Español', flag: '🇪🇸', region: 'América Latina / Europa' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'Europe / Afrique' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Europa' },
    // ARABIC REMOVED AS REQUESTED
    { code: 'zh', name: '中文', flag: '🇨🇳', region: '亚洲' }
  ];

  // Resto do código permanece igual...
  // Apenas certifique-se de que a função applyTranslations lide com as novas chaves.
  // O código original já suporta 'getNestedValue', então vai funcionar.
  
  // ... (Mantenha o resto da lógica do seu i18n.js original)
})();
