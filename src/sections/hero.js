import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 메인 히어로 — SK네트웍스 히어로 흐름 참고
 *   · 딥 블랙 위 파티클 네트워크(별자리) — 빛나는 노드 + 연결선
 *   · 중앙 헤드라인 blur→focus 순차 리빌, 카운트업, 마그네틱 버튼
 */
export function initHero() {
  initParticleNetwork();
  initScrollReveal();
  initCounters();
  initMagneticButtons();
}

/* ----------------------------------------------------------------
 * 1) Three.js 파티클 네트워크 — 노드(글로우 점) + 근접 노드 연결선
 * ---------------------------------------------------------------- */
function initParticleNetwork() {
  const canvas = document.querySelector('#hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 14;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  // 노드 좌표/속도/색상
  const COUNT = 92;
  const RANGE_X = 22;
  const RANGE_Y = 13;
  const RANGE_Z = 7;
  const LINK_DIST = 3.4;

  const palette = [
    new THREE.Color('#9B6BFF'),
    new THREE.Color('#7C5CFF'),
    new THREE.Color('#43E0C0'),
    new THREE.Color('#FF8A3D'),
    new THREE.Color('#C9C2FF')
  ];

  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const velocities = [];

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * RANGE_X;
    positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE_Y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE_Z;

    const c = palette[(Math.random() * palette.length) | 0];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.012,
        (Math.random() - 0.5) * 0.008
      )
    );
  }

  // 노드 — 부드러운 원형 글로우 스프라이트
  const pointGeo = new THREE.BufferGeometry();
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointMat = new THREE.PointsMaterial({
    size: 0.5,
    map: makeGlowTexture(),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  group.add(new THREE.Points(pointGeo, pointMat));

  // 연결선 — 매 프레임 근접 노드 사이를 잇는 LineSegments
  const maxSegments = COUNT * COUNT;
  const linePositions = new Float32Array(maxSegments * 3);
  const lineColors = new Float32Array(maxSegments * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  const posAttr = pointGeo.attributes.position;

  function animate() {
    requestAnimationFrame(animate);

    // 노드 이동 + 경계 반사
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      positions[ix] += velocities[i].x;
      positions[ix + 1] += velocities[i].y;
      positions[ix + 2] += velocities[i].z;

      if (positions[ix] > RANGE_X / 2 || positions[ix] < -RANGE_X / 2) velocities[i].x *= -1;
      if (positions[ix + 1] > RANGE_Y / 2 || positions[ix + 1] < -RANGE_Y / 2) velocities[i].y *= -1;
      if (positions[ix + 2] > RANGE_Z / 2 || positions[ix + 2] < -RANGE_Z / 2) velocities[i].z *= -1;
    }
    posAttr.needsUpdate = true;

    // 근접 노드 연결선 갱신
    let seg = 0;
    for (let i = 0; i < COUNT; i++) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];
      for (let j = i + 1; j < COUNT; j++) {
        const dx = ax - positions[j * 3];
        const dy = ay - positions[j * 3 + 1];
        const dz = az - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < LINK_DIST) {
          const alpha = 1 - dist / LINK_DIST;
          const s2 = seg * 3;
          linePositions[s2] = ax;
          linePositions[s2 + 1] = ay;
          linePositions[s2 + 2] = az;
          linePositions[s2 + 3] = positions[j * 3];
          linePositions[s2 + 4] = positions[j * 3 + 1];
          linePositions[s2 + 5] = positions[j * 3 + 2];

          const cr = colors[i * 3] * alpha;
          const cg = colors[i * 3 + 1] * alpha;
          const cb = colors[i * 3 + 2] * alpha;
          lineColors[s2] = cr;
          lineColors[s2 + 1] = cg;
          lineColors[s2 + 2] = cb;
          lineColors[s2 + 3] = cr;
          lineColors[s2 + 4] = cg;
          lineColors[s2 + 5] = cb;
          seg += 2;
        }
      }
    }
    lineGeo.setDrawRange(0, seg);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;

    // 마우스 패럴럭스
    group.rotation.y += (mouseX * 0.35 - group.rotation.y) * 0.04;
    group.rotation.x += (-mouseY * 0.22 - group.rotation.x) * 0.04;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* 부드러운 원형 글로우 텍스처 (노드 스프라이트) */
function makeGlowTexture() {
  const size = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.25)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(cv);
  tex.needsUpdate = true;
  return tex;
}

/* ----------------------------------------------------------------
 * 2) 헤드라인 blur→focus 순차 리빌
 * ---------------------------------------------------------------- */
function initScrollReveal() {
  const lines = document.querySelectorAll('.hero-line');
  gsap.set(lines, { opacity: 0, y: 32, filter: 'blur(8px)' });
  gsap.to(lines, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 1,
    ease: 'power3.out',
    stagger: 0.13,
    delay: 0.2
  });
}

/* ----------------------------------------------------------------
 * 3) 통계 카운트업 — 뷰포트 진입 시 0 → 목표값
 * ---------------------------------------------------------------- */
function initCounters() {
  const stats = document.querySelectorAll('.stat[data-target]');

  stats.forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const numberEl = el.querySelector('.stat-number');
    const isDecimal = String(el.dataset.target).includes('.');
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            const display = isDecimal ? counter.val.toFixed(1) : Math.round(counter.val);
            numberEl.textContent = `${display}${suffix}`;
          }
        });
      }
    });
  });
}

/* ----------------------------------------------------------------
 * 4) Magnetic Hover — 버튼이 마우스를 따라 살짝 끌려오는 효과
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
      moveX(relX * 0.3);
      moveY(relY * 0.3);
    });

    btn.addEventListener('mouseleave', () => {
      moveX(0);
      moveY(0);
    });
  });
}
