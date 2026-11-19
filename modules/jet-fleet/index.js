// 소개: 큰 제목이 흐림에서 또렷해지며 양옆으로 벌어지고, 기체가 아래에서 올라와 작아진 뒤
// 위에서부터 지워지며 같은 자리에 기내 배치도가 그려진다. 동시에 제목 화면은 아래로, 제원 화면은 위에서 내려온다.
// 참고: jeskojets 기체 섹션(4화면 길이 고정 무대 · 기체 축소 · 마스크로 기체→배치도 전환). 코드·그림·문구는 새로 작성.
import gsap from "gsap";
import "./style.css";

// 기체 윤곽(위에서 본 모습, viewBox 0 0 200 400)
const BODY = "M100 8 C113 8 122 42 122 84 L122 330 C122 362 112 392 100 392 C88 392 78 362 78 330 L78 84 C78 42 87 8 100 8 Z";
const WINGS = "M121 160 L193 242 L193 258 L121 226 Z M79 160 L7 242 L7 258 L79 226 Z";
const TAIL = "M117 344 L152 378 L152 388 L110 372 Z M83 344 L48 378 L48 388 L90 372 Z";
const ENGINES = `<rect x="124" y="282" width="13" height="42" rx="6.5"/><rect x="63" y="282" width="13" height="42" rx="6.5"/>`;

const plane = () => `
  <svg class="jf-plane" viewBox="0 0 200 400" aria-hidden="true">
    <defs>
      <linearGradient id="jf-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style="stop-color:color-mix(in srgb,var(--c-fg) 70%,var(--c-bg))"/>
        <stop offset=".5" style="stop-color:var(--c-fg)"/>
        <stop offset="1" style="stop-color:color-mix(in srgb,var(--c-fg) 70%,var(--c-bg))"/>
      </linearGradient>
    </defs>
    <g fill="url(#jf-g)"><path d="${WINGS}"/><path d="${TAIL}"/>${ENGINES}<path d="${BODY}"/></g>
    <path d="M91 40 Q100 30 109 40 L107 50 Q100 46 93 50 Z" style="fill:var(--c-accent)"/>
    <path d="M100 60 L100 340" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>
  </svg>`;

// 기내 배치도: 같은 윤곽 위에 좌석·탁자·침대·화장실을 선으로 그림
const seat = (x, y) => `<rect class="jf-seat" x="${x}" y="${y}" width="12" height="12" rx="3"/>`;
const blueprint = () => {
  const rows = [92, 120, 150, 178].map((y) => seat(83, y) + seat(105, y)).join("");
  return `
  <svg class="jf-print" viewBox="0 0 200 400" aria-hidden="true">
    <g class="jf-outline"><path d="${WINGS}"/><path d="${TAIL}"/>${ENGINES}<path d="${BODY}"/></g>
    <g class="jf-inner">
      <path d="M82 60 L118 60"/>
      <rect x="82" y="64" width="15" height="17" rx="2"/><rect x="103" y="64" width="15" height="17" rx="2"/>
      <rect x="85" y="106" width="8" height="10" rx="1.5"/><rect x="107" y="106" width="8" height="10" rx="1.5"/>
      <rect x="85" y="164" width="8" height="10" rx="1.5"/><rect x="107" y="164" width="8" height="10" rx="1.5"/>
      <rect x="82" y="204" width="12" height="38" rx="3"/><rect x="107" y="212" width="9" height="22" rx="1.5"/>
      <rect x="84" y="254" width="32" height="32" rx="3"/><path d="M84 262 L116 262"/>
      <rect x="82" y="298" width="36" height="20" rx="2"/><circle cx="110" cy="308" r="4"/>
      <path class="jf-aisle" d="M100 88 L100 292"/>
    </g>
    <g class="jf-seats">${rows}</g>
  </svg>`;
};

const rows = (list) => list.map(([k, v]) => `<div class="jf-row"><dt>${k}</dt><dd>${v}</dd></div>`).join("");

export default {
  id: "jet-fleet",
  category: "소개",
  source: "jeskojets 기체 섹션 참고",
  form: "스크롤형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "큰 제목 → 기체 등장·축소 → 기내 배치도 + 제원 표",
  defaults: {
    left: "더 멀리",
    right: "더 편안하게",
    sub: "머무는 시간까지\n설계한 이동",
    maker: "노바 에어",
    model: "NV-8 장거리형",
    desc: "날개는 공기 흐름을 흐트러뜨리지 않도록 다듬었고, 두 개의 후방 엔진은 긴 거리를 쉬지 않고 날 수 있는 힘을 냅니다. 조용한 객실에서 도착까지 온전히 쉬세요.",
    kicker: "초장거리 기체",
    headline: "대륙 사이를 한 번에",
    body: "중간 급유 없이 먼 도시까지 곧장 갑니다. 갈아타는 시간만큼 하루가 길어집니다.",
    overview: [
      ["최대 운항 거리", "11,000 km"],
      ["순항 속도", "900 km/h"],
      ["탑승 인원", "최대 12석"],
      ["연속 비행", "13시간"],
      ["수하물 공간", "5.4 m³"],
      ["순항 고도", "15,000 m"],
    ],
    specLabel: "객실 제원",
    specs: [
      ["객실 길이", "14.0 m"],
      ["객실 폭", "2.5 m"],
      ["객실 높이", "1.9 m"],
    ],
  },
  render: (c) => `
    <div class="jf-area">
      <div class="jf-stick">
        <div class="jf-bg"></div>
        <div class="jf-intro">
          <h2 class="jf-title"><span class="jf-t jf-tl">${c.left}</span><span class="jf-push"></span><span class="jf-t jf-tr">${c.right}</span></h2>
          <div class="jf-bot">
            <p class="jf-sub">${c.sub.replace(/\n/g, "<br>")}</p>
            <div class="jf-desc">
              <div class="jf-model"><span>${c.maker}</span><b>${c.model}</b></div>
              <p>${c.desc}</p>
            </div>
          </div>
        </div>
        <div class="jf-craft">${plane()}${blueprint()}</div>
        <div class="jf-spec">
          <div class="jf-col jf-left">
            <div class="jf-name"><span>${c.maker}</span><strong>${c.model}</strong></div>
            <dl class="jf-list">${rows(c.overview)}</dl>
          </div>
          <div class="jf-mid"></div>
          <div class="jf-col jf-right">
            <div class="jf-rt">
              <h3>${c.kicker}</h3>
              <h4>${c.headline}</h4>
              <p>${c.body}</p>
            </div>
            <div class="jf-specs"><span class="jf-label">${c.specLabel}</span><dl class="jf-list">${rows(c.specs)}</dl></div>
          </div>
        </div>
      </div>
    </div>`,
  animate(el, m) {
    // 제목: 글자마다 흐림(blur)에서 또렷해지며 나타남(원본: blur 36px, 1초, 0.05초 간격, 0.3초 지연)
    const chars = [...m.split(el.querySelector(".jf-tl")), ...m.split(el.querySelector(".jf-tr"))];
    gsap.from(chars, {
      filter: "blur(36px)", opacity: 0, duration: m.d(1), delay: m.d(0.3), stagger: m.stagger(0.05), ease: m.ease.out,
      scrollTrigger: { trigger: ".jf-title", start: "top 85%", toggleActions: "play none none none" },
    });
    // 아래 설명 묶음: 차례로 흐림 해제
    gsap.from(".jf-sub, .jf-desc > *", {
      filter: "blur(24px)", opacity: 0, duration: m.d(1), delay: m.d(0.3), stagger: m.stagger(0.1), ease: m.ease.out,
      scrollTrigger: { trigger: ".jf-bot", start: "top 95%", toggleActions: "play none none none" },
    });

    if (m.mobile()) {
      // 모바일: 고정 무대 없이 흐름대로. 기체가 화면 가운데를 지날 때 배치도로 바뀐다.
      gsap.fromTo(".jf-craft", { "--m": "0%" }, {
        "--m": "115%", ease: "none",
        scrollTrigger: { trigger: ".jf-craft", start: "top 55%", end: "bottom 45%", scrub: m.scrub },
      });
      gsap.from(".jf-row", {
        y: 16, opacity: 0, duration: m.d(0.6), ease: m.ease.out, stagger: m.stagger(0.05),
        scrollTrigger: { trigger: ".jf-spec", start: "top 80%" },
      });
      return;
    }

    // 제목 좌우가 가운데 빈칸이 늘어나며 양끝으로 벌어짐
    gsap.fromTo(".jf-push", { flexGrow: 0 }, {
      flexGrow: 1, duration: m.d(1), ease: m.ease.inOut,
      scrollTrigger: { trigger: ".jf-area", start: "top 45%", toggleActions: "play none none reverse" },
    });

    // 스크롤 전체(4화면 길이)를 0~1로 보고 원본 구간 비율을 그대로 옮김
    // 배경 0~0.5 · 기체 축소 0.17~0.8 · 화면 교대 0.5~0.8 · 기체→배치도 0.8~1
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: ".jf-area", start: "top top", end: "bottom bottom", scrub: m.scrub },
    });
    tl.fromTo(".jf-bg", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
      .fromTo(".jf-craft", { yPercent: 80, scale: 1 }, { yPercent: 0, scale: 0.55, duration: 0.63 }, 0.17)
      .to([".jf-intro", ".jf-spec"], { yPercent: 100, duration: 0.3 }, 0.5)
      .from(".jf-spec .jf-row", { opacity: 0, y: 18, duration: 0.08, stagger: 0.015 }, 0.66)
      .fromTo(".jf-craft", { "--m": "0%" }, { "--m": "115%", duration: 0.2 }, 0.8);
  },
};
