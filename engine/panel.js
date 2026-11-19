// 미리보기용 작은 조작판: 테마 전환 + 모듈 출처 표시
export function mountPanel(engine, themes) {
  const css = document.createElement("style");
  css.textContent = `#cl-panel{position:fixed;z-index:100;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;padding:12px;border-radius:12px;background:rgba(20,20,20,.88);color:#fff;font:13px/1.4 -apple-system,'Apple SD Gothic Neo',sans-serif;backdrop-filter:blur(8px)}
#cl-panel .row{display:flex;gap:6px}#cl-panel button{padding:7px 12px;border:1px solid rgba(255,255,255,.25);border-radius:8px;background:transparent;color:#fff;font:inherit;cursor:pointer}
#cl-panel button.on{background:#fff;color:#111}#cl-panel small{opacity:.65}#cl-panel label{display:flex;gap:6px;align-items:center;cursor:pointer}`;
  document.head.appendChild(css);
  const p = document.createElement("div");
  p.id = "cl-panel";
  p.innerHTML = `<div class="row"></div><small></small><label><input type="checkbox"> 모듈 출처 표시</label>`;
  document.body.appendChild(p);
  const row = p.querySelector(".row"), info = p.querySelector("small");
  const paint = () => {
    const t = engine.theme;
    row.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.id === t.id));
    const s = t.scroll.lerp ? `스크롤 lerp ${t.scroll.lerp}` : `스크롤 ${t.scroll.duration}초`;
    info.textContent = `${s} · 움직임 배율 ${t.motion.speed} · ${t.motion.ease.out}`;
  };
  themes.forEach((t) => {
    const b = document.createElement("button");
    b.textContent = t.name; b.dataset.id = t.id;
    b.onclick = () => {
      engine.setTheme(t.id);
      const u = new URL(location.href); u.searchParams.set("theme", t.id); history.replaceState(null, "", u);
      paint();
    };
    row.appendChild(b);
  });
  p.querySelector("input").onchange = (e) => document.documentElement.classList.toggle("show-source", e.target.checked);
  paint();
}
