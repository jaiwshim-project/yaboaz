(function(){
  function mount(){
    var root=document.querySelector('.landing');
    if(!root||root.querySelector('.book-library'))return;
    var books=[
      ['assets/book-01.jpg','팔란티어는 왜 AX의 중심이 되었는가','팔란티어의 탄생과 성장, 플랫폼 전략, AI 지정을 살펴봅니다.'],
      ['assets/book-02.jpg','팔란티어 FDE와 온톨로지','현장 지식을 온톨로지와 AI 실행 구조로 연결하는 전략을 소개합니다.'],
      ['assets/book-03.jpg','팔란티어 FDE 현장 매뉴얼','관찰·문제정의·온톨로지·AI 에이전트·워크플로를 현장에 적용합니다.'],
      ['assets/book-04.png','AI 시대의 미래 예언서','AI가 바꾸는 직업·산업·사회의 변화와 인간의 실행 조건을 탐구합니다.'],
      ['assets/book-05.jpg','말로 만드는 창업의 시대','바이브 코딩으로 아이디어를 빠르게 플랫폼으로 구현하는 방법을 소개합니다.'],
      ['assets/book-06.jpg','심플 퀘스천','해결할 목표를 아는 조직을 만드는 2A4 문제해결과 질문의 힘을 다룹니다.'],
      ['assets/book-07.jpg','타운미팅 커뮤니케이션','창조 경영과 소통을 위한 리더십·퍼실리테이션 스킬을 제시합니다.'],
      ['assets/book-08.jpg','1% 위대한 기업은 어떻게 일하는가','집단 창의성과 협업을 키우는 조직 운영 원리를 소개합니다.'],
      ['assets/book-09.jpg','YOU&I 화법으로 시작하라','설득·협상·갈등 관계에서 밀리지 않는 대화와 커뮤니케이션 기술을 다룹니다.'],
      ['assets/book-10.jpg','GE의 핵심인재는 어떻게 단련되는가','글로벌 기업 GE의 인재 육성과 리더십, 핵심인재 개발 원리를 소개합니다.']
    ];
    var s=document.createElement('section');
    s.className='book-library';
    s.innerHTML='<header><div><span>YABOAZ KNOWLEDGE ARCHIVE</span><h2>YABOAZ를 만든 심재우 대표가 출간한 10권의 책</h2></div><p>현장 실행·2A4 문제해결·온톨로지·AI·미래·바이브 코딩·창업·리더십·조직 협업·설득·소통까지, YABOAZ를 구성하는 핵심 주제를 실제 책과 함께 확인합니다.</p></header><div class="book-grid">'+books.map(function(b,i){return'<article class="book-card"><div class="book-cover"><img src="'+b[0]+'" alt="'+b[1]+' 책표지"><small>YABOAZ · VOL. '+String(i+1).padStart(2,'0')+'</small></div><h3>'+b[1]+'</h3><p>'+b[2]+'</p></article>';}).join('')+'</div></section>';
    var cta=root.querySelector('.landing-cta');
    if(cta)root.insertBefore(s,cta);else root.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
