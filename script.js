/* ==========================================================================
   Khush Maheshwari — Portfolio Interactions (v2 Live Visual Edition)
   - Live 60fps simulated eFX multi-LP microstructure convergence feed
   - Interactive FX pair switcher (EUR/USD, USD/JPY, GBP/USD)
   - Scroll reading progress bar & active navbar scroll-spy
   - Animated Nomura model-progression bars & metric count-ups
   - Project filtering, CS781 benchmark drawer, OBELIX YouTube demo modal
   - Theme persistence & one-click copy email toast
   ========================================================================== */

(() => {
  const root = document.documentElement;

  /* ---------- Theme Toggle ---------- */
  const savedTheme = localStorage.getItem('km-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.setAttribute('data-theme', savedTheme);
  }

  const themeBtn = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('iconSun');
  const moonIcon = document.getElementById('iconMoon');

  function syncThemeIcons() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (sunIcon && moonIcon) {
      sunIcon.style.display = isDark ? 'block' : 'none';
      moonIcon.style.display = isDark ? 'none' : 'block';
    }
  }
  syncThemeIcons();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('km-theme', next);
      syncThemeIcons();
    });
  }

  /* ---------- Mobile Nav ---------- */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ---------- Reading Progress Bar & Active Scroll-Spy ---------- */
  const progressBar = document.getElementById('scrollProgress');
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function onScroll() {
    if (progressBar) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      progressBar.style.width = `${pct}%`;
    }
    const marker = window.scrollY + 130;
    let activeId = '';
    for (const sec of sections) {
      if (sec.offsetTop <= marker) activeId = sec.id;
    }
    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${activeId}`);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Project Filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      projectCards.forEach((card) => {
        const cats = (card.dataset.category || '').split(' ');
        const show = cat === 'all' || cats.includes(cat);
        card.classList.toggle('hidden', !show);
      });
    });
  });

  /* ---------- Expandable CS781 7-Phase Benchmark Drawer ---------- */
  const drawerBtn = document.getElementById('cs781DrawerBtn');
  const drawerBody = document.getElementById('cs781Drawer');
  if (drawerBtn && drawerBody) {
    drawerBtn.addEventListener('click', () => {
      const open = drawerBody.classList.toggle('open');
      drawerBtn.setAttribute('aria-expanded', String(open));
      drawerBtn.textContent = open
        ? 'Hide 7-Phase Benchmark Table ↑'
        : 'View 7-Phase Benchmark Table ↓';
    });
  }

  /* ---------- OBELIX YouTube Demo Modal ---------- */
  const modal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const videoFrame = document.getElementById('videoFrame');
  const YT_EMBED = 'https://www.youtube.com/embed/8aFcyrNMf4U?start=77&autoplay=1&rel=0';

  function openModal() {
    if (!modal || !videoFrame) return;
    videoFrame.src = YT_EMBED;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal || !videoFrame) return;
    modal.classList.remove('open');
    videoFrame.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-obelix-demo]').forEach((el) => {
    el.addEventListener('click', openModal);
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Copy Email Toast ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.querySelectorAll('[data-copy-email]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard
        .writeText('khushmahes23@iitk.ac.in')
        .then(() => showToast('Copied khushmahes23@iitk.ac.in'))
        .catch(() => {
          window.location.href = 'mailto:khushmahes23@iitk.ac.in';
        });
    });
  });

  /* ---------- Scroll Reveal & Animated Model Progression Bars ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-ready');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '120px 0px' }
    );
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120) {
        el.classList.add('visible');
      } else {
        io.observe(el);
      }
    });

    // Animate Nomura accuracy progression bars
    const barBox = document.getElementById('expChartBox');
    if (barBox) {
      const fillBars = () => {
        barBox.querySelectorAll('.bar-fill[data-width]').forEach((bar) => {
          bar.style.width = bar.dataset.width;
        });
      };
      if (barBox.getBoundingClientRect().top < window.innerHeight + 120) {
        requestAnimationFrame(fillBars);
      } else {
        const barIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                fillBars();
                barIo.unobserve(barBox);
              }
            });
          },
          { threshold: 0.05, rootMargin: '80px 0px' }
        );
        barIo.observe(barBox);
      }
    }
  } else {
    document.querySelectorAll('.bar-fill[data-width]').forEach((bar) => {
      bar.style.width = bar.dataset.width;
    });
  }

  /* ---------- Live Interactive eFX Microstructure Feed (Hero Card) ---------- */
  const fxCanvas = document.getElementById('fxCanvas');
  const fxMidEl = document.getElementById('fxMid');
  const fxSkewEl = document.getElementById('fxSkew');
  const fxConsEl = document.getElementById('fxConsensus');
  const fxActionEl = document.getElementById('fxAction');
  const fxPillEl = document.getElementById('fxSignalPill');

  const PAIRS = {
    EURUSD: { base: 1.0842, vol: 0.00024, decimals: 5, pip: 10000, speed: 0.036 },
    USDJPY: { base: 154.38, vol: 0.022, decimals: 3, pip: 100, speed: 0.044 },
    GBPUSD: { base: 1.2674, vol: 0.00031, decimals: 5, pip: 10000, speed: 0.04 },
  };
  let activePair = 'EURUSD';
  let phase = 0;
  const N = 96;
  const midSeries = [];
  const lpLeadSeries = [];

  function seedSeries() {
    midSeries.length = 0;
    lpLeadSeries.length = 0;
    const cfg = PAIRS[activePair];
    for (let i = 0; i < N; i++) {
      const t = i * 0.09;
      const trend = Math.sin(t * 0.72) * 0.55 + Math.cos(t * 1.45) * 0.25;
      const lpAhead = Math.sin((t + 0.42) * 0.72) * 0.58 + Math.cos((t + 0.42) * 1.45) * 0.28;
      midSeries.push(cfg.base + trend * cfg.vol * 5.2);
      lpLeadSeries.push(cfg.base + lpAhead * cfg.vol * 5.2);
    }
    phase = N * 0.09;
  }
  seedSeries();

  document.querySelectorAll('.fx-pair-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activePair = btn.dataset.pair;
      document.querySelectorAll('.fx-pair-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      seedSeries();
    });
  });

  let tickCounter = 0;
  function stepFeed() {
    const cfg = PAIRS[activePair];
    phase += cfg.speed;
    const noise = (Math.sin(phase * 7.3) + Math.cos(phase * 11.1)) * 0.06;
    const trend = Math.sin(phase * 0.72) * 0.55 + Math.cos(phase * 1.45) * 0.25 + noise * 0.35;
    const lpAhead =
      Math.sin((phase + 0.46) * 0.72) * 0.58 +
      Math.cos((phase + 0.46) * 1.45) * 0.28 +
      noise * 0.65;

    midSeries.shift();
    lpLeadSeries.shift();
    midSeries.push(cfg.base + trend * cfg.vol * 5.2);
    lpLeadSeries.push(cfg.base + lpAhead * cfg.vol * 5.2);

    const lastMid = midSeries[N - 1];
    const lastLp = lpLeadSeries[N - 1];
    const z = ((lastLp - lastMid) / (cfg.vol * 1.15));

    if (tickCounter % 6 === 0) {
      if (fxMidEl) fxMidEl.textContent = lastMid.toFixed(cfg.decimals);
      if (fxSkewEl) {
        const sign = z >= 0 ? '+' : '';
        fxSkewEl.textContent = `${sign}${z.toFixed(2)}σ`;
        fxSkewEl.className = `fx-tel-val ${Math.abs(z) > 1.15 ? 'pos' : ''}`;
      }
      if (fxConsEl) {
        const consensus = Math.min(6, Math.max(2, Math.round(3.5 + Math.abs(z) * 1.3)));
        fxConsEl.textContent = `${consensus} / 6 LPs`;
      }
      const strong = Math.abs(z) > 1.1;
      if (fxActionEl) {
        fxActionEl.textContent = strong ? (z > 0 ? 'THROTTLE (HOLD)' : 'HEDGE NOW') : 'MONITOR';
        fxActionEl.className = `fx-tel-val ${strong ? 'pos' : ''}`;
      }
      if (fxPillEl) {
        fxPillEl.textContent = strong ? 'HIGH CONVICTION' : 'CONVERGING';
        fxPillEl.className = `fx-signal-pill ${strong ? '' : 'neutral'}`;
      }
    }
    tickCounter++;
  }

  function renderFxCanvas() {
    if (!fxCanvas) return;
    const ctx = fxCanvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = fxCanvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    if (fxCanvas.width !== Math.round(rect.width * dpr) || fxCanvas.height !== Math.round(rect.height * dpr)) {
      fxCanvas.width = Math.round(rect.width * dpr);
      fxCanvas.height = Math.round(rect.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Subtle horizontal grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const all = midSeries.concat(lpLeadSeries);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const span = max - min || 1e-6;
    const padY = 22;

    const toX = (i) => (i / (N - 1)) * (w - 14) + 7;
    const toY = (v) => h - padY - ((v - min) / span) * (h - padY * 2);

    // Fill subtle gradient under LP Lead curve
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(52, 211, 153, 0.16)');
    grad.addColorStop(1, 'rgba(52, 211, 153, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const x = toX(i);
      const y = toY(lpLeadSeries[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(toX(N - 1), h);
    ctx.lineTo(toX(0), h);
    ctx.closePath();
    ctx.fill();

    // LP Composite Lead Line (emerald)
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const x = toX(i);
      const y = toY(lpLeadSeries[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Market Mid Line (cobalt dashed)
    ctx.strokeStyle = '#7DA2FF';
    ctx.lineWidth = 1.7;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const x = toX(i);
      const y = toY(midSeries[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Live tick indicator dot on right tip
    const lx = toX(N - 1);
    const ly = toY(lpLeadSeries[N - 1]);
    ctx.fillStyle = 'rgba(52, 211, 153, 0.25)';
    ctx.beginPath();
    ctx.arc(lx, ly, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(lx, ly, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  let frame = 0;
  function animate() {
    frame++;
    if (frame % 3 === 0) stepFeed();
    renderFxCanvas();
    requestAnimationFrame(animate);
  }
  renderFxCanvas();
  requestAnimationFrame(animate);
})();
