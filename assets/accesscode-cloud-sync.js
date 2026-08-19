(function(){
  'use strict';
  var SUPABASE_URL='https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZnVxbnhsYWZjaWxzb29rbXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODI4NTMsImV4cCI6MjA4OTg1ODg1M30.QG99xzmjBAIPMXQaC_vpzwKdlIwp4nwUDkqdy2sNz54';
  var STORAGE_KEY='yaboaz-accesscode-used-v1';
  var endpoint=SUPABASE_URL+'/rest/v1/fde_kv';
  function headers(){return {'content-type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Prefer':'resolution=merge-duplicates,return=minimal'};}
  function normalize(value){return value && typeof value==='object' && !Array.isArray(value) ? value : {};}
  async function load(){
    var response=await fetch(endpoint+'?select=value&key=eq.'+encodeURIComponent(STORAGE_KEY),{headers:headers()});
    if(!response.ok) throw new Error('cloud read failed');
    var rows=await response.json();
    return normalize(rows[0] && rows[0].value);
  }
  function save(value){
    return fetch(endpoint+'?on_conflict=key',{method:'POST',headers:headers(),body:JSON.stringify({key:STORAGE_KEY,value:normalize(value),updated_at:new Date().toISOString()})}).then(function(response){if(!response.ok) throw new Error('cloud write failed');});
  }
  window.AccessCodeCloud={load:load,save:save};
})();