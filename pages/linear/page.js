// 시범 조합 6: 시범 조합 2(pages/drake)와 같은 모듈·내용에 레퍼런스 linear.app에서 뽑은 디자인 시스템 "리니어"를 입힌다.
// tone: base(검정) · raised(한 단 위 면) · glow(위쪽 인디고 빛) — 리니어 테마가 정한 색 면
import base from "../drake/page.js";

const tones = { "hero-window-sig": "base", "effects-cards-sig": "glow", "showcase-pinned-sig": "raised", "pricing-flip-sig": "glow", "closing-footer": "base" };

export default {
  theme: "linear",
  sections: base.sections.map((s) => ({ ...s, tone: tones[s.use.id] || "base" })),
};
