// 시범 조합 4: 시범 조합 2(pages/drake)와 같은 모듈·내용에 레퍼런스 mailchimp.com에서 뽑은 디자인 시스템 "침프"를 입힌다.
// tone: base(흰) · grey(연회색 면) · dark(페퍼콘) · yellow(노랑) — 침프 테마가 정한 색 면
import base from "../drake/page.js";

const tones = { "hero-window-sig": "base", "effects-cards-sig": "base", "showcase-pinned-sig": "dark", "pricing-flip-sig": "grey", "closing-footer": "yellow" };

export default {
  theme: "chimp",
  sections: base.sections.map((s) => ({ ...s, tone: tones[s.use.id] || "base" })),
};
