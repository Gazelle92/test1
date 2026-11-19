# deltacafes 복제본 만들기: 전체 페이지(index.html) + 섹션 페이지
# 원본은 Nuxt(Vue) 앱이라 원본 앱을 그대로 실행한다((C) 방식). 섹션 페이지는 다른 섹션을 CSS로 숨긴다
# (DOM을 지우면 Vue가 서버 화면과 다르다며 다시 그리므로 지우지 않는다).
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
raw = open(os.path.join(HERE, "_capture", "raw.html"), encoding="utf-8").read()

s = raw
# 분석 스크립트(GTM) 미리 불러오기 줄 제거 — 파일 자체도 개발 서버가 빈 파일로 막는다
s = re.sub(r'<link href="/_scripts/[^"]*"[^>]*>', "", s)
# 파비콘·매니페스트는 원본 절대 주소로
s = re.sub(r'href="/(favicon[^"]*|apple-touch-icon[^"]*|site\.webmanifest)"', r'href="https://deltacafes.com/\1"', s)

# 앱이 원본 홈(/en)을 그리도록 주소를 잠시 /en 으로 바꿨다가 3.5초 뒤(늦어도 8초 뒤) 되돌린다. 실행 즉시 스스로 지운다.
PATH = ('<script data-clone="path">(function(){var real=location.pathname+location.search+location.hash;'
        'history.replaceState(history.state,"","/en");'
        'var done=0;function back(){if(done)return;done=1;history.replaceState(history.state,"",real)}'
        'addEventListener("load",function(){setTimeout(back,3500)});setTimeout(back,8000);'
        'var me=document.currentScript;me&&me.remove();})();</script>')

# 원본 구조: .slot-wrapper > header(히어로) · main(섹션 7개) · footer
SEC = lambda i: f".slot-wrapper > main > section:nth-of-type({i})"
ALL = [".slot-wrapper > header", *[SEC(i) for i in range(1, 8)], ".slot-wrapper > footer"]
SECTIONS = [
    ("01-hero", "히어로", "제품 캐러셀과 세 가지 이야기(01·02·03)가 넘어가는 첫 화면", [".slot-wrapper > header"]),
    ("02-history", "역사", "Since 1961 — 연도별 사진과 역사 이야기", [SEC(1)]),
    ("03-journey", "커피의 여정", "Origins · Roast · Blend · Tasting 단계 전환", [SEC(2)]),
    ("04-magazine", "매거진", "D de Delta 디지털 매거진 소개와 이미지", [SEC(3)]),
    ("05-culture", "커피 문화", "The Culture of Coffee 문화·전통 소개", [SEC(4)]),
    ("06-quiz", "퀴즈", "나의 커피 취향 찾기 퀴즈 안내", [SEC(5)]),
    ("07-journal", "저널", "The Coffee Journal 기사 카드 목록", [SEC(6)]),
    ("08-closing", "지속가능성·푸터", "Sustainability 소개 + 흐르는 글자 띠와 푸터", [SEC(7), ".slot-wrapper > footer"]),
]


# 원본 서버가 다른 주소에서 못 쓰게 막은 파일(효과음 mp3, Rive 애니메이션)은 개발 서버가 대신 받아 오게 주소를 바꾼다
FIX = ('<script data-clone="fetch">(function(){var H=/^https:\\/\\/(burospaces1\\.fra1\\.cdn\\.digitaloceanspaces\\.com|cdn\\.sanity\\.io)\\//;'
       'function rw(u){var s=String(u&&u.url||u);return H.test(s)?s.replace(/^https:\\/\\//,"/__clone-proxy/"):null}'
       'var f=window.fetch;window.fetch=function(i,o){var r=rw(i);if(r)i=(i instanceof Request)?new Request(r,i):r;return f.call(this,i,o)};'
       'var op=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(m,u){var r=rw(u);if(r)arguments[1]=r;return op.apply(this,arguments)};'
       'var me=document.currentScript;me&&me.remove();})();</script>')


def page(extra="", title=None):
    h = s.replace("<head>", "<head>" + PATH + FIX + extra, 1)
    if title:
        h = re.sub(r"<title>.*?</title>", "<title>%s</title>" % title, h, count=1, flags=re.S)
    return h


open(os.path.join(HERE, "index.html"), "w", encoding="utf-8").write(page())
meta = []
for slug, name, desc, keep in SECTIONS:
    drop = [x for x in ALL if x not in keep]
    css = '<style data-clone="section-fix">%s{display:none!important}</style>' % ",".join(drop)
    os.makedirs(os.path.join(HERE, slug), exist_ok=True)
    open(os.path.join(HERE, slug, "index.html"), "w", encoding="utf-8").write(page(css, "Delta Cafés · " + name))
    meta.append({"slug": slug, "title": name, "desc": desc})
json.dump(meta, open(os.path.join(HERE, "sections.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", len(meta))
