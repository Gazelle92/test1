// mix-01 · 섹션 조합 단계 비교 (임성준 실장님 2026-11-24 요청)
// 1단계 그대로 붙이기 → 2단계 폰트 스타일 1번(trionn) 기준·흑백 → 3단계 스크롤·등장 모션 3번(focus) 기준. 킥 모션은 항상 원본 그대로.
// 원본 섹션 페이지(/clones/{site}/{slug}/)를 iframe으로 차례로 놓고 바깥 스크롤 하나로 각 섹션 안 스크롤을 움직인다(engine/compose.js 방식).
// 주소: /pages/mix/?step=1|2|3   — 단계를 바꾸면 페이지를 새로 불러 보던 위치로 돌아온다(앞 단계 상태가 섞이지 않게).
import Lenis from "lenis";

const BASE = import.meta.env.BASE_URL;
const q = new URLSearchParams(location.search);
const STEP = Math.min(3, Math.max(1, +(q.get("step") || 1)));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 원본에서 읽은 값 ─────────────────────────────────────────────
const expoOut = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));     // Lenis 기본(apekon·focus)
const cubicOut = (t) => 1 - Math.pow(1 - t, 3);                        // trionn
const SCROLL = {
  trionn: { duration: 1.05, easing: cubicOut, wheel: 0.85, label: "Lenis duration 1.05 · cubic-out · 휠 ×0.85 (Windows 값, Mac은 ×0.6)" },
  apekon: { duration: 1.2, easing: expoOut, wheel: 1, label: "Lenis duration 1.2 · expo-out · 휠 ×1" },
  focus: { duration: 1.0, easing: expoOut, wheel: 1, label: "Lenis duration 1.0 · expo-out · 휠 ×1" },
};
const REVEAL = {
  trionn: "단어(또는 글자)가 흐림 12px·투명 → 선명하게 (GSAP SplitText, power2.out)",
  apekon: "단어가 가림막 아래 115%에서 줄 단위로 올라옴 (mask-word)",
  focus: "글자·단어·줄이 투명·30% 아래 → 제자리 0.68초 expo.out, 간격 글자 .008초·단어 .02초·줄 .05초",
};

const ITEMS = [
  { id: "trionn/01-hero", site: "trionn", n: 1, title: "trionn 첫 검은 영역" },
  { id: "apekon/01-products", site: "apekon", n: 2, title: "apekon 카드 3장 패럴랙스" },
  { id: "focus/01-domains", site: "focus", n: 3, title: "focus Domains.~끝" },
];

// ── 2단계: 1번(trionn) 글자 체계 ───────────────────────────────────
// 1440 화면에서 잰 trionn 값을 vw로 바꿈(원본도 화면 너비에 비례)
const TFONT = `
@font-face{font-family:mxFamiljen;src:url(/_next/static/media/FamiljenGroteskVariable_Regular-s.p.04jxz-d23sc_e.woff2) format("woff2");font-weight:100 900;font-display:block}
@font-face{font-family:mxNeue;src:url(/_next/static/media/NeueHaasDisplay_Roman-s.p.0ykdwddnvy5f_.woff2) format("woff2");font-display:block}`;
const ROLE = {
  display: "font-family:mxFamiljen!important;font-weight:400!important;font-style:normal!important;font-size:9.164vw!important;line-height:1!important;letter-spacing:-.08em!important;text-transform:uppercase!important",
  h1: "font-family:mxFamiljen!important;font-weight:400!important;font-style:normal!important;font-size:6.25vw!important;line-height:.9!important;letter-spacing:-.06em!important;text-transform:none!important",
  h3: "font-family:mxFamiljen!important;font-weight:400!important;font-style:normal!important;font-size:3.333vw!important;line-height:.95!important;letter-spacing:-.05em!important;text-transform:none!important",
  label: "font-family:mxFamiljen!important;font-weight:400!important;font-style:normal!important;font-size:max(11px,1.0625vw)!important;line-height:1!important;letter-spacing:-.02em!important;text-transform:uppercase!important",
  small: "font-family:mxFamiljen!important;font-weight:400!important;font-style:normal!important;font-size:max(10px,.875vw)!important;line-height:1!important;letter-spacing:-.02em!important;text-transform:uppercase!important",
  body: "font-family:mxNeue!important;font-weight:400!important;font-style:normal!important;font-size:max(13px,1.125vw)!important;line-height:1.23!important;letter-spacing:0!important;text-transform:none!important",
};
// 역할 연결표(어느 글자를 1번의 어느 역할로 바꾸는지)
const MAP = {
  apekon: [
    ["h1", ".products__intro .home-section__heading", "Ideas, put to work. (90px)"],
    ["h3", ".product-panel__name", "카드 제목 3개 (48px)"],
    ["small", ".product-panel__status", "In development · Beta (12px)"],
    ["body", ".product-panel__text", "카드 본문 (24.7px)"],
    ["label", ".text-link", "Explore … 링크 (15px)"],
  ],
  focus: [
    ["display", ".type-display", "Domains. (154px)"],
    ["h1", ".type-h1", "News. (78px)"],
    ["label", ".type-h4", "도메인 이름 6개 (20px)"],
    ["label", ".type-title", "뉴스 제목 · All domains · Read all (15px)"],
    ["body", ".type-body", "소개 문장 (13px)"],
    ["body", ".type-nav", "푸터 항목 (13px)"],
    ["small", ".type-small", "도메인 설명 · 날짜 (11px)"],
    ["small", ".type-excerpt", "뉴스 설명 (11px)"],
    ["small", ".type-label", "푸터 Float · Pages (8px)"],
  ],
};
const fontCss = (site) => TFONT + (MAP[site] || []).map(([r, s]) => `${s},${s} *{${ROLE[r]}}`).join("\n");

// ── 3단계: 1·2번의 공통 등장 모션을 3번(focus) 방식으로 ────────────────
// 원본 등장 모션이 걸리는 글자(킥 모션 제외)를 최종 상태로 고정하고, 그 안의 글자를 focus 방식으로 다시 등장시킨다.
const RV_TARGETS = {
  trionn: ["#s1-headline h1", "#s1-cta", "#s1-stats .title", "#s1-box", "#s1-box + *", ".home-about span.title", ".home-about p", ".home-about .button_wrapper", "#vision-section .title"],
  apekon: [".products__intro .home-section__heading"],
};
// iframe 안에서 실행되는 코드(문자열로 넣음)
const revealScript = (sels) => `(function(){
var D=document,W=window,SEL=${JSON.stringify(sels)};
var st=D.createElement('style');st.setAttribute('data-clone-mix','');
st.textContent='.mx-fx,.mx-fx :is(.words,.chars,.lines,.mask-word,.mask-word__inner,.text):not(.words-wrapper,.words-wrapper *){opacity:1!important;filter:none!important;visibility:visible!important;transform:none!important;translate:none!important}.mxu{display:inline-block}';
D.head.appendChild(st);
var T=[];SEL.forEach(function(s){D.querySelectorAll(s).forEach(function(e){if(T.indexOf(e)<0)T.push(e)})});
T=T.filter(function(e){return !T.some(function(o){return o!==e&&o.contains(e)})});
var U={chars:8,words:20,lines:50};
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);(e.target.__mx||[]).forEach(function(a){a.play()})})},{rootMargin:'0px 0px -6% 0px'});
T.forEach(function(el){
  el.classList.add('mx-fx');
  var fs=parseFloat(getComputedStyle(el).fontSize)||16;
  var mode=fs>=60?'chars':'words';
  var tw=D.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;if(!n.textContent.trim()||!p||p.closest('svg,script,style,.visually-hidden,.words-wrapper,[data-split-shadow]'))return 2;return 1}});
  var ns=[],n;while(n=tw.nextNode())ns.push(n);
  var units=[];
  ns.forEach(function(t){var f=D.createDocumentFragment();var parts=mode==='chars'?t.textContent.split(''):t.textContent.split(/(\\s+)/);
    parts.forEach(function(p){if(!p)return;if(/^\\s+$/.test(p)){f.appendChild(D.createTextNode(p));return}var s=D.createElement('span');s.className='mxu';s.textContent=p;f.appendChild(s);units.push(s)});t.replaceWith(f)});
  if(mode==='words'){var tops=units.map(function(u){return Math.round(u.getBoundingClientRect().top)});var lines=[];tops.forEach(function(t){if(lines.indexOf(t)<0)lines.push(t)});if(lines.length>2&&el.tagName==='P')mode='lines';var li=tops.map(function(t){return lines.indexOf(t)})}
  el.__mx=units.map(function(u,i){var d=mode==='lines'?li[i]*U.lines:i*U[mode];
    var a=u.animate([{opacity:0,transform:'translateY(30%)'},{opacity:1,transform:'translateY(0)'}],{duration:680,delay:d,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});a.pause();a.currentTime=0;return a});
  el.dataset.mxMode=mode;
  io.observe(el);
});
W.__mxReveal={count:T.length,modes:T.map(function(e){return e.dataset.mxMode})};
})();`;

// ── 조립기 ───────────────────────────────────────────────────────
const root = document.getElementById("page");
let lenis = null;
const blocks = ITEMS.map((it) => {
  const el = document.createElement("section");
  el.className = "cb";
  el.dataset.n = it.n;
  el.innerHTML = `<div class="cb-stage"><iframe loading="eager" src="${BASE}clones/${it.id}/" title="${it.title}"></iframe><div class="cb-wait">불러오는 중… ${it.n}번 ${it.title}</div></div>`;
  root.appendChild(el);
  return { it, el, frame: el.querySelector("iframe"), ready: false, min: 0, range: 0, h: innerHeight, last: -1 };
});

function activeBlock() {
  const y = (lenis ? lenis.scroll : scrollY) + innerHeight / 2;
  return blocks.find((b) => y >= b.el.offsetTop && y < b.el.offsetTop + b.el.offsetHeight) || blocks[blocks.length - 1];
}
function scrollSpec() { return SCROLL[STEP === 3 ? "focus" : activeBlock().it.site]; }

function hookInput(b) {
  const w = b.frame.contentWindow;
  w.addEventListener("wheel", (e) => {
    e.preventDefault(); e.stopImmediatePropagation();
    window.dispatchEvent(new WheelEvent("wheel", { deltaX: e.deltaX, deltaY: e.deltaY, deltaMode: e.deltaMode }));
  }, { capture: true, passive: false });
  w.addEventListener("keydown", (e) => {
    const map = { ArrowDown: 80, ArrowUp: -80, PageDown: innerHeight * 0.9, PageUp: -innerHeight * 0.9, " ": innerHeight * 0.9 };
    if (map[e.key] && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); e.stopImmediatePropagation(); lenis.scrollTo(lenis.targetScroll + map[e.key]); }
    if (["1", "2", "3"].includes(e.key)) goStep(+e.key);
  }, { capture: true });
}

function inject(b) {
  const doc = b.frame.contentDocument;
  const site = b.it.site;
  doc.querySelectorAll("[data-clone-mix]").forEach((n) => n.remove());
  if (STEP >= 2) {
    b.frame.style.filter = "grayscale(1)";
    if (MAP[site]) {
      const s = doc.createElement("style"); s.setAttribute("data-clone-mix", ""); s.textContent = fontCss(site); doc.head.appendChild(s);
    }
  }
}
function injectReveal(b) {
  const sels = RV_TARGETS[b.it.site];
  if (STEP !== 3 || !sels) return;
  const s = b.frame.contentDocument.createElement("script");
  s.textContent = revealScript(sels);
  b.frame.contentDocument.body.appendChild(s);
}

async function measure(b) {
  const w = b.frame.contentWindow, d = b.frame.contentDocument;
  const docH = d.documentElement.scrollHeight, docMax = Math.max(0, docH - w.innerHeight);
  const r = typeof w.__cloneRange === "function" ? w.__cloneRange() : null;
  b.min = r ? r[0] : 0;
  const max = r ? (r[1] == null ? docMax : Math.min(docMax, r[1])) : docMax;
  b.range = Math.max(0, max - b.min);
  b.h = Math.min(innerHeight, docH);
  b.el.style.height = `${b.range + b.h}px`;
  b.el.querySelector(".cb-stage").style.height = `${b.h}px`;
  b.last = -1;
  lenis?.resize();
  sync();
}

async function prepare(b) {
  await new Promise((r) => (b.frame.contentDocument?.readyState === "complete" && b.frame.contentWindow.location.href !== "about:blank" ? r() : b.frame.addEventListener("load", r, { once: true })));
  hookInput(b);
  inject(b); // 글꼴은 일찍 넣어야 원본 스크립트가 바뀐 글꼴로 줄을 나눈다
  await wait(4200); // 원본 앱이 주소를 되돌리고(3.5초) 스크롤 엔진·고정 구간을 마칠 때까지
  b.frame.contentWindow.dispatchEvent(new Event("resize"));
  await wait(300);
  await measure(b);
  injectReveal(b);
  b.ready = true;
  b.el.classList.add("is-ready");
  for (const t of [3000, 6000]) setTimeout(() => measure(b), t);
}

function sync() {
  const y = lenis ? lenis.scroll : scrollY;
  for (const b of blocks) {
    if (!b.ready) continue;
    const local = Math.min(b.range, Math.max(0, y - b.el.offsetTop));
    if (Math.abs(local - b.last) < 0.5) continue;
    b.last = local;
    b.frame.contentWindow.scrollTo(0, b.min + local);
  }
  const sp = scrollSpec();
  if (lenis && lenis.options.duration !== sp.duration) { lenis.options.duration = sp.duration; lenis.options.easing = sp.easing; }
  const nb = activeBlock();
  const now = document.getElementById("now");
  if (now) now.textContent = `${nb.it.n}번 섹션 · 스크롤 ${STEP === 3 ? "3번 값" : nb.it.n + "번 값"}`;
}

// 휠 배율은 섹션마다 다르므로 Lenis에 넘기기 전에 곱한다
addEventListener("wheel", (e) => {
  if (e.__mx) return;
  const m = scrollSpec().wheel;
  if (m === 1) return;
  e.stopImmediatePropagation(); e.preventDefault();
  const ev = new WheelEvent("wheel", { deltaX: e.deltaX * m, deltaY: e.deltaY * m, deltaMode: e.deltaMode, cancelable: true });
  ev.__mx = true;
  window.dispatchEvent(ev);
}, { capture: true, passive: false });

lenis = new Lenis({ duration: scrollSpec().duration, easing: scrollSpec().easing, lerp: 0, smoothWheel: true });
lenis.on("scroll", sync);
const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
requestAnimationFrame(raf);
addEventListener("resize", () => blocks.forEach((b) => b.ready && measure(b)));

// 단계 바꾸기: 지금 보던 섹션과 그 안 위치를 기억했다가 새로 불러온 뒤 돌아간다
function goStep(n) {
  if (n === STEP) return;
  const b = activeBlock();
  try { sessionStorage.setItem("mix-pos", JSON.stringify({ n: b.it.n, local: Math.max(0, (lenis?.scroll || 0) - b.el.offsetTop) })); } catch {}
  const u = new URL(location.href); u.searchParams.set("step", n); location.href = u.toString();
}
window.goStep = goStep;
addEventListener("keydown", (e) => { if (["1", "2", "3"].includes(e.key) && !e.metaKey && !e.ctrlKey) goStep(+e.key); });

Promise.all(blocks.map(prepare)).then(() => {
  let pos = null;
  try { pos = JSON.parse(sessionStorage.getItem("mix-pos") || "null"); sessionStorage.removeItem("mix-pos"); } catch {}
  lenis.resize(); // 섹션 높이가 정해진 뒤 스크롤 끝 위치를 다시 잰다
  if (pos) { const b = blocks.find((x) => x.it.n === pos.n); if (b) lenis.scrollTo(b.el.offsetTop + Math.min(pos.local, b.range), { immediate: true, force: true }); }
  document.documentElement.classList.add("all-ready");
});

// ── 설명 패널 ─────────────────────────────────────────────────────
const T = {
  1: ["1단계 · 그대로 붙이기", "세 원본 섹션을 원본 코드 그대로 돌려 이어 붙였습니다. 글꼴·색·이미지·3D·모션 모두 원본입니다. 스크롤은 지금 보는 섹션의 원본 값으로 바뀝니다."],
  2: ["2단계 · 폰트 스타일 1번 기준 · 흑백", "2·3번 글자를 1번(trionn)의 글자 역할로 바꾸고, 세 섹션 모두 흑백으로 만들었습니다. 글자 말고는 손대지 않아서 넘치거나 겹치는 곳도 그대로 둡니다."],
  3: ["3단계 · 스크롤·등장 모션 3번 기준", "페이지 전체 스크롤을 3번(focus) 값으로 고정하고, 1·2번의 공통 등장 모션을 3번 방식으로 바꿨습니다. 각 섹션의 킥 모션은 원본 그대로입니다. (2단계의 글꼴·흑백도 그대로 유지)"],
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function panel() {
  const [h, p] = T[STEP];
  const roleRows = [...MAP.apekon.map((r) => ["2번", ...r]), ...MAP.focus.map((r) => ["3번", ...r])];
  const roleVal = { display: "Familjen 132px 대문자", h1: "Familjen 90px", h3: "Familjen 48px (대체)", label: "Familjen 15.3px 대문자", small: "Familjen 12.6px 대문자", body: "Neue Haas 16.2px" };
  document.getElementById("ptxt").innerHTML = `<h4>${h}</h4><p>${p}</p>
  <table><tr><th>섹션</th><th>스크롤</th><th>공통 등장 모션</th></tr>
  ${ITEMS.map((it) => `<tr><td>${it.n}번</td><td>${esc(SCROLL[STEP === 3 ? "focus" : it.site].label)}</td><td>${esc(REVEAL[STEP === 3 ? "focus" : it.site])}</td></tr>`).join("")}</table>
  ${STEP >= 2 ? `<table><tr><th>섹션</th><th>글자</th><th>→ 1번 역할</th></tr>${roleRows.map(([s, r, , d]) => `<tr><td>${s}</td><td>${esc(d)}</td><td>${esc(roleVal[r])}</td></tr>`).join("")}</table>
  <small>1번에 48px 근처 글자가 없어 카드 제목은 h1 비율로 정한 48px을 썼습니다. 1번 글꼴 파일은 trionn 원본 파일을 그대로 씁니다.</small>` : ""}
  <p><b>킥 모션 (항상 원본)</b><br>1번: 3D 심볼, 선 만지기·길게 눌러 터뜨리기, 헤드라인 단어 바뀜, about 문장 채워지기, 비전 마키<br>2번: 카드 도착·뒤로 밀리며 작아지고 어두워짐, 카드 안 글자 순서대로 올라옴, 3D 머리·신호 그림<br>3번: 도메인 그림 선 그리기, 호버 시 흰 띠, 구분선 긋기</p>
  <small>원본: trionn.com · apekon.com · focusindustries.tech (내부 비교용). 키보드 1·2·3으로도 단계를 바꿀 수 있습니다.</small>`;
  document.querySelectorAll("#bar [data-step]").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.step === STEP));
}
panel();
document.querySelectorAll("#bar [data-step]").forEach((b) => b.addEventListener("click", () => goStep(+b.dataset.step)));
const pn = document.getElementById("panel"), info = document.getElementById("info");
info.addEventListener("click", () => { pn.hidden = !pn.hidden; info.setAttribute("aria-expanded", !pn.hidden); });
document.getElementById("close").addEventListener("click", () => { pn.hidden = true; info.setAttribute("aria-expanded", false); });
window.mix = { blocks, get lenis() { return lenis; }, STEP };
