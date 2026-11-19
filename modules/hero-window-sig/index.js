// 히어로 (킥 모션 보존판): 창 블라인드가 올라가며 하늘이 열리고, 스크롤하면 배경(창)이 6.5배·글자 층이 8배로
// 커지면서 두 제목이 양옆(±50vw)으로 갈라진다. 제목 글자는 흐림(blur 36px)에서 한 자씩 또렷해지고,
// 다음 소개 문장은 하늘 위로 빠르게 올라오며(-50vh → -200vh) 스크롤에 맞춰 한 글자씩 밝아진다.
// 원본: jeskojets.com 히어로 (assets.slater.app/slater/16759/45776.js). SIG 값은 원본 숫자 그대로. 테마는 색·글꼴만 따른다.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
// 원본 CustomEase 그대로(이름만 겹치지 않게)
CustomEase.create("hwsOut", "0.25,1,0.5,1");
CustomEase.create("hwsInOut", "0.76,0,0.24,1");

const SIG = {
  breakPoint: 992,
  zoom: { bg: 6.5, bgX: -2, text: 8, split: 50 }, // .hero-w_bg scale·xPercent, .hero-s scale, 좌우 ±50vw (scrub:true, ease none)
  sky: "100vh", // .sky-bg_hero y 0 → 100vh
  about: ["-50vh", "-200vh"], // .about-s y (top bottom → bottom top)
  blind: { delay: 1, duration: 1.2, y: -92, scaleY: 0.5 }, // 재방문 기준 지연 1초(첫 방문 3초는 로딩 화면 몫)
  reveal: { blur: "blur(36px)", duration: 1, delay: 0.3, chars: 0.05, lines: 0.1 },
  highlight: { from: 0.15, each: 0.04, duration: 0.6, start: "top 75%", end: "bottom 75%" },
  clouds: 48, // 구름 띠 한 바퀴(초), 반대 방향
};

export default {
  id: "hero-window-sig",
  category: "히어로",
  source: "jeskojets 히어로 · 원본 모션 보존",
  form: "스크롤형",
  summary: "블라인드 열림 → 창 6.5배·글자 8배 확대하며 제목 좌우 분리 → 소개 문장이 하늘 위로",
  defaults: {
    left: "자유롭게<br>떠나는 하늘",
    right: "가볍게<br>닿는 목적지",
    lead: "당신이 누려야 할<br>이동의 자유",
    desc: "모든 일정은 당신의 시간과 편안함에 맞춰 준비됩니다. 중요한 일에만 집중하세요. 나머지는 저희가 챙깁니다.",
    hint: "아래로 스크롤",
    hint2: "여정을 시작하세요",
    about: "우리는 150개가 넘는 나라에서 5,000번 넘게 비행을 마쳤습니다. 출장부터 가족 여행까지, 약속한 시간에 정확히 모십니다.",
  },
  render: (c) => `
    <div class="hws-area">
      <div class="hws-sky"><div class="hws-clouds"><i></i><i></i></div></div>
      <div class="hws-sticky">
        <div class="hws-bg">
          <div class="hws-back"><div class="hws-clouds"><i></i><i></i></div></div>
          <div class="hws-window">
            <div class="hws-blind"></div>
            <div class="hws-knob-c"><i class="hws-knob"></i></div>
            <i class="hws-knob hws-knob-2"></i>
          </div>
          <div class="hws-front"></div>
          <div class="hws-overlay"></div>
        </div>
        <div class="hws-s">
          <div class="hws-grid">
            <div class="hws-l"><h1 class="hws-h" data-hws-chars>${c.left}</h1></div>
            <div class="hws-r"><h2 class="hws-h" data-hws-chars>${c.right}</h2></div>
          </div>
          <div class="hws-bot">
            <div class="hws-desc hws-l">
              <p class="hws-lead" data-hws-lines>${c.lead}</p>
              <div class="hws-divider" data-hws-div><i></i></div>
              <p class="hws-p" data-hws-lines>${c.desc}</p>
            </div>
            <div class="hws-scroll hws-r" data-hws-div>
              <i class="hws-vline"></i>
              <div class="hws-scroll-c"><span class="hws-mouse" aria-hidden="true"></span><span>${c.hint}</span></div>
              <div class="hws-scroll-c"><span>${c.hint2}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hws-about"><div class="hws-about-s"><p class="hws-about-t" data-hws-highlight>${c.about}</p></div></div>`,

  animate(el) {
    const mob = innerWidth < SIG.breakPoint;
    el.classList.toggle("hws-mob", mob);
    const area = el.querySelector(".hws-area");
    const Z = SIG.zoom;

    // ① 블라인드 열림(처음 한 번)
    const B = SIG.blind;
    gsap.fromTo(el.querySelector(".hws-blind"), { yPercent: 0, scaleY: 1 }, { yPercent: B.y, scaleY: B.scaleY, duration: B.duration, delay: B.delay, ease: "hwsInOut" });
    gsap.fromTo(el.querySelector(".hws-knob-c"), { yPercent: 0 }, { yPercent: B.y, duration: B.duration, delay: B.delay, ease: "hwsInOut" });
    gsap.fromTo(el.querySelector(".hws-knob-2"), { opacity: 0 }, { opacity: 1, duration: B.duration, delay: B.delay, ease: "hwsInOut" });

    // ② 스크롤 확대: 창 6.5배(+왼쪽 2%), 글자 층 8배, 제목 좌우 분리
    const tl = gsap.timeline({ scrollTrigger: { trigger: area, start: "top top", end: "bottom bottom", scrub: true } });
    tl.fromTo(el.querySelector(".hws-bg"), { scale: 1, xPercent: 0 }, { scale: Z.bg, xPercent: Z.bgX, ease: "none", duration: 1 }, 0)
      .fromTo(el.querySelector(".hws-s"), { scale: 1 }, { scale: Z.text, ease: "none", duration: 1 }, 0);
    if (!mob) {
      tl.fromTo(el.querySelectorAll(".hws-l"), { x: "0vw" }, { x: `-${Z.split}vw`, ease: "none", duration: 1 }, 0)
        .fromTo(el.querySelectorAll(".hws-r"), { x: "0vw" }, { x: `${Z.split}vw`, ease: "none", duration: 1 }, 0);
      gsap.fromTo(el.querySelector(".hws-sky"), { y: "0vh" }, { y: SIG.sky, ease: "none", scrollTrigger: { trigger: area, start: "top top", end: "bottom bottom", scrub: true } });
      gsap.fromTo(el.querySelector(".hws-about-s"), { y: SIG.about[0] }, { y: SIG.about[1], ease: "none", scrollTrigger: { trigger: el.querySelector(".hws-about"), start: "top bottom", end: "bottom top", scrub: true } });
    }

    // ③ 글자 등장: 흐림 36px → 또렷하게(원본은 넓은 화면에서만)
    const R = SIG.reveal;
    if (!mob) {
      el.querySelectorAll("[data-hws-chars]").forEach((h) => {
        const st = SplitText.create(h, { type: "words,chars", wordsClass: "word", charsClass: "char" });
        gsap.set(st.words, { display: "inline-block", whiteSpace: "nowrap" });
        gsap.from(st.chars, { filter: R.blur, opacity: 0, duration: R.duration, delay: R.delay, stagger: R.chars, ease: "hwsOut", scrollTrigger: { trigger: h, start: "top bottom", toggleActions: "play none none none" } });
      });
      el.querySelectorAll("[data-hws-lines]").forEach((p) => {
        const st = SplitText.create(p, { type: "lines", linesClass: "line" });
        gsap.from(st.lines, { filter: R.blur, opacity: 0, duration: R.duration, delay: R.delay, stagger: R.lines, ease: "hwsOut", scrollTrigger: { trigger: p, start: "top bottom", toggleActions: "play none none none" } });
      });
      el.querySelectorAll("[data-hws-div]").forEach((d) => {
        gsap.from(d.children, { filter: R.blur, opacity: 0, duration: R.duration, delay: R.delay, stagger: R.lines, ease: "hwsOut", scrollTrigger: { trigger: d, start: "top bottom", toggleActions: "play none none none" } });
      });

      // ④ 소개 문장: 스크롤에 맞춰 한 글자씩 밝아짐
      const H = SIG.highlight;
      const hp = el.querySelector("[data-hws-highlight]");
      const st = SplitText.create(hp, { type: "words,chars", wordsClass: "word", charsClass: "char" });
      gsap.set(st.words, { display: "inline-block", whiteSpace: "nowrap" });
      gsap.timeline({ scrollTrigger: { trigger: hp, start: H.start, end: H.end, scrub: true } })
        .from(st.chars, { opacity: H.from, duration: H.duration, ease: "hwsOut", stagger: { each: H.each } });
    }
  },
};
