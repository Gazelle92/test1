// 시범 조합 3: 시범 조합 2(pages/drake)와 같은 모듈·내용에 레퍼런스 dapper.agency에서 뽑은 디자인 시스템 "대퍼"를 입힌다.
// 같은 페이지라도 디자인 시스템만 바꾸면 톤앤매너가 통째로 바뀌는지 보는 비교용.
// tone: base(연회색 질감) · white(흰 면) · dark(거의 검정 면) — 대퍼 테마가 정한 색 면
import base from "../drake/page.js";

const tones = { "hero-window-sig": "base", "effects-cards-sig": "base", "showcase-pinned-sig": "white", "pricing-flip-sig": "base", "closing-footer": "dark" };

export default {
  theme: "dapper",
  sections: base.sections.map((s) => ({ ...s, tone: tones[s.use.id] || "base" })),
};
