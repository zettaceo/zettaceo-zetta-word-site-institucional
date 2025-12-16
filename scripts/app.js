(function () {
  'use strict';
  
  // ... (Mantenha o código do Particle Network igual)

  // CORREÇÃO DO SOLAR SYSTEM
  function initSolarSystem() {
    var modules = {
      orbit1: [
        { link: '#blockchain', name: 'Blockchain', icon: '⬡' },
        { link: '#obelisk', name: 'Wallet', icon: '🔋' },
        { link: '#zbanck', name: 'Z-BANK', icon: '🏦' }, // CORRIGIDO Z-BANK
        { link: '#ecosystem', name: 'Launchpad', icon: '⬢' },
        { link: '#zion', name: 'Zion IA', icon: '🧠' }
      ],
      // ... mantenha as outras órbitas
    };
    // ... resto da função igual
  }

  document.addEventListener('DOMContentLoaded', function () {
    // ... inits
    initSolarSystem();
    // ...
  });
})();
