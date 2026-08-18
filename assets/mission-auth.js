(function(){
  'use strict';
  function mount(){
    var actions=document.querySelector('.top-actions');if(!actions||document.querySelector('.session-user'))return;
    var session=null;try{session=JSON.parse(sessionStorage.getItem('kfde-auth-session')||'null');}catch(e){}
    if(!session||!session.user)return;
    var user=session.user,meta=user.user_metadata||{},name=meta.full_name||meta.name||user.email||'로그인 사용자';
    var box=document.createElement('div');box.className='session-user';box.innerHTML='<span class="session-user-name"></span><button type="button" class="session-logout">로그아웃</button>';
    box.querySelector('.session-user-name').textContent=name;
    box.querySelector('.session-logout').onclick=function(){try{sessionStorage.removeItem('kfde-auth-session');sessionStorage.removeItem('kfde-admin-gate');sessionStorage.removeItem('kfde-admin-password');}catch(e){}window.location.href='index-ko.html';};
    actions.insertBefore(box,actions.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
