// 갤러리: 화면이 고정된(sticky) 동안 프로젝트 카드가 오른쪽 끝에서 차례로 출발해 왼쪽으로 흘러가며,
// 가는 도중 제각각 위아래로 흩어지며 커졌다가 다시 줄어 사라진다.
// 참고: madewithgsap 쇼케이스 섹션(pin-height 고정 + 순차 이동·확대·축소). 코드·내용은 새로 작성.
import gsap from "gsap";
import "./style.css";

export default {
  id: "showcase-pinned",
  category: "갤러리",
  source: "madewithgsap 쇼케이스 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "고정 화면 위로 프로젝트 카드가 흘러가며 커졌다 작아짐",
  defaults: {
    title: "이 모음으로 완성한 사이트와 프로젝트를 둘러보세요",
    cta: "작업 모아 보기",
    href: "#",
    projects: [
      { name: "봄빛 식물원", tag: "브랜드 사이트" },
      { name: "새벽 커피", tag: "온라인 상점" },
      { name: "파도 스튜디오", tag: "포트폴리오" },
      { name: "구름 여행", tag: "캠페인" },
      { name: "모래 가구", tag: "제품 소개" },
      { name: "달빛 서점", tag: "온라인 상점" },
      { name: "숲길 학교", tag: "교육 플랫폼" },
      { name: "노을 음악제", tag: "행사 사이트" },
      { name: "바람 자전거", tag: "브랜드 사이트" },
      { name: "하늘 건축", tag: "포트폴리오" },
      { name: "별빛 극장", tag: "캠페인" },
      { name: "물결 화장품", tag: "제품 소개" },
    ],
  },
  render: (c) => `
    <div class="sp-top">
      <h2 class="sp-title">${c.title}</h2>
      <a class="sp-cta" href="${c.href}">
        <span class="sp-clip"><span class="sp-roll"><span>${c.cta} <i>→</i></span><span aria-hidden="true">${c.cta} <i>→</i></span></span></span>
      </a>
    </div>
    <div class="sp-pin">
      <div class="sp-stage">${c.projects.map((p, i) => `
        <article class="sp-card sp-v${i % 3}" style="--i:${i}">
          <div class="sp-bar"><i></i><i></i><i></i></div>
          <div class="sp-shot">
            <b class="sp-h"></b><b class="sp-h sp-h2"></b>
            <span class="sp-blob"></span>
          </div>
          <p class="sp-name"><strong>${p.name}</strong><span>${p.tag}</span></p>
        </article>`).join("")}
      </div>
    </div>`,
  animate(el, m) {
    // 제목·버튼 등장
    gsap.from(".sp-top > *", {
      y: 40, opacity: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.1),
      scrollTrigger: { trigger: ".sp-top", start: "top 85%", toggleActions: "play none none reverse" },
    });

    // 버튼: 마우스를 올리면 글자가 한 줄 굴러 내려옴
    const cta = el.querySelector(".sp-cta");
    cta.addEventListener("mouseenter", () => {
      gsap.fromTo(".sp-roll", { yPercent: 0 }, { yPercent: 100, duration: m.d(0.4), ease: m.ease.back, overwrite: true });
    });

    // 고정 구간: 카드마다 순서대로 오른쪽 끝 → 왼쪽 끝으로 이동,
    // 앞 절반은 위아래로 흩어지며 커지고 뒤 절반은 제자리로 모이며 줄어든다
    const stage = el.querySelector(".sp-stage");
    const cards = el.querySelectorAll(".sp-card");
    const st = m.stagger(0.1);
    gsap.set(cards, { scale: 0 });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".sp-pin", start: "top top", end: "bottom bottom", scrub: m.scrub, invalidateOnRefresh: true },
    });
    tl.to(cards, { xPercent: 100, x: () => -stage.clientWidth, ease: "none", duration: 1, stagger: st })
      .to(cards, { yPercent: () => 160 * (Math.random() - 0.5), scale: 1, ease: "none", duration: 0.5, stagger: st }, "<")
      .to(cards, { yPercent: 0, scale: 0, ease: "none", duration: 0.5, stagger: st }, "<+=0.5");
  },
};
