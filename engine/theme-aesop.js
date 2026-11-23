// 디자인 시스템 "이솝" — 레퍼런스 aesop.com(2026-11-23, 1440×900 실측)의 톤앤매너를 테마로 옮긴 것.
// 원본 유료 글꼴(Zapf Humanist, Suisse Intl)은 쓰지 않고 무료 글꼴(Belleza, Inter, 한글 Gowun Dodum·Pretendard)로 바꿨다.
// 원본 로고·사진은 쓰지 않았다.

export const system = {
  name: "이솝",
  reference: "https://www.aesop.com/",
  mood: [
    "조용하고 지적인 '약국 겸 서재' 느낌: 크림색 종이 바탕에 짙은 회색 글자",
    "제목은 작고 부드러운 휴머니스트 글꼴(Optima 계열) — 크게 외치지 않고 낮게 말한다",
    "작은 안내 글자와 링크는 따뜻한 갈색(엄버), 강조는 오직 이 색 하나",
    "버튼은 얇은 선의 직사각형 + 글자 뒤 화살표, 모서리는 모두 직각",
    "사진은 크고 어둡게, 글은 그 옆이나 아래에 넉넉한 여백과 함께",
    "움직임은 느리고 부드럽게 — 서두르지 않는다",
  ],
  colors: [
    { id: "ink", name: "잉크(글자)", hex: "#333333", use: "글자, 진한 버튼" },
    { id: "cream", name: "크림(바탕)", hex: "#fffef2", use: "기본 바탕, 어두운 면 위 글자" },
    { id: "sand", name: "샌드", hex: "#f6f5e8", use: "보조 바탕(인증·안내 띠)" },
    { id: "umber", name: "엄버(갈색)", hex: "#945c26", use: "작은 안내 글자, 링크, 강조" },
    { id: "stone", name: "스톤(흐린 글자)", hex: "#666666", use: "보조 설명" },
    { id: "charcoal", name: "차콜", hex: "#252525", use: "어두운 섹션·푸터" },
    { id: "vermilion", name: "버밀리언", hex: "#ca432f", use: "한정판·알림 같은 드문 표시" },
    { id: "line", name: "선", hex: "rgba(51,51,51,.2)", use: "버튼 테두리, 구분선" },
  ],
  fonts: [
    { role: "제목", ref: "Zapf Humanist 400 (유료)", use: "Belleza 400 + Gowun Dodum(한글)" },
    { role: "본문·버튼·메뉴", ref: "Suisse Intl 400·500 (유료)", use: "Inter 400·500 + Pretendard" },
  ],
  type: [
    { id: "h1", size: 36, lh: 1.4, ls: 0, font: "display", w: 400, sample: "식물과 실험실에서 만든 처방" },
    { id: "h2", size: 31, lh: 1.33, ls: 0, font: "display", w: 400, sample: "목적 없는 고민의 끝" },
    { id: "h3", size: 18, lh: 1.5, ls: 0, font: "body", w: 700, sample: "주문과 고객 지원" },
    { id: "body-l", size: 16, lh: 1.7, ls: 0, font: "body", w: 400, sample: "선물을 고르는 시간이 끝나갑니다. 함께 나눌 감각적인 선물을 준비했어요." },
    { id: "label", size: 14, lh: 1.5, ls: 0, font: "body", w: 500, sample: "선물 찾기" },
    { id: "body", size: 14, lh: 1.6, ls: 0, font: "body", w: 400, sample: "가장 엄격한 사회·환경 기준을 지킵니다." },
    { id: "caption", size: 12, lh: 1.5, ls: 0, font: "body", w: 400, sample: "한 가지 크기" },
  ],
  spacing: [
    { name: "섹션 위아래", value: "120px 안팎(사진 섹션은 위아래 여백 없이 꽉 차게)" },
    { name: "가장자리 여백", value: "64px" },
    { name: "버튼", value: "높이 48px, 안쪽 13px 24px 12px, 1px 선, 직각" },
    { name: "모서리", value: "0 (작은 원형 조작 버튼만 50%)" },
  ],
  components: [
    { name: "버튼", spec: "투명 바탕 + 1px 흐린 선(rgba(51,51,51,.2)), 14px 중간 굵기, 글자 뒤 12px 띄우고 →. 마우스를 올리면 선이 진해짐" },
    { name: "어두운 면 위 버튼", spec: "1px 크림 선, 크림 글자" },
    { name: "눈썹·작은 링크", spec: "14px 중간 굵기 엄버색" },
    { name: "카드(상품)", spec: "샌드 바탕 위 사진, 선·그림자·모서리 없음, 아래 가운데 정렬 글" },
    { name: "머리말", spec: "맨 위 짙은 회색 알림 띠 + 크림 바탕에 가운데 워드마크, 아래 줄 가운데 메뉴, 오른쪽 선만 있는 검색칸" },
  ],
  motion: [
    { name: "등장", value: "느리게 스며들 듯(power1.out, 길이 1.3배)" },
    { name: "스크롤", value: "부드럽고 느긋하게(1.4초)" },
    { name: "버튼", value: "선 색만 0.3초에 걸쳐 바뀜" },
  ],
  sources: "화면 요소 실측값(글꼴·크기·색·테두리·여백). 레퍼런스는 CSS 변수를 거의 쓰지 않음",
};

const C = Object.fromEntries(system.colors.map((c) => [c.id, c.hex]));
const HUMAN = "'Belleza', 'Gowun Dodum', 'Pretendard Variable', sans-serif";
const SANS = "'Inter', 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif";

const S = 'html[data-theme="aesop"]';
const css = `
${S} body{font-weight:400;letter-spacing:0}
${S} ::selection{background:${C.sand};color:${C.ink}}
${S} section[data-tone="sand"]{--c-bg:${C.sand};--c-surface:${C.cream}}
${S} section[data-tone="dark"]{--c-bg:${C.charcoal};--c-fg:${C.cream};--c-surface:#2f2f2f;--c-muted:rgba(255,254,242,.6);--c-line:rgba(255,254,242,.2);--c-accent:#d9a46b}

/* 제목: 작고 부드럽게, 굵기 보통·자간 없음 */
${S} [data-module] :is(h1,h2){font-weight:400;letter-spacing:0}

/* 버튼: 얇은 선 직사각형 + 글자 뒤 화살표 */
${S} [data-module] a[class*="cta"],${S} [data-module] .cf-btn{display:inline-flex;align-items:center;justify-content:center;gap:12px;width:auto!important;height:48px;padding:13px 24px 12px!important;border:1px solid color-mix(in srgb,var(--c-fg) 20%,transparent)!important;border-radius:0!important;background:transparent!important;color:var(--c-fg)!important;box-shadow:none!important;font:500 14px/1.5 ${SANS}!important;letter-spacing:0!important;text-transform:none!important;transition:border-color .3s ease}
${S} [data-module] a[class*="cta"]::after,${S} [data-module] .cf-btn::after{content:"→";font:400 15px/1 ${SANS}}
${S} [data-module] a[class*="cta"]:hover,${S} [data-module] .cf-btn:hover{border-color:var(--c-fg)!important}
${S} [data-module] a[class*="cta"] svg,${S} [data-module] .cf-btn i{display:none}
${S} [data-module] a[class*="cta"].off{display:none!important}
${S} [data-module="pricing-flip-sig"] .ps-cta{margin-left:auto;margin-right:auto}

/* 눈썹·작은 안내 = 엄버 14px 중간 굵기 */
${S} [data-module] :is(.ps-save,.cf-label,.hws-lead){font-family:${SANS}!important;font-size:14px!important;font-weight:500!important;letter-spacing:0!important;text-transform:none!important;color:var(--c-accent,${C.umber})!important}
${S} [data-module="hero-window-sig"] .hws-lead{color:#e2b88a!important}

/* 카드: 직각, 선·그림자 없이 샌드 면 */
${S} [data-module] :is(.ecs-media,.sps-site,.ps-card-top,.cf-free-card){border:0!important;border-radius:0!important;box-shadow:none!important}
${S} [data-module="effects-cards-sig"]{--ecs-c1:#e9dfc9;--ecs-c2:#d9c8a6;--ecs-c3:${C.sand};--ecs-c4:#efe7d6}
${S} [data-module="pricing-flip-sig"] .ps-inner{border-radius:0;background:${C.sand};gap:32px}
${S} [data-module="pricing-flip-sig"] .ps-card-top{background:${C.cream}}
${S} [data-module="pricing-flip-sig"] .ps-whatsin li i{width:6px;height:6px;border-radius:50%;background:${C.umber}}
${S} [data-module="pricing-flip-sig"] .ps-to-y sup{color:${C.umber};font:500 11px/1 ${SANS};margin-left:4px}

/* 히어로: 어둡고 따뜻한 실내 + 엄버→샌드 하늘, 글자는 크림 */
${S} [data-module="hero-window-sig"]{--hws-ink:${C.cream};--hws-wall:#2a221d;--hws-sky-1:${C.umber};--hws-sky-2:${C.sand};--hws-blind:#d9cfb8}
${S} [data-module="hero-window-sig"] .hws-h{font-weight:400;letter-spacing:0}
`;

export default {
  id: "aesop",
  name: "이솝",
  fonts: [
    "https://fonts.googleapis.com/css2?family=Belleza&family=Gowun+Dodum&family=Inter:wght@400;500;700&display=swap",
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  ],
  tokens: {
    "font-display": HUMAN,
    "font-body": SANS,
    "display-weight": "400",
    "display-style": "normal",
    "display-tracking": "0em",
    "c-bg": C.cream,
    "c-fg": C.ink,
    "c-muted": C.stone,
    "c-accent": C.umber,
    "c-surface": C.sand,
    "c-line": C.line,
    "c-bg-alt": C.charcoal,
    "c-fg-alt": C.cream,
    ...Object.fromEntries(system.colors.map((c) => [`c-${c.id}`, c.hex])),
    "space-section": "120px",
    "grid-margin": "64px",
    "grid-gutter": "24px",
    radius: "0px",
  },
  motion: {
    ease: { out: "power1.out", inOut: "power1.inOut", back: "power1.inOut", elastic: "power1.out" },
    speed: 1.3,
    scrub: true,
  },
  scroll: { duration: 1.4, easing: "expo" },
  page: "aesop",
  css,
  system,
};
