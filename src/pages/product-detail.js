import '../style.css';
import { initHeader } from '../sections/header.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initProductDetail();
});

function initProductDetail() {
  initHeroReveal();
  initCounters();
  initHeroCellTabIndicator();
  initFeatureStagger();
  initEquipFeatureStagger();
  initProcessStagger();
  initMagneticButtons();
}

function initHeroReveal() {
  const lines = document.querySelectorAll('.product-line');
  if (!lines.length) return;

  gsap.set(lines, { opacity: 0, y: 28, filter: 'blur(8px)' });
  gsap.to(lines, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.15
  });
}

function initCounters() {
  const stats = document.querySelectorAll('.stat[data-target]');

  stats.forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const numberEl = el.querySelector('.stat-number');
    const isDecimal = String(el.dataset.target).includes('.');
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            const display = isDecimal ? counter.val.toFixed(1) : Math.round(counter.val);
            numberEl.textContent = `${display}${suffix}`;
          }
        });
      }
    });
  });
}

function initHeroCellTabIndicator() {
  const nav = document.querySelector('.hero-cell-tab-nav');
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll('.hero-cell-tab'));
  const indicator = nav.querySelector('.hero-cell-tab-indicator');
  if (!tabs.length || !indicator) return;

  let activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  moveIndicator(tabs[activeIndex], false);

  tabs.forEach((tab, index) => {
    if (tab.tagName !== 'A' || !tab.href) return;

    tab.addEventListener('click', (event) => {
      if (index === activeIndex) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const href = tab.href;

      tabs[activeIndex]?.classList.remove('is-active');
      tab.classList.add('is-active');
      moveIndicator(tab, true);

      window.setTimeout(() => {
        window.location.assign(href);
      }, 450);
    });
  });

  window.addEventListener('resize', () => moveIndicator(tabs[activeIndex], false), { passive: true });

  function moveIndicator(tabEl, animate) {
    const navRect = nav.getBoundingClientRect();
    const tabRect = tabEl.getBoundingClientRect();
    const x = tabRect.left - navRect.left;
    const width = tabRect.width;

    if (animate) {
      gsap.to(indicator, { x, width, duration: 0.45, ease: 'power3.out' });
    } else {
      gsap.set(indicator, { x, width });
    }
  }
}

function initEquipFeatureStagger() {
  const items = document.querySelectorAll('.equip-feature-item');
  if (!items.length) return;

  gsap.to(items, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: 'power3.out',
    stagger: 0.05,
    scrollTrigger: {
      trigger: '.equip-feature-grid',
      start: 'top 82%',
      once: true
    }
  });
}

function initFeatureStagger() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.65,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.feature-grid',
      start: 'top 82%',
      once: true
    }
  });
}

function initProcessStagger() {
  const rows = document.querySelectorAll('.spec-row');
  if (!rows.length) return;

  gsap.to(rows, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: 'power3.out',
    stagger: 0.06,
    scrollTrigger: {
      trigger: '.spec-list',
      start: 'top 82%',
      once: true
    }
  });
}

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach((btn) => {
    const moveX = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveY = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      moveX(relX * 0.32);
      moveY(relY * 0.32);
    });

    btn.addEventListener('mouseleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}
