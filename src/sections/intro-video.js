/**
 * 히어로 ↔ About 사이 전체 화면 YouTube
 * 뷰포트 진입 시 음소거 자동재생 + 반복 (컨트롤·자막 없음)
 */
export function initIntroVideo() {
  const section = document.querySelector('#intro-video');
  const iframe = document.querySelector('#intro-video-player');
  if (!section || !iframe) return;

  const src = iframe.dataset.src;
  if (!src) return;

  let loaded = false;

  const loadPlayer = () => {
    if (loaded) return;
    loaded = true;
    iframe.src = src;
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadPlayer();
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(section);
  } else {
    loadPlayer();
  }
}
