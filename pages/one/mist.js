// 1번 첫 화면 배경 · 부피 안개 (psychoactive.co.nz 첫 화면과 같은 방식으로 직접 다시 짬)
// 방식: 화면 픽셀마다 카메라에서 안쪽으로 52걸음 들어가며 구름 밀도를 쌓는다(볼륨 레이마칭).
//   구름 = 3D 노이즈 3겹(큰 덩어리·중간·잔결)을 노이즈로 한 번 비틀어 말리게 한 것.
//   색 = 청록 기본 + 군데군데 팔레트 색이 비침. 마지막에 비네트와 하이라이트 눌러주기.
// 원본 홈 화면에서 읽은 값: 밀도 .5 · 색조 #2f9bb5 · 팔레트 5색 · 강조 .455 · 비네트 .7 · 흐름 속도 .35 · 해상도 절반(최대 52만 픽셀)
// 스크롤 속도만큼 안개 속으로 더 빨리 나아가고, 커서가 움직이면 주변 안개가 살짝 밀리며 돈다.
// fixed: 화면에 고정. fadeTo(요소): 그 요소 윗변이 화면 위에서 fadeEnd(화면 높이 비율)만큼 아래 올 때 완전히 까맣게 → 그 뒤로는 그리기 멈추고 숨김.
const VS = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;

const FS = `#version 300 es
precision highp float; precision highp sampler3D;
uniform sampler3D uNoise;
uniform vec2 uRes, uCursor, uCursorVel, uParallax;
uniform float uTime, uTravel, uDensity, uAccent, uVignette, uWakeR, uFrame, uFade;
uniform vec3 uTint, uBase;
uniform vec3 uPal[5];
in vec2 vUv; out vec4 o;
const int STEPS = 52;
const float DT = .25;

float tx(vec3 p){ return texture(uNoise, p).r; }
vec3 pal(float t){
  t = clamp(t, 0., 1.) * 4.;
  vec3 c = mix(uPal[0], uPal[1], clamp(t, 0., 1.));
  c = mix(c, uPal[2], clamp(t - 1., 0., 1.));
  c = mix(c, uPal[3], clamp(t - 2., 0., 1.));
  return mix(c, uPal[4], clamp(t - 3., 0., 1.));
}
// 구름: 큰 덩어리를 비틀림 장으로 말고, 잔결 두 겹이 가장자리를 갉아먹게
float cloud(vec3 p){
  vec3 q = p * .085 + vec3(0., uTime * .004, 0.);
  vec3 w = vec3(tx(q * .6 + vec3(.31, .07, .59)), tx(q * .6 + vec3(.53, .17, .71)), tx(q * .6 + vec3(.11, .83, .47))) - .5;
  float base = tx(q + w * .6);
  float mid  = tx(q * 3.1 + w * 1.1 + vec3(uTime * .009, 0., 0.));
  float fine = tx(q * 8.7 + w * 1.6 - vec3(0., uTime * .013, 0.));
  float n = base * .56 + mid * .28 + fine * .16;
  return clamp((n - .5) * 2.7 + .5, 0., 1.);   // .5 주변에 몰린 값을 다시 넓힘
}
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

void main(){
  vec2 uv = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  vec3 rd = normalize(vec3(uv, -1.4));
  // 커서: 움직이는 동안만 주변을 살짝 밀고 돌린다
  vec2 dc = vUv - uCursor; dc.x *= uRes.x / uRes.y;
  float cf = exp(-dot(dc, dc) / uWakeR);
  vec2 wake = (uCursorVel * .55 + vec2(-dc.y, dc.x) * length(uCursorVel) * 1.4) * cf;
  // 시작 깊이를 픽셀마다 조금씩 어긋나게(계단 무늬 숨김)
  vec2 jp = gl_FragCoord.xy + 5.588238 * uFrame;
  float t = .5 + fract(52.9829189 * fract(dot(jp, vec2(.06711056, .00583715)))) * DT;
  vec3 col = vec3(0.); float trans = 1.;
  for (int i = 0; i < STEPS; i++) {
    vec3 pc = rd * t;
    float near = 1. - smoothstep(1., 11., t);
    vec3 pw = pc + vec3(uParallax * .5, -uTravel);
    pw.xy -= wake * (.5 + 1.2 * near);
    float d = smoothstep(.62, .73, cloud(pw));
    d *= smoothstep(.5, 2.2, t) * smoothstep(13., 8.5, t) * uDensity;
    if (d > .003) {
      float hue = tx(pw * .031 + .37);
      vec3 tint = uTint * (.8 + .45 * hue);
      tint = mix(tint, mix(uPal[3], uPal[4], hue * .6), .12);
      // 군데군데 다른 팔레트 색이 비침
      float glimpse = smoothstep(.58, .74, tx(pw * .021 + .71));
      tint = mix(tint, pal(fract(tx(pw * .013 + .19) * 1.9)), glimpse * uAccent);
      float lum = dot(tint, vec3(.299, .587, .114));
      tint = mix(vec3(lum), tint, .85);
      float a = 1. - exp(-d * DT * .9);
      col += trans * a * tint * .6;
      trans *= 1. - a;
      if (trans < .03) break;
    }
    t += DT;
  }
  float vd = length((vUv - .5) * 2.);
  col *= 1. - min(uVignette * 1.25, 1.) * smoothstep(.3, 1., vd);
  col *= uFade;                                   // 스크롤 내려갈수록 까맣게
  col = 1. - exp(-col * 1.15);                    // 하이라이트는 눌러서 번지게
  col += (hash(gl_FragCoord.xy) - .5) / 255.;
  col = max(col, 0.);
  float a = min(max(col.r, max(col.g, col.b)), 1.);
  o = vec4(col + uBase * (1. - a), 1.);           // 배경색 위에 얹기
}`;

// 64×64×64 값 노이즈(4옥타브, 주기 4·8·16·32 → 이음새 없이 반복)
function makeNoise(N = 64) {
  const out = new Float32Array(N * N * N);
  const oct = [{ p: 4, a: .5 }, { p: 8, a: .27 }, { p: 16, a: .15 }, { p: 32, a: .08 }];
  const s = (x) => x * x * (3 - 2 * x);
  for (const { p, a } of oct) {
    const g = new Float32Array(p * p * p); for (let i = 0; i < g.length; i++) g[i] = Math.random();
    const at = (x, y, z) => g[((z % p) * p + (y % p)) * p + (x % p)];
    const k = p / N;
    for (let z = 0; z < N; z++) { const fz = z * k, z0 = fz | 0, tz = s(fz - z0);
      for (let y = 0; y < N; y++) { const fy = y * k, y0 = fy | 0, ty = s(fy - y0);
        for (let x = 0; x < N; x++) { const fx = x * k, x0 = fx | 0, tx = s(fx - x0);
          const a00 = at(x0, y0, z0) * (1 - tx) + at(x0 + 1, y0, z0) * tx, a10 = at(x0, y0 + 1, z0) * (1 - tx) + at(x0 + 1, y0 + 1, z0) * tx;
          const a01 = at(x0, y0, z0 + 1) * (1 - tx) + at(x0 + 1, y0, z0 + 1) * tx, a11 = at(x0, y0 + 1, z0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1, z0 + 1) * tx;
          out[(z * N + y) * N + x] += ((a00 * (1 - ty) + a10 * ty) * (1 - tz) + (a01 * (1 - ty) + a11 * ty) * tz) * a;
        } } } }
  const u8 = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) u8[i] = Math.max(0, Math.min(255, out[i] * 255));
  return u8;
}

// 색: 원본처럼 선형 색공간 값으로 넘긴다(그래서 실제 화면은 hex보다 어둡고 깊게 보임)
const lin = (h) => [1, 3, 5].map((i) => { const c = parseInt(h.slice(i, i + 2), 16) / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
const srgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export function initMist(host, {
  base = "#0c0c0c", tint = "#2f9bb5", palette = ["#CC4F8C", "#E4393C", "#23CF48", "#17FFFF", "#0646FF"],
  density = .5, accent = .455, vignette = .7, speed = .35, flow = 1.5, scrollBoost = 1, wakeRadius = .1,
  resolution = .5, maxPixels = 520000,
  fixed = true, fadeTo = null, fadeStart = .05, fadeEnd = .25,
} = {}) {
  const cv = document.createElement("canvas");
  cv.className = "mx-mist";
  cv.setAttribute("aria-hidden", "true");
  Object.assign(cv.style, fixed ? { position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh" } : { position: "absolute", inset: "0", width: "100%", height: "100dvh" }, { zIndex: "0", pointerEvents: "none", display: "block" });
  host.prepend(cv);
  const gl = cv.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" });
  if (!gl) { cv.style.background = base; return { ready: Promise.resolve(), destroy() { cv.remove(); } }; }

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn("안개 셰이더", gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const u = Object.fromEntries(["uRes", "uCursor", "uCursorVel", "uParallax", "uTime", "uTravel", "uFrame", "uFade"].map((n) => [n, U(n)]));
  gl.uniform1i(U("uNoise"), 0);
  gl.uniform3fv(U("uTint"), lin(tint)); gl.uniform3fv(U("uBase"), srgb(base));
  gl.uniform3fv(U("uPal"), palette.flatMap(lin));
  gl.uniform1f(U("uFade"), 1); gl.uniform1f(U("uDensity"), density); gl.uniform1f(U("uAccent"), accent); gl.uniform1f(U("uVignette"), vignette); gl.uniform1f(U("uWakeR"), wakeRadius);

  // 노이즈 텍스처는 다음 틈에 만든다(첫 그림을 막지 않게, 약 40ms)
  const ready = new Promise((res) => setTimeout(() => {
    const tex = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_3D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.R8, 64, 64, 64, 0, gl.RED, gl.UNSIGNED_BYTE, makeNoise(64));
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_R]) gl.texParameteri(gl.TEXTURE_3D, p, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    res();
  }, 0));

  // 크기: 화면의 절반 해상도, 52만 픽셀 넘지 않게(CSS로 늘려서 원래 크기로 보임)
  const size = () => {
    const w = cv.clientWidth || innerWidth, h = cv.clientHeight || innerHeight;
    const k = Math.min(resolution, Math.sqrt(maxPixels / (w * h)));
    cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
    gl.viewport(0, 0, cv.width, cv.height); gl.uniform2f(u.uRes, cv.width, cv.height);
  };
  size(); addEventListener("resize", size);

  // 커서: 위치는 부드럽게 따라가고, 속도는 멈추면 금방 0으로
  let mx = .5, my = .5, cx = .5, cy = .5, vx = 0, vy = 0, px = .5, py = .5;
  const move = (e) => { const r = cv.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = 1 - (e.clientY - r.top) / r.height; };
  addEventListener("pointermove", move, { passive: true });
  // 스크롤: 내리는 속도만큼 안개 속으로 더 나아감
  let lastY = scrollY, sv = 0;

  // 까매지는 구간: 위에서 fadeStart(화면 비율)만큼 내린 뒤부터 → fadeTo 요소 윗변이 화면 위 fadeEnd 지점에 올 때까지
  let f0 = 0, f1 = Infinity;
  const range = () => { if (!fadeTo) return; f0 = innerHeight * fadeStart; f1 = Math.max(f0 + 1, fadeTo.getBoundingClientRect().top + scrollY - innerHeight * fadeEnd); };
  range(); addEventListener("resize", range); addEventListener("load", range);
  const fadeAt = () => { if (!fadeTo) return 1; const x = Math.min(1, Math.max(0, (scrollY - f0) / (f1 - f0))); return 1 - x * x * (3 - 2 * x); };
  // 까맣게 다 꺼지면 그리기를 멈추고 숨긴다(아래 섹션을 덮지 않게) → 다시 올라오면 재개
  const onScroll = () => { const f = fadeAt(); cv.style.visibility = f <= 0 ? "hidden" : ""; if (f > 0 && on && !raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  addEventListener("scroll", onScroll, { passive: true });

  // 화면에 보일 때만 돈다
  let on = true, raf = 0, last = performance.now(), time = 0, travel = Math.random() * 20, frame = 0;
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } });
  io.observe(cv);
  const vis = () => { if (!document.hidden && on && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
  document.addEventListener("visibilitychange", vis);

  function loop(now) {
    raf = 0; if (!on || document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const ox = cx, oy = cy;
    cx += (mx - cx) * (1 - Math.exp(-dt * 6)); cy += (my - cy) * (1 - Math.exp(-dt * 6));
    const k = 1 - Math.exp(-dt * 3.5);
    vx += ((dt ? (cx - ox) / dt : 0) * .12 - vx) * k; vy += ((dt ? (cy - oy) / dt : 0) * .12 - vy) * k;
    px += (mx - px) * (1 - Math.exp(-dt * 1.5)); py += (my - py) * (1 - Math.exp(-dt * 1.5));
    const y = scrollY, r = dt > 0 ? Math.abs(y - lastY) / innerHeight / dt : 0; lastY = y; sv += (Math.min(r, 6) - sv) * .08;
    time += dt * flow; travel += dt * (speed * flow + sv * scrollBoost * 2.5); // flow: 가만히 있을 때 흐르는 속도 배수(원본 1) frame = (frame + 1) % 64;
    const fade = fadeAt(); gl.uniform1f(u.uFade, fade);
    gl.uniform1f(u.uTime, time); gl.uniform1f(u.uTravel, travel); gl.uniform1f(u.uFrame, frame);
    gl.uniform2f(u.uCursor, cx, cy); gl.uniform2f(u.uCursorVel, vx, vy);
    gl.uniform2f(u.uParallax, -(px - .5) * 2, (py - .5) * 2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (fade <= 0) { cv.style.visibility = "hidden"; return; }   // 다 까매짐: 멈춤
    raf = requestAnimationFrame(loop);
  }
  ready.then(() => { last = performance.now(); raf = requestAnimationFrame(loop); });

  return { canvas: cv, ready, refresh: () => { range(); onScroll(); }, destroy() { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", size); removeEventListener("pointermove", move); removeEventListener("scroll", onScroll); removeEventListener("resize", range); document.removeEventListener("visibilitychange", vis); cv.remove(); } };
}
