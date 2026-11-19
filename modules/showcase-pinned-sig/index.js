// 갤러리 (킥 모션 보존판): 300vh 동안 화면을 고정하고, 사이트 썸네일 15장이 0.1초 간격으로
// 오른쪽 끝에서 출발해 화면 너비만큼 왼쪽으로 흘러간다. 가는 도중 앞 절반은 위아래로 흩어지며 커지고(power1.inOut),
// 뒤 절반은 제자리로 모이며 0으로 줄어든다. 버튼은 마우스를 올리면 글자가 한 번 굴러 내려온다.
// 원본: madewithgsap.com .h-showcase (assets/landing/app2.js). SIG 값은 원본 숫자 그대로. 테마는 색·글꼴만 따른다.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const SIG = {
  mobileMax: 500, // 원본: 500px 초과면 x = -화면너비, 이하면 -1.5배
  stagger: 0.1, // timeline defaults
  travel: { xPercent: 100, duration: 1, ease: "none" },
  spread: { range: 160, duration: 0.5, ease: "power1.inOut" }, // yPercent = 160 × (무작위 − 0.5), scale 0 → 1
  shrink: { at: "<+=0.5", duration: 0.5, ease: "power1.inOut" }, // yPercent 0, scale → 0
  rollMs: 400,
};

// 원본 썸네일 15장 대신 쓰는 사이트 모양 카드(가로·세로 비율을 섞어 원본처럼 들쭉날쭉하게)
const SHAPES = ["wide", "tall", "square", "wide", "square", "tall", "wide", "square", "tall", "wide", "square", "wide", "tall", "square", "wide"];
const arrow = `<svg viewBox="0 0 12 10" width="12" height="10" aria-hidden="true"><path d="M0 5h10M6 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

export default {
  id: "showcase-pinned-sig",
  category: "갤러리",
  source: "madewithgsap 쇼케이스 · 원본 모션 보존",
  form: "스크롤형",
  summary: "고정 화면 위로 썸네일 15장이 흩어지며 커졌다 줄어들며 흘러감",
  defaults: {
    title: "이 모음으로 완성한 수상작과 프로젝트를 둘러보세요",
    cta: "작업 모아 보기",
    href: "#",
    names: ["봄빛 식물원", "새벽 커피", "파도 스튜디오", "구름 여행", "모래 가구", "달빛 서점", "숲길 학교", "노을 음악제", "바람 자전거", "하늘 건축", "별빛 극장", "물결 화장품", "들꽃 농장", "은하 게임", "소금 식당"],
  },
  render: (c) => `
    <div class="sps-wrapper">
      <h2 class="sps-title">${c.title}</h2>
      <a class="sps-cta roll" href="${c.href}"><span><span class="translate"><span>${c.cta}${arrow}</span><span>${c.cta}${arrow}</span></span></span></a>
    </div>
    <div class="sps-pin">
      <div class="sps-container">${c.names.map((n, i) => `
        <div class="sps-media sps-${SHAPES[i % SHAPES.length]} sps-c${i % 5}">
          <div class="sps-site">
            <div class="sps-bar"><i></i><i></i><i></i></div>
            <div class="sps-hero"><b>${n}</b><span></span><span></span></div>
          </div>
        </div>`).join("")}
      </div>
    </div>`,

  animate(el) {
    const pin = el.querySelector(".sps-pin");
    const container = el.querySelector(".sps-container");
    const media = el.querySelectorAll(".sps-media");

    // 고정: 원본과 같이 container를 pin-height 동안 붙잡는다
    ScrollTrigger.create({ trigger: pin, start: "top top", end: "bottom bottom", pin: container });

    // 흐름: 원본 타임라인 그대로(stagger 0.1 기본값, scrub true)
    const T = SIG.travel, S = SIG.spread, K = SIG.shrink;
    const tl = gsap.timeline({ scrollTrigger: { trigger: pin, start: "top top", end: "bottom bottom", scrub: true }, defaults: { stagger: SIG.stagger } });
    tl.to(media, { xPercent: T.xPercent, x: innerWidth > SIG.mobileMax ? -1 * document.body.clientWidth : -1.5 * document.body.clientWidth, ease: T.ease, duration: T.duration })
      .to(media, { yPercent: () => S.range * (Math.random() - 0.5), scale: 1, duration: S.duration, ease: S.ease }, "<")
      .to(media, { yPercent: 0, scale: 0, duration: K.duration, ease: K.ease }, K.at);

    // 버튼 굴림(마우스가 있는 기기만)
    const cta = el.querySelector(".roll");
    let t = 0;
    const onEnter = () => { cta.classList.remove("on"); void cta.offsetWidth; cta.classList.add("on"); clearTimeout(t); t = setTimeout(() => cta.classList.remove("on"), SIG.rollMs); };
    const fine = matchMedia("(pointer: fine)").matches;
    if (fine) cta.addEventListener("mouseenter", onEnter);
    return () => { if (fine) cta.removeEventListener("mouseenter", onEnter); clearTimeout(t); };
  },
};
