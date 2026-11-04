/**
 * <KM/> | PortFolio — Interactive Background & Fixed Navbar Controller
 * Combines:
 *  1) Fixed Navbar smooth section scrolling & Mobile-First hamburger menu
 *  2) Cyberpunk HUD circuits, PCB right-angle traces & glowing nodes with deep shadows
 *  3) 1930s Cuphead / Rubber Hose classic cartoon animation (pie-cut eyes, bouncy rubber-hose cables,
 *     rotating vintage gears & 4-point cartoon twinkle stars)
 *  4) Interactive with mouse on PC + touch/auto-orbit on Mobile-First devices
 */

(function () {
  // =========================================================================
  // 0. MINI-ANIMACIÓN DE ENTRADA PERSONALIZADA (PRIORIDAD A LA PRESENTACIÓN)
  // =========================================================================
  const introSplash = document.getElementById('intro-splash');
  const navWrapper = document.getElementById('navbar-wrapper');
  const heroCard = document.querySelector('.hero-card');
  const progressFill = document.getElementById('intro-progress-fill');
  const progressHead = document.querySelector('.intro-progress-glow-head');
  const statusPct = document.getElementById('intro-status-pct');

  if (introSplash) {
    document.body.classList.add('splash-active');
    const duration = 1400; // 1.4 segundos de mini animación
    const startTime = performance.now();
    let closed = false;

    function step(now) {
      if (closed) return;
      const elapsed = now - startTime;
      const progress = Math.min(100, Math.round((elapsed / duration) * 100));
      if (progressFill) progressFill.style.width = progress + '%';
      if (progressHead) progressHead.style.left = progress + '%';
      if (statusPct) statusPct.textContent = progress + '%';

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        closeSplash();
      }
    }

    requestAnimationFrame(step);

    // Permite salir de inmediato con clic o toque en cualquier parte
    introSplash.addEventListener('click', closeSplash, { once: true });
    introSplash.addEventListener('touchstart', closeSplash, { passive: true, once: true });

    function closeSplash() {
      if (closed) return;
      closed = true;
      if (progressFill) progressFill.style.width = '100%';
      if (progressHead) progressHead.style.left = '100%';
      if (statusPct) statusPct.textContent = '100%';

      introSplash.classList.add('splash-closing');
      document.body.classList.remove('splash-active');

      // 1) Dar prioridad inmediata a la presentación (Hero Spotlight)
      if (heroCard) {
        heroCard.classList.add('hero-spotlight');
      }

      // 2) Revelar el navbar deslizándose suavemente desde arriba
      setTimeout(() => {
        if (navWrapper) {
          navWrapper.classList.remove('navbar-hidden');
        }
      }, 260);

      // 3) Quitar splash del flujo visual
      setTimeout(() => {
        introSplash.style.display = 'none';
      }, 500);
    }
  }

  // =========================================================================
  // 1. FIXED NAVBAR MOBILE MENU & EXACT SECTION SCROLLING
  // =========================================================================
  const menuBtn =
    document.getElementById('mobile-toggle') ||
    document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-item, .nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (menuBtn && navLinksContainer) {
    function closeMenu() {
      if (navLinksContainer.classList.contains('open')) {
        navLinksContainer.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinksContainer.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar menú al hacer clic en cualquier parte fuera de los enlaces y del botón
    document.addEventListener('click', (e) => {
      if (navLinksContainer.classList.contains('open')) {
        if (!navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Cerrar menú al presionar la tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }

  // Smooth exact scroll accounting for fixed navbar (78px height + margin)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          if (navLinksContainer && navLinksContainer.classList.contains('open')) {
            navLinksContainer.classList.remove('open');
            if (menuBtn) {
              menuBtn.classList.remove('open');
              menuBtn.setAttribute('aria-expanded', 'false');
            }
          }
          const navOffset = 96;
          const topPos =
            targetSection.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({
            top: Math.max(0, topPos),
            behavior: 'smooth',
          });
        }
      }
    });
  });

  // Update active nav item on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((l) => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // =========================================================================
  // 1.1 BOTONES DE COPIAR AL PORTAPAPELES (EMAIL Y WHATSAPP)
  // =========================================================================
  const copyButtons = document.querySelectorAll('.btn-copy');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHtml = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="copy-label">¡Copiado!</span>
        `;

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
      }
    });
  });

  // =========================================================================
  // 2. OUTER BLACK BACKGROUND: CYBERPUNK + 1930s CUPHEAD RUBBER HOSE CANVAS
  // =========================================================================
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let isMobile = width < 768;

  function applyShadow(color, blur, ox = 0, oy = 0) {
    if (!isMobile) {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.shadowOffsetX = ox;
      ctx.shadowOffsetY = oy;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  }

  const pointer = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    active: false,
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    isMobile = width < 768;
    initScene();
  });

  window.addEventListener(
    'mousemove',
    (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches && e.touches.length > 0) {
        pointer.targetX = e.touches[0].clientX;
        pointer.targetY = e.touches[0].clientY;
        pointer.active = true;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches.length > 0) {
        pointer.targetX = e.touches[0].clientX;
        pointer.targetY = e.touches[0].clientY;
        pointer.active = true;
        spawnBurst(pointer.targetX, pointer.targetY);
      }
    },
    { passive: true }
  );

  window.addEventListener('click', (e) => {
    spawnBurst(e.clientX, e.clientY);
  });

  const PALETTE = {
    orange: '#FFA500',
    red: '#780606',
    redBright: '#b01010',
    vintageCream: 'rgba(225, 205, 175, 0.25)',
  };

  let rubberEyes = [];
  let cyberCircuits = [];
  let vintageGears = [];
  let rubberHoseTubes = [];
  let burstSparks = [];
  let filmDust = [];

  function initScene() {
    const isMobile = width < 768;

    // 1. 1930s Cuphead Rubber-Hose Mascots / Pie-Cut Eyes in the outer margins
    rubberEyes = [];
    const eyePositions = isMobile
      ? [
          { xRatio: 0.1, yRatio: 0.2, radius: 22, phase: 0 },
          { xRatio: 0.9, yRatio: 0.2, radius: 22, phase: Math.PI },
          { xRatio: 0.1, yRatio: 0.54, radius: 20, phase: 1.6 },
          { xRatio: 0.9, yRatio: 0.54, radius: 20, phase: 4.5 },
          { xRatio: 0.1, yRatio: 0.86, radius: 22, phase: 2.8 },
          { xRatio: 0.9, yRatio: 0.86, radius: 22, phase: 5.4 },
        ]
      : [
          { xRatio: 0.08, yRatio: 0.22, radius: 34, phase: 0 },
          { xRatio: 0.92, yRatio: 0.22, radius: 34, phase: Math.PI },
          { xRatio: 0.07, yRatio: 0.54, radius: 30, phase: 1.4 },
          { xRatio: 0.93, yRatio: 0.54, radius: 30, phase: 4.5 },
          { xRatio: 0.08, yRatio: 0.85, radius: 34, phase: 2.6 },
          { xRatio: 0.92, yRatio: 0.85, radius: 34, phase: 5.2 },
        ];

    eyePositions.forEach((pos, idx) => {
      rubberEyes.push({
        baseX: pos.xRatio * width,
        baseY: pos.yRatio * height,
        r: pos.radius,
        phase: pos.phase,
        isOrange: idx % 2 === 0,
      });
    });

    // 2. Vintage 1930s + Cyberpunk Rotating Cogwheels / Gears with heavy shadows
    vintageGears = [
      { x: width * 0.05, y: height * 0.14, r: isMobile ? 46 : 84, teeth: 12, speed: 0.005, color: PALETTE.red },
      { x: width * 0.95, y: height * 0.14, r: isMobile ? 46 : 84, teeth: 12, speed: -0.005, color: PALETTE.red },
      { x: width * 0.05, y: height * 0.9, r: isMobile ? 52 : 90, teeth: 14, speed: -0.004, color: 'rgba(255,165,0,0.26)' },
      { x: width * 0.95, y: height * 0.9, r: isMobile ? 52 : 90, teeth: 14, speed: 0.004, color: 'rgba(255,165,0,0.26)' },
    ];

    // 3. Cyberpunk Circuit Nodes & Traces across the entire background
    cyberCircuits = [];
    const nodeCount = isMobile ? 18 : 36;
    for (let i = 0; i < nodeCount; i++) {
      cyberCircuits.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2.5 + 2,
        isOrange: i % 2 === 0,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // 4. Rubber-Hose Wavy Cables along left & right outer margins
    rubberHoseTubes = [
      { side: -1, xBase: isMobile ? 14 : 46, freq: 0.012, amp: isMobile ? 9 : 22 },
      { side: 1, xBase: width - (isMobile ? 14 : 46), freq: 0.012, amp: isMobile ? 9 : 22 },
    ];

    // 5. 1930s Vintage Film Dust & Cartoon Cross-Sparks
    filmDust = [];
    const dustCount = isMobile ? 16 : 30;
    for (let i = 0; i < dustCount; i++) {
      filmDust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.2 + 1,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.4 + 0.15,
        isStar: i % 2 === 0,
      });
    }
  }

  function spawnBurst(x, y) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = Math.random() * 3.4 + 1.5;
      burstSparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        isOrange: i % 2 === 0,
      });
    }
  }

  // Draw 1930s Cuphead-style Pie-Cut Eye with Rubber-Hose bouncy arm & deep shadow
  function drawRubberHoseEye(eye, time) {
    const bounceY = Math.sin(time * 3.2 + eye.phase) * 11;
    const squash = 1 + Math.sin(time * 6.4 + eye.phase) * 0.06;

    const dxMouse = pointer.x - eye.baseX;
    const dyMouse = pointer.y - (eye.baseY + bounceY);
    const dist = Math.hypot(dxMouse, dyMouse) || 1;
    const pull = Math.min(dist, 240) / 240;

    const cx = eye.baseX + (dxMouse / dist) * pull * 13;
    const cy = eye.baseY + bounceY + (dyMouse / dist) * pull * 13;

    ctx.save();
    applyShadow('rgba(0, 0, 0, 0.95)', 18, 5, 6);

    // Rubber-hose wavy tether cable connecting mascot to the screen edge
    const anchorX = eye.baseX < width / 2 ? 0 : width;
    const anchorY = eye.baseY + 35;
    const ctrlX = (anchorX + cx) / 2;
    const ctrlY = anchorY + Math.sin(time * 4 + eye.phase) * 28;

    ctx.beginPath();
    ctx.moveTo(anchorX, anchorY);
    ctx.quadraticCurveTo(ctrlX, ctrlY, cx, cy);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#09090d';
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = eye.isOrange ? 'rgba(255, 165, 0, 0.6)' : 'rgba(176, 16, 16, 0.75)';
    ctx.stroke();

    // Outer cartoon casing
    ctx.translate(cx, cy);
    ctx.scale(squash, 2 - squash);

    ctx.beginPath();
    ctx.arc(0, 0, eye.r, 0, Math.PI * 2);
    ctx.fillStyle = '#0e0b0e';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = eye.isOrange ? 'rgba(255, 165, 0, 0.75)' : '#960a0a';
    ctx.stroke();

    // Inner vintage sclera ring
    ctx.beginPath();
    ctx.arc(0, 0, eye.r * 0.76, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(28, 18, 16, 0.92)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.32)';
    ctx.stroke();

    // 1930s Pie-Cut Pupil looking toward the user's cursor / touch
    const lookAngle = Math.atan2(dyMouse, dxMouse);
    const pupilOffset = eye.r * 0.25;
    const px = Math.cos(lookAngle) * pupilOffset;
    const py = Math.sin(lookAngle) * pupilOffset;
    const pupilRadius = eye.r * 0.42;

    const pieOpen = 0.38;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(
      px,
      py,
      pupilRadius,
      lookAngle + pieOpen,
      lookAngle + Math.PI * 2 - pieOpen
    );
    ctx.closePath();
    ctx.fillStyle = eye.isOrange ? PALETTE.orange : '#cc1414';
    applyShadow(eye.isOrange ? 'rgba(255, 165, 0, 0.5)' : 'rgba(204, 20, 20, 0.65)', 10);
    ctx.fill();

    // Cyberpunk crosshair tick marks around the eye
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.35)';
    ctx.lineWidth = 1.5;
    for (let a = 0; a < 4; a++) {
      const ang = (Math.PI / 2) * a + time * 0.4;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * (eye.r + 3), Math.sin(ang) * (eye.r + 3));
      ctx.lineTo(Math.cos(ang) * (eye.r + 8), Math.sin(ang) * (eye.r + 8));
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Vintage 1930s + Industrial Cyberpunk Gear with deep drop shadow
  function drawGear(gear, time) {
    ctx.save();
    ctx.translate(gear.x, gear.y);
    ctx.rotate(time * 60 * gear.speed);

    applyShadow('rgba(0, 0, 0, 0.95)', 22, 6, 6);

    ctx.strokeStyle = gear.color;
    ctx.lineWidth = 2.5;

    const outerR = gear.r;
    const innerR = gear.r * 0.82;
    ctx.beginPath();
    for (let i = 0; i < gear.teeth * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / gear.teeth;
      const gx = Math.cos(angle) * r;
      const gy = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(10, 8, 12, 0.72)';
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, gear.r * 0.42, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.28)';
    ctx.stroke();

    ctx.restore();
  }

  // Draw Rubber-Hose Wavy Cartoon Cables with Neon Cyberpunk Pulse
  function drawRubberHoseCables(time) {
    rubberHoseTubes.forEach((tube) => {
      ctx.save();
      applyShadow('rgba(0, 0, 0, 0.95)', 16, tube.side === -1 ? 5 : -5, 4);

      ctx.beginPath();
      for (let y = 0; y <= height; y += 18) {
        const distY = Math.abs(y - pointer.y);
        const mouseWave = Math.max(0, 1 - distY / 220) * 18 * -tube.side;
        const x =
          tube.xBase +
          Math.sin(y * tube.freq + time * 2.5) * tube.amp +
          mouseWave;
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.lineWidth = 8;
      ctx.strokeStyle = '#0b090d';
      ctx.stroke();

      ctx.lineWidth = 2.4;
      ctx.strokeStyle =
        tube.side === -1 ? 'rgba(255, 165, 0, 0.42)' : 'rgba(176, 16, 16, 0.6)';
      ctx.stroke();

      for (let y = 90; y < height; y += 160) {
        const distY = Math.abs(y - pointer.y);
        const mouseWave = Math.max(0, 1 - distY / 220) * 18 * -tube.side;
        const x =
          tube.xBase +
          Math.sin(y * tube.freq + time * 2.5) * tube.amp +
          mouseWave;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#120d10';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = PALETTE.redBright;
        ctx.stroke();
      }

      ctx.restore();
    });
  }

  // Draw Cyberpunk Perspective Horizon Grid & Circuit Connections
  function drawCyberpunkBackdrop(time) {
    ctx.save();

    const grad = ctx.createRadialGradient(
      pointer.x,
      pointer.y,
      10,
      pointer.x,
      pointer.y,
      Math.max(width, height) * 0.46
    );
    grad.addColorStop(0, 'rgba(120, 6, 6, 0.24)');
    grad.addColorStop(0.45, 'rgba(255, 165, 0, 0.07)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // 1930s Cuphead rotating sunburst rays
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(time * 0.06);
    const rayCount = 18;
    const maxR = Math.hypot(width, height);
    for (let i = 0; i < rayCount; i++) {
      const a1 = (i * Math.PI * 2) / rayCount;
      const a2 = a1 + Math.PI / rayCount;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxR, a1, a2);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(120, 6, 6, 0.05)' : 'rgba(255, 165, 0, 0.02)';
      ctx.fill();
    }
    ctx.restore();

    applyShadow('rgba(0, 0, 0, 0.9)', 10);

    for (let i = 0; i < cyberCircuits.length; i++) {
      const n = cyberCircuits[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0) n.x = width;
      if (n.x > width) n.x = 0;
      if (n.y < 0) n.y = height;
      if (n.y > height) n.y = 0;

      for (let j = i + 1; j < cyberCircuits.length; j++) {
        const m = cyberCircuits[j];
        const dx = m.x - n.x;
        const dy = m.y - n.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 170) {
          const alpha = (1 - dist / 170) * 0.32;
          ctx.strokeStyle = n.isOrange
            ? `rgba(255, 165, 0, ${alpha})`
            : `rgba(176, 16, 16, ${alpha + 0.08})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      const dMouse = Math.hypot(pointer.x - n.x, pointer.y - n.y);
      if (dMouse < 195) {
        const mAlpha = (1 - dMouse / 195) * 0.48;
        ctx.strokeStyle = `rgba(255, 165, 0, ${mAlpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(pointer.x, n.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }

      const pulse = 1 + Math.sin(time * 3 + n.pulseOffset) * 0.25;
      ctx.fillStyle = n.isOrange ? 'rgba(255, 165, 0, 0.7)' : '#a80c0c';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawVintageFilmAndSparks(time) {
    ctx.save();
    filmDust.forEach((d) => {
      d.y += d.vy;
      if (d.y < -10) {
        d.y = height + 10;
        d.x = Math.random() * width;
      }

      if (d.isStar) {
        const twinkle = (Math.sin(time * 4 + d.x) + 1) * 0.5;
        const r = (d.r + 3.5) * (0.65 + twinkle * 0.5);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.fillStyle = `rgba(255, 165, 0, ${d.alpha * 0.85})`;
        applyShadow('rgba(0, 0, 0, 0.9)', 8);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = PALETTE.vintageCream;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    for (let i = burstSparks.length - 1; i >= 0; i--) {
      const s = burstSparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.03;
      if (s.life <= 0) {
        burstSparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = s.isOrange
        ? `rgba(255, 165, 0, ${s.life})`
        : `rgba(184, 20, 20, ${s.life})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 3.2 * s.life, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  initScene();

  let startTime = performance.now();
  let animationRunning = true;

  function animate(now) {
    if (!animationRunning) return;
    const time = (now - startTime) * 0.001;

    if (!pointer.active) {
      pointer.targetX = width / 2 + Math.cos(time * 0.85) * (width * 0.28);
      pointer.targetY = height / 2 + Math.sin(time * 1.15) * (height * 0.22);
    }

    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;

    ctx.clearRect(0, 0, width, height);

    drawCyberpunkBackdrop(time);
    vintageGears.forEach((g) => drawGear(g, time));
    drawRubberHoseCables(time);
    rubberEyes.forEach((eye) => drawRubberHoseEye(eye, time));
    drawVintageFilmAndSparks(time);

    requestAnimationFrame(animate);
  }

  // Pausar animación cuando la pestaña pasa a segundo plano para ahorrar batería
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      animationRunning = false;
    } else {
      if (!animationRunning) {
        animationRunning = true;
        startTime = performance.now();
        requestAnimationFrame(animate);
      }
    }
  });

  requestAnimationFrame(animate);
})();
