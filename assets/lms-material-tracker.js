(function () {
  'use strict';

  var SUPABASE_URL = 'https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';
  var session = null;
  var current = null;
  var refs = {
    field: 'YABOAZ Field Execution OS',
    blueprint: 'YABOAZ AX Blueprint',
    platform: 'YABOAZ Field Execution Platform',
    language: 'YABOAZ 현장 언어를 실행 가능한 자산으로',
    pdf01: 'K-FDE 플랫폼 개요', pdf02: 'Field Execution Platform', pdf03: '플랫폼 자산화 6단계',
    pdf04: '구조화 설계', pdf05: 'FDE와 SaaS', pdf06: '현장의 신호', pdf07: '흩어진 관찰과 판단',
    pdf08: '데이터와 YABOAZ', pdf09: '언어와 실행 연결 장치', pdf10: '현장의 언어',
    pdf12: '현장 탐색과 Discovery', pdf17: '고객 온보딩', pdf18: '초기자료 정규화와 Evidence 관리',
    pdf19: 'Evidence Blueprint 보충', pdf20: '2A4 문제해결', pdf21: '맞춤 인터뷰',
    pdf22: '온톨로지 7요소', pdf23: 'AI 판단과 Human Gate', pdf24: 'AI Agent 설계',
    pdf25: '워크플로·승인·거버넌스', pdf26: '화면·데이터 모델·API', pdf27: '바이브코딩 기반 MVP',
    pdf28: 'Bootcamp·KPI 검증', pdf29: '플랫폼 자산 등록', pdf52: 'YABOAZ 데이터 보호·보안·감사',
    pdf53: 'FDE 역할·직무·평가 체계', pdf54: '산업별 실행 사례집',
    pdf55: 'FDE와 SaaS 제품화·패키지 설계', pdf56: '프로젝트 KPI·성과 측정 표준',
    pdf57: 'FDE 교육생 포트폴리오 제작 가이드'
  };

  function getSession() {
    try {
      var raw = sessionStorage.getItem('kfde-auth-session');
      return raw ? JSON.parse(raw) : null;
    } catch (error) { return null; }
  }

  function rpc(name, body) {
    if (!session || !session.access_token) return Promise.resolve(null);
    return fetch(SUPABASE_URL + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: 'Bearer ' + session.access_token },
      body: JSON.stringify(body)
    }).then(function (response) {
      if (!response.ok) return response.text().then(function () { return null; });
      return response.json();
    }).catch(function () { return null; });
  }

  function sourceUrl() {
    return window.location.pathname + window.location.search;
  }

  function completeButtons(key) {
    return document.querySelectorAll('[data-complete-key="' + CSS.escape(key) + '"]');
  }

  function setCompleteVisual(key, completed) {
    completeButtons(key).forEach(function (button) {
      button.classList.toggle('is-complete', completed);
      button.setAttribute('aria-pressed', completed ? 'true' : 'false');
      button.title = completed ? '학습 완료됨' : '학습 완료 처리';
    });
  }

  function loadProgress(key) {
    return rpc('lms_get_my_material_progress', { p_material_key: key }).then(function (rows) {
      var row = rows && rows[0];
      if (!row || !current || current.materialKey !== key) return;
      current.savedStatus = row.status;
      current.savedNotes = row.notes || '';
      if (row.status === 'completed') {
        setCompleteVisual(key, true);
        var panel = document.getElementById('learning-record-panel');
        if (panel) {
          panel.querySelector('[data-learning-progress]').value = 100;
          panel.querySelector('[data-learning-progress-value]').textContent = '100%';
          panel.querySelector('[data-learning-complete]').checked = true;
          panel.querySelector('[data-learning-notes]').value = row.notes || '';
        }
      }
    });
  }

  function setCurrent(material) {
    current = material;
    var panel = document.getElementById('learning-record-panel');
    if (panel) {
      panel.querySelector('[data-learning-title]').textContent = material.title;
      panel.querySelector('[data-learning-progress]').value = material.progress || 0;
      panel.querySelector('[data-learning-progress-value]').textContent = (material.progress || 0) + '%';
      panel.querySelector('[data-learning-complete]').checked = false;
      panel.querySelector('[data-learning-notes]').value = '';
    }
    setCompleteVisual(material.materialKey, false);
    loadProgress(material.materialKey);
  }

  function saveMaterial(material, status, progress, notes) {
    return rpc('lms_track_material', {
      p_material_key: material.materialKey,
      p_title: material.title,
      p_material_type: material.type,
      p_source_url: material.source,
      p_status: status,
      p_progress_percent: progress,
      p_last_position: material.position || '',
      p_notes: notes || ''
    });
  }

  function track(material) {
    setCurrent(material);
    return saveMaterial(material, material.status || 'viewed', material.progress || 1, material.notes || '');
  }

  function complete(material) {
    if (!material) return;
    if (!session || !session.access_token) {
      window.location.href = '/index-ko.html?auth=login';
      return;
    }
    var panel = document.getElementById('learning-record-panel');
    var notes = panel ? panel.querySelector('[data-learning-notes]').value : '';
    return saveMaterial(material, 'completed', 100, notes).then(function () {
      setCompleteVisual(material.materialKey, true);
      if (panel && current && current.materialKey === material.materialKey) {
        panel.querySelector('[data-learning-progress]').value = 100;
        panel.querySelector('[data-learning-progress-value]').textContent = '100%';
        panel.querySelector('[data-learning-complete]').checked = true;
      }
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
    style.textContent = '#learning-record-panel{position:relative;z-index:4;display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 auto 20px;padding:14px 16px;max-width:1440px;border:1px solid #c7e3e8;border-radius:14px;background:#f8fdfe;color:#10253d;font:14px Arial,"Noto Sans KR",sans-serif}#learning-record-panel strong{color:#147fa4;margin-right:8px}#learning-record-panel [data-learning-title]{color:#587080}#learning-record-panel label{display:flex;align-items:center;gap:6px}#learning-record-panel input[type=range]{width:130px}#learning-record-panel output{min-width:38px}#learning-record-panel textarea{flex:1;min-width:180px;min-height:38px;padding:8px;border:1px solid #b9d8df;border-radius:8px;font:inherit}#learning-record-panel button,.learning-completion-button{padding:10px 14px;border:0;border-radius:8px;background:#147fa4;color:#fff;font-weight:800;cursor:pointer}.learning-completion-button{display:block;width:min(100%,360px);min-height:72px;margin:26px auto 14px;padding:22px 36px!important;position:relative;overflow:hidden;border:4px solid #ff5a36!important;border-radius:16px;background:linear-gradient(135deg,#ff6b35,#e91e63)!important;color:#fff!important;box-shadow:0 10px 24px rgba(233,30,99,.3),0 0 0 5px rgba(255,107,53,.12);font-size:22px;line-height:1;font-weight:900;letter-spacing:.02em;text-align:center}.learning-completion-button.is-complete:after{content:"";position:absolute;left:5%;right:5%;top:50%;height:3px;background:#e11;transform:translateY(-50%);pointer-events:none}.learning-completion-button.is-complete{background:#587080}';
    document.head.appendChild(style);
    document.body.insertBefore(panel, document.body.firstChild);
    var range = panel.querySelector('[data-learning-progress]');
    range.addEventListener('input', function () {
      panel.querySelector('[data-learning-progress-value]').textContent = range.value + '%';
    });
    panel.querySelector('[data-learning-save]').addEventListener('click', function () {
      if (!current) return;
      var progress = Number(range.value);
      var completeChecked = panel.querySelector('[data-learning-complete]').checked;
      var button = panel.querySelector('[data-learning-save]');
      button.disabled = true;
      saveMaterial(current, completeChecked ? 'completed' : (progress > 0 ? 'in_progress' : 'viewed'), completeChecked ? 100 : progress, panel.querySelector('[data-learning-notes]').value)
        .then(function () { setCompleteVisual(current.materialKey, completeChecked); button.textContent = '저장 완료'; setTimeout(function () { button.textContent = '학습 기록 저장'; }, 1500); })
        .finally(function () { button.disabled = false; });
    });
  }

  function addCompletionButton(container, material) {
    if (!container || container.querySelector('[data-complete-key]')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'learning-completion-button';
    button.textContent = '학습 완료';
    button.dataset.completeKey = material.materialKey;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', function () {
      button.disabled = true;
      complete(material).finally(function () { button.disabled = false; });
    });
    container.appendChild(button);
  }

  function activeReferenceKey() {
    var tab = document.querySelector('.material-tab.active');
    return tab ? tab.getAttribute('data-material-tab') : 'field';
  }

  function referenceMaterial(key, position) {
    var section = document.getElementById(key + '-material');
    var heading = section && section.querySelector('h2');
    return {
      materialKey: 'slide:reference-materials:' + key,
      title: heading ? heading.textContent.trim() : (refs[key] || key),
      type: 'slide',
      source: sourceUrl() + '#' + key + '-material',
      progress: position ? Math.min(99, Math.max(1, Number(position) * 5)) : 1,
      position: position ? String(position) : '1'
    };
  }

  function trackReference(key, position) {
    return track(referenceMaterial(key, position));
  }

  function buildReferenceCompletionButtons() {
    document.querySelectorAll('.material-group').forEach(function (section) {
      var key = section.id.replace(/-material$/, '');
      var lastSlide = section.querySelector('.slide:last-child');
      if (lastSlide) addCompletionButton(lastSlide, referenceMaterial(key, 'last'));
    });
    var videoCards = document.querySelectorAll('.video-card');
    if (videoCards.length) {
      var lastVideo = videoCards[videoCards.length - 1];
      var trigger = lastVideo.querySelector('.video-trigger');
      if (trigger) addCompletionButton(lastVideo, {
        materialKey: 'video:reference-materials:' + trigger.dataset.video,
        title: (lastVideo.querySelector('h3') || {}).textContent || '학습 영상',
        type: 'video',
        source: sourceUrl() + '#video-' + trigger.dataset.video,
        position: 'last-video'
      });
    }
  }

  function initReference() {
    buildReferenceCompletionButtons();
    trackReference(activeReferenceKey(), 1);
    document.querySelectorAll('[data-material-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () { setTimeout(function () { trackReference(tab.dataset.materialTab, 1); }, 0); });
    });
    document.querySelectorAll('[data-prev],[data-next]').forEach(function (button) {
      button.addEventListener('click', function () {
        setTimeout(function () {
          var key = button.dataset.prev || button.dataset.next;
          var counter = document.getElementById(key + '-counter');
          trackReference(key, counter ? counter.textContent.split('/')[0].trim() : '1');
        }, 20);
      });
    });
    document.querySelectorAll('.video-trigger').forEach(function (button) {
      button.addEventListener('click', function () {
        var card = button.closest('.video-card');
        track({
          materialKey: 'video:reference-materials:' + button.dataset.video,
          title: card && card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : '학습 영상',
          type: 'video', source: sourceUrl() + '#video-' + button.dataset.video, progress: 5, position: 'started'
        });
      });
    });
  }

  function initHtml() {
    var material = {
      materialKey: 'html:' + sourceUrl(),
      title: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : document.title,
      type: 'html', source: sourceUrl(), progress: 1, position: 'opened'
    };
    var footer = document.querySelector('footer') || document.body.lastElementChild;
    var holder = document.createElement('div');
    holder.className = 'learning-completion-holder';
    addCompletionButton(holder, material);
    if (footer && footer.parentNode) footer.parentNode.insertBefore(holder, footer);
    else document.body.appendChild(holder);
    track(material);
  }

  function init() {
    session = getSession();
    if (!session || !session.access_token) {
      injectPanel();
      var hiddenPanel = document.getElementById('learning-record-panel');
      if (hiddenPanel) hiddenPanel.style.display = 'none';
      if (document.querySelector('.material-tabs')) buildReferenceCompletionButtons();
      else initHtml();
      return;
    }
    injectPanel();
    if (document.querySelector('.material-tabs')) initReference();
    else initHtml();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
