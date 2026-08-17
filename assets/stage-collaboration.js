(function(){
'use strict';
var KEY='k-fde-stage-collaboration-v1';
var stages=[
['고객 온보딩','고객·현장·목표·담당자의 실행 경계를 확정합니다.','initial-materials.html'],
['초기자료 정규화','고객이 제공한 자료의 출처·품질·사실·가설을 정리합니다.','2a4-studio.html'],
['2A4 문제해결','문제·영향·원인·목표·실행을 검증 가능한 문장으로 압축합니다.','discovery-analysis.html'],
['이해관계자·현장 탐색','현장 흐름·이해관계자 행동·예외·증거를 확인하고 다음 맞춤 인터뷰로 연결합니다.','questions.html'],
['맞춤 인터뷰','온톨로지 7요소를 발견하는 질문을 선택하고 고객 답변을 기록합니다.','ontology.html'],
['온톨로지 7요소','객체·속성·관계·상태·이벤트·행동·규칙을 의미 구조로 연결합니다.','ai-scenarios.html'],
['AI 판단 시나리오','신호·증거·판단·추천 행동·승인 조건을 정의합니다.','agent-design.html'],
['AI Agent 설계','Agent의 책임·입출력·도구·권한·실패 대응을 명세화합니다.','workflow-design.html'],
['워크플로 설계','진입·상태·자동화·승인·예외·복구 흐름을 설계합니다.','vibecoding.html'],
['화면·데이터 모델','사용자 행동과 화면·데이터·API·권한을 하나로 연결합니다.','mvp-development.html'],
['MVP 개발','가장 작은 실행 단위를 구현하고 대표 사용자 흐름을 검증합니다.','bootcamp-validation.html'],
['Bootcamp 검증','실제 사용자·시나리오·결과·결함을 확인하고 Go/No-Go를 판정합니다.','primitives.html'],
['플랫폼 자산화','검증된 질문·온톨로지·워크플로·KPI를 재사용 부품으로 패키징합니다.','workflow.html']
];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch(e){return{};}}
function save(data){localStorage.setItem(KEY,JSON.stringify(data));}
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function current(){var file=(location.pathname.split('\\').pop()||location.pathname.split('/').pop()||'').toLowerCase();var i=stages.findIndex(function(x){return x[2].split('#')[0]===file;});if(file==='customer-onboarding.html')i=0;if(file==='initial-materials.html')i=1;if(file==='2a4-studio.html')i=2;if(file==='discovery-analysis.html')i=3;if(file==='questions.html')i=4;if(file==='ontology.html')i=5;if(file==='ai-scenarios.html')i=6;if(file==='agent-design.html')i=7;if(file==='workflow-design.html')i=8;if(file==='vibecoding.html'||file==='screen-data-model.html')i=9;if(file==='mvp-development.html')i=10;if(file==='bootcamp-validation.html')i=11;if(file==='primitives.html')i=12;return i;}
function aiDraft(i,data){var prior=stages.slice(0,i).map(function(x,n){var v=data[n]&&data[n].manual;return v?x[0]+': '+v:'';}).filter(Boolean);var base=i===0?'프로젝트의 고객·현장·목표·담당자를 먼저 확정하고, 한 현장과 한 핵심 문제로 범위를 제한하세요.': '이전 단계에서 기록된 '+prior.length+'개 자료를 기준으로 '+stages[i][0]+'의 핵심 입력을 정리했습니다. '+stages[i][1];var evidence=prior.length?'이전 자료 요약: '+prior.slice(-3).join(' / '):'이전 단계의 저장 자료가 없어 현재 단계의 기본 기준으로 초안을 생성했습니다.';return base+'\n\n'+evidence+'\n\n확인할 공백: 출처·책임자·예외 조건을 FDE가 현장에서 검증하세요.';}
function mount(){var i=current();if(i<0)return;var main=document.querySelector('.workspace main');if(!main||main.querySelector('.stage-collaboration'))return;var data=load(),entry=data[i]||{},panel=document.createElement('section');panel.className='stage-collaboration white panel';panel.innerHTML='<header class="collab-head"><div><small>AI × FDE STAGE COLLABORATION</small><h3>'+String(i+1).padStart(2,'0')+' · '+stages[i][0]+' 협업 작업공간</h3><p>'+stages[i][1]+'</p></div><span class="collab-badge">이전 단계 누적 분석</span></header><div class="collab-grid"><article class="ai-draft"><div class="collab-label"><span>AI 참고 초안</span><button type="button" data-ai-refresh>다시 분석</button></div><p data-ai-draft>'+esc(entry.ai||aiDraft(i,data)).replace(/\n/g,'<br>')+'</p><small>이 브라우저에 저장된 이전 단계 자료를 기준으로 생성된 참고용 초안입니다. FDE 검토 후 사용하세요.</small></article><article class="fde-input"><div class="collab-label"><span>FDE 수동 보완</span><b data-collab-status>'+ (entry.manual?'저장된 입력':'입력 필요')+'</b></div><textarea data-fde-input placeholder="현장에서 확인한 사실, 고객 답변, 추가 증거, 수정 의견과 다음 행동을 입력하세요.">'+esc(entry.manual||'')+'</textarea><button class="primary" type="button" data-collab-save>이 단계 자료 저장 → 다음 단계로 전달</button></article></div><footer class="collab-footer"><span>누적 단계 '+(i+1)+' / 13 · 이전 입력 '+Object.keys(data).filter(function(k){return Number(k)<i&&data[k]&&data[k].manual;}).length+'건</span><a href="'+stages[i][2]+'">다음 단계: '+(i<12?stages[i+1][0]:'전체 워크플로')+' →</a></footer></section>';main.appendChild(panel);panel.querySelector('[data-collab-save]').addEventListener('click',function(){var value=panel.querySelector('[data-fde-input]').value.trim();data[i]={manual:value,ai:panel.querySelector('[data-ai-draft]').innerText,updatedAt:new Date().toISOString()};save(data);panel.querySelector('[data-collab-status]').textContent='저장 완료';panel.querySelector('[data-collab-save]').textContent=i<12?'저장 완료 · 다음 단계로 전달됨':'저장 완료 · 플랫폼 자산화 기록됨';panel.querySelector('.collab-footer span').textContent='누적 단계 '+(i+1)+' / 13 · 방금 저장됨';});panel.querySelector('[data-ai-refresh]').addEventListener('click',function(){var latest=load();panel.querySelector('[data-ai-draft]').innerHTML=esc(aiDraft(i,latest)).replace(/\n/g,'<br>');});}
document.addEventListener('twoa4:rendered',function(){setTimeout(mount,40);});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,60);});else mount();
})();


