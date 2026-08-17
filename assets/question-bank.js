(function(){
  var KEY='k-fde-question-bank-v1';
  var targets=[
    '참여자','문제','객체','데이터','관계','규칙','행동','가치',
    '온톨로지 객체','온톨로지 속성','온톨로지 관계','온톨로지 상태','온톨로지 이벤트','온톨로지 규칙','온톨로지 행동',
    '권한','워크플로','출처','액션','KPI','확장성','승인·통제','학습 루프'
  ];
  var lenses=[
    ['현재 상태','현재 '+ '{target}' +'은(는) 실제 업무에서 어떻게 정의되고 운영되고 있나요?','현행 기준과 담당자를 확인합니다.'],
    ['핵심 문제',''+ '{target}' +'과(와) 관련해 가장 큰 지연·오류·반복 문제는 무엇인가요?','문제의 우선순위와 영향을 확인합니다.'],
    ['원인·조건','그 문제가 발생하거나 '+ '{target}' +'이(가) 바뀌는 조건은 무엇인가요?','원인, 조건, 예외를 분리합니다.'],
    ['이해관계자',''+ '{target}' +'에 영향을 주거나 결정을 내리는 사람·조직은 누구인가요?','책임과 의사결정 구조를 확인합니다.'],
    ['근거·출처',''+ '{target}' +'을(를) 입증할 수 있는 문서·데이터·기록은 어디에 있나요?','검증 가능한 증거와 출처를 연결합니다.'],
    ['예외·통제','정상 흐름과 다르게 처리되는 예외, 승인, 금지 규칙은 무엇인가요?','통제 규칙과 위험 조건을 확인합니다.'],
    ['개선·결과',''+ '{target}을(를) 개선하거나 자동화한다면 어떤 결과와 KPI를 기대하나요?','실행 목표와 측정 기준을 정의합니다.']
  ];
  var expected=['현행 정의·담당자·운영 기준이 정리됩니다.','핵심 문제와 영향 범위의 우선순위가 확인됩니다.','발생 조건·원인·예외가 구분됩니다.','이해관계자와 의사결정 책임이 연결됩니다.','검증 가능한 자료와 출처가 확보됩니다.','승인·통제·위험 조건이 명확해집니다.','개선 목표와 측정 가능한 KPI가 정의됩니다.'];
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){return[];}}
  function projectId(){try{var base=JSON.parse(localStorage.getItem('k-fde-standalone-v1')||'{}');return base.projectId||'default';}catch(e){return'default';}}
  function loadAnswers(){try{var all=JSON.parse(localStorage.getItem('k-fde-interview-answers-v1')||'{}');return all[projectId()]||{};}catch(e){return{};}}
  function save(value){localStorage.setItem(KEY,JSON.stringify(value));}
  function saveAnswer(id,value){
    var all={};try{all=JSON.parse(localStorage.getItem('k-fde-interview-answers-v1')||'{}');}catch(e){}
    all[projectId()]=all[projectId()]||{};all[projectId()][id]=value;localStorage.setItem('k-fde-interview-answers-v1',JSON.stringify(all));
    var base={};try{base=JSON.parse(localStorage.getItem('k-fde-standalone-v1')||'{}');}catch(e){}
    base.interviewAnswers=base.interviewAnswers||{};base.interviewAnswers[id]=value;base.interviewAnswersUpdatedAt=new Date().toISOString();localStorage.setItem('k-fde-standalone-v1',JSON.stringify(base));
  }
  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function render(){
    var page=document.querySelector('.qm-page'); if(!page||document.querySelector('.qbank'))return;
    var selected=load(), html='<section class="qbank"><header class="qbank-head"><div><span class="qm-eyebrow">23 TARGETS × 7 PROBES</span><h3>확장 질문 뱅크</h3><p>23개 탐색 대상마다 7개 관점의 질문을 제공합니다. 상황에 맞는 질문만 선택해 인터뷰 실행계획에 사용하세요.</p></div><div class="qbank-count"><b data-qbank-count>'+selected.length+'</b><span>개 선택</span></div></header><div class="qbank-grid">';
    targets.forEach(function(target,t){
      html+='<details class="qbank-target"'+(t<3?' open':'')+'><summary><span class="qbank-no">'+String(t+1).padStart(2,'0')+'</span><strong>'+esc(target)+'</strong><small>7개 질문</small></summary><div class="qbank-items">';
      lenses.forEach(function(lens,i){var id='target-'+t+'-probe-'+i, text=lens[1].replace(/\{target\}/g,target), on=selected.indexOf(id)>-1, answer=loadAnswers()[id]||'';html+='<article class="qbank-item'+(on?' selected':'')+'"><span class="qbank-lens">'+esc(lens[0])+'</span><p>'+esc(text)+'</p><small>질문 목적 · '+esc(lens[2])+'<strong>기대 결과 · '+esc(expected[i])+'</strong></small><button type="button" data-qbank-toggle="'+id+'">'+(on?'선택 해제':'질문 선택')+'</button>'+(on?'<label class="qbank-answer"><span>고객사 답변·제공 정보 &amp; 분석되거나 확인된 정보</span><textarea data-qbank-answer="'+id+'" placeholder="인터뷰 답변, 문서 요약, 수치, 증거 링크를 입력하세요.">'+esc(answer)+'</textarea><span class="qbank-answer-actions"><button type="button" data-qbank-save="'+id+'">답변 저장</button><em data-qbank-status="'+id+'">자동 저장 · 다음 단계에서 재사용</em></span></label>':'')+'</article>';});
      html+='</div></details>';
    });
    html+='</div><footer class="qbank-foot"><span>선택한 질문과 답변은 프로젝트별로 저장되어 고객 온보딩·초기자료 정규화·2A4·온톨로지·AX 설계 단계에서 재사용됩니다.</span><button type="button" data-qbank-clear>전체 선택 해제</button></footer></section>';
    var guide='<section class="qbank-guide"><header><span class="qm-eyebrow">QUESTION SYSTEM GUIDE</span><h3>기본 질문과 확장 질문의 사용 기준</h3><p>기본 질문으로 공통 사실을 먼저 확인하고, 답변이 부족한 대상만 확장 질문으로 깊이 탐색합니다.</p></header><div class="qbank-guide-grid"><article><h4>기본 질문 라이브러리 (총 29개 질문)</h4><ul><li>FDE가 반드시 확인해야 하는 핵심 질문</li><li>질문 의도·기대 결과·증거·대상·Phase가 정의됨</li><li>인터뷰 기본 흐름과 런시트에 바로 사용</li><li>문제 발견과 설계 입력 확보에 초점</li></ul><span class="qbank-guide-tag core">필수 · 먼저 실행</span></article><article><h4>확장 질문 뱅크</h4><ul><li>23개 대상별 추가 탐색용 보조 질문</li><li>현재 상태·문제·원인·이해관계자·근거·예외·개선의 7개 관점</li><li>고객 상황에 따라 선택적으로 사용</li><li>답변이 부족하거나 추가 검증이 필요할 때 사용</li></ul><span class="qbank-guide-tag optional">선택 · 필요할 때 추가</span></article></div></section>';
    page.insertAdjacentHTML('beforeend',guide+html);syncRunSheet();
  }
  function syncRunSheet(){
    var plan=document.querySelector('.qm-plan');if(!plan)return;
    plan.querySelectorAll('.qm-plan-list li:not([data-qbank-plan]):not(.qm-plan-empty)').forEach(function(li){var strong=li.querySelector('strong');if(!strong)return;var text=strong.textContent.trim(),match=Array.prototype.find.call(document.querySelectorAll('.qm-question h4'),function(h){return h.textContent.trim()===text;});if(!match)return;var details=match.closest('.qm-question').querySelectorAll('.qm-details>div'),intent=details[0]?details[0].querySelector('p'):null,result=details[1]?details[1].querySelector('p'):null,small=li.querySelector('small');if(small&&intent&&result){small.textContent='질문 목적 · '+intent.textContent.trim()+' · 기대 결과 · '+result.textContent.trim();}});
    var picked=load(),answers=loadAnswers(),baseCount=plan.querySelectorAll('.qm-plan-list li:not([data-qbank-plan]):not(.qm-plan-empty)').length;
    var count=plan.querySelector('.qm-count');if(count)count.textContent=(baseCount+picked.length)+'문항';
    var list=plan.querySelector('.qm-plan-list');if(!list)return;
    list.querySelectorAll('[data-qbank-plan]').forEach(function(el){el.remove();});
    picked.forEach(function(id){var m=id.match(/^target-(\d+)-probe-(\d+)$/);if(!m)return;var target=targets[Number(m[1])],lens=lenses[Number(m[2])],question=lens[1].replace(/\{target\}/g,target),li=document.createElement('li');li.dataset.qbankPlan='true';li.innerHTML='<span>QB</span><div><strong>'+esc(question)+'</strong><small>'+esc(target+' · '+lens[0])+' · 질문 목적 · '+esc(lens[2])+' · 기대 결과 · '+esc(expected[Number(m[2])])+(answers[id]?' · 답변 입력됨':' · 답변 대기')+'</small></div><button class="qm-remove" type="button" data-qbank-plan-remove="'+id+'" aria-label="질문 제거">×</button>';list.appendChild(li);});
    try{var base=JSON.parse(localStorage.getItem('k-fde-standalone-v1')||'{}');base.plannedQuestionBank=picked;base.plannedQuestionBankUpdatedAt=new Date().toISOString();localStorage.setItem('k-fde-standalone-v1',JSON.stringify(base));}catch(e){}
  }
  function update(){var picked=load(),answers=loadAnswers();document.querySelectorAll('[data-qbank-count]').forEach(function(el){el.textContent=picked.length;});document.querySelectorAll('[data-qbank-toggle]').forEach(function(btn){var id=btn.dataset.qbankToggle,on=picked.indexOf(id)>-1,card=btn.closest('.qbank-item');btn.textContent=on?'선택 해제':'질문 선택';card.classList.toggle('selected',on);var field=card.querySelector('.qbank-answer');if(on&&!field){card.insertAdjacentHTML('beforeend','<label class="qbank-answer"><span>고객사 답변·제공 정보</span><textarea data-qbank-answer="'+id+'" placeholder="인터뷰 답변, 문서 요약, 수치, 증거 링크를 입력하세요.">'+esc(answers[id]||'')+'</textarea><span class="qbank-answer-actions"><button type="button" data-qbank-save="'+id+'">답변 저장</button><em data-qbank-status="'+id+'">자동 저장 · 다음 단계에서 재사용</em></span></label>');}else if(!on&&field){field.remove();}});syncRunSheet();}
  document.addEventListener('input',function(e){var field=e.target.closest('[data-qbank-answer]');if(field){saveAnswer(field.dataset.qbankAnswer,field.value);syncRunSheet();}});
  document.addEventListener('click',function(e){var remove=e.target.closest('[data-qbank-plan-remove]');if(remove){var list=load(),ri=list.indexOf(remove.dataset.qbankPlanRemove);if(ri>-1)list.splice(ri,1);save(list);update();return;}var saveBtn=e.target.closest('[data-qbank-save]');if(saveBtn){var id=saveBtn.dataset.qbankSave,field=document.querySelector('[data-qbank-answer="'+id+'"]'),status=document.querySelector('[data-qbank-status="'+id+'"]');if(field){saveAnswer(id,field.value);if(status){status.textContent='저장 완료 · '+new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});status.classList.add('saved');}saveBtn.textContent='저장 완료';setTimeout(function(){saveBtn.textContent='답변 저장';},1600);syncRunSheet();}return;}var btn=e.target.closest('[data-qbank-toggle]');if(btn){var list=load(),id=btn.dataset.qbankToggle,i=list.indexOf(id);if(i>-1)list.splice(i,1);else list.push(id);save(list);update();return;}if(e.target.closest('[data-qbank-clear]')){save([]);update();}});
  function liveKey(){return'k-fde-live-interview-v1';}
  function liveLoad(){try{var all=JSON.parse(localStorage.getItem(liveKey())||'{}');return all[projectId()]||{};}catch(e){return{};}}
  function liveSave(index,value){var all={};try{all=JSON.parse(localStorage.getItem(liveKey())||'{}');}catch(e){}all[projectId()]=all[projectId()]||{};all[projectId()][index]=value;localStorage.setItem(liveKey(),JSON.stringify(all));}
  var interview={items:[],index:0,answers:{}};
  function renderInterviewStep(){var modal=document.querySelector('.fde-interview-modal');if(!modal||!interview.items.length)return;var item=interview.items[interview.index],answer=interview.answers[interview.index]||'';modal.querySelector('[data-live-progress]').textContent=(interview.index+1)+' / '+interview.items.length;modal.querySelector('[data-live-question]').textContent=item.question;modal.querySelector('[data-live-context]').textContent=item.context;modal.querySelector('[data-live-answer]').value=answer;modal.querySelector('[data-live-prev]').disabled=interview.index===0;modal.querySelector('[data-live-next]').textContent=interview.index===interview.items.length-1?'인터뷰 종료':'다음 질문';}
  function openInterviewMode(){var list=document.querySelectorAll('.qm-plan-list li:not(.qm-plan-empty)');if(list.length){interview.items=Array.prototype.map.call(list,function(li){return{question:(li.querySelector('strong')||li).textContent.trim(),context:(li.querySelector('small')||{textContent:''}).textContent.trim()};});}else{var cards=document.querySelectorAll('.qbank-item.selected');interview.items=Array.prototype.map.call(cards,function(card){return{question:(card.querySelector('p')||card).textContent.trim(),context:(card.querySelector('small')||{textContent:''}).textContent.trim()};});}if(!interview.items.length)return;interview.answers=liveLoad();interview.index=0;var old=document.querySelector('.fde-interview-modal');if(old)old.remove();document.body.insertAdjacentHTML('beforeend','<div class="fde-interview-modal"><div class="fde-interview-dialog"><header><div><span>LIVE INTERVIEW MODE</span><h2>인터뷰 진행</h2></div><b data-live-progress></b><button type="button" data-live-close aria-label="닫기">×</button></header><main><small data-live-context></small><h3 data-live-question></h3><label>고객사 답변·제공 정보 &amp; 분석되거나 확인된 정보<textarea data-live-answer placeholder="답변, 수치, 근거, 후속 확인사항을 입력하세요."></textarea></label></main><footer><button type="button" data-live-prev>이전 질문</button><button type="button" class="primary" data-live-next>다음 질문</button></footer></div></div>');renderInterviewStep();}
  function closeInterviewMode(){var modal=document.querySelector('.fde-interview-modal');if(modal)modal.remove();}
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-qm-action="start"]')){setTimeout(openInterviewMode,60);return;}
    if(e.target.closest('[data-live-close]')){closeInterviewMode();return;}
    var prev=e.target.closest('[data-live-prev]'),next=e.target.closest('[data-live-next]');
    if(prev||next){var field=document.querySelector('[data-live-answer]');if(field){interview.answers[interview.index]=field.value;liveSave(interview.index,field.value);}if(prev){interview.index=Math.max(0,interview.index-1);renderInterviewStep();}else if(interview.index<interview.items.length-1){interview.index+=1;renderInterviewStep();}else{closeInterviewMode();}}
  });
  document.addEventListener('input',function(e){var field=e.target.closest('[data-live-answer]');if(field){interview.answers[interview.index]=field.value;liveSave(interview.index,field.value);}});
  function normalizeAnswerLabels(){var label='고객사 답변·제공 정보 & 분석되거나 확인된 정보';document.querySelectorAll('.qbank-answer>span:first-child').forEach(function(el){if(el.textContent!==label)el.textContent=label;});}
  function normalizeLibraryTitle(){var title=document.querySelector('.qm-library .qm-head h3');if(title)title.textContent='기본 질문 라이브러리 (총 29개 질문)';}
  function normalizeBankTitle(){var title=document.querySelector('.qbank-head h3');if(title)title.textContent='확장 질문 뱅크 (총 141개 질문)';}
  function normalizeQuestionPurposes(){document.querySelectorAll('.qbank-item>small').forEach(function(el){if(el.textContent.indexOf('질문 목적 ·')!==0)el.textContent='질문 목적 · '+el.textContent;});}
  function normalizeInterviewModes(){var select=document.querySelector('.qm-form select[data-qm-plan="mode"]');if(!select)return;var current=select.value,options=['현장대면','온라인인터뷰','서면질의'];select.innerHTML=options.map(function(value){return'<option value="'+value+'">'+value+'</option>';}).join('');if(options.indexOf(current)>-1)select.value=current;}
  document.addEventListener('click',function(e){if(e.target.closest('[data-qbank-toggle]'))setTimeout(normalizeAnswerLabels,0);});
  function ensure(){if(!document.querySelector('.qbank')){render();}normalizeAnswerLabels();normalizeLibraryTitle();normalizeBankTitle();normalizeInterviewModes();normalizeQuestionPurposes();}
  document.addEventListener('DOMContentLoaded',function(){setTimeout(ensure,80);setTimeout(ensure,400);});
  window.addEventListener('load',function(){setTimeout(ensure,80);});
})();
