// 2단계 · 그리드 통일 — 원본 레이아웃 그리드(12칸·6칸)를 공통 칸 수(--g-cols: 12/8/4)로 옮긴다.
// 방법: 공통 규칙을 잠깐 끄고 원본 상태에서 각 칸 그리드와 자식이 몇 번째 칸부터 몇 칸을 쓰는지 화면 위치로 잰다
//       → 같은 비율로 새 칸 수에 옮겨 적는다. 클래스(col-span-*)를 읽지 않으므로 어떤 사이트 CSS에도 똑같이 쓴다.
const html = document.documentElement;
const N = () => parseInt(getComputedStyle(html).getPropertyValue("--g-cols")) || 12;

function tracksOf(cs) { return cs.gridTemplateColumns.split(" ").map(parseFloat).filter((n) => n > 0); }

function edgesOf(list, start, gap) { const e = []; let x = start; for (const w of list) { e.push([x, x + w]); x += w + gap; } return e; }
function nearest(edges, v, side) { let i = 0, d = 1e9; edges.forEach((e, k) => { const dd = Math.abs(e[side] - v); if (dd < d) { d = dd; i = k; } }); return i; }

function measure(roots) {
  const jobs = [];
  for (const root of roots) for (const c of root.querySelectorAll("*")) {
    const cs = getComputedStyle(c);
    if (cs.display !== "grid" && cs.display !== "inline-grid") continue;
    const tr = tracksOf(cs); const O = tr.length;
    if (O !== 6 && O !== 12) continue;                          // 레이아웃 그리드만 (카드 안 2칸 같은 부품 그리드는 그대로)
    const r = c.getBoundingClientRect(); if (r.width < innerWidth * 0.6) continue;
    const cols = edgesOf(tr, r.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), parseFloat(cs.columnGap) || 0);
    const rows = edgesOf(cs.gridTemplateRows.split(" ").map(parseFloat).filter((n) => n >= 0), r.top + parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth), parseFloat(cs.rowGap) || 0);
    const kids = [];
    for (const k of c.children) {
      // 등장 모션 중(scaleX 0, 이동 중)이어도 원래 자리로 재려고 자기 transform만 잠깐 끈다
      const st = k.style, keep = [st.transform, st.translate, st.scale, st.rotate];
      st.setProperty("transform", "none", "important"); st.setProperty("translate", "none", "important"); st.setProperty("scale", "none", "important"); st.setProperty("rotate", "none", "important");
      const kr = k.getBoundingClientRect();
      st.transform = keep[0]; st.translate = keep[1]; st.scale = keep[2]; st.rotate = keep[3];
      if (!kr.width && !kr.height) continue;
      const pos = getComputedStyle(k).position; if (pos === "absolute" || pos === "fixed") continue;
      const a = nearest(cols, kr.left, 0), b = nearest(cols, kr.right, 1);
      const ra = rows.length ? nearest(rows, kr.top, 0) : 0, rb = rows.length ? nearest(rows, kr.bottom, 1) : 0;
      kids.push({ k, a, s: Math.max(1, b - a + 1), w: kr.width, row: ra, rs: Math.max(1, rb - ra + 1) });
    }
    jobs.push([c, O, kids]);
  }
  return jobs;
}

// 원본 칸 → 새 칸: ① 원본보다 좁아지지 않게(같은 화면 폭에서 원본 폭 이상이 되는 가장 작은 칸 수)
// ② 오른쪽 끝에 붙어 있던 것은 오른쪽 끝에, 나머지는 원래 왼쪽 위치에 가장 가까운 칸에서 시작 ③ 원래 줄(row)은 그대로
// ④ 같은 줄에서 겹치면 뒤 요소를 밀고, 넘치면 줄인다
function remap(c, O, kids, n) {
  const cs = getComputedStyle(c), r = c.getBoundingClientRect();
  const gap = parseFloat(cs.columnGap) || 0, cw = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const col = (cw - gap * (n - 1)) / n;
  const out = []; const byRow = {};
  for (const it of kids) {
    let span, start;
    if (it.s >= O) { span = n; start = 1; }
    else {
      span = Math.max(Math.round((it.s * n) / O), 1);
      while (span < n && span * col + (span - 1) * gap < it.w * 0.98) span++;   // 원본보다 좁아지지 않게
      start = it.a + it.s >= O ? n - span + 1 : Math.round((it.a * n) / O) + 1;
      start = Math.min(Math.max(1, start), n - span + 1);
    }
    out.push({ ...it, start, span });
  }
  for (const o of out) (byRow[o.row] ??= []).push(o);
  for (const row of Object.values(byRow)) {
    row.sort((x, y) => x.a - y.a);
    if (row.some((o) => o.span === n)) continue;
    // 넘치면 가장 넓은 것부터 한 칸씩 줄임
    while (row.reduce((t, o) => t + o.span, 0) > n) { const w = row.reduce((m, o) => (o.span > m.span ? o : m)); w.span--; }
    // 오른쪽부터 겹치지 않게 왼쪽으로 당김 → 왼쪽 끝을 넘으면 다시 오른쪽으로 밈
    let limit = n;
    for (let i = row.length - 1; i >= 0; i--) { const o = row[i]; if (o.start + o.span - 1 > limit) o.start = limit - o.span + 1; limit = o.start - 1; }
    let end = 0;
    for (const o of row) { if (o.start <= end) o.start = end + 1; end = o.start + o.span - 1; }
  }
  return out;
}

let last = "";
export function applyGrid(roots, on = true) {
  for (const e of document.querySelectorAll("[data-g]")) { e.style.removeProperty("grid-template-columns"); e.style.removeProperty("column-gap"); e.removeAttribute("data-g"); }
  for (const e of document.querySelectorAll("[data-gc]")) { e.style.removeProperty("grid-column"); e.style.removeProperty("grid-row"); e.removeAttribute("data-gc"); }
  html.classList.remove("mxg");
  if (!on) return;
  const jobs = measure(roots);                                   // 원본 상태에서 잼
  html.classList.add("mxg");
  const n = N(); last = n + "|" + innerWidth;
  for (const [c, O, kids] of jobs) {
    c.setAttribute("data-g", "");
    c.style.setProperty("grid-template-columns", `repeat(${n}, minmax(0, 1fr))`, "important");
    c.style.setProperty("column-gap", "var(--g-gap)", "important");
    for (const o of remap(c, O, kids, n)) {
      o.k.setAttribute("data-gc", "");
      o.k.style.setProperty("grid-column", `${o.start} / span ${o.span}`, "important");
      o.k.style.setProperty("grid-row", `${o.row + 1} / span ${o.rs}`, "important");
    }
  }
  return jobs.length;
}

export function initGrid(roots, { on = true, onChange } = {}) {
  if (new URLSearchParams(location.search).get("grid") === "1") html.classList.add("mxg-show");
  const run = () => { const n = applyGrid(roots, on); onChange?.(n); };
  run();
  let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => { if (N() + "|" + innerWidth !== last) run(); }, 150); });
  return run;
}
