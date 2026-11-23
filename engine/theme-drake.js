// 디자인 시스템 "드레이크" — 레퍼런스 thedrake.ca(2026-11-20, 1440×900 실측)의 톤앤매너를 테마로 옮긴 것.
// 원본 유료 글꼴(Sequel Sans, Maison Mono)은 쓰지 않고 가장 가까운 무료 글꼴(Inter Tight, DM Mono, 한글 Pretendard)로 바꿨다.
// 원본 그림(손글씨 밑줄·일러스트·로고)은 쓰지 않고 같은 성격의 그림을 새로 그렸다.

// ── 시스템 값(문서·디자인 시스템 화면에서도 같이 씀) ─────────────────────────
export const system = {
  name: "드레이크",
  reference: "https://thedrake.ca/",
  mood: [
    "부티크 호텔다운 '편집된 갤러리' 느낌: 흰 바탕, 거의 검정 글자, 1px 검은 선으로 나눈 칸",
    "큰 그로테스크 제목을 단어마다 얇은 상자에 넣고, 한 단어에 손으로 그은 파란 밑줄",
    "작은 글자는 모두 고정폭(모노) 대문자 — 안내판·티켓 같은 정보 느낌",
    "모서리는 전부 직각, 버튼은 네모 상자 + 동그란 화살표 한 쌍",
    "중간중간 와인·라벤더·크림 색 면으로 섹션을 크게 바꿔 리듬을 만든다",
    "움직임은 튕김 없이 빠르게 붙는 등장(1초, 0.1초 간격)",
  ],
  colors: [
    { id: "ink", name: "잉크(본문·선)", hex: "#222223", use: "글자, 1px 선, 버튼 테두리" },
    { id: "paper", name: "종이(바탕)", hex: "#ffffff", use: "기본 바탕, 단어 상자 바탕" },
    { id: "cream", name: "크림", hex: "#f0eeeb", use: "보조 바탕(소식·카드 묶음)" },
    { id: "wine", name: "와인", hex: "#672b3c", use: "강조 섹션 바탕(흰 글자)" },
    { id: "lavender", name: "라벤더", hex: "#b5b7d8", use: "강조 섹션 바탕, 어두운 바탕 위 작은 글자" },
    { id: "sapphire", name: "사파이어", hex: "#3e64cf", use: "손글씨 밑줄, 포인트" },
    { id: "jade", name: "제이드", hex: "#20a556", use: "상태·링크 포인트" },
    { id: "pistachio", name: "피스타치오", hex: "#d5e7b5", use: "보조 포인트(드물게)" },
    { id: "coral", name: "코랄", hex: "#e25856", use: "보조 포인트(드물게)" },
  ],
  fonts: [
    { role: "제목(디스플레이)", ref: "Sequel Sans Medium Disp 415", use: "Inter Tight 500 + Pretendard 500" },
    { role: "본문", ref: "Sequel Sans Book Body 400", use: "Inter Tight 400 + Pretendard 400" },
    { role: "라벨·버튼·메뉴", ref: "Maison Mono 400, 대문자", use: "DM Mono 400 + Pretendard 400, 대문자" },
  ],
  // 원본 크기(1440 기준) — 줄간격·자간은 원본 비율
  type: [
    { id: "display-xl", size: 110, lh: 0.85, ls: -0.03, font: "display", sample: "우리를 만나 보세요" },
    { id: "h1", size: 64, lh: 1, ls: -0.03, font: "display", sample: "드레이크를 만나다" },
    { id: "h2", size: 49, lh: 1.2, ls: -0.03, font: "display", sample: "이번 주 소식" },
    { id: "h3", size: 37, lh: 1, ls: -0.02, font: "display", sample: "드레이크 호텔" },
    { id: "h4", size: 29, lh: 1.1, ls: -0.01, font: "display", sample: "와인 투어" },
    { id: "lead", size: 22, lh: 1.2, ls: 0, font: "display", sample: "도시와 시골, 두 곳의 이야기" },
    { id: "body", size: 16, lh: 1.5, ls: 0, font: "body", sample: "창작이 연결로 이어지는 곳. 머무는 동안 탐험하고 참여하고 영감을 얻으세요." },
    { id: "mono-l", size: 16, lh: 1.3, ls: 0, font: "mono", upper: true, sample: "About · What's on" },
    { id: "mono", size: 14, lh: 1.3, ls: 0, font: "mono", upper: true, sample: "Toronto, ON" },
    { id: "mono-s", size: 12, lh: 1.3, ls: 0, font: "mono", upper: true, sample: "Pick a location" },
    { id: "mono-xs", size: 10, lh: 1.3, ls: 0, font: "mono", upper: true, sample: "At the Drake Hotel" },
  ],
  spacing: [
    { name: "기본 단위", value: "4px (모든 여백이 4의 배수)" },
    { name: "화면 가장자리 여백", value: "32px (모바일 16px)" },
    { name: "칸 사이 간격", value: "20px · 12칸 그리드 (모바일 16px · 4칸)" },
    { name: "섹션 위/아래", value: "64px / 32px, 섹션 사이 1px 선" },
    { name: "제목 묶음 위아래", value: "32px" },
    { name: "버튼·메뉴 높이", value: "50px (머리말 메뉴 44px)" },
  ],
  components: [
    { name: "단어 상자 제목", spec: "단어마다 1px 잉크 테두리 + 흰 바탕, 안쪽 여백 0.125em 0.125em 0, 서로 1px 겹침(margin -1px)" },
    { name: "손글씨 밑줄", spec: "제목 두 번째 단어 아래 사파이어색 손으로 그은 선, 1초 동안 그려짐" },
    { name: "버튼", spec: "모노 대문자 14px, 높이 50px 네모(1px 테두리, 직각) + 바로 붙은 50px 동그라미 화살표" },
    { name: "라벨 칩", spec: "모노 대문자 10px, 잉크 바탕 흰 글자, 모서리 4px, 여백 8px 10px" },
    { name: "카드", spec: "사진 + 1px 잉크 테두리 칸, 직각, 그림자 없음" },
    { name: "머리말", spec: "왼쪽 위 로고 상자 + 모노 메뉴 상자들, 오른쪽 위 MENU·BOOK 상자(모두 1px 선, 흰 바탕)" },
  ],
  motion: [
    { name: "등장", value: "1초, 0.1초 간격, 튕김 없는 빠른 감속(expo.out에 가까운 곡선)" },
    { name: "단어 제목 등장", value: "단어마다 0.46초 아래→위, 0.1초 간격" },
    { name: "사라짐", value: "0.36초" },
    { name: "스크롤", value: "Lenis 부드러운 스크롤" },
  ],
  sources: "글꼴·색·크기·여백은 thedrake.ca의 CSS 변수(--color-*, --grid-*, --anim-*)와 화면 요소 실측값",
};

const C = Object.fromEntries(system.colors.map((c) => [c.id, c.hex]));
const MONO = "'DM Mono', 'Pretendard Variable', Pretendard, ui-monospace, monospace";
const SANS = "'Inter Tight', 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif";

// 손으로 그은 밑줄(새로 그림)
const SCRIBBLE = `<svg class="ds-scribble" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path d="M6 27 C 38 12, 64 33, 102 22 S 168 5, 206 18 S 262 33, 294 13" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>`;

// 제목 꾸미기: 글자를 쪼개 움직이는 제목(data-* 표시가 있는 것)·화면에서 숨긴 제목은 건드리지 않는다
function boxWords(el) {
  el.querySelectorAll("h1, h2").forEach((h) => {
    if ([...h.attributes].some((a) => a.name.startsWith("data-"))) return;
    if (/(^|[\s-])sr($|[\s-])|sr-only|visually-hidden/.test(h.className)) return;
    if ([...h.children].some((c) => c.tagName !== "BR")) return;
    const text = h.textContent.trim();
    if (!text || text.length > 60) return;
    const lines = h.innerHTML.split(/<br\s*\/?>/i).map((l) => l.replace(/<[^>]+>/g, "").trim()).filter(Boolean);
    let n = 0;
    h.innerHTML = lines.map((l) => l.split(/\s+/).map((w) => {
      const ul = n++ === 1; // 두 번째 단어에 밑줄
      return `<span class="ds-word${ul ? " ds-ul" : ""}">${w}${ul ? SCRIBBLE : ""}</span>`;
    }).join("")).join("<br>");
    h.setAttribute("aria-label", text.replace(/\s+/g, " "));
    h.classList.add("ds-boxed");
  });
}

const S = 'html[data-theme="drake"]';
const css = `
${S} body{font-weight:400;font-feature-settings:"ss01"}
${S} ::selection{background:${C.lavender};color:${C.ink}}
/* 섹션 사이 1px 선 */
${S} section[data-module]+section[data-module]{border-top:1px solid ${C.ink}}
/* 강조 섹션 바탕: 페이지 설정에서 tone 으로 고른다 (alt=와인, lavender, cream, ink) */
${S} section[data-tone="lavender"]{--c-bg:${C.lavender};--c-fg:${C.ink};--c-surface:${C.paper};--c-muted:color-mix(in srgb,${C.ink} 65%,${C.lavender})}
${S} section[data-tone="cream"]{--c-bg:${C.cream};--c-fg:${C.ink};--c-surface:${C.paper}}
${S} section[data-tone="ink"]{--c-bg:${C.ink};--c-fg:${C.paper};--c-surface:#2e2e30;--c-muted:${C.lavender};--c-line:rgba(240,238,235,.1)}

/* 단어 상자 제목 + 손글씨 밑줄 */
${S} .ds-boxed{line-height:1!important;letter-spacing:-.03em}
${S} .ds-word{position:relative;display:inline-block;margin:-1px 0 0 -1px;padding:.125em .125em 0;border:1px solid ${C.ink};background:${C.paper};color:${C.ink};font-style:normal}
${S} .ds-scribble{position:absolute;left:-6%;bottom:-.22em;width:112%;height:.32em;overflow:visible;color:${C.sapphire};pointer-events:none}
${S} .ds-scribble path{stroke-dasharray:1;stroke-dashoffset:1;animation:ds-draw 1s .6s cubic-bezier(.16,1,.3,1) forwards}
@keyframes ds-draw{to{stroke-dashoffset:0}}

/* 버튼: 네모 + 동그라미 화살표 */
${S} [data-module] a[class*="cta"],${S} [data-module] .cf-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;width:auto!important;height:50px;margin-right:49px;padding:0 20px;border:1px solid currentColor;border-radius:0!important;background:transparent!important;color:var(--c-fg)!important;font:400 14px/1 ${MONO}!important;letter-spacing:0!important;text-transform:uppercase;box-shadow:none!important}
${S} [data-module] a[class*="cta"]::after,${S} [data-module] .cf-btn::after{content:"→";position:absolute;left:100%;top:-1px;width:50px;height:50px;margin-left:-1px;display:grid;place-items:center;border:1px solid currentColor;border-radius:50%;background:transparent;font:400 14px/1 ${MONO};transition:transform .4s cubic-bezier(.16,1,.3,1)}
${S} [data-module] a[class*="cta"]:hover::after,${S} [data-module] .cf-btn:hover::after{transform:translateX(4px)}
${S} [data-module] a[class*="cta"] svg,${S} [data-module] .cf-btn i{display:none}
${S} [data-module="pricing-flip-sig"] .ps-cta{margin-left:auto;margin-right:auto;transform:translateX(-25px)}
${S} [data-module] a[class*="cta"].off{display:none!important}
/* 히어로: 레퍼런스 첫 화면처럼 어두운 실내 + 노을빛 하늘 */
${S} [data-module="hero-window-sig"]{--hws-wall:#2a2a2c;--hws-sky-1:${C.coral};--hws-sky-2:${C.lavender};--hws-blind:${C.cream}}

/* 작은 글자 = 모노 대문자 */
${S} [data-module] :is([class$="-label"],[class*="-label "],[class*="kicker"],[class*="eyebrow"],.ps-save,.ps-gt,.ps-top button,.ps-bottom,.hws-scroll,.jfs-dt,.jfs-item span,.jfs-headline,.cf-label){font-family:${MONO}!important;font-weight:400!important;letter-spacing:0!important;text-transform:uppercase}
${S} [data-module="pricing-flip-sig"] .ps-label{font-size:14px}
/* 라벨 칩 */
${S} [data-module] .ps-to-y sup{display:inline-block;margin-left:6px;padding:4px 6px;border-radius:4px;background:${C.ink};color:${C.paper};font:400 10px/1 ${MONO};vertical-align:middle}

/* 카드·면: 직각 + 1px 잉크 선, 그림자 없음 */
${S} [data-module] :is(.ecs-media,.sps-site,.ps-card-top,.cf-free-card){border:1px solid ${C.ink};border-radius:0!important;box-shadow:none!important}
${S} [data-module="pricing-flip-sig"] .ps-inner{border:1px solid ${C.ink};border-radius:0;background:${C.cream};gap:20px}
${S} [data-module="pricing-flip-sig"] .ps-whatsin li i{border-radius:0;width:10px;height:10px}
${S} [data-module="showcase-pinned-sig"] .sps-bar{border-bottom:1px solid ${C.ink}}
`;

export default {
  id: "drake",
  name: "드레이크",
  fonts: [
    "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap",
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  ],
  tokens: {
    "font-display": SANS,
    "font-body": SANS,
    "font-mono": MONO,
    "display-weight": "500",
    "display-style": "normal",
    "display-tracking": "-0.03em",
    "c-bg": C.paper,
    "c-fg": C.ink,
    "c-muted": "#6f6f72",
    "c-accent": C.sapphire,
    "c-surface": C.cream,
    "c-line": C.ink,
    "c-bg-alt": C.wine,
    "c-fg-alt": C.paper,
    ...Object.fromEntries(system.colors.map((c) => [`c-${c.id}`, c.hex])),
    "space-section": "64px",
    "grid-margin": "32px",
    "grid-gutter": "20px",
    "btn-h": "50px",
    radius: "0px",
  },
  motion: {
    ease: { out: "expo.out", inOut: "power3.inOut", back: "power3.inOut", elastic: "expo.out" }, // 튕김 없음
    speed: 1,
    scrub: true,
  },
  scroll: { duration: 1.2, easing: "expo" },
  page: "drake", // 이 테마를 적용한 시범 페이지(pages/drake)
  css,
  decorate: boxWords,
  system,
};
