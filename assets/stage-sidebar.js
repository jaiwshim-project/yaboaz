(() => {
  "use strict";
  const groups = [
    {id:"common",title:"공통 운영",caption:"프로젝트와 전체 실행 현황",items:[
      ["","미션 관리","전체 실행 현황·게이트","mission-management.html"],
      ["","프로젝트","등록·선택·사전자료","projects.html"],
      ["","13단계 워크플로","단계별 게이트","workflow.html"]
    ]},
    {id:"phase1",title:"PHASE 1",caption:"FDE 발견 · 01–05",items:[
      [1,"고객 온보딩","프로젝트 경계 설정","customer-onboarding.html#stage-1"],
      [2,"초기자료 정규화","자료·출처·품질 정리","initial-materials.html#stage-3"],
      [3,"2A4 문제해결","목표·문제·원인·실행","2a4-studio.html"],
      [4,"이해관계자·현장 탐색","가설과 조사 방향","discovery-analysis.html"],
      [5,"맞춤 인터뷰","질문과 기대 결과 확인","questions.html"]
    ]},
    {id:"phase2",title:"PHASE 2",caption:"현장의 이해 · 06",items:[
      [6,"온톨로지 7요소","객체·속성·관계·상태·이벤트·규칙·행동","ontology.html"]
    ]},
    {id:"phase3",title:"PHASE 3",caption:"AX 실행 아키텍처 · 07–10",items:[
      [7,"AI 판단 시나리오","근거·판단·승인 설계","ai-scenarios.html"],
      [8,"AI Agent 설계","역할·도구·권한 설계","agent-design.html"],
      [9,"워크플로 설계","상태·게이트·예외 설계","workflow-design.html"],
      [10,"화면·데이터 모델","UX·데이터 연결 설계","vibecoding.html"]
    ]},
    {id:"phase4",title:"PHASE 4",caption:"검증·자산화 · 11–13",items:[
      [11,"MVP 개발","핵심 실행 단위 구현","mvp-development.html"],
      [12,"Bootcamp 검증","현장 사용성·정확성 검증","bootcamp-validation.html"],
      [13,"플랫폼 자산화","재사용 구조 패키징","primitives.html"]
    ]},
    {id:"manage",title:"통제·성과",caption:"검증·성과·감사",items:[
      ["","승인 센터","Human-in-the-loop","approvals.html"],
      ["","성과·KPI","성과와 리딩지표","kpi.html"],
      ["","거버넌스·감사","권한·감사·백업","governance.html"],
      ["","사용자 매뉴얼","플랫폼 사용 안내","manual.html"],
      ["","적용사례","현장 적용 사례","cases.html"],
      ["","구조도","플랫폼 구조도","architecture.html"]
    ]}
  ];
  const file = () => (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const currentStage = () => Math.max(1, Math.min(13, Number((JSON.parse(localStorage.getItem("k-fde-standalone-v1") || "{}").stage || 0) + 1)));
  function linkHtml(item, stage) {
    const n=item[0], title=item[1], desc=item[2], href=item[3], target=href.split("#")[0].toLowerCase();
    const active=file()===target;
    const current=typeof n==="number" && n===stage;
    return '<a class="nav-link '+(active?'active ':'')+(current?'current-stage ':'')+(!n?'support':'')+'" href="'+href+'"'+(active?' aria-current="page"':'')+'><i class="stage-index">'+(n ? String(n).padStart(2,"0") : "•")+'</i><span class="stage-copy"><strong>'+title+'</strong><small>'+desc+'</small></span></a>';
  }
  function render(){
    const nav=document.querySelector(".sidebar nav"); if(!nav || nav.dataset.stageSidebarReady)return;
    nav.className="stage-nav"; nav.dataset.stageSidebarReady="true";
    const stage=currentStage();
    nav.innerHTML='<div class="nav-progress"><div><span>13단계 진행</span><b>현장 실행</b></div><i><span style="width:'+Math.round(stage/13*100)+'%"></span></i></div>'+groups.map(g=>'<section class="nav-section" data-nav-group="'+g.id+'"><button class="nav-section-title" type="button" data-toggle-group="'+g.id+'"><b>'+g.title+'</b><span class="phase-count">'+g.items.length+'</span><span class="chevron">⌄</span></button><span class="phase-caption">'+g.caption+'</span><div class="nav-section-body">'+g.items.map(x=>linkHtml(x,stage)).join("")+'</div></section>').join("");
  }
  document.addEventListener("DOMContentLoaded",render);
  document.addEventListener("click",e=>{const b=e.target.closest("[data-toggle-group]");if(!b)return;const s=b.closest(".nav-section");s.classList.toggle("collapsed");});
})();

