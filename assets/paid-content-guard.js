(function () {
  'use strict';
  var SUPABASE_URL = 'https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';
  var session = null;
  try { session = JSON.parse(sessionStorage.getItem('kfde-auth-session') || 'null'); } catch (error) { session = null; }

  function mount(message) {
    if (document.querySelector('.paid-lock')) return;
    var style = document.createElement('style');
    style.textContent = '.paid-lock{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;padding:24px;background:rgba(9,29,46,.84);backdrop-filter:blur(10px)}.paid-lock-card{width:min(540px,100%);padding:38px;border-radius:22px;background:#fff;color:#172636;box-shadow:0 24px 80px rgba(0,0,0,.25);text-align:center;font-family:Arial,"Noto Sans KR",sans-serif}.paid-lock-kicker{color:#08a9b4;font-size:11px;font-weight:900;letter-spacing:.15em}.paid-lock-card h1{margin:13px 0 8px;color:#102a43;font-size:30px}.paid-lock-card p{color:#687888;line-height:1.7}.paid-lock-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:24px 0}.paid-lock-actions a{padding:12px 16px;border-radius:10px;background:#0f8b8d;color:#fff;text-decoration:none;font-weight:800}.paid-lock-actions a+a{background:#edf5f8;color:#1976a8}.paid-lock-card small{color:#8796a3;line-height:1.6}';
    document.head.appendChild(style);
    var box = document.createElement('div');
    box.className = 'paid-lock';
    box.innerHTML = '<div class="paid-lock-card"><div class="paid-lock-kicker">YABOAZ · PAID MEMBER AREA</div><h1>유료 회원 전용 콘텐츠</h1><p>' + message + '</p><div class="paid-lock-actions"><a href="/index-ko.html?auth=login">로그인·회원가입</a><a href="/index-ko.html">공개 홈페이지</a></div><small>입금 확인 후 관리자가 발급한 10자리 액세스코드로 가입해야 합니다.</small></div>';
    document.body.appendChild(box);
  }

  function checkMembership() {
    if (!session || !session.access_token || !session.user || !session.user.id) return Promise.reject(new Error('login'));
    var path = '/rest/v1/yaboaz_member_profiles?select=status&user_id=eq.' + encodeURIComponent(session.user.id) + '&limit=1';
    return fetch(SUPABASE_URL + path, {
      headers: {'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + session.access_token}
    }).then(function (response) {
      if (!response.ok) throw new Error('membership');
      return response.json();
    }).then(function (rows) {
      var status = rows && rows[0] && rows[0].status;
      if (status === 'pending' || status === 'approved') return true;
      throw new Error(status === 'blocked' || status === 'rejected' ? 'blocked' : 'membership');
    });
  }

  function run() {
    fetch('/api/admin-session.js', { credentials: 'same-origin' }).then(function (response) { return response.json(); }).then(function (admin) { if (admin.authenticated) return true; return checkMembership(); }).then(function () {
      document.documentElement.classList.add('paid-content-authenticated');
    }).catch(function (reason) {
      if (reason && reason.message === 'blocked') mount('현재 계정은 관리자에 의해 이용이 제한되었습니다. 관리자에게 문의해 주세요.');
      else if (reason && reason.message === 'login') mount('13단계 실행 플랫폼과 FDE 교육 콘텐츠는 액세스코드로 가입한 유료 회원만 이용할 수 있습니다.');
      else mount('유료 회원 상태를 확인하지 못했습니다. 액세스코드 가입 후 다시 로그인해 주세요.');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();