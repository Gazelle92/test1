// 기능: 가운데 제목 아래로 기능 카드가 가로로 길게 늘어서고, 스크롤해 들어오면 차례로 떠오른다.
// 카드 줄은 끌어서 옆으로 넘길 수 있고(관성 있게 따라옴), 맨 아래에 앱 안내 줄이 붙는다.
// 참고: madewithgsap 기능 섹션(가로 기능 카드 끌기, 보일 때만 영상 재생). 코드·내용·그림은 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

// 카드 속 그림(영상 대신 도형 움직임) — 일곱 가지
const art = (k) => [
  `<i class="fw-win"><b></b><b></b><b></b></i><i class="fw-cursor"></i>`,
  `<span class="fw-lines">${"<i class='fw-line'></i>".repeat(5)}</span>`,
  `<span class="fw-steps">${"<i class='fw-step'></i>".repeat(4)}</span>`,
  `<i class="fw-file"></i><i class="fw-arrow"></i>`,
  `<i class="fw-phone"></i><i class="fw-tap"></i>`,
  `<span class="fw-grid">${"<i class='fw-cell'></i>".repeat(9)}</span>`,
  `<i class="fw-orb"></i><i class="fw-orb fw-orb2"></i><i class="fw-orb fw-orb3"></i>`,
][k % 7];

export default {
  id: "features-workflow",
  category: "기능",
  source: "madewithgsap 기능 섹션 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "제목 + 끌어서 넘기는 기능 카드 줄(차례 등장) + 앱 안내",
  defaults: {
    title: "지금 쓰는 방식에 꼭 맞게",
    look: "짧게 보기",
    items: [
      { t: "복사해서 바로 붙여 넣기", d: "버튼 한 번으로 효과를 복사해 작업 중인 페이지에 그대로 붙여 넣습니다.", look: true },
      { t: "AI 도구용 설명문 포함", d: "설명문이 지금 쓰는 도구와 코드 방식에 맞춰 알아서 바뀝니다.", look: true },
      { t: "한 단계씩 따라 하는 안내", d: "자세한 안내를 따라가며 효과의 원리를 익히고 내 사이트에 맞게 고칩니다." },
      { t: "원본 코드 내려받기", d: "완성된 코드를 그대로 받아 내 프로젝트에서 자유롭게 고쳐 씁니다." },
      { t: "휴대폰·터치 지원", d: "어떤 화면에서도 자연스럽게, 손가락 조작까지 함께 고려했습니다." },
      { t: "내용에 맞춰 스스로 조정", d: "글과 사진이 바뀌어도 효과가 알아서 크기와 간격을 맞춥니다." },
      { t: "무거운 기술 없이 간단하게", d: "별도 3D 기술 없이 가벼운 스크립트만으로 움직입니다." },
    ],
    app: "내 컴퓨터에서 더 빠르게",
    appSub: "브라우저를 열지 않고도 모음 전체를 바로 찾아 쓸 수 있는 데스크톱 앱입니다.",
    appCta: "앱 내려받기",
  },
  render: (c) => `
    <div class="fw-head"><h2 class="fw-title">${c.title}</h2></div>
    <div class="fw-inner">
      <div class="fw-row">${c.items.map((x, i) => `
        <article class="fw-item" style="--i:${i}">
          <div class="fw-media"><span class="fw-bg"></span>${art(i)}</div>
          <div class="fw-bottom">
            <h3>${x.t}</h3><p>${x.d}</p>
            ${x.look ? `<a class="fw-look" href="#"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="7.5" fill="currentColor"/><path d="M6.5 5v6l4.5-3z" fill="var(--c-bg)"/></svg><span>${c.look}</span></a>` : ""}
          </div>
        </article>`).join("")}
      </div>
    </div>
    <div class="fw-app">
      <hr class="fw-sep">
      <div class="fw-app-row">
        <div class="fw-app-left">
          <span class="fw-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17l7-12 7 12z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="14" r="2" fill="currentColor"/></svg></span>
          <div><p class="fw-app-t">${c.app}</p><p class="fw-app-s">${c.appSub}</p></div>
        </div>
        <a class="fw-cta" href="#"><span class="fw-roll"><span>${c.appCta} ↓</span><span>${c.appCta} ↓</span></span></a>
      </div>
    </div>`,
  animate(el, m) {
    // 제목 → 카드가 오른쪽 아래에서 차례로 떠오름 → 앱 안내
    gsap.from(".fw-title", {
      y: 40, autoAlpha: 0, duration: m.d(0.9), ease: m.ease.out,
      scrollTrigger: { trigger: ".fw-head", start: "top 85%", toggleActions: "play none none reverse" },
    });
    gsap.from(".fw-item", {
      x: 120, y: 40, autoAlpha: 0, duration: m.d(1.1), ease: m.ease.out, stagger: m.stagger(0.09),
      scrollTrigger: { trigger: ".fw-inner", start: "top 85%", toggleActions: "play none none reverse" },
    });
    gsap.from(".fw-app-row > *, .fw-sep", {
      y: 30, autoAlpha: 0, duration: m.d(0.8), ease: m.ease.out, stagger: m.stagger(0.1),
      scrollTrigger: { trigger: ".fw-app", start: "top 90%", toggleActions: "play none none reverse" },
    });

    // 카드 속 도형: 섹션이 보일 때만 움직임(원본의 영상 재생·정지)
    const loops = [
      gsap.to(".fw-cursor", { x: "-=60", y: "-=26", duration: m.d(1.4), ease: m.ease.inOut, repeat: -1, yoyo: true }),
      gsap.fromTo(".fw-line", { scaleX: 0 }, { scaleX: 1, duration: m.d(0.6), ease: m.ease.out, stagger: { each: m.stagger(0.18), repeat: -1, repeatDelay: m.d(1) } }),
      gsap.to(".fw-step", { opacity: 1, scale: 1.08, duration: m.d(0.4), ease: m.ease.out, stagger: { each: m.stagger(0.4), repeat: -1, yoyo: true } }),
      gsap.to(".fw-arrow", { y: 18, duration: m.d(0.8), ease: m.ease.inOut, repeat: -1, yoyo: true }),
      gsap.to(".fw-tap", { scale: 1.8, opacity: 0, duration: m.d(1.1), ease: m.ease.out, repeat: -1 }),
      gsap.to(".fw-cell", { scale: 0.5, duration: m.d(0.6), ease: m.ease.inOut, stagger: { each: m.stagger(0.08), grid: [3, 3], from: "random", repeat: -1, yoyo: true } }),
      gsap.to(".fw-orb", { y: -28, duration: m.d(0.9), ease: m.ease.inOut, stagger: { each: m.stagger(0.15), repeat: -1, yoyo: true } }),
    ];
    loops.forEach((t) => t.pause());
    ScrollTrigger.create({
      trigger: el, start: "top bottom", end: "bottom top",
      onToggle: (s) => loops.forEach((t) => (s.isActive ? t.play() : t.pause())),
    });

    // 끌어서 넘기기(데스크톱): 끈 거리의 1.4배만큼, 양 끝을 넘지 않게, 부드럽게 따라옴
    if (m.mobile()) return;
    const row = el.querySelector(".fw-row");
    const qx = gsap.quickTo(row, "x", { duration: m.d(0.5), ease: m.ease.out });
    let x = 0, lastX = 0, down = false, moved = 0;
    row.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      down = true; moved = 0; lastX = e.clientX;
    });
    row.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX; moved += Math.abs(dx);
      if (moved > 6 && !row.classList.contains("is-drag")) { row.setPointerCapture(e.pointerId); row.classList.add("is-drag"); }
      x = gsap.utils.clamp(Math.min(0, el.clientWidth - row.scrollWidth), 0, x + dx * 1.4);
      qx(x);
    });
    const up = () => { down = false; requestAnimationFrame(() => row.classList.remove("is-drag")); };
    row.addEventListener("pointerup", up);
    row.addEventListener("pointercancel", up);
    // 끌다가 놓을 때 링크가 눌리지 않게
    row.addEventListener("click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    row.addEventListener("dragstart", (e) => e.preventDefault());
  },
};
