import '../style.css';
import { initHeader } from '../sections/header.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initProduct200lDrum();
});

function initProduct200lDrum() {
  initHeroReveal();
  initSpotlightReveal();
  initHeroCellTabs();
  initDetailPanels();
  initHeroVisualSync();
  initHashTab();
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

function initSpotlightReveal() {
  const mask = document.querySelector('.spotlight-mask');
  if (!mask) return;

  gsap.fromTo(
    mask,
    { '--reveal-r': '0%' },
    { '--reveal-r': '100%', duration: 1.6, ease: 'power2.out', delay: 0.3 }
  );
}

function initHeroCellTabs() {
  const nav = document.querySelector('.hero-cell-tab-nav');
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll('.hero-cell-tab'));
  const indicator = nav.querySelector('.hero-cell-tab-indicator');
  if (!tabs.length || !indicator) return;

  let activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  moveHeroIndicator(tabs[activeIndex], false);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (index === activeIndex) return;
      setHeroTab(index);
    });
  });

  window.addEventListener('resize', () => moveHeroIndicator(tabs[activeIndex], false));

  function setHeroTab(index) {
    tabs[activeIndex]?.classList.remove('is-active');
    tabs[index]?.classList.add('is-active');
    moveHeroIndicator(tabs[index], true);
    activeIndex = index;
    document.dispatchEvent(new CustomEvent('specTabChange', { detail: { index } }));
  }

  function moveHeroIndicator(tabEl, animate) {
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

function initHashTab() {
  const tabIndex = window.location.hash === '#end-line' ? 1 : 0;
  if (tabIndex === 0) return;

  document.querySelector(`.hero-cell-tab[data-index="${tabIndex}"]`)?.click();
}

function initDetailPanels() {
  const root = document.querySelector('.spec-tabs-section');
  if (!root) return;

  const panels = Array.from(root.querySelectorAll('.app-panel'));
  if (!panels.length) return;

  let activeIndex = panels.findIndex((panel) => panel.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  revealPanel(panels[activeIndex]);

  document.addEventListener('specTabChange', (event) => {
    const index = event.detail.index;
    if (index === activeIndex) return;
    switchPanel(index);
  });

  function switchPanel(index) {
    const prevPanel = panels[activeIndex];
    const nextPanel = panels[index];

    gsap.to(prevPanel, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
      onComplete: () => {
        prevPanel.classList.add('hidden');
        prevPanel.classList.remove('is-active');
        gsap.set(prevPanel, { clearProps: 'opacity' });
      }
    });

    nextPanel.classList.remove('hidden');
    nextPanel.classList.add('is-active');
    gsap.fromTo(nextPanel, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out', delay: 0.1 });
    revealPanel(nextPanel, { animate: true });

    activeIndex = index;
  }

  function revealPanel(panel, { animate = false } = {}) {
    const rows = panel.querySelectorAll('.aerosol-spec-row, .aerosol-feature-item');
    if (!rows.length) return;

    if (animate) gsap.set(rows, { opacity: 0, y: 16 });

    gsap.to(rows, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.04,
      delay: animate ? 0.15 : 0.2
    });
  }
}

function initHeroVisualSync() {
  const visuals = Array.from(document.querySelectorAll('.hero-visual-img'));
  const label = document.querySelector('.hero-visual-label');
  if (!visuals.length) return;

  const labels = ['200L DRUM BODY MAKING LINE', '200L DRUM END MAKING LINE'];

  document.addEventListener('specTabChange', (e) => {
    const index = e.detail.index;

    visuals.forEach((el) => {
      const isTarget = Number(el.dataset.index) === index;
      gsap.to(el, { opacity: isTarget ? 1 : 0, duration: 0.5, ease: 'power1.out' });
    });

    if (label && labels[index]) {
      gsap.to(label, {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          label.textContent = labels[index];
          gsap.to(label, { opacity: 1, duration: 0.25 });
        }
      });
    }
  });
}

function initProcessStagger() {
  const rows = document.querySelectorAll('.process-spec-list .spec-row');
  if (!rows.length) return;

  gsap.to(rows, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: 'power3.out',
    stagger: 0.06,
    scrollTrigger: {
      trigger: '.process-spec-list',
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
