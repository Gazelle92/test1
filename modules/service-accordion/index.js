// 기능: 항목을 누르면 설명이 높이째 열리고, 오른쪽 그림판에 해당 그림이 아래에서 밀려 올라오며(안쪽은 확대→원래 크기) 바뀐다.
// 아래 띠에는 숫자(올라가며 세기)와 현지 시각(1초마다 갱신)을 보여 준다.
// 참고: jeskojets 서비스 섹션(아코디언 + 그림 교체 + 국가 수·현지 시각 띠). 코드·그림·문구는 새로 작성.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

// 그림 대신 쓰는 추상 장면 4가지(그라데이션 + 단순 도형)
const SHAPES = [
  `<ellipse cx="50" cy="52" rx="20" ry="30"/><ellipse cx="50" cy="52" rx="14" ry="23" class="o"/>`,
  `<circle cx="66" cy="34" r="12"/><path d="M0 74 L100 74" class="o"/><path d="M0 82 L100 82" class="o"/>`,
  `<circle cx="50" cy="100" r="22" class="o"/><circle cx="50" cy="100" r="38" class="o"/><circle cx="50" cy="100" r="54" class="o"/>`,
  `<path d="M-10 90 L60 -10 M10 110 L80 10 M30 130 L100 30" class="o"/><circle cx="28" cy="30" r="6"/>`,
];
const art = (i) => `
  <div class="sa-img sa-art-${i % 4}">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${SHAPES[i % 4]}</svg>
  </div>`;

export default {
  id: "service-accordion",
  category: "기능",
  source: "jeskojets 서비스 섹션 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "아코디언 4개 + 항목별 그림 교체 + 숫자·현지 시각 띠",
  defaults: {
    label: "더 나은 이동 방식",
    title: "작은 부분까지 대신 챙깁니다",
    items: [
      { name: "반려동물과 함께", text: "서류 준비부터 기내 자리까지 미리 맞춰 둡니다. 함께 타는 가족이 낯선 환경에서도 편히 쉴 수 있도록 담당자가 처음부터 끝까지 살핍니다." },
      { name: "언제든 연락", text: "시간대와 상관없이 담당 팀이 바로 응답합니다. 갑작스러운 일정 변경도 전화 한 통이면 다시 준비됩니다." },
      { name: "기내 맞춤 서비스", text: "좋아하는 음식과 음악, 필요한 업무 환경까지 미리 여쭤보고 준비합니다. 도착할 때까지 원하는 방식대로 시간을 쓰세요." },
      { name: "짧은 대기", text: "전용 출입구와 간단한 수속으로 공항에 머무는 시간을 줄였습니다. 도착 후 이동 수단까지 이어서 맞춰 둡니다." },
    ],
    info: [
      { label: "운항 가능 국가", value: "174" },
      { label: "본사", value: "서울, 대한민국" },
    ],
    timeLabel: "현지 시각",
    timeZone: "Asia/Seoul",
  },
  render: (c) => `
    <div class="sa-wrap">
      <div class="sa-grid">
        <div class="sa-content">
          <div class="sa-head">
            <span class="sa-label">${c.label}</span>
            <h2 class="sa-title">${c.title}</h2>
          </div>
          <div class="sa-list">${c.items.map((it, i) => `
            <div class="sa-item" data-i="${i}">
              <button class="sa-btn" type="button" aria-expanded="false">
                <h3>${it.name}</h3>
                <span class="sa-ico" aria-hidden="true"><i class="sa-ico1"></i><i class="sa-ico2"></i></span>
              </button>
              <div class="sa-desc"><div class="sa-desc-in">
                <p>${it.text}</p>
                <div class="sa-mimg">${art(i)}</div>
              </div></div>
            </div>`).join("")}
          </div>
        </div>
        <div class="sa-media">${c.items.map((_, i) => `
          <div class="sa-mi" data-i="${i}"><div class="sa-mw">${art(i)}</div></div>`).join("")}
        </div>
      </div>
      <div class="sa-band">${c.info.map((x) => `
        <div class="sa-cell"><span>${x.label}</span><b class="${/^\d+$/.test(x.value) ? "sa-count" : ""}">${x.value}</b></div>`).join("")}
        <div class="sa-cell sa-time"><span>${c.timeLabel}</span><b class="sa-clock" data-tz="${c.timeZone}">--:--:--</b></div>
      </div>
    </div>`,
  animate(el, m) {
    // 머리말: 제목 글자가 흐림에서 또렷하게
    gsap.from(m.split(el.querySelector(".sa-title")), {
      filter: "blur(24px)", opacity: 0, duration: m.d(1), delay: m.d(0.3), stagger: m.stagger(0.04), ease: m.ease.out,
      scrollTrigger: { trigger: ".sa-head", start: "top 85%" },
    });
    gsap.from(".sa-item", {
      y: 30, opacity: 0, duration: m.d(0.8), stagger: m.stagger(0.08), ease: m.ease.out,
      scrollTrigger: { trigger: ".sa-list", start: "top 85%" },
    });

    // 아코디언
    const items = [...el.querySelectorAll(".sa-item")];
    const media = [...el.querySelectorAll(".sa-mi")];
    const parts = (i) => {
      const it = items[i];
      return {
        btn: it.querySelector(".sa-btn"),
        desc: it.querySelector(".sa-desc"),
        text: it.querySelector(".sa-desc-in"),
        ico: it.querySelector(".sa-ico2"),
        mi: media[i],
        mw: media[i].querySelector(".sa-mw"),
        img: media[i].querySelector(".sa-img"),
      };
    };
    let current = null;
    let z = 1;
    gsap.set(el.querySelectorAll(".sa-mw"), { yPercent: 100 });
    const refresh = () => ScrollTrigger.refresh();

    const open = (i) => {
      const p = parts(i);
      gsap.killTweensOf([p.desc, p.text, p.ico, p.mw, p.img]);
      p.mi.style.zIndex = String(++z); // 새 그림을 맨 위로
      items[i].classList.add("is-open");
      p.btn.setAttribute("aria-expanded", "true");
      gsap.set(p.desc, { height: 0 });
      gsap.to(p.desc, { height: "auto", duration: m.d(1), ease: m.ease.out, onComplete: refresh });
      gsap.fromTo(p.mw, { yPercent: 100 }, { yPercent: 0, duration: m.d(1), ease: m.ease.out });
      gsap.fromTo(p.img, { yPercent: -50, scale: 2 }, { yPercent: 0, scale: 1, duration: m.d(1), ease: m.ease.out });
      gsap.fromTo(p.ico, { rotate: 0 }, { rotate: 90, duration: m.d(0.6), ease: m.ease.inOut });
      gsap.fromTo(p.text, { opacity: 0, filter: "blur(16px)" }, { opacity: 1, filter: "blur(0px)", duration: m.d(1), delay: m.d(0.15), ease: m.ease.out });
      current = i;
    };
    const close = (i) => {
      const p = parts(i);
      gsap.killTweensOf([p.desc, p.text, p.ico]);
      items[i].classList.remove("is-open");
      p.btn.setAttribute("aria-expanded", "false");
      gsap.to(p.desc, { height: 0, duration: m.d(1), ease: m.ease.out, onComplete: refresh });
      gsap.to(p.ico, { rotate: 180, duration: m.d(0.6), ease: m.ease.inOut });
      gsap.to(p.text, { opacity: 0, filter: "blur(16px)", duration: m.d(0.5), ease: m.ease.out });
      if (current === i) current = null;
    };
    items.forEach((it, i) => {
      it.querySelector(".sa-btn").addEventListener("click", () => {
        if (current === i) return close(i);
        if (current !== null) close(current);
        open(i);
      });
    });
    if (items.length) open(0);

    // 아래 띠: 숫자 세기 + 현지 시각
    gsap.from(".sa-cell", {
      filter: "blur(16px)", opacity: 0, duration: m.d(1), stagger: m.stagger(0.1), ease: m.ease.out,
      scrollTrigger: { trigger: ".sa-band", start: "top 92%" },
    });
    gsap.from(".sa-count", {
      textContent: 0, snap: { textContent: 1 }, duration: m.d(1.6), ease: m.ease.out,
      scrollTrigger: { trigger: ".sa-band", start: "top 92%" },
    });
    const clock = el.querySelector(".sa-clock");
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { timeZone: clock.dataset.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    } catch {
      fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    }
    const tick = () => (clock.textContent = fmt.format(new Date()));
    tick();
    // 시계는 실제 1초 간격(모션 배율과 무관). gsap 안에 두어 모듈을 내릴 때 함께 정리된다.
    gsap.to({}, { duration: 1, repeat: -1, onRepeat: tick });
  },
};
