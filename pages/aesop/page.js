// 시범 조합 5: 시범 조합 2(pages/drake)와 같은 모듈·내용에 레퍼런스 aesop.com에서 뽑은 디자인 시스템 "이솝"을 입힌다.
// tone: base(크림) · sand(샌드 면) · dark(차콜) — 이솝 테마가 정한 색 면
import base from "../drake/page.js";

const tones = { "hero-window-sig": "base", "effects-cards-sig": "base", "showcase-pinned-sig": "sand", "pricing-flip-sig": "base", "closing-footer": "dark" };

export default {
  theme: "aesop",
  sections: base.sections.map((s) => ({ ...s, tone: tones[s.use.id] || "base" })),
};
