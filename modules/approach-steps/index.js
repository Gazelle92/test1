// 기능: 세 단계(발견·개발·확산)가 스크롤에 따라 넘어간다. 가운데 그림은 레이더가 점들을 훑고(발견),
// 고른 점이 한 점으로 모여 커지고(개발), 그 점에서 가지가 뻗어 마디가 퍼진다(확산).
// 왼쪽 글은 화면 한 칸씩 위로 넘어가고, 오른쪽 단계 이름은 옆에서 밀려 들어온다.
// 참고: breakthroughenergy 홈 접근 방식(HomeApproach) 장면의 순서·타이밍. 원본 Rive 그림은 SVG·GSAP로 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

const LEN = 4.2; // 고정 구간 길이(화면 높이 배수, 원본 approachStart ~ +4.2)
const CX = 500;
const CY = 350;
const RINGS = [80, 150, 220, 290];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const map = (v, a, b) => clamp((v - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const wave = (t) => 0.5 * (1 - Math.cos(Math.PI * t));

// 매번 같은 배치가 나오도록 고정된 난수
function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function graph() {
  const r = rng(7);
  const dots = [];
  for (let j = 0; j < 48; j++) {
    const a = r() * Math.PI * 2;
    const d = 40 + Math.sqrt(r()) * 250;
    dots.push({ x: CX + Math.cos(a) * d, y: CY + Math.sin(a) * d, a: ((a * 180) / Math.PI + 360) % 360, n: (d - 40) / 250, pick: j % 7 === 3 });
  }
  const branches = [];
  for (let i = 0; i < 8; i++) {
    const a = i * (Math.PI / 4) + 0.35 + r() * 0.3;
    let d = 300 + r() * 120;
    d = Math.min(d, 315 / Math.max(0.01, Math.abs(Math.sin(a))), 360 / Math.max(0.01, Math.abs(Math.cos(a))));
    const x = CX + Math.cos(a) * d;
    const y = CY + Math.sin(a) * d;
    const bend = (r() - 0.5) * 120;
    const qx = (CX + x) / 2 - Math.sin(a) * bend;
    const qy = (CY + y) / 2 + Math.cos(a) * bend;
    const subs = [-0.55, 0.5].map((o) => {
      const sa = a + o + (r() - 0.5) * 0.3;
      const sd = 60 + r() * 50;
      return { x: x + Math.cos(sa) * sd, y: clamp(y + Math.sin(sa) * sd, 20, 680) };
    });
    branches.push({ x, y, d: `M${CX} ${CY} Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`, subs });
  }
  return { dots, branches };
}

export default {
  id: "approach-steps",
  category: "기능",
  source: "breakthroughenergy 접근 방식 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "세 단계 글이 한 칸씩 넘어가고, 가운데 점·선 그림이 단계마다 자람",
  defaults: {
    chapters: [
      { title: "발견", subtitle: "우리가 일하는 방식", body: "분명한 투자 기준으로 아직 비어 있는 자리를 찾고, 가능성 있는 기술을 처음부터 회사로 키웁니다." },
      { title: "개발", body: "검증을 마친 기술에는 속도를 붙여, 오래 버틸 수 있는 단단한 회사로 만듭니다." },
      { title: "확산", body: "깨끗한 기술이 더 싸고 믿을 만해져야 세계로 퍼집니다. 비용을 끝까지 낮추는 데 집중합니다." },
    ],
  },
  render: (c) => {
    const { dots, branches } = graph();
    const ch = c.chapters.slice(0, 3);
    return `
    <div class="as-area" style="--as-len:${LEN + 1}">
      <div class="as-stage">
        <div class="as-graphic">
          <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g class="as-net">
              <g class="as-radar">
                ${RINGS.map((rr) => `<circle class="as-ring" cx="${CX}" cy="${CY}" r="${rr}"/>`).join("")}
                <line class="as-ring" x1="${CX - 300}" y1="${CY}" x2="${CX + 300}" y2="${CY}"/>
                <line class="as-ring" x1="${CX}" y1="${CY - 300}" x2="${CX}" y2="${CY + 300}"/>
                <g class="as-sweep"><path class="as-wedge" d="M${CX} ${CY} L${CX + 290} ${CY} A290 290 0 0 0 ${(CX + 290 * Math.cos(-0.7)).toFixed(1)} ${(CY + 290 * Math.sin(-0.7)).toFixed(1)} Z"/><line class="as-edge" x1="${CX}" y1="${CY}" x2="${CX + 290}" y2="${CY}"/></g>
              </g>
              ${branches.map((b) => `<path class="as-branch" pathLength="1" d="${b.d}"/>${b.subs.map((s) => `<line class="as-sub" pathLength="1" x1="${b.x.toFixed(1)}" y1="${b.y.toFixed(1)}" x2="${s.x.toFixed(1)}" y2="${s.y.toFixed(1)}"/>`).join("")}`).join("")}
              ${dots.filter((d) => d.pick).map(() => `<line class="as-link" pathLength="1" x1="0" y1="0" x2="${CX}" y2="${CY}"/>`).join("")}
              ${dots.map((d) => `<circle class="as-dot${d.pick ? " pick" : ""}" cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="3.5" data-a="${d.a.toFixed(1)}" data-n="${d.n.toFixed(3)}"/>`).join("")}
              ${[0, 1, 2].map(() => `<circle class="as-ripple" cx="${CX}" cy="${CY}" r="54"/>`).join("")}
              <circle class="as-core" cx="${CX}" cy="${CY}" r="0"/>
              ${branches.map(() => `<circle class="as-packet" r="4" cx="${CX}" cy="${CY}"/>`).join("")}
              ${branches.map((b) => `<circle class="as-node" cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="11"/>${b.subs.map((s) => `<circle class="as-subnode" cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="5"/>`).join("")}`).join("")}
            </g>
          </svg>
        </div>
        <div class="as-side" aria-hidden="true">${ch.map((x, i) => `<div class="as-side-title"><span class="as-no">${String(i + 1).padStart(2, "0")}</span>${x.title}</div>`).join("")}</div>
        <div class="as-dots" aria-hidden="true">${ch.map(() => "<i></i>").join("")}</div>
        <div class="as-chapters">${ch.map((x) => `
          <div class="as-chapter"><div class="as-chapter-in">
            <h3 class="as-ch-title">${x.title}</h3>
            ${x.subtitle ? `<p class="as-subtitle">${x.subtitle}</p>` : ""}
            <p class="as-body">${x.body}</p>
          </div></div>`).join("")}
        </div>
      </div>
    </div>`;
  },
  animate(el, m) {
    const stage = el.querySelector(".as-stage");
    const area = el.querySelector(".as-area");
    const q = (s) => [...el.querySelectorAll(s)];
    const rings = q(".as-ring");
    const radar = el.querySelector(".as-radar");
    const sweep = el.querySelector(".as-sweep");
    const dots = q(".as-dot");
    const picks = dots.filter((d) => d.classList.contains("pick"));
    const others = dots.filter((d) => !d.classList.contains("pick"));
    const links = q(".as-link");
    const branches = q(".as-branch");
    const subs = q(".as-sub");
    const nodes = q(".as-node");
    const subnodes = q(".as-subnode");
    const ripples = q(".as-ripple");
    const packets = q(".as-packet");
    const core = el.querySelector(".as-core");
    const net = el.querySelector(".as-net");
    const chapters = q(".as-chapter");
    const bodies = chapters.map((c) => c.querySelector(".as-body"));
    const sides = q(".as-side-title");
    const dotEls = q(".as-dots i");
    const nCh = chapters.length;
    const E = gsap.parseEase(m.ease.inOut);
    const O = gsap.parseEase(m.ease.out);

    const base = dots.map((d) => ({ x: +d.getAttribute("cx"), y: +d.getAttribute("cy"), a: +d.dataset.a, n: +d.dataset.n }));
    const pickBase = picks.map((d) => base[dots.indexOf(d)]);
    const lens = branches.map((b) => b.getTotalLength());

    // 진행값: k = 그림 진행(-1→3, 일정한 속도), ie = 글 진행(구간마다 부드럽게 멈췄다 넘어감)
    const st = { u: 0 };
    let visible = false;

    // 단계 이름: 바뀔 때 옛 이름은 바로 사라지고 새 이름이 왼쪽에서 밀려 들어옴(원본 sideTitle)
    let cur = -9;
    gsap.set(sides, { opacity: 0 });
    const setChapter = (i) => {
      if (i === cur) return;
      const prev = cur;
      cur = i;
      if (prev >= 0 && prev < nCh) {
        gsap.killTweensOf(sides[prev]);
        gsap.to(sides[prev], { opacity: 0, x: 0, duration: m.d(0.1) });
      }
      if (i >= 0 && i < nCh) {
        gsap.killTweensOf(sides[i]);
        gsap.fromTo(sides[i], { opacity: 0, x: "-2vw" }, { opacity: 1, x: 0, duration: m.d(0.6), delay: m.d(0.1), ease: m.ease.out });
      }
      dotEls.forEach((d, j) => d.classList.toggle("on", j === clamp(i, 0, nCh - 1)));
    };

    function draw(time) {
      const u = st.u;
      const k = -1 + 4 * u;
      let ie = -1;
      for (let w = 0; w < 4; w++) ie += wave(map(u, 0.25 * w, 0.25 * w + 0.225));

      // 글: 단계마다 화면 한 칸씩 위로(마지막 단계에서 멈춤), 본문은 다가올 때 밝아짐
      const H = stage.clientHeight;
      chapters.forEach((c, i) => {
        c.style.transform = `translate3d(0,${(i - Math.min(ie, nCh - 1)) * H}px,0)`;
        bodies[i].style.opacity = map(ie, i - 0.4, i - 0.25);
      });
      setChapter(Math.round(ie));

      // 그림 ① 발견: 레이더 고리가 커지며 나타나고 점들이 안쪽부터 켜짐, 빛줄기가 돌며 점을 깨움
      const aIn = E(map(k, -1, -0.2));
      const B = E(map(k, 0.45, 1.0)); // ② 개발: 고른 점이 강조되고 가운데로 선이 이어지며 큰 점이 자람
      const C = E(map(k, 1.45, 2.0)); // ③ 확산: 점이 큰 점에 합쳐지고 가지가 바깥으로 뻗음
      const D = E(map(k, 1.9, 2.6));
      radar.style.opacity = aIn * (1 - 0.6 * B) * (1 - 0.6 * C);
      radar.setAttribute("transform", `translate(${CX} ${CY}) scale(${lerp(0.55, 1, aIn) * lerp(1, 1.25, C)}) translate(${-CX} ${-CY})`);
      const sweepOn = map(k, -0.6, -0.2) * (1 - map(k, 0.6, 1.0));
      const ang = (time * 70) % 360;
      sweep.style.opacity = sweepOn;
      sweep.setAttribute("transform", `rotate(${ang} ${CX} ${CY})`);

      dots.forEach((d, j) => {
        const b = base[j];
        const on = O(map(k, -0.9 + b.n * 0.6, -0.6 + b.n * 0.6));
        let diff = (b.a - ang + 720) % 360; // 빛줄기가 지나간 직후 밝게
        diff = 360 - diff;
        const glow = sweepOn * (diff < 70 ? 1 - diff / 70 : 0);
        if (d.classList.contains("pick")) return;
        d.setAttribute("r", (3.5 * on * (1 + glow * 0.9)).toFixed(2));
        d.style.opacity = (0.55 + glow * 0.45) * lerp(1, 0.3, B) * (1 - C);
      });

      picks.forEach((d, i) => {
        const b = pickBase[i];
        const on = O(map(k, -0.9 + b.n * 0.6, -0.6 + b.n * 0.6));
        const drift = Math.sin(time * 0.8 + i) * 6 * B * (1 - C);
        const x = lerp(lerp(b.x, CX, 0.3 * B), CX, C) + drift;
        const y = lerp(lerp(b.y, CY, 0.3 * B), CY, C) - drift;
        d.setAttribute("cx", x.toFixed(1));
        d.setAttribute("cy", y.toFixed(1));
        d.setAttribute("r", (on * lerp(3.5, 7, B) * (1 - C)).toFixed(2));
        d.style.opacity = 0.55 + 0.45 * B;
        const l = links[i];
        l.setAttribute("x1", x.toFixed(1));
        l.setAttribute("y1", y.toFixed(1));
        l.style.strokeDashoffset = 1 - E(map(k, 0.5 + i * 0.03, 0.95 + i * 0.03));
        l.style.opacity = 1 - C;
      });

      // 큰 점: ②에서 자라고, ②~③ 동안 물결이 퍼짐
      const coreR = 54 * E(map(k, 0.6, 1.1)) * lerp(1, 0.75, D);
      core.setAttribute("r", coreR.toFixed(2));
      const rip = map(k, 0.8, 1.1) * (1 - 0.6 * map(k, 2.2, 2.8));
      ripples.forEach((c, i) => {
        const ph = (time * 0.45 + i / ripples.length) % 1;
        c.setAttribute("r", (coreR + ph * 170).toFixed(1));
        c.style.opacity = (1 - ph) * 0.5 * rip;
      });

      // 가지·마디: ③에서 차례로 뻗고, 마디가 튀어나오며, 가지를 따라 작은 점이 흐름
      branches.forEach((b, i) => {
        const g = E(map(k, 1.5 + i * 0.04, 1.95 + i * 0.04));
        b.style.strokeDashoffset = 1 - g;
        const nd = O(map(k, 1.85 + i * 0.04, 2.1 + i * 0.04));
        nodes[i].style.transform = `scale(${nd})`;
        for (let s = 0; s < 2; s++) {
          const si = i * 2 + s;
          if (!subs[si]) continue;
          subs[si].style.strokeDashoffset = 1 - E(map(D, 0.2 + s * 0.15 + i * 0.03, 0.65 + s * 0.15 + i * 0.03));
          subnodes[si].style.transform = `scale(${O(map(D, 0.55 + s * 0.15 + i * 0.03, 0.85 + s * 0.15 + i * 0.03))})`;
        }
        const pk = packets[i];
        const ph = (time * 0.35 + i * 0.137) % 1;
        const pt = b.getPointAtLength(ph * lens[i]);
        pk.setAttribute("cx", pt.x.toFixed(1));
        pk.setAttribute("cy", pt.y.toFixed(1));
        pk.style.opacity = map(k, 2.0, 2.3) * Math.sin(ph * Math.PI);
      });
      net.setAttribute("transform", `translate(${CX} ${CY}) scale(${lerp(1, 1.06, map(k, 2, 3))}) translate(${-CX} ${-CY})`);
    }

    // 스크롤: 고정 구간 동안 진행값 u(0→1)를 그대로 옮김
    gsap.to(st, {
      u: 1,
      ease: "none",
      scrollTrigger: { trigger: area, start: "top top", end: "bottom bottom", scrub: m.scrub },
    });
    // 들어올 때 그림이 아래에서 반 화면쯤 늦게 따라 올라옴(원본 rive 컨테이너)
    gsap.fromTo(".as-graphic", { yPercent: 35 }, {
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: area, start: "top bottom", end: "top top", scrub: m.scrub },
    });
    ScrollTrigger.create({
      trigger: area,
      start: "top bottom",
      end: "bottom top",
      onToggle: (s) => (visible = s.isActive),
      onRefresh: (s) => { visible = s.isActive; draw(gsap.ticker.time); },
    });

    // 매 프레임: 레이더 회전·물결·흐르는 점처럼 시간에 따라 계속 움직이는 부분
    const tick = (time) => {
      if (!el.isConnected) { gsap.ticker.remove(tick); return; }
      if (visible) draw(time);
    };
    gsap.ticker.add(tick);
    draw(0);
  },
};
