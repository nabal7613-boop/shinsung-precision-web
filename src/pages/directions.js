import '../style.css';
import { initHeader } from '../sections/header.js';
import { initMap } from '../sections/map.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHeroReveal();
  initMap();
  initScrollReveal();
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
        start: 'top 86%',
        once: true
      }
    });
  });
}
