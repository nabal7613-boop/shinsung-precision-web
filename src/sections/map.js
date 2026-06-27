import { COMPANY_LOCATION } from '../config/location.js';

/** 오시는 길 지도 — 뷰포트 진입 시 iframe 로드 */
export function initMap() {
  const frame = document.querySelector('#company-map');
  if (!frame) return;

  const src = frame.dataset.src || COMPANY_LOCATION.embedUrl;
  let loaded = false;

  const loadMap = () => {
    if (loaded || frame.src) return;
    loaded = true;
    frame.src = src;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMap();
        });
      },
      { rootMargin: '120px 0px', threshold: 0.01 }
    );
    observer.observe(frame);
  } else {
    loadMap();
  }
}
