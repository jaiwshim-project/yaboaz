(function(){
  'use strict';
  var ACCESS_PASSWORD='963314';

  var gate=document.getElementById('admin-gate'),consoleEl=document.getElementById('admin-console'),form=document.getElementById('admin-gate-form'),message=document.getElementById('admin-gate-message');
  function open(){if(gate)gate.hidden=true;if(consoleEl)consoleEl.hidden=false;}
  if(!form)return;
  try{if(sessionStorage.getItem('kfde-admin-gate')==='granted'){open();window.dispatchEvent(new Event('admin-authenticated'));return;}}catch(e){}
  form.onsubmit=function(e){e.preventDefault();var value=String(new FormData(form).get('accessPassword')||'');if(value!==ACCESS_PASSWORD){message.textContent='접속 비밀번호가 일치하지 않습니다.';message.className='message error';return;}try{sessionStorage.setItem('kfde-admin-gate','granted');sessionStorage.setItem('kfde-admin-password',value);}catch(e){}open();window.dispatchEvent(new Event('admin-authenticated'));};
})();



