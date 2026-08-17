(function(){
  function mount(){
    var root=document.querySelector('.landing');
    if(!root||root.querySelector('.platform-archive'))return;
    var s=document.createElement('section');
    s.className='platform-archive';
    s.innerHTML='<div class="platform-archive-copy"><span>VIBE CODING PLATFORM ARCHIVE</span><h2><em>심재우 대표</em>, <em>7개월</em>, <em>바이브코딩</em>으로 직접 개발한 <em>105개</em> 플랫폼</h2><p><em>심재우 대표</em>가 <em>7개월</em> 동안 <em>바이브코딩</em>으로 직접 개발한 <em>105개</em> 플랫폼 사례를 한눈에 확인합니다. 교육·비즈니스·AI·콘텐츠·생산성 등 다양한 현장 문제를 플랫폼으로 전환한 결과입니다.</p><div class="platform-stats"><b>105<small>플랫폼</small></b><b>36<small>저작권 리스트</small></b><b>8<small>AX 그룹</small></b><b>1<small>운영체계</small></b></div></div><figure><img src="assets/platform-105.jpg" alt="심재우 대표가 7개월 동안 바이브코딩으로 직접 개발한 플랫폼 105개 목록"><figcaption>YABOAZ Vibe Coding Portfolio · 105 Platforms</figcaption></figure>';
    var books=root.querySelector('.book-library');
    if(books)books.insertAdjacentElement('afterend',s);else root.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
