# mix-01 복제본 만들기: python3 clones/mix_build.py  (프로젝트 폴더에서)
# trionn·apekon·focus 원본(_capture/raw.html)을 원본 엔진 그대로 돌리는 복제본으로 바꾸고,
# 실장님이 정한 범위만 남긴 섹션 페이지를 만든다.  /clones/{site}/ (전체) · /clones/{site}/{slug}/ (섹션)
# 원본이 부르는 /_next/ · /assets/ · /fonts/ 등은 vite.config.js 의 mixRoute 가 원본 서버에서 받아 온다.
import os, re, json
here = os.path.dirname(os.path.abspath(__file__))

# Next.js(trionn)는 주소가 "/"가 아니면 다른 화면을 그린다 → 잠시 "/"로 바꿨다가 3.5초 뒤 되돌린다. 실행 즉시 스스로 지운다.
PATH_FIX = ('<script data-clone="path">(function(){var p=location.pathname+location.search+location.hash;'
            'history.replaceState(history.state,"","/");setTimeout(function(){history.replaceState(history.state,"",p)},3500);'
            'var s=document.currentScript;s&&s.remove()})()</script>')
MARK = '<meta data-clone="mix">'

def clean(site, h):
    if site == 'trionn':
        h = h.replace('<head>', '<head>' + PATH_FIX, 1)
    else:
        h = h.replace('<head>', '<head>' + MARK, 1)
    if site == 'apekon':
        # 분석·쿠키 배너만 뺀다
        h = re.sub(r'<script>\s*window\.dataLayer[\s\S]*?</script>', '', h, count=1)
        h = re.sub(r'<script>\s*\(function \(w, d, s, l, i\)[\s\S]*?</script>', '', h, count=1)
        h = re.sub(r'<script src="/cookie/cookieconsent\.js" defer></script>', '', h, count=1)
        h = re.sub(r'<noscript><iframe src="https://www\.googletagmanager[\s\S]*?</noscript>', '', h)
    return h

# 섹션 범위: keep = 남길 것, hide = 숨길 것(CSS), range = 섹션 안 스크롤 구간(px, None=끝까지) — 조립 페이지가 이 구간만 쓴다
SECTIONS = {
  'trionn': [("01-hero", "히어로 · about · 비전(회색 전까지)", "https://trionn.com/ 첫 검은 영역(#hero-section)~회색 띠 직전",
              "main>*:not(#hero-section),footer{display:none!important}", None)],
  'apekon': [("01-products", "Ideas, put to work. 카드 3장", "https://apekon.com/ #products 카드 3장이 쌓이는 부분",
              "", None)],
  'focus':  [("01-domains", "Domains. ~ 끝", "https://www.focusindustries.tech/ Domains.부터 끝까지",
              "", None)],
}
EXTRA = json.load(open(os.path.join(here, 'mix_sections.json'), encoding='utf-8')) if os.path.exists(os.path.join(here, 'mix_sections.json')) else {}

for site, secs in SECTIONS.items():
    raw = open(os.path.join(here, site, '_capture', 'raw.html'), encoding='utf-8').read()
    full = clean(site, raw)
    open(os.path.join(here, site, 'index.html'), 'w', encoding='utf-8').write(full)
    lst = []
    for slug, title, desc, hide, rng in secs:
        x = EXTRA.get(f'{site}/{slug}', {})
        hide = x.get('hide', hide); rng = x.get('range', rng)
        css = '<style data-clone="section-fix">' + hide + x.get('css', '') + '</style>'
        js = ''
        if rng:
            js = '<script data-clone="range">window.__cloneRange=function(){return ' + json.dumps(rng) + '}</script>'
        out = full.replace('</head>', css + js + '</head>', 1)
        d = os.path.join(here, site, slug); os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(out)
        lst.append({"slug": slug, "title": title, "desc": desc})
    json.dump(lst, open(os.path.join(here, site, 'sections.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok')
