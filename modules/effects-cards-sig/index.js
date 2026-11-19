// 숫자·카드 (킥 모션 보존판): 큰 문구가 고정된 채 무작위로 한 글자씩 켜지고,
// 카드 묶음이 위에 겹쳐 들어오는 순간 글자들이 물리엔진(Matter.js)으로 튕겨 흩어진다.
// 원본: madewithgsap.com 홈 .h-texts + .h-cards (assets/landing/app2.js). 아래 SIG 값은 원본 숫자 그대로다.
// 규칙: 킥 모션은 테마의 speed·ease·scrub을 쓰지 않는다. 테마는 색·글꼴 토큰만 따른다.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

// 원본 값 (app2.js)
const SIG = {
  mobileMax: 900, // 원본 matchMedia (max-width: 900px)
  reveal: {
    // gsap.to(chars,{display:"inline-block",stagger:{each:.2,from:"random"},ease:"none",scrub:!0})
    each: 0.2,
    start: "top -10%",
    end: () => `bottom bottom+=${4 * innerHeight}`,
    startMob: "60% bottom",
    endMob: "bottom 80%",
  },
  cards: { step: 6.2, from: 0.94, ease: "elastic.out(0.6, 0.3)", dur: 0.5 },
  scatter: {
    // Matter: gravity 0, frictionAir .08, restitution .4, density .001
    body: { frictionAir: 0.08, restitution: 0.4, density: 0.001 },
    speed: () => 9 + 10 * Math.random(), // 속도 = (9~19) × 1.5 + 흔들림, 위로 (8~13)
    delay: (i) => 0.4 + 0.006 * i,
    out: { scale: 0.8, dur: 0.2, scaleEase: "back.in(2)", fadeEase: "power3.in" },
    back: { each: 0.006, ease: "expo.out", dur: 0.4 },
    start: "top top",
    startMob: "top 80%",
  },
};

// Matter.js: 원본과 같은 버전(0.20.0)을 원본과 같은 공개 주소에서 한 번만 불러온다.
let matterP = null;
const loadMatter = () =>
  window.Matter ? Promise.resolve(window.Matter)
  : (matterP ||= new Promise((ok, no) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/matter-js@0.20.0/build/matter.min.js";
      s.onload = () => ok(window.Matter);
      s.onerror = no;
      document.head.appendChild(s);
    }));

export default {
  id: "effects-cards-sig",
  category: "숫자·카드",
  source: "madewithgsap 효과 섹션 · 원본 모션 보존",
  form: "스크롤형",
  summary: "고정된 큰 문구 무작위 등장 → 카드가 원을 따라 쌓이며 글자가 물리적으로 흩어짐",
  defaults: {
    lines: ["120+ 모듈.", "매주 하나씩 더."],
    cards: [
      "고르기만 하면 됩니다. 처음 써도 바로 조합할 수 있어요.",
      "히어로부터 푸터까지, 섹션 단위로 갈아 끼울 수 있어요.",
      "가볍게 만들었습니다. 효과는 살리고 무게는 덜었어요.",
      "스크롤·마우스·드래그, 자주 쓰는 움직임은 다 있어요.",
    ],
  },
  render: (c) => `
    <div class="ecs-texts"><div class="ecs-pin"><div class="ecs-stage">
      <div class="ecs-title">${c.lines.map((t) => `<p class="ecs-line">${t}</p>`).join("")}</div>
    </div></div></div>
    <div class="ecs-cards"><div class="ecs-pin"><div class="ecs-stage">
      <div class="ecs-circles">${c.cards.map((t, i) => `
        <div class="ecs-circle"><div class="ecs-media ecs-m${i + 1}">
          <i class="ecs-icon" aria-hidden="true"></i>
          <span aria-hidden="true">${i + 1}</span>
          <p>${t}</p>
        </div></div>`).join("")}
      </div>
    </div></div></div>`,

  animate(el) {
    const mob = innerWidth <= SIG.mobileMax;
    el.classList.toggle("ecs-mob", mob);
    const texts = el.querySelector(".ecs-texts");
    const cardsSec = el.querySelector(".ecs-cards");
    const title = el.querySelector(".ecs-title");

    // ① 글자 구간: 화면 고정 + 무작위 한 글자씩 켜기(display none → inline-block, 즉시)
    if (!mob) ScrollTrigger.create({ trigger: texts.querySelector(".ecs-pin"), start: "top top", end: "bottom bottom", pin: texts.querySelector(".ecs-stage") });
    title.querySelectorAll(".ecs-line").forEach((p) => {
      p.style.height = p.clientHeight + "px"; // 글자가 숨어도 줄 높이 유지(원본과 같음)
      const st = SplitText.create(p, { type: "chars", charsClass: "char" });
      st.chars.forEach((ch) => {
        const inner = document.createElement("span");
        inner.className = "char-inner";
        inner.style.display = "inline-block";
        inner.textContent = ch.textContent;
        ch.textContent = "";
        ch.appendChild(inner);
        ch.style.display = "none";
      });
      gsap.to(st.chars, {
        display: "inline-block", ease: "none",
        stagger: { each: SIG.reveal.each, from: "random" },
        scrollTrigger: {
          trigger: texts,
          start: mob ? SIG.reveal.startMob : SIG.reveal.start,
          end: mob ? SIG.reveal.endMob : SIG.reveal.end,
          scrub: true,
        },
      });
    });

    // ② 카드 구간: 글자 구간 위에 겹쳐 고정, 진행도에 따라 한 장씩 원을 따라 돌며 쌓임
    if (!mob) {
      const { step, from, ease, dur } = SIG.cards;
      const circles = cardsSec.querySelector(".ecs-circles");
      const list = [...cardsSec.querySelectorAll(".ecs-circle")];
      let n = -1;
      ScrollTrigger.create({
        trigger: cardsSec.querySelector(".ecs-pin"), start: "top top", end: "bottom bottom",
        pin: cardsSec.querySelector(".ecs-stage"), scrub: true,
        onUpdate: (s) => {
          const t = Math.floor(s.progress * list.length);
          if (t === n || t >= list.length) return;
          if (t > n) {
            list[t].classList.add("on");
            gsap.set(list[t], { rotation: t * step });
            gsap.from(list[t], { scale: from, ease, duration: dur });
          } else list[n].classList.remove("on");
          gsap.to(circles, { rotation: -t * step + (step / 2) * t, ease, duration: dur });
          n = t;
        },
        onLeaveBack: () => { n = -1; list[0].classList.remove("on"); },
      });
    }

    // ③ 흩어짐: 카드 구간에 들어서는 순간 글자마다 물리 몸체를 만들어 바깥·위로 튕겨 보내고 작아지며 사라진다
    const S = SIG.scatter;
    let M = null, world = null, items = [];
    loadMatter().then((m) => { M = m; }).catch(() => console.warn("[effects-cards-sig] Matter.js를 불러오지 못해 흩어짐을 건너뜀"));
    const tick = () => {
      if (!el.isConnected) { gsap.ticker.remove(tick); return; }
      M.Engine.update(world, 1000 / 60);
      items.forEach((e) => {
        e.dom.style.transform = `translate(${e.body.position.x - e.ix}px, ${e.body.position.y - e.iy}px) rotate(${e.body.angle}rad) scale(${e.scale})`;
      });
    };
    const build = () => {
      world = M.Engine.create({ gravity: { x: 0, y: 0 } });
      const r0 = title.getBoundingClientRect(), cx = r0.left + r0.width / 2, cy = r0.top + r0.height / 2;
      title.querySelectorAll(".char-inner").forEach((dom) => {
        const r = dom.getBoundingClientRect();
        if (r.width === 0) return;
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const body = M.Bodies.rectangle(x, y, r.width, r.height, S.body);
        const dx = x - cx, dy = y - cy, len = Math.hypot(dx, dy) || 1;
        items.push({ dom, body, ix: x, iy: y, dirX: dx / len, dirY: dy / len, scale: 1 });
        M.World.add(world.world, body);
      });
    };
    const launch = () => {
      items.forEach((e) => {
        M.Body.setPosition(e.body, { x: e.ix, y: e.iy });
        M.Body.setAngle(e.body, 0);
        const v = S.speed();
        M.Body.setVelocity(e.body, { x: e.dirX * v * 1.5 + 2 * (Math.random() - 0.5), y: e.dirY * v * 1.5 - (5 * Math.random() + 8) });
        M.Body.setAngularVelocity(e.body, 0.5 * (Math.random() - 0.5));
      });
      const order = [...items].sort(() => Math.random() - 0.5), last = order.length - 1;
      order.forEach((e, i) => {
        const delay = S.delay(i);
        gsap.to(e, { scale: S.out.scale, duration: S.out.dur, delay, ease: S.out.scaleEase });
        gsap.to(e.dom, { autoAlpha: 0, duration: S.out.dur, delay, ease: S.out.fadeEase, onComplete: i === last ? () => gsap.ticker.remove(tick) : undefined });
      });
    };
    ScrollTrigger.create({
      trigger: cardsSec, start: mob ? S.startMob : S.start,
      onEnter: () => { if (!M) return; build(); launch(); gsap.ticker.add(tick); },
      onLeaveBack: () => {
        gsap.ticker.remove(tick);
        if (!M || !world) return;
        items.forEach((e) => {
          gsap.killTweensOf(e.dom);
          e.scale = 1;
          gsap.fromTo(e.dom,
            { x: e.body.position.x - e.ix, y: e.body.position.y - e.iy, rotation: e.body.angle, scale: e.scale },
            { autoAlpha: 1, x: 0, xPercent: 0, y: 0, yPercent: 0, scale: 1, rotation: 0, stagger: { each: S.back.each, from: "random" }, ease: S.back.ease, duration: S.back.dur });
        });
        M.World.clear(world.world);
        items = [];
      },
    });

    return () => gsap.ticker.remove(tick); // 테마 전환(다시 붙이기) 때 정리
  },
};
