// mix-01 한 페이지(iframe 없음) · 1단계: 세 원본 섹션을 원본 그대로
// 원본 HTML·CSS는 그대로(/clones/one/_capture), 모션은 원본 번들에서 읽은 숫자로 다시 건다. trionn 3D 심볼은 원본 코드를 그대로 옮겨 실행한다.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initGrid } from "./grid.js";
import { preload, reveal } from "./preload.js";
import { initPerf, enableFree, onScreen } from "./perf.js";

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const T = $('[data-mx="trionn"]'), A = $('[data-mx="apekon"]'), F = $('[data-mx="focus"]');

// ── 스크롤: Lenis 하나. 원본 값(번들에서 읽음)을 화면 가운데 섹션에 맞춰 바꿔 끼운다 ──
const cubicOut = (t) => 1 - Math.pow(1 - t, 3), expoOut = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));
const SCROLL = { trionn: { duration: 1.05, easing: cubicOut, wheel: 0.85 }, apekon: { duration: 1.2, easing: expoOut, wheel: 1 }, focus: { duration: 1.0, easing: expoOut, wheel: 1 } };
// 2번 apekon은 원본 스크립트를 그대로 실행한다(카드가 천처럼 휘는 WebGL 면·실크 배경·3D 머리·카드 등장 연출이 모두 이 안에 있음).
// 원본이 만드는 Lenis(window.lenis)를 페이지 전체 스크롤 엔진으로 같이 쓴다 → 스크롤 엔진은 하나.
// 배포 빌드에서는 묶인 one.js가 apekon 원본보다 먼저 실행된다 → 원본이 Lenis를 만들 때까지 잠깐 기다린다(최대 8초)
for (let t = 0; t < 160 && !(window.lenis && typeof window.lenis.on === "function"); t++) await new Promise((r) => setTimeout(r, 50));
let lenis = window.lenis;
if (!lenis || typeof lenis.on !== "function") { lenis = new Lenis({ duration: 1.05, easing: cubicOut, lerp: 0, autoRaf: false }); gsap.ticker.add((t) => lenis.raf(t * 1000)); window.lenis = lenis; }
lenis.start?.();
// apekon 원본이 실행 중에 html 에 넣는 값(--frame-inset 등)을 apekon 상자에도 똑같이 넣는다
// (원본 CSS의 :root 값을 상자에 옮겨 두었기 때문에, 그대로 두면 원본 스크립트가 바꾼 값이 가려져 카드 폭·위치가 달라짐)
{ const syncVars = () => { const st = document.documentElement.style; for (let i = 0; i < st.length; i++) { const k = st[i]; if (k.startsWith("--")) A.style.setProperty(k, st.getPropertyValue(k)); } };
  new MutationObserver(syncVars).observe(document.documentElement, { attributes: true, attributeFilter: ["style"] }); syncVars(); }
// apekon 원본 첫 화면 인트로(hero·로고 장면)는 한 페이지에 없어서 끝나지 않는다 → 로딩이 끝나면 인트로 대기 표시를 직접 풀어 카드·WebGL 면이 시작되게 한다
{ let n = 0; const rel = setInterval(() => { // 30초 동안 계속 확인(원본이 다시 걸어도 푼다)
  if (!document.body.classList.contains("loaded")) return;
  const had = document.documentElement.classList.contains("intro-pending");
  document.documentElement.classList.remove("intro-pending"); 
  if (had) { dispatchEvent(new Event("resize")); window.onScroll?.(); ScrollTrigger.refresh(); }
  if (++n > 60) clearInterval(rel); }, 500); }
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);
const secs = [T, A, F];
function activeSite() { const m = innerHeight / 2; for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= m && r.bottom > m) return s.dataset.mx; } return "focus"; }
lenis.on("scroll", () => { const sp = SCROLL[activeSite()]; if (lenis.options.duration !== sp.duration) { lenis.options.duration = sp.duration; lenis.options.easing = sp.easing; } setWheel(sp.wheel); });
// 섹션별 휠 배율: Lenis 안쪽 휠 처리기의 배율 값을 바로 바꾼다(가짜 휠 이벤트를 다시 보내면 Lenis가 받지 못함)
const setWheel = (m) => { const vs = lenis.virtualScroll; if (vs && vs.options) vs.options.wheelMultiplier = m; lenis.options.wheelMultiplier = m; };
setWheel(SCROLL.trionn.wheel);

// ── 공통: 글자 쪼개기 ──
function split(el, mode, cls = "") { // mode: chars | words
  const out = [];
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.textContent.trim() && !n.parentElement.closest("svg") ? 1 : 2) });
  const nodes = []; let n; while ((n = tw.nextNode())) nodes.push(n);
  for (const t of nodes) {
    const f = document.createDocumentFragment();
    for (const w of t.textContent.split(/(\s+)/)) {
      if (!w) continue;
      if (/^\s+$/.test(w)) { f.append(document.createTextNode(w)); continue; }
      const ws = document.createElement("span"); ws.className = "words " + cls; ws.style.display = "inline-block";
      if (mode === "chars") for (const c of w) { const cs = document.createElement("span"); cs.className = "chars"; cs.style.display = "inline-block"; cs.textContent = c; ws.append(cs); out.push(cs); }
      else { ws.textContent = w; out.push(ws); }
      f.append(ws);
    }
    t.replaceWith(f);
  }
  return out;
}
const linesOf = (parts) => { const L = []; let top = null; for (const p of parts) { const y = Math.round(p.getBoundingClientRect().top); if (top === null || Math.abs(y - top) > 4) { L.push([]); top = y; } L[L.length - 1].push(p); } return L; };

// ════════ 1번 trionn ════════
// BlurTextReveal(원본): 글자·단어가 투명+흐림 12px → 선명, power2.out
function blurReveal(el, { mode = "words", stagger = 0.05, delay = 0, start = "top 90%", dur = 0.8 } = {}) {
  if (!el) return;
  el.style.visibility = "visible";
  const parts = split(el, mode);
  gsap.set(parts, { autoAlpha: 0, filter: "blur(12px)" });
  gsap.to(parts, { autoAlpha: 1, filter: "blur(0px)", duration: dur, ease: "power2.out", stagger, delay, scrollTrigger: { trigger: el, start, once: true } });
  return parts;
}
// FadeInOnScroll(원본): 상자째 투명+흐림 → 선명
function fadeIn(el, { delay = 0, start = "top 90%" } = {}) {
  if (!el) return; gsap.set(el, { visibility: "visible", autoAlpha: 0, filter: "blur(12px)" });
  gsap.to(el, { autoAlpha: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out", delay, scrollTrigger: { trigger: el, start, once: true } });
}
function trionn() {
  const hs = $$("#s1-headline h1", T);
  blurReveal(hs[0], { mode: "chars", stagger: 0.08, delay: 1.2, start: "top bottom" });
  // 헤드라인 두 번째 줄: "mean" + 단어 돌리기(something. → depth. → impact. → purpose. → intention.)
  const h2 = hs[1]; if (h2) {
    h2.querySelectorAll("[style]").forEach((x) => (x.style.visibility = "visible"));
    const pre = h2.querySelector(":scope > span"); blurReveal(pre, { mode: "chars", stagger: 0.08, delay: 1.2, start: "top bottom" });
    const ww = h2.querySelector(".words-wrapper"); const WORDS = ["something.", "depth.", "impact.", "purpose.", "intention."]; let wi = 0;
    const show = (first) => { ww.textContent = WORDS[wi]; const cs = split(ww, "chars"); gsap.set(cs, { autoAlpha: 0, filter: "blur(12px)" });
      return gsap.to(cs, { autoAlpha: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.5, stagger: { each: 0.08, from: first ? "start" : "random" }, delay: first ? 1.2 + 0.32 : 0, onComplete: () => gsap.delayedCall(2, hide) }); };
    const hide = () => { const cs = $$(".chars", ww); gsap.to(cs, { autoAlpha: 0, filter: "blur(12px)", ease: "power2.in", duration: 0.4, stagger: { each: 0.08, from: "random" }, onComplete: () => { wi = (wi + 1) % WORDS.length; show(false); } }); };
    show(true);
  }
  fadeIn($("#s1-cta", T), { delay: 1.2, start: "top bottom" });
  $$("#s1-scroll [style]", T).forEach((x) => { x.style.visibility = "visible"; gsap.fromTo(x, { opacity: 0 }, { opacity: 1, delay: 1.2, duration: 0.8 }); });
  $$("#s1-stats .title, #s1-stats [style*=visibility]", T).forEach((x) => blurReveal(x, { mode: "words", stagger: 0.05, delay: 1.2, start: "top bottom" }));
  fadeIn($("#s1-box", T), { delay: 1.3, start: "top bottom" });
  fadeIn($("#s1-sub", T), { delay: 1.5, start: "top bottom" });
  // about
  $$(".home-about .about-title-block span.title, .home-about .about-subtitle-block span.title", T).forEach((x) => blurReveal(x, { mode: "words" }));
  $$(".home-about p", T).forEach((p) => fadeIn(p));
  $$(".home-about .button_wrapper", T).forEach((b) => fadeIn(b));
  const big = $(".home-about h2", T); if (big) { // FadeOnScroll: 단어 색이 흐린 회색 → #D8D8D8 (스크롤에 따라)
    const ws = split(big, "words"); gsap.set(ws, { color: "rgba(216,216,216,0.1)" });
    gsap.to(ws, { color: "#D8D8D8", ease: "none", stagger: 0.1, scrollTrigger: { trigger: big, start: "top 85%", end: "bottom 45%", scrub: true } });
  }
  const line = $(".home-about .line-plus-block .line", T); if (line) gsap.to(line, { width: "100%", duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: line, start: "top 85%", once: true } });
  // 비전: 화면 고정(+=200%, scrub .6) + 회색 띠 5개가 아래에서부터 올라옴(원본 타임라인 그대로)
  const vis = $("#vision-section", T);
  if (vis) {
    $$("#s3-text span.title, #s3-text .title", vis).forEach((x) => blurReveal(x, { mode: "words" }));
    const st = $$(".stripe-item", vis);
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: vis, start: "top top", end: "+=200%", pin: true, scrub: 0.6, anticipatePin: 1, pinSpacing: true, onUpdate: (e) => (mqPaused = e.progress >= 0.5) } });
    tl.addLabel("s"); for (let e = 0; e < 5; e++) { const s = 0.3 * (4 - e) / 4; tl.to(st[e], { scaleY: 1, duration: 0.3 }, `s+=${s}`); } tl.to({}, { duration: 0.1 });
    // 마키: 속도 .8, 화면 절반 넘으면 멈춤
    const row = $(".marquee-wrapper > div", vis); let mqPaused = false;
    if (row) { const one = row.firstElementChild; for (let i = 0; i < 3; i++) row.append(one.cloneNode(true)); let x = 0;
      const mqVis = onScreen(vis); // 화면 밖이면 마키를 움직이지 않는다
    gsap.ticker.add(() => { if (mqPaused || !mqVis.on) return; x -= 0.8; const w = one.offsetWidth; if (w && -x >= w) x += w; row.style.transform = `translate3d(${x}px,0,0)`; }); }
  }
}

// trionn 3D 심볼: 원본 코드(next_1233qowaitufq.js)를 그대로 실행. 원본이 기대하는 React·Lenis·GSAP 자리는 작은 대역으로 채운다.
async function trionnSymbol() {
  const THREE = await import("https://esm.sh/three@0.170.0");
  const effects = [];
  const React = { useRef: (v) => ({ current: v }), useCallback: (f) => f, useMemo: (f) => f(), useState: (v) => [v, () => {}], useEffect: (f) => effects.push(f), useLayoutEffect: (f) => effects.push(f) };
  const jsx = (type, props) => { if (props && props.ref && props.id) props.ref.current = document.getElementById(props.id); return null; };
  const loops = new Map(); let lid = 0;
  const manager = { register(fn, active) { const id = ++lid; loops.set(id, { fn, active: !!active, susp: false }); return id; }, setActive(id, v) { const l = loops.get(id); if (l) l.active = v; }, suspend() { loops.forEach((l) => (l.susp = true)); }, resume() { loops.forEach((l) => (l.susp = false)); }, unregister(id) { loops.delete(id); } };
  gsap.ticker.add(() => loops.forEach((l) => l.active && !l.susp && l.fn()));
  const shims = { 43476: { jsx, jsxs: jsx }, 71645: React, 42936: { useSiteSound: () => ({ soundEnabled: false }) }, 32009: THREE, 83495: { ScrollTrigger }, 55667: { useLenis: (cb) => lenis.on("scroll", cb) },
    71871: { getCanvasManager: () => manager }, 11303: {}, 62749: { useTransitionReady: () => true }, 65747: { useGSAP: (f) => effects.push(f) }, 89970: { default: gsap } };
  const mods = {};
  globalThis.TURBOPACK = { push(arr) { for (let i = 1; i < arr.length; i += 2) { const id = arr[i], fn = arr[i + 1]; if (typeof fn !== "function") continue;
    const e = { i: (n) => mods[n] || shims[n] || {}, s: (list, mid) => { const o = mods[mid ?? id] || (mods[mid ?? id] = {}); for (let k = 0; k < list.length; k += 3) o[list[k]] = list[k + 2]; }, n: () => {}, r: () => {} };
    try { fn(e); } catch (err) { console.warn("심볼 모듈", id, err); } } } };
  await new Promise((res, rej) => { const s = document.createElement("script"); s.src = "/clones/trionn/_capture/next_1233qowaitufq.js"; s.onload = res; s.onerror = rej; document.head.append(s); });
  const Comp = mods[54377]?.TrionnSymbolAnimation;
  // 원본은 이 상자를 앱이 그려 넣는다(서버 HTML에는 없음) → 같은 자리에 만든다
  if (!document.getElementById("trionn-symbol-canvas-wrap")) { const w = document.createElement("div"); w.innerHTML = '<div id="trionn-symbol-canvas-wrap" class="absolute inset-0 w-full h-dvh z-0 pointer-events-none"></div>'; $("#hero-section", T).prepend(w); }
  if (!Comp) return console.warn("심볼 코드를 찾지 못함");
  Comp({ vibrateElementIds: ["s1-headline", "s1-cta", "s1-stats", "s1-box", "s1-sub"] });
  effects.splice(0).forEach((f) => { try { f(); } catch (err) { console.warn("심볼 실행", err); } });
}

// 2번 apekon: 원본 스크립트(index.html의 script-aGaCdSjC.js)가 그대로 맡는다

// ════════ 3번 focus ════════
// 원본 등장 모션(app.js에서 읽음): 투명+yPercent 30 → 제자리, 0.68초 expo.out, 간격 글자 .008·단어 .02·줄 .05초, 화면 아래 6% 들어오면 시작
const FU = { chars: 0.008, words: 0.02, lines: 0.05 };
function focusReveal(el, mode) {
  if (mode === "draw") { const ps = $$("path,line,polyline,polygon,rect,circle,ellipse", el);
    ps.forEach((p) => { const L = p.getTotalLength?.() || 200; p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = L; });
    return () => gsap.to(ps, { strokeDashoffset: 0, duration: 1.4, ease: "expo.inOut", stagger: 0.07, onComplete: () => ps.forEach((p) => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; }) }); }
  const parts = split(el, mode === "chars" ? "chars" : "words"); gsap.set(parts, { opacity: 0, yPercent: 30 });
  if (mode === "lines") return () => linesOf(parts).forEach((L, i) => gsap.to(L, { opacity: 1, yPercent: 0, duration: 0.68, ease: "expo.out", delay: i * FU.lines }));
  return () => gsap.to(parts, { opacity: 1, yPercent: 0, duration: 0.68, ease: "expo.out", stagger: FU[mode] || 0.02 });
}
function focus() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.__go?.(); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
  $$("[data-animate]", F).forEach((el) => { el.__go = focusReveal(el, el.dataset.animate); io.observe(el); });
  $$("[data-rule]", F).forEach((el) => { gsap.set(el, { scaleX: 0, transformOrigin: "left center" }); el.__go = () => gsap.to(el, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }); io.observe(el); });
}

// ── 시작 ──
// 3단계: 처음에 미리 불러오기 → 다 받은 뒤 모션·그리드를 걸고 덮개를 걷는다
const PERF = new URLSearchParams(location.search).get("perf") !== "0"; // ?perf=0 이면 끔(비교용)
if (PERF) initPerf([T, A, F]); // 화면 밖 섹션 캔버스는 그리지 않고, 숨긴 캔버스 메모리는 비운다
scrollTo(0, 0); // 스크롤은 덮개가 휠·터치·키를 막는다(lenis.stop()은 apekon 원본 스크롤 처리기가 준비 전이라 오류가 남)
const symbolReady = trionnSymbol().catch((e) => console.warn("심볼", e));
const pre = await preload({ roots: [T, A, F], extra: [{ name: "Symbol", w: 0.15, p: symbolReady }] });
console.info("[mx] 미리 불러오기", pre, "막은 파일", window.__mxBlocked);
trionn(); focus(); // apekon은 원본 스크립트가 맡음
// 2단계 그리드: ?step=1 이면 원본 그대로, 그 밖(기본)은 trionn 기준 공통 그리드
let STEP = new URLSearchParams(location.search).get("step") || "2";
const regrid = initGrid([T, A, F], { on: STEP !== "1", onChange: () => ScrollTrigger.refresh() });
ScrollTrigger.refresh();
await reveal(); lenis.resize?.(); if (PERF) enableFree();
addEventListener("load", () => ScrollTrigger.refresh());
document.fonts.ready.then(() => ScrollTrigger.refresh());
// 시험 도구 버튼: 새로고침 없이 그 자리에서 바꾼다.
// (링크를 그냥 두면 2번 apekon 원본의 페이지 전환기(barba)가 클릭을 가로채 주소만 바뀌고 화면은 그대로였다)
{ const ui = document.getElementById("mx-ui"), html = document.documentElement;
  const draw = () => {
    const g = html.classList.contains("mxg-show");
    const q = (st, gg) => `?step=${st}${gg ? "&grid=1" : ""}`;
    const a = (st, t) => `<a data-barba-prevent="self" data-step="${st}" ${STEP === st ? 'aria-current="page"' : ""} href="${q(st, g)}">${t}</a>`;
    ui.innerHTML = `<b>mix-01 한 페이지</b>${a("1", "1 그대로")}${a("2", "2 그리드")}<a data-barba-prevent="self" data-grid href="${q(STEP, !g)}">${g ? "칸 숨기기" : "칸 보기"}</a><span style="padding:0 6px">3 미리 불러오기·안 쓰는 파일 빼기 적용</span>`;
  };
  ui.addEventListener("click", (e) => {
    const el = e.target.closest("a"); if (!el) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (el.dataset.step) { STEP = el.dataset.step; regrid.setOn(STEP !== "1"); }
    if ("grid" in el.dataset) html.classList.toggle("mxg-show");
    history.replaceState(history.state, "", el.getAttribute("href")); // 주소도 맞춰 둔다(새로고침해도 같은 상태)
    draw();
  }, true);
  draw(); }
