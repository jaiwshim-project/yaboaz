(function(){
  'use strict';
  var URL='https://sqfuqnxlafcilsookmqm.supabase.co';
  var KEY='sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function password(){try{return sessionStorage.getItem('kfde-admin-password')||'';}catch(e){return '';}}
  function call(name,body){return fetch(URL+'/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY,'Authorization':'Bearer '+KEY},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(data){if(!r.ok)throw new Error(data.message||'요청에 실패했습니다.');return data;});});}
  function show(text,error){var el=document.getElementById('admin-console-message');if(el){el.textContent=text||'';el.className='message'+(error?' error':' success');}}
  function render(rows){var counts={all:rows.length,pending:0,approved:0,blocked:0,paid:0,testing:0};rows.forEach(function(x){if(x.status==='pending')counts.pending++;if(x.status==='approved')counts.approved++;if(x.status==='blocked'||x.status==='rejected')counts.blocked++;if(x.membership_type==='testing')counts.testing++;else counts.paid++;});Object.keys(counts).forEach(function(k){var el=document.getElementById('count-'+k);if(el)el.textContent=counts[k];});var list=document.getElementById('member-list');if(!list)return;list.innerHTML=rows.length?rows.map(function(x){return '<tr><td><span class="member-name">'+esc(x.full_name)+'</span><span class="member-email">'+esc(x.email)+'</span></td><td>'+esc(x.company_name)+'</td><td>'+esc(x.phone)+'</td><td>'+esc(String(x.created_at||'').slice(0,10))+'</td><td><span class="status status-'+esc(x.membership_type||'paid')+'">'+(x.membership_type==='testing'?'테스팅(무료)':'유료회원')+'</span></td><td><span class="status status-'+esc(x.status)+'">'+esc({pending:'가입',approved:'정상',rejected:'거절',blocked:'차단'}[x.status]||x.status)+'</span></td><td><button class="member-delete" data-delete-id="'+esc(x.user_id)+'">회원 삭제</button></td></tr>';}).join(''):'<tr><td colspan="7" class="empty">가입 회원이 없습니다.</td></tr>'}
  function load(){var p=password();if(!p)return;call('yaboaz_dashboard_members',{p_password:p}).then(render).catch(function(e){show(e.message,true);});}
  function removeMember(id,button){if(!confirm('이 회원을 삭제할까요? 삭제 후 복구할 수 없습니다.'))return;button.disabled=true;call('yaboaz_dashboard_delete_member',{p_password:password(),p_user_id:id}).then(function(ok){if(ok!==true)throw new Error('회원 삭제에 실패했습니다.');show('회원을 삭제했습니다.');load();}).catch(function(e){show(e.message,true);button.disabled=false;});}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-delete-id]');if(b)removeMember(b.dataset.deleteId,b);if(e.target.closest('#admin-refresh'))load();if(e.target.closest('#admin-logout')){try{sessionStorage.removeItem('kfde-admin-gate');sessionStorage.removeItem('kfde-admin-password');}catch(e){}location.reload();}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
  window.addEventListener('admin-authenticated',load);
})();

