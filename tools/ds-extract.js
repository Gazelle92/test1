/*
 * 디자인 시스템 추출기 (DSX)
 * 레퍼런스 사이트의 개발자 도구 콘솔에 이 파일 내용을 통째로 붙여 넣고 실행한다.
 *
 *   DSX.collect()   지금 페이지를 측정해 쌓는다 (같은 사이트의 여러 페이지·여러 화면 폭을 쌓을 수 있음)
 *   DSX.report()    쌓은 측정값을 묶어 초안 디자인 시스템을 만든다 (콘솔에 요약 출력)
 *   DSX.json()      결과 JSON 문자열 → /pages/ds-extract/ 에 붙여 넣으면 화면으로 본다
 *   DSX.clear()     쌓은 측정값 지우기
 *
 * 원칙
 *  - 빈도가 아니라 "화면을 얼마나 차지하는가"(면적·글자 수)로 가중치를 준다.
 *  - 사진·영상 위 면적은 색 계산에서 뺀다(이미지 톤은 따로 센다).
 *  - 쿠키 배너·팝업·채팅 위젯은 측정에서 뺀다.
 *  - 원본 CSS 변수(디자인 토큰)가 있으면 먼저 모아 근거로 쓴다.
 */
(() => {
  const KEY = "__dsx_pages";
  const EXCL = [
    "[id*=cookie i]", "[class*=cookie i]", "[id*=consent i]", "[class*=consent i]", "[id*=onetrust i]",
    "[class*=gdpr i]", "[role=dialog]", "[aria-modal=true]", "[class*=modal i]", "[class*=popup i]",
    "[id*=intercom i]", "[class*=intercom i]", "[id*=hubspot i]", "[class*=chat-widget i]", "iframe",
  ].join(",");

  // ---------- 색 ----------
  let cx = null;
  const colorCache = new Map();
  function rgba(str) {
    if (!str || str === "transparent" || str === "none") return null;
    if (colorCache.has(str)) return colorCache.get(str);
    let out = null;
    const m = str.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
    if (m) {
      let a = m[4] === undefined ? 1 : m[4].endsWith("%") ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      out = [+m[1], +m[2], +m[3], a].map((v, i) => (i < 3 ? Math.round(v) : v));
    } else {
      // oklch()·color() 등은 캔버스로 sRGB 변환 (브라우저에서만)
      if (typeof document === "undefined") return null;
      if (!cx) { const cv = document.createElement("canvas"); cv.width = cv.height = 1; cx = cv.getContext("2d", { willReadFrequently: true }); }
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = "#000";
      cx.fillStyle = str;
      cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      out = [d[0], d[1], d[2], +(d[3] / 255).toFixed(2)];
    }
    if (out && out[3] === 0) out = null;
    colorCache.set(str, out);
    return out;
  }
  const hex = (c) => "#" + c.slice(0, 3).map((v) => v.toString(16).padStart(2, "0")).join("");
  const keyOf = (c) => (c[3] >= 0.99 ? hex(c) : `${hex(c)}@${Math.round(c[3] * 100)}`);
  const parseKey = (k) => {
    const [h, a] = k.split("@");
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a ? +a / 100 : 1];
  };
  const blend = (fg, bg) => (fg[3] >= 0.99 || !bg ? fg : [0, 1, 2].map((i) => Math.round(fg[i] * fg[3] + bg[i] * (1 - fg[3]))).concat(1));
  const lum = (c) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const contrast = (a, b) => {
    const x = lum(a), y = lum(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const chroma = (c) => Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]);

  // ---------- 도우미 ----------
  const add = (m, k, w = 1) => { if (k === undefined || k === null || k === "") return; m[k] = (m[k] || 0) + w; };
  const px = (v) => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
  const fam1 = (f) => (f || "").split(",")[0].trim().replace(/^["']|["']$/g, "");
  const visible = (el, cs) => {
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
    return cs.display !== "none" && cs.visibility !== "hidden";
  };
  const directText = (el) => {
    let t = "";
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.textContent;
    return t.replace(/\s+/g, " ").trim();
  };
  const MEDIA = new Set(["IMG", "VIDEO", "PICTURE", "CANVAS", "IFRAME"]);

  // ---------- 측정 ----------
  function collect(opts = {}) {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const r = {
      url: location.href, title: document.title, vw, vh, at: Date.now(),
      bg: {}, text: {}, textOn: {}, headOn: {}, textOverMedia: 0, border: {}, btn: {}, link: {},
      type: {}, tag: {}, spacing: {}, sectionPad: {}, sectionGap: {}, gaps: {}, radius: {}, shadow: {},
      dur: {}, ease: {}, buttons: {}, containers: {}, grid: {}, bps: {}, vars: {}, fonts: [], libs: [],
      lowContrast: [], contrastHist: {}, imageArea: 0, totalArea: 0, styled: 0, shadowed: 0, upperChars: 0, italicChars: 0, chars: 0,
      imgFilters: {}, imgRadius: {}, textDeco: {}, sheetsUnreadable: 0,
    };

    // 1) 원본 CSS 변수·미디어쿼리
    const rootCS = getComputedStyle(document.documentElement);
    const scanRules = (rules) => {
      for (const ru of rules) {
        if (ru.media && ru.cssRules) {
          (ru.conditionText || ru.media.mediaText || "").replace(/(min|max)-width:\s*([\d.]+)(px|em|rem)/g, (_, mm, n, u) => {
            add(r.bps, Math.round(+n * (u === "px" ? 1 : 16)) + (mm === "max" ? "↓" : "↑"));
          });
          scanRules(ru.cssRules);
        } else if (ru.cssRules) scanRules(ru.cssRules);
        if (ru.style && ru.selectorText && /(^|,)\s*(:root|html|body|\[data-theme[^\]]*\]|\.theme-[\w-]+)\s*($|,)/.test(ru.selectorText)) {
          for (const p of ru.style) if (p.startsWith("--")) r.vars[p] = (rootCS.getPropertyValue(p) || ru.style.getPropertyValue(p)).trim();
        }
      }
    };
    for (const sh of document.styleSheets) {
      try { scanRules(sh.cssRules); } catch { r.sheetsUnreadable++; }
    }
    for (const p of rootCS) if (p.startsWith("--") && !(p in r.vars)) r.vars[p] = rootCS.getPropertyValue(p).trim();
    for (const k of Object.keys(r.vars)) if (r.vars[k].length > 160 || !r.vars[k]) delete r.vars[k];

    // 2) 글꼴
    try {
      const seen = new Set();
      document.fonts.forEach((f) => {
        const k = `${fam1(f.family)}|${f.weight}|${f.style}`;
        if (!seen.has(k)) { seen.add(k); r.fonts.push({ family: fam1(f.family), weight: f.weight, style: f.style, status: f.status }); }
      });
    } catch {}

    // 3) 라이브러리
    const w = window;
    [["gsap", w.gsap], ["ScrollTrigger", w.ScrollTrigger], ["Lenis", w.Lenis || w.lenis || document.documentElement.classList.contains("lenis")],
     ["Locomotive", w.LocomotiveScroll || document.querySelector("[data-scroll-container]")], ["Swiper", w.Swiper || document.querySelector(".swiper")],
     ["three.js", w.THREE], ["Lottie", w.lottie || document.querySelector("lottie-player,dotlottie-player")], ["Barba", w.barba],
     ["Webflow", w.Webflow || document.documentElement.dataset.wfPage], ["Framer", document.querySelector("[data-framer-name]")],
     ["Next.js", w.__NEXT_DATA__ || document.getElementById("__next")], ["Nuxt", w.__NUXT__ || document.getElementById("__nuxt")],
     ["Shopify", w.Shopify], ["Tailwind", document.querySelector("[class*='md:'],[class*='lg:']")]]
      .forEach(([n, ok]) => ok && r.libs.push(n));

    // 4) DOM 걷기: 칠해진 면적(자식이 덮은 만큼 빼기) + 글자 + 간격 + 부품
    const docW = Math.min(vw, document.documentElement.scrollWidth);
    function area(rect) {
      const wd = Math.max(0, Math.min(rect.right, docW) - Math.max(rect.left, 0));
      return wd * Math.max(0, rect.height);
    }
    function walk(el, curBg, depth) {
      if (el.closest && el !== document.documentElement && el.matches(EXCL)) return 0;
      const cs = getComputedStyle(el);
      if (!visible(el, cs)) return 0;
      const rect = el.getBoundingClientRect();
      const a = area(rect);
      const tag = el.tagName;

      if (MEDIA.has(tag) || (tag === "svg" && a > 40000)) {
        if (tag !== "svg") {
          r.imageArea += a;
          if (cs.filter !== "none") add(r.imgFilters, cs.filter);
          add(r.imgRadius, cs.borderRadius);
        }
        return a;
      }

      // 배경
      const bgc = rgba(cs.backgroundColor);
      const hasBgImg = cs.backgroundImage !== "none" && /url\(/.test(cs.backgroundImage);
      const bgEff = bgc ? blend(bgc, curBg) : curBg;
      const nextBg = bgc && bgc[3] >= 0.5 ? bgEff : curBg;

      // 테두리
      let hasBorder = false;
      for (const s of ["Top", "Right", "Bottom", "Left"]) {
        if (px(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none") {
          const bc = rgba(cs[`border${s}Color`]);
          if (bc) { add(r.border, keyOf(bc)); hasBorder = true; }
        }
      }
      if (bgc || hasBorder || hasBgImg) {
        r.styled++;
        if (cs.boxShadow !== "none") { r.shadowed++; add(r.shadow, cs.boxShadow.replace(/rgba?\([^)]*\)/g, (c) => keyOf(rgba(c) || [0, 0, 0, 0]))); }
        // 모서리는 부품(카드·버튼·입력칸)만 센다. 화면 폭을 다 채우는 섹션은 뺀다.
        if (a > 400 && rect.width < vw * 0.9) add(r.radius, cs.borderRadius.split(" ")[0]);
      }

      // 간격
      for (const p of ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginBottom"]) {
        const v = Math.round(px(cs[p]));
        if (v > 0 && v < 400) add(r.spacing, v);
      }
      if (/flex|grid/.test(cs.display)) {
        const g1 = Math.round(px(cs.rowGap)), g2 = Math.round(px(cs.columnGap));
        if (g1 > 0) { add(r.gaps, g1); add(r.spacing, g1); }
        if (g2 > 0 && g2 !== g1) { add(r.gaps, g2); add(r.spacing, g2); }
      }
      if (rect.width >= vw * 0.9 && rect.height >= vh * 0.4) {
        const pt = Math.round(px(cs.paddingTop)), pb = Math.round(px(cs.paddingBottom));
        // 32~320px만 섹션 여백으로 본다 (그보다 크면 비율 유지용·히어로 높이용 패딩)
        if (pt >= 32 && pt <= 320) add(r.sectionPad, pt);
        if (pb >= 32 && pb <= 320) add(r.sectionPad, pb);
      }
      if (cs.maxWidth !== "none" && /px$/.test(cs.maxWidth) && px(cs.maxWidth) >= 480) add(r.containers, Math.round(px(cs.maxWidth)));
      else if (rect.width >= 480 && rect.width < vw - 20 && Math.abs(rect.left - (vw - rect.right)) < 2 && rect.height > 100) add(r.containers, Math.round(rect.width));
      if (cs.display === "grid" && cs.gridTemplateColumns !== "none") add(r.grid, cs.gridTemplateColumns.split(" ").length + "칸");

      // 움직임
      if (cs.transitionDuration && cs.transitionDuration !== "0s") {
        cs.transitionDuration.split(",").forEach((d) => px(d) > 0 && add(r.dur, Math.round(px(d) * (d.includes("ms") ? 1 : 1000)) + "ms"));
        cs.transitionTimingFunction.split(/,(?![^(]*\))/).forEach((e) => add(r.ease, e.trim()));
      }
      if (cs.animationName && cs.animationName !== "none") {
        cs.animationDuration.split(",").forEach((d) => px(d) > 0 && add(r.dur, Math.round(px(d) * (d.includes("ms") ? 1 : 1000)) + "ms"));
      }

      // 글자
      const txt = directText(el);
      if (txt && rect.width > 0) {
        const n = txt.length;
        const fc = rgba(cs.color);
        const size = Math.round(px(cs.fontSize) * 10) / 10;
        const lh = cs.lineHeight === "normal" ? 1.2 : Math.round((px(cs.lineHeight) / size) * 100) / 100;
        const ls = cs.letterSpacing === "normal" ? 0 : Math.round((px(cs.letterSpacing) / size) * 1000) / 1000;
        const up = cs.textTransform === "uppercase";
        const it = cs.fontStyle === "italic";
        const combo = [fam1(cs.fontFamily), size, cs.fontWeight, lh, ls, up ? "U" : "", it ? "I" : ""].join("|");
        add(r.type, combo, n);
        const role = /^H[1-6]$/.test(tag) ? tag.toLowerCase() : tag === "BUTTON" ? "button" : tag === "A" ? "a" : tag === "P" ? "p" : tag === "LI" ? "li" : tag === "LABEL" || tag === "SMALL" ? "small" : "other";
        (r.tag[role] ||= {})[combo] = (r.tag[role][combo] || 0) + n;
        r.chars += n;
        if (up) r.upperChars += n;
        if (it) r.italicChars += n;
        if (fc) {
          const under = bgEff || curBg;
          const ratio = under ? contrast(blend(fc, under), under) : 21;
          if (ratio < 1.4) {
            // 배경과 거의 같은 색 = 사진·영상 위에 얹힌 글자로 본다 → 본문색 계산에서 뺀다
            r.textOverMedia += n;
          } else {
            add(r.text, keyOf(fc), n);
            (r.textOn[keyOf(under)] ||= {})[keyOf(fc)] = (r.textOn[keyOf(under)][keyOf(fc)] || 0) + n;
            // 큰 글자(24px 이상)는 크기² 가중치로 따로 센다 → 제목색
            if (size >= 24) { const wgt = Math.round(n * (size / 16) ** 2); (r.headOn[keyOf(under)] ||= {})[keyOf(fc)] = (r.headOn[keyOf(under)][keyOf(fc)] || 0) + wgt; }
          }
          if (under && !hasBgImg && ratio >= 1.4) {
            add(r.contrastHist, ratio < 3 ? "<3" : ratio < 4.5 ? "3–4.5" : ratio < 7 ? "4.5–7" : "7+", n);
            if (ratio < 3 && size < 24 && r.lowContrast.length < 12) r.lowContrast.push({ text: txt.slice(0, 40), fg: keyOf(fc), bg: keyOf(bgEff || curBg), ratio: +ratio.toFixed(2) });
          }
        }
        if (tag === "A" && !el.closest("nav,header,footer")) { fc && add(r.link, keyOf(fc), n); add(r.textDeco, cs.textDecorationLine); }
      }

      // 버튼처럼 생긴 것
      const isBtnTag = tag === "BUTTON" || (tag === "A") || el.getAttribute("role") === "button" || (tag === "INPUT" && /submit|button/.test(el.type));
      if (isBtnTag && rect.height >= 28 && rect.height <= 88 && rect.width <= 520 && (el.innerText || el.value || "").trim()) {
        const filled = bgc && bgc[3] > 0.05 && (!curBg || keyOf(bgEff) !== keyOf(curBg));
        if (filled || hasBorder) {
          const tcs = cs;
          const sig = {
            h: Math.round(rect.height), padX: Math.round(px(tcs.paddingLeft)), radius: tcs.borderRadius.split(" ")[0],
            bg: filled ? keyOf(bgEff) : "투명", fg: rgba(tcs.color) ? keyOf(rgba(tcs.color)) : "",
            border: hasBorder ? `${tcs.borderTopWidth} ${keyOf(rgba(tcs.borderTopColor) || [0, 0, 0, 1])}` : "없음",
            font: `${fam1(tcs.fontFamily)} ${Math.round(px(tcs.fontSize))}px ${tcs.fontWeight}${tcs.textTransform === "uppercase" ? " 대문자" : ""}`,
          };
          add(r.buttons, JSON.stringify(sig));
          if (filled) add(r.btn, keyOf(bgEff));
        }
      }

      // 넓은 블록끼리 세로로 떨어진 거리 = 섹션 간격 후보 (마진으로 섹션을 띄우는 사이트 대응)
      if (el.children.length > 1 && rect.width >= vw * 0.6) {
        let prev = null;
        for (const ch of el.children) {
          const cr = ch.getBoundingClientRect();
          if (cr.width < vw * 0.6 || cr.height < 80) { continue; }
          if (prev) { const g = Math.round(cr.top - prev.bottom); if (g >= 32 && g <= 320) add(r.sectionGap, g); }
          prev = cr;
        }
      }

      // 자식 → 덮인 면적
      let childCover = 0;
      for (const ch of el.children) childCover += walk(ch, nextBg, depth + 1);
      childCover = Math.min(a, childCover);
      if (bgc && bgc[3] >= 0.5 && !hasBgImg) {
        add(r.bg, keyOf(bgEff), Math.max(0, a - childCover));
        return a;
      }
      if (hasBgImg) { r.imageArea += Math.max(0, a - childCover); return a; }
      return childCover;
    }
    const root = document.documentElement;
    const rootBg = rgba(getComputedStyle(document.body).backgroundColor) || rgba(rootCS.backgroundColor) || [255, 255, 255, 1];
    const docArea = docW * document.documentElement.scrollHeight;
    r.totalArea = docArea;
    const covered = walk(document.body, rootBg, 0);
    if (!rgba(getComputedStyle(document.body).backgroundColor)) add(r.bg, keyOf(rootBg), Math.max(0, docArea - covered));
    void root;

    if (opts.keep !== false) {
      const all = load();
      all.push(r);
      save(all);
    }
    console.log(`%cDSX%c 측정 완료: ${location.pathname} (폭 ${vw}px) · 쌓인 페이지 ${load().length}개 · 변수 ${Object.keys(r.vars).length}개 · 읽을 수 없는 스타일시트 ${r.sheetsUnreadable}개`, "background:#111;color:#fff;padding:2px 6px", "");
    return r;
  }

  // ---------- 저장 ----------
  let mem = [];
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return mem; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { mem = v; } }

  // ---------- 묶기·해석 ----------
  const sumMaps = (list, f) => list.reduce((acc, x) => { for (const [k, v] of Object.entries(f(x) || {})) acc[k] = (acc[k] || 0) + v; return acc; }, {});
  const top = (m, n = 10) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const total = (m) => Object.values(m).reduce((a, b) => a + b, 0);
  const median = (arr) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
  const wMedian = (m) => {
    const e = Object.entries(m).map(([k, v]) => [parseFloat(k), v]).sort((a, b) => a[0] - b[0]);
    const half = e.reduce((a, b) => a + b[1], 0) / 2;
    let acc = 0;
    for (const [k, v] of e) { acc += v; if (acc >= half) return k; }
    return null;
  };

  // 거의 같은 색 합치기 (RGB 거리 + 투명도)
  function clusterColors(maps) {
    const keys = new Set();
    Object.values(maps).forEach((m) => Object.keys(m).forEach((k) => keys.add(k)));
    const weight = (k) => Object.values(maps).reduce((a, m) => a + (m[k] ? 1 : 0), 0) + (maps.bg[k] || 0) / 1e5 + (maps.text[k] || 0) / 100;
    const sorted = [...keys].sort((a, b) => weight(b) - weight(a));
    const clusters = [];
    for (const k of sorted) {
      const c = parseKey(k);
      const hit = clusters.find((cl) => Math.abs(cl.c[3] - c[3]) < 0.08 && Math.abs(cl.c[0] - c[0]) + Math.abs(cl.c[1] - c[1]) + Math.abs(cl.c[2] - c[2]) <= 12);
      if (hit) hit.members.push(k);
      else clusters.push({ key: k, c, members: [k] });
    }
    return clusters.map((cl) => {
      const o = { hex: cl.key, rgb: cl.c, members: cl.members };
      for (const [name, m] of Object.entries(maps)) o[name] = cl.members.reduce((a, k) => a + (m[k] || 0), 0);
      return o;
    });
  }

  // 자주 보이는 유료 글꼴 → 비슷한 무료 글꼴(Google Fonts). 마지막 판단은 눈으로.
  const FREE_ALT = [
    [/suisse|helvetica|neue haas|haas grot|akzidenz|graphik|söhne|sohne|untitled sans|aktiv|gt america|basis grotesque|sf pro|-apple-system/i, "Inter"],
    [/neue montreal|founders|monument grot|pp mori|ppmori|abc favorit|favorit/i, "Inter Tight"],
    [/circular|cerebri|gilroy|proxima|avenir|brandon|sofia pro|tt norms|tt commons/i, "Figtree"],
    [/apercu|gt walsheim|walsheim|euclid|matter|general sans/i, "DM Sans"],
    [/futura|twentieth|tw cen|neuzeit/i, "Jost"],
    [/gotham|montserrat|ff mark|mark pro/i, "Montserrat"],
    [/optima|zapf.?humanist|aesop/i, "Belleza"],
    [/tiempos|times|georgia|lyon|publico|financier|chronicle/i, "Newsreader"],
    [/canela|gt sectra|sectra|means|recoleta|cooper|ivy ?presto|editorial new|pp editorial/i, "Fraunces"],
    [/caslon|garamond|sabon|bembo|minion/i, "EB Garamond"],
    [/didot|bodoni|ogg|saol|domaine/i, "Playfair Display"],
    [/gt alpina|alpina|signifier|reckless/i, "Instrument Serif"],
    [/mono|code|consol|courier|berkeley|sf mono|menlo/i, "JetBrains Mono"],
  ];
  const GOOGLE = /^(inter|inter tight|roboto|open sans|lato|poppins|dm sans|dm mono|dm serif|figtree|manrope|work sans|ibm plex|space grotesk|space mono|jetbrains mono|fraunces|newsreader|playfair|eb garamond|cormorant|instrument|syne|outfit|plus jakarta|sora|jost|montserrat|noto|pretendard|archivo|rubik|nunito|source)/i;
  const freeAlt = (raw) => {
    if (!raw) return null;
    const name = raw.replace(/\s?(Variable|VF|Var|Web|Pro|Display|Text)$/i, "").trim();
    if (GOOGLE.test(name)) return { name, how: "무료 그대로" };
    const hit = FREE_ALT.find(([re]) => re.test(name));
    return hit ? { name: hit[1], how: "비슷한 무료 글꼴 (눈으로 확인)" } : { name: null, how: "대체 글꼴 직접 고르기" };
  };

  function summarize(pages) {
    const desk = pages.filter((p) => p.vw >= 768);
    const mob = pages.filter((p) => p.vw < 768);
    const P = desk.length ? desk : pages;
    const S = (f) => sumMaps(P, f);

    // 색
    const maps = { bg: S((p) => p.bg), text: S((p) => p.text), border: S((p) => p.border), btn: S((p) => p.btn), link: S((p) => p.link) };
    const tb = total(maps.bg) || 1, tt = total(maps.text) || 1, tbo = total(maps.border) || 1;
    const colors = clusterColors(maps).map((c) => ({
      ...c, bgShare: c.bg / tb, textShare: c.text / tt, borderShare: c.border / tbo, chroma: chroma(c.rgb),
    })).filter((c) => c.bgShare > 0.002 || c.textShare > 0.01 || c.borderShare > 0.05 || c.btn > 0 || c.link > 0);

    const roles = {};
    const byBg = [...colors].sort((a, b) => b.bgShare - a.bgShare);
    const byText = [...colors].sort((a, b) => b.textShare - a.textShare);
    roles.bg = byBg[0];
    // 보조 면: 주 배경과 밝기가 가까운 순 (가까운 것 = 카드·띠, 먼 것 = 반전 섹션)
    roles.surfaces = byBg.slice(1).filter((c) => c.bgShare >= 0.03).sort((a, b) => Math.abs(lum(a.rgb) - lum(roles.bg.rgb)) - Math.abs(lum(b.rgb) - lum(roles.bg.rgb))).slice(0, 4);
    // 본문색 = 주 배경 위에서 가장 많이 쓰인 글자색 (어두운 섹션·사진 위 글자에 휘둘리지 않게)
    const onMain = {};
    const bgMembers = new Set((roles.bg?.members) || []);
    for (const p of P) for (const [bk, m] of Object.entries(p.textOn || {})) if (bgMembers.has(bk)) for (const [fk, v] of Object.entries(m)) add(onMain, fk, v);
    const findC = (k) => colors.find((c) => c.members.includes(k));
    const mainText = top(onMain, 6).map(([k]) => findC(k)).filter(Boolean).filter((c, i, a) => a.indexOf(c) === i);
    const headMain = {};
    for (const p of P) for (const [bk, m] of Object.entries(p.headOn || {})) if (bgMembers.has(bk)) for (const [fk, v] of Object.entries(m)) add(headMain, fk, v);
    const headC = top(headMain, 3).map(([k]) => findC(k)).filter(Boolean)[0];
    // 제목색과 본문색이 다르면: 제목색 = c-fg, 가장 많이 쓰인 본문색 = c-muted
    roles.text = headC || mainText[0] || byText[0];
    roles.body = mainText[0] || byText[0];
    roles.text2 = [roles.body, ...mainText.slice(1), ...byText.slice(1)].filter((c, i, a) => c && a.indexOf(c) === i && c.hex !== roles.text?.hex && c.hex !== roles.bg?.hex).slice(0, 2);
    roles.textOnDark = byText.filter((c) => lum(c.rgb) > 0.6 && c.hex !== roles.bg?.hex)[0] || null;
    roles.line = [...colors].filter((c) => c.border > 0).sort((a, b) => b.border - a.border)[0];
    // 강조색: 채도 있는 색이 조금이라도 쓰이면 그중에서, 없으면 가장 진한 면 색(무채색 사이트)
    const accentScore = (c) => c.btn * 3 + c.link * 0.01 + (c.bgShare < 0.15 ? c.bgShare * 50 : 0) + (c.textShare < 0.2 ? c.textShare * 10 : 0) + c.border * 0.01;
    const chromatic = colors.filter((c) => c.chroma > 40 && (c.bgShare > 0.001 || c.textShare > 0.005 || c.btn || c.link));
    roles.accent = (chromatic.length ? chromatic : colors.filter((c) => c.hex !== roles.bg?.hex && c.hex !== roles.text?.hex))
      .sort((a, b) => accentScore(b) - accentScore(a))[0];
    roles.accentIsNeutral = !chromatic.length;
    roles.text2 = roles.text2.filter((c) => c !== roles.accent);
    const accentArea = colors.filter((c) => c.chroma > 40).reduce((a, c) => a + c.bgShare, 0);
    const accentText = colors.filter((c) => c.chroma > 40).reduce((a, c) => a + c.textShare, 0);

    // 글자
    const type = S((p) => p.type);
    const combos = Object.entries(type).map(([k, n]) => {
      const [family, size, weight, lh, ls, U, I] = k.split("|");
      return { family, size: +size, weight: +weight, lh: +lh, ls: +ls, upper: !!U, italic: !!I, chars: n };
    });
    const totalChars = combos.reduce((a, c) => a + c.chars, 0) || 1;
    // "SuisseIntl-Medium"처럼 굵기마다 이름이 따로인 글꼴은 한 가족으로 묶는다
    const WSUF = /[-_ ]?(Thin|ExtraLight|Light|Regular|Book|Roman|Medium|SemiBold|DemiBold|Bold|ExtraBold|Black|Heavy)$/i;
    const WMAP = { thin: 100, extralight: 200, light: 300, regular: 400, book: 400, roman: 400, medium: 500, semibold: 600, demibold: 600, bold: 700, extrabold: 800, black: 900, heavy: 900 };
    combos.forEach((c) => {
      const m = c.family.match(WSUF);
      if (m) { c.family = c.family.replace(WSUF, ""); if (c.weight === 400) c.weight = WMAP[m[1].toLowerCase()] || c.weight; }
    });
    const famStats = {};
    combos.forEach((c) => {
      const f = (famStats[c.family] ||= { family: c.family, chars: 0, bigChars: 0, maxSize: 0, weights: {}, sizes: {} });
      f.chars += c.chars; if (c.size >= 28) f.bigChars += c.chars; f.maxSize = Math.max(f.maxSize, c.size);
      add(f.weights, c.weight, c.chars); add(f.sizes, c.size, c.chars);
    });
    const fams = Object.values(famStats).sort((a, b) => b.chars - a.chars);
    const isMono = (f) => /mono|code|courier|consol/i.test(f);
    const body = fams.find((f) => !isMono(f.family)) || fams[0];
    const display = [...fams].sort((a, b) => b.bigChars - a.bigChars)[0];
    const mono = fams.find((f) => isMono(f.family));

    // 글자 단계: 크기별 대표 조합
    const bySize = {};
    combos.forEach((c) => { const s = Math.round(c.size); (bySize[s] ||= []).push(c); });
    let scale = Object.entries(bySize).map(([s, list]) => {
      const tot = list.reduce((a, c) => a + c.chars, 0);
      const rep = list.sort((a, b) => b.chars - a.chars)[0];
      return { ...rep, size: +s, chars: tot, share: tot / totalChars };
    }).filter((x) => x.share >= 0.004 || x.size >= 40).sort((a, b) => b.size - a.size);
    if (scale.length > 12) scale = scale.filter((x) => x.share >= 0.01 || x.size >= 40).slice(0, 12);
    const sizes = scale.map((x) => x.size).filter((s) => s >= 12);
    const ratios = [];
    for (let i = 0; i < sizes.length - 1; i++) { const q = sizes[i] / sizes[i + 1]; if (q > 1.05) ratios.push(q); }
    const ratio = median(ratios);

    const tagMap = {};
    for (const p of P) for (const [t, m] of Object.entries(p.tag)) for (const [k, v] of Object.entries(m)) add((tagMap[t] ||= {}), k, v);
    const byTag = Object.fromEntries(Object.entries(tagMap).map(([t, m]) => {
      const [k, n] = top(m, 1)[0];
      const [family, size, weight, lh, ls, U] = k.split("|");
      return [t, { family, size: +size, weight: +weight, lh: +lh, ls: +ls, upper: !!U, chars: n }];
    }));

    // 간격
    const spacing = S((p) => p.spacing);
    const vals = Object.entries(spacing).map(([k, v]) => [+k, v]);
    const tsp = vals.reduce((a, b) => a + b[1], 0) || 1;
    const unitScores = [4, 5, 6, 8, 10, 12, 16].map((u) => ({ u, share: vals.filter(([k]) => k % u === 0).reduce((a, b) => a + b[1], 0) / tsp }));
    const unit = [...unitScores].reverse().find((x) => x.share >= 0.75) || unitScores[0];
    const sectionPad = wMedian(S((p) => p.sectionPad));
    const sectionGap = wMedian(S((p) => p.sectionGap || {}));
    const sectionSpace = sectionPad && sectionGap ? Math.max(sectionPad, sectionGap) : sectionPad || sectionGap;
    const container = top(S((p) => p.containers), 3);
    const gaps = top(S((p) => p.gaps), 6);

    // 모서리·그림자·움직임
    const radius = top(S((p) => p.radius), 5);
    const styled = P.reduce((a, p) => a + p.styled, 0) || 1;
    const shadowed = P.reduce((a, p) => a + p.shadowed, 0);
    const shadows = top(S((p) => p.shadow), 3);
    const durs = top(S((p) => p.dur), 5);
    const eases = top(S((p) => p.ease), 5);
    const buttons = top(S((p) => p.buttons), 5).map(([k, n]) => ({ ...JSON.parse(k), count: n }));
    const bps = top(S((p) => p.bps), 8).map(([k]) => k).sort((a, b) => parseInt(a) - parseInt(b));
    // 영상 플레이어·위젯 같은 외부 부품의 변수는 뺀다
    const VENDOR = /^--(fp-|flowplayer|swiper|plyr|toastify|tw-|wp--|chakra|mantine|onetrust|ot-|vjs|video-js|glide|splide|slick|intercom|hs-|klaviyo|yotpo|rsms|framer-|wf-)/i;
    const vars = Object.fromEntries(Object.entries(Object.assign({}, ...P.map((p) => p.vars))).filter(([k]) => !VENDOR.test(k)));
    const fonts = [...new Map(P.flatMap((p) => p.fonts).map((f) => [`${f.family}|${f.weight}|${f.style}`, f])).values()];
    const libs = [...new Set(P.flatMap((p) => p.libs))];
    const contrastHist = S((p) => p.contrastHist);
    const imageShare = P.reduce((a, p) => a + p.imageArea, 0) / (P.reduce((a, p) => a + p.totalArea, 0) || 1);
    const upperShare = P.reduce((a, p) => a + p.upperChars, 0) / totalChars;
    const italicShare = P.reduce((a, p) => a + p.italicChars, 0) / totalChars;
    const linkDeco = top(S((p) => p.textDeco), 2);
    const imgFilters = top(S((p) => p.imgFilters), 3);

    // 원본 변수 분류
    const varGroups = { color: [], size: [], font: [], ease: [], other: [] };
    for (const [k, v] of Object.entries(vars)) {
      if (/^(#|rgb|hsl|oklch|lab|color\()/i.test(v)) varGroups.color.push([k, v]);
      else if (/cubic-bezier|ease|linear\(/.test(v)) varGroups.ease.push([k, v]);
      else if (/^-?[\d.]+(px|rem|em|vw|vh|%)$|clamp\(|calc\(/.test(v)) varGroups.size.push([k, v]);
      else if (/,|serif|sans|mono|["']/.test(v) && /font|family|ff/i.test(k)) varGroups.font.push([k, v]);
      else varGroups.other.push([k, v]);
    }
    // 측정한 색이 원본 변수와 같은지 (근거 표시)
    const varHex = new Map();
    varGroups.color.forEach(([k, v]) => { const c = rgba(v); if (c) varHex.set(keyOf(c), k); });
    colors.forEach((c) => { c.var = c.members.map((m) => varHex.get(m)).find(Boolean) || null; });

    // 원본 변수에 브랜드·강조·포커스 색이 있으면 그것을 강조색 후보 1순위로 (화면 측정은 우연히 넓은 홍보 띠에 끌릴 수 있음)
    const brandVar = varGroups.color.find(([k]) => /accent|brand|primary|focus-ring-color|highlight/i.test(k) && !/(text|fg|on-)/i.test(k));
    const accentFromVar = brandVar ? { name: brandVar[0], hex: (() => { const c = rgba(brandVar[1]); return c ? keyOf(c) : brandVar[1]; })() } : null;

    // "안 하는 것"
    const donts = [];
    const notes0 = [];
    const rTot = radius.reduce((a, b) => a + b[1], 0) || 1;
    const r0 = radius[0] ? radius[0][0] : "0px";
    const zeroShare = (radius.find(([k]) => px(k) === 0)?.[1] || 0) / rTot;
    const pillShare = (radius.find(([k]) => px(k) >= 999)?.[1] || 0) / rTot;
    const cardRadius = radius.map(([k]) => k).find((k) => px(k) > 0 && px(k) < 999 && !k.includes("%")) || "0px";
    if (shadowed / styled < 0.02) donts.push("그림자를 거의 쓰지 않음");
    if (zeroShare > 0.7) donts.push("모서리를 둥글게 하지 않음(직각)");
    if (pillShare > 0.3) notes0.push(`버튼·태그는 알약 모양(완전히 둥근 모서리)이 ${(pillShare * 100).toFixed(0)}%`);
    const maxW = Math.max(...fams.map((f) => Math.max(...Object.keys(f.weights).map(Number))));
    if (maxW <= 500) donts.push(`굵은 글자를 쓰지 않음(최대 ${maxW})`);
    if (roles.accentIsNeutral) donts.push("채도 있는 색을 쓰지 않음 — 무채색과 명도 차이로만 위계를 만듦");
    else if (accentArea < 0.02) donts.push(`채도 있는 색은 면적 ${(accentArea * 100).toFixed(1)}% · 글자 ${(accentText * 100).toFixed(1)}%뿐 — 강조색을 아주 아껴 씀`);
    if (upperShare < 0.01) donts.push("대문자 변환을 거의 쓰지 않음");
    if (italicShare < 0.005) donts.push("이탤릭을 거의 쓰지 않음");
    if (fams.filter((f) => f.chars / totalChars > 0.03).length <= 1) donts.push("글꼴 한 종류로만 위계를 만듦");
    if (!gaps.length) donts.push("flex/grid 간격(gap)을 거의 쓰지 않음");

    const notes = [...notes0];
    if (upperShare >= 0.08) notes.push(`글자의 ${(upperShare * 100).toFixed(0)}%가 대문자 — 라벨·메뉴에 대문자를 적극적으로 씀`);
    if (italicShare >= 0.02) notes.push(`이탤릭 ${(italicShare * 100).toFixed(0)}% — 강조에 이탤릭을 씀`);
    if (imageShare > 0.35) notes.push(`화면의 ${(imageShare * 100).toFixed(0)}%가 사진·영상 — 이미지 중심`);
    else if (imageShare < 0.1) notes.push(`사진·영상은 화면의 ${(imageShare * 100).toFixed(0)}% — 글자·색 중심`);
    if (display && body && display.family !== body.family) notes.push(`제목(${display.family})과 본문(${body.family}) 글꼴을 나눠 씀`);
    if (ratio) notes.push(`글자 크기는 대략 ${ratio.toFixed(2)}배씩 커짐${ratio < 1.2 ? " — 단계 차이가 작고 촘촘함" : ratio > 1.4 ? " — 제목과 본문 차이가 큼" : ""}`);
    if (unit.share < 0.75) notes.push(`간격이 ${unit.u}px 배수에 ${(unit.share * 100).toFixed(0)}%만 맞음 — 엄격한 간격 체계는 아님(값을 그대로 옮기는 게 안전)`);
    else notes.push(`간격은 ${unit.u}px 단위 (${(unit.share * 100).toFixed(0)}% 일치)`);
    const ch = Object.entries(contrastHist); const chT = total(contrastHist) || 1;
    const lowShare = ch.filter(([k]) => k === "<3" || k === "3–4.5").reduce((a, b) => a + b[1], 0) / chT;
    if (lowShare > 0.15) notes.push(`글자의 ${(lowShare * 100).toFixed(0)}%가 대비 4.5 미만 — 흐린 글자를 의도적으로 씀(또는 접근성 주의)`);

    // 우리 테마 형식으로 초안
    const pick = (c) => (c ? c.hex.split("@")[0] : null);
    const lineC = roles.line;
    const theme = {
      tokens: {
        "font-display": `'${freeAlt(display?.family || body?.family)?.name || display?.family}', 'Pretendard', sans-serif`,
        "font-body": `'${freeAlt(body?.family)?.name || body?.family}', 'Pretendard', sans-serif`,
        ...(mono ? { "font-mono": `'${freeAlt(mono.family)?.name || mono.family}', monospace` } : {}),
        "display-weight": String(byTag.h1?.weight || byTag.h2?.weight || scale[0]?.weight || 500),
        "display-style": byTag.h1?.italic ? "italic" : "normal",
        "display-tracking": `${(byTag.h1?.ls ?? byTag.h2?.ls ?? scale[0]?.ls ?? 0)}em`,
        "c-bg": pick(roles.bg),
        "c-fg": pick(roles.text),
        "c-muted": pick(roles.text2[0]) || pick(roles.text),
        "c-accent": accentFromVar ? accentFromVar.hex.split("@")[0] : pick(roles.accent),
        "c-surface": pick(roles.surfaces[0]) || pick(roles.bg),
        "c-line": lineC ? (lineC.rgb[3] < 1 ? `rgba(${lineC.rgb.slice(0, 3).join(",")},${lineC.rgb[3]})` : lineC.hex) : null,
        "c-bg-alt": pick([...roles.surfaces].sort((a, b) => Math.abs(lum(b.rgb) - lum(roles.bg.rgb)) - Math.abs(lum(a.rgb) - lum(roles.bg.rgb)))[0]) || pick(roles.text),
        "c-fg-alt": pick(roles.bg),
        "space-section": sectionSpace ? `${sectionSpace}px` : null,
        radius: zeroShare > 0.7 ? "0px" : cardRadius,
      },
      motion: { durationMs: durs[0] ? parseInt(durs[0][0]) : null, ease: eases[0] ? eases[0][0] : null },
    };

    const mobile = mob.length ? (() => {
      const mt = sumMaps(mob, (p) => p.type);
      const ms = Object.keys(mt).map((k) => +k.split("|")[1]);
      return { pages: mob.length, maxSize: Math.max(...ms), sectionPad: wMedian(sumMaps(mob, (p) => p.sectionPad)) };
    })() : null;

    return {
      meta: { pages: pages.map((p) => ({ url: p.url, vw: p.vw })), host: P[0] ? new URL(P[0].url).host : "", made: new Date().toISOString(), unreadableSheets: P.reduce((a, p) => a + p.sheetsUnreadable, 0) },
      colors: colors.sort((a, b) => b.bgShare + b.textShare - (a.bgShare + a.textShare)).slice(0, 24).map(({ members, ...c }) => ({ ...c, members: members.length })),
      roles: Object.fromEntries(Object.entries(roles).map(([k, v]) => [k, typeof v === "boolean" ? v : Array.isArray(v) ? v.map((x) => x.hex) : v?.hex || null])),
      accentArea, fonts: { body: body?.family, display: display?.family, mono: mono?.family || null, families: fams.slice(0, 6).map((f) => ({ family: f.family, share: f.chars / totalChars, maxSize: f.maxSize, weights: Object.keys(f.weights).map(Number).sort((a, b) => a - b), alt: freeAlt(f.family) })), loaded: fonts },
      scale, ratio, byTag, spacing: { unit: unit.u, unitShare: unit.share, sectionPad, sectionGap, sectionSpace, container: container.map(([k, n]) => +k), gaps: gaps.map(([k]) => +k), top: top(spacing, 14).map(([k, n]) => [+k, n]) },
      accentFromVar, radius, shadow: { share: shadowed / styled, top: shadows }, motion: { durations: durs, eases }, buttons, breakpoints: bps, libs,
      contrast: { hist: contrastHist, low: P.flatMap((p) => p.lowContrast).slice(0, 10) },
      images: { share: imageShare, filters: imgFilters, radius: top(S((p) => p.imgRadius), 3) }, links: { deco: linkDeco },
      upperShare, italicShare, donts, notes, vars: varGroups, theme, mobile,
    };
  }

  function report() {
    const pages = load();
    if (!pages.length) { console.warn("DSX: 먼저 DSX.collect()로 측정하세요."); return null; }
    const s = summarize(pages);
    window.__dsx = s;
    const sw = (h) => [`%c   %c ${h}`, `background:${h.split("@")[0]};border:1px solid #888`, ""];
    console.group(`%cDSX 디자인 시스템 초안 — ${s.meta.host} (${pages.length}페이지)`, "font-weight:bold;font-size:14px");
    console.log("역할별 색:");
    for (const [k, v] of Object.entries(s.roles)) [].concat(v || []).forEach((h) => { const a = sw(h); console.log(a[0] + `  ${k}`, a[1], a[2]); });
    console.log("글꼴:", s.fonts.display, "(제목) /", s.fonts.body, "(본문)", s.fonts.mono ? `/ ${s.fonts.mono} (고정폭)` : "");
    console.table(s.scale.map((x) => ({ 크기: x.size, 굵기: x.weight, 줄간격: x.lh, 자간em: x.ls, 글꼴: x.family, 비중: (x.share * 100).toFixed(1) + "%" })));
    console.log(`간격 단위 ${s.spacing.unit}px (${(s.spacing.unitShare * 100).toFixed(0)}% 일치) · 섹션 여백 ${s.spacing.sectionPad}px · 콘텐츠 폭 ${s.spacing.container.join(", ")}`);
    console.log("하지 않는 것:", s.donts);
    console.log("특징:", s.notes);
    console.log("테마 초안:", s.theme);
    console.groupEnd();
    console.log("→ DSX.json() 결과를 /pages/ds-extract/ 에 붙여 넣으면 화면으로 볼 수 있어요.");
    return s;
  }

  function json() {
    const s = window.__dsx || report();
    const str = JSON.stringify(s);
    try { if (typeof copy === "function") copy(str); } catch {}
    return str;
  }

  if (typeof window === "undefined") { module.exports = { summarize }; return; }
  window.DSX = { collect, report, json, clear: () => { save([]); window.__dsx = null; console.log("DSX: 비웠어요"); }, pages: load, summarize };
  console.log("%cDSX 준비됨%c  DSX.collect() → 다른 페이지/폭에서 다시 붙여 넣고 collect() → DSX.report() → DSX.json()", "background:#111;color:#fff;padding:2px 6px", "");
})();
