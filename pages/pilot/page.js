// 조합 페이지 설정: 쓸 모듈의 순서와 내용, 기본 테마만 적는다.
import hero from "../../modules/hero-window/index.js";
import effects from "../../modules/effects-cards/index.js";
import pricing from "../../modules/pricing-flip/index.js";

export default {
  theme: "clean",
  sections: [
    { use: hero, content: { left: "하늘을", right: "가볍게" } },
    { use: effects },
    { use: pricing },
  ],
};
