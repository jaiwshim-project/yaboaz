(function () {
  "use strict";
  var BASE_KEY = "k-fde-standalone-v1";
  var MVP_KEY = "k-fde-mvp-v2";
  var SNAP_KEY = "k-fde-auto-snapshots-v1";
  var page = document.body.dataset.page || "command";

  function read(key, fallback) { try { return Object.assign(fallback, JSON.parse(localStorage.getItem(key) || "{}")); } catch (_) { return fallback; } }
  function base() { return read(BASE_KEY, {}); }
  function mvp() { return read(MVP_KEY, { projects: [], kpis: [], ontology: [], interviews: [], relations: [], approvalHistory: [], customQuestions: [], audits: [], currentProjectId: "firenavi" }); }
  function saveMvp(value) { localStorage.setItem(MVP_KEY, JSON.stringify(value)); }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>'"]/g, function (c) { return { "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" }[c]; }); }
  function id(prefix) { return prefix + "-" + Date.now() + "-" + Math.random().toString(16).slice(2); }
  function currentProject() { var data=mvp(); return data.currentProjectId || base().projectId || "firenavi"; }
  function applies(record) { return !record.projectId || record.projectId === currentProject(); }
  function notify(message) { var el=document.getElementById("toast"); if(!el)return; el.textContent="✓  "+message;el.classList.add("show");setTimeout(function(){el.classList.remove("show");},2200); }
  function addAudit(action,target,detail) { var data=mvp();data.audits=data.audits||[];data.audits.unshift({id:id("audit"),at:new Date().toISOString(),actor:"로컬 사용자",role:data.role||"FDE",action:action,target:target,detail:detail||""});data.audits=data.audits.slice(0,300);saveMvp(data); }

  function snapshot(reason) {
    var snapshots=[];try{snapshots=JSON.parse(localStorage.getItem(SNAP_KEY)||"[]");}catch(_){}
    var payload={at:new Date().toISOString(),reason:reason||"자동 저장",base:base(),extended:mvp()};
    var signature=JSON.stringify(payload.base)+JSON.stringify(payload.extended);
    if(snapshots[0]&&snapshots[0].signature===signature)return;
    snapshots.unshift({at:payload.at,reason:payload.reason,signature:signature,base:payload.base,extended:payload.extended});
    localStorage.setItem(SNAP_KEY,JSON.stringify(snapshots.slice(0,5)));
  }

  function setProject(idValue) { var data=mvp();data.currentProjectId=idValue;saveMvp(data);addAudit("ProjectSelected",idValue,"프로젝트 데이터 범위 변경");location.href="project-onboarding.html"; }

  function enhanceTopbar() {
    var actions=document.querySelector(".top-actions");if(!actions)return;
    var wrap=document.createElement("div");wrap.className="advanced-search";wrap.style.position="relative";
    wrap.innerHTML='<input id="global-search" aria-label="전체 검색" placeholder="⌕ 전체 검색" autocomplete="off" style="border:1px solid var(--line);border-radius:7px;padding:8px 10px;font-size:8px"><div id="global-results" class="global-results" hidden></div>';
    actions.insertAdjacentElement("afterbegin",wrap);
    var data=mvp(), custom=data.projects.find(function(p){return p.id===currentProject();});
    if(custom){var switcher=document.querySelector(".project-switcher a");if(switcher)switcher.innerHTML='<span class="project-dot"></span>'+esc(custom.name)+'<b>⌄</b>';}
  }

  function search(query) {
    query=query.trim().toLowerCase();var result=document.getElementById("global-results");if(!query){result.hidden=true;return;}
    var data=mvp(),b=base(),items=[];
    (data.projects||[]).forEach(function(x){items.push({page:"projects.html",type:"프로젝트",title:x.name,text:x.customer+" "+x.goal});});
    (b.evidence||[]).forEach(function(x){items.push({page:"field-records.html",type:"증거",title:x.title,text:x.source});});
    (data.ontology||[]).forEach(function(x){items.push({page:"ontology.html",type:x.type,title:x.name,text:x.definition});});
    (data.interviews||[]).forEach(function(x){items.push({page:"questions.html",type:"인터뷰",title:x.person,text:x.question+" "+x.answer});});
    (data.kpis||[]).forEach(function(x){items.push({page:"kpi.html",type:"KPI",title:x.name,text:x.value+" "+x.note});});
    items=items.filter(function(x){return (x.type+" "+x.title+" "+x.text).toLowerCase().indexOf(query)>-1;}).slice(0,12);
    result.innerHTML=items.length?items.map(function(x){return '<a href="'+x.page+'"><b>'+esc(x.type)+' · '+esc(x.title)+'</b><small>'+esc(x.text)+'</small></a>';}).join(""):'<a href="#">검색 결과가 없습니다.</a>';
    result.hidden=false;
  }

  function enhanceProjects() {
    if(page!=="projects")return;
    document.querySelectorAll(".custom-project").forEach(function(card,index){var project=(mvp().projects||[])[index];if(!project)return;var footer=card.querySelector("footer");if(!footer)return;footer.insertAdjacentHTML("beforebegin",'<div class="record-actions"><button data-advanced="edit-project" data-id="'+project.id+'">수정</button><button data-advanced="clone-project" data-id="'+project.id+'">복제</button><button class="danger" data-advanced="delete-project" data-id="'+project.id+'">삭제</button></div>');});
    var grid=document.querySelector(".project-grid");if(grid)grid.insertAdjacentHTML("beforebegin",'<div class="advanced-bar"><input id="project-filter" aria-label="프로젝트 필터" placeholder="프로젝트·고객·목표 필터"><select id="project-industry"><option value="">모든 산업</option><option>안전</option><option>제조</option><option>의료</option><option>교육</option><option>공공</option><option>금융</option></select><span class="auto-backup-note">최근 5개 변경 자동 백업</span></div>');
  }

  function renderFileVault() {
    if(page!=="field"||!window.KFDE_DB)return;
    var list=document.querySelector(".evidence-list");if(!list)return;
    var section=document.createElement("section");section.className="white file-vault";section.innerHTML='<div class="section-title"><div><small>LOCAL FILE VAULT</small><h3>첨부파일 금고</h3></div><span class="pill" id="file-count">확인 중</span></div><div class="file-vault-grid" id="file-vault-grid"></div>';
    list.insertAdjacentElement("afterend",section);
    window.KFDE_DB.allFiles().then(function(files){var evidence=base().evidence||[];files=files.filter(function(file){var owner=evidence.find(function(item){return item.evidenceId===file.evidenceId;});return !owner||!owner.projectId||owner.projectId===currentProject();});document.getElementById("file-count").textContent=files.length+"개";document.getElementById("file-vault-grid").innerHTML=files.length?files.map(function(file){var image=file.type.indexOf("image/")===0;var preview=image?'<img data-file-preview="'+file.id+'" alt="'+esc(file.name)+' 미리보기">':'<span>'+esc((file.type||"FILE").split("/").pop().toUpperCase())+'</span>';return '<article class="file-card"><div class="preview">'+preview+'</div><b title="'+esc(file.name)+'">'+esc(file.name)+'</b><small>'+Math.ceil(file.size/1024)+' KB · '+new Date(file.createdAt).toLocaleDateString("ko-KR")+'</small><div class="record-actions"><button data-file-download="'+file.id+'">다운로드</button><button class="danger" data-file-delete="'+file.id+'">삭제</button></div></article>';}).join(""):'<p>저장된 첨부파일이 없습니다.</p>';files.forEach(function(file){if(file.type.indexOf("image/")===0){var img=document.querySelector('[data-file-preview="'+file.id+'"]');if(img){var url=URL.createObjectURL(file.blob);img.src=url;img.onload=function(){URL.revokeObjectURL(url);};}}});window.__KFDE_FILES=files;});
  }

  function enhanceQuestions() {
    if(page!=="questions")return;var layout=document.querySelector(".question-layout");if(!layout)return;var data=mvp();
    var section=document.createElement("section");section.className="white interview-log";section.innerHTML='<div class="section-title"><div><small>INTERVIEW EVIDENCE</small><h3>질문·답변 기록</h3></div><button data-advanced="add-custom-question">＋ 질문 추가</button></div><form id="interview-form" class="interview-builder"><label>대상자<input name="person" required placeholder="직무 또는 이름"></label><label>질문<select name="question" required><option value="">질문 선택</option>'+['실제 대응이 가장 늦어지는 순간은 언제인가요?','현재 기준이 충돌하는 사례는 무엇인가요?'].concat((data.customQuestions||[]).map(function(q){return q.text;})).map(function(q){return '<option>'+esc(q)+'</option>';}).join("")+'</select></label><label>답변<textarea name="answer" required></textarea></label><label>후속 조치<textarea name="followup" placeholder="추가 확인 또는 실행 항목"></textarea></label><button class="primary" type="submit">인터뷰 저장</button></form><div>'+((data.interviews||[]).filter(applies).slice().reverse().map(function(x){return '<article class="interview-entry"><div><b>'+esc(x.person)+'</b><small>'+new Date(x.at).toLocaleString("ko-KR")+'</small></div><div class="record-actions"><button class="danger" data-advanced="delete-interview" data-id="'+x.id+'">삭제</button></div><p><strong>Q.</strong> '+esc(x.question)+'<br><strong>A.</strong> '+esc(x.answer)+(x.followup?'<br><strong>후속.</strong> '+esc(x.followup):'')+'</p></article>';}).join("")||'<p>저장된 인터뷰가 없습니다.</p>')+'</div>';
    layout.insertAdjacentElement("afterend",section);
  }

  function enhanceOntology() {
    if(page!=="ontology")return;var studio=document.querySelector(".ontology-studio");if(!studio)return;var data=mvp();
    var names=["현장","작업자","사고","위험 알림"].concat((data.ontology||[]).map(function(x){return x.name;}));
    var section=document.createElement("section");section.className="white relation-editor";section.innerHTML='<div class="section-title"><div><small>RELATION EDITOR</small><h3>요소·관계 편집</h3></div><span class="pill">'+(data.relations||[]).filter(applies).length+'개 관계</span></div><form id="relation-form" class="relation-form"><label>출발 요소<input name="from" list="node-list" required></label><label>관계<select name="relation"><option>연결됨</option><option>발생 위치</option><option>트리거</option><option>수행 주체</option><option>영향</option></select></label><label>도착 요소<input name="to" list="node-list" required></label><button type="submit">관계 추가</button><datalist id="node-list">'+names.map(function(n){return '<option value="'+esc(n)+'">';}).join("")+'</datalist></form><div class="relation-list">'+((data.relations||[]).filter(applies).map(function(r){return '<article class="relation-row"><span><b>'+esc(r.from)+'</b> — '+esc(r.relation)+' → <b>'+esc(r.to)+'</b></span><div class="record-actions"><button data-advanced="edit-relation" data-id="'+r.id+'">수정</button><button class="danger" data-advanced="delete-relation" data-id="'+r.id+'">삭제</button></div></article>';}).join("")||'<p>직접 추가한 관계가 없습니다.</p>')+'</div><h4>직접 추가한 요소</h4>'+((data.ontology||[]).map(function(n){return '<article class="relation-row"><span><b>'+esc(n.type)+' · '+esc(n.name)+'</b> — '+esc(n.definition)+'</span><div class="record-actions"><button data-advanced="edit-node" data-id="'+n.id+'">수정</button><button class="danger" data-advanced="delete-node" data-id="'+n.id+'">삭제</button></div></article>';}).join("")||'<p>직접 추가한 요소가 없습니다.</p>');
    studio.insertAdjacentElement("afterend",section);
  }

  function enhanceApprovals() {
    if(page!=="approvals")return;document.querySelectorAll(".approval-list article:not(.resolved)").forEach(function(card){var footer=card.querySelector("footer");if(footer)footer.insertAdjacentHTML("afterbegin",'<input class="approval-reason" aria-label="결정 사유" placeholder="승인·반려 사유를 입력하세요">');});
    document.querySelectorAll(".approval-list article").forEach(function(card,index){if(card.classList.contains("resolved"))card.insertAdjacentHTML("beforeend",'<footer><button data-advanced="reopen-approval" data-id="'+(index+1)+'" data-index="'+index+'">재검토</button></footer>');});
    var history=(mvp().approvalHistory||[]).filter(applies);var list=document.querySelector(".approval-list");if(list){var section=document.createElement("section");section.className="white approval-history";section.innerHTML='<div class="section-title"><div><small>DECISION HISTORY</small><h3>승인 변경 이력</h3></div><span class="pill">'+history.length+'건</span></div>'+history.slice(0,30).map(function(h){return '<article class="approval-entry"><div><b>'+esc(h.decision==='accepted'?'승인':'반려')+' · '+esc(h.target)+'</b><small>'+new Date(h.at).toLocaleString("ko-KR")+'</small></div><span>'+esc(h.role)+'</span><p>'+esc(h.reason||"사유 미입력")+'</p></article>';}).join("");list.insertAdjacentElement("afterend",section);}
  }

  function enhanceKpi() {
    if(page!=="kpi")return;var records=(mvp().kpis||[]).filter(applies);var grid=document.querySelector(".kpi-grid");if(!grid)return;var chart=document.createElement("section");chart.className="white report-tools";chart.innerHTML='<span>프로젝트별 KPI 실적을 CSV로 반출하거나 인쇄 대화상자에서 PDF로 저장할 수 있습니다.</span><select id="kpi-period"><option value="all">전체 기간</option><option value="30">최근 30일</option><option value="7">최근 7일</option></select><button data-advanced="export-csv">CSV 내보내기</button><button data-advanced="print-report">PDF·인쇄 보고서</button>';grid.insertAdjacentElement("afterend",chart);var graph=document.createElement("section");graph.className="white local-records";graph.id="advanced-kpi-chart";graph.innerHTML='<div class="section-title"><div><small>PERFORMANCE TREND</small><h3>입력 실적 비교</h3></div></div><div class="kpi-chart">'+(records.length?records.slice(-10).map(function(x){var numeric=parseFloat(String(x.value).replace(/[^0-9.-]/g,""))||1;var height=Math.max(8,Math.min(100,numeric));return '<div title="'+esc(x.name+' '+x.value)+'"><b>'+esc(x.value)+'</b><i style="height:'+height+'%"></i><small>'+esc(x.name)+'</small></div>';}).join(""):'<p>KPI 실적을 입력하면 차트가 생성됩니다.</p>')+'</div>';chart.insertAdjacentElement("afterend",graph);
  }

  function exportCsv() {
    var data=mvp();var rows=[["구분","프로젝트","항목","값","목표/상세","시각"]];(data.kpis||[]).filter(applies).forEach(function(x){rows.push(["KPI",currentProject(),x.name,x.value,x.target+" / "+x.note,x.at]);});(data.interviews||[]).filter(applies).forEach(function(x){rows.push(["인터뷰",currentProject(),x.person,x.question,x.answer,x.at]);});var csv="\ufeff"+rows.map(function(row){return row.map(function(cell){return '"'+String(cell||"").replace(/"/g,'""')+'"';}).join(",");}).join("\r\n");var link=document.createElement("a");link.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));link.download="K-FDE_report_"+new Date().toISOString().slice(0,10)+".csv";link.click();URL.revokeObjectURL(link.href);addAudit("ReportExported","CSV",currentProject());
  }

  function bind() {
    enhanceTopbar();enhanceProjects();renderFileVault();enhanceQuestions();enhanceOntology();enhanceApprovals();enhanceKpi();snapshot("페이지 진입 자동 백업");
    document.addEventListener("click",function(e){var button=e.target.closest('[data-advanced="reopen-approval"]');if(!button)return;e.preventDefault();e.stopImmediatePropagation();var b=base(),key=button.dataset.id;if(key&&b.approvals&&b.approvals[key]){snapshot("승인 재검토 전");delete b.approvals[key];localStorage.setItem(BASE_KEY,JSON.stringify(b));var data=mvp();data.approvalHistory=data.approvalHistory||[];data.approvalHistory.unshift({id:id("decision"),projectId:currentProject(),target:key,decision:"reopened",reason:"재검토 요청",role:data.role||"FDE",at:new Date().toISOString()});saveMvp(data);addAudit("ApprovalReopened",key,"재검토 요청");location.reload();}},true);
    document.addEventListener("input",function(e){if(e.target.id==="global-search")search(e.target.value);if(e.target.id==="project-filter"){var q=e.target.value.toLowerCase();document.querySelectorAll(".project-card").forEach(function(card){card.hidden=card.textContent.toLowerCase().indexOf(q)<0;});}});
    document.addEventListener("change",function(e){if(e.target.id==="project-industry"){document.querySelectorAll(".project-card").forEach(function(card){card.hidden=e.target.value&&card.textContent.indexOf(e.target.value)<0;});}if(e.target.id==="kpi-period"){var days=e.target.value==="all"?Infinity:Number(e.target.value),cutoff=Date.now()-days*86400000;document.querySelectorAll(".local-records article").forEach(function(row){var date=row.querySelector("small");row.hidden=date&&new Date(date.textContent).getTime()<cutoff;});}});
    document.addEventListener("submit",function(e){if(e.target.id==="interview-form"){e.preventDefault();snapshot("인터뷰 저장 전");var f=new FormData(e.target),data=mvp();data.interviews=data.interviews||[];data.interviews.push({id:id("interview"),projectId:currentProject(),person:String(f.get("person")),question:String(f.get("question")),answer:String(f.get("answer")),followup:String(f.get("followup")),at:new Date().toISOString()});saveMvp(data);addAudit("InterviewRecorded",String(f.get("person")),String(f.get("question")));location.reload();}if(e.target.id==="relation-form"){e.preventDefault();snapshot("관계 추가 전");var r=new FormData(e.target),d=mvp();d.relations=d.relations||[];d.relations.push({id:id("relation"),projectId:currentProject(),from:String(r.get("from")),relation:String(r.get("relation")),to:String(r.get("to")),at:new Date().toISOString()});saveMvp(d);addAudit("OntologyRelationCreated",String(r.get("from")),String(r.get("relation"))+" → "+String(r.get("to")));location.reload();}});
    document.addEventListener("click",function(e){var el=e.target.closest("[data-advanced],[data-file-download],[data-file-delete],[data-open-project],[data-decision],[data-action]");if(!el)return;if(el.dataset.action==="reset")snapshot("초기화 전 자동 백업");if(el.dataset.openProject){e.preventDefault();e.stopImmediatePropagation();setProject(el.dataset.openProject);return;}if(el.dataset.fileDownload){var file=(window.__KFDE_FILES||[]).find(function(x){return x.id===el.dataset.fileDownload;});if(file)window.KFDE_DB.download(file);return;}if(el.dataset.fileDelete){if(confirm("이 첨부파일을 로컬 금고에서 삭제할까요?")){snapshot("파일 삭제 전");window.KFDE_DB.removeFile(el.dataset.fileDelete).then(function(){addAudit("EvidenceFileDeleted",el.dataset.fileDelete,"");location.reload();});}return;}if(el.dataset.decision){var reasonInput=el.closest("article").querySelector(".approval-reason"),data=mvp();data.approvalHistory=data.approvalHistory||[];data.approvalHistory.unshift({id:id("decision"),projectId:currentProject(),target:el.dataset.id,decision:el.dataset.decision,reason:reasonInput?reasonInput.value:"",role:data.role||"FDE",at:new Date().toISOString()});saveMvp(data);snapshot("승인 결정");}
      var action=el.dataset.advanced;if(!action)return;var data=mvp(),record;
      if(action==="edit-project"){record=data.projects.find(function(x){return x.id===el.dataset.id;});var name=prompt("프로젝트명",record.name);if(name){snapshot("프로젝트 수정 전");record.name=name;record.customer=prompt("고객사",record.customer)||record.customer;record.goal=prompt("목표",record.goal)||record.goal;saveMvp(data);addAudit("ProjectUpdated",record.id,record.name);location.reload();}}
      if(action==="clone-project"){record=data.projects.find(function(x){return x.id===el.dataset.id;});snapshot("프로젝트 복제 전");data.projects.push(Object.assign({},record,{id:id("project"),name:record.name+" 복제본",createdAt:new Date().toISOString()}));saveMvp(data);addAudit("ProjectCloned",record.id,record.name);location.reload();}
      if(action==="delete-project"&&confirm("프로젝트를 삭제할까요? 관련 고급 기록은 백업에 남습니다.")){snapshot("프로젝트 삭제 전");data.projects=data.projects.filter(function(x){return x.id!==el.dataset.id;});if(data.currentProjectId===el.dataset.id)data.currentProjectId="firenavi";saveMvp(data);addAudit("ProjectDeleted",el.dataset.id,"");location.reload();}
      if(action==="add-custom-question"){var text=prompt("추가할 인터뷰 질문을 입력하세요.");if(text){data.customQuestions=data.customQuestions||[];data.customQuestions.push({id:id("question"),projectId:currentProject(),text:text,at:new Date().toISOString()});saveMvp(data);addAudit("QuestionCreated","사용자 질문",text);location.reload();}}
      if(action==="delete-interview"&&confirm("인터뷰 기록을 삭제할까요?")){snapshot("인터뷰 삭제 전");data.interviews=data.interviews.filter(function(x){return x.id!==el.dataset.id;});saveMvp(data);addAudit("InterviewDeleted",el.dataset.id,"");location.reload();}
      if(action==="delete-node"&&confirm("온톨로지 요소를 삭제할까요?")){snapshot("요소 삭제 전");data.ontology=data.ontology.filter(function(x){return x.id!==el.dataset.id;});saveMvp(data);addAudit("OntologyElementDeleted",el.dataset.id,"");location.reload();}
      if(action==="edit-node"){record=data.ontology.find(function(x){return x.id===el.dataset.id;});var nodeName=prompt("요소 이름",record.name);if(nodeName){snapshot("요소 수정 전");record.name=nodeName;record.definition=prompt("정의",record.definition)||record.definition;saveMvp(data);addAudit("OntologyElementUpdated",record.id,record.name);location.reload();}}
      if(action==="delete-relation"&&confirm("관계를 삭제할까요?")){snapshot("관계 삭제 전");data.relations=data.relations.filter(function(x){return x.id!==el.dataset.id;});saveMvp(data);addAudit("OntologyRelationDeleted",el.dataset.id,"");location.reload();}
      if(action==="edit-relation"){record=data.relations.find(function(x){return x.id===el.dataset.id;});var relation=prompt("관계명",record.relation);if(relation){snapshot("관계 수정 전");record.relation=relation;saveMvp(data);addAudit("OntologyRelationUpdated",record.id,relation);location.reload();}}
      if(action==="reopen-approval"){var b=base(),keys=Object.keys(b.approvals||{});var key=keys[Number(el.dataset.index)];if(key){snapshot("승인 재검토 전");delete b.approvals[key];localStorage.setItem(BASE_KEY,JSON.stringify(b));data.approvalHistory.unshift({id:id("decision"),projectId:currentProject(),target:key,decision:"reopened",reason:"재검토 요청",role:data.role||"FDE",at:new Date().toISOString()});saveMvp(data);location.reload();}}
      if(action==="export-csv")exportCsv();if(action==="print-report"){addAudit("ReportPrinted","PDF·인쇄",currentProject());window.print();}
    },true);
    setInterval(function(){snapshot("60초 자동 백업");},60000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();
})();
