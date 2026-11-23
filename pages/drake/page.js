// 시범 조합 2: ① 모듈 고르고 합치기 → ② 레퍼런스(thedrake.ca)에서 뽑은 디자인 시스템 "드레이크" 테마 입히기
// 모듈은 원본 모션을 살린 보존판(-sig)을 쓰고, 내용은 가상의 부티크 호텔로 바꿨다.
// tone: base(흰 바탕) · alt(와인) · lavender · cream · ink(거의 검정) — 드레이크 테마가 정한 색 면
import hero from "../../modules/hero-window-sig/index.js";
import effects from "../../modules/effects-cards-sig/index.js";
import showcase from "../../modules/showcase-pinned-sig/index.js";
import pricing from "../../modules/pricing-flip-sig/index.js";
import closing from "../../modules/closing-footer/index.js";

export default {
  theme: "drake",
  sections: [
    {
      use: hero,
      content: {
        left: "취향이<br>머무는 곳",
        right: "도시의<br>새 거실",
        lead: "머무는 동안<br>영감을 얻는 호텔",
        desc: "예술과 음식, 음악이 모이는 동네 한가운데에서 하룻밤을 보내세요. 나머지는 저희가 준비합니다.",
        hint: "아래로 스크롤",
        hint2: "둘러보기 시작",
        about: "도시와 바닷가에 세 곳의 호텔이 있습니다. 머무는 사람과 동네 사람이 함께 쓰는 거실이 되려고 합니다.",
      },
    },
    {
      use: effects,
      content: {
        lines: ["세 곳의 호텔.", "매일 새로운 이야기."],
        cards: [
          "도시 한가운데 객실 58개. 1층 바는 밤늦게까지 열려 있어요.",
          "바닷가 별채. 아침마다 근처 농장에서 받은 재료로 차립니다.",
          "작가와 함께 꾸민 객실. 머무는 동안 작품을 가까이에서 보세요.",
          "주말마다 공연과 상영회. 투숙객이 아니어도 들를 수 있어요.",
        ],
      },
    },
    {
      use: showcase,
      tone: "alt",
      content: {
        title: "우리의 공간을 둘러보세요",
        cta: "공간 둘러보기",
        names: ["도시 호텔", "바닷가 별채", "루프톱 바", "작은 갤러리", "언더그라운드", "아침 식당", "와인 바", "정원 객실", "공연장", "서재", "테라스", "꽃 가게", "레코드 숍", "빵집", "모텔"],
      },
    },
    {
      use: pricing,
      tone: "lavender",
      content: {
        title: "주중에도 주말에도<br>같은 마음으로",
        save: "주중 숙박 20% 할인",
        q: { tab: "주말", price: "289,000원", label: "1박 기준 · 세금 별도" },
        y: { tab: "주중", badge: "-20%", price: "229,000원", label: "1박 기준 · 세금 별도" },
        cta: "예약하기",
        note: "체크인 오후 3시 · 체크아웃 오전 11시<br>반려동물과 함께 묵을 수 있어요<br>예약 변경은 3일 전까지 무료",
        groups: [
          { title: "모든 객실", items: ["무료 와이파이", "레코드 플레이어", "동네 지도와 추천 목록", "늦은 체크아웃 요청"] },
          { title: "투숙객 혜택", items: ["바 첫 잔 무료", "공연 우선 입장", "자전거 대여", "갤러리 해설"] },
        ],
        people: "올해 12,000명이 머물렀어요",
      },
    },
    {
      use: closing,
      tone: "ink",
      content: {
        freeTitle: "새 소식을 가장 먼저 받아 보세요",
        freeText: "공연·전시·할인 소식을 한 달에 한 번 보내 드려요.",
        freeCta: "소식 받기",
        label: "다음 여행을<br>함께 준비할게요.",
        big: ["이번 주말", "어디로 갈까요"],
        primary: "예약하기",
        secondary: "호텔 둘러보기",
        copy: "© 2026 시범 호텔",
      },
    },
  ],
};
