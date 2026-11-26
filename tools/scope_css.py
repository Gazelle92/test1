# 원본 CSS 파일 글자 그대로를 [data-mx="이름"] 아래로 가둔다 (브라우저 CSSOM으로 옮기면 var()가 든 줄임 속성이 빈 값이 되는 문제가 있어서 글자 단위로 처리)
# 사용: python3 tools/scope_css.py 입력.css 이름 원본host > 출력.css
import re, sys
def split_blocks(s):
    i, n, out = 0, len(s), []
    while i < n:
        j = s.find('{', i)
        if j < 0: break
        pre = s[i:j].strip(); d = 1; k = j + 1
        while k < n and d:
            c = s[k]
            if c in '"\'':
                q = c; k += 1
                while k < n and s[k] != q: k += 2 if s[k] == '\\' else 1
            elif c == '{': d += 1
            elif c == '}': d -= 1
            k += 1
        out.append((pre, s[j + 1:k - 1])); i = k
    return out
def scope_sel(sel, sc):
    parts = []
    for p in re.split(r',(?![^()]*\))', sel):
        p = p.strip()
        if not p: continue
        m = re.match(r'^(:root|html|body|:host)((?:[.:\[][^\s>+~]*)?)(\s*[>+~]?\s*body((?:[.:\[][^\s>+~]*)?))?(.*)$', p)
        if m:
            state = (m.group(2) or '') + (m.group(4) or '')
            rest = m.group(5).strip()
            if re.match(r'^::?(before|after)$', state or ''): parts.append(f'{sc}{state}' + ((" " + rest) if rest else "")); continue
            if state and not state.startswith(('::', ':root')):  # html.상태클래스 → 상태는 진짜 html에, 나머지는 상자 안
                parts.append(f'html{m.group(2) or ""} {sc}{(" " + rest) if rest else ""}'.strip()); continue
            parts.append(sc + ((" " + rest) if rest else "")); continue
        m2 = re.match(r'^:(is|where)\((html[^)]*)\)\s*(.*)$', p)  # :where(html.상태) .x → html.상태 [상자] .x
        if m2: parts.append(f'{m2.group(2)} {sc} {m2.group(3)}'.strip()); continue
        parts.append(f'{sc} {p}')
    return ','.join(parts)
def decl_fix(d, host):
    d = re.sub(r'url\((["\']?)(/(?!/)[^"\')]+)\1\)', lambda m: f'url("/__clone-proxy/{host}{m.group(2)}")', d)
    d = re.sub(r'(?<![\w.\\\[-])(-?\d*\.?\d+)rem\b', r'calc(\1 * var(--mxrem))', d)
    d = re.sub(r'(?<![\w.\\\[-])(-?\d*\.?\d+)vw\b', r'calc(\1 * var(--mxvw, 1vw))', d)
    return d
def walk(s, sc, host):
    out = []
    for pre, body in split_blocks(s):
        if pre.startswith('@'):
            if re.match(r'@(media|supports|layer|container|document)', pre): out.append(pre + '{' + walk(body, sc, host) + '}')
            elif pre.startswith('@font-face'): out.append(pre + '{' + re.sub(r'url\((["\']?)(/(?!/)[^"\')]+)\1\)', lambda m: f'url("/__clone-proxy/{host}{m.group(2)}")', body) + '}')
            else: out.append(pre + '{' + body + '}')
        else:
            out.append(scope_sel(pre, sc) + '{' + decl_fix(body, host) + '}')
    return '\n'.join(out)
if __name__ == '__main__':
    src, name, host = sys.argv[1], sys.argv[2], sys.argv[3]
    css = re.sub(r'/\*[\s\S]*?\*/', '', open(src, encoding='utf-8').read())
    sc = f'[data-mx="{name}"]'
    print(f'/* {name}: {host} 원본 CSS 전체(글자 그대로, 선택자만 상자 안으로) */')
    print(walk(css, sc, host))
