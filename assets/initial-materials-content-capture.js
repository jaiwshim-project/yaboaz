(function(){'use strict';
  if(!document.body||document.body.dataset.page!=='initial-materials')return;
  var key='k-fde-initial-materials-v1';
  function read(){try{return JSON.parse(localStorage.getItem(key)||'{}')}catch(e){return {}}}
  function readable(f){return /^(text\/|application\/json|application\/csv)/i.test(f.type)||/\.(txt|csv|json|md|log|xml|html?)$/i.test(f.name)}
  document.addEventListener('click',function(e){var button=e.target.closest('[data-material-save]'),input=document.querySelector('[data-material-files]');if(!button||!input||!input.files.length)return;var files=Array.prototype.slice.call(input.files).filter(readable);if(!files.length)return;Promise.all(files.map(function(file){return new Promise(function(resolve){var reader=new FileReader();reader.onload=function(){resolve({name:file.name,text:String(reader.result||'').slice(0,16000),savedAt:new Date().toISOString()})};reader.onerror=function(){resolve({name:file.name,text:'',savedAt:new Date().toISOString()})};reader.readAsText(file)})})).then(function(items){var data=read();data.contents=data.contents||{};items.forEach(function(item){data.contents[item.name]=item});localStorage.setItem(key,JSON.stringify(data))})},true);
})();
