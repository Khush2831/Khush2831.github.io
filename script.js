/* ==========================================================================
   Khush Maheshwari — Portfolio Interactions
   - Theme persistence (Light-first editorial + Obsidian Dark)
   - Subtle eFX microstructure bid/ask convergence backdrop
   - Project category filtering
   - CS781 benchmark drawer & OBELIX YouTube demo modal
   - One-click email copy toast & scroll reveal
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
      drawHeroCanvas();
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
  const demoBtn = document.getElementById('obelixDemoBtn');
  const modal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const videoFrame = document.getElementById('videoFrame');
  const YT_EMBED = 'https://www.youtube.com/embed/8aFcyrNMf4U?start=77&autoplay=1&rel=0';

  function closeModal() {
    if (!modal || !videoFrame) return;
    modal.classList.remove('open');
    videoFrame.src = '';
    document.body.style.overflow = '';
  }

  if (demoBtn && modal && videoFrame) {
    demoBtn.addEventListener('click', () => {
      videoFrame.src = YT_EMBED;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
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
      navigator.clipboard.writeText('khushmahes23@iitk.ac.in').then(() => {
        showToast('Copied khushmahes23@iitk.ac.in');
      }).catch(() => {
        window.location.href = 'mailto:khushmahes23@iitk.ac.in';
      });
    });
  });

  /* ---------- Scroll Reveal ---------- */
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
  }

  /* ---------- Subtle FX Microstructure Convergence Backdrop ---------- */
  const canvas = document.getElementById('heroCanvas');
  function drawHeroCanvas() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;
    const styles = getComputedStyle(root);
    const colA = styles.getPropertyValue('--canvas-line-a').trim();
    const colB = styles.getPropertyValue('--canvas-line-b').trim();
    const colGrid = styles.getPropertyValue('--canvas-grid').trim();

    ctx.clearRect(0, 0, w, h);

    // Subtle vertical coordinate hairlines on the right side
    ctx.strokeStyle = colGrid;
    ctx.lineWidth = 1;
    for (let x = Math.floor(w * 0.45); x < w; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Two smooth lead-lag price / liquidity skew curves on the right half
    const startX = w * 0.42;
    const span = w - startX + 20;
    const baseY = h * 0.56;

    function curveY(t, phaseShift) {
      return (
        baseY -
        Math.sin(t * 2.8 + phaseShift) * (h * 0.16) -
        Math.cos(t * 6.2 + phaseShift * 1.3) * (h * 0.045) -
        t * (h * 0.14)
      );
    }

    ctx.lineWidth = 1.6;
    ctx.strokeStyle = colA;
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const t = i / 140;
      const x = startX + t * span;
      const y = curveY(t, 0.2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = colB;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const t = i / 140;
      const x = startX + t * span;
      const y = curveY(t, -0.08) + 8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  window.addEventListener('resize', drawHeroCanvas);
  drawHeroCanvas();
})();
