# breakthroughenergy 복제본 만들기: 전체 페이지(index.html) + 섹션 페이지
# 원본 홈은 높이 약 27화면짜리 스크롤 한 줄에 장면이 겹쳐 있어, 섹션은 "스크롤 구간"으로 나눈다.
# 섹션 페이지 = 같은 원본 앱 + 그 구간에서 시작하고 그 구간 안에서만 스크롤되게 막는 스크립트.
# 구간 단위는 화면 높이(lvh). 원본 코드의 장면 시작값(ki=5.6 기준)을 그대로 따른다.
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, "_capture", "clean.html"), encoding="utf-8").read()

# 뺀 분석 스크립트(Adobe)가 만들던 BTEDL을 빈 함수로 대신 둔다(없으면 홈 코드가 중간에 멈춤).
# 앱이 홈 화면을 그리도록 주소를 잠시 "/"로 바꿨다가 3.5초 뒤(늦어도 8초 뒤) 되돌린다. 실행 즉시 스스로 지운다.
PATH = ('<script data-clone="path">(function(){window.BTEDL=window.BTEDL||{newPage:function(){}};var real=location.pathname+location.search+location.hash;'
        'history.replaceState(history.state,"","/");'
        'var done=0;function back(){if(done)return;done=1;history.replaceState(history.state,"",real)}'
        'addEventListener("load",function(){setTimeout(back,3500)});setTimeout(back,8000);'
        'var me=document.currentScript;me&&me.remove();})();</script>')

# 섹션 구간 고정: 원본 Lenis(앱의 scroll 저장소)를 찾아 구간 밖으로 못 가게 한다.
# window.__cloneRange()는 원본 섹션 조립기(engine/compose.js)가 이 구간(px)을 읽는 데 쓴다.
RANGE = ('<script data-clone="range">(function(){var R=[%s,%s];var t0=Date.now();'
         'window.__cloneRange=function(){var h=innerHeight;return [R[0]*h,R[1]==null?null:R[1]*h]};'
         'function lenis(){var el=document.getElementById("app");var a=el&&el.__vue_app__;if(!a)return null;'
         'var s=a.config.globalProperties.$pinia&&a.config.globalProperties.$pinia._s.get("scroll");return s&&s.lenis;}'
         'var iv=setInterval(function(){var L=lenis();if(!L)return;clearInterval(iv);setup(L)},50);'
         'function setup(L){var orig=L.scrollTo.bind(L);'
         'function lim(t){var h=innerHeight,min=R[0]*h,max=R[1]==null?L.limit:Math.min(L.limit,R[1]*h);return Math.max(min,Math.min(max,t))}'
         'L.scrollTo=function(t,o){if(typeof t==="number")t=lim(t);return orig(t,o)};'
         'function fix(){var c=lim(L.scroll);if(Math.abs(c-L.scroll)>1)orig(c,{immediate:true,force:true})}'
         'L.on("scroll",fix);addEventListener("scroll",fix);'
         'var k=setInterval(function(){if(Date.now()-t0>7000){clearInterval(k);return}fix()},200);}'
         'var me=document.currentScript;me&&me.remove();})();</script>')

KI = 5.6
SECTIONS = [
    ("01-hero", "히어로·소용돌이", "Empowering innovators 영상 문구 → 사진이 소용돌이치며 Energy is prosperity", 0, KI - 0.15),
    ("02-opportunity", "그래프·이미지", "The opportunity ahead 전력 수요 그래프 → 사진 겹치기", KI - 0.15, KI + 4.5),
    ("03-quote", "인용", "빌 게이츠 인용문과 영상 버튼", KI + 4.5, KI + 5.5),
    ("04-keyareas", "다섯 분야", "제조·전기·농업·교통·건물 분야와 회사 수", KI + 5.5, KI + 15.3),
    ("05-approach", "접근 방식", "DISCOVER · DEVELOP · DEPLOY 애니메이션", KI + 15.3, None),
]


def page(extra, title=None):
    h = src.replace("<head>", "<head>" + PATH + extra, 1)
    if title:
        h = re.sub(r"<title>.*?</title>", "<title>%s</title>" % title, h, count=1, flags=re.S)
    return h


open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(page(""))
meta = []
for slug, name, desc, a, b in SECTIONS:
    os.makedirs(os.path.join(HERE, slug), exist_ok=True)
    rng = RANGE % (round(a, 2), "null" if b is None else round(b, 2))
    open(os.path.join(HERE, slug, "index.html"), "w", encoding="utf-8").write(page(rng, "Breakthrough Energy · " + name))
    meta.append({"slug": slug, "title": name, "desc": desc})
json.dump(meta, open(os.path.join(HERE, "sections.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", len(meta))
