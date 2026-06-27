import './style.css';
import { initHeader } from './sections/header.js';
import { initHero } from './sections/hero.js';
import { initIntroVideo } from './sections/intro-video.js';
import { initReveal } from './sections/reveal.js';
import { initTech } from './sections/tech.js';

// ============================================================
// 레고블록식 섹션 초기화 진입점
// 새 섹션을 추가할 때는 src/sections/ 아래에 모듈을 추가하고
// 여기서 import하여 호출하는 방식으로 확장합니다.
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initHero();
  initIntroVideo();
  initReveal();
  initTech();
});
