// 3단계 · 애니메이션 중 부담 줄이기 (원본 코드는 고치지 않음)
// ① 화면 밖 섹션의 캔버스는 그리지 않는다: 섹션 상자([data-mx])가 화면(위아래 25% 여유) 밖이면 그 안 캔버스의 그리기 호출을 건너뛴다.
//    원본 루프는 계속 돌지만 GPU 그리기가 멈추고, 화면에 들어오면 다음 프레임부터 그대로 다시 그린다.
// ② 숨긴 캔버스(display:none 안쪽)는 로딩이 끝난 뒤 1.5초 넘게 숨어 있으면 1×1로 줄여 메모리를 비운다(다시 보이면 원래 크기로).
// ③ visibility:hidden 안쪽 캔버스(원본 로딩 화면 등)는 보이지 않으므로 그리지 않는다.
const paused = new WeakSet();
const offSecs = new Set();
const drawn = new Map(); // 실제로 그린 호출 수(확인용: window.__mxPerf.drawn())

function wrap(proto, names) {
  for (const m of names) {
    const o = proto && proto[m]; if (!o || o.__mx) continue;
    const f = function (...a) { const c = this.canvas; if (paused.has(c)) return; if (m !== "clear") drawn.set(c, (drawn.get(c) || 0) + 1); return o.apply(this, a); };
    f.__mx = true; proto[m] = f;
  }
}
wrap(window.WebGLRenderingContext?.prototype, ["drawArrays", "drawElements", "clear"]);
wrap(window.WebGL2RenderingContext?.prototype, ["drawArrays", "drawElements", "drawArraysInstanced", "drawElementsInstanced", "drawRangeElements", "clear"]);

// 그 캔버스가 지금 보일 수 있나: display:none 안쪽(none) · visibility:hidden 안쪽(inv)
function state(c) {
  let none = false, inv = false;
  for (let x = c; x && x !== document.documentElement; x = x.parentElement) {
    const st = getComputedStyle(x); if (st.display === "none") { none = true; break; } if (st.visibility === "hidden") inv = true;
  }
  return { none, inv: inv || !c.isConnected };
}
let freeOK = false; // 로딩이 끝난 뒤에만 메모리를 비운다(로딩 중 잠깐 숨는 캔버스를 잘못 줄이지 않게)

function refresh(canvases) {
  const now = Date.now();
  for (const c of canvases) {
    const sec = c.closest("[data-mx]"), { none, inv } = state(c);
    if ((sec && offSecs.has(sec)) || none || inv) paused.add(c); else paused.delete(c);
    if (freeOK && none) {
      // 1.5초 넘게 계속 숨어 있으면 그리기 버퍼를 1×1로 (원래 크기는 기억)
      if (!c.dataset.mxHid) c.dataset.mxHid = String(now);
      else if (now - +c.dataset.mxHid > 1500 && !c.dataset.mxFreed && c.width * c.height > 1) {
        c.dataset.mxW = c.width; c.dataset.mxH = c.height; c.width = 1; c.height = 1; c.dataset.mxFreed = "1";
      }
    } else {
      delete c.dataset.mxHid;
      if (c.dataset.mxFreed) { // 다시 보이게 되면 원래 크기로 되돌리고 원본이 다시 그리게 한다
        c.width = +c.dataset.mxW; c.height = +c.dataset.mxH; delete c.dataset.mxFreed; dispatchEvent(new Event("resize"));
      }
    }
  }
}

// 확인용(끈 상태에서도 쓸 수 있게 모듈에 둔다)
{ const all = () => [...document.querySelectorAll("canvas")];
  window.__mxPerf = { drawn: (reset) => { const r = all().map((c, i) => [i, drawn.get(c) || 0]).filter((x) => x[1]); if (reset) drawn.clear(); return r; }, paused: () => all().map((c, i) => [i, c.closest("[data-mx]")?.dataset.mx || "-", paused.has(c) ? "멈춤" : "그림", c.width + "x" + c.height]) };
}

export function initPerf(sections) {
  const all = () => [...document.querySelectorAll("canvas")];
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) offSecs.delete(e.target); else offSecs.add(e.target); });
    refresh(all());
  }, { rootMargin: "25% 0px 25% 0px" });
  sections.forEach((s) => io.observe(s));
  // 원본 스크립트가 나중에 만드는 캔버스·크기 변경도 따라간다
  new MutationObserver(() => refresh(all())).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["width", "height"] });
  refresh(all());
}

// 섹션이 화면 안에 있을 때만 true (마키처럼 우리가 거는 루프용)
// 로딩 화면이 걷힌 뒤 부른다: 이때부터 숨은 캔버스 메모리를 비운다
export function enableFree() {
  freeOK = true;
  const all = () => [...document.querySelectorAll("canvas")];
  refresh(all()); setTimeout(() => refresh(all()), 1700); setTimeout(() => refresh(all()), 4000);
}

export function onScreen(el, margin = "10%") {
  const st = { on: true };
  new IntersectionObserver(([e]) => { st.on = e.isIntersecting; }, { rootMargin: `${margin} 0px ${margin} 0px` }).observe(el);
  return st;
}
