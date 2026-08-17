(function(){
  function mount(){var main=document.querySelector('.twoa4-studio-page')||document.querySelector('.workspace main');if(!main||main.querySelector('.twoa4-visuals'))return false;var box=document.createElement('section');box.className='twoa4-visuals';box.innerHTML='<h2>2A4 문제해결 Cube 안내</h2><p>문제 발견부터 해결·실행·리뷰까지 2A4의 전체 흐름을 시각적으로 확인합니다.</p><div class="twoa4-visual-grid"><figure><img src="assets/2a4-cube-problem.png" alt="2A4 Cube 문제 발견 단계"><figcaption>Problem · 문제 발견과 원인 분석</figcaption></figure><figure><img src="assets/2a4-cube-solving.png" alt="2A4 Cube 해결 단계"><figcaption>Solving · 해결·실행·리뷰</figcaption></figure></div>';main.insertBefore(box,main.firstChild);return true;}
  function retry(){var n=0,t=setInterval(function(){if(mount()||n++>30)clearInterval(t);},100);}
  document.addEventListener('DOMContentLoaded',retry);document.addEventListener('twoa4:rendered',retry);
})();
