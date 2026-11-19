// 히어로: 창문이 커지며 하늘로 들어가고 제목이 양옆으로 갈라진 뒤, 소개 문장이 스크롤에 맞춰 밝아진다.
// 참고: jeskojets 히어로(창문 확대·좌우 분리·하이라이트 문장). 코드·이미지는 새로 작성.
import gsap from "gsap";
import "./style.css";

export default {
  id: "hero-window",
  category: "히어로",
  source: "jeskojets 히어로 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "창문 확대 → 제목 좌우 분리 → 소개 문장 밝아짐",
  defaults: {
    left: "하늘을",
    right: "가볍게",
    hint: "아래로 스크롤",
    intro: "필요한 순간에 필요한 곳으로. 복잡한 절차 없이 한 번의 연락으로 이동을 준비합니다.",
  },
  render: (c) => `
    <div class="hw-area">
      <div class="hw-stage">
        <div class="hw-sky">${[0, 1, 2, 3, 4].map((i) => `<i class="hw-cloud hw-cloud-${i}"></i>`).join("")}</div>
        <div class="hw-frame"></div>
        <h1 class="hw-title"><span class="hw-l">${c.left}</span><span class="hw-r">${c.right}</span></h1>
        <p class="hw-hint">${c.hint}</p>
      </div>
    </div>
    <div class="hw-intro"><p>${c.intro}</p></div>`,
  animate(el, m) {
    // 처음 등장: 제목 글자가 아래에서 올라옴
    const chars = [...m.split(el.querySelector(".hw-l")), ...m.split(el.querySelector(".hw-r"))];
    gsap.from(chars, { yPercent: 110, opacity: 0, duration: m.d(1), ease: m.ease.out, stagger: m.stagger(0.04), delay: 0.15 });
    gsap.from(".hw-frame", { opacity: 0, duration: m.d(1.2), ease: m.ease.out });

    // 스크롤: 창문 확대 + 제목 좌우 분리 + 구름 시차
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".hw-area", start: "top top", end: "bottom bottom", scrub: m.scrub } });
    tl.to(".hw-frame", { scale: 6.5, ease: "none" }, 0)
      .to(".hw-l", { x: "-50vw", ease: "none" }, 0)
      .to(".hw-r", { x: "50vw", ease: "none" }, 0)
      .to(".hw-hint", { opacity: 0, ease: "none", duration: 0.15 }, 0)
      .to(".hw-cloud", { y: (i) => -(i + 1) * 90, scale: 1.4, ease: "none" }, 0);

    // 소개 문장: 글자가 흐린 상태에서 차례로 밝아짐
    const hl = m.split(el.querySelector(".hw-intro p"));
    gsap.from(hl, {
      opacity: 0.15, ease: "none", stagger: m.stagger(0.04),
      scrollTrigger: { trigger: ".hw-intro", start: "top 75%", end: "bottom 60%", scrub: m.scrub },
    });
  },
};
