// 히어로: 큰 제목 위의 화면 사각형이 작아지며 돌아 빠지고, 그림 타일들이 가운데를 감싸며 소용돌이친 뒤 두 문장이 차례로 나타난다.
// 참고: breakthroughenergy 히어로·소용돌이(사각형 축소·회전, 시간+스크롤 공전). 코드·문구·이미지는 새로 작성.
import gsap from "gsap";
import "./style.css";

const TAU = Math.PI * 2;
const TOTAL = 6; // 스크롤 길이(화면 높이 단위). 영역 높이 = (TOTAL + 1) * 100vh
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (u, a, b) => clamp((u - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

// 줄 → 단어 묶음(단어마다 바깥 .hs-w: 스크롤로 사라짐, 안쪽 .hs-wi: 처음 등장)
const lines = (arr, cls) => arr.map((ln, l) => `<span class="${cls}" data-l="${l}">${ln.split(" ").map((w, k) =>
  `<span class="hs-w"><span class="hs-wi" data-k="${k}">${w}</span></span>`).join(" ")}</span>`).join("");

export default {
  id: "hero-swirl",
  category: "히어로",
  source: "breakthroughenergy 히어로·소용돌이 참고",
  form: "스크롤형",
  summary: "가린 제목 + 화면 축소·회전 → 그림 타일 소용돌이 → 두 문장 차례로",
  defaults: {
    title: ["깨끗한 에너지로", "내일의 도시를", "움직입니다"],
    hint: "아래로 스크롤",
    swirl1: ["작은 실험이 모여", "큰 전환이 됩니다"],
    swirl2: ["우리는 그 시작을", "함께 키웁니다"],
    tiles: 26,
  },
  render: (c) => {
    const n = c.tiles;
    const tiles = Array.from({ length: n }, (_, i) =>
      `<i class="hs-tile" data-v="${i % 6}" data-a="${(0.62 + rnd(i, 3) * 0.75).toFixed(2)}"></i>`).join("");
    return `
    <div class="hs-area">
      <div class="hs-stage">
        <div class="hs-panel"></div>
        <svg class="hs-mark" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 5"/>
          <path d="M50 8 A42 42 0 0 1 92 50" fill="none" stroke="currentColor" stroke-width="3"/>
        </svg>
        <div class="hs-swirl">${tiles}</div>
        <div class="hs-titles">
          <h2 class="hs-t hs-t1">${lines(c.swirl1, "hs-tl")}</h2>
          <h2 class="hs-t hs-t2">${lines(c.swirl2, "hs-tl")}</h2>
        </div>
        <div class="hs-hero">
          <h1 class="hs-title hs-plain" aria-label="${c.title.join(" ")}">${lines(c.title, "hs-line")}</h1>
          <div class="hs-media">
            <svg viewBox="0 0 160 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <circle class="hs-sun" cx="112" cy="40" r="14"/>
              <path class="hs-hill1" d="M0 64 Q40 48 80 60 T160 56 V90 H0Z"/>
              <path class="hs-hill2" d="M0 74 Q50 62 96 72 T160 70 V90 H0Z"/>
            </svg>
          </div>
          <div class="hs-title hs-masked" aria-hidden="true">${lines(c.title, "hs-line")}</div>
        </div>
        <p class="hs-hint">${c.hint}</p>
      </div>
    </div>`;
  },
  animate(el, m) {
    const stage = el.querySelector(".hs-stage");
    const media = el.querySelector(".hs-media");
    const masked = el.querySelector(".hs-masked");
    const hero = el.querySelector(".hs-hero");
    const panel = el.querySelector(".hs-panel");
    const mark = el.querySelector(".hs-mark");
    const hint = el.querySelector(".hs-hint");
    const allTiles = [...el.querySelectorAll(".hs-tile")];
    const tiles = m.mobile() ? allTiles.filter((_, i) => i % 3 !== 2) : allTiles;
    allTiles.forEach((t) => { if (!tiles.includes(t)) t.style.display = "none"; });
    const inOut = gsap.parseEase(m.ease.inOut);
    const radius = parseFloat(getComputedStyle(el).getPropertyValue("--radius")) || 0;

    // 처음 등장: 제목 줄이 오른쪽에서 들어오고 단어가 차례로 켜짐(가린 쪽·보이는 쪽 함께)
    const heroLines = [...el.querySelectorAll(".hs-hero .hs-line")];
    gsap.from(heroLines, {
      x: 100, duration: m.d(0.9), ease: m.ease.out,
      delay: (i) => 0.15 + Number(heroLines[i].dataset.l) * m.stagger(0.3),
    });
    const heroWi = [...el.querySelectorAll(".hs-hero .hs-wi")];
    gsap.from(heroWi, {
      opacity: 0, duration: m.d(0.25), ease: m.ease.out,
      delay: (i) => 0.2 + Number(heroWi[i].closest(".hs-line").dataset.l) * m.stagger(0.3) + Number(heroWi[i].dataset.k) * m.stagger(0.08),
    });
    // 스크롤로 사라질 단어(가린 쪽·보이는 쪽 같은 순서)
    const plainW = [...el.querySelectorAll(".hs-plain .hs-w")];
    const maskW = [...el.querySelectorAll(".hs-masked .hs-w")];

    // 소용돌이 문장: 줄이 들어오고 단어가 켜진 뒤(전반) → 나감(후반). 진행도는 스크롤로 정한다.
    const titleTl = (box, outMode) => {
      const tl = gsap.timeline({ paused: true });
      const ls = [...box.querySelectorAll(".hs-tl")];
      let t = 0.05;
      ls.forEach((ln) => {
        const ws = ln.querySelectorAll(".hs-wi");
        tl.fromTo(ln, { x: 100 }, { x: 0, duration: 0.6, ease: m.ease.out }, t);
        tl.fromTo(ws, { opacity: 0 }, { opacity: 1, duration: 0.001, stagger: 0.48 / ws.length }, t + 0.01);
        t += 0.6;
      });
      const inDur = tl.duration();
      t = inDur + 0.01;
      ls.forEach((ln) => {
        if (outMode === "slide") {
          tl.to(ln, { x: -50, duration: 0.3, ease: "power2.in" }, t).to(ln, { opacity: 0, duration: 0.001 }, t + 0.3);
          t += 0.2;
        } else {
          tl.to(ln.querySelectorAll(".hs-wi"), { opacity: 0, duration: 0.001, stagger: 0.1 }, t);
          t += 0.1;
        }
      });
      if (outMode !== "slide") tl.to(box, { y: -20, duration: tl.duration() - inDur, ease: "power2.in" }, inDur);
      return { tl, bis: inDur / tl.duration() };
    };
    const t1 = titleTl(el.querySelector(".hs-t1"), "slide");
    const t2 = titleTl(el.querySelector(".hs-t2"), "words");
    const drive = (T, u, inA, inB, outA, outB) =>
      T.tl.progress(u < inB ? lerp(0, T.bis, prog(u, inA, inB)) : lerp(T.bis, 1, prog(u, outA, outB)));

    // 타일마다 고정 값(위치 각도·반지름·크기·깊이·흔들림)
    const data = tiles.map((t, i) => ({
      t, ang: (i / tiles.length) * TAU + rnd(i, 1) * 0.5, r: 0.8 + rnd(i, 2) * 0.55,
      s: 0.7 + rnd(i, 4) * 0.6, a: Number(t.dataset.a), z: rnd(i, 5), w: 0.4 + rnd(i, 6) * 0.8, ph: rnd(i, 7) * TAU,
    }));

    // 스크롤 진행(화면 높이 단위). scrub으로 부드럽게 따라오고, 그리기는 매 프레임 이 값을 읽는다.
    const S = { u: 0 };
    gsap.timeline({ scrollTrigger: { trigger: ".hs-area", start: "top top", end: "bottom bottom", scrub: m.scrub } })
      .to(S, { u: TOTAL, duration: TOTAL, ease: "none" });

    let spin = 0;
    const draw = (time) => {
      const u = S.u;
      const vw = stage.clientWidth, vh = stage.clientHeight;
      const mob = vw < 768;

      // 1) 화면 사각형: 작아지고(rect·z) 돌아가며(rotation) 원 궤도 밖으로 빠짐
      const h = u - 0.2;
      const rectS = lerp(1, 0.3, inOut(prog(h, 0, 1.5)));
      const zS = lerp(1, 0.7, inOut(prog(h, 0, 2)));
      const rot = lerp(0.5, 0.75, inOut(prog(h, 0.2, 2.2))) * TAU;
      const rad = lerp(0, 1.02, inOut(prog(h, 0.3, 2)));
      const sc = rectS * zS, G = zS * rad * vh;
      const cx = vw / 2 + Math.cos(rot) * G * (vw / vh) * (mob ? 0.6 : 1);
      const cy = vh / 2 + Math.sin(rot) * G;
      const w = vw * sc, hh = vh * sc;
      const top = cy - hh / 2, left = cx - w / 2;
      const rr = lerp(0, radius * 2, prog(h, 0, 0.8));
      const clip = `inset(${top}px ${vw - left - w}px ${vh - top - hh}px ${left}px round ${rr}px)`;
      media.style.clipPath = clip;
      masked.style.clipPath = clip;
      hero.style.visibility = u > 3 ? "hidden" : "visible";
      const K = plainW.length;
      plainW.forEach((wd, k) => {
        const o = u > 0.3 + (k / K) * 0.6 ? 0 : 1;
        wd.style.opacity = o; maskW[k].style.opacity = o;
      });
      hint.style.opacity = 1 - prog(u, 0.05, 0.3);

      // 2) 배경 판·표식: 2.4~2.6에 켜지고 5.2~5.6에 꺼짐. 표식은 매 프레임 조금씩 돈다.
      const pOn = prog(u, 2.4, 2.6);
      panel.style.opacity = pOn;
      mark.style.opacity = 0.6 * pOn * (1 - prog(u, 5.2, 5.6));
      spin += 0.25;
      mark.style.transform = `translate(-50%,-50%) rotate(${spin}deg)`;

      // 3) 두 문장
      drive(t1, u, 2.6, 3.6, 3.8, 4.5);
      drive(t2, u, 4.5, 4.9, 4.9, 5.4);

      // 4) 소용돌이: 스크롤이 반지름·크기·회전을, 시간이 느린 공전·흔들림을 정한다
      const sw = u - 0.1;
      const spread = lerp(0.15, 1, inOut(prog(sw, 0, 2.3))) * lerp(1, 1.22, inOut(prog(sw, 2.3, 3.2)));
      const add = Math.pow(prog(sw, 4.4, 5.6), 2) * 0.7;
      const scale = lerp(1.7, 1, inOut(prog(sw, 0, 2.3))) * lerp(1, 1.15, inOut(prog(sw, 2.3, 3.2))) * (1 - prog(sw, 5.1, 5.6));
      const aspect = lerp(1, vw / vh, lerp(0.3, 1, inOut(prog(sw, 0, 3.2)))) * (mob ? 0.75 : 1);
      const turn = (lerp(0, 2, prog(sw, 1, 6)) - 0.2) * 0.5 * TAU;
      const fade = prog(u, 0.25, 0.9);
      const orbit = time * 0.06;
      const base = Math.min(vw, vh * 1.6) * (mob ? 0.2 : 0.11);
      for (const d of data) {
        const zf = 0.65 + d.z * 0.6;
        const a = d.ang + turn + orbit * (0.6 + d.z * 0.8);
        const R = (d.r * spread * 0.38 * zf + add) * vh;
        const wx = Math.sin(time * d.w + d.ph) * 0.012 * vh;
        const wy = Math.cos(time * d.w * 0.8 + d.ph) * 0.012 * vh;
        const x = vw / 2 + Math.cos(a) * R * aspect + wx;
        const y = vh / 2 + Math.sin(a) * R + wy;
        const s = d.s * zf * scale;
        d.t.style.width = `${base}px`;
        d.t.style.height = `${base * d.a}px`;
        d.t.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${s})`;
        d.t.style.opacity = fade;
        d.t.style.zIndex = Math.round(d.z * 10);
      }
    };

    const tick = (time) => {
      if (!el.isConnected) { gsap.ticker.remove(tick); return; }
      const r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) return; // 화면 밖이면 쉼
      draw(time);
    };
    gsap.ticker.add(tick);
    draw(0);
  },
};
