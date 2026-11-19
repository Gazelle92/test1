// 소개 (킥 모션 보존판): 400vh 동안 화면이 고정되고, 아래에서 올라온 기체가 천천히 시작해 빨라지며(ease In)
// 40%로 줄어드는 사이 소개 화면은 아래로 빠지고 제원 화면이 위에서 내려온다(둘 다 scrub 1.2로 한 박자 늦게).
// 마지막 구간에서 기체는 아래부터 지워지고 같은 자리에 기내 배치도가 위로 드러난다. 배경은 어두운 톤 → 밝은 톤.
// 원본: jeskojets.com 기체 섹션 (assets.slater.app/slater/16759/45776.js). SIG 값은 원본 숫자 그대로. 테마는 색·글꼴만 따른다.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("jfsIn", "0.5,0,0.75,0"); // 원본 "In"
CustomEase.create("jfsOut", "0.25,1,0.5,1"); // 원본 "Out"

const SIG = {
  breakPoint: 992,
  light: { start: "top top", end: "center center" }, // .light-bg opacity 0 → 1, scrub true
  swap: { start: "50% center", end: "85% bottom", scrub: 1.2 }, // .jet-w, .spec-w yPercent 0 → 100
  jet: { scale: 0.4, yPercent: -15, start: "25% center", end: "85% bottom", scrub: 1.2, ease: "jfsIn" },
  wipe: { start: "85% bottom", end: "bottom bottom" }, // 기체 마스크 100% 150% → 100% 0%, 배치도 0% → 150%(y 200% → 50%)
  reveal: { blur: "blur(36px)", duration: 1, delay: 0.3, chars: 0.05, lines: 0.1 },
  push: "1s cubic-bezier(.77,0,.175,1)", // 제목 사이 빈칸이 벌어지는 CSS 전환
};

// 위에서 본 기체(viewBox 0 0 200 400)
const BODY = "M100 8 C113 8 122 42 122 84 L122 330 C122 362 112 392 100 392 C88 392 78 362 78 330 L78 84 C78 42 87 8 100 8 Z";
const WINGS = "M121 160 L193 242 L193 258 L121 226 Z M79 160 L7 242 L7 258 L79 226 Z";
const TAIL = "M117 344 L152 378 L152 388 L110 372 Z M83 344 L48 378 L48 388 L90 372 Z";
const ENG = `<rect x="124" y="282" width="13" height="42" rx="6.5"/><rect x="63" y="282" width="13" height="42" rx="6.5"/>`;
const plane = `
  <svg viewBox="0 0 200 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs><linearGradient id="jfs-g" x1="0" x2="1"><stop offset="0" stop-color="#cfc8bd"/><stop offset=".5" stop-color="#fbf8f2"/><stop offset="1" stop-color="#cfc8bd"/></linearGradient></defs>
    <g fill="url(#jfs-g)" stroke="rgba(0,0,0,.12)" stroke-width=".6"><path d="${WINGS}"/><path d="${TAIL}"/>${ENG}<path d="${BODY}"/></g>
    <path d="M91 40 Q100 30 109 40 L107 50 Q100 46 93 50 Z" fill="#2a2a2a" opacity=".8"/>
  </svg>`;
const seat = (x, y) => `<rect x="${x}" y="${y}" width="12" height="12" rx="3"/>`;
const blueprint = `
  <svg viewBox="0 0 200 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.1">
    <path d="${WINGS}"/><path d="${TAIL}"/>${ENG}<path d="${BODY}"/>
    <path d="M82 60 L118 60"/><rect x="82" y="64" width="15" height="17" rx="2"/><rect x="103" y="64" width="15" height="17" rx="2"/>
    ${[92, 120, 150, 178].map((y) => seat(83, y) + seat(105, y)).join("")}
    <rect x="82" y="204" width="12" height="38" rx="3"/><rect x="107" y="212" width="9" height="22" rx="1.5"/>
    <rect x="84" y="254" width="32" height="32" rx="3"/><rect x="82" y="298" width="36" height="20" rx="2"/>
    <path d="M100 88 L100 292" stroke-dasharray="3 4"/>
  </svg>`;
const list = (rows) => rows.map(([k, v]) => `<div class="jfs-item"><span>${k}</span><b>${v}</b></div>`).join("");

export default {
  id: "jet-fleet-sig",
  category: "소개",
  source: "jeskojets 기체 섹션 · 원본 모션 보존",
  form: "스크롤형",
  summary: "기체가 올라와 40%로 줄며 소개↔제원 화면 교대 → 기체가 지워지며 배치도 등장",
  defaults: {
    left: "편안함을",
    right: "타고 가세요",
    sub: "어디로 가든 함께 움직이는 여유",
    maker: "노바 에어",
    model: "NV-8",
    desc: "공기 흐름을 흐트러뜨리지 않게 다듬은 날개와 힘 있는 두 엔진으로, 먼 거리도 쉬지 않고 빠르게 닿습니다.",
    overview: [["최대 운항 거리", "11,000 km"], ["순항 속도", "900 km/h"], ["탑승 인원", "최대 12석"], ["연속 비행", "13시간"], ["수하물 공간", "5.4 m³"], ["순항 고도", "15,000 m"]],
    kicker: "초장거리 기체",
    headline: "가장 빠른 개인 비행",
    body: "대륙 사이를 한 번에 잇습니다. 갈아타는 시간만큼 하루가 길어집니다.",
    specs: [["객실 길이", "14.0 m"], ["객실 폭", "2.5 m"], ["객실 높이", "1.9 m"]],
  },
  render: (c) => `
    <div class="jfs-area">
      <div class="jfs-switch">
        <div class="jfs-light"></div>
        <div class="jfs-w">
          <div class="jfs-top"></div>
          <div class="jfs-title">
            <h2 class="jfs-h" data-jfs-chars>${c.left}</h2><div class="jfs-push"></div><h2 class="jfs-h jfs-hr" data-jfs-chars>${c.right}</h2>
          </div>
          <div class="jfs-bot">
            <p class="jfs-sub" data-jfs-lines>${c.sub}</p>
            <div class="jfs-desc">
              <div class="jfs-dt" data-jfs-div><i class="jfs-line"></i><span>${c.maker}</span><b>${c.model}</b></div>
              <p data-jfs-lines>${c.desc}</p>
            </div>
          </div>
        </div>
        <div class="jfs-spec">
          <i class="jfs-line jfs-specline"></i>
          <div class="jfs-grid">
            <div class="jfs-left">
              <div><p class="jfs-maker">${c.maker}</p><p class="jfs-model">${c.model}</p></div>
              <div class="jfs-list">${list(c.overview)}</div>
            </div>
            <div class="jfs-center"><div class="jfs-blueprint">${blueprint}</div></div>
            <div class="jfs-right">
              <div><p class="jfs-kicker">${c.kicker}</p><p class="jfs-headline">${c.headline}</p><p class="jfs-body">${c.body}</p></div>
              <div class="jfs-list jfs-list2">${list(c.specs)}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="jfs-jet"><div class="jfs-img">${plane}</div></div>
    </div>`,

  animate(el) {
    const mob = innerWidth < SIG.breakPoint;
    el.classList.toggle("jfs-mob", mob);
    const area = el.querySelector(".jfs-area");

    // 배경: 어두운 톤 → 밝은 톤(넓고 좁은 화면 모두)
    gsap.fromTo(el.querySelector(".jfs-light"), { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: area, start: SIG.light.start, end: SIG.light.end, scrub: true } });

    // 제목 사이 빈칸: 섹션이 보이면 벌어짐(원본은 CSS 전환)
    const push = el.querySelector(".jfs-push");
    ScrollTrigger.create({ trigger: area, start: "top 60%", onEnter: () => push.classList.add("current"), onLeaveBack: () => push.classList.remove("current") });

    if (!mob) {
      const W = SIG.swap, J = SIG.jet, X = SIG.wipe;
      // 소개 화면 ↓, 제원 화면 ↓(위에서 내려옴)
      [el.querySelector(".jfs-w"), el.querySelector(".jfs-spec")].forEach((e) =>
        gsap.fromTo(e, { yPercent: 0 }, { yPercent: 100, ease: "none", scrollTrigger: { trigger: area, start: W.start, end: W.end, scrub: W.scrub } }));
      // 기체: 천천히 시작해 빨라지며 40%로
      gsap.fromTo(el.querySelector(".jfs-jet"), { scale: 1, yPercent: 0 }, { scale: J.scale, yPercent: J.yPercent, ease: J.ease, scrollTrigger: { trigger: area, start: J.start, end: J.end, scrub: J.scrub } });
      // 기체 지우기 + 배치도 드러내기
      gsap.fromTo(el.querySelector(".jfs-img"), { "--mask-size": "100% 150%" }, { "--mask-size": "100% 0%", ease: "none", scrollTrigger: { trigger: area, start: X.start, end: X.end, scrub: true } });
      gsap.fromTo(el.querySelector(".jfs-blueprint"), { "--mask-size": "100% 0%", "--mask-y": "200%" }, { "--mask-size": "100% 150%", "--mask-y": "50%", ease: "none", scrollTrigger: { trigger: area, start: X.start, end: X.end, scrub: true } });

      // 글자 흐림 등장(원본은 넓은 화면에서만)
      const R = SIG.reveal;
      el.querySelectorAll("[data-jfs-chars]").forEach((h) => {
        const st = SplitText.create(h, { type: "words,chars", wordsClass: "word", charsClass: "char" });
        gsap.set(st.words, { display: "inline-block", whiteSpace: "nowrap" });
        gsap.from(st.chars, { filter: R.blur, opacity: 0, duration: R.duration, delay: R.delay, stagger: R.chars, ease: "jfsOut", scrollTrigger: { trigger: h, start: "top bottom", toggleActions: "play none none none" } });
      });
      el.querySelectorAll("[data-jfs-lines]").forEach((p) => {
        const st = SplitText.create(p, { type: "lines", linesClass: "line" });
        gsap.from(st.lines, { filter: R.blur, opacity: 0, duration: R.duration, delay: R.delay, stagger: R.lines, ease: "jfsOut", scrollTrigger: { trigger: p, start: "top bottom", toggleActions: "play none none none" } });
      });
      el.querySelectorAll("[data-jfs-div]").forEach((d) => {
        gsap.from(d.children, { filter: R.blur, opacity: 0, duration: R.duration, delay: R.delay, stagger: R.lines, ease: "jfsOut", scrollTrigger: { trigger: d, start: "top bottom", toggleActions: "play none none none" } });
      });
    }
  },
};
