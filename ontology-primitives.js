(function(){
  var seven=['객체','속성','관계','상태','이벤트','규칙','행동'];
  var eight=['워크플로','온톨로지','객체','권한','출처','액션','KPI 모델','확장'];
  function mount(){var main=document.querySelector('main.page');if(!main||main.querySelector('.ontology-primitives-bridge'))return;var s=document.createElement('section');s.className='ontology-primitives-bridge';s.innerHTML='<header><div><span>ONTOLOGY × PRIMITIVES</span><h2>온톨로지 7요소와 원시요소 8개 연결</h2><p>온톨로지 7요소는 현장의 실행지식을 구조화하고, 원시요소 8개는 이를 플랫폼에서 재사용 가능한 설계 자산으로 전환합니다.</p></div></header><div class="bridge-columns"><section><h3>온톨로지 7요소</h3><ol>'+seven.map(function(x,i){return'<li><b>0'+(i+1)+'</b><span>'+x+'</span><small>AI가 이해하고 실행할 지식 단위</small></li>';}).join('')+'</ol></section><section><h3>원시요소 8개</h3><ol>'+eight.map(function(x,i){return'<li><b>0'+(i+1)+'</b><span>'+x+'</span><small>프로젝트에 재사용하는 운영 자산</small></li>';}).join('')+'</ol></section></div>';main.appendChild(s);}
  document.addEventListener('DOMContentLoaded',function(){var n=0,t=setInterval(function(){mount();if(document.querySelector('.ontology-primitives-bridge')||n++>25)clearInterval(t);},200);});
})();
