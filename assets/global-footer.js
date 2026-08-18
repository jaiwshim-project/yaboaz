(function(){
  'use strict';
  function mount(){
    if(document.querySelector('.landing')||document.querySelector('.premium-footer'))return;
    var root=document.querySelector('.workspace')||document.body;if(!root)return;
    var css=document.createElement('link');css.rel='stylesheet';css.href='assets/footer.css?v=2';document.head.appendChild(css);
    var f=document.createElement('footer');f.className='premium-footer';
    f.innerHTML='<div class="footer-main"><section class="footer-identity"><div class="footer-lockup"><span><img src="assets/kfde-symbol.jpg" alt="K-FDE 심볼"></span><div><strong>YABOAZ K-FDE Platform</strong><small>FDE FIELD OPERATING SYSTEM</small></div></div><p>현장의 신호를 증거와 온톨로지로 구조화하고,<br>사람의 승인을 거쳐 실행으로 성과를 만듭니다.</p><div class="footer-principles"><span>증거 기반</span><span>사람의 승인</span><span>지속 학습</span></div></section><nav class="footer-nav"><div><b>OPERATE</b><span class="footer-link-disabled">홈페이지</span><span class="footer-link-disabled">프로젝트</span><span class="footer-link-disabled">현장 기록</span></div><div><b>INTELLIGENCE</b><span class="footer-link-disabled">질문 플레이북</span><span class="footer-link-disabled">온톨로지</span><span class="footer-link-disabled">승인 센터</span></div><div><b>ADMIN</b><a class="footer-admin-link" data-auth-gate href="admin-members.html">관리자 대시보드</a></div><div><b>OUTCOME</b><span class="footer-link-disabled">성과 · KPI</span><span class="footer-link-disabled">원시 데이터</span><span class="footer-link-disabled">사용자 매뉴얼</span><span class="footer-link-disabled">적용 사례</span><span class="footer-link-disabled">아키텍처</span></div></nav><aside class="footer-status"><small>LOCAL OPERATING STATUS</small><div><i></i><span><strong>정상 운영 중</strong><small>YABOAZ K-FDE Platform</small></span></div></aside></div><div class="footer-legal"><strong>권리 보호 안내</strong> · 본 플랫폼의 방법론과 콘텐츠는 저작권 등록 및 법적 보호 절차에 따라 보호받고 있습니다.</div><div class="footer-bottom"><span>© 2026 YABOAZ K-FDE Platform. All rights reserved.</span><div><span>HUMAN IN THE LOOP</span><i></i><span>EVIDENCE DRIVEN</span></div></div>';
    root.appendChild(f);
    function hasSession(){try{var s=JSON.parse(sessionStorage.getItem('kfde-auth-session')||'null');return !!(s&&s.access_token&&s.user);}catch(e){return false;}}
    document.addEventListener('click',function(e){var link=e.target.closest('.premium-footer a');if(!link||link.getAttribute('href')==='admin-members.html'||hasSession())return;e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();window.location.href='index-ko.html?auth=login';},true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();







