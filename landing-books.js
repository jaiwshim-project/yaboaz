(function(){
  function mount(){
    var root=document.querySelector('.landing');
    if(!root||root.querySelector('.book-library'))return;
    var books=[
      ['assets/book-01.jpg','YABOAZ와 AX의 중심','현장 문제를 구조화하고 실행 가능한 지식으로 전환합니다.'],
      ['assets/book-02.jpg','현장형 FDE 전략','FDE가 현장의 신호를 실행 구조로 연결하는 방법을 담았습니다.'],
      ['assets/book-03.jpg','FDE 현장 매뉴얼','문제 정의부터 온톨로지·AI 에이전트·워크플로까지 적용합니다.'],
      ['assets/book-04.png','AI와 미래의 일','AI가 바꾸는 직업·산업·사회의 실행 조건을 탐구합니다.'],
      ['assets/book-05.jpg','바이브코딩 창작','바이브코딩으로 아이디어를 빠르게 플랫폼으로 구현합니다.'],
      ['assets/book-06.jpg','2A4 문제해결','명확한 목표와 질문으로 복잡한 문제를 해결합니다.'],
      ['assets/book-07.jpg','리더십 커뮤니케이션','창조적 경영과 소통을 위한 리더의 실행 원칙입니다.'],
      ['assets/book-08.jpg','1% 탁월한 기업','작은 개선을 쌓아 조직의 운영 성과를 만드는 방법입니다.'],
      ['assets/book-09.jpg','YOU&I 커뮤니케이션','관계와 갈등을 건설적인 대화로 전환합니다.'],
      ['assets/book-10.jpg','GE 핵심인재 육성','핵심인재와 리더를 성장시키는 실전 프레임워크입니다.']
    ];
    var s=document.createElement('section');
    s.className='book-library';
    s.innerHTML='<header><div><span>YABOAZ KNOWLEDGE ARCHIVE</span><h2>YABOAZ를 만든 저자의 핵심 저서 10권</h2></div><p>현장 실행·2A4 문제해결·FDE·온톨로지·AI·바이브코딩·창업·리더십과 소통까지, YABOAZ를 구성하는 핵심 주제를 실제 책과 함께 확인합니다.</p></header><div class="book-grid">'+books.map(function(b,i){return'<article class="book-card"><div class="book-cover"><img src="'+b[0]+'" alt="'+b[1]+' 책 표지"><small>YABOAZ · VOL. '+String(i+1).padStart(2,'0')+'</small></div><h3>'+b[1]+'</h3><p>'+b[2]+'</p></article>';}).join('')+'</div></section>';
    var cta=root.querySelector('.landing-cta');
    var footer=root.querySelector('.premium-footer');
    if(cta)root.insertBefore(s,cta);
    else if(footer)root.insertBefore(s,footer);
    else root.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();



