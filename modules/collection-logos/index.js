// 로고 띠: 제목·소개 아래에 효과 예시 카드 3장(마우스를 따라 기울고, 올리면 버튼이 드러남),
// 그 아래 사용 팀 얼굴·숫자와 끝없이 흐르는 로고 띠(화면에 보일 때만 흐름).
// 참고: madewithgsap 컬렉션·사용 팀 섹션(카드 기울기, xPercent -50 무한 로고 띠). 코드·내용·로고는 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

// 지어낸 로고: 간단한 도형 + 글자
const MARKS = {
  circle: `<circle cx="10" cy="10" r="8"/>`,
  ring: `<circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="3"/>`,
  tri: `<path d="M10 2l8 15H2z"/>`,
  square: `<rect x="3" y="3" width="14" height="14" rx="3"/>`,
  half: `<path d="M2 10a8 8 0 0 1 16 0z"/><path d="M2 12h16v2H2z"/>`,
  plus: `<path d="M8 2h4v6h6v4h-6v6H8v-6H2V8h6z"/>`,
  wave: `<path d="M1 12c3-6 6-6 9 0s6 6 9 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
  diamond: `<path d="M10 1l9 9-9 9-9-9z"/>`,
};
const logo = (l) => `<span class="cl-logo"><svg viewBox="0 0 20 20" aria-hidden="true">${MARKS[l.mark] || MARKS.circle}</svg><b>${l.name}</b></span>`;

// 카드 속 그림(영상 대신 도형 움직임)
const art = (i) => [
  `<i class="cl-orb"></i><i class="cl-orb cl-orb2"></i>`,
  `<span class="cl-bars">${"<i class='cl-bar'></i>".repeat(6)}</span>`,
  `<i class="cl-sq"></i><i class="cl-sq cl-sq2"></i><i class="cl-sq cl-sq3"></i>`,
][i % 3];

export default {
  id: "collection-logos",
  category: "로고 띠",
  source: "madewithgsap 컬렉션·사용 팀 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "제목 + 기울어지는 예시 카드 3장 + 보일 때만 흐르는 로고 띠",
  defaults: {
    title: "손이 덜 가는 더 나은 웹사이트",
    text: "번거로운 준비 없이 <span>사이트에</span> 눈에 띄는 움직임을 더하세요. <span>기억에 남는 화면을 만드는 데 필요한 것을</span> 한곳에 모았습니다.",
    cards: [
      { no: "42", tag: "클릭 · 마우스", date: "3일 전 추가" },
      { no: "41", tag: "스크롤", date: "1주 전 추가" },
      { no: "40", tag: "끌기 · 무한", date: "2주 전 추가" },
    ],
    preview: "미리보기",
    copy: "코드 복사",
    cta: "모음 전체 보기",
    count: "2.4K+",
    trust: "<span>함께하는 곳</span> 전 세계 2,400여 개 팀과 개인",
    people: ["가", "나", "다", "라", "마", "바", "사", "아"],
    logos: [
      { name: "NORDA", mark: "tri" },
      { name: "lumen", mark: "circle" },
      { name: "포레스트", mark: "half" },
      { name: "kiwi.lab", mark: "ring" },
      { name: "ORBIT", mark: "diamond" },
      { name: "studio 9", mark: "square" },
      { name: "모아", mark: "plus" },
      { name: "Palette", mark: "wave" },
      { name: "HALO", mark: "ring" },
      { name: "브릭스", mark: "square" },
    ],
  },
  render: (c) => `
    <div class="cl-wrap">
      <h2 class="cl-title">${c.title}</h2>
      <p class="cl-text">${c.text}</p>
      <div class="cl-scroller">
        <ul class="cl-list">${c.cards.map((x, i) => `
          <li class="cl-push" style="--i:${i}">
            <div class="cl-top">
              <span class="cl-date">${x.date}</span>
              <div class="cl-media"><div class="cl-art"><span class="cl-bg"></span>${art(i)}</div></div>
              <div class="cl-ctas"><a href="#">${c.preview}</a><a href="#">${c.copy}</a></div>
            </div>
            <div class="cl-label"><span>${x.no}</span><span>${x.tag}</span></div>
          </li>`).join("")}
        </ul>
      </div>
      <a class="cl-cta" href="#"><span class="cl-roll"><span>${c.cta} →</span><span>${c.cta} →</span></span></a>
    </div>
    <div class="cl-trust">
      <div class="cl-people">${c.people.map((p, i) => `<span class="cl-face" style="--i:${i}">${p}</span>`).join("")}<span class="cl-tag">${c.count}</span></div>
      <p class="cl-trust-text">${c.trust}</p>
      <hr class="cl-sep">
      <div class="cl-band"><div class="cl-logos">
        <div class="cl-set">${c.logos.map(logo).join("")}</div>
        <div class="cl-set" aria-hidden="true">${c.logos.map(logo).join("")}</div>
      </div></div>
    </div>`,
  animate(el, m) {
    // 제목·소개·카드 등장
    const head = { trigger: ".cl-wrap", start: "top 80%", toggleActions: "play none none reverse" };
    gsap.from(".cl-title, .cl-text", { y: 40, autoAlpha: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.1), scrollTrigger: head });
    gsap.from(".cl-push", {
      y: 80, autoAlpha: 0, duration: m.d(1), ease: m.ease.out, stagger: m.stagger(0.12),
      scrollTrigger: { trigger: ".cl-list", start: "top 85%", toggleActions: "play none none reverse" },
    });
    gsap.from(".cl-face, .cl-tag", {
      scale: 0.4, autoAlpha: 0, duration: m.d(0.6), ease: m.ease.out, stagger: m.stagger(0.05),
      scrollTrigger: { trigger: ".cl-trust", start: "top 85%", toggleActions: "play none none reverse" },
    });

    // 카드 속 도형: 보일 때만 움직임
    const loops = [
      gsap.to(".cl-orb", { xPercent: 80, yPercent: -30, duration: m.d(2.2), ease: m.ease.inOut, repeat: -1, yoyo: true, stagger: m.stagger(0.5) }),
      gsap.to(".cl-bar", { scaleY: 0.25, duration: m.d(0.7), ease: m.ease.inOut, stagger: { each: m.stagger(0.12), repeat: -1, yoyo: true } }),
      gsap.to(".cl-sq", { rotation: 90, duration: m.d(1.6), ease: m.ease.back, repeat: -1, repeatDelay: m.d(0.4), stagger: m.stagger(0.2) }),
    ];
    loops.forEach((t) => t.pause());
    ScrollTrigger.create({
      trigger: ".cl-list", start: "top bottom", end: "bottom top",
      onToggle: (s) => loops.forEach((t) => (s.isActive ? t.play() : t.pause())),
    });

    // 로고 띠: 같은 줄 두 벌을 왼쪽으로 절반만큼 끝없이 이동, 화면에 들어올 때만 재생
    const band = gsap.timeline({ paused: true }).to(".cl-logos", { xPercent: -50, duration: m.d(30), ease: "none", repeat: -1 });
    ScrollTrigger.create({
      trigger: ".cl-band", start: "top bottom", end: "bottom top",
      onEnter: () => band.play(), onEnterBack: () => band.play(),
      onLeave: () => band.pause(), onLeaveBack: () => band.pause(),
    });

    // 카드 기울기: 마우스 위치에 따라 ±10도, 올리면 그림이 살짝 커지고 버튼이 드러남
    if (matchMedia("(hover: none)").matches) return;
    el.querySelectorAll(".cl-push").forEach((card) => {
      const media = card.querySelector(".cl-media");
      const art = card.querySelector(".cl-art");
      const ctas = card.querySelector(".cl-ctas");
      const rx = gsap.quickTo(media, "rotationX", { duration: m.d(0.4), ease: m.ease.out });
      const ry = gsap.quickTo(media, "rotationY", { duration: m.d(0.4), ease: m.ease.out });
      gsap.set(ctas, { autoAlpha: 0, y: 10 });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - 0.5) * -20);
        ry(((e.clientX - r.left) / r.width - 0.5) * 20);
      });
      card.addEventListener("mouseenter", () => {
        gsap.to(art, { scale: 1.04, duration: m.d(0.5), ease: m.ease.back, overwrite: true });
        gsap.to(ctas, { autoAlpha: 1, y: 0, duration: m.d(0.3), ease: m.ease.out, overwrite: true });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(art, { scale: 1, duration: m.d(0.3), ease: m.ease.back, overwrite: true });
        gsap.to(ctas, { autoAlpha: 0, y: 10, duration: m.d(0.2), ease: m.ease.out, overwrite: true });
        rx(0); ry(0);
      });
    });
  },
};
