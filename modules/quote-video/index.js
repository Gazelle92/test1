// 후기: 화면 가득한 배경 판이 둥근 테두리에서 넓어지며 올라오고, 큰 인용문이 줄마다 밀려 들어오며 단어가 차례로 밝아진다.
// 아래에는 말한 사람과 작은 '영상 보기' 카드(실제 영상 없음). 배경·글은 서로 다른 속도로 움직인다(시차).
// 참고: breakthroughenergy 인용(안쪽 여백 잘라내기 → 꽉 참, 줄별 밀려 들어옴, 배경 시차). 코드·문구·이미지는 새로 작성.
import gsap from "gsap";
import "./style.css";

// "*강조*" 표시는 강조색 단어로 바꾸고, 모든 단어를 하나씩 감싼다.
const words = (line) => {
  let on = false;
  return line.split(" ").map((w) => {
    const start = w.startsWith("*");
    if (start) on = true;
    const em = on;
    if (w.replace(/^\*/, "").includes("*")) on = false;
    return `<span class="qv-w${em ? " em" : ""}">${w.replace(/\*/g, "")}</span>`;
  }).join(" ");
};

export default {
  id: "quote-video",
  category: "후기",
  source: "breakthroughenergy 인용 참고",
  form: "스크롤형",
  summary: "배경 판 넓어짐 → 인용문 단어 차례로 밝아짐 + 영상 보기 카드",
  defaults: {
    quote: [
      "전환은 *기술* 하나로",
      "끝나지 않습니다. 사람과 도시,",
      "그리고 *기다려 줄 자본이*",
      "함께 움직일 때 시작됩니다.",
    ],
    name: "한지우",
    role: "연구 책임자 · 도시에너지재단",
    video: "영상 보기",
    duration: "2:40",
  },
  render: (c) => `
    <div class="qv-area">
      <div class="qv-stage">
        <div class="qv-inner">
          <div class="qv-bg">
            <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <circle class="qv-glow" cx="124" cy="40" r="12"/>
              <path class="qv-r1" d="M0 86 Q40 70 82 82 T160 76 V120 H0Z"/>
              <path class="qv-r2" d="M0 100 Q52 86 100 96 T160 92 V120 H0Z"/>
            </svg>
          </div>
          <div class="qv-col">
            <blockquote class="qv-quote">${c.quote.map((l) => `<span class="qv-line">${words(l)}</span>`).join("")}</blockquote>
            <div class="qv-foot">
              <div class="qv-who"><p class="qv-name">${c.name}</p><p class="qv-role">${c.role}</p></div>
              <button class="qv-card" type="button" aria-label="${c.video}">
                <span class="qv-thumb"></span>
                <span class="qv-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>
                <span class="qv-meta"><b>${c.video}</b><span>${c.duration}</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  animate(el, m) {
    const radius = parseFloat(getComputedStyle(el).getPropertyValue("--radius")) || 0;

    // 1) 들어올 때: 판 안쪽 여백(화면 높이 7%)과 둥근 모서리가 줄며 화면을 꽉 채움, 배경·글은 다른 속도로
    gsap.timeline({ scrollTrigger: { trigger: ".qv-area", start: "top bottom", end: "top top", scrub: m.scrub } })
      .fromTo(".qv-inner", { clipPath: `inset(7vh 7vh 7vh 7vh round ${radius + 4}px)` },
        { clipPath: "inset(0vh 0vh 0vh 0vh round 0px)", ease: "none" }, 0)
      .fromTo(".qv-bg", { yPercent: -18 }, { yPercent: 0, ease: "none" }, 0)
      .fromTo(".qv-col", { y: "13vh" }, { y: 0, ease: "none" }, 0);

    // 2) 머무는 동안: 줄마다 오른쪽에서 밀려 들어오고, 단어가 흐림 → 밝음으로 차례로 바뀜
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".qv-area", start: "top top", end: "bottom bottom", scrub: m.scrub } });
    el.querySelectorAll(".qv-line").forEach((ln, i) => {
      tl.fromTo(ln, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5 - i * 0.2, ease: "none" }, i * 0.3);
    });
    tl.fromTo(".qv-w", { opacity: 0.18 }, { opacity: 1, duration: 0.4, ease: "none", stagger: 0.12 }, 0.3)
      .fromTo(".qv-foot", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "none" }, ">-0.6")
      .fromTo(".qv-bg", { yPercent: 0 }, { yPercent: 10, duration: tl.duration(), ease: "none", immediateRender: false }, 0);

    // 3) 나갈 때: 배경은 더 빠르게(0.6), 글은 조금(0.13) 위로 → 시차
    gsap.timeline({ scrollTrigger: { trigger: ".qv-area", start: "bottom bottom", end: "bottom top", scrub: m.scrub } })
      .fromTo(".qv-bg", { y: 0 }, { y: () => -innerHeight * 0.3, ease: "none", immediateRender: false }, 0)
      .fromTo(".qv-col", { y: 0 }, { y: () => innerHeight * 0.13, ease: "none", immediateRender: false }, 0);

    // 영상 카드: 올리면 그림이 살짝 커지고 재생 단추가 튐(실제 영상은 없음)
    const card = el.querySelector(".qv-card");
    const hover = gsap.timeline({ paused: true })
      .to(".qv-thumb", { scale: 1.08, duration: m.d(0.6), ease: m.ease.out }, 0)
      .to(".qv-play", { scale: 1.15, duration: m.d(0.4), ease: m.ease.back }, 0);
    card.addEventListener("mouseenter", () => hover.play());
    card.addEventListener("mouseleave", () => hover.reverse());
    card.addEventListener("focus", () => hover.play());
    card.addEventListener("blur", () => hover.reverse());
  },
};
