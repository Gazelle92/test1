// 공통 엔진: 스크롤(Lenis)·GSAP·ScrollTrigger를 페이지에 하나만 두고, 테마(토큰)를 모든 모듈에 똑같이 적용한다.
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { split } from "./split.js";

gsap.registerPlugin(ScrollTrigger);

// 반응형 기준점: 모든 모듈이 같은 값을 쓴다(CSS에서는 @media (max-width: 767px)).
export const BP = 768;
const setBp = () => (document.documentElement.dataset.bp = innerWidth < BP ? "mobile" : "desktop");
setBp();
addEventListener("resize", setBp);

const EASINGS = {
  expo: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  cubic: (t) => 1 - Math.pow(1 - t, 3),
  linear: (t) => t,
};

// 테마의 디자인 토큰 → CSS 변수(--이름)
// 테마에 더 넣을 수 있는 것(모두 선택):
//   fonts: 불러올 웹 글꼴 주소 목록, css: 이 테마일 때만 켜지는 톤앤매너 스타일,
//   decorate(el): 모듈을 그린 직후·움직임을 붙이기 전에 한 번 부르는 꾸미기(예: 제목 단어 상자)
let lastKeys = [];
export function applyTokens(theme) {
  const s = document.documentElement.style;
  lastKeys.forEach((k) => s.removeProperty(`--${k}`)); // 이전 테마에만 있던 토큰이 남지 않게
  lastKeys = Object.keys(theme.tokens);
  for (const [k, v] of Object.entries(theme.tokens)) s.setProperty(`--${k}`, v);
  document.documentElement.dataset.theme = theme.id;
  (theme.fonts || []).forEach((href) => {
    if (document.querySelector(`link[data-theme-font="${href}"]`)) return;
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href; l.dataset.themeFont = href;
    document.head.appendChild(l);
  });
  let st = document.getElementById("theme-css");
  if (!st) { st = document.createElement("style"); st.id = "theme-css"; document.head.appendChild(st); }
  st.textContent = theme.css || "";
}

// 모듈이 쓰는 모션 도구. 모듈은 이징·길이·간격을 직접 쓰지 않고 이것만 쓴다.
export function motionApi(theme) {
  const mo = theme.motion;
  return {
    ease: mo.ease, // { out, inOut, back, elastic }
    d: (sec) => sec * mo.speed, // 길이 배율
    stagger: (sec) => sec * mo.speed * (mo.staggerScale ?? 1), // 순차 간격 배율
    scrub: mo.scrub, // 스크롤 연동 부드러움(true 또는 초)
    split,
    mobile: () => innerWidth < BP,
  };
}

export function createEngine({ root, sections, themes, theme }) {
  let lenis = null;
  let current = null;
  let mounted = [];

  gsap.ticker.add((time) => lenis && lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  function startScroll(t) {
    if (lenis) lenis.destroy();
    const s = t.scroll;
    lenis = new Lenis({
      ...(s.lerp ? { lerp: s.lerp } : { duration: s.duration, easing: EASINGS[s.easing] || EASINGS.expo }),
      wheelMultiplier: s.wheel ?? 1,
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
  }

  function mountAll() {
    mounted.forEach((x) => x.ctx.revert());
    root.innerHTML = "";
    const m = motionApi(current);
    mounted = sections.map(({ use, content, tone }) => {
      const el = document.createElement("section");
      el.dataset.module = use.id;
      el.dataset.tone = tone || "base"; // base(기본) 또는 alt(반전)
      el.dataset.source = `${use.category} · ${use.source}`;
      el.innerHTML = use.render({ ...use.defaults, ...content });
      root.appendChild(el);
      if (current.decorate) current.decorate(el);
      const ctx = gsap.context(() => use.animate(el, m), el);
      return { el, ctx };
    });
  }

  function setTheme(id) {
    const y = lenis ? lenis.scroll : 0;
    current = themes.find((t) => t.id === id) || themes[0];
    applyTokens(current);
    startScroll(current);
    mountAll();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lenis.scrollTo(y, { immediate: true, force: true });
    });
  }

  setTheme(theme);
  return {
    setTheme,
    get theme() { return current; },
    get lenis() { return lenis; },
  };
}
