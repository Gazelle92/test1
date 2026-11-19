// 가격: 월간·연간 전환 시 가격 숫자가 한 자리씩 뒤집히고, 요금제 카드가 스크롤에 맞춰 차례로 올라온다.
// 참고: madewithgsap 가격 섹션(숫자 뒤집기 토글). 코드·내용은 새로 작성.
import gsap from "gsap";
import "./style.css";

const digits = (a, b) => {
  const n = Math.max(a.length, b.length);
  a = a.padStart(n, " "); b = b.padStart(n, " ");
  return [...a].map((x, i) => `<span class="pf-d"><span class="pf-a">${x}</span><span class="pf-b">${b[i]}</span></span>`).join("");
};

export default {
  id: "pricing-flip",
  category: "가격",
  source: "madewithgsap 가격 섹션 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "요금제 3개 · 월간/연간 숫자 뒤집기",
  defaults: {
    title: "필요한 만큼만 고르세요",
    monthly: "월간",
    yearly: "연간 (17% 할인)",
    plans: [
      { name: "기본", m: "0", y: "0", desc: "혼자 시작할 때", items: ["모듈 20개", "테마 1개", "커뮤니티 지원"] },
      { name: "프로", m: "29,000", y: "24,000", desc: "가장 많이 고르는 요금제", items: ["모든 모듈", "테마 무제한", "새 모듈 먼저 사용"], hot: true },
      { name: "팀", m: "79,000", y: "66,000", desc: "여럿이 함께 만들 때", items: ["프로의 모든 기능", "팀원 5명", "우선 지원"] },
    ],
  },
  render: (c) => `
    <div class="pf-wrap">
      <h2 class="pf-title">${c.title}</h2>
      <button class="pf-toggle" type="button" aria-pressed="false">
        <span>${c.monthly}</span><span class="pf-switch"><i></i></span><span>${c.yearly}</span>
      </button>
      <div class="pf-grid">${c.plans.map((p) => `
        <article class="pf-card${p.hot ? " hot" : ""}">
          <h3>${p.name}</h3><p class="pf-desc">${p.desc}</p>
          <div class="pf-price"><span class="pf-cur">₩</span><span class="pf-digits">${digits(p.m, p.y)}</span><span class="pf-per">/월</span></div>
          <ul>${p.items.map((x) => `<li>${x}</li>`).join("")}</ul>
          <a class="pf-cta" href="#">시작하기</a>
        </article>`).join("")}
      </div>
    </div>`,
  animate(el, m) {
    // 카드 등장
    gsap.from(".pf-card", {
      y: 70, opacity: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.12),
      scrollTrigger: { trigger: ".pf-grid", start: "top 85%", toggleActions: "play none none reverse" },
    });

    // 월간·연간 전환: 스위치 이동 + 숫자 한 자리씩 뒤집기
    gsap.set(".pf-b", { rotationX: 90 });
    const tl = gsap.timeline({ paused: true })
      .to(".pf-switch i", { x: 18, duration: m.d(0.25), ease: m.ease.back }, 0)
      .to(".pf-a", { rotationX: -90, duration: m.d(0.45), ease: m.ease.back, stagger: m.stagger(0.05) }, 0)
      .to(".pf-b", { rotationX: 0, duration: m.d(0.45), ease: m.ease.back, stagger: m.stagger(0.05) }, 0);
    const btn = el.querySelector(".pf-toggle");
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(on));
      on ? tl.play() : tl.reverse();
    });
  },
};
