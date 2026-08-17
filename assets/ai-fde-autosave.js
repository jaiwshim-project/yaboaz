(function(){
  'use strict';
  var page=(document.body&&document.body.dataset.page)||location.pathname.split('/').pop();
  var aiKeys=['[data-material-ai]','[data-ai-draft]','[data-intake-ai]','[data-ai-output]','.ai-analysis-result'];
  var fdeKeys=['[data-fde-input]','[data-fde-analysis-input]','[data-material-note]','[data-onboarding-save] + textarea','.fde-input textarea','.workflow-fde textarea'];
  function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return {}}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v));}
  function saveAI(el){var text=(el.innerText||el.textContent||'').trim();if(text.length<8)return;var all=read('k-fde-ai-results-v1');all[page]={text:text.slice(0,50000),updatedAt:new Date().toISOString()};write('k-fde-ai-results-v1',all);}
  function saveFde(el){var value=(el.value||'').trim();if(!value)return;var all=read('k-fde-fde-inputs-v1');all[page]=all[page]||{};all[page][el.dataset.fdeInput||el.dataset.fdeAnalysisInput||el.dataset.materialNote||el.name||'default']={value:value.slice(0,50000),updatedAt:new Date().toISOString()};write('k-fde-fde-inputs-v1',all);}
  function bind(){aiKeys.forEach(function(sel){document.querySelectorAll(sel).forEach(function(el){saveAI(el);new MutationObserver(function(){saveAI(el)}).observe(el,{childList:true,subtree:true,characterData:true});});});fdeKeys.forEach(function(sel){document.querySelectorAll(sel).forEach(function(el){var timer;el.addEventListener('input',function(){clearTimeout(timer);timer=setTimeout(function(){saveFde(el)},500);});});});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(bind,350)});else setTimeout(bind,350);
})();
