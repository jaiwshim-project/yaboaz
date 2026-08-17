(function () {
  "use strict";
  var KEY = "k-fde-mvp-v2";

  function load() {
    try { return Object.assign({ projects: [], projectBriefs: {}, discoveryPlans: {}, audits: [], currentProjectId: "firenavi", role: "FDE" }, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (_) { return { projects: [], projectBriefs: {}, discoveryPlans: {}, audits: [], currentProjectId: "firenavi", role: "FDE" }; }
  }
  function save(value) { localStorage.setItem(KEY, JSON.stringify(value)); }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>'"]/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[c]; }); }
  function project(data) {
    var id = data.currentProjectId || "firenavi";
    return (data.projects || []).find(function (item) { return item.id === id; }) || { id:id, name:id === "firenavi" ? "FireNavi 산업안전 AX" : "선택 프로젝트", customer:"프로젝트 고객", industry:"현장", goal:"고객 성과 개선" };
  }

  function questionBank(goal) {
    return [
      ["전략·성과", "01", [
        ["이 프로젝트가 성공했다고 판단할 수 있는 가장 구체적인 변화는 무엇입니까?", "추상적 목표를 측정 가능한 결과로 전환", "북극성 지표·목표값·측정 시점"],
        ["현재 목표인 ‘" + goal + "’이 경영 우선순위와 어떻게 연결됩니까?", "현장 과제와 경영 후원 관계 확인", "예산·의사결정 근거와 후원자"],
        ["이번 프로젝트에서 의도적으로 해결하지 않을 범위는 무엇입니까?", "범위 팽창과 성공 기준 왜곡 방지", "포함·제외 범위와 경계조건"]
      ]],
      ["고객·사용자", "02", [
        ["가장 큰 영향을 받는 사용자는 누구이며 언제 문제를 체감합니까?", "실제 사용자와 사용 맥락 특정", "핵심 페르소나와 관찰 시점"],
        ["현재 해결책을 우회하거나 비공식적으로 처리하는 방식은 무엇입니까?", "숨은 업무와 로컬 최적화 발견", "비공식 도구·우회 절차·실제 요구"],
        ["사용자가 변화를 거부할 만한 이유는 무엇입니까?", "도입 저항과 손실 인식 탐색", "교육·인센티브·변화관리 요구"]
      ]],
      ["현재 프로세스", "03", [
        ["업무가 시작되는 사건부터 종료까지 실제 순서를 설명해 주시겠습니까?", "문서가 아닌 실제 업무 흐름 복원", "현재 상태 프로세스와 핵심 이벤트"],
        ["가장 오래 기다리거나 반복 입력하는 단계는 어디입니까?", "대기·재작업·중복 병목 식별", "리드타임 손실 구간과 개선 후보"],
        ["정상 흐름과 실제 현장 흐름이 달라지는 지점은 어디입니까?", "표준과 실행의 간극 확인", "예외 분기와 암묵적 운영 규칙"]
      ]],
      ["문제·예외", "04", [
        ["최근 실패 사례 하나를 시간순으로 재구성해 주시겠습니까?", "일반론 대신 검증 가능한 사건 증거 확보", "원인 후보·결정·영향의 사건 연쇄"],
        ["문제가 발생하기 직전에 관찰 가능한 신호는 무엇입니까?", "선행지표와 조기 경보 가능성 탐색", "탐지 신호·임계값·대응 시점"],
        ["가장 빈번한 문제와 가장 치명적인 문제는 각각 무엇입니까?", "빈도와 영향도를 분리해 우선순위 설정", "문제 포트폴리오와 위험 등급"]
      ]],
      ["사람·의사결정", "05", [
        ["누가 어떤 정보로 최종 판단하며 판단 기준이 문서화되어 있습니까?", "의사결정 권한과 규칙 명시화", "결정권자·입력정보·판정 규칙"],
        ["부서나 교대조마다 판단이 달라지는 사례가 있습니까?", "규칙 충돌과 조직 경계 문제 발견", "상충 규칙과 조정 필요 지점"],
        ["긴급 상황에서 승인 절차는 어떻게 달라집니까?", "속도와 통제의 실제 균형 확인", "고위험 행동 승인·에스컬레이션 모델"]
      ]],
      ["데이터·증거", "06", [
        ["현재 판단에 사용하는 데이터의 출처와 생성 주체는 누구입니까?", "데이터 계보와 책임소재 확인", "원천·소유자·갱신주기·신뢰도"],
        ["누락·중복·지연·오류가 가장 많은 데이터는 무엇입니까?", "데이터 품질 위험 정량화", "품질 규칙과 정제 우선순위"],
        ["문제를 입증하거나 반증하려면 추가로 어떤 증거가 필요합니까?", "가설 검증에 필요한 정보 격차 확인", "증거 수집 계획과 질문 우선순위"]
      ]],
      ["시스템·연계", "07", [
        ["동일한 정보를 여러 시스템에 입력하거나 복사하는 구간은 어디입니까?", "시스템 단절과 중복 작업 식별", "통합·자동화·단일 원천 후보"],
        ["네트워크 장애나 시스템 지연 시 업무를 어떻게 지속합니까?", "복원력과 오프라인 요구 확인", "대체 절차·동기화·충돌 정책"],
        ["외부 연계에서 변경하기 가장 어려운 제약은 무엇입니까?", "기술·계약·운영 종속성 탐색", "API·레거시·벤더 제약 목록"]
      ]],
      ["보안·위험", "08", [
        ["어떤 정보가 민감하며 누가 어느 수준까지 볼 수 있어야 합니까?", "필드·객체 단위 접근 경계 정의", "권한 매트릭스와 마스킹 요구"],
        ["자동화하면 안 되거나 반드시 사람의 승인이 필요한 행동은 무엇입니까?", "고위험 행동의 인간 통제점 설정", "Human-in-the-loop 승인 목록"],
        ["데이터 보존·반출·삭제에 적용되는 규정은 무엇입니까?", "수명주기와 규제 준수 조건 확인", "보존기간·삭제·감사 요구"]
      ]],
      ["실행·변화관리", "09", [
        ["2~4주 안에 가장 작게 검증할 수 있는 실행은 무엇입니까?", "큰 구축 전 핵심 가설의 저비용 검증", "MVP 범위·대상·성공 기준"],
        ["파일럿 결과를 누가 어떤 회의에서 평가합니까?", "실험 후 의사결정 경로 확정", "평가자·리뷰 주기·확대 조건"],
        ["새 방식이 정착되었는지 확인할 선행지표는 무엇입니까?", "성과 이전의 행동 변화 측정", "사용률·준수율·수정률·학습지표"]
      ]]
    ];
  }

  function directions(brief) {
    var result = [
      ["성과 기준선 확정", "목표와 KPI의 현재값·목표값·측정 책임자를 먼저 고정합니다.", "전략·성과"],
      ["실제 업무 흐름 복원", "문서 절차가 아닌 사건·결정·대기·예외 중심으로 현재 흐름을 관찰합니다.", "프로세스"],
      ["의사결정 규칙 명시화", "사람·부서별 판단 차이와 승인·에스컬레이션 조건을 비교합니다.", "거버넌스"]
    ];
    if (!brief.dataSources) result.push(["데이터 준비도 진단", "데이터 원천·소유자·갱신주기·품질·반출 가능성을 우선 확인합니다.", "데이터"]);
    if (!brief.security) result.push(["보안 경계 선확정", "민감정보와 객체·필드·행동별 접근권한을 탐색 초기에 정의합니다.", "위험"]);
    if (brief.painPoints) result.push(["문제 진술 검증", "등록된 문제를 최근 사건·빈도·영향·증거로 분해해 사실과 가설을 구분합니다.", "증거"]);
    return result.slice(0, 6);
  }

  function analysisSections(brief, dirs, coverage) {
    var lenses = [["사용자 관점","누가 언제 어떤 상황에서 불편·위험·지연을 경험하는가"],["프로세스 관점","사건·대기·인계·재작업·예외가 어디에서 발생하는가"],["의사결정 관점","누가 어떤 정보와 규칙으로 판단하며 충돌은 어디에 있는가"],["데이터 관점","사실을 입증할 원천·품질·계보·최신성이 충분한가"],["시스템 관점","시스템 경계가 업무 단절·중복·수작업을 만드는가"],["성과·위험 관점","고객 결과와 안전·보안·규제 위험을 함께 통제하는가"]];
    var methods = [["Evidence Triangulation","인터뷰·관찰·로그의 3개 출처로 사실을 교차검증"],["SIPOC","공급자·입력·프로세스·출력·고객으로 업무 경계 설정"],["Value Stream Mapping","처리시간·대기시간·재작업을 분리해 병목 정량화"],["5 Whys + Causal Map","표면 증상에서 구조적 원인과 피드백 고리 추적"],["Event Storming","업무 사건·명령·정책·주체·시스템을 시간순 구조화"],["JTBD","사용자가 특정 상황에서 달성하려는 진짜 진전 정의"],["Contradiction Mapping","부서·규정·속도·통제 사이의 상충 기준 시각화"],["Data Readiness Matrix","가용성·품질·권한·최신성·연계성 평가"]];
    var process = [["범위 정렬","목표·제외범위·결정권자 확정"],["증거 인벤토리","자료·로그·관찰·발언 분류"],["현장 관찰","실제 흐름·우회·예외 포착"],["인터뷰","역할별 판단과 갈등 탐색"],["구조화","객체·상태·사건·규칙 연결"],["가설 검증","반증 증거와 작은 실험 설계"],["결정·실행","승인 후 KPI 기반 실행"]];
    var hypotheses = ["문제의 주원인은 업무량보다 인계·승인·정보 대기일 가능성이 있다.","공식 절차와 실제 현장 절차의 차이가 오류와 재작업을 만든다.","부서별 판정 기준 또는 데이터 정의 충돌이 의사결정을 지연시킨다.","고객 성과를 설명할 기준선과 선행지표가 충분히 정의되지 않았다."];
    return '<section class="white discovery-section"><header><div><small>01 · DISCOVERY DIRECTION</small><h3>우선 문제발견 방향</h3></div><p>등록 정보의 공백과 위험을 기준으로 제안합니다.</p></header><div class="direction-grid">' + dirs.map(function(d,i){return '<article class="direction-card"><strong>'+String(i+1).padStart(2,"0")+'</strong><h4>'+d[0]+'</h4><p>'+d[1]+'</p><footer><span>'+d[2]+'</span><span>우선 검증</span></footer></article>';}).join("") + '</div></section>' +
      '<section class="white discovery-section"><header><div><small>02 · ANALYTICAL LENSES</small><h3>FDE 분석 관점</h3></div></header><div class="lens-grid">' + lenses.map(function(x,i){return '<article class="lens-card"><small>LENS '+(i+1)+'</small><h4>'+x[0]+'</h4><p>'+x[1]+'</p></article>';}).join("") + '</div></section>' +
      '<section class="white discovery-section"><header><div><small>03 · DISCOVERY PROCESS</small><h3>문제발견 프로세스</h3></div></header><div class="process-track">' + process.map(function(x,i){return '<article class="process-step"><b>'+String(i+1).padStart(2,"0")+'</b><h4>'+x[0]+'</h4><p>'+x[1]+'</p></article>';}).join("") + '</div></section>' +
      '<section class="white discovery-section"><header><div><small>04 · HYPOTHESES</small><h3>초기 검증 가설</h3></div><p>인터뷰·관찰·로그로 반증해야 할 출발점입니다.</p></header><div class="hypothesis-list">' + hypotheses.map(function(h,i){return '<article class="hypothesis"><b>H'+(i+1)+'</b><p>'+h+'</p><small>필요 증거 · 사건 사례 / 로그 / 역할별 답변</small></article>';}).join("") + '</div></section>' +
      '<section class="white discovery-section"><header><div><small>05 · METHODS</small><h3>권장 방법론</h3></div></header><div class="method-grid">' + methods.map(function(x){return '<article class="method-card"><small>METHOD</small><h4>'+x[0]+'</h4><p>'+x[1]+'</p></article>';}).join("") + '</div><div class="coverage-list" style="margin-top:14px"><b style="font-size:8px">자료 커버리지</b>' + (coverage.length ? coverage.map(function(c){return '<span>'+esc(c)+'</span>';}).join("") : '<span>업로드 자료 없음 · 사전자료 보완 필요</span>') + '</div></section>';
  }

  function questionSections(groups, selected) {
    var tools = '<button class="active" data-category="전체">전체</button>' + groups.map(function(g){return '<button data-category="'+g[0]+'">'+g[0]+'</button>';}).join("") + '<input id="question-search" aria-label="질문 검색" placeholder="질문·의도·결과 검색">';
    var body = groups.map(function(group){return '<section class="interview-category" data-group="'+group[0]+'"><header><b>'+group[1]+'</b><div><h4>'+group[0]+'</h4><small>질문 '+group[2].length+'개</small></div></header>' + group[2].map(function(item,index){var id=group[1]+"-"+index,chosen=selected.indexOf(id)>-1;return '<article class="interview-question" data-text="'+esc((item[0]+item[1]+item[2]).toLowerCase())+'"><span>Q'+(index+1)+'</span><h5>'+esc(item[0])+'</h5><div class="question-intent"><small>질문 의도</small><p>'+esc(item[1])+'</p></div><div class="question-outcome"><small>기대 결과</small><p>'+esc(item[2])+'</p></div><button class="'+(chosen?'selected':'')+'" data-select-question="'+id+'">'+(chosen?'선택됨 ✓':'계획에 추가')+'</button></article>';}).join("") + '</section>';}).join("");
    return '<section class="white discovery-section" id="interview-bank"><header><div><small>06 · INTERVIEW QUESTION BANK</small><h3>9개 카테고리 고객 인터뷰 질문</h3></div><div class="question-tools">'+tools+'</div></header><div id="question-groups">'+body+'</div></section>';
  }

  function render() {
    var data=load(), p=project(data), brief=(data.projectBriefs||{})[p.id]||{goal:p.goal,documents:[]}, plan=(data.discoveryPlans||{})[p.id]||{selected:[],notes:""};
    var groups=questionBank(brief.goal||p.goal), dirs=directions(brief), filled=["background","goal","stakeholders","currentProcess","painPoints","systems","dataSources","kpis","constraints"].filter(function(k){return String(brief[k]||"").trim();}).length;
    var docs=brief.documents||[], coverage=Array.from(new Set(docs.map(function(d){return d.category;}))), score=Math.round((filled/9*.75+Math.min(1,coverage.length/5)*.25)*100);
    var main=document.querySelector(".workspace main");if(main)main.remove();var footer=document.querySelector(".premium-footer");
    footer.insertAdjacentHTML("beforebegin", '<main class="page discovery-page"><section class="analysis-hero"><div><small>FDE DISCOVERY BRIEF</small><h2>'+esc(p.name)+' 문제발견 설계</h2><p>등록 프로젝트 정보와 사전자료 분류를 바탕으로 무엇을, 어떤 관점과 순서로 확인해야 하는지 제안합니다.</p></div><div class="analysis-score"><b>'+score+'</b><span>발견 준비도<br>100점 기준</span></div></section><section class="analysis-summary"><article class="white"><small>구조화 정보</small><b>'+filled+'/9</b><p>핵심 분석 필드</p></article><article class="white"><small>사전자료</small><b>'+docs.reduce(function(n,d){return n+(d.names||[]).length;},0)+'</b><p>'+coverage.length+'개 자료 카테고리</p></article><article class="white"><small>탐색 방향</small><b>'+dirs.length+'</b><p>우선 검증 영역</p></article><article class="white"><small>인터뷰 질문</small><b>27</b><p>9개 카테고리</p></article></section>'+analysisSections(brief,dirs,coverage)+'<section class="white plan-drawer"><header><div><small>INTERVIEW PLAN</small><h3>선택 질문 계획 <span id="selected-count">'+plan.selected.length+'</span>개</h3></div></header><textarea id="discovery-notes" placeholder="인터뷰 대상, 일정, 확인할 가설을 메모하세요.">'+esc(plan.notes||"")+'</textarea><div class="plan-actions"><button id="print-questions">질문지 인쇄·PDF</button><a href="project-onboarding.html">사전자료 보완</a><button class="primary" id="save-plan">질문 계획 저장 →</button></div></section>'+questionSections(groups,plan.selected)+'</main>');
    markNav();bind(p.id);
  }

  function bind(projectId) {
    document.addEventListener("click", function(event){var category=event.target.closest("[data-category]"),select=event.target.closest("[data-select-question]");if(category){document.querySelectorAll("[data-category]").forEach(function(b){b.classList.toggle("active",b===category);});document.querySelectorAll("[data-group]").forEach(function(g){g.hidden=category.dataset.category!=="전체"&&g.dataset.group!==category.dataset.category;});}if(select){var data=load();data.discoveryPlans=data.discoveryPlans||{};var plan=data.discoveryPlans[projectId]||{selected:[],notes:""},id=select.dataset.selectQuestion,index=plan.selected.indexOf(id);if(index>-1)plan.selected.splice(index,1);else plan.selected.push(id);data.discoveryPlans[projectId]=plan;save(data);select.classList.toggle("selected",index===-1);select.textContent=index===-1?"선택됨 ✓":"계획에 추가";document.getElementById("selected-count").textContent=plan.selected.length;}});
    document.getElementById("question-search").addEventListener("input",function(){var q=this.value.trim().toLowerCase();document.querySelectorAll(".interview-question").forEach(function(row){row.hidden=q&&row.dataset.text.indexOf(q)<0;});});
    document.getElementById("save-plan").addEventListener("click",function(){var data=load();data.discoveryPlans=data.discoveryPlans||{};var plan=data.discoveryPlans[projectId]||{selected:[]};plan.notes=document.getElementById("discovery-notes").value;plan.updatedAt=new Date().toISOString();data.discoveryPlans[projectId]=plan;data.audits=data.audits||[];data.audits.unshift({id:"audit-"+Date.now(),at:new Date().toISOString(),actor:"로컬 사용자",role:data.role||"FDE",action:"DiscoveryPlanSaved",target:projectId,detail:plan.selected.length+"개 질문"});save(data);location.href="questions.html";});
    document.getElementById("print-questions").addEventListener("click",function(){window.print();});
  }
  function markNav(){var nav=document.querySelector(".sidebar nav"),questions=nav&&nav.querySelector('a[href="questions.html"]');if(!nav||!questions)return;questions.classList.remove("active");var link=document.createElement("a");link.className="nav-link active";link.href="discovery-analysis.html";link.innerHTML="<i>⌕</i><span>문제발견·인터뷰</span>";questions.insertAdjacentElement("beforebegin",link);var title=document.querySelector(".topbar h1");if(title)title.textContent="문제발견·인터뷰 설계";}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);else render();
})();
