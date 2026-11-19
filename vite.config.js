import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const okName = (s) => /^[\w-]+$/.test(s);
const okFile = (s) => /^[\w.-]+$/.test(s);
const capDir = (name) => path.join(process.cwd(), "clones", name, "_capture");

// 복제 도구(개발용): 저장·원본 받기·원본 HTML 그대로 보내기
const cloneTools = () => ({
  name: "clone-tools",
  configureServer(server) {
    // localhost 화면에서 만든 내용 저장: POST /__clone-save?name=&file=
    server.middlewares.use("/__clone-save", (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Private-Network", "true");
      if (req.method === "OPTIONS") { res.end(); return; }
      const u = new URL(req.url, "http://x");
      const name = u.searchParams.get("name") || "", file = u.searchParams.get("file") || "";
      if (req.method !== "POST" || !okName(name) || !okFile(file)) { res.statusCode = 400; res.end("bad"); return; }
      fs.mkdirSync(capDir(name), { recursive: true });
      const chunks = []; req.on("data", (c) => chunks.push(c));
      req.on("end", () => { const b = Buffer.concat(chunks); fs.writeFileSync(path.join(capDir(name), file), b); res.end("saved " + b.length); });
    });
    // 이 PC가 원본을 직접 받아 저장: GET /__clone-fetch?name=&file=&url=
    server.middlewares.use("/__clone-fetch", async (req, res) => {
      const u = new URL(req.url, "http://x");
      const name = u.searchParams.get("name") || "", file = u.searchParams.get("file") || "", url = u.searchParams.get("url") || "";
      if (!okName(name) || !okFile(file) || !/^https?:\/\//.test(url)) { res.statusCode = 400; res.end("bad"); return; }
      try {
        const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36" } });
        const b = Buffer.from(await r.arrayBuffer());
        fs.mkdirSync(capDir(name), { recursive: true });
        fs.writeFileSync(path.join(capDir(name), file), b);
        res.setHeader("content-type", "text/plain; charset=utf-8");
        res.end(`saved ${b.length} (status ${r.status})`);
      } catch (e) { res.statusCode = 502; res.end(String(e)); }
    });
    // 원본 서버가 다른 주소에서의 사용을 막는 파일(글꼴 등)을 이 PC가 대신 받아 같은 주소로 보낸다
    // 예: /__clone-proxy/madewithgsap.com/assets/t/Font.woff → https://madewithgsap.com/assets/t/Font.woff
    const proxyCache = new Map();
    server.middlewares.use("/__clone-proxy/", async (req, res) => {
      const m = req.url.match(/^\/?([\w.-]+\.[a-z]{2,})(\/[^#]*)$/i);
      if (!m) { res.statusCode = 400; res.end("bad"); return; }
      const url = `https://${m[1]}${m[2]}`;
      try {
        let hit = proxyCache.get(url);
        if (!hit) {
          const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/130 Safari/537.36" } });
          hit = { status: r.status, type: r.headers.get("content-type") || "application/octet-stream", body: Buffer.from(await r.arrayBuffer()) };
          if (r.ok) proxyCache.set(url, hit);
        }
        res.statusCode = hit.status;
        res.setHeader("content-type", hit.type);
        res.setHeader("access-control-allow-origin", "*");
        res.setHeader("cache-control", "max-age=3600");
        res.end(hit.body);
      } catch (e) { res.statusCode = 502; res.end(String(e)); }
    });
    // deltacafes 복제본: 원본이 /_scripts/ 로 부르는 분석 스크립트(GTM → 쿠키 배너·gtag·umami)는 빈 파일로 막는다
    server.middlewares.use("/_scripts/", (req, res) => {
      res.setHeader("content-type", "application/javascript");
      res.end("/* 복제본: 분석 스크립트 차단 */");
    });
    // /clones/이름 → /clones/이름/ (한 단계 하위 폴더 /clones/이름/섹션/ 도 지원), data-clone 표시가 있는 index.html은 아무것도 덧붙이지 않고 그대로 보낸다
    server.middlewares.use((req, res, next) => {
      const m = req.url.match(/^\/clones\/([\w-]+(?:\/[\w-]+)?)(\/?)(\?.*)?$/);
      if (!m) return next();
      if (!m[2]) { res.statusCode = 301; res.setHeader("Location", `/clones/${m[1]}/${m[3] || ""}`); res.end(); return; }
      const f = path.join(process.cwd(), "clones", m[1], "index.html");
      if (!fs.existsSync(f)) return next();
      const html = fs.readFileSync(f, "utf8");
      if (!html.includes("data-clone=")) return next();
      res.setHeader("content-type", "text/html; charset=utf-8");
      res.setHeader("cache-control", "no-store");
      res.end(html);
    });
  },
});

export default defineConfig({
  plugins: [react(), cloneTools()],
  server: {
    port: 5173,
    strictPort: true,
    // breakthroughenergy 복제본: 원본이 "/assets/…"로 부르는 앱 파일·글꼴·영상을 원본 서버에서 받아 온다
    proxy: {
      "/assets": { target: "https://www.breakthroughenergy.org", changeOrigin: true },
      // deltacafes 복제본(Nuxt): 앱 파일·이미지·글꼴·Rive·번역·페이지 데이터를 원본 서버에서 받아 온다
      ...Object.fromEntries(["^/_nuxt/", "^/_vercel/image", "^/_i18n/", "^/imgs/", "^/rives/", "^/fonts/", "^/en/_payload", "^/pt/_payload"]
        .map((k) => [k, { target: "https://deltacafes.com", changeOrigin: true }])),
    },
  },
});
