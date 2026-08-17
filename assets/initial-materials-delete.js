(function(){'use strict';
  if(!document.body||document.body.dataset.page!=='initial-materials')return;
  var KEY='k-fde-initial-materials-v1';
  function clean(v){return String(v||'').replace(/\s+저장 대기$/,'').trim()}
  function enhance(){
    var list=document.querySelector('.initial-materials-workspace [data-material-list]');if(!list)return;
    Array.prototype.forEach.call(list.querySelectorAll('li'),function(li){
      if(li.querySelector('[data-material-delete]')||li.classList.contains('empty'))return;
      var name=clean(li.textContent),button=document.createElement('button');button.type='button';button.textContent='삭제';button.dataset.materialDelete=name;button.className='material-delete';li.appendChild(button);
    });
  }
  function mount(){
    var list=document.querySelector('.initial-materials-workspace [data-material-list]');if(!list)return;
    enhance();list.addEventListener('click',function(e){var b=e.target.closest('[data-material-delete]');if(!b)return;e.preventDefault();var name=b.dataset.materialDelete;try{var d=JSON.parse(localStorage.getItem(KEY)||'{}');d.files=(d.files||[]).filter(function(f){return f.name!==name});localStorage.setItem(KEY,JSON.stringify(d));}catch(_){ }b.closest('li').remove();var status=document.querySelector('[data-material-status]');if(status)status.textContent='자료 삭제 완료';});new MutationObserver(enhance).observe(list,{childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,300)});else setTimeout(mount,300);
})();
