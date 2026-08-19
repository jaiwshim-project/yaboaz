(function () {
  'use strict';

  var SUPABASE_URL = 'https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';

  function session() {
    try {
      var raw = sessionStorage.getItem('kfde-auth-session');
      return raw ? JSON.parse(raw) : null;
    } catch (error) { return null; }
  }

  function materialKey(anchor) {
    var url = new URL(anchor.getAttribute('href'), window.location.href);
    if (url.pathname.endsWith('reference-materials.html')) return null;
    if (!url.pathname.endsWith('.html')) return null;
    return 'html:' + url.pathname + url.search;
  }

  function markCompleted(keys) {
    document.querySelectorAll('.stage-node-link, .hub-card a').forEach(function (anchor) {
      var key = materialKey(anchor);
      if (!key || !keys[key]) return;
      anchor.classList.add('roadmap-completed');
      anchor.setAttribute('data-learning-completed', 'true');
      anchor.setAttribute('title', '학습 완료');
    });
  }

  function init() {
    var auth = session();
    if (!auth || !auth.access_token) return;
    fetch(SUPABASE_URL + '/rest/v1/rpc/lms_get_my_material_progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + auth.access_token },
      body: JSON.stringify({ p_material_key: null })
    }).then(function (response) {
      return response.ok ? response.json() : [];
    }).then(function (rows) {
      var completed = {};
      (rows || []).forEach(function (row) {
        if (row.status === 'completed') completed[row.material_key] = true;
      });
      markCompleted(completed);
    }).catch(function () {});
  }

  var style = document.createElement('style');
  style.textContent = '.stage-node-link,.hub-card a{position:relative}.roadmap-completed:after{content:"";position:absolute;left:0;right:0;top:50%;height:3px;background:#e11;transform:translateY(-50%);z-index:2;pointer-events:none}.roadmap-completed{border-radius:6px}';
  document.head.appendChild(style);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
