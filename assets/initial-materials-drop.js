(function(){'use strict';
  if(!document.body||document.body.dataset.page!=='initial-materials')return;
  function mount(){
    var box=document.querySelector('.initial-materials-workspace');
    if(!box||box.querySelector('[data-material-drop]'))return;
    var input=box.querySelector('[data-material-files]'),list=box.querySelector('[data-material-list]');
    if(!input||!list)return;
    var drop=document.createElement('div');drop.className='material-dropzone';drop.dataset.materialDrop='';drop.innerHTML='<strong>파일을 여기에 끌어다 놓으세요</strong><small>PDF·DOCX·PPTX·XLSX·CSV·TXT·이미지·음성 파일 지원</small><button type="button">파일 선택</button>';
    input.parentNode.insertBefore(drop,input);input.style.display='none';drop.querySelector('button').onclick=function(){input.click()};
    function names(files){return Array.prototype.map.call(files||[],function(f){return'<li>'+String(f.name).replace(/[&<>\"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]})+' <small>저장 대기</small></li>'}).join('')}
    function accept(files){if(!files.length)return;drop.classList.add('has-files');drop.querySelector('strong').textContent=files.length+'개 파일이 준비되었습니다';list.innerHTML=names(files);var dt=new DataTransfer();Array.prototype.forEach.call(files,function(f){dt.items.add(f)});input.files=dt.files;}
    ['dragenter','dragover'].forEach(function(e){drop.addEventListener(e,function(ev){ev.preventDefault();drop.classList.add('is-over')})});['dragleave','drop'].forEach(function(e){drop.addEventListener(e,function(ev){ev.preventDefault();drop.classList.remove('is-over')})});drop.addEventListener('drop',function(ev){accept(ev.dataTransfer.files)});input.addEventListener('change',function(){accept(input.files)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,180)});else setTimeout(mount,180);
})();
