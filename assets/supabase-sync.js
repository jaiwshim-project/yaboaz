(function(){
  'use strict';
  var url='https://sqfuqnxlafcilsookmqm.supabase.co';
  var key='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnVxbnhsYWZjaWxzb29rbXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODI4NTMsImV4cCI6MjA4OTg1ODg1M30.QG99xzmjBAIPMXQaC_vpzwKdlIwp4nwUDkqdy2sNz54';
  var endpoint=url+'/rest/v1/fde_kv';
  var nativeSet=localStorage.setItem.bind(localStorage), nativeRemove=localStorage.removeItem.bind(localStorage);
  function headers(){return {'content-type':'application/json','apikey':key,'Authorization':'Bearer '+key,'Prefer':'resolution=merge-duplicates,return=minimal'};}
  function push(k,v){fetch(endpoint+'?on_conflict=key',{method:'POST',headers:headers(),body:JSON.stringify({key:k,value:v,updated_at:new Date().toISOString()})}).catch(function(){});}
  localStorage.setItem=function(k,v){nativeSet(k,v);try{push(k,JSON.parse(v));}catch(e){push(k,v);}};
  localStorage.removeItem=function(k){nativeRemove(k);fetch(endpoint+'?key=eq.'+encodeURIComponent(k),{method:'DELETE',headers:headers()}).catch(function(){});};
  fetch(endpoint+'?select=key,value&order=updated_at.desc',{headers:headers()}).then(function(r){return r.ok?r.json():[]}).then(function(rows){(rows||[]).forEach(function(row){if(localStorage.getItem(row.key)===null){nativeSet(row.key,typeof row.value==='string'?row.value:JSON.stringify(row.value));}});}).catch(function(){});
  window.KFDECloud={connected:true,save:function(k,v){push(k,v);},url:url};
})();

