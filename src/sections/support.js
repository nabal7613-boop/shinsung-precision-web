import gsap from 'gsap';
import { GNUBOARD_CONTACT, isContactMockMode } from '../config/gnuboard.js';

/**
 * 고객지원/문의 섹션 초기화
 * - Vite 개발: 목업 제출 + 완료 애니메이션
 * - 그누보드 스킨: write_update.php POST → inquiry 페이지 ?contact=success 복귀
 */
export function initSupport() {
  initFieldValidation();
  initContactReturnState();
  initFormSubmit();
}

function initFieldValidation() {
  const fields = document.querySelectorAll('.form-field');

  fields.forEach((field) => {
    const input = field.querySelector('.form-input, .form-textarea, .form-select');
    const checkIcon = field.querySelector('.form-check');
    const checkPath = field.querySelector('.form-check-path');
    if (!input || !checkIcon || !checkPath) return;

    const length = checkPath.getTotalLength();
    checkPath.style.strokeDasharray = `${length}`;
    checkPath.style.strokeDashoffset = `${length}`;

    const validate = () => {
      const isValid = input.checkValidity() && input.value.trim().length > 0;

      if (isValid) {
        gsap.to(checkIcon, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(checkPath, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(checkIcon, { opacity: 0, scale: 0.6, duration: 0.2, ease: 'power1.out' });
        gsap.to(checkPath, { strokeDashoffset: length, duration: 0.2, ease: 'power1.out' });
      }
    };

    gsap.set(checkIcon, { scale: 0.6, transformOrigin: 'center' });
    input.addEventListener('input', validate);
    input.addEventListener('blur', validate);
    input.addEventListener('change', validate);
  });
}

/** 그누보드 등록 후 ?contact=success 로 돌아왔을 때 완료 패널 표시 */
function initContactReturnState() {
  const params = new URLSearchParams(window.location.search);
  if (params.get(GNUBOARD_CONTACT.successQueryKey) !== GNUBOARD_CONTACT.successQueryValue) return;

  showContactSuccess();

  params.delete(GNUBOARD_CONTACT.successQueryKey);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
}

function initFormSubmit() {
  const form = document.querySelector('.contact-form');
  const submitBtn = form?.querySelector('[type="submit"]');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) return;

    if (isContactMockMode(form)) {
      e.preventDefault();
      showContactSuccess();
      return;
    }

    prepareGnuboardPayload(form);
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
  });
}

function prepareGnuboardPayload(form) {
  const name = form.elements.wr_name?.value?.trim() || '';
  const company = form.elements.wr_1?.value?.trim() || '';
  const phone = form.elements.wr_2?.value?.trim() || '';
  const email = form.elements.wr_email?.value?.trim() || '';
  const typeKey = form.elements.wr_3?.value || '';
  const typeLabel = GNUBOARD_CONTACT.inquiryTypes[typeKey] || typeKey;

  const subjectField = form.elements.wr_subject;
  if (subjectField) {
    const subjectParts = [`[${typeLabel}]`, name];
    if (company) subjectParts.push(company);
    subjectField.value = subjectParts.join(' / ');
  }

  const passwordField = form.elements.wr_password;
  if (passwordField && !passwordField.value) {
    passwordField.value = randomGuestPassword();
  }

  // wr_3에는 라벨 저장 (관리자 목록에서 바로 확인)
  if (form.elements.wr_3) {
    form.elements.wr_3.value = typeLabel;
  }
}

function randomGuestPassword() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }
  return String(Date.now()).slice(-8) + Math.random().toString(36).slice(2, 6);
}

function showContactSuccess() {
  const form = document.querySelector('.contact-form');
  const successPanel = document.querySelector('.contact-success');
  if (!form || !successPanel) return;

  gsap.to(form, {
    opacity: 0,
    y: -12,
    duration: 0.35,
    ease: 'power1.out',
    onComplete: () => {
      form.classList.add('hidden');
      successPanel.classList.remove('hidden');
      gsap.fromTo(
        successPanel,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  });
}
