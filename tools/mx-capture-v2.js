// 한 페이지 조립용 캡처(개발용): 원본 복제본 페이지(localhost)에서 실행한다.
// 섹션 루트들의 원본 HTML(서버가 보낸 그대로, 스크립트 제외)과, 그 섹션에 쓰이는 CSS만 뽑아
// 모든 선택자를 [data-mx="이름"] 아래로 가둔 뒤 clones/one/_capture/{이름}.html · .css 로 저장한다.
// rem 은 원본 html 글자 크기 기준이라 calc(N * var(--mxrem)) 로 바꾸고, --mxrem 에 원본 html 글자 크기를 넣는다.
// 원본 파일 주소는 /__clone-proxy/{host}/… 로 바꾼다(어느 페이지에서도 원본 서버에서 받아짐).
window.__mxCapture = async function ({ name, roots, origin }) {
  const scope = `[data-mx="${name}"]`;
  const els = roots.flatMap((s) => [...document.querySelectorAll(s)]);
  const inRoots = (sel) => { try { return [...document.querySelectorAll(sel)].some((e) => els.some((r) => r === e || r.contains(e) || e.contains(r))); } catch { return false; } };
  const strip = (s) => s.replace(/::?(before|after|placeholder|selection|marker|backdrop|-webkit-[a-z-]+|-moz-[a-z-]+)(\([^)]*\))?/g, "")
    .replace(/:(hover|focus|active|focus-visible|visited|focus-within|checked|disabled|first-child|last-child|nth-child\([^)]*\)|not\([^)]*\))/g, "");
  const oHost = new URL(origin).host;
  const prox = (u, base) => { try { const a = new URL(u, base); if (!/^https?:$/.test(a.protocol)) return u;
    if (a.origin === location.origin) { if (/^\/(__clone-proxy|clones|@|node_modules)\//.test(a.pathname)) return a.pathname + a.search; return `/__clone-proxy/${oHost}${a.pathname}${a.search}`; }
    return `/__clone-proxy/${a.host}${a.pathname}${a.search}`; } catch { return u; } };
  const fixUrls = (css, base) => css.replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, u) => (u.startsWith("data:") ? m : `url("${prox(u, base)}")`));
  const remFix = (css) => css.replace(/(-?\d*\.?\d+)rem\b/g, (m, n) => `calc(${n} * var(--mxrem))`);
  let htmlFont = "";
  const isBody = (p) => { try { const b = strip(p).trim(); return !!b && !/^[*:]/.test(b) && !/::?(before|after)/.test(p) && (document.body.matches(b) || document.documentElement.matches(b)); } catch { return false; } };
  const rewriteSel = (sel) => sel.split(",").map((p) => {
    p = p.trim();
    if (isBody(p)) return scope;
    if (/^(:root|html|body|:host)(?![\w-])/.test(p)) return p.replace(/^(:root|html|body|:host)(\s*>?\s*body)?/, scope);
    if (/^(html|body)\s/.test(p)) return p.replace(/^(html|body)\s+/, scope + " ");
    return `${scope} ${p}`;
  }).join(",");
  const keepRule = (sel) => sel.split(",").some((p) => { const b = strip(p).trim(); if (isBody(p)) return true; if (!b || /^(:root|html|body|:host|\*)$/.test(b) || /^(html|body|:root)\b/.test(b)) return true; return inRoots(b); });
  const out = [], fonts = [], kfs = new Map();
  const walk = (rules, base) => {
    const o = [];
    for (const r of rules) {
      const k = r.constructor.name;
      if (k === "CSSImportRule") { try { o.push(...walk(r.styleSheet.cssRules, r.href)); } catch {} }
      else if (k === "CSSStyleRule") {
        if (!keepRule(r.selectorText)) continue;
        if (/^(html|:root)$/.test(r.selectorText.trim()) && r.style.fontSize) htmlFont = r.style.fontSize;
        let body = r.cssText.slice(r.cssText.indexOf("{"));
        o.push(rewriteSel(r.selectorText) + body);
      } else if (k === "CSSFontFaceRule") fonts.push(fixUrls(r.cssText, base));
      else if (k === "CSSKeyframesRule") kfs.set(r.name, r.cssText);
      else if (k === "CSSPropertyRule" || k === "CSSLayerStatementRule") o.push(r.cssText);
      else if (r.cssRules) { const head = r.cssText.slice(0, r.cssText.indexOf("{")).trim(); const inner = walk(r.cssRules, base); if (inner.length) o.push(head + "{" + inner.join("\n") + "}"); }
    }
    return o;
  };
  for (const sh of document.styleSheets) { try { out.push(...walk(sh.cssRules, sh.href || location.href)); } catch { console.warn("못 읽은 CSS", sh.href); } }
  const used = new Set();
  for (const e of els.flatMap((r) => [r, ...r.querySelectorAll("*")])) { const c = getComputedStyle(e); (c.animationName || "").split(",").forEach((n) => used.add(n.trim())); }
  let css = `/* ${name}: ${origin} 원본 CSS(이 섹션에 쓰이는 규칙만) */\n${scope}{--mxrem:${htmlFont || "16px"}}\n` + fonts.join("\n") + "\n" + out.join("\n") + "\n" + [...kfs].filter(([n]) => used.has(n)).map(([, t]) => t).join("\n");
  css = remFix(fixUrls(css, location.href));
  // 원본 HTML(서버가 보낸 것)
  const raw = await fetch(location.href).then((r) => r.text());
  const d = new DOMParser().parseFromString(raw, "text/html");
  const parts = roots.flatMap((s) => [...d.querySelectorAll(s)]);
  parts.forEach((p) => {
    p.querySelectorAll("script,noscript,template").forEach((x) => x.remove());
    p.querySelectorAll("[src],[href],[poster],[srcset],[data-src]").forEach((x) => {
      for (const a of ["src", "href", "poster", "data-src"]) if (x.hasAttribute(a) && !x.getAttribute(a).startsWith("#") && !x.getAttribute(a).startsWith("mailto")) x.setAttribute(a, prox(x.getAttribute(a), origin + "/"));
      if (x.hasAttribute("srcset")) x.setAttribute("srcset", x.getAttribute("srcset").split(",").map((s) => { const [u, w] = s.trim().split(/\s+/); return prox(u, origin + "/") + (w ? " " + w : ""); }).join(", "));
    });
    p.querySelectorAll("[style]").forEach((x) => x.setAttribute("style", fixUrls(x.getAttribute("style"), origin + "/")));
  });
  const html = parts.map((p) => p.outerHTML.replace(/<!--[\s\S]*?-->/g, "")).join("\n");
  const save = (file, body) => fetch(`/__clone-save?name=one&file=${file}`, { method: "POST", body }).then((r) => r.text());
  return { css: await save(`${name}.css`, css), html: await save(`${name}.html`, html), htmlFont, rules: out.length, fonts: fonts.length };
};
