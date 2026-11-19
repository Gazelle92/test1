// 숫자·카드: 큰 숫자가 무작위 순서로 한 글자씩 나타나고, 이어서 카드가 한 장씩 겹쳐 쌓이며 묶음이 흔들린다.
// 참고: madewithgsap 효과 수·카드 섹션(무작위 글자 등장, 카드 쌓기). 코드·내용은 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

const STEP = 6.2; // 카드 한 장당 회전 각도

export default {
  id: "effects-cards",
  category: "숫자·카드",
  source: "madewithgsap 효과 섹션 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "큰 숫자 무작위 등장 → 카드 한 장씩 쌓기",
  defaults: {
    big: "120+ 모듈",
    sub: "히어로부터 푸터까지, 고르고 순서만 정하면 한 페이지가 됩니다.",
    cards: ["히어로", "카드", "가격", "후기", "갤러리", "전환", "로고", "푸터"],
    caption: "스크롤하면 한 장씩 쌓입니다",
  },
  render: (c) => `
    <div class="ec-texts"><div class="ec-sticky">
      <h2 class="ec-big">${c.big}</h2><p class="ec-sub">${c.sub}</p>
    </div></div>
    <div class="ec-cards"><div class="ec-sticky">
      <div class="ec-stack">${c.cards.map((t, i) => `
        <article class="ec-card" style="--i:${i};--n:${c.cards.length}">
          <span class="ec-no">${String(i + 1).padStart(2, "0")}</span><strong>${t}</strong>
        </article>`).join("")}
      </div>
      <p class="ec-cap">${c.caption}</p>
    </div></div>`,
  animate(el, m) {
    // 큰 숫자: 무작위 순서로 한 글자씩 등장(스크롤 연동)
    const chars = m.split(el.querySelector(".ec-big"));
    gsap.set(chars, { opacity: 0 });
    gsap.to(chars, {
      opacity: 1, duration: 0.01, ease: "none", stagger: { each: m.stagger(0.2), from: "random" },
      scrollTrigger: { trigger: ".ec-texts", start: "top 60%", end: "85% bottom", scrub: m.scrub },
    });
    gsap.from(".ec-sub", {
      y: 30, opacity: 0, duration: m.d(0.9), ease: m.ease.out,
      scrollTrigger: { trigger: ".ec-texts", start: "40% bottom", toggleActions: "play none none reverse" },
    });

    // 카드: 진행도에 따라 한 장씩 쌓고, 묶음 전체가 탄성 있게 돈다
    const cards = [...el.querySelectorAll(".ec-card")];
    const stack = el.querySelector(".ec-stack");
    let shown = -1;
    const show = (t) => {
      if (t === shown) return;
      cards.forEach((card, i) => {
        const on = i <= t;
        if (on && !card.classList.contains("on")) {
          card.classList.add("on");
          gsap.set(card, { rotation: i * STEP });
          gsap.fromTo(card, { scale: 0.94 }, { scale: 1, ease: m.ease.elastic, duration: m.d(0.5) });
        } else if (!on) card.classList.remove("on");
      });
      gsap.to(stack, { rotation: -Math.max(t, 0) * STEP / 2, ease: m.ease.elastic, duration: m.d(0.5) });
      shown = t;
    };
    ScrollTrigger.create({
      trigger: ".ec-cards", start: "top top", end: "bottom bottom",
      onUpdate: (s) => show(Math.min(cards.length - 1, Math.floor(s.progress * cards.length))),
      onLeaveBack: () => show(-1),
    });
  },
};
