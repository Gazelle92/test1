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
export function applyTokens(theme) {
  const s = document.documentElement.style;
  for (const [k, v] of Object.entries(theme.tokens)) s.setProperty(`--${k}`, v);
  document.documentElement.dataset.theme = theme.id;
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
