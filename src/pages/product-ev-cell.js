import '../style.css';
import { initHeader } from '../sections/header.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 제품 상세 페이지 — EV 셀 케이스 제조 라인 (각형 Prismatic / 원통형 Cylindrical)
 * 제품소개 IA(기획안 5장 "2) 제품소개") 산하 첫 번째 제품 템플릿.
 *   - 헤드라인: 메인 히어로와 동일한 blur→focus 리빌
 *   - 히어로 유형 탭(PRISMATIC / CYLINDRICAL) + 사양 표 탭 동기화
 *   - 제품 비주얼: 스포트라이트 리빌 + 설비 사진 크로스페이드
 *   - 기술 카드 stagger 페이드, Magnetic Hover CTA
 */
export function initProductEvCell() {
  initHeroReveal();
  initSpotlightReveal();
  initHeroCellTabs();
  initSpecTabs();
  initHeroVisualSync();
  initFeatureStagger();
  initMagneticButtons();
}

/* ----------------------------------------------------------------
 * 1) 헤드라인 blur→focus 리빌 (페이지 로드 시 즉시 트리거)
 * ---------------------------------------------------------------- */
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

/* ----------------------------------------------------------------
 * 2) 스포트라이트 리빌 — 제품 비주얼이 손전등으로 비추듯 드러남
 *    clip-path: circle(var(--reveal-r) ...) 의 반지름을 0%→100%로 확장
 * ---------------------------------------------------------------- */
function initSpotlightReveal() {
  const mask = document.querySelector('.spotlight-mask');
  if (!mask) return;

  gsap.fromTo(
    mask,
    { '--reveal-r': '0%' },
    { '--reveal-r': '100%', duration: 1.6, ease: 'power2.out', delay: 0.3 }
  );
}

/* ----------------------------------------------------------------
 * 3) 히어로 셀 유형 탭 — PRISMATIC / CYLINDRICAL 선택
 *    SECTION B 사양 탭 및 우측 비주얼과 동기화
 * ---------------------------------------------------------------- */
function initHeroCellTabs() {
  const nav = document.querySelector('.hero-cell-tab-nav');
  if (!nav) return;

  const tabs = Array.from(nav.querySelectorAll('.hero-cell-tab'));
  const indicator = nav.querySelector('.hero-cell-tab-indicator');
  const specTabs = Array.from(document.querySelectorAll('.spec-tabs-section .app-tab'));
  if (!tabs.length || !indicator) return;

  let activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  moveHeroIndicator(tabs[activeIndex], false);

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (index === activeIndex) return;
      if (specTabs[index]) {
        specTabs[index].click();
      } else {
        setHeroTab(index);
        document.dispatchEvent(new CustomEvent('specTabChange', { detail: { index } }));
      }
    });
  });

  document.addEventListener('specTabChange', (event) => {
    setHeroTab(event.detail.index);
  });

  window.addEventListener('resize', () => moveHeroIndicator(tabs[activeIndex], false));

  function setHeroTab(index) {
    tabs[activeIndex]?.classList.remove('is-active');
    tabs[index]?.classList.add('is-active');
    moveHeroIndicator(tabs[index], true);
    activeIndex = index;
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

/* ----------------------------------------------------------------
 * 4) 사양 표 탭 — PRISMATIC / CYLINDRICAL 전환
 *    탭 클릭 시 콘텐츠 크로스페이드 + 하단 네온 인디케이터 슬라이드 이동
 *    (적용분야 섹션 applications.js와 동일한 모션 언어를 이 페이지 전용으로 재구현).
 *    각 패널이 처음 보일 때 사양 행이 0.05초 간격으로 하→상 stagger 페이드업됩니다.
 * ---------------------------------------------------------------- */
function initSpecTabs() {
  const root = document.querySelector('.spec-tabs-section');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('.app-tab'));
  const panels = Array.from(root.querySelectorAll('.app-panel'));
  const indicator = root.querySelector('.app-tab-indicator');
  if (!tabs.length || !panels.length || !indicator) return;

  let activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  moveIndicator(tabs[activeIndex], false);
  animateRows(panels[activeIndex], { onScroll: true });

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      if (index === activeIndex) return;
      switchTo(index);
    });
  });

  window.addEventListener('resize', () => moveIndicator(tabs[activeIndex], false));

  function switchTo(index) {
    const prevPanel = panels[activeIndex];
    const nextPanel = panels[index];

    tabs[activeIndex].classList.remove('is-active');
    tabs[index].classList.add('is-active');
    moveIndicator(tabs[index], true);

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
    animateRows(nextPanel, { replay: true });

    activeIndex = index;
    document.dispatchEvent(new CustomEvent('specTabChange', { detail: { index } }));
  }

  function animateRows(panel, { replay = false, onScroll = false } = {}) {
    const rows = panel.querySelectorAll('.spec-row');
    if (!rows.length) return;

    if (replay) gsap.set(rows, { opacity: 0, y: 16 });

    gsap.to(rows, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.05,
      delay: replay ? 0.15 : 0,
      scrollTrigger: onScroll ? { trigger: panel, start: 'top 85%', once: true } : undefined
    });
  }

  function moveIndicator(tabEl, animate) {
    const navRect = tabEl.parentElement.getBoundingClientRect();
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

/* ----------------------------------------------------------------
 * 4-1) 히어로 비주얼 ↔ 사양 탭 동기화
 *    SECTION B 탭을 전환하면 SECTION A 스포트라이트 패널의 설비 사진이
 *    크로스페이드로 바뀌고, 하단 라벨 텍스트도 함께 갱신됩니다.
 * ---------------------------------------------------------------- */
function initHeroVisualSync() {
  const imgs = Array.from(document.querySelectorAll('.hero-visual-img'));
  const label = document.querySelector('.hero-visual-label');
  if (!imgs.length) return;

  const labels = ['PRISMATIC CELL CASE', 'CYLINDRICAL CELL CASE'];

  document.addEventListener('specTabChange', (e) => {
    const index = e.detail.index;

    imgs.forEach((img) => {
      const isTarget = Number(img.dataset.index) === index;
      gsap.to(img, { opacity: isTarget ? 1 : 0, duration: 0.5, ease: 'power1.out' });
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

/* ----------------------------------------------------------------
 * 5) 핵심 기술 카드 — stagger 페이드인
 *    opacity만 제어하고 완료 후 clearProps로 transform을 비워,
 *    호버 시 Tailwind의 -translate-y-1 리프트가 인라인 스타일에
 *    가려지지 않고 정상 동작하도록 함
 * ---------------------------------------------------------------- */
function initFeatureStagger() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  gsap.to(cards, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '.feature-grid',
      start: 'top 80%',
      once: true
    },
    onComplete: () => gsap.set(cards, { clearProps: 'transform' })
  });
}

/* ----------------------------------------------------------------
 * 6) Magnetic Hover — CTA 버튼이 마우스를 따라 살짝 끌려옴
 * ---------------------------------------------------------------- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach((btn) => {
    const moveX = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveY = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      moveX(relX * 0.35);
      moveY(relY * 0.35);
    });

    btn.addEventListener('mouseleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initProductEvCell();
});
