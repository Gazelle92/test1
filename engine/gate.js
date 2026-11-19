// 매니저(hm-office)에 올린 모듈 창고 화면의 입장 확인 (로컬 개발 서버에서는 검사하지 않음)
//   매니저 로그인 또는 "모듈 창고 전용 비밀번호"(MODULES_PASSWORD)로 들어올 수 있다.
//   전용 비밀번호로 들어온 사람은 창고·조립·무드만 쓰고, 매니저 다른 앱은 못 들어간다.
const BASE = import.meta.env.BASE_URL;

export function gate() {
  if (BASE === "/") return Promise.resolve({ loggedIn: true, manager: true, local: true });
  document.documentElement.style.visibility = "hidden";
  return fetch("/api/session?scope=modules").then((r) => r.json()).catch(() => ({})).then((s) => {
    document.documentElement.style.visibility = "";
    if (!s.loggedIn) showLogin();
    return s;
  });
}

function showLogin() {
  const box = document.createElement("div");
  box.id = "gate";
  box.innerHTML = `<style>
#gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#f4f4f2;font:15px/1.5 -apple-system,'Apple SD Gothic Neo',sans-serif;color:#1a1a1a}
#gate form{width:min(340px,86vw);display:flex;flex-direction:column;gap:12px;padding:28px;border-radius:16px;background:#fff;box-shadow:0 20px 60px rgba(0,0,0,.08)}
#gate h1{margin:0;font-size:20px}#gate p{margin:0;color:#777;font-size:13px}
#gate input{padding:12px;border:1px solid #ddd;border-radius:10px;font:inherit}
#gate button{padding:12px;border:0;border-radius:10px;background:#1a1a1a;color:#fff;font:inherit;font-weight:600;cursor:pointer}
#gate .err{color:#d33;min-height:1em;font-size:13px}#gate a{color:#999;font-size:12px;text-align:center}
</style>
<form>
  <h1>모듈 창고</h1>
  <p>전달받은 비밀번호를 넣어 주세요.</p>
  <input type="password" name="modules-pass" autocomplete="off" placeholder="비밀번호" required>
  <button type="submit">들어가기</button>
  <div class="err"></div>
  <a href="/manager?next=modules" target="_top">매니저 계정으로 들어가기</a>
</form>`;
  document.body.appendChild(box);
  const form = box.querySelector("form"), input = box.querySelector("input"), err = box.querySelector(".err");
  input.focus();
  form.onsubmit = async (e) => {
    e.preventDefault();
    err.textContent = "";
    const r = await fetch("/api/session?scope=modules", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: input.value }) }).catch(() => null);
    if (r && r.ok) return location.reload();
    const d = r ? await r.json().catch(() => ({})) : {};
    err.textContent = d.error || "잠시 뒤 다시 해 주세요.";
  };
}
