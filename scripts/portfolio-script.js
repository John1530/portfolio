// =====================
// AUTO UPDATE YEAR
// =====================
document.getElementById('year').textContent = new Date().getFullYear();


// =====================
// BACKGROUND ANIMATION
// Stars + Aircraft + Mouse Interaction + Light/Dark
// =====================
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const mouse = { x: -999, y: -999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function getAccent() {
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? '2, 132, 199'
      : '56, 189, 248';
  }

  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.2,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.6 + 0.2
  }));

  const planes = [
    { x: -40,  y: window.innerHeight * 0.25, speed: 0.7,  size: 1.1  },
    { x: -120, y: window.innerHeight * 0.6,  speed: 0.45, size: 0.65 },
    { x: window.innerWidth * 0.6, y: window.innerHeight * 0.15, speed: 0.55, size: 0.8 },
  ];

  function drawPlane(x, y, size, accent) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.strokeStyle = `rgba(${accent},0.6)`;
    ctx.fillStyle   = `rgba(${accent},0.1)`;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(22, 0); ctx.lineTo(-10, -5); ctx.lineTo(-10, 5); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -5); ctx.lineTo(-8, -16); ctx.lineTo(-15, -16); ctx.lineTo(-8, -5);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 5); ctx.lineTo(-8, 16); ctx.lineTo(-15, 16); ctx.lineTo(-8, 5);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-8, -2); ctx.lineTo(-15, -6); ctx.lineTo(-15, 6); ctx.lineTo(-8, 2);
    ctx.fill(); ctx.stroke();
    ctx.restore();
  }

  function animate() {
    const W = canvas.width;
    const H = canvas.height;
    const accent = getAccent();
    ctx.clearRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      const distToMouse = Math.hypot(s.x - mouse.x, s.y - mouse.y);
      const glowing = distToMouse < 120;
      const radius = glowing ? s.r * 2.5 : s.r;
      const alpha  = glowing ? 1 : s.alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accent},${alpha})`;
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const d = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
        const iNear = Math.hypot(stars[i].x - mouse.x, stars[i].y - mouse.y) < 120;
        const jNear = Math.hypot(stars[j].x - mouse.x, stars[j].y - mouse.y) < 120;
        const maxDist  = (iNear || jNear) ? 150 : 80;
        const maxAlpha = (iNear || jNear) ? 0.5 : 0.08;
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(${accent},${maxAlpha * (1 - d / maxDist)})`;
          ctx.lineWidth   = (iNear || jNear) ? 0.8 : 0.4;
          ctx.stroke();
        }
      }
    }

    // Aircraft
    planes.forEach(p => {
      p.x += p.speed;
      if (p.x > W + 60) { p.x = -60; p.y = Math.random() * H; }
      const trailLen = 60 * p.size;
      const grad = ctx.createLinearGradient(p.x - trailLen, 0, p.x, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, `rgba(${accent},${0.25 * p.size})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = p.size * 0.8;
      ctx.beginPath();
      ctx.moveTo(p.x - trailLen, p.y);
      ctx.lineTo(p.x - 18 * p.size, p.y);
      ctx.stroke();
      drawPlane(p.x, p.y, p.size, accent);
    });

    requestAnimationFrame(animate);
  }

  animate();
})();


// =====================
// HAMBURGER MENU
// =====================
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('mobileMenu').classList.toggle('open');
});


// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});


// =====================
// SKILL BAR ANIMATION
// =====================
const skillBars = document.querySelectorAll('.skill-bar-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const width = entry.target.getAttribute('data-width');
      entry.target.style.width = width + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));


// =====================
// SCROLL FADE-IN
// =====================
const sections = document.querySelectorAll('.section');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.05 });

sections.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(24px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(section);
});


// =====================
// NAVBAR SHRINK ON SCROLL
// =====================
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.style.padding = '0.6rem 3rem';
  } else {
    navbar.style.padding = '1rem 3rem';
  }
});


// =====================
// CONTACT FORM
// =====================
function sendMessage() {
  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const message  = document.getElementById('message').value.trim();
  const feedback = document.getElementById('form-feedback');

  if (!name || !email || !message) {
    feedback.style.color = '#f87171';
    feedback.textContent = 'Please fill in all fields before sending.';
    return;
  }

  if (!isValidEmail(email)) {
    feedback.style.color = '#f87171';
    feedback.textContent = 'Please enter a valid email address.';
    return;
  }

  const btn = document.getElementById('send-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    feedback.style.color = '#34d399';
    feedback.textContent = "✅ Message sent! I'll get back to you soon.";
    btn.textContent = 'Send message';
    btn.disabled = false;
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
  }, 1200);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}