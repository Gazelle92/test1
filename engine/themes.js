// 테마 = 디자인 토큰 + 모션 토큰 + 스크롤 설정. 이 파일만 바꾸면 모든 모듈의 느낌이 함께 바뀐다.
// 레퍼런스 사이트를 분석해 만든 디자인 시스템 테마는 따로 파일로 두고 여기서 불러온다(fonts·css·decorate 사용).
import drake from "./theme-drake.js";
import dapper from "./theme-dapper.js";
import chimp from "./theme-chimp.js";
import aesop from "./theme-aesop.js";
import linear from "./theme-linear.js";

export default [
  {
    id: "clean",
    name: "기본",
    tokens: {
      "font-display": "'Avenir Next', 'Helvetica Neue', 'Apple SD Gothic Neo', sans-serif",
      "font-body": "-apple-system, 'Apple SD Gothic Neo', sans-serif",
      "display-weight": "600",
      "display-style": "normal",
      "display-tracking": "-0.03em",
      "c-bg": "#f3f1ec",
      "c-fg": "#151515",
      "c-muted": "#77736c",
      "c-accent": "#4a8cff",
      "c-surface": "#ffffff",
      "c-line": "rgba(0,0,0,.1)",
      "c-bg-alt": "#151515",
      "c-fg-alt": "#f3f1ec",
      "space-section": "clamp(96px, 14vh, 180px)",
      radius: "18px",
    },
    motion: {
      ease: { out: "power3.out", inOut: "power2.inOut", back: "back.inOut(1.5)", elastic: "elastic.out(0.6,0.3)" },
      speed: 1,
      scrub: true,
    },
    scroll: { duration: 1.2, easing: "expo" },
  },
  {
    id: "editorial",
    name: "에디토리얼",
    tokens: {
      "font-display": "'Times New Roman', 'AppleMyungjo', serif",
      "font-body": "Georgia, 'AppleMyungjo', serif",
      "display-weight": "400",
      "display-style": "italic",
      "display-tracking": "-0.01em",
      "c-bg": "#111110",
      "c-fg": "#ece6da",
      "c-muted": "#8d877b",
      "c-accent": "#c8a265",
      "c-surface": "#1d1c1a",
      "c-line": "rgba(255,255,255,.12)",
      "c-bg-alt": "#ece6da",
      "c-fg-alt": "#111110",
      "space-section": "clamp(120px, 18vh, 220px)",
      radius: "2px",
    },
    motion: {
      ease: { out: "power2.out", inOut: "sine.inOut", back: "power2.inOut", elastic: "power3.out" },
      speed: 1.5,
      scrub: 1.2,
    },
    scroll: { lerp: 0.06 },
  },
  {
    id: "pop",
    name: "팝",
    tokens: {
      "font-display": "'Futura', 'Avenir Next Condensed', 'Apple SD Gothic Neo', sans-serif",
      "font-body": "'Avenir Next', -apple-system, 'Apple SD Gothic Neo', sans-serif",
      "display-weight": "800",
      "display-style": "normal",
      "display-tracking": "-0.02em",
      "c-bg": "#fff1d6",
      "c-fg": "#1b1b1b",
      "c-muted": "#7a6a55",
      "c-accent": "#ff4d2e",
      "c-surface": "#fffaf0",
      "c-line": "rgba(0,0,0,.14)",
      "c-bg-alt": "#1b1b1b",
      "c-fg-alt": "#fff1d6",
      "space-section": "clamp(80px, 12vh, 150px)",
      radius: "36px",
    },
    motion: {
      ease: { out: "back.out(1.8)", inOut: "power3.inOut", back: "back.inOut(2.5)", elastic: "elastic.out(1,0.35)" },
      speed: 0.7,
      scrub: true,
    },
    scroll: { duration: 0.8, easing: "cubic", wheel: 1.2 },
  },
  drake,
  dapper,
  chimp,
  aesop,
  linear,
];
