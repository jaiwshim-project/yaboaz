(function(){
  "use strict";
  var page=document.body.dataset.page||"command";
  var design=document.body.dataset.designStage||"";
  var names={command:"K-FDE 현장 실행", "mission-management":"미션 관리",projects:"프로젝트",field:"현장 기록",questions:"질문 플래너",ontology:"온톨로지 스튜디오",approvals:"승인 센터",kpi:"성과 · KPI",primitives:"원시요소 라이브러리",governance:"거버넌스 · 감사",manual:"사용자 매뉴얼",cases:"적용사례",architecture:"구조도",workflow:"13단계 워크플로", "project-onboarding":"프로젝트 온보딩", "problem-intake":"문제 접수", "discovery-analysis":"현장 탐색 분석", "2a4-studio":"2A4 문제해결", "ai-scenarios":"AI 판단 시나리오", "agent-design":"AI Agent 설계", "workflow-design":"워크플로 설계", "screen-data-model":"화면·데이터 모델"};
  var stages={"project-onboarding":1,"problem-intake":2,"discovery-analysis":4,"2a4-studio":3,"questions":5,"ontology":6,"ai-scenarios":7,"agent-design":8,"workflow-design":9,"screen-data-model":10,"vibecoding":10,"mvp-development":11,"bootcamp-validation":12,"primitives":13};
  var stage=stages[page]||stages[design]||0;
  function esc(v){return String(v||"").replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
  function cards(items){return '<div class="project-grid">'+items.map(function(x,i){return '<article class="project-card tone'+(i%4)+'"><div><span>'+esc(x[0])+'</span><em>'+esc(x[1])+'</em></div><h3>'+esc(x[2])+'</h3><p>'+esc(x[3])+'</p><footer><span>실행 기준 확인</span><a href="workflow.html">단계 보기 →</a></footer></article>';}).join('')+'</div>';}
  function body(){
    var title=names[page]||names[design]||"K-FDE 실행 메뉴";
    var desc="현장의 문제를 근거와 구조로 정리하고, 실행 가능한 결과와 재사용 자산으로 전환합니다.";
    if(page==='projects') desc='프로젝트의 목표, 담당자, 현재 단계와 실행 상태를 한 곳에서 관리합니다.';
    if(page==='field') desc='관찰·인터뷰·문서·로그를 출처와 신뢰도와 함께 현장 증거로 기록합니다.';
    if(page==='questions') desc='불확실성을 줄이고 다음 행동을 결정하기 위한 맞춤 질문을 설계합니다.';
    if(page==='ontology') desc='객체·속성·관계·상태·이벤트·규칙·행동을 연결해 실행 지식을 만듭니다.';
    if(page==='approvals') desc='AI 제안과 고위험 실행을 사람의 근거 기반 승인으로 통제합니다.';
    if(page==='kpi') desc='현장 실행 결과와 고객 성과를 측정하고 다음 개선으로 연결합니다.';
    if(page==='primitives') desc='검증된 워크플로·질문·온톨로지·KPI를 다음 프로젝트에 재사용합니다.';
    if(page==='governance') desc='권한, 감사 로그, 백업, 개인정보와 운영 책임을 관리합니다.';
    if(page==='manual') desc='K-FDE 플랫폼을 발견부터 자산화까지 사용하는 표준 안내입니다.';
    if(page==='cases') desc='현장 문제를 구조화하고 실행 자산으로 전환한 적용 사례를 확인합니다.';
    if(page==='architecture') desc='13단계 로드맵과 3가지 설계체계가 어떻게 연결되는지 확인합니다.';
    if(design==='model'||page==='vibecoding') {title='화면·데이터 모델';desc='사용자 여정과 화면, 데이터 엔티티, 관계, API, 권한·개인정보 보호를 하나의 실행 모델로 정렬합니다.';}
    var intro=(stage?'<small>PHASE '+(stage>=11?4:stage>=6?2:stage>=7?3:1)+' · STAGE '+String(stage).padStart(2,'0')+'</small>':'<small>FIELD OPERATING SYSTEM</small>');
    var items= page==='ontology' ? [['7 ELEMENTS','STRUCTURE','온톨로지 7요소','객체·속성·관계·상태·이벤트·규칙·행동'],['EVIDENCE','TRACEABLE','근거 연결','모든 판단과 실행을 출처에 연결'],['HUMAN','CONTROL','사람의 승인','고위험 행동은 승인 게이트를 통과']] : page==='questions' ? [['01','DISCOVER','다음 질문','가설과 불확실성을 줄이는 질문'],['02','INTERVIEW','인터뷰 순서','고객 담당자와 확인할 관찰 순서'],['03','OUTPUT','기대 결과','답변을 실행 기준으로 변환']] : [['01','DEFINE','목표와 범위','누가 무엇을 언제 개선하는지 정의'],['02','STRUCTURE','증거와 구조','사실·가설·관계를 분리해 기록'],['03','EXECUTE','작은 실행','검증 가능한 단위로 실행하고 측정']];
    var metrics='<section class="metrics"><article class="metric blue"><span>실행 단계</span><div><strong>'+String(stage||13)+'</strong><em>단계</em></div><p>현재 메뉴의 실행 위치</p></article><article class="metric mint"><span>핵심 원칙</span><div><strong>3</strong><em>체계</em></div><p>생태계 · 온톨로지 · 원시요소</p></article><article class="metric amber"><span>운영 기준</span><div><strong>1</strong><em>게이트</em></div><p>저장·검토·승인</p></article></section>';
    return '<main class="page">'+(stage?'<section class="design-hero"><div>'+intro+'<h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></div><div class="readiness-card"><b>'+String(stage).padStart(2,'0')+'</b><div><strong>실행 기준</strong><span>근거 · 구조 · 실행</span><i><em style="width:72%"></em></i></div></div></section>':'<div class="page-heading">'+intro+'<h2>'+esc(title)+'</h2><p>'+esc(desc)+'</p></div>')+metrics+cards(items)+'<section class="white panel" style="margin-top:16px"><div class="section-title"><div><small>OPERATING CHECK</small><h3>이 페이지에서 할 일</h3></div><a class="primary" href="workflow.html">13단계 지도 보기 →</a></div><div class="chips"><span>사실과 가설 분리</span><span>출처와 책임자 기록</span><span>작은 단위로 검증</span><span>결과를 재사용 자산화</span></div></section></main>';
  }
  function shell(){return '<div class="app-shell"><aside class="sidebar"><a class="brand" href="index.html"><span class="brand-mark"><img src="assets/kfde-symbol.jpg" alt="K-FDE"></span><span><strong>YABOAZ K-FDE</strong><small>FIELD OPERATING SYSTEM</small></span></a><div class="project-switcher"><small>ACTIVE PROJECT</small><a href="projects.html"><span class="project-dot"></span>FireNavi 현장대응 고도화 <b>→</b></a></div><nav></nav><div class="sidebar-foot"><div class="secure"><i></i><span><strong>로컬 보안 모드</strong><small>이 기기에만 저장됩니다</small></span></div><div class="profile"><span>SJ</span><div><strong>심재우</strong><small>Platform Owner</small></div></div></div></aside><section class="workspace"><header class="topbar"><div><small>K-FDE / 에스비컨설팅</small><h1>'+esc(names[page]||names[design]||'K-FDE 실행')+'</h1></div><div class="top-actions"><a href="workflow.html">단계 지도</a><a class="primary" href="mission-management.html">미션 관리 →</a></div></header>'+body()+'</section></div>';}
  var app=document.getElementById('app');if(app)app.innerHTML=shell();
})();

document.addEventListener('DOMContentLoaded',function(){var w=document.querySelector('.workspace');if(w&&!w.querySelector('.premium-footer'))w.insertAdjacentHTML('beforeend','<footer class="premium-footer"></footer>');});
