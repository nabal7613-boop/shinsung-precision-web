import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 공통 스크롤 인터랙션 (SK네트웍스 흐름 참고)
 *   · .reveal-up        : 진입 시 부드러운 페이드업
 *   · 기업 선언문        : 스크롤에 따라 단어 색이 또렷하게 채워짐
 *   · .biz-card         : 카드 순차 등장(stagger)
 *   · .press-card       : 프레스 카드 순차 등장
 */
export function initReveal() {
  initRevealUp();
  initStatement();
  initBizCards();
  initPressCards();
}

function initRevealUp() {
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });
}

function initStatement() {
  const words = gsap.utils.toArray(
    '.statement-text .sw:not(.text-gradient-strong)'
  );
  if (!words.length) return;

  gsap.fromTo(
    words,
    { color: 'rgba(255, 255, 255, 0.16)' },
    {
      color: 'rgba(255, 255, 255, 1)',
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: '.statement-text',
        start: 'top 80%',
        end: 'bottom 58%',
        scrub: true
      }
    }
  );
}

function initBizCards() {
  gsap.utils.toArray('.biz-grid').forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll('.biz-card'));
    if (!cards.length) return;

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('is-in'), i * 90);
        });
      }
    });
  });
}

function initPressCards() {
  const cards = gsap.utils.toArray('.press-card');
  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, y: 26 });
  gsap.to(cards, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.press-track', start: 'top 85%', once: true }
  });
}
