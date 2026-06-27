import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 기술력 섹션 초기화
 * 기획안 6-3. 기술력 섹션 참고
 *   - 인증/특허 배지: 스크롤 진입 시 하→상 순차(stagger) 페이드업
 *   - 원형 게이지: 소재 절감률(14.6%)을 스크롤 트리거 시점에 0→목표치로 채움
 *   - 카운터: 분당 생산량(1,000+ EA) 숫자 카운트업
 */
export function initTech() {
  initBadgeStagger();
  initGauge();
  initCounter();
}

/* ----------------------------------------------------------------
 * 1) 인증/특허 배지 그리드 — 하→상 순차 페이드업
 * ---------------------------------------------------------------- */
function initBadgeStagger() {
  const badges = document.querySelectorAll('.tech-badge');
  if (!badges.length) return;

  gsap.to(badges, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.tech-badge-grid',
      start: 'top 80%',
      once: true
    }
  });
}

/* ----------------------------------------------------------------
 * 2) 원형 게이지 — 소재 절감률 14.6%
 *    SVG 원의 stroke-dashoffset을 둘레(circumference) 기준으로
 *    0%(꽉 찬 offset) → 목표 퍼센트(offset 감소)로 애니메이션
 * ---------------------------------------------------------------- */
function initGauge() {
  const gauge = document.querySelector('.tech-gauge');
  if (!gauge) return;

  const circle = gauge.querySelector('.tech-gauge-fill');
  const valueEl = gauge.querySelector('.tech-gauge-value');
  const target = parseFloat(gauge.dataset.percent || '0');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;

  ScrollTrigger.create({
    trigger: gauge,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const offsetTarget = circumference - (circumference * target) / 100;
      gsap.to(circle, {
        strokeDashoffset: offsetTarget,
        duration: 1.4,
        ease: 'power2.out'
      });
      gsap.to(
        { val: 0 },
        {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() {
            valueEl.textContent = `${this.targets()[0].val.toFixed(1)}%`;
          }
        }
      );
    }
  });
}

/* ----------------------------------------------------------------
 * 3) 카운터 — 분당 생산량 1,000+ EA
 * ---------------------------------------------------------------- */
function initCounter() {
  const el = document.querySelector('.tech-counter');
  if (!el) return;

  const numberEl = el.querySelector('.tech-counter-number');
  const target = parseFloat(el.dataset.target || '0');
  const suffix = el.dataset.suffix || '';

  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(
        { val: 0 },
        {
          val: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() {
            numberEl.textContent = `${Math.round(this.targets()[0].val)}${suffix}`;
          }
        }
      );
    }
  });
}
