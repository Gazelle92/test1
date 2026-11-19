// 후기: 가로로 늘어선 후기 카드를 끌면 띠가 부드럽게 따라오고(quickTo), 화면에 새로 들어오는 카드는
// 끄는 방향에서 작게 날아들며 커진다. 이어서 '만든 사람' 소개 문단과 이미지가 차례로 드러난다.
// 참고: madewithgsap 후기·제작자 섹션(끌기 띠 + 등장 카드). 코드·내용은 새로 작성.
import gsap from "gsap";
import "./style.css";

const initial = (name) => name.trim().charAt(0);

export default {
  id: "community-testimonials",
  category: "후기",
  source: "madewithgsap 후기·제작자 참고",
  form: "고정형", // 스크롤형: 스크롤 길이를 차지하며 움직임 / 고정형: 일반 높이
  summary: "끌어서 넘기는 후기 띠 → 만든 사람 소개",
  defaults: {
    eyebrow: "함께 쓰는 사람들",
    title: "써 본 사람들이 먼저 이야기합니다",
    hint: "옆으로 끌어서 넘겨 보세요",
    items: [
      { quote: "처음 열어 본 날 바로 시안 세 개를 만들었습니다. 움직임이 과하지 않고, 필요한 만큼만 살아 있어요.", name: "김하늘", role: "브랜드 디자이너" },
      { quote: "코드가 잘 나뉘어 있어서 우리 사이트 구조에 맞게 고치기 쉬웠습니다. 설명도 친절하고요.", name: "이도윤", role: "프론트엔드 개발자" },
      { quote: "고객에게 보여 줄 때 반응이 가장 좋은 부분이 늘 이 섹션들이었습니다. 작업 시간이 절반으로 줄었어요.", name: "박서연", role: "스튜디오 대표" },
      { quote: "작은 팀이라 모션까지 손이 잘 안 갔는데, 이제는 기본값만으로도 완성도가 올라갑니다.", name: "최민준", role: "제품 디자이너" },
      { quote: "스크롤 연출을 처음 배우는 사람에게도 좋은 교과서예요. 하나씩 뜯어보며 많이 배웠습니다.", name: "정유진", role: "웹 퍼블리셔" },
      { quote: "테마만 바꿔도 전혀 다른 브랜드처럼 보이는 게 신기합니다. 제안 단계에서 특히 유용해요.", name: "한지호", role: "아트 디렉터" },
      { quote: "모바일에서도 자연스럽게 움직여서 따로 손볼 곳이 거의 없었습니다.", name: "윤채원", role: "프리랜서 개발자" },
    ],
    aboutLabel: "만든 사람들",
    about:
      "이 모음은 <b>모션을 좋아하는 개발자</b>와 <b>화면을 다듬는 디자이너</b>, 두 친구가 함께 만들었습니다. 여러 해 동안 브랜드 사이트를 만들며 모은 방법을 <b>누구나 바로 쓸 수 있는 형태</b>로 정리했습니다.",
  },
  render: (c) => `
    <div class="ct-head">
      <p class="ct-eyebrow">${c.eyebrow}</p>
      <h2 class="ct-title">${c.title}</h2>
      <p class="ct-hint">${c.hint}</p>
    </div>
    <div class="ct-wrap">
      <div class="ct-strip">${c.items.map((t, i) => `
        <div class="ct-item">
          <article class="ct-card${i === 0 ? " ct-card-spe" : ""}" style="--i:${i}">
            <p class="ct-quote">${t.quote}</p>
            <div class="ct-who">
              <span class="ct-avatar" aria-hidden="true">${initial(t.name)}</span>
              <p><strong>${t.name}</strong><span>${t.role}</span></p>
            </div>
          </article>
        </div>`).join("")}
      </div>
    </div>
    <div class="ct-about">
      <div class="ct-about-row">
        <div class="ct-about-left">
          <p class="ct-label">${c.aboutLabel}</p>
          <p class="ct-about-text">${c.about}</p>
        </div>
        <div class="ct-media" aria-hidden="true">
          <svg viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice">
            <circle cx="72" cy="78" r="34" />
            <circle cx="128" cy="62" r="26" />
            <path d="M20 140 Q72 96 100 120 T180 140Z" />
          </svg>
        </div>
      </div>
      <hr class="ct-line" />
    </div>`,
  animate(el, m) {
    // 제목 영역 등장
    gsap.from(".ct-head > *", {
      y: 40, opacity: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.08),
      scrollTrigger: { trigger: ".ct-head", start: "top 85%", toggleActions: "play none none reverse" },
    });

    // 후기 띠: 끄는 만큼(1.4배) 목표 위치를 바꾸고 quickTo가 부드럽게 따라간다.
    // 모바일은 원본처럼 기본 가로 스크롤(스냅)을 쓴다.
    if (!m.mobile()) {
      const strip = el.querySelector(".ct-strip");
      const items = [...el.querySelectorAll(".ct-item")].map((p) => ({ p, card: p.querySelector(".ct-card") }));
      const shown = new Set();
      let target = 0;
      let last = 0;

      items.forEach(({ p, card }) => {
        const l = p.offsetLeft;
        if (l < el.clientWidth && l + p.offsetWidth > 0) shown.add(p);
        else gsap.set(card, { autoAlpha: 0 });
      });

      // 띠가 움직일 때마다 화면 안으로 들어온 카드는 움직인 방향에서 날아들고, 나간 카드는 숨긴다
      const check = () => {
        const x = gsap.getProperty(strip, "x");
        const dx = x - last;
        if (!dx) return;
        last = x;
        const w = el.clientWidth;
        items.forEach(({ p, card }) => {
          const l = p.offsetLeft + x;
          const vis = l < w && l + p.offsetWidth > 0;
          if (vis && !shown.has(p)) {
            shown.add(p);
            const e = -Math.sign(dx) * (100 / (1 + Math.abs(dx) / 500));
            gsap.fromTo(card, { x: 4 * e, scale: 0.5, autoAlpha: 1 }, { x: 0, scale: 1, duration: m.d(0.8), ease: m.ease.out });
          } else if (!vis && shown.has(p)) {
            shown.delete(p);
            gsap.set(card, { autoAlpha: 0 });
          }
        });
      };
      const follow = gsap.quickTo(strip, "x", { duration: m.d(0.5), ease: m.ease.out, onUpdate: check });

      // 끌기: 띠 요소에만 포인터 이벤트를 건다(포인터 캡처로 바깥까지 따라감)
      let dragging = false;
      let px = 0;
      strip.addEventListener("pointerdown", (e) => {
        dragging = true;
        px = e.clientX;
        strip.setPointerCapture(e.pointerId);
        strip.classList.add("is-drag");
      });
      strip.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        const d = e.clientX - px;
        px = e.clientX;
        target = gsap.utils.clamp(Math.min(0, el.clientWidth - strip.offsetWidth), 0, target + 1.4 * d);
        follow(target);
      });
      const end = (e) => {
        if (!dragging) return;
        dragging = false;
        strip.classList.remove("is-drag");
        if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId);
      };
      strip.addEventListener("pointerup", end);
      strip.addEventListener("pointercancel", end);
      strip.addEventListener("dragstart", (e) => e.preventDefault());
    }

    // 만든 사람: 글 → 이미지(가려진 채로 열림) → 구분선 순서로 드러남
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".ct-about", start: "top 80%", toggleActions: "play none none reverse" },
    });
    tl.from(".ct-label, .ct-about-text", { y: 40, opacity: 0, duration: m.d(0.9), ease: m.ease.out, stagger: m.stagger(0.1) })
      .from(".ct-media", { clipPath: "inset(100% 0% 0% 0%)", duration: m.d(1), ease: m.ease.inOut }, "<0.1")
      .from(".ct-media svg", { scale: 1.25, duration: m.d(1.2), ease: m.ease.out }, "<")
      .from(".ct-line", { scaleX: 0, transformOrigin: "0 50%", duration: m.d(1), ease: m.ease.inOut }, "<0.2");
  },
};
