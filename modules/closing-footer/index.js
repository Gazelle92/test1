// 마무리·푸터: 무료 체험 안내 카드가 떠오르고, 이어지는 큰 푸터 제목은 글자마다 두 벌을 겹쳐 두었다가
// 무작위 순서로 한 칸씩 굴러 올라가며 바뀐다. 아래에는 소식 받기 칸과 링크 묶음이 차례로 나타난다.
// 참고: madewithgsap 무료 효과·푸터(anim-title 글자 굴리기, roll 버튼). 코드·내용은 새로 작성.
import gsap from "gsap";
import "./style.css";

// 글자 하나 = 같은 글자 두 벌(위: 흐린 글자, 아래: 진한 글자)
const rollChars = (line) =>
  [...line].map((ch) => (ch === " " ? `<span class="cf-sp"> </span>` : `<span class="cf-ch"><span>${ch}</span><span>${ch}</span></span>`)).join("");

const rollBtn = (label, cls, href) =>
  `<a class="cf-btn ${cls}" href="${href}"><span class="cf-clip"><span class="cf-roll"><span>${label} <i>→</i></span><span aria-hidden="true">${label} <i>→</i></span></span></span></a>`;

export default {
  id: "closing-footer",
  category: "마무리·푸터",
  source: "madewithgsap 무료 효과·마무리 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "무료 체험 카드 → 큰 제목 글자 굴리기 → 링크 푸터",
  defaults: {
    freeTitle: "무료 모듈로 먼저 시작해 보세요",
    freeText: "가입 없이 몇 가지 모듈을 바로 써 볼 수 있습니다.",
    freeCta: "바로 써 보기",
    freeNote: "결제 정보나 계정이 필요 없습니다.<br>누구나 무료로 쓸 수 있어요.",
    label: "계속 늘어나는 잘 만든 움직임 모음에<br>함께하세요.",
    big: ["움직일", "준비 됐나요"],
    primary: "시작하기",
    secondary: "모음 둘러보기",
    newsTitle: "새 소식을 가장 먼저",
    newsPlaceholder: "이메일 주소",
    newsButton: "구독",
    newsNote: "새 모듈과 업데이트 소식만 보내 드립니다. 언제든 구독을 해지할 수 있어요.",
    newsThanks: "고맙습니다. 곧 첫 소식을 보내 드릴게요.",
    columns: [
      { title: "소식", links: ["인스타그램", "유튜브", "뉴스레터"] },
      { title: "둘러보기", links: ["모듈 모음", "가격", "작업 사례", "무료 모듈"] },
      { title: "문의", links: ["메일 보내기", "자주 묻는 질문"] },
    ],
    copy: "© 2026 움직임 모음",
    legal: ["이용 약관", "개인정보 처리방침"],
  },
  render: (c) => `
    <div class="cf-free">
      <div class="cf-free-card">
        <div class="cf-free-media" aria-hidden="true">
          <span class="cf-orb cf-orb1"></span><span class="cf-orb cf-orb2"></span>
          <span class="cf-icon"><svg viewBox="0 0 48 48"><path d="M24 8v22M15 21l9 9 9-9M10 38h28" /></svg></span>
        </div>
        <div class="cf-free-right">
          <p class="cf-free-title">${c.freeTitle}</p>
          <p class="cf-free-text">${c.freeText}</p>
          ${rollBtn(c.freeCta, "cf-btn-dark", "#")}
          <p class="cf-free-note">${c.freeNote}</p>
        </div>
      </div>
    </div>
    <footer class="cf-foot">
      <div class="cf-top">
        <p class="cf-label">${c.label}</p>
        <h2 class="cf-sr">${c.big.join(" ")}</h2>
        <p class="cf-big" aria-hidden="true">${c.big.map((l) => `<span class="cf-line">${rollChars(l)}</span>`).join("")}</p>
        <div class="cf-buttons">${rollBtn(c.primary, "cf-btn-accent", "#")}${rollBtn(c.secondary, "cf-btn-soft", "#")}</div>
      </div>
      <div class="cf-bottom">
        <div class="cf-news">
          <h3>${c.newsTitle}</h3>
          <form class="cf-form">
            <input type="email" name="email" placeholder="${c.newsPlaceholder}" required />
            <button type="submit">${c.newsButton} →</button>
          </form>
          <p class="cf-news-note" data-thanks="${c.newsThanks}">${c.newsNote}</p>
        </div>
        <div class="cf-cols">${c.columns.map((col) => `
          <div class="cf-col"><h3>${col.title}</h3><ul>${col.links.map((x) => `<li><a href="#">${x}</a></li>`).join("")}</ul></div>`).join("")}
        </div>
      </div>
      <div class="cf-end">
        <span>${c.copy}</span>
        <ul>${c.legal.map((x) => `<li><a href="#">${x}</a></li>`).join("")}</ul>
      </div>
    </footer>`,
  animate(el, m) {
    // 무료 체험 카드: 떠오르며 커지고, 가운데 아이콘이 튀어나온다
    const free = gsap.timeline({
      scrollTrigger: { trigger: ".cf-free-card", start: "top 85%", toggleActions: "play none none reverse" },
    });
    free.from(".cf-free-card", { y: 80, scale: 0.94, opacity: 0, duration: m.d(1), ease: m.ease.out })
      .from(".cf-icon", { scale: 0, rotation: -30, duration: m.d(0.7), ease: m.ease.back }, "<0.35")
      .from(".cf-free-right > *", { y: 24, opacity: 0, duration: m.d(0.7), ease: m.ease.out, stagger: m.stagger(0.07) }, "<");

    // 큰 제목: 줄마다 글자를 무작위 순서로 한 칸씩 굴려 올린다(위 흐린 글자 → 아래 진한 글자)
    el.querySelectorAll(".cf-line").forEach((line) => {
      gsap.to(line.querySelectorAll(".cf-ch"), {
        yPercent: -110, delay: 0.3, duration: m.d(1), ease: m.ease.inOut,
        stagger: { each: m.stagger(0.034), from: "random" },
        scrollTrigger: { trigger: line, start: "top 80%" },
      });
    });
    gsap.from(".cf-label, .cf-buttons", {
      y: 30, opacity: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.15),
      scrollTrigger: { trigger: ".cf-top", start: "top 80%", toggleActions: "play none none reverse" },
    });

    // 아래 묶음: 소식 받기 → 링크 칸 → 맨 아래 줄
    gsap.from(".cf-news, .cf-col, .cf-end", {
      y: 40, opacity: 0, duration: m.d(0.8), ease: m.ease.out, stagger: m.stagger(0.08),
      scrollTrigger: { trigger: ".cf-bottom", start: "top 85%", toggleActions: "play none none reverse" },
    });

    // 버튼: 마우스를 올리면 글자가 한 줄 굴러 내려옴
    el.querySelectorAll(".cf-btn").forEach((btn) => {
      const roll = btn.querySelector(".cf-roll");
      btn.addEventListener("mouseenter", () => {
        gsap.fromTo(roll, { yPercent: 0 }, { yPercent: 100, duration: m.d(0.4), ease: m.ease.back, overwrite: true });
      });
    });

    // 소식 받기: 실제 전송은 하지 않고 안내 문구만 바꾼다
    const form = el.querySelector(".cf-form");
    const note = el.querySelector(".cf-news-note");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.textContent = note.dataset.thanks;
      form.reset();
      gsap.fromTo(note, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: m.d(0.5), ease: m.ease.out });
    });
  },
};
