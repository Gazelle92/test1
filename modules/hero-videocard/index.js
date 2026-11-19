// 히어로: 큰 제목이 가운데에서 양옆으로 벌어지고, 가운데 세로 카드 띠가 튀어나온 뒤 자동으로 한 장씩 넘어간다.
// 누르고 끌면 카드 띠를 직접 넘길 수 있고, 마우스 위치에 따라 카드와 제목이 살짝 기울고 움직인다.
// 참고: madewithgsap 히어로(가운데 영상 카드 띠·제목 좌우 벌어짐·드래그 갤러리). 코드·내용·그림은 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const PEEK = 40; // 위·아래 이웃 카드가 화면에 보이는 높이(px)
const GAP = 5; // 드래그할 때 카드 사이 간격(px)

// 카드 속 그림(영상 대신 도형 움직임). 네 가지를 번갈아 쓴다.
const art = (i) => {
  const k = i % 4;
  if (k === 0) return `<i class="hv-orb"></i><i class="hv-orb hv-orb2"></i>`;
  if (k === 1) return `<i class="hv-ring"></i><i class="hv-ring hv-ring2"></i><i class="hv-ring hv-ring3"></i>`;
  if (k === 2) return `<span class="hv-bars">${"<i class='hv-bar'></i>".repeat(7)}</span>`;
  return `<span class="hv-dots">${"<i class='hv-dot'></i>".repeat(24)}</span>`;
};

export default {
  id: "hero-videocard",
  category: "히어로",
  source: "madewithgsap 히어로 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "제목 좌우 벌어짐 → 가운데 카드 띠 자동 넘김 · 끌어서 넘기기 · 마우스 기울기",
  defaults: {
    left: ["바로", "쓰는", "움직임"],
    right: ["정성껏", "만든", "효과"],
    intro: "매주 늘어나는 웹 움직임 모음. 효과마다 설명, 예제 코드, 바로 붙여 넣는 부품이 함께 들어 있습니다.",
    cta: "모음 둘러보기",
    drag: "끌어서 둘러보기",
    cards: ["마우스 · 스크롤", "스크롤", "끌기 · 무한", "마우스", "클릭 · 스크롤", "스크롤 · 고정", "마우스 · 클릭"],
  },
  render: (c) => `
    <div class="hv">
      <h1 class="hv-sr">${[...c.left, ...c.right].join(" ")}</h1>
      <div class="hv-words" aria-hidden="true">
        <div class="hv-l">${c.left.map((w) => `<span>${w}</span>`).join("")}</div>
        <div class="hv-r">${c.right.map((w) => `<span>${w}</span>`).join("")}</div>
      </div>
      <div class="hv-datas" aria-hidden="true">
        <span class="hv-dnum"></span>
        <span class="hv-dright"><span class="hv-dtag"></span><span>/ ${String(c.cards.length).padStart(2, "0")}</span></span>
      </div>
      <div class="hv-track">${c.cards.map((t, i) => `
        <figure class="hv-card" style="--i:${i}" data-no="${String(i + 1).padStart(2, "0")}" data-tag="${t}">
          <span class="hv-bg"></span>${art(i)}
        </figure>`).join("")}
      </div>
      <div class="hv-num"></div>
      <div class="hv-join">
        <p>${c.intro}</p>
        <a class="hv-cta" href="#"><span class="hv-roll"><span>${c.cta} →</span><span>${c.cta} →</span></span></a>
      </div>
      <p class="hv-drag"><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>${c.drag}</span></p>
    </div>`,
  animate(el, m) {
    const hv = el.querySelector(".hv");
    const cards = [...el.querySelectorAll(".hv-card")];
    const n = cards.length;

    // 카드 속 도형: 화면에 보일 때만 움직인다(원본의 영상 재생·정지와 같은 역할)
    const loops = [
      gsap.to(".hv-orb", { xPercent: 70, yPercent: -40, scale: 1.25, duration: m.d(2.4), ease: m.ease.inOut, repeat: -1, yoyo: true, stagger: m.stagger(0.6) }),
      gsap.to(".hv-ring", { rotation: 360, duration: m.d(9), ease: "none", repeat: -1 }),
      gsap.to(".hv-bar", { scaleY: 0.2, duration: m.d(0.7), ease: m.ease.inOut, stagger: { each: m.stagger(0.1), repeat: -1, yoyo: true } }),
      gsap.to(".hv-dot", { scale: 0.25, duration: m.d(0.8), ease: m.ease.inOut, stagger: { each: m.stagger(0.06), grid: [4, 6], from: "center", repeat: -1, yoyo: true } }),
    ];
    loops.forEach((t) => t.pause());
    const playLoops = (on) => loops.forEach((t) => (on ? t.play() : t.pause()));

    // 모바일: 원본처럼 가로로 넘기는 카드 줄 + 가벼운 등장만
    if (m.mobile()) {
      gsap.from(".hv-words span", { yPercent: 60, autoAlpha: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.07) });
      gsap.from(".hv-card", { y: 40, autoAlpha: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.06), delay: m.d(0.3) });
      const tr = el.querySelector(".hv-track");
      requestAnimationFrame(() => (tr.scrollLeft = (tr.scrollWidth - tr.clientWidth) / 2));
      ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onToggle: (s) => playLoops(s.isActive) });
      return;
    }

    const track = el.querySelector(".hv-track");
    const numCur = el.querySelector(".hv-num");
    const dNum = el.querySelector(".hv-dnum");
    const dTag = el.querySelector(".hv-dtag");
    const wrap = gsap.utils.wrap(0, n);
    // i번 카드가 a번(가운데) 기준으로 몇 칸 떨어졌는지(-n/2 ~ n/2, 끝과 끝은 이어짐)
    const off = (i, a) => { let d = wrap(i - a); if (d > n / 2) d -= n; return d; };
    // 가운데 카드는 1.4배, 바로 위·아래 카드는 가장자리에 PEEK만큼 보이고, 나머지는 화면 밖
    const pose = (d) => {
      if (d === 0) return { y: 0, scale: 1.4 };
      const H = hv.clientHeight, ch = cards[0].offsetHeight, s = Math.sign(d);
      const y = s * (H / 2 + ch / 2 - PEEK) + (Math.abs(d) > 1 ? s * H / 2 : 0);
      return { y, scale: 1 };
    };
    const pitch = () => cards[0].offsetHeight + GAP;

    let active = Math.floor(n / 2);
    const label = (i) => {
      numCur.textContent = `#${cards[i].dataset.no}`;
      dNum.textContent = `#${cards[i].dataset.no}`;
      dTag.textContent = cards[i].dataset.tag;
    };
    const place = (a, dur) => {
      const prev = active;
      active = a;
      cards.forEach((c, i) => {
        const p = pose(off(i, a));
        const jump = Math.abs(off(i, a) - off(i, prev)) > n / 2; // 반대편 끝으로 넘어가는 카드는 화면 밖에서 순간 이동
        if (!dur || jump) gsap.set(c, p);
        else gsap.to(c, { ...p, duration: dur, ease: m.ease.inOut, overwrite: true });
      });
      if (dur) {
        gsap.to(numCur, { autoAlpha: 0, duration: m.d(0.3), ease: m.ease.inOut, overwrite: true });
        gsap.to(numCur, { autoAlpha: 1, duration: m.d(0.3), ease: m.ease.inOut, delay: dur, onStart: () => label(active) });
      } else label(a);
    };

    // 자동 넘김: 2.5초 쉬고 0.8초 동안 다음 카드로
    let timer = null, ready = false, dragging = false, inView = true;
    const stop = () => { if (timer) timer.kill(); timer = null; };
    const queue = () => {
      stop();
      if (!ready || !inView) return;
      timer = gsap.delayedCall(m.d(2.5), () => {
        timer = null;
        if (dragging) return;
        place(wrap(active + 1), m.d(0.8));
        timer = gsap.delayedCall(m.d(0.8), queue);
      });
    };
    ScrollTrigger.create({
      trigger: el, start: "top bottom", end: "bottom top",
      onToggle: (s) => { inView = s.isActive; playLoops(inView); inView ? queue() : stop(); },
    });

    // 등장: 가운데에 모여 있던 제목 단어가 양옆으로 벌어지고 → 카드 세 장이 튀어나옴 → 나머지 글이 나타남
    place(active, 0);
    gsap.set(cards, { autoAlpha: 1 });
    const trio = [cards[wrap(active - 1)], cards[active], cards[wrap(active + 1)]];
    gsap.set(trio, { autoAlpha: 0 });
    const L = el.querySelector(".hv-l"), R = el.querySelector(".hv-r");
    const C = R.getBoundingClientRect().left - L.getBoundingClientRect().right;
    gsap.fromTo(L.children, { x: C / 2 }, { x: 0, duration: m.d(1), ease: m.ease.inOut, stagger: m.stagger(0.07), delay: m.d(0.5) });
    gsap.fromTo(R.children, { x: -C / 2 }, { x: 0, duration: m.d(1), ease: m.ease.inOut, stagger: { each: m.stagger(0.07), from: "end" }, delay: m.d(0.5) });
    const popAt = m.d(1.2);
    gsap.fromTo(cards[active], { autoAlpha: 1, scale: 1.25 }, { scale: 1.4, duration: m.d(0.4), ease: m.ease.out, delay: popAt, immediateRender: false });
    gsap.fromTo([trio[0], trio[2]], { autoAlpha: 1, scale: 0.85 }, { scale: 1, duration: m.d(0.4), ease: m.ease.out, delay: popAt, immediateRender: false });
    gsap.to(".hv-num, .hv-join, .hv-drag", { autoAlpha: 1, duration: m.d(0.8), ease: m.ease.inOut, delay: popAt + m.d(0.4) });
    gsap.delayedCall(popAt, () => { ready = true; hv.classList.add("is-ready"); queue(); });

    // 끌어서 넘기기: 누르면 카드가 한 줄로 정렬되고 배경이 바뀜 → 끌어서 이동 → 놓으면 가장 가까운 카드로 맞춤
    const ui = gsap.timeline({ paused: true, defaults: { ease: m.ease.inOut, duration: m.d(0.3) } })
      .to(".hv-words", { autoAlpha: 0 }, 0)
      .to(".hv-datas", { autoAlpha: 1 }, m.d(0.1));
    const nearest = () => wrap(active + Math.round(-gsap.getProperty(track, "y") / pitch()));
    let shown = -1;
    const ty = gsap.quickTo(track, "y", {
      duration: m.d(0.4), ease: m.ease.out,
      onUpdate: () => { if (!dragging) return; const k = nearest(); if (k !== shown) { shown = k; label(k); } },
    });
    const maxY = () => Math.floor((n - 1) / 2) * pitch();
    let startY = 0;
    const touchOnly = matchMedia("(hover: none)").matches;
    hv.addEventListener("pointerdown", (e) => {
      if (touchOnly || !ready || e.button !== 0 || e.target.closest("a")) return;
      e.preventDefault();
      dragging = true; stop(); shown = -1;
      hv.setPointerCapture(e.pointerId);
      startY = e.clientY;
      gsap.killTweensOf(cards);
      const p = pitch();
      cards.forEach((c, i) => gsap.to(c, { y: off(i, active) * p, scale: 1, duration: m.d(0.4), ease: m.ease.inOut }));
      gsap.to(numCur, { autoAlpha: 0, duration: m.d(0.3), ease: m.ease.inOut, overwrite: true });
      hv.classList.add("is-drag");
      ui.play();
    });
    hv.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      ty(gsap.utils.clamp(-maxY(), maxY(), e.clientY - startY));
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      const k = nearest();
      const y = gsap.getProperty(track, "y");
      gsap.killTweensOf(track);
      gsap.killTweensOf(cards);
      cards.forEach((c) => gsap.set(c, { y: gsap.getProperty(c, "y") + y })); // 보이는 위치는 그대로 두고 띠 이동만 카드로 옮김
      gsap.set(track, { y: 0 });
      ty(0, 0); // quickTo가 기억하는 값도 0으로 맞춤
      place(k, m.d(0.4));
      hv.classList.remove("is-drag");
      ui.reverse();
      queue();
    };
    hv.addEventListener("pointerup", release);
    hv.addEventListener("pointercancel", release);

    // 마우스 위치에 따라 카드 띠가 살짝 기울고, 제목은 반대로 조금 움직임
    const rx = gsap.quickTo(track, "rotationX", { duration: m.d(0.8), ease: m.ease.out });
    const ry = gsap.quickTo(track, "rotationY", { duration: m.d(0.8), ease: m.ease.out });
    const words = el.querySelector(".hv-words");
    const wx = gsap.quickTo(words, "x", { duration: m.d(1), ease: m.ease.out });
    const wy = gsap.quickTo(words, "y", { duration: m.d(1), ease: m.ease.out });
    hv.addEventListener("mousemove", (e) => {
      if (dragging) return;
      const r = hv.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      rx(ny * -8); ry(nx * 10); wx(nx * -30); wy(ny * -14);
    });
    hv.addEventListener("mouseleave", () => { rx(0); ry(0); wx(0); wy(0); });
  },
};
