# 복제본(index.html)에서 섹션별 페이지를 만든다: python3 make_sections.py
# 머리글은 모든 페이지에 남기고, main 안의 섹션(과 footer)만 골라 남긴다.
import os, json
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'index.html'), encoding='utf-8').read()

ALL = ['.h-hero', '.h-collection', '.h-trust', '.h-texts', '.h-cards', '.h-features',
       '.s-pricing', '.h-testis', '.h-about', '.h-showcase', '.h-freebies', 'main > footer']
SECTIONS = [
  ("01-hero",       "히어로",          ['.h-hero'], "Unique JS effects ready to use — 가운데 영상 카드와 큰 제목"),
  ("02-collection", "컬렉션·사용 팀",  ['.h-collection', '.h-trust'], "Better websites… 효과 예시 카드 3개 + 1,800+ 사용 팀 로고"),
  ("03-effects",    "효과 수·카드",    ['.h-texts', '.h-cards'], "126+ effects 글자 등장 → 카드가 날아오며 글자가 흩어지는 고정 스크롤",
   # 원본에선 앞 섹션(사용 팀 로고)과 315px 겹치게 당겨져 있음 → 따로 볼 땐 겹침을 푼다
   ".h-texts{margin-top:0!important}"),
  ("04-features",   "기능",            ['.h-features'], "Made to fit your workflow — Webflow 복사·AI 프롬프트 등 기능 소개"),
  ("05-pricing",    "가격",            ['.s-pricing'], "One Plan. Everything included — 분기·연간 요금 전환"),
  ("06-community",  "후기·제작자",     ['.h-testis', '.h-about'], "커뮤니티 후기 + Behind the project 제작자 소개"),
  ("07-showcase",   "쇼케이스",        ['.h-showcase'], "수상 사이트·프로젝트 쇼케이스"),
  ("08-closing",    "무료 효과·마무리", ['.h-freebies', 'main > footer'], "무료 효과 안내 + 가입 유도 푸터"),
]
ANCHOR = '<script src="https://madewithgsap.com/assets/landing/gsap.js"'
assert src.count(ANCHOR) == 1 and 'data-clone=' in src
out_list = []
for slug, title, keep, desc, *fix in SECTIONS:
    drop = [s for s in ALL if s not in keep]
    # 원본 홈 코드가 섹션을 차례로 찾다가 하나라도 없으면 멈추므로, 지우지 않고 화면에서만 숨긴다
    hide = ','.join(drop) + '{display:none!important}'
    js = ''
    out = src.replace(ANCHOR, js + ANCHOR, 1)
    out = out.replace('</head>', '<style data-clone="section-fix">' + hide + (fix[0] if fix else '') + '</style></head>', 1)
    out = out.replace('<title>Made With Gsap</title>', f'<title>Made With Gsap · {title}</title>', 1)
    d = os.path.join(here, slug); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(out)
    out_list.append({"slug": slug, "title": title, "desc": desc})
json.dump(out_list, open(os.path.join(here, 'sections.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', len(out_list))
