(function () {
  'use strict';

  var file = window.location.pathname.split('/').pop() || 'index.html';
  var isEnglish = /-en\.html$/i.test(file);
  if (!isEnglish) return;

  // Long phrases are deliberately listed first through the length sort below.
  // This keeps the English variants readable even when a page contains a mix
  // of legacy Korean labels and newly generated UI text.
  var phrases = {
    '현장 문제를 발견하고 실행 가능한 자산으로 전환하는 K-FDE 실행 플랫폼입니다.': 'A K-FDE execution platform that discovers field problems and turns them into reusable operational assets.',
    '현장 문제를 발견하고, 온톨로지로 구조화하며, AI 에이전트와 워크플로우로 실행하고, 검증된 해결책을 재사용 가능한 플랫폼 자산으로 전환합니다.': 'Discover field problems, structure them with ontology, execute them with AI agents and workflows, and turn validated solutions into reusable platform assets.',
    '현장 신호와 근거에서 진짜 문제를 정의합니다.': 'Define the real problem from field signals and evidence.',
    '객체·관계·규칙을 온톨로지로 연결합니다.': 'Connect objects, relationships, and rules into an ontology.',
    'AI Agent와 워크플로우가 승인된 행동을 수행합니다.': 'AI agents and workflows carry out approved actions.',
    '검증된 해결책을 다음 프로젝트에서 재사용합니다.': 'Reuse validated solutions in the next project.',
    '현장 발견부터 검증과 자산화까지 13단계 실행 로드맵을 관리합니다.': 'Manage the complete 13-stage execution roadmap from discovery to validation and assetization.',
    '고객·현장·목표·담당자를 확인하고 첫 실행의 범위를 명확히 정의합니다.': 'Confirm the customer, field, goals, and owners, then define the first execution scope.',
    '파일·링크·출처·품질을 정리합니다.': 'Organize files, links, sources, and quality.',
    '목표·문제·원인·실행을 분리합니다.': 'Separate goals, problems, causes, and actions.',
    '업무 흐름과 실제 의사결정 지점을 관찰합니다.': 'Observe work flows and real decision points.',
    '질문 의도와 기대 결과를 명확히 합니다.': 'Clarify question intent and expected outcomes.',
    '근거·판단·승인·예외를 설계합니다.': 'Design evidence, decisions, approvals, and exceptions.',
    '역할·도구·권한·개입 지점을 정의합니다.': 'Define roles, tools, permissions, and intervention points.',
    '조건·예외·책임자·실행 순서를 연결합니다.': 'Connect conditions, exceptions, owners, and execution order.',
    '사용자 행동과 데이터를 운영 화면에 연결합니다.': 'Connect user actions and data to operating screens.',
    '가장 가치가 큰 최소 실행 단위를 구현합니다.': 'Build the smallest high-value execution unit.',
    '현장에서 사용성·정확성·승인 흐름을 검증합니다.': 'Validate usability, accuracy, and approval flows in the field.',
    '검증된 결과를 다음 프로젝트에서 재사용합니다.': 'Reuse validated results in the next project.',
    '현장 문제를 실행 가능한 자산으로 만드는 방법': 'How field problems become executable assets',
    '근거 기반 · 인간 승인 · 작은 실행': 'Evidence-based · Human-approved · Small-batch execution',
    '개선·재사용·확산': 'Improve · Reuse · Scale',
    '검증 가능한 실행': 'Verifiable Execution',
    '검증 기준': 'Validation Criteria',
    '다음 게이트': 'Next Gate',
    '핵심 목표': 'Core Goal',
    '실행 기준': 'Execution Standard',
    '목표와 범위': 'Goals & Scope',
    '근거와 구조': 'Evidence & Structure',
    '저장 · 검토 · 승인': 'Save · Review · Approve',
    '사실과 가설 분리': 'Separate facts and hypotheses',
    '출처와 책임자 기록': 'Record sources and owners',
    '예외와 리스크 표시': 'Show exceptions and risks',
    '작은 단위로 검증': 'Validate in small units',
    '결과를 재사용 자산으로 전환': 'Turn results into reusable assets',
    '13단계 워크플로우': '13-Stage Workflow',
    '13단계 실행 로드맵': '13-Stage Execution Roadmap',
    '고객 온보딩': 'Customer Onboarding',
    '초기 자료 정규화': 'Initial Materials Normalization',
    '2A4 문제해결': '2A4 Problem Solving',
    '이해관계자·현장 탐색': 'Stakeholder & Field Discovery',
    '맞춤 인터뷰': 'Tailored Interviews',
    '7요소 온톨로지': '7-Element Ontology',
    'AI 판단 시나리오': 'AI Decision Scenarios',
    'AI 에이전트 설계': 'AI Agent Design',
    '워크플로우 설계': 'Workflow Design',
    '화면·데이터 모델': 'Screen & Data Model',
    'MVP 개발': 'MVP Development',
    '부트캠프 검증': 'Bootcamp Validation',
    '플랫폼 자산화': 'Platform Assetization',
    '현장 검증·자산화': 'Field Validation & Assetization',
    '현장 발견': 'Field Discovery',
    '온톨로지 구조화': 'Ontology Structuring',
    'AX 실행 설계': 'AX Execution Design',
    '검증과 자산화': 'Validation & Assetization',
    '프로젝트': 'Projects',
    '미션 관리': 'Mission Control',
    '현장 기록': 'Field Records',
    '질문': 'Questions',
    '사례': 'Cases',
    '거버넌스': 'Governance',
    '구조도': 'Architecture',
    '매뉴얼': 'Manual',
    '프리미티브 라이브러리': 'Primitive Library',
    '문제 접수': 'Problem Intake',
    '프로젝트 온보딩': 'Project Onboarding',
    '초기 자료': 'Initial Materials',
    '승인 센터': 'Approval Center',
    '승인 대기': 'Pending Approval',
    '승인 완료': 'Approved',
    '로컬 보안 모드': 'Local Security Mode',
    '이 기기에만 저장됩니다': 'Stored only on this device',
    '삭제': 'Delete', '수정': 'Edit', '저장': 'Save', '취소': 'Cancel',
    '확인': 'Confirm', '닫기': 'Close', '등록': 'Add', '추가': 'Add',
    '검색': 'Search', '필터': 'Filter', '전체': 'All', '검토': 'Review',
    '승인': 'Approve', '반려': 'Reject', '완료': 'Complete', '대기': 'Pending',
    '계획': 'Plan', '실행': 'Execute', '결과': 'Result', '설정': 'Settings',
    '사용자': 'User', '권한': 'Permissions', '데이터': 'Data', '개발': 'Development',
    '구조화': 'Structuring', '관찰 기록': 'Observation Record', '가설 세우기': 'Form a Hypothesis',
    '결과 판정': 'Determine the Result', '다음 단계': 'Next Step', '단계 지도': 'Stage Map',
    '메뉴': 'Menu', '페이지': 'Page', '이름': 'Name', '설명': 'Description',
    '제목': 'Title', '내용': 'Content', '상태': 'Status', '담당자': 'Owner',
    '시작': 'Start', '종료': 'End', '새로 만들기': 'Create New', '불러오기': 'Load',
    '내보내기': 'Export', '가져오기': 'Import', '초기화': 'Reset', '뒤로': 'Back',
    '다음': 'Next', '이전': 'Previous', '자세히 보기': 'View Details', '더 보기': 'More',
    '필수 입력': 'Required', '선택 사항': 'Optional', '입력하세요': 'Enter a value',
    '아직 등록된 내용이 없습니다.': 'No records have been added yet.',
    '불러오는 중입니다...': 'Loading...', '저장되었습니다.': 'Saved.',
    '처리 중입니다...': 'Processing...', '오류가 발생했습니다.': 'An error occurred.'
  };

  var keys = Object.keys(phrases).sort(function (a, b) { return b.length - a.length; });
  function translate(text) {
    var value = text;
    keys.forEach(function (key) { value = value.split(key).join(phrases[key]); });
    return value;
  }

  function hasKorean(value) { return /[\uac00-\ud7a3]/.test(value); }
  function fallback(node) {
    var parent = node.parentElement;
    if (!parent || parent.closest('.language-pair')) return;
    var tag = parent.tagName;
    if (/^H[1-4]$/.test(tag)) node.nodeValue = 'Field Execution Workspace';
    else if (tag === 'BUTTON' || tag === 'A') node.nodeValue = 'Open';
    else if (tag === 'INPUT' || tag === 'TEXTAREA') node.nodeValue = '';
    else node.nodeValue = 'Field execution guidance';
  }

  function translateNode(node) {
    if (node.nodeType === 3) {
      if (node.nodeValue.trim()) {
        node.nodeValue = translate(node.nodeValue);
        if (hasKorean(node.nodeValue)) fallback(node);
      }
      return;
    }
    if (node.nodeType !== 1 || /SCRIPT|STYLE|NOSCRIPT/.test(node.tagName)) return;
    ['title', 'aria-label', 'placeholder', 'alt', 'value'].forEach(function (attr) {
      if (node.hasAttribute(attr)) {
        var value = translate(node.getAttribute(attr));
        node.setAttribute(attr, hasKorean(value) ? 'Field execution' : value);
      }
    });
    Array.prototype.forEach.call(node.childNodes, translateNode);
  }

  function rewriteLinks() {
    document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || /-en\.html$/i.test(href) || /^(https?:|#)/.test(href)) return;
      link.setAttribute('href', href.replace(/\.html$/i, '-en.html'));
    });
  }

  function boot() {
    document.documentElement.lang = 'en';
    translateNode(document.body);
    document.title = translate(document.title);
    rewriteLinks();
    var koLabel = document.querySelector('.language-pair a:first-child span');
    if (koLabel) koLabel.textContent = 'KO';
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        Array.prototype.forEach.call(record.addedNodes, translateNode);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
