<?php
/**
 * 메인 문의 폼 — index 스킨에 include
 *
 * 관리자 설정 (게시판 inquiry):
 * - 비회원 글쓰기 허용
 * - 글쓰기 권한: 비회원 1 이상
 * - 여분필드1: 회사명 / 여분필드2: 연락처 / 여분필드3: 문의유형
 * - 게시판 관리자·신규글 알림 메일: happykim@hotmail.com
 *
 * extend/contact.extend.php 를 extend 폴더에 복사하면
 * 등록 후 index.php?contact=success#support 로 이동합니다.
 */
if (!defined('_GNUBOARD_')) exit;

$contact_bo_table = 'inquiry';
$token = get_write_token($contact_bo_table);
?>
<form
  class="contact-form space-y-5"
  id="contact-form"
  method="post"
  action="<?php echo G5_BBS_URL; ?>/write_update.php"
  enctype="multipart/form-data"
  data-board-table="<?php echo $contact_bo_table; ?>"
  novalidate
>
  <input type="hidden" name="w" value="">
  <input type="hidden" name="bo_table" value="<?php echo $contact_bo_table; ?>">
  <input type="hidden" name="wr_id" value="0">
  <input type="hidden" name="sca" value="">
  <input type="hidden" name="sfl" value="">
  <input type="hidden" name="stx" value="">
  <input type="hidden" name="spt" value="">
  <input type="hidden" name="sst" value="">
  <input type="hidden" name="sod" value="">
  <input type="hidden" name="page" value="">
  <input type="hidden" name="uid" value="<?php echo get_uniqid(); ?>">
  <input type="hidden" name="token" value="<?php echo $token; ?>">
  <input type="hidden" name="wr_subject" value="">
  <input type="hidden" name="wr_password" value="">

  <div class="grid gap-5 sm:grid-cols-2">
    <div class="form-field">
      <label class="form-label" for="wr_name">이름 *</label>
      <div class="relative">
        <input type="text" id="wr_name" name="wr_name" required placeholder="홍길동" class="form-input" autocomplete="name" />
        <svg class="form-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path class="form-check-path" d="M5 13l4 4L19 7" stroke="#9B6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <div class="form-field">
      <label class="form-label" for="wr_1">회사명</label>
      <div class="relative">
        <input type="text" id="wr_1" name="wr_1" placeholder="(주)신성정밀" class="form-input" autocomplete="organization" />
        <svg class="form-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path class="form-check-path" d="M5 13l4 4L19 7" stroke="#9B6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>

  <div class="grid gap-5 sm:grid-cols-2">
    <div class="form-field">
      <label class="form-label" for="wr_2">연락처 *</label>
      <div class="relative">
        <input type="tel" id="wr_2" name="wr_2" required placeholder="010-0000-0000" class="form-input" autocomplete="tel" />
        <svg class="form-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path class="form-check-path" d="M5 13l4 4L19 7" stroke="#9B6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
    <div class="form-field">
      <label class="form-label" for="wr_email">이메일 *</label>
      <div class="relative">
        <input type="email" id="wr_email" name="wr_email" required placeholder="name@company.com" class="form-input" autocomplete="email" />
        <svg class="form-check" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path class="form-check-path" d="M5 13l4 4L19 7" stroke="#9B6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>
  </div>

  <div class="form-field">
    <label class="form-label" for="wr_3">문의 유형 *</label>
    <div class="relative">
      <select id="wr_3" name="wr_3" required class="form-select">
        <option value="" disabled selected>선택해주세요</option>
        <option value="online">온라인 문의</option>
        <option value="tech">기술 상담 신청</option>
      </select>
      <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <div class="form-field">
    <label class="form-label" for="wr_content">문의 내용 *</label>
    <div class="relative">
      <textarea id="wr_content" name="wr_content" required rows="4" placeholder="문의하실 내용을 입력해주세요" class="form-textarea"></textarea>
      <svg class="form-check form-check--top" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path class="form-check-path" d="M5 13l4 4L19 7" stroke="#9B6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>

  <button type="submit" class="btn-solid magnetic-btn w-full sm:w-auto">
    문의 보내기 <span aria-hidden="true">→</span>
  </button>
</form>
