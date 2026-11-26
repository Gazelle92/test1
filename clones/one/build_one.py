# 한 페이지(iframe 없음) 조립: python3 clones/one/build_one.py  (프로젝트 폴더에서)
# tools/mx-capture.js 로 뽑은 _capture/{site}.html·.css 를 [data-mx="site"] 상자에 넣어 pages/one/index.html 을 만든다.
import os, time
V = str(int(time.time()))  # 개발 서버가 바뀐 파일을 놓치는 경우가 있어 주소에 버전을 붙인다
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(os.path.dirname(here))
SITES = [("trionn", "https://trionn.com/ 첫 검은 영역(헤더 포함)~회색 전환 끝"),
         ("apekon", "https://apekon.com/ #products 카드 3장"),
         ("focus", "https://www.focusindustries.tech/ #domains~푸터")]
import re
def apekon_full():
    # apekon은 원본 스크립트를 그대로 돌린다 → 스크립트가 찾는 바깥 구조(로딩 화면·WebGL 상자·page-wrapper·barba container)를 원본 그대로 두고 #products만 남긴다
    from bs4 import BeautifulSoup
    raw = open(os.path.join(os.path.dirname(here), "apekon", "_capture", "raw.html"), encoding="utf-8").read()
    b = BeautifulSoup(raw, "lxml").body
    # 원본 홈 구조를 통째로 둔다(원본 시작 코드가 hero·footer 등을 찾음) → #products 말고는 one.css에서 숨김
    keep = [c for c in b.find_all(recursive=False) if c.name not in ("script", "noscript")]
    main = b.select_one("#content")
    if main.has_attr("data-scroll-loop"): del main["data-scroll-loop"]  # 원본은 페이지 끝에서 처음으로 이어짐 → 한 페이지에서는 끔
    html = "\n".join(str(c) for c in keep)
    return re.sub(r'(src|href|poster)="/(?!/|__clone-proxy)', r'\1="/__clone-proxy/apekon.com/', html)
body = []
for s, desc in SITES:
    h = apekon_full() if s == "apekon" else open(os.path.join(here, "_capture", s + ".html"), encoding="utf-8").read()
    body.append(f'<!-- {desc} -->\n<div class="mx-sec" data-mx="{s}">\n{h}\n</div>')
links = "\n".join(f'<link rel="stylesheet" href="/clones/one/_capture/{s}.css?v={V}">' for s, _ in SITES)
html = f'''<!doctype html>
<html lang="en" class="mx-preloading">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>mix-01 · 한 페이지</title>
<!-- 3단계 · 안 쓰는 리소스 막기: 원본 코드가 부르지만 이 페이지에서는 쓰지 않는 파일 (화면·기능에는 영향 없음)
     · /assets/hero-spark.mp3, hover-beep.mp3 : trionn 심볼 효과음(소리는 꺼 둠) 각 0.9MB
     · /models/andreas-head.glb, emblem.glb   : 숨겨 둔 apekon 소개·푸터 섹션 3D 모델
     · /sounds/*.ogg                          : apekon 배경음(소리 꺼 둠) · sw.js 서비스워커 등록도 하지 않음 -->
<script>(()=>{{const B=[/\\.(mp3|ogg)(\\?|$)/i,/\\/models\\/(andreas-head|emblem)\\.glb/i];const no=u=>{{try{{u=String(u&&u.url||u)}}catch{{return!1}}return B.some(r=>r.test(u))}};
window.__mxBlocked=[];const f=window.fetch;window.fetch=function(u,o){{if(no(u)){{__mxBlocked.push(String(u&&u.url||u));return Promise.reject(new TypeError("mx: 안 쓰는 리소스라 받지 않음"))}}return f.apply(this,arguments)}};
const op=XMLHttpRequest.prototype.open,sd=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(m,u){{this.__mxNo=no(u);if(this.__mxNo)__mxBlocked.push(String(u));return op.apply(this,arguments)}};
if(navigator.serviceWorker){{navigator.serviceWorker.register=()=>Promise.resolve({{scope:location.origin+"/",active:null,unregister:()=>Promise.resolve(!0)}})}};
XMLHttpRequest.prototype.send=function(){{if(this.__mxNo){{setTimeout(()=>{{this.dispatchEvent(new ProgressEvent("error"));this.onerror&&this.onerror(new ProgressEvent("error"))}});return}}return sd.apply(this,arguments)}};}})();</script>
<!-- 3단계 · 처음 미리 불러오기 화면: 첫 그림부터 보이도록 스타일을 문서 안에 둔다 -->
<style>
#mx-pre{{position:fixed;inset:0;z-index:10000;background:#040508;color:#d8d8d8;display:flex;flex-direction:column;justify-content:flex-end;padding:0 var(--g-pad,36px) calc(var(--g-pad,36px) * 1.2);font:400 14px/1.2 "Helvetica Neue",Arial,sans-serif;letter-spacing:.02em;transition:opacity .6s cubic-bezier(.33,1,.68,1),visibility 0s linear .6s}}
#mx-pre .n{{font-size:clamp(64px,12vw,180px);line-height:.85;letter-spacing:-.04em;font-variant-numeric:tabular-nums}}
#mx-pre .row{{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;opacity:.6;text-transform:uppercase;font-size:12px}}
#mx-pre .bar{{height:1px;background:rgba(216,216,216,.18);overflow:hidden}}#mx-pre .bar i{{display:block;height:100%;background:#d8d8d8;transform-origin:0 50%;transform:scaleX(0)}}
#mx-pre.done{{opacity:0;visibility:hidden;pointer-events:none}}
html.mx-preloading,html.mx-preloading body{{overflow:hidden!important}}
</style>
{links}
<link rel="stylesheet" href="./one.css?v={V}">
<link rel="stylesheet" href="./grid.css?v={V}">
</head>
<body class="loading" data-barba="wrapper">
<div id="mx-pre" aria-live="polite"><div class="row"><span>mix-01</span><span class="t">Loading</span></div><div class="n">0</div><div class="bar"><i></i></div></div>
{chr(10).join(body)}
<!-- apekon 원본 스크립트: 원본처럼 문서 읽기와 같은 때 실행(늦게 불러오면 시작 코드가 돌지 않음). 만든 Lenis(window.lenis)를 페이지 전체가 같이 씀.
     배포 빌드(vite build)가 이 주소를 묶으려다 실패하지 않도록 작은 스크립트가 그 자리에 태그를 써 넣는다 -->
<script>document.write('<script type="module" src="/__clone-proxy/apekon.com/assets/script-aGaCdSjC.js"><\\/script>')</script>
<div id="mx-ui"></div>
<script type="module" src="./one.js?v={V}"></script>
</body>
</html>
'''
os.makedirs(os.path.join(root, "pages", "one"), exist_ok=True)
open(os.path.join(root, "pages", "one", "index.html"), "w", encoding="utf-8").write(html)
print("ok", len(html))
