// 3단계 · 처음에 미리 불러오기: 화면에 쓰이는 것을 모두 받아 둔 뒤 시작한다(시작 뒤에는 끊김 없이).
// 기다리는 것: 글꼴 · 섹션 안 이미지(지연 로딩도 미리) · 문서 load · apekon 원본 준비(body.loaded) · trionn 3D 심볼
const html = document.documentElement;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const until = (test, ms = 15000) => new Promise((res) => { const t0 = performance.now(); (function tick() { if (test() || performance.now() - t0 > ms) return res(); setTimeout(tick, 80); })(); });

export async function preload({ roots, extra = [], minMs = 900, maxMs = 20000 } = {}) {
  const el = document.getElementById("mx-pre");
  const num = el?.querySelector(".n"), bar = el?.querySelector(".bar i"), lab = el?.querySelector(".t");
  const t0 = performance.now();
  // 덮개가 있는 동안 휠·터치·키 스크롤을 막는다(원본 스크립트가 Lenis를 다시 켜도 밑에서 스크롤되지 않게)
  addEventListener("wheel", block, { capture: true, passive: false }); addEventListener("touchmove", block, { capture: true, passive: false }); addEventListener("keydown", blockKey, { capture: true });

  // 섹션 안 이미지·영상은 지연 로딩이어도 지금 받는다
  const imgs = roots.flatMap((r) => [...r.querySelectorAll("img")]);
  imgs.forEach((i) => { if (i.loading === "lazy") i.loading = "eager"; });
  roots.flatMap((r) => [...r.querySelectorAll("video")]).forEach((v) => { v.preload = "auto"; });
  const imgDone = () => imgs.filter((i) => i.complete).length;

  // 단계와 비중(합 1)
  const steps = [
    { name: "Fonts", w: 0.15, p: document.fonts.ready },
    { name: "Assets", w: 0.25, p: document.readyState === "complete" ? Promise.resolve() : new Promise((r) => addEventListener("load", r, { once: true })) },
    { name: "Scene", w: 0.2, p: until(() => document.body.classList.contains("loaded")) },
    ...extra,
  ];
  const IMG_W = 1 - steps.reduce((s, x) => s + x.w, 0);
  steps.forEach((s) => { s.done = false; Promise.resolve(s.p).catch(() => {}).finally(() => { s.done = true; }); });

  let shown = 0, target = 0, finished = false;
  const draw = () => {
    const img = imgs.length ? imgDone() / imgs.length : 1;
    target = steps.reduce((a, s) => a + (s.done ? s.w : 0), 0) + IMG_W * img;
    if (finished) target = 1;
    shown += (target - shown) * 0.12; if (target - shown < 0.002) shown = target;
    const pct = Math.round(shown * 100);
    if (num) num.textContent = pct; if (bar) bar.style.transform = `scaleX(${shown})`;
    const cur = steps.find((s) => !s.done); if (lab) lab.textContent = cur ? `Loading ${cur.name}` : "Ready";
    if (!(finished && shown >= 1)) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);

  await Promise.race([
    Promise.all([...steps.map((s) => Promise.resolve(s.p).catch(() => {})), until(() => imgDone() === imgs.length), wait(minMs)]),
    wait(maxMs),
  ]);
  // 이미지 해독까지 끝내 두면 첫 스크롤에서 버벅이지 않는다
  await Promise.all(imgs.map((i) => i.decode?.().catch(() => {})));
  finished = true;
  await until(() => shown >= 1, 1500);
  return { ms: Math.round(performance.now() - t0), images: imgs.length, timedOut: performance.now() - t0 >= maxMs };
}

function block(e) { e.preventDefault(); e.stopImmediatePropagation(); }
function blockKey(e) { if ([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) block(e); }

// 덮개를 걷고 스크롤을 연다
export async function reveal() {
  const el = document.getElementById("mx-pre");
  el?.classList.add("done");
  html.classList.remove("mx-preloading");
  removeEventListener("wheel", block, { capture: true }); removeEventListener("touchmove", block, { capture: true }); removeEventListener("keydown", blockKey, { capture: true });
  await wait(650); el?.remove();
}
