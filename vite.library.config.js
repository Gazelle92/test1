// 모듈 창고를 hm-office(매니저)에 올리기 위한 빌드 설정
//   npm run build:library → ../Schedule_app/public/module-lib/ 에 창고·미리보기·조립(무드) 화면 + 원본 섹션을 만든다
//   실서버 주소: https://hm-office.vercel.app/manager/modules (매니저 로그인 필요)
//   원본 섹션(clones/)은 내부 참고용으로 함께 올린다(2026-11-18 실장님). 원본 앱 파일은 hm-office vercel.json이 원본 서버에서 받아 온다.
import { defineConfig } from "vite";
import { resolve, join } from "node:path";
import fs from "node:fs";

const OUT = resolve(__dirname, "../Schedule_app/public/module-lib");
const SITES = ["jeskojets", "madewithgsap", "breakthroughenergy", "deltacafes"];

// 원본 섹션 페이지마다 넣는 것
//  - 입장 확인: 매니저 로그인도 모듈 창고 전용 비밀번호도 없으면 창고 입장 화면(/manager/modules)으로
//  - deltacafes: 원본은 Vercel 이미지 최적화(/_vercel/image?url=…)로 사진을 부르는데, 매니저(hm-office)에는 그 기능이 없어
//    대신 받기(/__clone-proxy/)로 부르게 바꿈(사진을 WebGL로 그려서 원본 주소로 바로 부르면 CORS로 막힘)
const GATE = '<script data-clone="gate">fetch("/api/session?scope=modules").then(function(r){return r.json()}).catch(function(){return{}}).then(function(s){if(!s.loggedIn)top.location.replace("/manager/modules")});</script>';
const VIMG = '<script data-clone="vimg">(function(){var R=/\\/_vercel\\/image\\?url=([^&]+)[^ ,"]*/g;function fix(v){if(!v)return v;if(v.indexOf("/_vercel/image")>-1)v=v.replace(R,function(_,u){return decodeURIComponent(u).replace(/^https:\\/\\//,"/__clone-proxy/")});return v.replace(/https:\\/\\/cdn\\.sanity\\.io\\//g,"/__clone-proxy/cdn.sanity.io/")}' +
  'function el(n){if(n.nodeType!==1)return;["src","srcset"].forEach(function(a){var v=n.getAttribute(a);var f=fix(v);if(f!==v)n.setAttribute(a,f)});if(n.querySelectorAll)n.querySelectorAll("img,source").forEach(el)}' +
  'new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==="attributes")el(m.target);else m.addedNodes.forEach(el)})}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["src","srcset"]})})();</script>';

function copyClones() {
  return {
    name: "copy-clones",
    closeBundle() {
      let n = 0;
      for (const site of SITES) {
        const src = resolve(__dirname, "clones", site);
        const pages = ["", ...fs.readdirSync(src).filter((d) => /^\d\d-/.test(d))];
        for (const p of pages) {
          let html = fs.readFileSync(join(src, p, "index.html"), "utf8");
          if (site === "deltacafes") {
            html = html.replace(/\/_vercel\/image\?url=([^&"'\s]+)(?:&amp;[^"'\s,]*|&[^"'\s,]*)?/g, (_, u) => decodeURIComponent(u).replace(/^https:\/\//, "/__clone-proxy/"));
            html = html.replace(/(src|srcset)="https:\/\/cdn\.sanity\.io\//g, '$1="/__clone-proxy/cdn.sanity.io/');
            html = html.replace("</head>", VIMG + "</head>");
          }
          html = html.replace("</head>", GATE + "</head>");
          const dir = join(OUT, "clones", site, p);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(join(dir, "index.html"), html);
          n++;
        }
      }
      console.log(`원본 섹션 페이지 ${n}개를 module-lib/clones/ 에 넣음`);
    },
  };
}

export default defineConfig({
  base: "/module-lib/",
  plugins: [copyClones()],
  build: {
    outDir: OUT,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        library: resolve(__dirname, "pages/library/index.html"),
        preview: resolve(__dirname, "pages/preview/index.html"),
        compose: resolve(__dirname, "pages/compose/index.html"),
      },
    },
  },
});
