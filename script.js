/* ═══════════════════════════════════════════════════
   EDITORIAL PORTFOLIO — JS
   Loader | Cursor | Reveals | Counters | Modal | Text Anim | Theme
═══════════════════════════════════════════════════ */

'use strict';

/* ─── 0. THEME TOGGLE ─── */
const themeBtns = [document.getElementById('themeToggleDesk'), document.getElementById('themeToggleMob')];
const moonIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
const sunIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="19.36" x2="19.78" y2="20.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
  document.body.classList.remove('dark-theme');
  themeBtns.forEach(btn => { if (btn) btn.innerHTML = sunIcon; });
}

themeBtns.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-theme');
    if (isLight) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      themeBtns.forEach(b => { if (b) b.innerHTML = moonIcon; });
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      themeBtns.forEach(b => { if (b) b.innerHTML = sunIcon; });
    }
  });
});

/* ─── 0.5 SNOWFALL ─── */
const initSnow = () => {
  const snowWrap = document.createElement('div');
  snowWrap.className = 'snow-wrap';
  document.body.appendChild(snowWrap);
  
  const flakeCount = window.innerWidth < 768 ? 30 : 70;
  for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.animationDuration = `${Math.random() * 6 + 4}s`;
    flake.style.animationDelay = `${Math.random() * 5}s`;
    
    // Set opacity via custom property so keyframes can use it
    const op = Math.random() * 0.5 + 0.1;
    flake.style.setProperty('--o', op);
    
    const size = Math.random() * 3 + 1;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    snowWrap.appendChild(flake);
  }
};
initSnow();

/* ─── 1. LOADER & INITIAL REVEALS ─── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const pct    = document.getElementById('loaderPct');
  let p = 0;
  
  const int = setInterval(() => {
    p += Math.floor(Math.random() * 15) + 5;
    if (p >= 100) {
      p = 100;
      clearInterval(int);
      if (pct) pct.textContent = p;
      setTimeout(() => {
        if (loader) loader.classList.add('hidden');
        // Trigger hero animations
        document.querySelectorAll('.hero .reveal, .hero .anim-fade, .hero .anim-slide-up').forEach(el => el.classList.add('in'));
        // Trigger split texts in hero
        document.querySelectorAll('.hero .split-chars').forEach(el => el.classList.add('in'));
      }, 400);
    } else {
      if (pct) pct.textContent = p;
    }
  }, 80);
});

/* ─── 2. CUSTOM CURSOR ─── */
const curDot = document.getElementById('curDot');
const curRing = document.getElementById('curRing');

if (curDot && curRing && matchMedia('(pointer: fine)').matches) {
  let mx = 0, my = 0; // Mouse Target
  let rx = 0, ry = 0; // Ring Current Pos
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    // Dot follows instantly
    curDot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
  });

  const renderCursor = () => {
    // Lerp ring towards mouse position
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    curRing.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Attach hover to interactive elements dynamically
  const setupCursor = () => {
    const hoverTargets = document.querySelectorAll('a, button, .bento-cell, .proj-card-b, .proj-hero, .hero-img-inset, .proj-trigger, .theme-toggle');
    hoverTargets.forEach(el => {
      // prevent duplicate listeners
      el.removeEventListener('mouseenter', addHover);
      el.removeEventListener('mouseleave', rmHover);
      el.addEventListener('mouseenter', addHover);
      el.addEventListener('mouseleave', rmHover);
    });
  };
  const addHover = () => document.body.classList.add('hovering');
  const rmHover = () => document.body.classList.remove('hovering');
  
  setupCursor();
}

/* ─── 3. MOBILE MENU ─── */
const mobToggle = document.getElementById('mobToggle');
const mobDrawer = document.getElementById('mobDrawer');
const mdLinks   = document.querySelectorAll('.md-link');

if (mobToggle && mobDrawer) {
  mobToggle.addEventListener('click', () => {
    mobDrawer.classList.toggle('active');
    const spans = mobToggle.querySelectorAll('span');
    if (mobDrawer.classList.contains('active')) {
      spans[0].style.transform = 'translateY(4px) rotate(45deg)';
      spans[1].style.transform = 'translateY(-4px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.transform = 'none';
    }
  });

  mdLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobDrawer.classList.remove('active');
      const spans = mobToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.transform = 'none';
    });
  });
}

/* ─── 4. TEXT ANIMATION PREP ─── */
// Split Characters
document.querySelectorAll('.split-chars:not(.anim-name)').forEach(el => {
  const text = el.innerText;
  el.innerHTML = '';
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.classList.add('char');
    span.style.transitionDelay = `${i * 0.03}s`;
    span.innerHTML = char === ' ' ? '&nbsp;' : char;
    el.appendChild(span);
  });
});

// Split Lines (Heading)
document.querySelectorAll('.split-lines').forEach(el => {
  // Very basic line split via <br/>
  const html = el.innerHTML;
  const lines = html.split('<br>');
  el.innerHTML = '';
  lines.forEach((line, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'line-wrap';
    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.style.transitionDelay = `${i * 0.15}s`;
    inner.innerHTML = line;
    wrap.appendChild(inner);
    el.appendChild(wrap);
    if(i < lines.length -1) {
       el.appendChild(document.createElement('br'));
    }
  });
});

// Hover Scramble Effect
const chars = '!<>-_\\/[]{}—=+*^?#_';
document.querySelectorAll('.hover-scramble, .scramble-text, .hover-scramble-word').forEach(el => {
  const isWord = el.classList.contains('hover-scramble-word');
  const originalHtml = el.innerHTML;
  const originalText = el.innerText;
  
  el.addEventListener('mouseenter', () => {
    let iter = 0;
    clearInterval(el.interval);
    
    el.interval = setInterval(() => {
      el.innerText = originalText.split('').map((char, i) => {
        if (char === ' ' || char === '\n') return char;
        if (i < iter) return originalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      
      if (iter >= originalText.length) {
        clearInterval(el.interval);
        el.innerHTML = originalHtml; // Restore original HTML to keep tags/spans intact
      }
      iter += isWord ? 0.7 : 0.2; // Slowed down from 2 to 0.7 (words) and 0.33 to 0.2 (letters)
    }, 45); // Slowed interval from 30ms to 45ms
  });
});


/* ─── 5. SCROLL REVEALS ─── */
const reveals = document.querySelectorAll('.reveal, .split-lines, .anim-lines');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

reveals.forEach(r => revObs.observe(r));

/* ─── 6. KPI COUNTERS ─── */
const counters = document.querySelectorAll('.kpi-big[data-to]');
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.getAttribute('data-to');
      const dur = 2000;
      const start = performance.now();
      
      function update(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.floor(ease * target);
        if (t < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }
      requestAnimationFrame(update);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => countObs.observe(c));

/* ─── 7. SKILL BARS ─── */
const bcFills = document.querySelectorAll('.bcfill');
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.getAttribute('data-w') + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

bcFills.forEach(b => skillObs.observe(b));

/* ─── 8. ACTIVE NAV STATE ─── */
const sections = document.querySelectorAll('.pg-section');
const navLinks = document.querySelectorAll('.sn-link');

window.addEventListener('scroll', () => {
  let current = '';
  const y = window.scrollY + 200;

  sections.forEach(sec => {
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    if (y >= top && y < top + h) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}, { passive: true });

/* ─── 9. PROJECT MODAL ─── */
const modal = document.getElementById('projModal');
const modalClose = document.getElementById('modalClose');
const modalBg = document.getElementById('modalBg');

// Modal Fields
const mcNum = document.getElementById('mcNum');
const mcTitle = document.getElementById('mcTitle');
const mcTech = document.getElementById('mcTech');
const mcDesc = document.getElementById('mcDesc');
const mcDemo = document.getElementById('mcDemo');
const mcGithub = document.getElementById('mcGithub');
const mcImgText = document.getElementById('mcImgText');

document.querySelectorAll('.proj-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    // Populate Modal
    if (mcNum) mcNum.textContent = trigger.getAttribute('data-num');
    if (mcTitle) mcTitle.textContent = trigger.getAttribute('data-title');
    if (mcDesc) mcDesc.textContent = trigger.getAttribute('data-desc');
    if (mcImgText) mcImgText.textContent = `[ ${trigger.getAttribute('data-title')} ]`;
    
    // Tech Chips
    if (mcTech) {
      mcTech.innerHTML = '';
      const techArr = trigger.getAttribute('data-tech').split(',');
      techArr.forEach(t => {
        const span = document.createElement('span');
        span.textContent = t;
        mcTech.appendChild(span);
      });
    }
    
    // Links
    const demoLink = trigger.getAttribute('data-demo');
    if (mcDemo) {
      if (demoLink) {
        mcDemo.style.display = 'inline-block';
        mcDemo.href = demoLink;
      } else {
        mcDemo.style.display = 'none';
      }
    }
    
    if (mcGithub) mcGithub.href = trigger.getAttribute('data-gh');
    
    // Open
    if (modal) modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent bg scroll
  });
});

const closeModal = () => {
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBg) modalBg.addEventListener('click', closeModal);
