// 문의·CTA: 고정 무대 위에서 도시 목록이 스크롤에 맞춰 한 칸씩 넘어가며 가운데 도시가 밝아지고,
// 큰 글씨가 아래에서 올라오며 지구본이 커다란 크기에서 제자리로 줄어든다(지구본은 계속 회전).
// 이어서 숫자 카드가 무대 위로 지나가고, 마지막에 연락처 묶음이 나타난다.
// 참고: jeskojets 글로벌 섹션(3화면 길이 고정 무대 · 도시 목록 넘김 · 제목/지구본 올라옴 · 5K+ 카드 · 연락처). 코드·그림·문구는 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

// 항상 같은 결과를 내는 간단한 난수(새로고침해도 점 위치가 같게)
const rand = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const barcode = () => {
  const r = rand(7);
  let y = 0, out = "";
  while (y < 156) {
    const h = 1 + Math.floor(r() * 4);
    out += `<rect x="0" y="${y}" width="30" height="${h}"/>`;
    y += h + 1 + Math.floor(r() * 3);
  }
  return `<svg class="gc-bar" viewBox="0 0 30 160" preserveAspectRatio="none" aria-hidden="true">${out}</svg>`;
};

export default {
  id: "global-cities",
  category: "문의·CTA",
  source: "jeskojets 글로벌 섹션 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "도시 목록 넘김 → 큰 글씨·회전 지구본 → 5K+ 카드 → 연락처",
  defaults: {
    cityTitle: "이런 곳으로",
    cities: ["리스본", "케이프타운", "교토", "마라케시", "제네바", "부에노스아이레스", "도쿄", "밴쿠버", "두바이", "헬싱키", "방콕", "서울", "런던", "니스", "시드니", "취리히", "베를린", "멜버른", "홍콩", "뉴욕", "밀라노", "싱가포르", "이스탄불", "오슬로"],
    word: "어디로든",
    statNum: "5",
    statSuffix: "K+",
    statUnit: "회 운항",
    statLabel: "지금까지 연결한 여정",
    statText: "갑작스러운 출장부터 대륙을 건너는 긴 여행까지, 쌓인 경험이 다음 이동을 더 정확하게 만듭니다.",
    cta: "원하는 곳까지, 편안하고 확실하게",
    ask: "예약·문의",
    contacts: [
      { label: "hello@example.com", href: "mailto:hello@example.com" },
      { label: "02-000-0000", href: "tel:020000000" },
    ],
    copy: "© 2026 노바 에어",
  },
  render: (c) => `
    <div class="gc-area">
      <div class="gc-stick">
        <div class="gc-cities"><div class="gc-cities-in">
          <h2 class="gc-ctitle">${c.cityTitle}</h2>
          <div class="gc-diagram" aria-hidden="true">
            <i class="gc-ln gc-ln-r"></i>
            <svg class="gc-icon" viewBox="0 0 24 24"><path d="M21 12 L14 10 L9 3 H7 L9.5 10 L4.5 10.6 L3 8.5 H1.8 L2.6 12 L1.8 15.5 H3 L4.5 13.4 L9.5 14 L7 21 H9 L14 14 Z"/></svg>
            <i class="gc-ln gc-ln-l"></i>
          </div>
          <div class="gc-mask"><ul class="gc-list">${c.cities.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        </div></div>
        <div class="gc-word"><span>${c.word}</span></div>
        <div class="gc-globe-w">
          <svg class="gc-globe" viewBox="-100 -100 200 200" aria-hidden="true">
            <circle class="gc-sphere" r="96"/>
            <path class="gc-grid"/>
            <path class="gc-dots"/>
            <path class="gc-arcs"/>
            <circle class="gc-rim" r="96"/>
          </svg>
        </div>
      </div>
      <div class="gc-fact">
        <div class="gc-card">
          <div class="gc-num"><h3><span class="gc-n">${c.statNum}</span>${c.statSuffix} <small>${c.statUnit}</small></h3>${barcode()}</div>
          <h4>${c.statLabel}</h4>
          <p>${c.statText}</p>
        </div>
      </div>
      <div class="gc-cta">
        <div class="gc-cta-l">
          <h3 class="gc-cta-t">${c.cta}</h3>
          <div class="gc-copy">${c.copy}</div>
        </div>
        <div class="gc-cta-r">
          <span class="gc-ask">${c.ask}</span>
          ${c.contacts.map((x) => `<a class="gc-link" href="${x.href}">${x.label}</a>`).join("")}
        </div>
      </div>
    </div>`,
  animate(el, m) {
    const mobile = m.mobile();

    // ── 지구본: 위·경선 + 점 + 항로 호를 매 프레임 정사영으로 다시 그림
    const R = 96, TILT = 0.38;
    const proj = (lat, lon, alt = 1) => {
      const cl = Math.cos(lat);
      const x = cl * Math.sin(lon), y0 = Math.sin(lat), z0 = cl * Math.cos(lon);
      const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
      const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
      return [x * R * alt, -y * R * alt, z];
    };
    const line = (pts) => {
      let d = "", on = false;
      pts.forEach(([x, y, z]) => {
        if (z > 0) { d += (on ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); on = true; } else on = false;
      });
      return d;
    };
    const r = rand(42);
    const dots = Array.from({ length: 180 }, () => [Math.asin(r() * 2 - 1) * 0.92, r() * Math.PI * 2]);
    const arcs = Array.from({ length: 6 }, () => [dots[Math.floor(r() * dots.length)], dots[Math.floor(r() * dots.length)]]);
    const toV = ([la, lo]) => [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
    const toLL = ([x, y, z]) => { const n = Math.hypot(x, y, z); return [Math.asin(z / n), Math.atan2(y, x)]; };
    const arcPts = arcs.map(([a, b]) => {
      const va = toV(a), vb = toV(b);
      return Array.from({ length: 41 }, (_, i) => {
        const t = i / 40; // 두 점 사이를 직선 보간 후 구면에 투영 + 가운데를 살짝 띄움
        const [la, lo] = toLL(va.map((v, k) => v * (1 - t) + vb[k] * t));
        return [la, lo, 1 + 0.12 * Math.sin(Math.PI * t)];
      });
    });
    const gridEl = el.querySelector(".gc-grid"), dotEl = el.querySelector(".gc-dots"), arcEl = el.querySelector(".gc-arcs");
    const spin = { a: 0 }, push = { b: 0 };
    const draw = () => {
      const rot = spin.a + push.b;
      let g = "";
      for (let k = 0; k < 12; k++) {
        const lon = (k / 12) * Math.PI * 2 + rot;
        g += line(Array.from({ length: 37 }, (_, i) => proj(-Math.PI / 2 + (i / 36) * Math.PI, lon)));
      }
      [-60, -30, 0, 30, 60].forEach((deg) => {
        const lat = (deg * Math.PI) / 180;
        g += line(Array.from({ length: 73 }, (_, i) => proj(lat, (i / 72) * Math.PI * 2)));
      });
      gridEl.setAttribute("d", g);
      let d = "";
      dots.forEach(([la, lo]) => {
        const [x, y, z] = proj(la, lo + rot);
        if (z > 0.05) { const s = +(0.6 + z * 0.9).toFixed(2); d += `M${(x - s).toFixed(1)} ${y.toFixed(1)}a${s} ${s} 0 1 0 ${2 * s} 0a${s} ${s} 0 1 0 ${-2 * s} 0`; }
      });
      dotEl.setAttribute("d", d);
      arcEl.setAttribute("d", arcPts.map((pts) => line(pts.map(([la, lo, al]) => proj(la, lo + rot, al)))).join(""));
      arcEl.style.strokeDashoffset = String(-rot * 60);
    };
    draw();
    const spinTw = gsap.to(spin, { a: Math.PI * 2, duration: m.d(36), ease: "none", repeat: -1, onUpdate: draw });
    // 화면 밖에선 멈춤
    ScrollTrigger.create({ trigger: ".gc-globe-w", start: "top bottom", end: "bottom top", onToggle: (s) => (s.isActive ? spinTw.play() : spinTw.pause()) });

    // ── 도시 목록: 스크롤 진행에 따라 한 칸씩 넘어가며 가운데 도시가 밝아짐(원본: 0.6초 Out 이동)
    const mask = el.querySelector(".gc-mask");
    const list = el.querySelector(".gc-list");
    const lis = [...list.children];
    let idx = -1;
    const yFor = (i) => -(lis[i].offsetTop + lis[i].offsetHeight / 2 - mask.clientHeight / 2);
    const go = (i, instant) => {
      if (i === idx || !lis[i]) return;
      lis[idx]?.classList.remove("is-on");
      lis[i].classList.add("is-on");
      idx = i;
      gsap.to(list, { y: yFor(i), duration: instant ? 0 : m.d(0.6), ease: m.ease.out, overwrite: true });
    };
    go(0, true);
    ScrollTrigger.create({
      trigger: mobile ? ".gc-cities" : ".gc-area",
      start: mobile ? "top 85%" : "top center",
      end: mobile ? "bottom 15%" : "bottom bottom",
      onUpdate: (s) => go(Math.min(lis.length - 1, Math.floor(s.progress * lis.length)), false),
      onRefresh: () => gsap.set(list, { y: yFor(Math.max(idx, 0)) }),
    });

    // ── 카드·연락처: 흐림에서 또렷하게(원본 div-reveal: blur 36px, 1초, 0.1초 간격)
    gsap.from(".gc-card > *", {
      filter: "blur(36px)", opacity: 0, duration: m.d(1), delay: m.d(0.3), stagger: m.stagger(0.1), ease: m.ease.out,
      scrollTrigger: { trigger: ".gc-card", start: "top 85%" },
    });
    gsap.from(".gc-n", {
      textContent: 0, snap: { textContent: 1 }, duration: m.d(1.2), delay: m.d(0.3), ease: m.ease.out,
      scrollTrigger: { trigger: ".gc-card", start: "top 85%" },
    });
    gsap.from(".gc-cta-l > *, .gc-cta-r > *", {
      filter: "blur(36px)", opacity: 0, duration: m.d(1), delay: m.d(0.3), stagger: m.stagger(0.1), ease: m.ease.out,
      scrollTrigger: { trigger: ".gc-cta", start: "top 90%" },
    });

    if (mobile) {
      gsap.from(".gc-word span", {
        yPercent: 60, opacity: 0, duration: m.d(1), ease: m.ease.out,
        scrollTrigger: { trigger: ".gc-word", start: "top 90%" },
      });
      return;
    }

    // ── 들어오는 동안: 도시 묶음이 위에서 살짝 내려오며 자리 잡음
    gsap.fromTo(".gc-cities-in", { yPercent: -40 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: ".gc-area", start: "top bottom", end: "top top", scrub: m.scrub },
    });
    // ── 고정 구간: 큰 글씨가 아래에서 올라오고, 지구본은 두 배 크기 아래쪽에서 제자리로(+스크롤만큼 더 돎)
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".gc-area", start: "top top", end: "bottom bottom", scrub: m.scrub },
    })
      .fromTo(".gc-word span", { yPercent: 120 }, { yPercent: 0, duration: 1 }, 0)
      .fromTo(".gc-globe-w", { yPercent: 135, scale: 2 }, { yPercent: 0, scale: 1, duration: 1 }, 0)
      .to(push, { b: Math.PI * 0.75, duration: 1, onUpdate: draw }, 0)
      // 마지막 연락처가 올라올 때 도시 묶음은 아래에서 위로 걷힘
      .fromTo(".gc-cities", { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.3 }, 0.7);
  },
};
