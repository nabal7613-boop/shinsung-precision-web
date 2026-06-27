export const BOARD_NAV = [
  { title: '온라인 문의', href: './inquiry.html' },
  { title: '오시는 길', href: './directions.html' }
];

export const COMPANY_NAV = [
  { title: 'About us', href: './about.html', links: [] },
  { title: 'Message from CEO', href: './message-from-ceo.html', links: [] },
  { title: 'History', href: './history.html', links: [] },
  { title: 'Organization', href: './organization.html', links: [] },
  { title: 'Customer list', href: './customer-list.html', links: [] }
];

const MEGA_PANEL_META = {
  회사소개: { sideLabel: 'About Us', categoryTitle: '회사소개', layout: 'list' },
  제품소개: { sideLabel: 'Product Line', layout: 'columns' },
  '품질·설비': { sideLabel: 'Quality Equip.', categoryTitle: '품질설비', layout: 'list' },
  홍보센터: { sideLabel: 'Media Center', categoryTitle: '홍보센터', layout: 'list' },
  게시판: { sideLabel: 'Board', categoryTitle: '게시판', layout: 'list' }
};

const MEGA_LIST_MENUS = {
  '품질·설비': [
    { label: '품질방침', href: './quality-policy.html' },
    { label: '품질보증', href: './quality-warranty.html' }
  ],
  홍보센터: [
    { label: '카탈로그', href: './catalog.html' },
    { label: '뉴스', href: './news.html' }
  ],
  게시판: [
    { label: '온라인 문의', href: './inquiry.html' },
    { label: '오시는 길', href: './directions.html' }
  ]
};

const MEGA_MENUS = {
  회사소개: COMPANY_NAV,
  제품소개: [
    {
      title: 'EV CELL CASE',
      href: './product-ev-cell.html',
      links: [
        { label: 'EV CELL CASE MAX PRESS / LINE', href: './product-ev-cell.html#spec' },
        { label: 'AUTO SHEET FEEDER PRESS', href: './product-ev-cell.html#spec' }
      ]
    },
    {
      title: 'AEROSOL CONE & DOME',
      href: './product-aerosol-cone-dome.html',
      links: [
        { label: 'AUTO TRANSFER PRESS', href: './product-aerosol-cone-dome.html#detail' },
        { label: 'AUTO LINER & DRYER', href: './product-aerosol-cone-dome.html#liner-dryer' }
      ]
    },
    {
      title: 'TUNA 2PCS BODY',
      href: './product-tuna-2pcs-body.html',
      links: [
        { label: 'CNC SHEET FEEDER PRESS', href: './product-tuna-cnc-sheet-feeder-press.html' },
        { label: 'DRD 2PCS CAN SHEET FEEDER PRESS LINE', href: './product-tuna-drd-sheet-feeder-press-line.html' }
      ]
    },
    {
      title: '18L SQUARE CAN',
      href: './product-18l-square-can.html',
      links: [
        { label: '18L SQUARE CAN BODY MAKING LINE', href: './product-18l-square-can-body-making-line.html' },
        { label: '18L SQUARE CAN END MAKING LINE', href: './product-18l-square-can-end-making-line.html' }
      ]
    },
    {
      title: '200L DRUM',
      href: './product-200l-drum.html',
      links: [
        { label: '200L DRUM BODY MAKING LINE', href: './product-200l-drum-body-making-line.html' },
        { label: '200L DRUM END MAKING LINE', href: './product-200l-drum-end-making-line.html' }
      ]
    },
    {
      title: '16oz GAS CAN',
      href: './product-gas-can-others.html',
      links: [
        { label: 'CNC SHEET FEEDER PRESS', href: './product-gas-can-cnc-sheet-feeder-press.html' },
        { label: 'AUTO TRANSFER PRESS', href: './product-gas-can-auto-transfer-press.html' }
      ]
    }
  ],
  '품질·설비': MEGA_LIST_MENUS['품질·설비'],
  홍보센터: MEGA_LIST_MENUS.홍보센터,
  게시판: MEGA_LIST_MENUS.게시판
};

/**
 * 글로벌 헤더 — SK네트웍스 메뉴바 흐름 참고
 *   · 스크롤 시 화이트 배경으로 전환(is-scrolled)
 *   · 데스크톱 GNB 호버 시 전체 메가패널 노출(is-mega-open)
 *   · 햄버거 클릭 시 풀스크린 전체 메뉴(body.menu-open)
 *   · 해시 링크 부드러운 스크롤 이동
 */
export function initHeader() {
  const header = document.querySelector('#site-header');
  if (!header) return;

  ensureMegaPanel(header);
  syncHeaderHeight(header);
  initScrollState(header);
  initMegaPanel(header);
  initOverlayMenu(header);
  initSmoothNav();
  initCompanyNavActive();
  initBoardNavActive();
}

function ensureMegaPanel(header) {
  let panel = header.querySelector('.site-mega-panel');
  if (!panel) {
    header.insertAdjacentHTML(
      'beforeend',
      `
        <div class="site-mega-panel hidden lg:block" aria-hidden="true"></div>
      `
    );
    return;
  }

  // HTML에 정적 메가패널이 남아 있으면 JS 렌더링과 겹치므로 비움
  if (panel.children.length) {
    panel.innerHTML = '';
  }
}

function syncHeaderHeight(header) {
  const inner = header.querySelector('.site-header-inner');
  if (!inner) return;

  const apply = () => {
    header.style.setProperty('--site-header-height', `${inner.offsetHeight}px`);
  };

  apply();
  window.addEventListener('resize', apply, { passive: true });
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(apply);
    observer.observe(inner);
  }
}

function initScrollState(header) {
  // data-solid: 항상 화이트 헤더 유지(다크 배경 서브페이지용)
  if (header.dataset.solid !== undefined) {
    header.classList.add('is-scrolled', 'is-solid');
    return;
  }
  const toggle = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* 데스크톱 GNB 호버 → 해당 메뉴의 하위 패널만 렌더링 */
function initMegaPanel(header) {
  const nav = header.querySelector('.site-nav');
  const panel = header.querySelector('.site-mega-panel');
  if (!nav || !panel) return;

  let closeTimer = null;
  let activeKey = null;
  let activeLink = null;

  const open = () => {
    if (closeTimer) clearTimeout(closeTimer);
    header.classList.add('is-mega-open');
    panel.setAttribute('aria-hidden', 'false');
  };

  const close = () => {
    closeTimer = setTimeout(() => {
      if (header.matches(':hover')) return;
      header.classList.remove('is-mega-open');
      panel.setAttribute('aria-hidden', 'true');
    }, 220);
  };

  nav.addEventListener('mouseenter', () => {
    if (activeKey) open();
  });
  header.addEventListener('mouseleave', close);
  panel.addEventListener('mouseenter', open);
  panel.addEventListener('mousedown', () => {
    if (closeTimer) clearTimeout(closeTimer);
  });

  let handledByPointer = false;

  const activateMegaLink = (link, event) => {
    if (closeTimer) clearTimeout(closeTimer);

    const targetUrl = new URL(link.href, window.location.href);
    const hashTarget = targetUrl.hash ? document.getElementById(targetUrl.hash.slice(1)) : null;
    const isSamePageHash =
      targetUrl.pathname === window.location.pathname && hashTarget;

    header.classList.remove('is-mega-open');
    panel.setAttribute('aria-hidden', 'true');

    if (isSamePageHash) {
      event.preventDefault();
      hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', targetUrl.hash);
      return;
    }

    if (targetUrl.href !== window.location.href) {
      event.preventDefault();
      window.location.assign(targetUrl.href);
    }
  };

  nav.querySelectorAll('.site-nav-link').forEach((link) => {
    const key = getMegaKey(link);
    link.addEventListener('mouseenter', () => {
      activeKey = key;
      activeLink = link;
      renderMegaPanel(panel, key, link);
      open();
    });
    link.addEventListener('focus', () => {
      activeKey = key;
      activeLink = link;
      renderMegaPanel(panel, key, link);
      open();
    });
  });

  panel.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return;

    const link = event.target.closest('a[href]');
    if (!link) return;

    handledByPointer = true;
    activateMegaLink(link, event);
  });

  panel.addEventListener('click', (event) => {
    if (handledByPointer) {
      handledByPointer = false;
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link) return;

    activateMegaLink(link, event);
  });

  panel.addEventListener('focusin', () => {
    if (activeKey) renderMegaPanel(panel, activeKey, activeLink);
    open();
  });

  window.addEventListener(
    'resize',
    () => {
      if (activeLink && header.classList.contains('is-mega-open')) {
        positionMegaUnderNav(panel, activeLink);
      }
    },
    { passive: true }
  );
}

function getMegaKey(link) {
  const text = link.textContent.trim();
  if (text.includes('회사') || text.includes('기업')) return '회사소개';
  if (text.includes('제품')) return '제품소개';
  if (text.includes('품질')) return '품질·설비';
  if (text.includes('홍보')) return '홍보센터';
  if (text.includes('게시')) return '게시판';
  return '회사소개';
}

function renderMegaPanel(panel, key, anchorLink) {
  const meta = MEGA_PANEL_META[key] || MEGA_PANEL_META.회사소개;
  panel.classList.toggle('site-mega-panel--compact', meta.layout === 'list');

  if (meta.layout === 'list') {
    panel.innerHTML = renderListMegaPanel(key, meta);
  } else {
    panel.innerHTML = renderColumnsMegaPanel(key, meta);
  }

  positionMegaUnderNav(panel, anchorLink);
}

function positionMegaUnderNav(panel, link) {
  const inner = panel.querySelector('.mega-shell-inner');
  if (!inner || !link) return;

  const apply = () => {
    const panelRect = panel.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const viewportPadding = 16;
    const innerWidth = inner.offsetWidth;

    const sideLabel = inner.querySelector('.mega-side-label');
    const divider = inner.querySelector('.mega-side-divider');
    const dividerStyles = divider ? getComputedStyle(divider) : null;
    const prefixWidth =
      (sideLabel?.offsetWidth || 0) +
      (divider?.offsetWidth || 0) +
      (dividerStyles ? parseFloat(dividerStyles.marginRight) || 0 : 0);

    // 구분선 오른쪽(콘텐츠 시작) = GNB 항목 왼쪽
    let offsetLeft = linkRect.left - panelRect.left - prefixWidth;

    const minOffset = viewportPadding - panelRect.left;
    const maxOffset = panelRect.width - viewportPadding - innerWidth;
    offsetLeft = Math.max(minOffset, Math.min(offsetLeft, maxOffset));

    inner.style.marginLeft = `${offsetLeft}px`;
  };

  apply();
  requestAnimationFrame(apply);
}

function renderMegaCategoryTitle(key, meta) {
  if (key === '회사소개') {
    return `<a href="./about.html" class="mega-category-title mega-category-title-link">${meta.categoryTitle}</a>`;
  }

  const items = MEGA_LIST_MENUS[key] || [];
  const href = items[0]?.href;
  if (href) {
    return `<a href="${href}" class="mega-category-title mega-category-title-link">${meta.categoryTitle}</a>`;
  }

  return `<p class="mega-category-title">${meta.categoryTitle}</p>`;
}

function renderListMegaPanel(key, meta) {
  const currentPath = getCurrentPath();
  let linksHtml = '';

  if (key === '회사소개') {
    linksHtml = COMPANY_NAV.map((item) => {
      const isActive = isNavActive(currentPath, item.href);
      const activeAttr = isActive ? ' aria-current="page"' : '';
      return `<a href="${item.href}" class="mega-list-link${isActive ? ' is-active' : ''}"${activeAttr}>${item.title}</a>`;
    }).join('');
  } else if (key === '게시판') {
    linksHtml = BOARD_NAV.map((item) => {
      const isActive = isNavActive(currentPath, item.href);
      const activeAttr = isActive ? ' aria-current="page"' : '';
      return `<a href="${item.href}" class="mega-list-link${isActive ? ' is-active' : ''}"${activeAttr}>${item.title}</a>`;
    }).join('');
  } else {
    const items = MEGA_LIST_MENUS[key] || [];
    linksHtml = items
      .map((item) => `<a href="${item.href}" class="mega-list-link">${item.label}</a>`)
      .join('');
  }

  return `
    <div class="mega-shell">
      <div class="mega-shell-inner">
        <div class="mega-side-label">${meta.sideLabel}</div>
        <div class="mega-side-divider" aria-hidden="true"></div>
        <div class="mega-list-body">
          ${renderMegaCategoryTitle(key, meta)}
          <div class="mega-list-links">${linksHtml}</div>
        </div>
      </div>
    </div>
  `;
}

function renderColumnsMegaPanel(key, meta) {
  const columns = MEGA_MENUS[key] || [];

  const columnHtml = columns
    .map(
      (col) => `
        <div class="mega-col">
          ${
            col.href
              ? `<a href="${col.href}" class="mega-col-title mega-col-title-link">${col.title}</a>`
              : `<p class="mega-col-title">${col.title}</p>`
          }
          ${col.links
            .map((item) => `<a href="${item.href}" class="mega-col-link">${item.label}</a>`)
            .join('')}
        </div>
      `
    )
    .join('');

  return `
    <div class="mega-shell">
      <div class="mega-shell-inner mega-shell-inner--columns">
        <div class="mega-side-label">${meta.sideLabel}</div>
        <div class="mega-side-divider" aria-hidden="true"></div>
        <div class="mega-columns">${columnHtml}</div>
      </div>
    </div>
  `;
}

function getCurrentPath() {
  const file = window.location.pathname.split('/').pop();
  return file && file.length ? file : 'index.html';
}

function isNavActive(currentPath, href) {
  const itemPath = href.replace(/^\.\//, '').split('#')[0];
  return currentPath === itemPath;
}

/** 회사소개 하위 페이지 — 모바일 오버레이 active 표시 */
function initCompanyNavActive() {
  const currentPath = getCurrentPath();
  const isCompanyPage = COMPANY_NAV.some((item) => isNavActive(currentPath, item.href));
  if (!isCompanyPage) return;

  markMobileOverlayCompanyActive(currentPath);
}

function markMobileOverlayCompanyActive(currentPath) {
  const companyPaths = new Set(COMPANY_NAV.map((item) => item.href.replace(/^\.\//, '')));
  const overlay = document.querySelector('#mega-menu');
  if (!overlay) return;

  overlay.querySelectorAll('.mega-group-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const itemPath = href.replace(/^\.\//, '').split('#')[0];
    if (!companyPaths.has(itemPath)) return;

    const isActive = isNavActive(currentPath, href);
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/** 게시판 하위 페이지 — 모바일 오버레이 active 표시 */
function initBoardNavActive() {
  const currentPath = getCurrentPath();
  const isBoardPage = BOARD_NAV.some((item) => isNavActive(currentPath, item.href));
  if (!isBoardPage) return;

  markMobileOverlayBoardActive(currentPath);
}

function markMobileOverlayBoardActive(currentPath) {
  const boardPaths = new Set(BOARD_NAV.map((item) => item.href.replace(/^\.\//, '')));
  const overlay = document.querySelector('#mega-menu');
  if (!overlay) return;

  overlay.querySelectorAll('.mega-group-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const itemPath = href.replace(/^\.\//, '').split('#')[0];
    if (!boardPaths.has(itemPath)) return;

    const isActive = isNavActive(currentPath, href);
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
/* 햄버거 → 풀스크린 전체 메뉴 */
function initOverlayMenu(header) {
  const toggleBtn = header.querySelector('.site-menu-toggle');
  const overlay = document.querySelector('#mega-menu');
  if (!toggleBtn || !overlay) return;

  const setOpen = (open) => {
    toggleBtn.setAttribute('aria-expanded', String(open));
    overlay.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('overflow-hidden', open);
  };

  toggleBtn.addEventListener('click', () => {
    setOpen(toggleBtn.getAttribute('aria-expanded') !== 'true');
  });

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* 해시 링크 부드러운 스크롤 */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    });
  });
}
