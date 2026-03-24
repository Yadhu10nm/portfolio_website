/* ============================================================
   NEURAL NETWORK CANVAS BACKGROUND
   ============================================================ */
(function () {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');

  let nodes = [];
  const NODE_COUNT = 70;
  const MAX_DIST = 140;
  const COLORS = ['#38bdf8', '#a78bfa', '#22c55e'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      const hexColor = n.color;
      ctx.fillStyle = hexColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = hexColor;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  resize();
  initNodes();
  draw();
  window.addEventListener('resize', () => { resize(); initNodes(); });
})();


/* ============================================================
   TYPED TEXT EFFECT
   ============================================================ */
(function () {
  const phrases = [
    'Machine Learning Engineer',
    'Computer Vision Builder',
    'AI/ML Enthusiast',
    'BCA Student @ Surana College',
    'CodeX Club Leader'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typedEl = document.getElementById('typed');

  function type() {
    if (!typedEl) return;
    const current = phrases[phraseIdx];

    if (isDeleting) {
      charIdx--;
    } else {
      charIdx++;
    }

    typedEl.textContent = current.substring(0, charIdx);

    let speed = isDeleting ? 50 : 80;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 300;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 600);
})();


/* ============================================================
   NAVBAR — scroll behavior + active link
   ============================================================ */
(function () {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled style
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
})();


/* ============================================================
   HAMBURGER MENU
   ============================================================ */
(function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }
})();


/* ============================================================
   SCROLL REVEAL ANIMATION
   ============================================================ */
(function () {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
})();


/* ============================================================
   SKILL PROGRESS BARS — animate on scroll
   ============================================================ */
(function () {
  const bars = document.querySelectorAll('.bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.getAttribute('data-width');
        setTimeout(() => {
          target.style.width = width + '%';
        }, 200);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ============================================================
   CONTACT FORM HANDLER (no backend)
   ============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  const btn = e.target.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending...';

  setTimeout(() => {
    note.textContent = '✓ Message received! I will get back to you soon.';
    note.style.color = 'var(--green)';
    btn.innerHTML = '<i class="bi bi-check-circle"></i> Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    e.target.reset();

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-send-fill"></i> Send Message';
      btn.style.background = '';
      note.textContent = '';
    }, 4000);
  }, 1200);
}


/* ============================================================
   MOUSE PARALLAX ON HERO VISUAL
   ============================================================ */
(function () {
  const visual = document.querySelector('.hero-visual');
  if (!visual) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    visual.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
  });
})();
