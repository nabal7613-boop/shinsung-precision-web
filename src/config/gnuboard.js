/**
 * 그누보드5 문의 게시판 연동 설정
 * 스킨 포팅 시 bo_table·여분필드명은 관리자 게시판 설정과 일치해야 합니다.
 */
export const GNUBOARD_CONTACT = {
  /** 게시판 테이블명 (관리자 > 게시판관리에서 생성) */
  boardTable: 'inquiry',

  /** 문의 유형 select value → 게시글 제목·분류용 라벨 */
  inquiryTypes: {
    online: '온라인 문의',
    tech: '기술 상담 신청'
  },

  /** 여분필드 매핑 (게시판 설정 > 여분필드 1~3 제목과 동일하게) */
  extraFields: {
    company: 'wr_1',
    phone: 'wr_2',
    inquiryType: 'wr_3'
  },

  /** 제출 후 돌아올 URL 쿼리 (extend/contact.extend.php 리다이렉트와 쌍) */
  successQueryKey: 'contact',
  successQueryValue: 'success'
};

/** Vite 개발·정적 미리보기: action이 # 이면 목업 제출 */
export function isContactMockMode(form) {
  const action = (form?.getAttribute('action') || '').trim();
  return !action || action === '#' || action.endsWith('#');
}
