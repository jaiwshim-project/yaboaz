(function () {
  'use strict';

  var file = window.location.pathname.split('/').pop() || 'index.html';
  var isEnglish = /-en\.html$/i.test(file);

  var words = {
    '한국어': 'Korean', '영어': 'English', '단계 지도': 'Roadmap', '미션 관리': 'Mission Control',
    '프로젝트 만들기': 'Create a Project', '플랫폼 시작하기': 'Start the Platform', '시작하기': 'Get Started',
    '현장의 문제를': 'Turn Field Problems', '실행 가능한 자산으로': 'into Executable Assets',
    '발견': 'DISCOVER', '구조화': 'STRUCTURE', '실행': 'EXECUTE', '자산화': 'ASSETIZE',
    '고객 온보딩': 'Customer Onboarding', '초기자료 정규화': 'Initial Materials Normalization',
    '2A4 문제해결': '2A4 Problem Solving', '이해관계자·현장 탐색': 'Stakeholder & Field Discovery',
    '맞춤 인터뷰': 'Tailored Interviews', '온톨로지 7요소': '7-Element Ontology',
    'AI 판단 시나리오': 'AI Decision Scenarios', 'AI Agent 설계': 'AI Agent Design',
    '워크플로 설계': 'Workflow Design', '화면·데이터 모델': 'Screen & Data Model',
    'MVP 개발': 'MVP Development', 'Bootcamp 검증': 'Bootcamp Validation',
    '플랫폼 자산화': 'Platform Assetization', '현장 검증·자산화': 'Field Validation & Assetization',
    '현장 발견': 'Field Discovery', '온톨로지 구조화': 'Ontology Structuring',
    'AX 실행 설계': 'AX Execution Design', '검증과 자산화': 'Validation & Assetization',
    '문제와 증거를 정의': 'Define the problem and evidence', 'AI가 이해할 구조': 'Structure AI can understand',
    '판단을 행동으로 전환': 'Turn decisions into action', '다음 프로젝트에 재사용': 'Reuse in the next project',
    '현장의 문제를 발견하고 실행 가능한 자산으로 전환하는 K-FDE 실행 플랫폼입니다.': 'A K-FDE execution platform that discovers field problems and turns them into reusable operational assets.',
    '현장의 문제를 발견하고, 온톨로지로 구조화하며, AI 에이전트와 워크플로로 실행하고, 검증된 해결책을 재사용 가능한 플랫폼 자산으로 전환하는 K-FDE 실행 플랫폼이다.': 'YABOAZ discovers field problems, structures them with ontology, executes them with AI agents and workflows, and turns validated solutions into reusable platform assets.',
    '견고하게 세우고, AI로 실행한다.': 'Build with Strength. Execute with AI.',
    '견고하게 세우는 힘': 'The Strength to Build', 'YABOAZ 이름의 의미': 'The Meaning of YABOAZ',
    '세우다 · 확립하다': 'Build · Establish', '힘 · 견고함': 'Strength · Solidity',
    '견고하게 세우는 힘': 'The Strength to Build with Solidity',
    '현장 신호와 증거에서 진짜 문제를 정의합니다.': 'Define the real problem from field signals and evidence.',
    '객체·관계·규칙을 온톨로지로 연결합니다.': 'Connect objects, relationships and rules into an ontology.',
    'AI Agent와 워크플로가 승인된 행동을 수행합니다.': 'AI agents and workflows carry out approved actions.',
    '검증된 해결책을 다음 프로젝트에 재사용합니다.': 'Reuse validated solutions in the next project.',
    '13단계 워크플로': '13-Stage Workflow', '13단계 실행 로드맵': '13-Stage Execution Roadmap',
    '현장 발견부터 검증·자산화까지 13단계 실행 로드맵을 한눈에 관리합니다.': 'Manage the complete 13-stage execution roadmap from field discovery to validation and assetization.',
    '목표와 범위': 'Goals & Scope', '증거와 구조': 'Evidence & Structure', '검증 가능한 실행': 'Verifiable Execution',
    '핵심 목표': 'Core Goal', '검증 기준': 'Validation Criteria', '다음 게이트': 'Next Gate',
    '실행 기준': 'Execution Standard', '근거 · 구조 · 실행': 'Evidence · Structure · Execution',
    '저장 · 검토 · 승인': 'Save · Review · Approve', '사실과 가설 분리': 'Separate facts and hypotheses',
    '출처와 책임자 기록': 'Record sources and owners', '예외와 리스크 표시': 'Show exceptions and risks',
    '작은 단위로 검증': 'Validate in small units', '결과를 재사용 자산화': 'Turn results into reusable assets',
    '프로젝트': 'Projects', '고객·현장·목표의 범위를 정합니다': 'Define the customer, field and goal scope',
    '파일·링크·출처·품질을 정리합니다': 'Organize files, links, sources and quality',
    '목표·문제·원인·실행을 분리합니다': 'Separate goals, problems, causes and actions',
    '업무 흐름과 실제 판단 지점을 관찰합니다': 'Observe work flows and real decision points',
    '질문 의도와 기대 결과를 확인합니다': 'Clarify question intent and expected outcomes',
    '객체·속성·관계·상태·이벤트·규칙·행동을 실행지식으로 연결합니다.': 'Connect objects, attributes, relationships, states, events, rules and actions into executable knowledge.',
    '근거·판단·승인·예외를 설계합니다': 'Design evidence, decisions, approvals and exceptions',
    '역할·도구·권한·개입 지점을 정합니다': 'Define roles, tools, permissions and intervention points',
    '조건·예외·책임자·실행 순서를 연결합니다': 'Connect conditions, exceptions, owners and execution order',
    '사용자 행동과 데이터를 화면에 연결합니다': 'Connect user actions and data to operating screens',
    '가장 가치가 큰 실행 단위를 구현합니다': 'Build the smallest high-value execution unit',
    '현장에서 사용성·정확성·승인 흐름을 검증합니다': 'Validate usability, accuracy and approval flows in the field',
    '검증된 결과를 다음 프로젝트에 재사용합니다': 'Reuse validated results in the next project',
    '고객과 첫 실행 범위를 합의하기 위한 기본 정보를 입력하세요.': 'Enter the basic information needed to agree on the first execution scope with the customer.',
    '저장': 'Save', '삭제': 'Delete', '수정': 'Edit', '취소': 'Cancel', '확인': 'Confirm',
    '닫기': 'Close', '추가': 'Add', '검색': 'Search', '필터': 'Filter', '전체': 'All',
    '승인 센터': 'Approval Center', '승인 대기': 'Pending Approval', '승인 완료': 'Approved',
    '현장 기록': 'Field Records', '질문': 'Questions', '사례': 'Cases', '거버넌스': 'Governance',
    'KPI': 'KPI', '구조도': 'Architecture', '매뉴얼': 'Manual', '원시요소 라이브러리': 'Primitive Library',
    '문제 접수': 'Problem Intake', '프로젝트 온보딩': 'Project Onboarding', '초기 자료': 'Initial Materials',
    '현장 문제는 이렇게 실행 자산이 됩니다': 'This is how field problems become executable assets',
    '현장을 이해하고, 실행지식으로 구조화하고, 검증된 결과를 다시 사용할 수 있는 자산으로 전환합니다.': 'Understand the field, structure executable knowledge and turn validated results into reusable assets.'
  };

  function translateText(text) {
    var result = text;
    Object.keys(words).sort(function (a, b) { return b.length - a.length; }).forEach(function (key) {
      result = result.split(key).join(words[key]);
    });
    return result;
  }

  function translateNode(node) {
    if (node.nodeType === 3 && node.nodeValue.trim()) node.nodeValue = translateText(node.nodeValue);
    else if (node.nodeType === 1 && !/SCRIPT|STYLE|NOSCRIPT/.test(node.tagName)) {
      ['title', 'aria-label', 'placeholder', 'alt'].forEach(function (attr) {
        if (node.hasAttribute(attr)) node.setAttribute(attr, translateText(node.getAttribute(attr)));
      });
      Array.prototype.forEach.call(node.childNodes, translateNode);
    }
  }

  function addLanguageSwitch() {
    if (document.querySelector('.language-switcher')) return;
    var nav = document.createElement('div');
    nav.className = 'language-switcher';
    nav.innerHTML = '<a href="' + (isEnglish ? file.replace(/-en\.html$/i, '.html') : file.replace(/\.html$/i, '-en.html')) + '" aria-label="Switch language"><span class="flag-symbol">' + (isEnglish ? '🇰🇷' : '🇺🇸') + '</span><span>' + (isEnglish ? '한국어' : 'English') + '</span></a>';
    document.body.appendChild(nav);
  }

  function boot() {
    document.documentElement.lang = isEnglish ? 'en' : 'ko';
    addLanguageSwitch();
    if (!isEnglish) return;
    document.title = translateText(document.title);
    translateNode(document.body);
    document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || /-en\.html$/.test(href) || /^(https?:|#)/.test(href)) return;
      link.setAttribute('href', href.replace(/\.html$/, '-en.html'));
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
