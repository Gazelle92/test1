// 소개: 상자 테두리가 그려지며 두 숫자(지금 → 목표)를 비교하는 막대가 자라고, 아래에서 차오르는 색 판 위로 설명이 바뀐 뒤,
// 상자가 닫히며 그 자리에 분야 이름 목록과 그림 카드가 한 장씩 올라와 쌓인다.
// 참고: breakthroughenergy 그래프·이미지 쌓기(테두리 그리기, 괄호 막대, 차오르는 판, 목록 상승). 코드·문구·이미지는 새로 작성.
import gsap from "gsap";
import "./style.css";

const TOTAL = 5.2; // 스크롤 길이(화면 높이 단위). 영역 높이 = (TOTAL + 1) * 100vh

const bar = (cls, v) => `
  <div class="gs-val ${cls}" style="--w:${v.ratio}">
    <div class="gs-bar"><i class="gs-h"></i><i class="gs-v gs-vl"></i><i class="gs-v gs-vr"></i></div>
    <div class="gs-labels"><span class="gs-num">${v.value}</span><span class="gs-cap">${v.label}</span></div>
  </div>`;

export default {
  id: "graph-stack",
  category: "소개",
  source: "breakthroughenergy 그래프·이미지 참고",
  form: "스크롤형",
  summary: "테두리 그리기 + 두 숫자 막대 비교 → 분야 카드 한 장씩 쌓기",
  defaults: {
    side: "전환의 속도",
    goal: { value: "100%", label: "2050년 목표", ratio: 1 },
    now: { value: "18%", label: "2024년 현재", ratio: 0.24 },
    body1: ["지금 도시가 쓰는 전기 가운데", "깨끗한 에너지는 다섯에 하나입니다."],
    body2: ["남은 거리를 줄이는 일,", "다섯 분야에서 시작합니다."],
    subtitle: "집중하는 분야",
    stacks: ["태양광 지붕", "바다 위 풍력", "전력 저장", "그린 수소", "똑똑한 전력망"],
  },
  render: (c) => `
    <div class="gs-area">
      <div class="gs-stage">
        <div class="gs-side"><span>${c.side}</span></div>

        <div class="gs-stack">
          <div class="gs-stack-text">
            <p class="gs-sub">${c.subtitle}</p>
            <div class="gs-list-mask"><ol class="gs-list">${c.stacks.map((s, i) =>
              `<li class="gs-item"><span>${String(i + 1).padStart(2, "0")}</span>${s}</li>`).join("")}</ol></div>
          </div>
          <div class="gs-imgs">${c.stacks.map((_, i) =>
            `<div class="gs-card" data-v="${i % 5}"><i class="gs-card-in"></i></div>`).join("")}</div>
        </div>

        <div class="gs-box">
          <svg class="gs-border" preserveAspectRatio="none" aria-hidden="true"><rect pathLength="1"/></svg>
          <svg class="gs-cross gs-tl" viewBox="0 0 9 9" aria-hidden="true"><path d="M9 4.5H0M4.5 9V0"/></svg>
          <svg class="gs-cross gs-br" viewBox="0 0 9 9" aria-hidden="true"><path d="M9 4.5H0M4.5 9V0"/></svg>
          <div class="gs-content">
            <div class="gs-values">
              ${bar("gs-top", c.goal)}
              <svg class="gs-link" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                <path class="gs-mid gs-mid1" d="M${c.now.ratio * 100} 40 C ${c.now.ratio * 100 + 20} 30, 70 12, 100 0"/>
                <path class="gs-mid gs-mid2" d="M0 40 L0 0"/>
              </svg>
              ${bar("gs-base", c.now)}
            </div>
            <div class="gs-fill"></div>
            <div class="gs-text">
              <div class="gs-body gs-b1">${c.body1.map((l) => `<span class="gs-ln">${l}</span>`).join("")}</div>
              <div class="gs-body gs-b2">${c.body2.map((l) => `<span class="gs-ln">${l}</span>`).join("")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  animate(el, m) {
    const o = m.ease.out, io = m.ease.inOut;
    const tl = gsap.timeline({ scrollTrigger: { trigger: ".gs-area", start: "top top", end: "bottom bottom", scrub: m.scrub } });
    // 시간 위치 = 스크롤 위치(화면 높이 단위). 스크롤에 묶인 순서표이므로 진행 자체는 선형, 구간 안 모양만 테마 이징.

    // 1) 상자 등장 + 테두리 그리기 + 모서리 십자
    tl.fromTo(".gs-box", { scale: 0.7, y: "35vh" }, { scale: 1, y: 0, duration: 0.75, ease: o }, 0.05)
      .fromTo(".gs-border rect", { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1, ease: io }, 0.1)
      .fromTo(".gs-cross", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.15, ease: o }, 0.9)
      .fromTo(".gs-side span", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: o }, 0.5);

    // 2) 막대: 괄호 모양 가로선이 늘고 양끝 세로선·숫자가 따라 나타남
    const barIn = (sel, at) => {
      tl.fromTo(`${sel}`, { x: "-5%" }, { x: 0, duration: 0.4, ease: o }, at)
        .fromTo(`${sel} .gs-h`, { scaleX: 0.5, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.35, ease: o }, at)
        .fromTo(`${sel} .gs-v`, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at)
        .fromTo(`${sel} .gs-labels > *`, { x: -10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: o, stagger: 0.05 }, at + 0.15);
    };
    barIn(".gs-top", 0.5);
    barIn(".gs-base", 0.75);
    tl.fromTo(".gs-link", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.25, ease: o }, 0.75)
      .fromTo(".gs-mid1", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.85);

    // 3) 색 판이 아래에서 차오르고(61% → 20.8%), 설명 문장이 줄마다 올라왔다 빠진 뒤 다음 문장으로
    tl.fromTo(".gs-fill", { yPercent: 100 }, { yPercent: 61, duration: 0.75, ease: o }, 0.3)
      .to(".gs-fill", { yPercent: 20.8, duration: 0.85, ease: io }, 1.1)
      .fromTo(".gs-text", { yPercent: 100 }, { yPercent: 61, duration: 0.75, ease: o }, 0.3)
      .set(".gs-text", { yPercent: 20.8 }, 1.5);
    const linesIn = (sel, at) => tl.fromTo(`${sel} .gs-ln`, { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.3, ease: o, stagger: 0.09 }, at);
    linesIn(".gs-b1", 0.65);
    tl.to(".gs-b1 .gs-ln", { yPercent: -110, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.03 }, 1.2);
    linesIn(".gs-b2", 1.6);
    tl.to(".gs-values", { opacity: 0.25, duration: 0.4, ease: "none" }, 1.4);

    // 4) 상자 내용이 아래부터 닫히고 숫자·테두리가 사라짐 → 뒤의 분야 상자가 드러남
    tl.fromTo(".gs-content", { clipPath: "inset(-2px -2px 0% -2px)" }, { clipPath: "inset(-2px -2px 100% -2px)", duration: 0.5, ease: io }, 2.3)
      .to(".gs-values", { opacity: 0, duration: 0.2, ease: "none" }, 2.3)
      .to([".gs-border", ".gs-cross"], { opacity: 0, duration: 0.2, ease: "none" }, 2.7)
      .fromTo(".gs-stack", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 2.29);

    // 5) 분야: 목록이 한 칸씩 올라오며 한 줄씩 켜지고, 그림 카드가 아래에서 올라와 겹겹이 쌓임
    const items = [...el.querySelectorAll(".gs-item")];
    const cards = [...el.querySelectorAll(".gs-card")];
    const n = items.length, S0 = 2.7, step = 1.9 / (n - 0.5); // 2.7~4.6 안에 n단계
    tl.fromTo(".gs-sub", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: o }, S0 - 0.1);
    tl.set(".gs-list", { yPercent: 100 }, 0);
    items.forEach((it, i) => {
      const at = S0 + (i === 0 ? 0 : (i + 0.5) * step * 0.85);
      tl.to(".gs-list", { yPercent: ((n - i - 1) / n) * 100, duration: step * 0.7, ease: o }, at)
        .fromTo(it, { opacity: 0 }, { opacity: 1, duration: 0.01 }, at);
      if (i > 0) tl.to(items.slice(0, i), { opacity: 0.35, duration: 0.1, ease: "none" }, at);
      const card = cards[i];
      if (i === 0) tl.fromTo(card, { yPercent: 0, opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, at);
      else {
        tl.fromTo(card, { yPercent: 105 }, { yPercent: 0, duration: step * 0.7, ease: o }, at)
          .fromTo(card.firstElementChild, { scale: 1 }, { scale: 1.1, duration: step * 0.9, ease: o }, at)
          .to(cards[i - 1], { scale: 0.94, opacity: 0.6, duration: step * 0.7, ease: o }, at);
      }
    });

    // 끝 위치를 TOTAL로 고정(스크롤 진행 = 화면 높이 단위)
    tl.set({}, {}, TOTAL);
  },
};
