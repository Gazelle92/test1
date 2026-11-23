// 디자인 시스템 "대퍼" — 레퍼런스 dapper.agency(2026-11-20, 1440×900 실측)의 톤앤매너를 테마로 옮긴 것.
// 원본 유료 글꼴(Helvetica Now Display/Text, Ivy Presto Headline)은 쓰지 않고 무료 글꼴(Inter Tight, Inter, Instrument Serif, 한글 Pretendard·Noto Serif KR)로 바꿨다.
// 원본 그림(로고·잎 아이콘·노이즈 이미지·사진)은 쓰지 않고 같은 성격의 것을 새로 만들었다(노이즈는 SVG로 생성).

export const system = {
  name: "대퍼",
  reference: "https://www.dapper.agency/",
  mood: [
    "B2B 마케팅 에이전시다운 '자신감 있는 실무' 느낌: 연회색 종이 질감(노이즈) 바탕에 거의 검정 글자",
    "아주 굵고 촘촘한 그로테스크 제목 속 한 단어만 가는 이탤릭 세리프로 바꿔 사람 냄새를 낸다",
    "포인트는 민트 하나 — 버튼, 화살표 칸, 픽셀 블록 장식에만 쓴다",
    "흰 카드(둥근 모서리 18px) 위에 숫자·결과를 크게, 회색 칩에 작은 설명",
    "화면 위쪽 가운데에 떠 있는 흰 메뉴 막대, 마지막은 거의 검정 면의 푸터",
    "섹션 위아래를 넉넉하게(144px) 비워 정보가 숨 쉬게 한다",
  ],
  colors: [
    { id: "dark", name: "다크(글자)", hex: "#212121", use: "글자, 푸터 바탕" },
    { id: "light", name: "라이트(바탕)", hex: "#f3f3f3", use: "기본 바탕(노이즈 질감)" },
    { id: "white", name: "화이트", hex: "#ffffff", use: "카드·메뉴 막대·버튼 안 화살표 칸" },
    { id: "primary", name: "민트", hex: "#74f5a1", use: "버튼, 화살표 칸, 픽셀 장식, 눈썹 아이콘" },
    { id: "primary-light", name: "민트 밝게", hex: "#d5fce3", use: "픽셀 장식 보조, 선택 표시" },
    { id: "primary-dark", name: "민트 어둡게", hex: "#3c7c52", use: "밝은 바탕 위 민트 글자" },
    { id: "secondary", name: "퍼플", hex: "#c35fff", use: "아주 드물게 쓰는 보조 포인트" },
    { id: "dark-tint", name: "다크 틴트", hex: "#191919", use: "어두운 면 안 카드" },
    { id: "grey", name: "흐린 글자", hex: "#919191", use: "보조 글자" },
  ],
  fonts: [
    { role: "제목(디스플레이)", ref: "Helvetica Now Display 700", use: "Inter Tight 700 + Pretendard 700" },
    { role: "본문", ref: "Helvetica Now Text 500", use: "Inter 500 + Pretendard 500" },
    { role: "강조 한 단어", ref: "Ivy Presto Headline 이탤릭", use: "Instrument Serif 이탤릭 + Noto Serif KR(한글은 바로 세움)" },
  ],
  type: [
    { id: "h1", size: 96, lh: 0.95, ls: -0.03, font: "display", sample: "성과를 내는 마케팅 엔진", em: "엔진" },
    { id: "h2", size: 78, lh: 1, ls: -0.03, font: "display", sample: "세계적인 팀을 우리 팀처럼", em: "팀처럼" },
    { id: "h2-s", size: 60, lh: 1.1, ls: -0.02, font: "display", sample: "무료 전략 상담 받기", em: "전략" },
    { id: "quote", size: 33, lh: 1.3, ls: -0.02, font: "display", w: 500, sample: "“영업 기회가 200% 늘었습니다.”" },
    { id: "h3", size: 24, lh: 1.2, ls: -0.02, font: "display", sample: "콘텐츠와 크리에이티브" },
    { id: "lead", size: 19.5, lh: 1.4, ls: -0.03, font: "body", w: 700, sample: "유럽의 B2B 마케팅 에이전시입니다." },
    { id: "eyebrow", size: 18, lh: 1.2, ls: -0.01, font: "display", sample: "결과" },
    { id: "body", size: 16.5, lh: 1.6, ls: -0.02, font: "body", w: 500, sample: "좋은 마케팅이 더 나은 성과로 이어집니다. 전략부터 콘텐츠, 광고, 측정까지 함께 만듭니다." },
    { id: "small", size: 15, lh: 1.5, ls: -0.02, font: "body", w: 500, sample: "더 많은 상담 요청" },
    { id: "caption", size: 12, lh: 1.6, ls: -0.02, font: "body", w: 500, sample: "버튼을 누르면 이용 약관에 동의하게 됩니다." },
  ],
  spacing: [
    { name: "기본 단위", value: "1em = 화면너비/120 (1440에서 12px). 모든 값이 em 배수" },
    { name: "가장자리 여백", value: "3em = 36px" },
    { name: "간격", value: "S 12px · 기본 18px · L 36px · XL 54px" },
    { name: "섹션 위아래", value: "144px (반 72px · 3/4 108px)" },
    { name: "모서리", value: "S 6px(버튼·칩) · M 12px · L 18px(카드), 화살표 칸 3px" },
    { name: "픽셀 장식 한 칸", value: "3em = 36px 정사각" },
  ],
  components: [
    { name: "이탤릭 한 단어", spec: "굵은 제목 속 한 단어만 세리프 이탤릭(같은 크기의 0.97배, 굵기 보통)" },
    { name: "버튼", spec: "민트 바탕, 모서리 6px, 안쪽 여백 6px 6px 6px 12px, 글자 15px 굵게 + 오른쪽 30px 흰 정사각(모서리 3px) 안에 ↗" },
    { name: "눈썹(섹션 이름)", spec: "작은 민트 아이콘 + 굵은 18px 글자, 제목 바로 위" },
    { name: "카드", spec: "흰 바탕, 모서리 18px, 선·그림자 없음. 안의 숫자 칩은 연회색 바탕 모서리 6px" },
    { name: "픽셀 장식", spec: "36px 민트·밝은 민트 정사각 몇 칸을 섹션 모서리에 계단처럼" },
    { name: "메뉴 막대", spec: "화면 위 가운데 떠 있는 흰 막대(모서리 6px), 마지막에 민트 화살표 칸" },
    { name: "질감", spec: "바탕 전체에 고운 노이즈(불투명도 0.35)" },
  ],
  motion: [
    { name: "스크롤", value: "Lenis 부드러운 스크롤" },
    { name: "등장", value: "튕김 없이 부드럽게 감속(power3.out)" },
    { name: "버튼", value: "마우스를 올리면 화살표 칸이 살짝 커짐" },
  ],
  sources: "색·여백·모서리는 dapper.agency의 CSS 변수(--color-*, --section-padding, --border-radius-*, --pixel)와 화면 요소 실측값",
};

const C = Object.fromEntries(system.colors.map((c) => [c.id, c.hex]));
const DISPLAY = "'Inter Tight', 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif";
const TEXT = "'Inter', 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif";
const SERIF = "'Instrument Serif', 'Noto Serif KR', serif";

// 고운 노이즈(새로 생성)
const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`;

// 꾸미기: ① 단순한 제목의 마지막 단어를 이탤릭 세리프로 ② 섹션 모서리에 픽셀 블록
let nth = 0;
function decorate(el) {
  el.querySelectorAll("h1, h2").forEach((h) => {
    if ([...h.attributes].some((a) => a.name.startsWith("data-"))) return;
    if (/(^|[\s-])sr($|[\s-])|sr-only|visually-hidden/.test(h.className)) return;
    if ([...h.children].some((c) => c.tagName !== "BR")) return;
    const text = h.textContent.trim();
    if (!text || text.length > 60) return;
    const html = h.innerHTML.trim().replace(/\s+$/, "");
    const m = html.match(/^(.*?)([^\s>]+)(\s*)$/s); // 마지막 단어
    if (!m) return;
    h.innerHTML = `${m[1]}<em class="dp-em">${m[2]}</em>`;
    h.setAttribute("aria-label", text.replace(/\s+/g, " "));
  });
  const side = nth++ % 2 ? "dp-px-l" : "dp-px-r";
  const cells = [[0, 0, "a"], [1, 0, "b"], [1, 1, "a"], [2, 1, "b"], [2, 2, "a"]];
  el.insertAdjacentHTML("beforeend", `<div class="dp-px ${side}" aria-hidden="true">${cells.map(([x, y, k]) => `<i class="dp-px-${k}" style="--x:${x};--y:${y}"></i>`).join("")}</div>`);
}

const S = 'html[data-theme="dapper"]';
const css = `
${S} body{font-weight:500;letter-spacing:-.02em}
/* 종이 질감 */
${S} body::after{content:"";position:fixed;inset:0;z-index:80;pointer-events:none;background:${NOISE};opacity:.35;mix-blend-mode:multiply}
${S} section[data-tone="dark"]{--c-bg:${C.dark};--c-fg:${C.light};--c-surface:${C["dark-tint"]};--c-muted:${C.grey};--c-line:rgba(243,243,243,.12)}
${S} section[data-tone="white"]{--c-bg:${C.white};--c-surface:${C.light}}

/* 이탤릭 한 단어 */
${S} .dp-em{font-family:${SERIF};font-style:italic;font-weight:400;font-size:.97em;letter-spacing:0;font-synthesis:none}
/* 제목 */
${S} [data-module] :is(h1,h2){font-weight:700;letter-spacing:-.03em}

/* 버튼: 민트 + 흰 화살표 칸 */
${S} [data-module] a[class*="cta"],${S} [data-module] .cf-btn{position:relative;display:inline-flex;align-items:center;gap:9px;width:auto!important;height:42px;padding:6px 42px 6px 12px!important;border:0!important;border-radius:6px!important;background:${C.primary}!important;color:${C.dark}!important;font:700 15px/1 ${TEXT}!important;letter-spacing:-.02em!important;text-transform:none!important;box-shadow:none!important}
${S} [data-module] a[class*="cta"]::after,${S} [data-module] .cf-btn::after{content:"↗";position:absolute;right:6px;top:6px;width:30px;height:30px;display:grid;place-items:center;border-radius:3px;background:${C.white};color:${C.dark};font:700 14px/1 ${TEXT};transition:transform .3s cubic-bezier(.22,1,.36,1)}
${S} [data-module] a[class*="cta"]:hover::after,${S} [data-module] .cf-btn:hover::after{transform:scale(1.12)}
${S} [data-module] a[class*="cta"] svg,${S} [data-module] .cf-btn i{display:none}

/* 눈썹: 작은 민트 아이콘 + 굵은 글자 */
${S} [data-module] :is(.ps-save,.cf-label,.hws-lead){font-family:${DISPLAY}!important;font-weight:700!important;letter-spacing:-.01em!important;text-transform:none!important}
${S} [data-module] :is(.ps-save,.cf-label)::before{content:"";display:inline-block;width:.75em;height:.6em;margin-right:.5em;background:${C.primary};clip-path:polygon(0 0,100% 0,60% 100%,0 70%);vertical-align:.05em}

/* 카드: 흰 바탕·둥근 18px·선 없음 */
${S} [data-module] :is(.ecs-media,.sps-site,.ps-card-top,.cf-free-card){border:0!important;border-radius:18px!important;box-shadow:none!important}
${S} [data-module="pricing-flip-sig"] .ps-inner{border-radius:18px;background:${C.white};gap:18px}
${S} [data-module="pricing-flip-sig"] .ps-card-top{background:${C.light}}
${S} [data-module="pricing-flip-sig"] .ps-whatsin li i{border-radius:3px;background:${C.primary}}
${S} [data-module="pricing-flip-sig"] .ps-to-y sup{display:inline-block;margin-left:6px;padding:3px 6px;border-radius:6px;background:${C.primary};color:${C.dark};font:700 11px/1 ${TEXT}}
${S} [data-module="pricing-flip-sig"] .ps-cta{margin-left:auto;margin-right:auto}
${S} [data-module] a[class*="cta"].off{display:none!important}

/* 히어로: 레퍼런스처럼 흑백 톤 */
${S} [data-module="hero-window-sig"]{--hws-ink:${C.dark};--hws-sky-1:#cfcfcf;--hws-sky-2:${C.light};--hws-wall:#e4e4e4;--hws-blind:#d6d6d6}
${S} [data-module="hero-window-sig"] .hws-overlay{opacity:.35}
${S} [data-module="hero-window-sig"] .hws-h{font-weight:700}

/* 픽셀 블록 장식 */
${S} .dp-px{position:absolute;z-index:3;width:108px;height:108px;pointer-events:none}
${S} .dp-px-r{right:0;top:0}
${S} .dp-px-l{left:0;bottom:0;transform:scaleY(-1)}
${S} .dp-px i{position:absolute;left:calc(var(--x)*36px);top:calc(var(--y)*36px);width:36px;height:36px}
${S} .dp-px-a{background:${C.primary}}
${S} .dp-px-b{background:${C["primary-light"]}}
html:not([data-theme="dapper"]) .dp-px{display:none}
`;

export default {
  id: "dapper",
  name: "대퍼",
  fonts: [
    "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700&family=Inter:wght@500;700&family=Instrument+Serif:ital@1&family=Noto+Serif+KR:wght@400;500&display=swap",
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  ],
  tokens: {
    "font-display": DISPLAY,
    "font-body": TEXT,
    "font-serif": SERIF,
    "display-weight": "700",
    "display-style": "normal",
    "display-tracking": "-0.03em",
    "c-bg": C.light,
    "c-fg": C.dark,
    "c-muted": C.grey,
    "c-accent": C.primary,
    "c-surface": C.white,
    "c-line": "rgba(33,33,33,.12)",
    "c-bg-alt": C.dark,
    "c-fg-alt": C.light,
    ...Object.fromEntries(system.colors.map((c) => [`c-${c.id}`, c.hex])),
    "space-section": "144px",
    "grid-margin": "36px",
    "grid-gutter": "18px",
    radius: "18px",
  },
  motion: {
    ease: { out: "power3.out", inOut: "power2.inOut", back: "power3.inOut", elastic: "power3.out" },
    speed: 1,
    scrub: true,
  },
  scroll: { duration: 1.2, easing: "expo" },
  page: "dapper", // 이 테마를 적용한 시범 페이지(pages/dapper)
  css,
  decorate,
  system,
};
