// 모듈 창고 목록: 새 모듈을 만들면 여기에 한 줄 추가한다. (창고 화면은 분류 순서대로 묶어 보여 줌)
import heroWindow from "./hero-window/index.js";
import heroWindowSig from "./hero-window-sig/index.js";
import heroVideocard from "./hero-videocard/index.js";
import heroSwirl from "./hero-swirl/index.js";
import collectionLogos from "./collection-logos/index.js";
import jetFleet from "./jet-fleet/index.js";
import jetFleetSig from "./jet-fleet-sig/index.js";
import graphStack from "./graph-stack/index.js";
import effectsCards from "./effects-cards/index.js";
import effectsCardsSig from "./effects-cards-sig/index.js";
import keyAreas from "./key-areas/index.js";
import featuresWorkflow from "./features-workflow/index.js";
import serviceAccordion from "./service-accordion/index.js";
import approachSteps from "./approach-steps/index.js";
import showcasePinned from "./showcase-pinned/index.js";
import showcasePinnedSig from "./showcase-pinned-sig/index.js";
import pricingFlip from "./pricing-flip/index.js";
import pricingFlipSig from "./pricing-flip-sig/index.js";
import communityTestimonials from "./community-testimonials/index.js";
import quoteVideo from "./quote-video/index.js";
import globalCities from "./global-cities/index.js";
import closingFooter from "./closing-footer/index.js";

export default [
  heroWindow, heroWindowSig, heroVideocard, heroSwirl,
  collectionLogos,
  jetFleet, jetFleetSig, graphStack,
  effectsCards, effectsCardsSig, keyAreas,
  featuresWorkflow, serviceAccordion, approachSteps,
  showcasePinned, showcasePinnedSig,
  pricingFlip, pricingFlipSig,
  communityTestimonials, quoteVideo,
  globalCities,
  closingFooter,
];

// 분류 순서(페이지 위→아래에 보통 놓이는 순서)
export const categories = ["히어로", "로고 띠", "소개", "숫자·카드", "기능", "갤러리", "가격", "후기", "문의·CTA", "마무리·푸터", "화면 전환"];
