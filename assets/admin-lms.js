(function () {
  'use strict';

  var SUPABASE_URL = 'https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';
  var members = [];
  var selectedUserId = null;

  function password() {
    try { return sessionStorage.getItem('kfde-admin-password') || ''; } catch (error) { return ''; }
  }

  function callRpc(name, body) {
    return fetch(SUPABASE_URL + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY
      },
      body: JSON.stringify(body)
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok) throw new Error(data.message || data.hint || '관리자 LMS 요청에 실패했습니다.');
        return data;
      });
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function showMessage(text, isError) {
    var element = document.getElementById('lms-admin-message');
    if (element) element.textContent = text;
    if (element) element.className = 'message' + (isError ? ' error' : ' success');
  }

  function renderMembers() {
    var list = document.getElementById('lms-member-list');
    if (!list) return;
    if (!members.length) {
      list.innerHTML = '<tr><td colspan="4" class="empty">등록된 회원이 없습니다.</td></tr>';
      return;
    }
    list.innerHTML = members.map(function (member) {
      var statusLabels = { pending: '대기', approved: '정상', rejected: '거절', blocked: '차단' };
      return '<tr><td><button class="member-link" data-member="' + escapeHtml(member.user_id) + '">' +
        escapeHtml(member.full_name || member.email) + '</button><small class="member-email">' +
        escapeHtml(member.email) + '</small></td><td>' + escapeHtml(statusLabels[member.status] || member.status) +
        '</td><td><div>' + Number(member.progress || 0) + '%</div><div class="progress-line"><i style="width:' +
        Number(member.progress || 0) + '%"></i></div></td><td>' + escapeHtml(member.last_activity ?
          String(member.last_activity).slice(0, 10) : '없음') + '</td></tr>';
    }).join('');
  }

  function renderDetail(rows) {
    var member = members.find(function (item) { return item.user_id === selectedUserId; });
    var title = document.getElementById('lms-detail-title');
    var box = document.getElementById('lms-detail');
    if (title) title.textContent = member ? (member.full_name || member.email) + ' · 학습 상세' : '학습 상세';
    if (!box) return;
    box.innerHTML = (rows || []).map(function (record) {
      var status = record.status || 'not_started';
      var updated = record.updated_at ? String(record.updated_at).slice(0, 19).replace('T', ' ') : '아직 없음';
      return '<article class="stage-record"><div class="stage-record-head"><div><h3>' +
        String(record.stage_no).padStart(2, '0') + ' · ' + escapeHtml(record.title) + '</h3><small>' +
        escapeHtml(status) + ' · ' + Number(record.completion_percent || 0) + '%</small></div><small>' +
        escapeHtml(updated) + '</small></div><pre>' + escapeHtml(JSON.stringify(record.form_data || {}, null, 2)) +
        '</pre><div class="stage-review"><select data-review-status="' + record.stage_no + '">' +
        '<option value="reviewing" ' + (status === 'reviewing' ? 'selected' : '') + '>검토 중</option>' +
        '<option value="revision_requested" ' + (status === 'revision_requested' ? 'selected' : '') + '>수정 요청</option>' +
        '<option value="approved" ' + (status === 'approved' ? 'selected' : '') + '>승인 완료</option>' +
        '</select><textarea data-review-feedback="' + record.stage_no + '" placeholder="관리자 피드백">' +
        escapeHtml(record.feedback || '') + '</textarea><button type="button" data-review="' + record.stage_no + '">저장</button></div></article>';
    }).join('');

    box.querySelectorAll('[data-review]').forEach(function (button) {
      button.addEventListener('click', function () {
        var stageNo = Number(button.dataset.review);
        var statusElement = box.querySelector('[data-review-status="' + stageNo + '"]');
        var feedbackElement = box.querySelector('[data-review-feedback="' + stageNo + '"]');
        button.disabled = true;
        callRpc('yaboaz_lms_admin_review_member_stage', {
          p_password: password(),
          p_user_id: selectedUserId,
          p_stage_no: stageNo,
          p_status: statusElement.value,
          p_feedback: feedbackElement.value
        }).then(function (result) {
          if (result !== true) throw new Error('검토 결과 저장에 실패했습니다.');
          showMessage('단계 ' + stageNo + ' 검토 결과를 저장했습니다.', false);
          return callRpc('yaboaz_lms_admin_member_detail', { p_password: password(), p_user_id: selectedUserId });
        }).then(renderDetail).catch(function (error) {
          showMessage(error.message, true);
        }).finally(function () {
          button.disabled = false;
        });
      });
    });
  }

  function loadDetail(userId) {
    selectedUserId = userId;
    showMessage('회원 학습 상세를 불러오는 중입니다.', false);
    callRpc('yaboaz_lms_admin_member_detail', { p_password: password(), p_user_id: userId })
      .then(renderDetail)
      .catch(function (error) { showMessage(error.message, true); });
  }

  function loadMembers() {
    var currentPassword = password();
    if (!currentPassword) return;
    callRpc('yaboaz_lms_admin_members', { p_password: currentPassword })
      .then(function (rows) {
        members = rows || [];
        renderMembers();
        showMessage('회원 LMS 현황을 불러왔습니다.', false);
      })
      .catch(function (error) { showMessage(error.message, true); });
  }

  document.addEventListener('click', function (event) {
    var memberButton = event.target.closest('[data-member]');
    if (memberButton) loadDetail(memberButton.dataset.member);
    if (event.target.closest('#admin-refresh')) loadMembers();
  });
  window.addEventListener('admin-authenticated', loadMembers);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadMembers);
  else loadMembers();
}());
