// 숫자·카드: 소개 문장 둘레로 사각형 다섯 개가 모였다가, 화면 크기 카드로 펼쳐져 세로로 쌓이고
// 스크롤에 따라 한 분야씩 넘어간다. 큰 제목은 카드 위쪽 가장자리에 걸쳐 안팎 색이 갈리고,
// 아래 버튼 글자가 분야마다 굴러 바뀐 뒤 마무리 문장이 올라온다.
// 참고: breakthroughenergy 홈 다섯 분야(KeyAreas) 장면의 순서·타이밍. 코드·문구·그림은 새로 작성.
import gsap from "gsap";
import "./style.css";

// 진행 단위 = 화면 높이(vh). 원본 타임라인 단위를 그대로 옮기기 위한 변환.
const TOTAL = 8.8; // 고정 구간 길이(화면 높이 배수)
const UNIT = 0.805; // 원본: 분야 타임라인 1단위 ≈ 0.805 화면 높이
const T = (t) => t * UNIT - 1; // 분야 타임라인 시간 → 진행값
const R = (r) => r - 0.5; // 원본 장면 시작 기준 시각 → 진행값
const CI = [3, 4, 2, 1, 0]; // 모일 때 순서(원본 clusterIndex)

// 모인 상태 배치: x·y는 화면 중심 기준(x·w·h는 너비 비율, y는 높이 비율)
const CLUSTER = {
  desktop: [
    { x: -0.36, y: -0.3, w: 0.14, h: 0.09 },
    { x: 0.33, y: -0.27, w: 0.11, h: 0.14 },
    { x: -0.31, y: 0.27, w: 0.1, h: 0.12 },
    { x: 0.36, y: 0.24, w: 0.15, h: 0.1 },
    { x: 0.03, y: 0.37, w: 0.09, h: 0.06 },
  ],
  mobile: [
    { x: -0.26, y: -0.35, w: 0.34, h: 0.22 },
    { x: 0.27, y: -0.32, w: 0.28, h: 0.34 },
    { x: -0.25, y: 0.32, w: 0.3, h: 0.28 },
    { x: 0.26, y: 0.36, w: 0.36, h: 0.22 },
    { x: 0.02, y: 0.43, w: 0.2, h: 0.13 },
  ],
};

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const map = (v, a, b) => clamp((v - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const sinE = (t) => Math.sin((t * Math.PI) / 2);
const cosE = (t) => 1 - Math.cos((t * Math.PI) / 2);
const wave = (t) => 0.5 * (1 - Math.cos(Math.PI * t));

// 카드 속 그림(사진·영상 대신 쓰는 단순한 무늬)
function motif(i) {
  const s = [];
  if (i === 0) for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) s.push(`<rect x="${c * 54 + 6}" y="${r * 54 + 6}" width="${30 + ((r + c) % 3) * 6}" height="${30 + ((r * c) % 3) * 6}" rx="4"/>`);
  if (i === 1) for (let k = 0; k < 7; k++) {
    let d = "";
    for (let x = -20; x <= 420; x += 10) d += `${x === -20 ? "M" : "L"}${x} ${(30 + k * 42 + Math.sin(x / 34 + k) * 14).toFixed(1)}`;
    s.push(`<path d="${d}"/>`);
  }
  if (i === 2) for (let k = 0; k < 13; k++) { const y = k * 26 - 10; s.push(`<path d="M-20 ${y} C 110 ${y - 46}, 290 ${y + 46}, 420 ${y}"/>`); }
  if (i === 3) {
    for (let k = 0; k < 16; k++) s.push(`<line x1="${k * 34}" y1="-10" x2="${k * 34 - 220}" y2="310"/>`);
    for (let k = 0; k < 6; k++) s.push(`<circle cx="${60 + k * 60}" cy="${150 + Math.sin(k) * 70}" r="${6 + (k % 3) * 4}"/>`);
  }
  if (i === 4) for (let k = 0; k < 12; k++) { const h = 70 + ((k * 37) % 150); s.push(`<rect x="${k * 34 + 4}" y="${300 - h}" width="24" height="${h}" rx="2"/>`); }
  return `<svg class="ka-motif" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>${s.join("")}</g></svg>`;
}

const words = (txt) => txt.split(/\s+/).filter(Boolean).map((w) => `<span class="ka-wc"><span class="ka-w">${w}</span></span>`).join(" ");

export default {
  id: "key-areas",
  category: "숫자·카드",
  source: "breakthroughenergy 다섯 분야 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "사각형 모임 → 화면 카드로 쌓임 → 다섯 분야(숫자·이름) 차례로 넘김 → 마무리 문장",
  defaults: {
    intro: [
      "우리는 모든 배출원에서",
      "변화의 속도를 높이고,",
      "다섯 개의 산업 분야를",
      "<em>새로운 기회의 지형</em>으로 바꿉니다.",
    ],
    areas: [
      { count: "29", name: "제조", share: "배출량의 31%", body: "철강·시멘트·화학처럼 높은 열이 필요한 공정을 더 깨끗한 방식으로 다시 설계합니다.", button: "29 제조 기업" },
      { count: "26", name: "전력", share: "배출량의 27%", body: "값싸고 안정적인 무탄소 전기를 위해 발전과 저장, 전력망을 함께 바꿉니다.", button: "26 전력 기업" },
      { count: "20", name: "농업", share: "배출량의 19%", body: "먹거리를 기르는 과정의 배출을 줄이면서 수확량은 지키는 기술을 키웁니다.", button: "20 농업 기업" },
      { count: "17", name: "이동", share: "배출량의 16%", body: "자동차부터 배와 비행기까지, 사람과 물건이 오가는 모든 길을 가볍게 만듭니다.", button: "17 이동 기업" },
      { count: "11", name: "건물", share: "배출량의 7%", body: "냉난방과 자재를 새로 고쳐 우리가 머무는 공간의 에너지 사용을 줄입니다.", button: "11 건물 기업" },
    ],
    outro: ["이것이 바로", "<em>지구 규모의</em> 에너지 혁신입니다"],
    finalButton: "전체 포트폴리오 보기",
    href: "#",
  },
  render: (c) => {
    const labels = [...c.areas.map((a) => a.button), c.finalButton];
    return `
    <div class="ka-area" style="--ka-len:${TOTAL + 1}">
      <div class="ka-stage">
        <div class="ka-outro"><div class="ka-outro-in">${c.outro.map((l) => `<div class="ka-line"><span>${l}</span></div>`).join("")}</div></div>
        <div class="ka-intro"><h2 class="ka-intro-in">${c.intro.map((l) => `<div class="ka-line"><span>${l}</span></div>`).join("")}</h2></div>
        <div class="ka-rects">${c.areas.map((a, i) => `
          <div class="ka-rect" data-i="${i % 5}"><div class="ka-img">${motif(i % 5)}</div><div class="ka-shade"></div>
            <span class="ka-data" hidden><b>${a.count}</b><i>${a.name}</i><s>${a.share}</s><u>${a.body}</u></span></div>`).join("")}
        </div>
        <div class="ka-content">
          <h3 class="ka-title ka-title-out"></h3>
          <div class="ka-mask" aria-hidden="true"><div class="ka-title ka-title-in"></div></div>
          <div class="ka-body"><div class="ka-body-in"><p class="ka-eyebrow"></p><p class="ka-text"></p></div></div>
        </div>
        <div class="ka-dots" aria-hidden="true">${c.areas.map(() => "<i></i>").join("")}</div>
        <a class="ka-btn" href="${c.href}"><span class="ka-btn-bg"></span><span class="ka-btn-labels">${labels.map((l) => `<span class="ka-label">${words(l)}</span>`).join("")}</span></a>
      </div>
    </div>`;
  },
  animate(el, m) {
    const stage = el.querySelector(".ka-stage");
    const rects = [...el.querySelectorAll(".ka-rect")];
    const shades = rects.map((r) => r.querySelector(".ka-shade"));
    const motifs = rects.map((r) => r.querySelector(".ka-motif g"));
    const introLines = [...el.querySelectorAll(".ka-intro .ka-line > span")];
    const outroLines = [...el.querySelectorAll(".ka-outro .ka-line > span")];
    const titleOut = el.querySelector(".ka-title-out");
    const titleIn = el.querySelector(".ka-title-in");
    const mask = el.querySelector(".ka-mask");
    const body = el.querySelector(".ka-body");
    const eyebrow = el.querySelector(".ka-eyebrow");
    const text = el.querySelector(".ka-text");
    const dotsWrap = el.querySelector(".ka-dots");
    const dots = [...dotsWrap.children];
    const btn = el.querySelector(".ka-btn");
    const labels = [...el.querySelectorAll(".ka-label")];
    const n = rects.length;

    // 분야 내용: animate는 내용을 받지 않으므로 render가 카드 안에 숨겨 둔 값을 읽는다
    const data = rects.map((r) => {
      const d = r.querySelector(".ka-data");
      const q = (s) => d.querySelector(s).innerHTML;
      return { count: q("b"), name: q("i"), share: q("s"), body: q("u") };
    });
    const inOut = gsap.parseEase(m.ease.inOut);
    const outE = gsap.parseEase(m.ease.out);

    // 버튼 글자: 분야가 바뀌면 단어가 하나씩 위로 굴러 바뀜(원본 KeyAreasBtn)
    labels.forEach((l, i) => gsap.set(l.querySelectorAll(".ka-w"), { yPercent: i === 0 ? 0 : 110 }));
    let labelIdx = 0;
    const setLabel = (i) => {
      if (i === labelIdx) return;
      const dir = i > labelIdx ? 1 : -1;
      const oldW = labels[labelIdx].querySelectorAll(".ka-w");
      const newW = labels[i].querySelectorAll(".ka-w");
      gsap.killTweensOf([...oldW, ...newW]);
      gsap.to(oldW, { yPercent: -110 * dir, duration: m.d(0.45), ease: m.ease.inOut, stagger: m.stagger(0.05) });
      gsap.fromTo(newW, { yPercent: 110 * dir }, { yPercent: 0, duration: m.d(0.55), ease: m.ease.out, stagger: m.stagger(0.05), delay: m.d(0.08) });
      labelIdx = i;
    };

    // 버튼에 올리면 다른 색 바탕이 아래에서 차오름
    const btnBg = el.querySelector(".ka-btn-bg");
    gsap.set(btnBg, { yPercent: 101 });
    btn.addEventListener("mouseenter", () => gsap.to(btnBg, { yPercent: 0, duration: m.d(0.45), ease: m.ease.inOut, overwrite: true }));
    btn.addEventListener("mouseleave", () => gsap.to(btnBg, { yPercent: -101, duration: m.d(0.45), ease: m.ease.inOut, overwrite: true, onComplete: () => gsap.set(btnBg, { yPercent: 101 }) }));

    let shown = -2;
    const setContent = (i) => {
      if (i === shown) return;
      shown = i;
      const a = data[clamp(i, 0, n - 1)];
      const html = `<span class="ka-num">${a.count ?? ""}</span> ${a.name ?? ""}`;
      titleOut.innerHTML = html;
      titleIn.innerHTML = html;
      eyebrow.innerHTML = a.share ?? "";
      text.innerHTML = a.body ?? "";
    };

    const st = { p: -1 };
    const out = rects.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));

    function render() {
      const p = st.p;
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const mob = m.mobile();
      const t = (p + 1) / UNIT; // 분야 타임라인 시간

      // 1) 소개 문장: 줄마다 아래에서 올라왔다가(원본 R+0.9~1.9) 위로 빠짐(R+2.3~2.65)
      const a = map(p, R(0.9), R(1.9));
      const b = map(p, R(2.3), R(2.65));
      introLines.forEach((ln, i) => {
        const k = outE(map(a, i * 0.18, i * 0.18 + 0.46));
        const o = inOut(map(b, i * 0.1, i * 0.1 + 0.7));
        ln.style.transform = `translate3d(0,${(1 - k) * 105 - o * 105}%,0)`;
        ln.style.opacity = k * (1 - o);
      });

      // 2) 분야 순서: 카드 묶음 위치(areaIndex)와 제목 순서(titleIndex)
      let ai = 0;
      let ti = -1 + wave(map(t, 3.55, 4.55));
      for (let x = 1; x <= n; x++) {
        ai += wave(map(t, 4.5 + x * 1.25, 5.5 + x * 1.25));
        ti += wave(map(t, 4.55 + x * 1.25, 5.55 + x * 1.25));
      }

      // 3) 사각형: 왼쪽에서 밀려 들어와 모였다가(cluster) → 화면 크기 카드로 세로로 쌓임(stack)
      const cl = CLUSTER[mob ? "mobile" : "desktop"];
      const pad = mob ? H * 0.14 : W * 0.046 + 60;
      const padSide = mob ? 12 : pad * 0.92;
      const stackH = H - pad * 2;
      const step = stackH + pad;
      rects.forEach((r, i) => {
        const c = cl[i % cl.length];
        const L = CI[i % CI.length] * 0.05;
        const gather = inOut(map(t, 1 + L, 2 + L));
        const scaleK = lerp(1.7, 1, gather);
        const over = t < 0.8 ? -3 : t < 1.1 + L ? -1 : lerp(-1, 0, outE(map(t, 1.1 + L, 1.7 + L)));
        const cx = W / 2 + c.x * W * gather + over * W * 0.2;
        const cy = H / 2 + c.y * H * gather;
        const cw = c.w * W * scaleK;
        const chh = c.h * W * scaleK;

        const s = inOut(map(t, 3.4 - i * 0.05, 4.8 - i * 0.05));
        const near = sinE(map(Math.abs(i - ai), 1, 0));
        const sw = (W - padSide * 2) * lerp(0.85, 1, near);
        const sh = stackH * lerp(0.85, 1, near);
        const sx = W / 2;
        const sy = stackH / 2 + pad + step * i - Math.max(ai, 0) * step;

        const o = out[i];
        o.x = lerp(cx, sx, sinE(s));
        o.y = lerp(cy, sy, s);
        o.w = lerp(cw, sw, cosE(s));
        o.h = lerp(chh, sh, cosE(s));
        r.style.width = `${o.w}px`;
        r.style.height = `${o.h}px`;
        r.style.transform = `translate3d(${o.x - o.w / 2}px,${o.y - o.h / 2}px,0)`;
        shades[i].style.opacity = map(s, 0.1, 0.6) * 0.5;
      });

      // 4) 분야 내용: 큰 숫자·이름은 카드 윗변에 걸쳐 안(강조색)·밖(글자색)이 갈리고, 바뀔 때 아래로 밀리며 사라짐
      const ee = Math.round(ti);
      const X = ee - ti;
      const live = t >= 4.1 && ee >= 0 && ee < n;
      setContent(clamp(ee, 0, n - 1));
      const ro = out[clamp(ee, 0, n - 1)];
      const top = ro.y - ro.h / 2;
      const left = ro.x - ro.w / 2;
      mask.style.clipPath = `inset(${top}px ${W - left - ro.w}px ${H - top - ro.h}px ${left}px round var(--radius))`;
      const ty = top + W * (mob ? 0.04 : 0.059) + H * 0.2 * map(Math.max(X, 0), 0.01, 0.5);
      const tOp = live ? 1 - sinE(map(Math.abs(X), 0.25, 0.45)) : 0;
      titleOut.style.transform = titleIn.style.transform = `translate3d(0,${ty}px,0)`;
      titleOut.style.opacity = titleIn.style.opacity = tOp;
      const by = H - pad + H * X * 0.8;
      body.style.transform = `translate3d(${padSide}px,${by}px,0)`;
      body.style.opacity = live ? 1 - sinE(map(Math.abs(X), 0.07, 0.2)) : 0;

      // 5) 점 표시: 쌓인 뒤 나타나고(R+3~3.3) 마지막 분야 뒤 사라짐(R+8.2~8.4)
      dotsWrap.style.opacity = wave(p < R(3.4) ? map(p, R(3), R(3.3)) : map(p, R(8.4), R(8.2)));
      const cur = clamp(ee, 0, n - 1);
      dots.forEach((d, i) => d.classList.toggle("on", i === cur));

      // 6) 버튼: 카드가 쌓이면 나타나고, 분야마다 문구가 굴러 바뀜(마지막은 전체 보기)
      btn.style.opacity = map(t, 3.6, 4.1);
      btn.style.pointerEvents = t > 3.8 ? "auto" : "none";
      setLabel(clamp(ee, 0, labels.length - 1));

      // 7) 마무리 문장: 카드가 모두 위로 지나간 뒤 줄마다 올라옴(R+8.5~8.8)
      const f = map(p, R(8.5), R(8.8));
      outroLines.forEach((ln, i) => {
        const k = outE(map(f, i * 0.3, i * 0.3 + 0.7));
        ln.style.transform = `translate3d(0,${(1 - k) * 105}%,0)`;
        ln.style.opacity = k;
      });
    }

    // 스크롤 연동: 섹션이 화면 아래에 닿을 때(-1)부터 고정 구간 끝(TOTAL)까지 진행값을 그대로 옮김
    gsap.to(st, {
      p: TOTAL,
      ease: "none",
      onUpdate: render,
      scrollTrigger: {
        trigger: el.querySelector(".ka-area"),
        start: "top bottom",
        end: "bottom bottom",
        scrub: m.scrub,
        onRefresh: render,
      },
    });
    render();

    // 카드 속 무늬가 천천히 흘러 영상처럼 보이게(원본은 분야별 영상)
    const tick = (time) => {
      if (!el.isConnected) { gsap.ticker.remove(tick); return; }
      if (st.p <= -1 || st.p >= TOTAL) return;
      motifs.forEach((g, i) => {
        g.setAttribute("transform", `translate(${(Math.sin(time * 0.3 + i * 1.7) * 14).toFixed(2)} ${(Math.cos(time * 0.22 + i) * 9).toFixed(2)})`);
      });
    };
    gsap.ticker.add(tick);
  },
};
