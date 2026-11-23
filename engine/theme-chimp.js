// 디자인 시스템 "침프" — 레퍼런스 mailchimp.com(2026-11-20, 1440×900 실측)의 톤앤매너를 테마로 옮긴 것.
// 원본 유료·전용 글꼴(Means Web, Tally)은 쓰지 않고 무료 글꼴(Fraunces, Figtree, 한글 Noto Serif KR·Pretendard)로 바꿨다.
// 원본 로고·일러스트·사진은 쓰지 않았다(손글씨 밑줄은 새로 그림).

export const system = {
  name: "침프",
  reference: "https://mailchimp.com/",
  mood: [
    "친근하고 자신감 있는 '밝은 실무 도구' 느낌: 흰 바탕에 따뜻한 검정(페퍼콘) 글자",
    "제목은 둥글고 부드러운 세리프 — 딱딱한 소프트웨어보다 사람이 쓴 글처럼",
    "포인트는 진한 노랑 하나: 알약 모양 버튼, 형광펜처럼 단어 뒤에 칠한 노란 상자, 손으로 그은 노란 밑줄",
    "흰 카드(모서리 24px)를 연회색 면 위에 넉넉히 늘어놓고, 링크 끝엔 노란 동그라미 화살표",
    "중간중간 따뜻한 검정 면으로 숫자·성과를 크게 보여 준다",
    "움직임은 차분하게 — 버튼은 마우스를 올리면 살짝 떠오르며 아래에 그림자 두께가 생긴다",
  ],
  colors: [
    { id: "peppercorn", name: "페퍼콘(글자·어두운 면)", hex: "#231e15", use: "글자, 버튼 테두리, 어두운 섹션" },
    { id: "coconut", name: "코코넛(바탕)", hex: "#ffffff", use: "기본 바탕, 카드" },
    { id: "cavendish", name: "카벤디시(노랑)", hex: "#ffe01b", use: "버튼, 형광펜 상자, 화살표 동그라미, 밑줄" },
    { id: "smoke", name: "연회색 면", hex: "#f5f5f5", use: "카드를 늘어놓는 섹션 바탕" },
    { id: "oyster", name: "오이스터", hex: "#dbd9d2", use: "구분선, 비활성 버튼" },
    { id: "linen", name: "리넨", hex: "#efeeea", use: "따뜻한 보조 바탕" },
    { id: "kale", name: "케일", hex: "#004e56", use: "링크·보조 강조 글자(드물게)" },
    { id: "apricot", name: "살구", hex: "#e7b75f", use: "일러스트 보조색(드물게)" },
    { id: "muted", name: "흐린 글자", hex: "rgba(35,30,21,.65)", use: "보조 설명" },
  ],
  fonts: [
    { role: "제목", ref: "Means Web 400 (전용 세리프)", use: "Fraunces 400 + Noto Serif KR 500" },
    { role: "본문·버튼·메뉴", ref: "Tally 400·500·700 (전용 산세리프)", use: "Figtree 400·500·700 + Pretendard" },
  ],
  type: [
    { id: "h1", size: 64, lh: 1.2, ls: -0.02, font: "display", w: 400, sample: "아이디어를 이어 주는 메일", em: "이어 주는" },
    { id: "h2", size: 48, lh: 1.17, ls: -0.02, font: "display", w: 400, sample: "우리 가게에 맞게 써 보세요" },
    { id: "h2-s", size: 40, lh: 1.12, ls: -0.0125, font: "display", w: 400, sample: "62일 만에 11억 달러 매출", em: "11억 달러" },
    { id: "h3", size: 23, lh: 1.3, ls: 0, font: "body", w: 400, sample: "쉽게 디자인하기" },
    { id: "lead", size: 20, lh: 1.6, ls: 0, font: "body", w: 400, sample: "놓친 고객을 다시 부르는 다음 기회를 찾아 드려요." },
    { id: "body", size: 16, lh: 1.5, ls: 0, font: "body", w: 400, sample: "몇 분 만에 메일을 만들고, 고객마다 다른 내용을 보내세요." },
    { id: "link", size: 15, lh: 2.1, ls: 0, font: "body", w: 500, sample: "콘텐츠 도구 둘러보기" },
    { id: "small", size: 14, lh: 1.5, ls: 0, font: "body", w: 400, sample: "카드 결제 없이 시작" },
    { id: "nav", size: 13, lh: 1.5, ls: 0, font: "body", w: 700, sample: "요금제 · 기능 · 자료" },
  ],
  spacing: [
    { name: "섹션 위아래", value: "80px (좁은 띠 32·40·64px)" },
    { name: "카드", value: "모서리 24px, 카드 사이 24~32px, 그림자·선 없음" },
    { name: "버튼", value: "높이 44px 알약(모서리 26px), 안쪽 여백 12px 24px" },
    { name: "작은 모서리", value: "4px(입력칸·칩), 형광펜 상자 3px" },
    { name: "화살표 동그라미", value: "지름 32px" },
  ],
  components: [
    { name: "형광펜 단어", spec: "제목 마지막 단어 뒤에 노란 상자(모서리 3px, 여백 .06em .18em), 글자는 페퍼콘" },
    { name: "손글씨 밑줄", spec: "강조 단어 아래 노란 손그림 선(새로 그림)" },
    { name: "버튼", spec: "노란 알약, 1px 페퍼콘 테두리, 13px 굵게. 마우스를 올리면 2px 떠오르고 아래로 4px 페퍼콘 두께" },
    { name: "화살표 링크", spec: "15px 글자 + 오른쪽 32px 노란 동그라미 안 →" },
    { name: "카드", spec: "흰 바탕 모서리 24px, 연회색 면 위에" },
    { name: "머리말", spec: "맨 위 페퍼콘 알림 띠 + 흰 메뉴 막대(굵은 13px 메뉴, 오른쪽 테두리 알약 '로그인' + 노란 알약)" },
  ],
  motion: [
    { name: "등장", value: "차분한 감속(power2.out)" },
    { name: "버튼", value: "떠오름 0.2초" },
    { name: "스크롤", value: "브라우저 기본에 가까운 짧은 부드러움" },
  ],
  sources: "버튼·링크 색은 mailchimp.com CSS 변수(--cta-*, --copy-color*, --selection-*), 나머지는 화면 요소 실측값",
};

const C = Object.fromEntries(system.colors.map((c) => [c.id, c.hex]));
const SERIF = "'Fraunces', 'Noto Serif KR', Georgia, serif";
const SANS = "'Figtree', 'Pretendard Variable', Pretendard, -apple-system, 'Apple SD Gothic Neo', sans-serif";

// 손으로 그은 밑줄(새로 그림)
const SCRIBBLE = `<svg class="mc-scribble" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><path d="M4 20 C 60 8, 120 26, 180 14 S 270 10, 296 18" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" pathLength="1"/></svg>`;

// 꾸미기: 단순한 제목의 마지막 단어 → 노란 형광펜 상자. 섹션 안 두 번째 제목부터는 손글씨 밑줄로 바꿔 단조로움을 덜어 준다
let nth = 0;
function decorate(el) {
  el.querySelectorAll("h1, h2").forEach((h) => {
    if ([...h.attributes].some((a) => a.name.startsWith("data-"))) return;
    if (/(^|[\s-])sr($|[\s-])|sr-only|visually-hidden/.test(h.className)) return;
    if ([...h.children].some((c) => c.tagName !== "BR")) return;
    const text = h.textContent.trim();
    if (!text || text.length > 60) return;
    const m = h.innerHTML.trim().match(/^(.*?)([^\s>]+)(\s*)$/s);
    if (!m) return;
    const ul = nth++ % 2 === 1;
    h.innerHTML = ul ? `${m[1]}<span class="mc-ul">${m[2]}${SCRIBBLE}</span>` : `${m[1]}<mark class="mc-hl">${m[2]}</mark>`;
    h.setAttribute("aria-label", text.replace(/\s+/g, " "));
  });
}

const S = 'html[data-theme="chimp"]';
const css = `
${S} body{font-weight:400}
${S} ::selection{background:rgba(255,224,27,.35)}
${S} section[data-tone="grey"]{--c-bg:${C.smoke};--c-surface:${C.coconut}}
${S} section[data-tone="linen"]{--c-bg:${C.linen};--c-surface:${C.coconut}}
${S} section[data-tone="dark"]{--c-bg:${C.peppercorn};--c-fg:${C.coconut};--c-surface:#2f2a20;--c-muted:rgba(255,255,255,.65);--c-line:rgba(255,255,255,.14)}
${S} section[data-tone="yellow"]{--c-bg:${C.cavendish};--c-fg:${C.peppercorn};--c-surface:${C.coconut};--c-muted:rgba(35,30,21,.7);--c-accent:${C.peppercorn}}

/* 제목: 부드러운 세리프 400 */
${S} [data-module] :is(h1,h2){font-weight:400;letter-spacing:-.02em}
/* 형광펜 단어 + 손글씨 밑줄 */
${S} .mc-hl{font-style:normal;padding:.06em .18em;border-radius:3px;background:${C.cavendish};color:${C.peppercorn};-webkit-box-decoration-break:clone;box-decoration-break:clone}
${S} section[data-tone="yellow"] .mc-hl{background:${C.coconut}}
${S} .mc-ul{position:relative;display:inline-block;isolation:isolate}
${S} .mc-scribble{position:absolute;left:-4%;bottom:-.12em;width:108%;height:.3em;z-index:-1;color:${C.cavendish};overflow:visible}
${S} section[data-tone="yellow"] .mc-scribble{color:${C.coconut}}
${S} .mc-scribble path{stroke-dasharray:1;stroke-dashoffset:1;animation:mc-draw .9s .5s cubic-bezier(.22,1,.36,1) forwards}
@keyframes mc-draw{to{stroke-dashoffset:0}}

/* 버튼: 노란 알약 + 1px 테두리, 떠오르며 두께 */
${S} [data-module] a[class*="cta"],${S} [data-module] .cf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:auto!important;height:44px;padding:12px 24px!important;border:0!important;border-radius:26px!important;background:${C.cavendish}!important;color:${C.peppercorn}!important;box-shadow:0 0 0 1px ${C.peppercorn}!important;font:700 13px/1.5 ${SANS}!important;letter-spacing:0!important;text-transform:none!important;transition:transform .2s cubic-bezier(.22,1,.36,1),box-shadow .2s cubic-bezier(.22,1,.36,1)}
${S} [data-module] a[class*="cta"]:hover,${S} [data-module] .cf-btn:hover{transform:translateY(-2px);box-shadow:0 0 0 1px ${C.peppercorn},0 4px 0 1px ${C.peppercorn}!important}
${S} [data-module] a[class*="cta"] svg,${S} [data-module] .cf-btn i{display:none}
${S} [data-module] a[class*="cta"].off{display:none!important}
${S} [data-module] .cf-btn+.cf-btn{background:transparent!important}
${S} [data-module="pricing-flip-sig"] .ps-cta{margin-left:auto;margin-right:auto}

/* 작은 안내 글자 = 화살표 링크 느낌(굵게 + 노란 동그라미) */
${S} [data-module] :is(.ps-save,.cf-label){font-family:${SANS}!important;font-weight:500!important;letter-spacing:0!important;text-transform:none!important}
${S} [data-module] .ps-save::after{content:"→";display:inline-grid;place-items:center;width:32px;height:32px;margin-left:10px;border-radius:50%;background:${C.cavendish};color:${C.peppercorn};font-weight:700;vertical-align:middle}

/* 카드: 흰 바탕·모서리 24px·선 없음 */
${S} [data-module] :is(.ecs-media,.sps-site,.ps-card-top,.cf-free-card){border:0!important;border-radius:24px!important;box-shadow:none!important}
${S} [data-module="pricing-flip-sig"] .ps-inner{border-radius:24px;background:${C.coconut};gap:24px}
${S} [data-module="pricing-flip-sig"] .ps-card-top{background:${C.smoke}}
${S} [data-module="pricing-flip-sig"] .ps-whatsin li i{width:18px;height:18px;border-radius:50%;background:${C.cavendish};box-shadow:inset 0 0 0 1px ${C.peppercorn}}
${S} [data-module="pricing-flip-sig"] .ps-to-y sup{display:inline-block;margin-left:6px;padding:3px 8px;border-radius:12px;background:${C.peppercorn};color:${C.coconut};font:500 11px/1.4 ${SANS}}
${S} [data-module="pricing-flip-sig"] .ps-rond{background:${C.peppercorn}}
${S} [data-module="pricing-flip-sig"] .ps-back{background:${C.cavendish}}

/* 히어로: 따뜻한 실내 + 노란 하늘, 글자는 페퍼콘 */
${S} [data-module="hero-window-sig"]{--hws-ink:${C.peppercorn};--hws-wall:${C.linen};--hws-sky-1:${C.cavendish};--hws-sky-2:#fff8cc;--hws-blind:${C.oyster}}
${S} [data-module="hero-window-sig"] .hws-overlay{opacity:.25}
${S} [data-module="hero-window-sig"] .hws-h{font-weight:400;letter-spacing:-.03em}
`;

export default {
  id: "chimp",
  name: "침프",
  fonts: [
    "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Figtree:wght@400;500;700&family=Noto+Serif+KR:wght@400;500&display=swap",
    "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  ],
  tokens: {
    "font-display": SERIF,
    "font-body": SANS,
    "display-weight": "400",
    "display-style": "normal",
    "display-tracking": "-0.02em",
    "c-bg": C.coconut,
    "c-fg": C.peppercorn,
    "c-muted": C.muted,
    "c-accent": C.cavendish,
    "c-surface": C.smoke,
    "c-line": C.oyster,
    "c-bg-alt": C.peppercorn,
    "c-fg-alt": C.coconut,
    ...Object.fromEntries(system.colors.map((c) => [`c-${c.id}`, c.hex])),
    "space-section": "80px",
    "grid-margin": "32px",
    "grid-gutter": "24px",
    radius: "24px",
  },
  motion: {
    ease: { out: "power2.out", inOut: "power2.inOut", back: "back.out(1.4)", elastic: "power2.out" },
    speed: 1,
    scrub: true,
  },
  scroll: { duration: 0.9, easing: "expo" },
  page: "chimp", // 이 테마를 적용한 시범 페이지(pages/chimp)
  css,
  decorate,
  system,
};
