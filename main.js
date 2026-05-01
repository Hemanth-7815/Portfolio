/* ============================================================
   HEMANTH KUMAR — PORTFOLIO MAIN JS
   ============================================================ */

/* ---------- CURSOR ---------- */
const cursorGlow = document.getElementById('cursor-glow');
const cursorDot  = document.getElementById('cursor-dot');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

(function animateCursor() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorDot.style.background = 'var(--secondary)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorDot.style.background = 'var(--primary)';
  });
});

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.8s ease';
    setTimeout(() => { loader.style.display = 'none'; startHeroAnimations(); }, 800);
  }, 2200);
});

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Active nav link
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
});

/* ---------- HAMBURGER ---------- */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinksEl.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ---------- HERO CANVAS (Three.js particle field) ---------- */
function initHeroCanvas() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Particles
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0x6c63ff, size: 0.04, transparent: true, opacity: 0.7 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Grid lines
  const gridMat = new THREE.LineBasicMaterial({ color: 0x1a1a4e, transparent: true, opacity: 0.4 });
  for (let i = -10; i <= 10; i++) {
    const hGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-10, i, -5), new THREE.Vector3(10, i, -5)]);
    const vGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(i, -10, -5), new THREE.Vector3(i, 10, -5)]);
    scene.add(new THREE.Line(hGeo, gridMat));
    scene.add(new THREE.Line(vGeo, gridMat));
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    my = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    particles.rotation.y = t * 0.1;
    particles.rotation.x = t * 0.05;
    camera.position.x += (mx - camera.position.x) * 0.03;
    camera.position.y += (-my - camera.position.y) * 0.03;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
}

/* ---------- TYPING EFFECT ---------- */
function initTyping() {
  const texts = ['Aspiring Data Analyst', 'AI Student', 'Power BI Developer', 'Data Storyteller'];
  const el = document.getElementById('typed-text');
  if (!el) return;
  let ti = 0, ci = 0, deleting = false;
  setInterval(() => {
    const full = texts[ti];
    if (!deleting) {
      el.textContent = full.slice(0, ++ci);
      if (ci === full.length) { deleting = true; setTimeout(() => {}, 1500); }
    } else {
      el.textContent = full.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
  }, deleting ? 60 : 110);
}

/* ---------- HERO ANIMATIONS (after load) ---------- */
function startHeroAnimations() {
  initHeroCanvas();
  initTyping();

  // Reveal hero elements
  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, i * 200);
  });

  // Counter animation
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 50;
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(interval);
    }, 40);
  });
}

/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Animate skill bars
      entry.target.querySelectorAll('.skill-bar[data-width]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 300);
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.glass-card, .skill-card, .contact-card, .timeline-item, .project-showcase').forEach(el => {
  el.classList.add('reveal-up');
  revealObserver.observe(el);
});

/* ---------- SKILL CARDS 3D TILT ---------- */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const inner = card.querySelector('.skill-card-inner');
    inner.style.transform = `rotateY(${x / 10}deg) rotateX(${-y / 10}deg) scale(1.04)`;
    inner.style.boxShadow = `${-x / 8}px ${-y / 8}px 40px rgba(108,99,255,0.3)`;
  });
  card.addEventListener('mouseleave', e => {
    const inner = card.querySelector('.skill-card-inner');
    inner.style.transform = '';
    inner.style.boxShadow = '';
  });
});

/* ---------- KPI COUNTERS (project section) ---------- */
const kpiObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.kpi-value.counter[data-target], .screen-kpi-value.counter[data-target]').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const isFloat = target % 1 !== 0;
      let current = 0;
      const steps = 60;
      const step = target / steps;
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
        if (current >= target) clearInterval(iv);
      }, 30);
    });
    kpiObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const dashboard = document.querySelector('.dashboard-preview');
if (dashboard) kpiObserver.observe(dashboard);

/* ---------- PARALLAX HERO ---------- */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
    heroContent.style.opacity = 1 - scrolled / window.innerHeight * 1.2;
  }
});

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------- BACKGROUND GLOW ORBS ---------- */
function createOrbs() {
  const body = document.body;
  const colors = ['rgba(108,99,255,0.06)', 'rgba(0,212,255,0.04)', 'rgba(255,107,157,0.04)'];
  colors.forEach((color, i) => {
    const orb = document.createElement('div');
    orb.style.cssText = `
      position:fixed;
      width:${500 + i * 200}px;
      height:${500 + i * 200}px;
      border-radius:50%;
      background:radial-gradient(circle,${color},transparent 70%);
      pointer-events:none;
      z-index:0;
      top:${[10, 50, 70][i]}%;
      left:${[80, -10, 60][i]}%;
      transform:translate(-50%,-50%);
      animation:floatOrb${i} ${12 + i * 4}s ease-in-out infinite;
    `;
    body.appendChild(orb);
  });
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatOrb0{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.15) translateY(-30px);}}
    @keyframes floatOrb1{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(1.2) translateY(20px);}}
    @keyframes floatOrb2{0%,100%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(0.9) translateY(-20px);}}
  `;
  document.head.appendChild(style);
}
createOrbs();

/* ---------- PARTICLES (hero section dots) ---------- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = 4 + Math.random() * 8;
    const delay = Math.random() * 5;
    const colors = ['#6c63ff', '#00d4ff', '#ff6b9d'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      border-radius:50%;
      background:${color};
      left:${x}%;top:${y}%;
      opacity:${Math.random() * 0.6 + 0.1};
      box-shadow:0 0 ${size * 3}px ${color};
      animation:particleFloat ${dur}s ${delay}s ease-in-out infinite alternate;
    `;
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes particleFloat{from{transform:translateY(0) scale(1);}to{transform:translateY(-30px) scale(1.2);}}`;
  document.head.appendChild(style);
}
createParticles();

/* ---------- SECTION BG ACCENT LINES ---------- */
function addBgAccents() {
  document.querySelectorAll('.section').forEach((sec, i) => {
    if (i % 2 === 0) {
      sec.style.background = 'rgba(108,99,255,0.015)';
    }
  });
}
addBgAccents();

/* ---------- INIT ON DOM READY ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Pre-set skill bars to animate on scroll
  document.querySelectorAll('.skill-bar[data-width]').forEach(bar => {
    bar.style.width = '0%';
  });
});
