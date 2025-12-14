(function () {
  'use strict';

  // ========== PARTICLE NETWORK + SHOOTING STARS ==========
  function initParticleNetwork() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let shootingStars = [];
    let mouse = { x: null, y: null, radius: 150 };
    let animationId;
    let lastShootingStar = 0;
    
    // Configuration
    const config = {
      particleCount: 100,
      particleMinSize: 1,
      particleMaxSize: 2.5,
      particleSpeed: 0.3,
      lineDistance: 120,
      lineWidth: 0.5,
      mouseInteraction: true,
      mouseRepelForce: 0.02,
      shootingStarInterval: 5000,
      colors: {
        particle: ['rgba(0, 212, 255, 0.6)', 'rgba(0, 102, 255, 0.5)', 'rgba(255, 255, 255, 0.3)'],
        shootingStar: '#ffffff'
      }
    };
    
    // Particle class
    class Particle {
      constructor(layer) {
        this.layer = layer || Math.floor(Math.random() * 3);
        this.depthFactor = 1 - (this.layer * 0.25);
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = (config.particleMinSize + Math.random() * (config.particleMaxSize - config.particleMinSize)) * this.depthFactor;
        this.speedX = (Math.random() - 0.5) * config.particleSpeed * this.depthFactor;
        this.speedY = (Math.random() - 0.5) * config.particleSpeed * this.depthFactor;
        this.color = config.colors.particle[this.layer % config.colors.particle.length];
        this.density = Math.random() * 30 + 1;
      }
      
      update() {
        if (config.mouseInteraction && mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * this.density * config.mouseRepelForce;
            this.y -= (dy / distance) * force * this.density * config.mouseRepelForce;
          }
        }
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
          gradient.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
          gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
    }
    
    // Shooting Star class - com cauda longa e visível
    class ShootingStar {
      constructor() {
        this.reset();
      }
      
      reset() {
        // Start from top or right edge
        if (Math.random() > 0.5) {
          this.x = Math.random() * width;
          this.y = -10;
        } else {
          this.x = width + 10;
          this.y = Math.random() * height * 0.4;
        }
        this.speed = 15 + Math.random() * 10;
        this.angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.3;
        this.opacity = 1;
        this.trail = [];
        this.tailLength = 50; // Número de pontos na cauda
        this.active = true;
      }
      
      update() {
        // Adicionar posição atual à cauda
        this.trail.unshift({ x: this.x, y: this.y, opacity: this.opacity });
        if (this.trail.length > this.tailLength) this.trail.pop();
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // Fade out conforme viaja
        this.opacity -= 0.006;
        
        if (this.x < -100 || this.y > height + 100 || this.opacity <= 0) {
          this.active = false;
        }
      }
      
      draw() {
        // Desenhar a cauda longa e brilhante
        if (this.trail.length > 1) {
          // Cauda principal - linha gradiente
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          
          for (let i = 0; i < this.trail.length; i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }
          
          // Gradiente da cauda
          const lastPoint = this.trail[this.trail.length - 1] || { x: this.x, y: this.y };
          const tailGradient = ctx.createLinearGradient(this.x, this.y, lastPoint.x, lastPoint.y);
          tailGradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.9})`);
          tailGradient.addColorStop(0.3, `rgba(200, 220, 255, ${this.opacity * 0.5})`);
          tailGradient.addColorStop(0.6, `rgba(150, 180, 255, ${this.opacity * 0.2})`);
          tailGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
          
          ctx.strokeStyle = tailGradient;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();
          
          // Segunda camada de cauda mais fina e brilhante
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          for (let i = 0; i < Math.min(this.trail.length, 25); i++) {
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.6})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Partículas de brilho ao longo da cauda
        for (let i = 0; i < this.trail.length; i += 3) {
          const t = this.trail[i];
          const alpha = (1 - i / this.trail.length) * t.opacity * 0.4;
          const size = (1 - i / this.trail.length) * 1.5;
          
          ctx.beginPath();
          ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
        
        // Cabeça com glow forte
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 12);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.2, `rgba(220, 240, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(150, 200, 255, ${this.opacity * 0.4})`);
        gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Núcleo brilhante
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }
    
    function createParticles() {
      particles = [];
      const adjustedCount = Math.floor(config.particleCount * (width / 1920));
      const count = Math.max(30, Math.min(adjustedCount, config.particleCount));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    
    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (Math.abs(particles[i].layer - particles[j].layer) <= 1 && distance < config.lineDistance) {
            const opacity = (1 - distance / config.lineDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
            ctx.lineWidth = config.lineWidth;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    function spawnShootingStar() {
      shootingStars.push(new ShootingStar());
    }
    
    function animate() {
      const now = Date.now();
      ctx.clearRect(0, 0, width, height);
      
      // Spawn shooting stars every 5 seconds
      if (now - lastShootingStar > config.shootingStarInterval) {
        spawnShootingStar();
        lastShootingStar = now;
      }
      
      // Update and draw particles
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      
      // Update and draw shooting stars
      shootingStars = shootingStars.filter(s => s.active);
      shootingStars.forEach(s => { s.update(); s.draw(); });
      
      animationId = requestAnimationFrame(animate);
    }
    
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    }
    
    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    
    function handleMouseLeave() {
      mouse.x = null;
      mouse.y = null;
    }
    
    resize();
    lastShootingStar = Date.now();
    
    window.addEventListener('resize', function() {
      clearTimeout(window.particleResizeTimeout);
      window.particleResizeTimeout = setTimeout(resize, 200);
    });
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    animate();
    
    return function cleanup() {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }

  const TOKEN = {
    address: '0x8aacc38933007ec530c552007e210b4667749df1',
    symbol: 'Z',
    decimals: 18,
    image: window.location.origin + '/assets/icons/icon-wallet.svg',
    chainId: '0x38',
    chainName: 'Binance Smart Chain'
  };

  let isAddingToken = false;

  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    const links = nav.querySelectorAll('.nav-link');

    toggle.addEventListener('click', function () {
      const isActive = nav.classList.toggle('active');
      toggle.classList.toggle('active', isActive);
      toggle.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      if (isActive && links.length > 0) {
        links[0].focus();
      } else {
        toggle.focus();
      }
    });

    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    nav.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('active')) return;
      if (e.key !== 'Tab') return;
      
      const focusableLinks = Array.from(links);
      const first = focusableLinks[0];
      const last = focusableLinks[focusableLinks.length - 1];
      
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  function initSmoothScroll() {
    document.addEventListener('click', function (ev) {
      const a = ev.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        ev.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    }, { passive: false });
  }

  function initScrollReveal() {
    const nodes = document.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px' });
    nodes.forEach(function (n) { io.observe(n); });
  }

  async function addTokenToMetaMask() {
    if (isAddingToken) return { added: false, reason: 'already_adding' };
    
    var btn = document.getElementById('btn-add-token');
    var originalText = btn ? btn.innerHTML : '';
    
    isAddingToken = true;
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      btn.innerHTML = '<span>Adicionando...</span>';
    }
    
    try {
      if (!window.ethereum) {
        alert('MetaMask não encontrado. Instale a extensão MetaMask e tente novamente.');
        return { added: false, reason: 'no_provider' };
      }

      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== TOKEN.chainId) {
          alert('Por favor, troque para a rede ' + TOKEN.chainName + ' na MetaMask antes de adicionar o token.');
          return { added: false, reason: 'wrong_network' };
        }
      } catch (networkErr) {
        console.warn('Não foi possível verificar a rede:', networkErr);
      }

      var params = {
        type: 'ERC20',
        options: {
          address: TOKEN.address,
          symbol: TOKEN.symbol,
          decimals: TOKEN.decimals,
          image: TOKEN.image
        }
      };
      
      try {
        var wasAdded = await window.ethereum.request({ method: 'wallet_watchAsset', params: params });
        if (wasAdded) {
          alert('Token Z adicionado à sua MetaMask com sucesso.');
        } else {
          alert('Operação cancelada. Token não adicionado.');
        }
        return { added: wasAdded };
      } catch (err) {
        alert('Ocorreu um erro ao tentar adicionar o token. Verifique a extensão MetaMask.');
        return { added: false, error: err };
      }
    } finally {
      isAddingToken = false;
      if (btn) {
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
        btn.innerHTML = originalText;
      }
    }
  }

  function setupAddTokenButton() {
    var btn = document.getElementById('btn-add-token');
    if (!btn) return;
    btn.addEventListener('click', function () {
      addTokenToMetaMask().catch(function () {});
    });
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function initSolarSystem() {
    var modules = {
      orbit1: [
        { link: '#blockchain', name: 'Blockchain ZETTA', icon: '⬡' },
        { link: '#obelisk', name: 'Obelisk-Z Wallet', icon: '🔋' },
        { link: '#zbanck', name: 'Z-BANK', icon: '▬' },
        { link: '#ecosystem', name: 'ZETTA Launchpad', icon: '⬢' },
        { link: '#zion', name: 'Zion IA', icon: '◉' }
      ],
      orbit2: [
        { link: '#ecosystem', name: 'ZETTA Pay', icon: '💳' },
        { link: '#ecosystem', name: 'ZETTA Bridge', icon: '⊕' },
        { link: '#ecosystem', name: 'ZETTA Swap', icon: '∞' },
        { link: '#ecosystem', name: 'ZETTA Earn', icon: '📈' },
        { link: '#ecosystem', name: 'ZETTA ID', icon: '👤' },
        { link: '#ecosystem', name: 'ZETTA Passport', icon: '🔖' },
        { link: '#security', name: 'ZETTA Verify', icon: '✓' }
      ],
      orbit3: [
        { link: '#ecosystem', name: 'ZETTA Labs', icon: '🏠' },
        { link: '#ecosystem', name: 'ZETTA Academy', icon: '💬' },
        { link: '#ecosystem', name: 'ZETTA Cloud', icon: '☁' },
        { link: '#ecosystem', name: 'ZETTA Terminal', icon: '💻' },
        { link: '#investors', name: 'ZETTA Market', icon: '▦' }
      ]
    };

    function getOrbitRadius(orbitEl) {
      if (!orbitEl) return 0;
      var rect = orbitEl.getBoundingClientRect();
      return rect.width / 2;
    }

    function positionPlanets() {
      var orbits = [
        { el: document.querySelector('.orbit-1'), mods: modules.orbit1 },
        { el: document.querySelector('.orbit-2'), mods: modules.orbit2 },
        { el: document.querySelector('.orbit-3'), mods: modules.orbit3 }
      ];

      orbits.forEach(function(orbit) {
        if (!orbit.el) return;
        var planets = orbit.el.querySelectorAll('.planet');
        var radius = getOrbitRadius(orbit.el);
        planets.forEach(function(planet, i) {
          var angle = (360 / orbit.mods.length) * i;
          var radian = (angle * Math.PI) / 180;
          var x = Math.cos(radian) * radius;
          var y = Math.sin(radian) * radius;
          planet.style.left = 'calc(50% + ' + x + 'px)';
          planet.style.top = 'calc(50% + ' + y + 'px)';
        });
      });
    }

    function createPlanet(orbit, mod, angle, orbitNum) {
      if (!orbit) return;
      var planet = document.createElement('a');
      planet.className = 'planet';
      planet.href = mod.link;
      var radius = getOrbitRadius(orbit);
      var radian = (angle * Math.PI) / 180;
      var x = Math.cos(radian) * radius;
      var y = Math.sin(radian) * radius;
      planet.style.left = 'calc(50% + ' + x + 'px)';
      planet.style.top = 'calc(50% + ' + y + 'px)';
      planet.style.transform = 'translate(-50%, -50%)';
      planet.innerHTML = '<div class="planet-glow"></div><div class="planet-core"><span class="planet-icon">' + mod.icon + '</span></div><div class="planet-label">' + mod.name + '</div>';
      orbit.appendChild(planet);
    }

    var orbit1 = document.querySelector('.orbit-1');
    var orbit2 = document.querySelector('.orbit-2');
    var orbit3 = document.querySelector('.orbit-3');
    
    if (!orbit1 && !orbit2 && !orbit3) return;

    if (orbit1) {
      modules.orbit1.forEach(function(m, i) { createPlanet(orbit1, m, (360 / modules.orbit1.length) * i, 1); });
    }
    if (orbit2) {
      modules.orbit2.forEach(function(m, i) { createPlanet(orbit2, m, (360 / modules.orbit2.length) * i, 2); });
    }
    if (orbit3) {
      modules.orbit3.forEach(function(m, i) { createPlanet(orbit3, m, (360 / modules.orbit3.length) * i, 3); });
    }

    var resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(positionPlanets, 150);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    setupAddTokenButton();
    initYear();
    initSolarSystem();
    initParticleNetwork();
    window.Zetta = { token: TOKEN, addTokenToMetaMask: addTokenToMetaMask };
  });

})();
