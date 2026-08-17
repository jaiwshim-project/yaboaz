(function(){
  function apply(){
    var motto=document.querySelector('.brand-motto');
    if(!motto)return;
    var extra=motto.querySelector('small');
    if(extra)extra.remove();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
