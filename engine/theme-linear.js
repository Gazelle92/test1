// 디자인 시스템 "리니어" — 레퍼런스 linear.app(2026-11-23, 1440×900 실측)의 톤앤매너를 테마로 옮긴 것.
// 본문 글꼴은 레퍼런스와 같은 Inter(무료). 유료 고정폭 글꼴(Berkeley Mono)은 JetBrains Mono로 바꿨다. 원본 로고·화면 이미지는 쓰지 않았다.

export const system = {
  name: "리니어",
  reference: "https://linear.app/",
  mood: [
    "정밀한 제품 도구다운 '어두운 작업실' 느낌: 거의 검정 바탕에 밝은 회백 글자",
    "제목은 중간 굵기(510)의 Inter를 촘촘하게 — 두 번째 문장은 흐린 회색으로 낮춘다",
    "선은 흰색 8% — 칸과 카드를 아주 얇게 나눌 뿐, 그림자는 쓰지 않는다",
    "버튼은 알약 모양: 주 버튼은 밝은 회백 바탕, 보조 버튼은 반투명 유리",
    "포인트 색은 인디고 하나, 화면 뒤에서 은은하게 번지는 빛으로만",
    "움직임은 짧고 빠르게(0.1~0.25초), 감속은 부드럽게(ease-out-quart)",
  ],
  colors: [
    { id: "base", name: "베이스(바탕)", hex: "#08090a", use: "기본 바탕" },
    { id: "raised", name: "한 단 위 면", hex: "#0f1011", use: "카드 묶음 섹션, 머리말" },
    { id: "card", name: "카드", hex: "#101112", use: "카드·패널 바탕" },
    { id: "text", name: "글자", hex: "#f7f8f8", use: "제목·본문" },
    { id: "text-2", name: "흐린 글자", hex: "#8a8f98", use: "설명, 두 번째 문장, 메뉴" },
    { id: "text-3", name: "더 흐린 글자", hex: "#62666d", use: "캡션, 비활성" },
    { id: "invert", name: "주 버튼", hex: "#e5e5e6", use: "주 버튼 바탕(글자는 베이스)" },
    { id: "indigo", name: "인디고", hex: "#5e6ad2", use: "포인트 빛, 선택 표시" },
    { id: "line", name: "선", hex: "rgba(255,255,255,.08)", use: "칸·카드 테두리" },
  ],
  fonts: [
    { role: "제목·본문", ref: "Inter Variable 400·510·590", use: "Inter 400·500·600 + Pretendard" },
    { role: "코드·라벨", ref: "Berkeley Mono (유료)", use: "JetBrains Mono + Pretendard" },
  ],
  type: [
    { id: "display", size: 72, lh: 1, ls: -0.022, font: "display", w: 510, sample: "미래를 위해 만든 도구" },
    { id: "h1", size: 64, lh: 1, ls: -0.022, font: "display", w: 510, sample: "팀과 에이전트를 위한 시스템" },
    { id: "h2", size: 48, lh: 1, ls: -0.022, font: "display", w: 510, sample: "새로운 종류의 제품 도구." },
    { id: "lead", size: 24, lh: 1.33, ls: -0.012, font: "body", w: 400, sample: "대화를 자동으로 할 일로 바꿔 드려요." },
    { id: "h3", size: 20, lh: 1.33, ls: -0.012, font: "body", w: 590, sample: "더 빠른 앱 실행" },
    { id: "body", size: 15, lh: 1.6, ls: -0.011, font: "body", w: 400, sample: "계획부터 출시까지 한곳에서 움직입니다." },
    { id: "small", size: 13, lh: 1.5, ls: 0, font: "body", w: 400, sample: "제품 · 자료 · 고객 · 요금" },
    { id: "mono", size: 14, lh: 1.7, ls: 0, font: "mono", w: 400, sample: "import { 계획 } from '리니어'" },
  ],
  spacing: [
    { name: "섹션 위아래", value: "128px, 섹션 사이 흰색 8% 선" },
    { name: "본문 최대 너비", value: "1024px, 가장자리 24px(넓은 화면 32px)" },
    { name: "머리말 높이", value: "72px, 뒤 흐림 20px" },
    { name: "모서리", value: "4 · 6 · 8 · 12(카드) · 16 · 24px, 버튼은 알약(9999px)" },
  ],
  components: [
    { name: "주 버튼", spec: "알약, 바탕 #e5e5e6·글자 #08090a, 16px 510, 높이 44px·안쪽 20px(작은 것 32px·12px)" },
    { name: "보조 버튼", spec: "알약, 바탕 흰색 5% + 안쪽 1px 흰색 3% 선, 글자 밝게" },
    { name: "두 톤 제목", spec: "제목 두 번째 줄(문장)을 흐린 회색으로" },
    { name: "카드", spec: "바탕 #101112, 1px 흰색 8% 선, 모서리 12px, 그림자 없음" },
    { name: "빛 번짐", spec: "섹션 위쪽에 인디고 빛이 아주 옅게 퍼짐" },
    { name: "머리말", spec: "반투명 검정 + 뒤 흐림, 13px 흐린 메뉴, 오른쪽 '로그인' 글자 + 밝은 알약" },
  ],
  motion: [
    { name: "빠른 전환", value: "0.1초" },
    { name: "보통 전환", value: "0.25초" },
    { name: "감속 곡선", value: "ease-out-quart (.165,.84,.44,1)" },
  ],
  sources: "글꼴 굵기·모서리·곡선·전환 시간은 linear.app CSS 변수(--font-weight-*, --radius-*, --ease-*, --speed-*), 색은 화면 실측값",
};

const C = Object.fromEntries(system.colors.map((c) => [c.id, c.hex]));
const SANS = "'Inter', 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif";
const MONO = "'JetBrains Mono', 'Pretendard Variable', ui-monospace, monospace";

// 꾸미기: 두 줄짜리 제목의 두 번째 줄을 흐린 회색으로(레퍼런스의 두 톤 제목)
function decorate(el) {
  el.querySelectorAll("h1, h2").forEach((h) => {
    if ([...h.attributes].some((a) => a.name.startsWith("data-"))) return;
    if (/(^|[\s-])sr($|[\s-])|sr-only|visually-hidden/.test(h.className)) return;
    if ([...h.children].some((c) => c.tagName !== "BR")) return;
    const parts = h.innerHTML.split(/<br\s*\/?>/i);
    if (parts.length < 2) return;
    const text = h.textContent.trim();
    h.innerHTML = `${parts[0]}<br><span class="ln-dim">${parts.slice(1).join("<br>")}</span>`;
    h.setAttribute("aria-label", text.replace(/\s+/g, " "));
  });
}

const S = 'html[data-theme="linear"]';
const css = `
${S} body{font-weight:400;letter-spacing:-.011em;-webkit-font-smoothing:antialiased}
${S} ::selection{background:rgba(94,106,210,.45);color:#fff}
${S} section[data-module]+section[data-module]{border-top:1px solid ${C.line}}
${S} section[data-tone="raised"]{--c-bg:${C.raised}}
/* 섹션 위 인디고 빛 번짐 */
${S} section[data-tone="glow"]{background:radial-gradient(60% 40% at 50% 0%,rgba(94,106,210,.18),transparent 70%),${C.base}}

/* 제목: Inter 510, 촘촘하게, 두 번째 줄은 흐리게 */
${S} [data-module] :is(h1,h2){font-weight:510;letter-spacing:-.022em}
${S} .ln-dim{color:${C["text-2"]}}

/* 버튼: 알약. 주 = 밝은 회백, 보조 = 반투명 유리 */
${S} [data-module] a[class*="cta"],${S} [data-module] .cf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto!important;height:44px;padding:0 20px!important;border:1px solid ${C.invert}!important;border-radius:9999px!important;background:${C.invert}!important;color:${C.base}!important;box-shadow:0 1px 1px rgba(0,0,0,.07),0 3px 2px rgba(0,0,0,.04)!important;font:510 16px/1 ${SANS}!important;letter-spacing:0!important;text-transform:none!important;transition:background .1s,transform .25s cubic-bezier(.165,.84,.44,1)}
${S} [data-module] a[class*="cta"]:hover,${S} [data-module] .cf-btn:hover{background:#fff!important}
${S} [data-module] .cf-btn+.cf-btn{border:0!important;background:rgba(255,255,255,.05)!important;color:${C.text}!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.03),inset 0 1px 0 rgba(255,255,255,.04),0 0 0 1px rgba(0,0,0,.6),0 4px 4px rgba(0,0,0,.1)!important}
${S} [data-module] a[class*="cta"] svg,${S} [data-module] .cf-btn i{display:none}
${S} [data-module] a[class*="cta"].off{display:none!important}
${S} [data-module="pricing-flip-sig"] .ps-cta{margin-left:auto;margin-right:auto}

/* 작은 안내 = 고정폭 흐린 글자 */
${S} [data-module] :is(.ps-save,.cf-label,.ps-gt,.hws-scroll){font-family:${MONO}!important;font-size:13px!important;font-weight:400!important;letter-spacing:0!important;text-transform:none!important;color:${C["text-2"]}!important}

/* 카드: #101112 + 흰색 8% 선, 모서리 12px */
${S} [data-module] :is(.ecs-media,.sps-site,.ps-card-top,.cf-free-card){border:1px solid ${C.line}!important;border-radius:12px!important;box-shadow:none!important}
${S} [data-module="effects-cards-sig"]{--ecs-ink:${C.text};--ecs-c1:${C.card};--ecs-c2:#14151a;--ecs-c3:#181a22;--ecs-c4:${C.card}}
${S} [data-module="effects-cards-sig"] .ecs-media span{opacity:.12}
${S} [data-module="pricing-flip-sig"]{--ps-paper:${C.card};--ps-ink:${C.text};--ps-grey:${C["text-2"]}}
${S} [data-module="pricing-flip-sig"] .ps-inner{border:1px solid ${C.line};border-radius:16px;background:${C.raised};gap:24px}
${S} [data-module="pricing-flip-sig"] .ps-back{background:${C.raised};border-color:${C.line}}
${S} [data-module="pricing-flip-sig"] .ps-rond{background:${C.text}}
${S} [data-module="pricing-flip-sig"] .ps-whatsin li i{width:14px;height:14px;border-radius:4px;background:${C.indigo}}
${S} [data-module="pricing-flip-sig"] .ps-to-y sup{display:inline-block;margin-left:6px;padding:2px 6px;border-radius:9999px;background:rgba(94,106,210,.18);color:#aab2ff;font:510 11px/1.4 ${SANS}}
${S} [data-module="showcase-pinned-sig"] .sps-bar{background:#16171a;border-bottom:1px solid ${C.line}}

/* 히어로: 어두운 작업실 + 인디고 빛 하늘 */
${S} [data-module="hero-window-sig"]{--hws-ink:${C.text};--hws-wall:#0c0d0e;--hws-sky-1:${C.indigo};--hws-sky-2:#1a1c2e;--hws-blind:#1c1d21}
${S} [data-module="hero-window-sig"] .hws-h{font-weight:510;letter-spacing:-.04em}
${S} [data-module="hero-window-sig"] .hws-overlay{opacity:.6}
`;

export default {
  id: "linear",
  name: "리니어",
  fonts: [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap",
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  ],
  tokens: {
    "font-display": SANS,
    "font-body": SANS,
    "font-mono": MONO,
    "display-weight": "510",
    "display-style": "normal",
    "display-tracking": "-0.022em",
    "c-bg": C.base,
    "c-fg": C.text,
    "c-muted": C["text-2"],
    "c-accent": C.indigo,
    "c-surface": C.card,
    "c-line": C.line,
    "c-bg-alt": C.raised,
    "c-fg-alt": C.text,
    ...Object.fromEntries(system.colors.map((c) => [`c-${c.id}`, c.hex])),
    "space-section": "128px",
    "grid-margin": "32px",
    "grid-gutter": "24px",
    radius: "12px",
  },
  motion: {
    ease: { out: "power3.out", inOut: "power2.inOut", back: "power3.out", elastic: "power3.out" },
    speed: 0.85,
    scrub: true,
  },
  scroll: { duration: 1.0, easing: "expo" },
  page: "linear",
  css,
  decorate,
  system,
};
