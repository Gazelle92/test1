// 가격 (킥 모션 보존판): 요금제 카드 하나. 분기·연간을 바꾸면 가격과 설명 두 덩어리가
// 450px 뒤의 축을 중심으로 프리즘처럼 차례로 돌아가고(rotationY -54° ↔ 0°), 스위치 손잡이가 튕기듯 넘어간다.
// 버튼은 마우스를 올리면 글자가 위에서 한 번 굴러 내려온다.
// 원본: madewithgsap.com .s-pricing (assets/landing/app2.js). SIG 값은 원본 숫자 그대로. 테마는 색·글꼴만 따른다.
import gsap from "gsap";
import "./style.css";

const SIG = {
  toggle: { x: 12, duration: 0.2, ease: "back.inOut(1.5)" }, // .toggle-price .rond
  prism: { out: -54, stagger: 0.05, duration: 0.45, ease: "back.inOut(1.5)" }, // .center1/.center2 .rot
  rollMs: 400, // .roll.on 유지 시간(애니메이션 0.4s cubic-bezier(.16,.03,.08,1.55))
};

const arrow = `<svg viewBox="0 0 12 10" width="12" height="10" aria-hidden="true"><path d="M0 5h10M6 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
const roll = (cls, label, href) =>
  `<a class="ps-cta roll ${cls}" href="${href}"><span><span class="translate"><span>${label}${arrow}</span><span>${label}${arrow}</span></span></span></a>`;

export default {
  id: "pricing-flip-sig",
  category: "가격",
  source: "madewithgsap 가격 섹션 · 원본 모션 보존",
  form: "고정형",
  summary: "요금제 1개 · 분기/연간 전환 시 가격이 프리즘처럼 회전",
  defaults: {
    title: "하나의 요금제.<br>모든 모듈 포함.",
    save: "연간 결제 시 20% 할인",
    q: { tab: "분기", price: "25,000원", label: "월 기준 · 분기마다 결제" },
    y: { tab: "연간", badge: "-20%", price: "20,000원", label: "월 기준 · 1년마다 결제" },
    cta: "시작하기",
    note: "안전한 결제<br>언제든 갱신 해지<br>세금은 결제 단계에서 계산",
    groups: [
      { title: "모두 사용", items: ["모듈 120개 이상", "매주 새 모듈", "사용 문의 지원", "데스크톱 앱"] },
      { title: "모듈마다", items: ["바로 붙이는 컴포넌트", "AI 프롬프트", "HTML/JS 내려받기", "자세한 사용법"] },
    ],
    people: "1,800+ 팀이 사용 중",
  },
  render: (c) => `
    <div class="ps-wrap">
      <h2 class="ps-title">${c.title}</h2>
      <p class="ps-save">${c.save}</p>
      <div class="ps-inner">
        <div class="ps-card"><div class="ps-card-top">
          <div class="ps-top">
            <button type="button" class="ps-to-q">${c.q.tab}</button>
            <button type="button" class="ps-toggle" aria-label="결제 주기 바꾸기"><span class="ps-back"><span class="ps-rond"></span></span></button>
            <button type="button" class="ps-to-y"><span>${c.y.tab}</span><sup>${c.y.badge}</sup></button>
          </div>
          <div class="ps-milieu">
            <div class="ps-center ps-c1">
              <div class="ps-rot"><p class="ps-price">${c.q.price}</p></div>
              <div class="ps-rot"><p class="ps-label">${c.q.label}</p></div>
            </div>
            <div class="ps-center ps-c2">
              <div class="ps-rot"><p class="ps-price">${c.y.price}</p></div>
              <div class="ps-rot"><p class="ps-label">${c.y.label}</p></div>
              <div>${roll("ps-cta-q", c.cta, "#")}${roll("ps-cta-y off", c.cta, "#")}</div>
            </div>
          </div>
          <p class="ps-note">${c.note}</p>
        </div></div>
        <div class="ps-whatsin">
          <div>${c.groups.map((g) => `
            <p class="ps-gt">${g.title}</p>
            <ul>${g.items.map((x) => `<li><i aria-hidden="true"></i><span>${x}</span></li>`).join("")}</ul>`).join("")}
          </div>
          <div class="ps-bottom"><span>${c.people}</span><span class="ps-people"><i></i><i></i><i></i><i></i></span></div>
        </div>
      </div>
    </div>`,

  animate(el) {
    // 원본과 같은 두 타임라인(멈춘 채 뒤집힌 상태에서 시작)
    const tlToggle = gsap.timeline({ paused: true, reversed: true })
      .to(el.querySelector(".ps-rond"), SIG.toggle);
    const P = SIG.prism;
    const tlPrice = gsap.timeline({ paused: true, reversed: true })
      .to(el.querySelectorAll(".ps-c1 .ps-rot"), { rotationY: P.out, stagger: P.stagger, duration: P.duration, ease: P.ease })
      .to(el.querySelectorAll(".ps-c2 .ps-rot"), { rotationY: 0, stagger: P.stagger, duration: P.duration, ease: P.ease }, "<");

    const top = el.querySelector(".ps-card-top");
    const ctaQ = el.querySelector(".ps-cta-q"), ctaY = el.querySelector(".ps-cta-y");
    const onClick = (e) => {
      const t = e.target;
      if (!t.closest(".ps-toggle, .ps-to-q, .ps-to-y")) return;
      // 원본 규칙: 연간 누름 또는 (스위치 누름 + 지금 분기) → 연간으로, 그 밖에는 분기로
      const toYear = t.closest(".ps-to-y") || (t.closest(".ps-toggle") && tlPrice.reversed());
      if (toYear) { tlToggle.play(); tlPrice.play(); ctaQ.classList.add("off"); ctaY.classList.remove("off"); top.classList.add("on"); }
      else { tlToggle.reverse(); tlPrice.reverse(); ctaQ.classList.remove("off"); ctaY.classList.add("off"); top.classList.remove("on"); }
    };
    el.addEventListener("click", onClick);

    // 버튼 굴림(마우스가 있는 기기만)
    const timers = new Map();
    const onEnter = (e) => {
      const r = e.currentTarget;
      r.classList.remove("on"); void r.offsetWidth; r.classList.add("on");
      clearTimeout(timers.get(r));
      timers.set(r, setTimeout(() => r.classList.remove("on"), SIG.rollMs));
    };
    const rolls = matchMedia("(pointer: fine)").matches ? [...el.querySelectorAll(".roll")] : [];
    rolls.forEach((r) => r.addEventListener("mouseenter", onEnter));

    return () => {
      el.removeEventListener("click", onClick);
      rolls.forEach((r) => r.removeEventListener("mouseenter", onEnter));
      timers.forEach((t) => clearTimeout(t));
    };
  },
};
