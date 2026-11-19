# 원본(_capture/raw.html)에서 섹션별 페이지를 만든다: python3 make_sections.py
# 공통(로딩 화면·머리글·예약 버튼·팝업·스타일)은 모든 페이지에 남기고, 본문 섹션만 골라 남긴다.
import os, json
here = os.path.dirname(os.path.abspath(__file__))
raw = open(os.path.join(here, '_capture', 'raw.html'), encoding='utf-8').read()

# 원본 [data-barba="container"]의 자식 순서: 0 로딩 화면, 1 머리글, 2 히어로, 3 기체, 4 기체(모바일),
# 5 서비스, 6 국가·시간 띠, 7 글로벌, 8 예약 버튼, 9·10 팝업, 11 스타일
BODY = [2, 3, 4, 5, 6, 7]
SECTIONS = [
  ("01-hero",    "히어로", [2],    "창문 → 구름 → 소개 문구로 이어지는 첫 화면"),
  ("02-fleet",   "기체",   [3, 4], "Fly in Luxury → 비행기 등장 → 기내 배치도 일러스트 + 제원",
   # 원본에선 앞 히어로와 900px(100vh) 겹치게 위로 당겨져 있음 → 따로 볼 땐 겹침을 푼다
   ".jet_scroll-area{margin-top:0!important}"),
  ("03-service", "서비스", [5, 6], "A better way to fly — 아코디언 + 기내 사진 + 아래 국가 수·두바이 시각 띠"),
  ("04-global",  "글로벌", [7],    "Fly anywhere 도시 목록 + 5K+ flights·지구본 + 마지막 연락처"),
]
ANCHOR = '<script src="https://d3e54v103j8qbb'
assert raw.count(ANCHOR) == 1
html_tag = raw.replace('<html ', '<html data-clone="raw" ', 1)
list_out = []
for slug, title, keep, desc, *fix in SECTIONS:
    drop = [i for i in BODY if i not in keep]
    js = ('<script data-clone="sections">(()=>{const c=document.querySelector(\'[data-barba="container"]\');'
          'const k=[...c.children];' + json.dumps(drop) + '.forEach(i=>k[i]&&k[i].remove());'
          'addEventListener("load",()=>[1500,3000,5000].forEach(t=>setTimeout(()=>window.ScrollTrigger&&ScrollTrigger.update(),t)));'
          'document.currentScript.remove();})()</script>')
    # 원본은 앞 섹션을 지나오며 등장 효과가 켜지는데, 맨 위에서 시작하면 스크롤 전까지 안 켜져서 불러온 뒤 한 번 다시 계산한다
    out = html_tag.replace(ANCHOR, js + ANCHOR, 1)
    if fix: out = out.replace('</head>', '<style data-clone="section-fix">' + fix[0] + '</style></head>', 1)
    out = out.replace('<title>Jesko Jets</title>', f'<title>Jesko Jets · {title}</title>', 1)
    d = os.path.join(here, slug); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(out)
    list_out.append({"slug": slug, "title": title, "desc": desc})
json.dump(list_out, open(os.path.join(here, 'sections.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', [s[0] for s in SECTIONS])
