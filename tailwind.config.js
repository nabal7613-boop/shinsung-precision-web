/** @type {import('tailwindcss').Config} */
export default {
  content: ['./*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // SK네트웍스 톤앤매너 참고 — 딥 블랙 베이스 + 퍼플/오로라 포인트
        base: '#06060B',
        'base-2': '#0B0B12',
        surface: '#13131D',
        'surface-2': '#1B1B27',
        hairline: '#272733',
        fog: '#A2A2B4',
        'fog-2': '#6B6B7C',
        violet: '#9B6BFF',
        'violet-deep': '#6D3BEE',
        teal: '#43E0C0',
        amber: '#FF8A3D',

        // 라이트 메가 드롭다운 패널 전용
        panel: '#FFFFFF',
        'panel-ink': '#16181D',
        'panel-fog': '#6B7280',
        'panel-line': '#E8EAEE',

        // 제품 상세(다크 스펙 시트) 레거시 토큰 — 퍼플/청록으로 통일
        navy: '#06060B',
        'navy-deep': '#0B0B12',
        charcoal: '#13131D',
        silver: '#C8CDD6',
        'silver-light': '#ECEEF3',
        'accent-blue': '#6D3BEE',
        'accent-cyan': '#9B6BFF',
        'accent-green': '#43E0C0'
      },
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'sans-serif']
      },
      backgroundImage: {
        aurora:
          'linear-gradient(100deg, #7C5CFF 0%, #43E0C0 50%, #FF8A3D 100%)',
        'hero-aurora':
          'radial-gradient(60% 50% at 50% 8%, rgba(124,92,255,0.16) 0%, rgba(124,92,255,0) 60%)'
      }
    }
  },
  plugins: []
};
