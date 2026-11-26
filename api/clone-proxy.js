// 원본 서버가 다른 주소에서의 사용을 막는 파일(글꼴·사진 등)을 대신 받아 같은 주소로 돌려준다.
// 개발 서버의 /__clone-proxy/ 와 같은 역할. vercel.json이 /__clone-proxy/{host}/{path} → 여기(?u={host}/{path})로 넘긴다.
// 아무 사이트나 대신 받는 열린 통로가 되지 않게, 복제본이 실제로 쓰는 서버만 허용한다.
const ALLOW = new Set([
  "madewithgsap.com",
  "cdn.sanity.io",
  "burospaces1.fra1.cdn.digitaloceanspaces.com",
  "deltacafes.com",
  "www.breakthroughenergy.org",
  "cdn.prod.website-files.com",
  "assets.slater.app",
  // mix-01 한 페이지
  "trionn.com",
  "apekon.com",
  "www.focusindustries.tech",
]);

export default async function handler(req, res) {
  const q = new URL(req.url, "http://x").searchParams;
  const p = (q.get("u") || "").replace(/^\/+/, "");
  const host = p.split("/")[0];
  if (!ALLOW.has(host) || !/^[\w.-]+\/[^#]*$/.test(p)) {
    res.statusCode = 400;
    res.end("bad");
    return;
  }
  q.delete("u");
  const rest = q.toString();
  const url = `https://${p}${rest ? "?" + rest : ""}`;
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/130 Safari/537.36" } });
    const body = Buffer.from(await r.arrayBuffer());
    res.statusCode = r.status;
    res.setHeader("content-type", r.headers.get("content-type") || "application/octet-stream");
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("cache-control", r.ok ? "public, max-age=86400, s-maxage=604800" : "no-store");
    res.end(body);
  } catch (e) {
    res.statusCode = 502;
    res.end(String(e));
  }
}
