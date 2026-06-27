import '../style.css';
import { initHeader } from '../sections/header.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroReveal();
  initScrollReveal();
  initMagneticButtons();
});

function initHeroReveal() {
  const lines = document.querySelectorAll('.about-line');
  if (!lines.length) return;

  gsap.set(lines, { opacity: 0, y: 32, filter: 'blur(8px)' });
  gsap.to(lines, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.12
  });
}

function initScrollReveal() {
  const revealItems = document.querySelectorAll('.about-reveal');
  if (!revealItems.length) return;

  revealItems.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        once: true
      }
    });
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
      moveX(relX * 0.28);
      moveY(relY * 0.28);
    });

    btn.addEventListener('mouseleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}
