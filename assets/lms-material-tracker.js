(function () {
  'use strict';

  var SUPABASE_URL = 'https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';
  var session = null;
  var current = null;
  var refs = {
    'field': 'YABOAZ Field Execution OS',
    'blueprint': 'YABOAZ AX Blueprint',
    'platform': 'YABOAZ Field Execution Platform',
    'language': 'YABOAZ 현장 언어를 실행 가능한 자산으로',
    'pdf01': 'K-FDE 플랫폼 개요',
    'pdf02': 'Field Execution Platform',
    'pdf03': '플랫폼 자산화 6단계',
    'pdf04': '구조화 설계',
    'pdf05': 'FDE와 SaaS',
    'pdf06': '현장의 신호',
    'pdf07': '흩어진 관찰과 판단',
    'pdf08': '데이터와 YABOAZ',
    'pdf09': '언어와 실행 연결 장치',
    'pdf10': '현장의 언어',
    'pdf12': '현장 탐색과 Discovery',
    'pdf17': '고객 온보딩',
    'pdf18': '초기자료 정규화와 Evidence 관리',
    'pdf19': 'Evidence Blueprint 보충',
    'pdf20': '2A4 문제해결',
    'pdf21': '맞춤 인터뷰',
    'pdf22': '온톨로지 7요소',
    'pdf23': 'AI 판단과 Human Gate',
    'pdf24': 'AI Agent 설계',
    'pdf25': '워크플로·승인·거버넌스',
    'pdf26': '화면·데이터 모델·API',
    'pdf27': '바이브코딩 기반 MVP',
    'pdf28': 'Bootcamp·KPI 검증',
    'pdf29': '플랫폼 자산 등록',
    'pdf52': 'YABOAZ 데이터 보호·보안·감사',
    'pdf53': 'FDE 역할·직무·평가 체계',
    'pdf54': '산업별 실행 사례집',
    'pdf55': 'FDE와 SaaS 제품화·패키지 설계',
    'pdf56': '프로젝트 KPI·성과 측정 표준',
    'pdf57': 'FDE 교육생 포트폴리오 제작 가이드'
  };

  function getSession() {
    try {
      var raw = sessionStorage.getItem('kfde-auth-session');
      return raw ? JSON.parse(raw) : null;
    } catch (error) { return null; }
  }

  function rpc(body) {
    if (!session || !session.access_token) return Promise.resolve(null);
    return fetch(SUPABASE_URL + '/rest/v1/rpc/lms_track_material', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + session.access_token
      },
      body: JSON.stringify(body)
    }).then(function (response) {
      if (!response.ok) return response.text().then(function () { return null; });
      return response.json();
    }).catch(function () { return null; });
  }

  function sourceUrl() {
    return window.location.pathname + window.location.search;
  }

  function setCurrent(material) {
    current = material;
    var panel = document.getElementById('learning-record-panel');
    if (!panel) return;
    panel.querySelector('[data-learning-title]').textContent = material.title;
    panel.querySelector('[data-learning-progress]').value = material.progress || 0;
    panel.querySelector('[data-learning-progress-value]').textContent = (material.progress || 0) + '%';
    panel.querySelector('[data-learning-complete]').checked = false;
    panel.querySelector('[data-learning-notes]').value = '';
  }

  function track(material, progress, status, position) {
    var normalized = Object.assign({
      materialKey: 'html:' + sourceUrl(),
      title: document.title,
      type: 'html',
      source: sourceUrl(),
      progress: progress || 1,
      status: status || 'viewed',
      position: position || '',
      notes: ''
    }, material || {});
    setCurrent(normalized);
    return rpc({
      p_material_key: normalized.materialKey,
      p_title: normalized.title,
      p_material_type: normalized.type,
      p_source_url: normalized.source,
      p_status: normalized.status,
      p_progress_percent: normalized.progress,
      p_last_position: normalized.position,
      p_notes: normalized.notes
    });
  }

  function activeReferenceKey() {
    var tab = document.querySelector('.material-tab.active');
    return tab ? tab.getAttribute('data-material-tab') : 'field';
  }

  function trackReference(key, position) {
    var title = refs[key] || key;
    var section = document.getElementById(key + '-material');
    var heading = section && section.querySelector('h2');
    return track({
      materialKey: 'slide:reference-materials:' + key,
      title: heading ? heading.textContent.trim() : title,
      type: 'slide',
      source: sourceUrl() + '#' + key + '-material',
      progress: position ? Math.min(99, Math.max(1, Number(position) * 5)) : 1,
      position: position ? String(position) : '1'
    });
  }

  function injectPanel() {
    if (document.getElementById('learning-record-panel')) return;
    var panel = document.createElement('section');
    panel.id = 'learning-record-panel';
    panel.setAttribute('aria-label', '학습 기록');
    panel.innerHTML = '<div><strong>학습 기록</strong><span data-learning-title></span></div>' +
      '<label>진도 <input data-learning-progress type="range" min="0" max="100" value="0"><output data-learning-progress-value>0%</output></label>' +
      '<label class="learning-complete"><input data-learning-complete type="checkbox"> 이 자료 학습 완료</label>' +
      '<textarea data-learning-notes placeholder="학습 메모를 남겨보세요"></textarea>' +
      '<button type="button" data-learning-save>학습 기록 저장</button>';
    var style = document.createElement('style');
    style.textContent = '#learning-record-panel{position:relative;z-index:4;display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 auto 20px;padding:14px 16px;max-width:1440px;border:1px solid #c7e3e8;border-radius:14px;background:#f8fdfe;color:#10253d;font:14px Arial,"Noto Sans KR",sans-serif}#learning-record-panel strong{color:#147fa4;margin-right:8px}#learning-record-panel [data-learning-title]{color:#587080}#learning-record-panel label{display:flex;align-items:center;gap:6px}#learning-record-panel input[type=range]{width:130px}#learning-record-panel output{min-width:38px}#learning-record-panel textarea{flex:1;min-width:180px;min-height:38px;padding:8px;border:1px solid #b9d8df;border-radius:8px;font:inherit}#learning-record-panel button{padding:9px 12px;border:0;border-radius:8px;background:#147fa4;color:#fff;font-weight:800;cursor:pointer}';
    document.head.appendChild(style);
    document.body.insertBefore(panel, document.body.firstChild);
    var range = panel.querySelector('[data-learning-progress]');
    range.addEventListener('input', function () {
      panel.querySelector('[data-learning-progress-value]').textContent = range.value + '%';
    });
    panel.querySelector('[data-learning-save]').addEventListener('click', function () {
      if (!current) return;
      var progress = Number(range.value);
      var complete = panel.querySelector('[data-learning-complete]').checked;
      var button = panel.querySelector('[data-learning-save]');
      button.disabled = true;
      rpc({
        p_material_key: current.materialKey,
        p_title: current.title,
        p_material_type: current.type,
        p_source_url: current.source,
        p_status: complete ? 'completed' : (progress > 0 ? 'in_progress' : 'viewed'),
        p_progress_percent: complete ? 100 : progress,
        p_last_position: current.position || '',
        p_notes: panel.querySelector('[data-learning-notes]').value
      }).then(function () {
        button.textContent = '저장 완료';
        setTimeout(function () { button.textContent = '학습 기록 저장'; }, 1500);
      }).finally(function () { button.disabled = false; });
    });
  }

  function init() {
    session = getSession();
    if (!session || !session.access_token) return;
    injectPanel();
    if (document.querySelector('.material-tabs')) {
      trackReference(activeReferenceKey(), 1);
      document.querySelectorAll('[data-material-tab]').forEach(function (tab) {
        tab.addEventListener('click', function () {
          setTimeout(function () { trackReference(tab.dataset.materialTab, 1); }, 0);
        });
      });
      document.querySelectorAll('[data-prev],[data-next]').forEach(function (button) {
        button.addEventListener('click', function () {
          setTimeout(function () {
            var key = button.dataset.prev || button.dataset.next;
            var counter = document.getElementById(key + '-counter');
            var position = counter ? counter.textContent.split('/')[0].trim() : '1';
            trackReference(key, position);
          }, 20);
        });
      });
      document.querySelectorAll('.video-trigger').forEach(function (button) {
        button.addEventListener('click', function () {
          var card = button.closest('.video-card');
          var heading = card && card.querySelector('h3');
          track({
            materialKey: 'video:reference-materials:' + button.dataset.video,
            title: heading ? heading.textContent.trim() : '학습 영상',
            type: 'video',
            source: sourceUrl() + '#video-' + button.dataset.video,
            progress: 5,
            position: 'started'
          });
        });
      });
    } else {
      track({
        materialKey: 'html:' + sourceUrl(),
        title: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : document.title,
        type: 'html',
        source: sourceUrl(),
        progress: 1,
        position: 'opened'
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
