// 원본 섹션 조립기(내부 참고용)
// 복제한 섹션 페이지를 원본 그대로 iframe으로 차례로 놓고, 바깥 페이지 스크롤 하나로 각 섹션 안의 스크롤을 대신 움직인다
// (원본 스크롤 효과가 그대로 동작). 섹션 위에서 굴린 휠은 섹션 안 스크롤 엔진에 가지 않고 바깥으로 넘긴다 → 스크롤 감도가 하나로 맞춰짐.
// 무드는 원본을 고치지 않고 위에 얹기만 한다: 글꼴 · 색 보정(filter) · 덧씌우는 색 한 겹(tint) · 스크롤 감도 · (다시 만든 모듈만) 팔레트
import Lenis from "lenis";

const BASE = import.meta.env.BASE_URL;

// 무드 형식(레퍼런스 분석 API와 같은 모양)
//  { name, summary, font:{display, body}, filter:{brightness, contrast, saturate, sepia, hueRotate, grayscale},
//    tint:{color, opacity, blend}, scroll:{lerp}, palette:{bg, fg, accent, surface} | null }
const NO_FILTER = { brightness: 1, contrast: 1, saturate: 1, sepia: 0, hueRotate: 0, grayscale: 0 };
const NO_TINT = { color: "#000000", opacity: 0, blend: "soft-light" };
export const MOODS = [
  { id: "original", name: "원본 그대로", font: { display: "original", body: "original" }, filter: NO_FILTER, tint: NO_TINT, scroll: { lerp: 0.1 }, palette: null },
  { id: "sans", name: "글꼴 통일", font: { display: "Pretendard", body: "Pretendard" }, filter: NO_FILTER, tint: NO_TINT, scroll: { lerp: 0.1 }, palette: null },
  { id: "warm", name: "따뜻한 톤", font: { display: "Gowun Batang", body: "Pretendard" }, filter: { ...NO_FILTER, sepia: 0.18, saturate: 0.92, contrast: 0.98 }, tint: { color: "#c8894a", opacity: 0.12, blend: "soft-light" }, scroll: { lerp: 0.08 }, palette: { bg: "#f4ede2", fg: "#2a2118", accent: "#b5652d", surface: "#fbf7f0" } },
  { id: "mono", name: "흑백", font: { display: "Space Grotesk", body: "Inter" }, filter: { ...NO_FILTER, grayscale: 1, contrast: 1.05 }, tint: NO_TINT, scroll: { lerp: 0.1 }, palette: { bg: "#f2f2f2", fg: "#111111", accent: "#111111", surface: "#ffffff" } },
];

// 글꼴 불러오기 주소(무드가 고를 수 있는 글꼴만)
const FONT_CSS = {
  Pretendard: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css",
  "Noto Sans KR": "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300..900&display=swap",
  "Noto Serif KR": "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300..900&display=swap",
  "Gowun Batang": "https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap",
  Inter: "https://fonts.googleapis.com/css2?family=Inter:wght@300..900&display=swap",
  "Space Grotesk": "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
  "Archivo Black": "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
  "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
  "DM Serif Display": "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap",
  "Cormorant Garamond": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
  "IBM Plex Mono": "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;700&display=swap",
};
const family = (f) => (f === "Pretendard" ? "'Pretendard Variable', Pretendard" : `'${f}'`) + ", 'Apple SD Gothic Neo', sans-serif";

export function normalizeMood(m) {
  return {
    id: m.id || "custom", name: m.name || "레퍼런스 무드", summary: m.summary || "", via: m.via || "",
    font: { display: "original", body: "original", ...(m.font || {}) }, filter: { ...NO_FILTER, ...(m.filter || {}) }, tint: { ...NO_TINT, ...(m.tint || {}) },
    scroll: { lerp: 0.1, ...(m.scroll || {}) }, palette: m.palette || null,
  };
}
const filterCss = (f) => (Object.entries(f).every(([k, v]) => v === NO_FILTER[k]) ? "none"
  : `brightness(${f.brightness}) contrast(${f.contrast}) saturate(${f.saturate}) sepia(${f.sepia}) hue-rotate(${f.hueRotate}deg) grayscale(${f.grayscale})`);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const MOOD_ATTR = "data-clone-mood";

export function createComposer({ root, items, mood = MOODS[0] }) {
  let current = normalizeMood(mood);
  let lenis = null;
  const blocks = items.map((it) => {
    const el = document.createElement("section");
    el.className = "cb";
    el.dataset.source = `${it.category} · ${it.id}`;
    const src = it.src || `${BASE}clones/${it.id}/`;
    el.innerHTML = `<div class="cb-stage"><iframe loading="eager" src="${src}" title="${it.id}"></iframe><div class="cb-tint"></div><div class="cb-wait">불러오는 중… ${it.id}</div></div>`;
    root.appendChild(el);
    return { it, el, frame: el.querySelector("iframe"), tint: el.querySelector(".cb-tint"), ready: false, min: 0, range: 0, h: innerHeight, last: -1 };
  });

  function applyMood(b) {
    const m = current;
    b.frame.style.filter = filterCss(m.filter);
    Object.assign(b.tint.style, { background: m.tint.color, opacity: m.tint.opacity, mixBlendMode: m.tint.blend });
    const doc = b.frame.contentDocument;
    if (!doc?.head) return;
    doc.querySelectorAll(`[${MOOD_ATTR}]`).forEach((n) => n.remove());
    const add = (tag, attrs) => { const n = doc.createElement(tag); n.setAttribute(MOOD_ATTR, ""); Object.assign(n, attrs); doc.head.appendChild(n); };
    const { display, body } = m.font;
    for (const f of new Set([display, body])) if (FONT_CSS[f]) add("link", { rel: "stylesheet", href: FONT_CSS[f] });
    let css = "";
    if (body !== "original") css += `body *:not(svg):not(svg *):not(i):not([class*="icon"]){font-family:${family(body)}!important}`;
    if (display !== "original") css += `h1,h2,h3,h4,[class*="title"],[class*="heading"],[class*="display"],h1 *,h2 *,h3 *,[class*="title"] *{font-family:${family(display)}!important}`;
    // 다시 만든 모듈(테마 토큰을 따름)은 팔레트·글꼴 토큰까지 바꾼다
    if (m.palette && doc.querySelector("section[data-module]")) {
      const p = m.palette;
      css += `:root{--c-bg:${p.bg}!important;--c-fg:${p.fg}!important;--c-accent:${p.accent}!important;--c-surface:${p.surface}!important;` +
        `--c-muted:color-mix(in srgb,${p.fg} 55%,${p.bg})!important;--c-line:color-mix(in srgb,${p.fg} 14%,transparent)!important;` +
        (display !== "original" ? `--font-display:${family(display)}!important;` : "") + (body !== "original" ? `--font-body:${family(body)}!important;` : "") + "}";
    }
    if (css) add("style", { textContent: css });
  }

  // 섹션 안에서 굴린 휠·키를 바깥으로 넘긴다(섹션 자체 스크롤 엔진은 휠을 받지 않음)
  function hookInput(b) {
    const w = b.frame.contentWindow;
    w.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      window.dispatchEvent(new WheelEvent("wheel", { deltaX: e.deltaX, deltaY: e.deltaY, deltaMode: e.deltaMode }));
    }, { capture: true, passive: false });
    w.addEventListener("keydown", (e) => {
      const map = { ArrowDown: 80, ArrowUp: -80, PageDown: innerHeight * 0.9, PageUp: -innerHeight * 0.9, " ": innerHeight * 0.9 };
      if (map[e.key] && !/input|textarea|select/i.test(e.target.tagName)) {
        e.preventDefault(); e.stopImmediatePropagation();
        lenis.scrollTo(lenis.targetScroll + map[e.key]);
      }
    }, { capture: true });
  }

  // 섹션 안 스크롤이 움직일 수 있는 범위를 잰다
  async function measure(b) {
    const w = b.frame.contentWindow, d = b.frame.contentDocument;
    const docH = d.documentElement.scrollHeight;
    const docMax = Math.max(0, docH - w.innerHeight);
    // 구간을 정해 둔 섹션(브레이크스루처럼 한 화면에 장면이 겹친 사이트)은 그 구간을 그대로 쓴다
    const r = typeof w.__cloneRange === "function" ? w.__cloneRange() : null;
    const min = r ? r[0] : 0;
    const max = r ? (r[1] == null ? docMax : Math.min(docMax, r[1])) : docMax;
    b.min = min;
    b.range = Math.max(0, max - min);
    b.h = Math.min(innerHeight, docH);
    b.el.style.height = `${b.range + b.h}px`;
    b.el.querySelector(".cb-stage").style.height = `${b.h}px`;
    b.last = -1;
    sync();
  }

  async function prepare(b) {
    await new Promise((r) => (b.frame.contentDocument?.readyState === "complete" ? r() : b.frame.addEventListener("load", r, { once: true })));
    hookInput(b);
    await wait(4200); // 원본 앱이 주소를 되돌리고(3.5초) 스크롤 엔진·구간 고정을 마칠 때까지
    applyMood(b);
    await measure(b);
    b.ready = true;
    b.el.classList.add("is-ready");
    for (const t of [3000, 6000]) setTimeout(() => measure(b), t); // 늦게 들어오는 이미지·글꼴로 높이가 바뀌는 경우
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
  }

  function startScroll() {
    lenis?.destroy();
    lenis = new Lenis({ lerp: current.scroll.lerp, smoothWheel: true });
    lenis.on("scroll", sync);
  }
  const raf = (t) => { lenis?.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  startScroll();
  blocks.forEach(prepare);
  addEventListener("resize", () => blocks.forEach((b) => b.ready && measure(b)));

  return {
    blocks,
    get mood() { return current; },
    get lenis() { return lenis; },
    setMood(m) {
      const y = lenis?.scroll || 0;
      current = normalizeMood(m);
      startScroll();
      lenis.scrollTo(y, { immediate: true, force: true });
      blocks.forEach((b) => b.ready && applyMood(b));
    },
  };
}

// 레퍼런스 이미지 → 무드
//  1) 매니저(실서버): /api/mood 가 Claude로 이미지를 읽어 글꼴·색 보정·팔레트까지 정함
//  2) 그 API가 없을 때(내 컴퓨터 템플릿 개발 서버): 이미지 평균 색·밝기·채도로 간단히 정함
export async function moodFromImage(file, note = "") {
  const dataUrl = await shrink(file, 1024);
  let r = null;
  try {
    r = await fetch("/api/mood", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ image: dataUrl, note }) });
  } catch { r = null; }
  if (r && r.ok) { const d = await r.json(); return { ...d.mood, id: "ref", via: "ai", preview: dataUrl }; }
  // API가 없거나(404) 키가 없으면(503) 간이 분석으로, 그 밖의 오류(로그인 만료 등)는 알려 줌
  if (r && ![404, 503].includes(r.status) && BASE !== "/") { const d = await r.json().catch(() => ({})); throw new Error(d.error || `HTTP ${r.status}`); }
  return { ...(await quickMood(dataUrl)), id: "ref", via: "quick", preview: dataUrl };
}

async function shrink(file, max) {
  const img = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = Object.assign(document.createElement("canvas"), { width: Math.round(img.width * s), height: Math.round(img.height * s) });
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}

async function quickMood(dataUrl) {
  const img = new Image(); img.src = dataUrl; await img.decode();
  const c = Object.assign(document.createElement("canvas"), { width: 64, height: 64 });
  const g = c.getContext("2d"); g.drawImage(img, 0, 0, 64, 64);
  const px = g.getImageData(0, 0, 64, 64).data;
  let r = 0, gr = 0, b = 0, lum = 0, sat = 0, n = 0;
  const lums = [];
  for (let i = 0; i < px.length; i += 4) {
    const R = px[i], G = px[i + 1], B = px[i + 2];
    const mx = Math.max(R, G, B), mn = Math.min(R, G, B), L = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
    r += R; gr += G; b += B; lum += L; sat += mx ? (mx - mn) / mx : 0; lums.push(L); n++;
  }
  r /= n; gr /= n; b /= n; lum /= n; sat /= n;
  lums.sort((a, z) => a - z);
  const spread = lums[Math.floor(n * 0.95)] - lums[Math.floor(n * 0.05)];
  const hx = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  const avg = `#${hx(r)}${hx(gr)}${hx(b)}`;
  const warm = (r - b) / 255;
  const dark = lum < 0.4;
  const shade = (k, t) => `#${hx(r + (t - r) * k)}${hx(gr + (t - gr) * k)}${hx(b + (t - b) * k)}`;
  return {
    name: "레퍼런스 무드(간이)",
    summary: `평균 색 ${avg}, ${dark ? "어두운" : "밝은"} 톤, 채도 ${sat < 0.2 ? "낮음" : sat > 0.45 ? "높음" : "보통"}, ${warm > 0.05 ? "따뜻한" : warm < -0.05 ? "차가운" : "중간"} 온도로 맞췄어요.`,
    font: { display: "original", body: "original" },
    filter: {
      brightness: +(0.94 + lum * 0.12).toFixed(2), contrast: +(0.9 + spread * 0.25).toFixed(2), saturate: +Math.min(1.25, Math.max(0.2, 0.5 + sat * 1.3)).toFixed(2),
      sepia: +Math.max(0, Math.min(0.3, warm * 0.8)).toFixed(2), hueRotate: 0, grayscale: sat < 0.08 ? 0.8 : 0,
    },
    tint: { color: avg, opacity: 0.14, blend: "soft-light" },
    scroll: { lerp: 0.1 },
    palette: dark ? { bg: shade(0.75, 0), fg: "#f2efe9", accent: shade(0.4, 255), surface: shade(0.6, 0) } : { bg: shade(0.85, 255), fg: "#161616", accent: shade(0.25, 0), surface: "#ffffff" },
  };
}
