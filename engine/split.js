// 글자 단위로 나누기(단어는 줄바꿈되지 않게 묶음). 나눈 글자 span 배열을 돌려준다.
export function split(el) {
  const text = el.textContent;
  el.textContent = "";
  el.setAttribute("aria-label", text);
  const chars = [];
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(" ")); return; }
    const w = document.createElement("span");
    w.className = "w";
    w.style.cssText = "display:inline-block;white-space:nowrap";
    w.setAttribute("aria-hidden", "true");
    for (const ch of part) {
      const c = document.createElement("span");
      c.className = "c";
      c.style.display = "inline-block";
      c.textContent = ch;
      w.appendChild(c);
      chars.push(c);
    }
    el.appendChild(w);
  });
  return chars;
}
