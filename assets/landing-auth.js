(function(){
  'use strict';
  var SUPABASE_URL='https://sqfuqnxlafcilsookmqm.supabase.co';
  var SUPABASE_KEY='sb_publishable_e_l8tN6U0r6DEiiidSus4A_FdCugrVR';
  var DEST='https://yaboaz.com/mission-management.html';
  var AUTH_REDIRECT='https://yaboaz.com/index.html';
  function api(path,options){options=options||{};options.headers=Object.assign({'Content-Type':'application/json','apikey':SUPABASE_KEY},options.headers||{});return fetch(SUPABASE_URL+path,options).then(function(r){return r.json().then(function(data){if(!r.ok)throw new Error(data.error_description||data.msg||data.message||'Authentication failed');return data;});},true);}
  function dataApi(path,token,options){options=options||{};options.headers=Object.assign({'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+token},options.headers||{});return fetch(SUPABASE_URL+'/rest/v1/'+path,options).then(function(r){return r.json().then(function(data){if(!r.ok)throw new Error(data.message||data.hint||'회원 승인 정보를 확인할 수 없습니다.');return data;});},true);}
  function rpc(name,body,token){var headers={'Content-Type':'application/json','apikey':SUPABASE_KEY};if(token)headers.Authorization='Bearer '+token;return fetch(SUPABASE_URL+'/rest/v1/rpc/'+name,{method:'POST',headers:headers,body:JSON.stringify(body)}).then(function(r){return r.json().then(function(data){if(!r.ok)throw new Error(data.message||data.hint||'액세스코드 확인에 실패했습니다.');return data;});},true);}
  function accessCode(value){return String(value||'').trim().toUpperCase();}
  function saveSession(result){try{sessionStorage.setItem('kfde-auth-session',JSON.stringify(result));}catch(e){}}
  function hasSession(){try{var session=JSON.parse(sessionStorage.getItem('kfde-auth-session')||'null');return !!(session&&session.access_token&&session.user);}catch(e){return false;}}
  function profile(result,data){if(data&&data.signup){return dataApi('yaboaz_member_profiles?on_conflict=user_id',result.access_token,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({user_id:result.user.id,email:data.email,full_name:data.name,company_name:data.company,phone:data.phone,status:'pending'})});}return dataApi('yaboaz_member_profiles?select=status&user_id=eq.'+encodeURIComponent(result.user.id)+'&limit=1',result.access_token,{});}
  function openModal(){
    if(document.querySelector('.auth-backdrop'))return;
    var b=document.createElement('div');b.className='auth-backdrop';
    b.innerHTML='<section class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button class="auth-close" type="button" aria-label="Close">×</button><div class="auth-brand"><img src="assets/kfde-symbol.jpg" alt="YABOAZ K-FDE symbol"><div><strong>YABOAZ</strong><span>K-FDE PLATFORM</span></div></div><div class="auth-kicker">FDE 현장 실행.관리 플랫폼</div><h2 id="auth-title">플랫폼 시작하기</h2><p class="auth-intro">13단계 실행 플랫폼을 시작하려면 로그인하거나 회원가입하세요. <strong class="auth-approval-note">가입 후 바로 로그인할 수 있습니다.</strong></p><div class="auth-tabs"><button type="button" class="active" data-auth-mode="login">로그인</button><button type="button" data-auth-mode="signup">회원가입</button></div><form class="auth-form"><label><span>이메일 <i class="required-mark">*</i></span><input type="email" name="email" autocomplete="email" required placeholder="you@example.com"></label><label><span>비밀번호 <i class="required-mark">*</i></span><input type="password" name="password" autocomplete="current-password" required minlength="6" placeholder="6자 이상"></label><label class="auth-password-confirm" hidden><span>비밀번호 확인 <i class="required-mark">*</i></span><input type="password" name="passwordConfirm" autocomplete="new-password" minlength="6" placeholder="비밀번호를 다시 입력하세요"></label><label class="auth-name" hidden><span>이름 <i class="required-mark">*</i></span><input type="text" name="name" autocomplete="name" placeholder="이름"></label><label class="auth-company" hidden><span>소속(회사)명 <i class="required-mark">*</i></span><input type="text" name="company" autocomplete="organization" placeholder="소속 또는 회사명"></label><label class="auth-phone" hidden><span>휴대폰 번호 <i class="required-mark">*</i></span><input type="tel" name="phone" autocomplete="tel" placeholder="010-0000-0000"></label><label class="auth-access-code" hidden><span>10자리 액세스코드 (관리자로부터 받은 액세스코드를 입력하세요) <i class="required-mark">*</i></span><input type="text" name="accessCode" autocomplete="one-time-code" inputmode="text" maxlength="10" pattern="[A-Za-z0-9]{10}" placeholder="예: 1234567890"></label><p class="auth-message" role="status"></p><button class="auth-resend" type="button" hidden>인증 이메일 다시 보내기</button><button class="auth-submit" type="submit">로그인</button></form><footer class="auth-footer"><div><strong>YABOAZ K-FDE Platform</strong><span>FDE FIELD OPERATING SYSTEM</span></div><div class="auth-footer-status"><i></i><span>ACCESS CODE VERIFIED</span></div><small>HUMAN IN THE LOOP · EVIDENCE DRIVEN</small></footer></section>';
    document.body.appendChild(b);var mode='login',form=b.querySelector('form'),submit=b.querySelector('.auth-submit'),message=b.querySelector('.auth-message'),nameField=b.querySelector('.auth-name'),companyField=b.querySelector('.auth-company'),phoneField=b.querySelector('.auth-phone'),accessCodeField=b.querySelector('.auth-access-code'),passwordConfirmField=b.querySelector('.auth-password-confirm'),resend=b.querySelector('.auth-resend');
    function setMode(next){mode=next;b.querySelector('.auth-modal').classList.toggle('signup-mode',mode==='signup');b.querySelectorAll('[data-auth-mode]').forEach(function(x){x.classList.toggle('active',x.dataset.authMode===mode);});nameField.hidden=mode!=='signup';companyField.hidden=mode!=='signup';phoneField.hidden=mode!=='signup';accessCodeField.hidden=mode!=='signup';passwordConfirmField.hidden=mode!=='signup';nameField.querySelector('input').required=mode==='signup';companyField.querySelector('input').required=mode==='signup';phoneField.querySelector('input').required=mode==='signup';accessCodeField.querySelector('input').required=mode==='signup';passwordConfirmField.querySelector('input').required=mode==='signup';resend.hidden=true;submit.textContent=mode==='signup'?'회원가입':'로그인';message.textContent='';form.reset();}
    b.querySelectorAll('[data-auth-mode]').forEach(function(x){x.onclick=function(){setMode(x.dataset.authMode);};});b.querySelector('.auth-close').onclick=function(){b.remove();};b.onclick=function(e){if(e.target===b)b.remove();};
    resend.onclick=function(){var email=String(new FormData(form).get('email')||'').trim();resend.disabled=true;api('/auth/v1/resend',{method:'POST',body:JSON.stringify({type:'signup',email:email})}).then(function(){message.className='auth-message success';message.textContent='인증 이메일을 다시 보냈습니다. 받은 편지함을 확인해 주세요.';resend.disabled=false;}).catch(function(err){message.className='auth-message error';message.textContent=err.message;resend.disabled=false;});};
    form.onsubmit=function(e){
      e.preventDefault();
      var data=new FormData(form),email=String(data.get('email')).trim(),password=String(data.get('password')),passwordConfirm=String(data.get('passwordConfirm')||''),code=accessCode(data.get('accessCode'));
      if(mode==='signup'&&['name','company','phone','accessCode','passwordConfirm'].some(function(field){return !String(data.get(field)||'').trim();})){message.className='auth-message error';message.textContent='회원가입 항목을 모두 입력해 주세요.';return;}if(mode==='signup'&&password!==passwordConfirm){message.className='auth-message error';message.textContent='비밀번호가 일치하지 않습니다.';return;}
      if(mode==='signup'&&!/^[A-Z0-9]{10}$/.test(code)){message.className='auth-message error';message.textContent='10자리 영문·숫자 액세스코드를 입력해 주세요.';return;}
      submit.disabled=true;message.className='auth-message';message.textContent=mode==='signup'?'액세스코드 확인 중…':'로그인 확인 중…';
      var request;
      if(mode==='signup'){
        request=rpc('yaboaz_access_code_available',{p_code:code}).then(function(available){
          if(available!==true)throw new Error('유효하지 않거나 이미 사용된 액세스코드입니다.');
          return api('/auth/v1/signup',{method:'POST',body:JSON.stringify({email:email,password:password,data:{full_name:String(data.get('name')||'').trim(),company_name:String(data.get('company')||'').trim(),phone:String(data.get('phone')||'').trim()}})}).then(function(result){
            if(!result.access_token)throw new Error('가입은 완료되었지만 코드 할당을 완료하지 못했습니다. 이메일 인증 후 다시 시도해 주세요.');
            return rpc('yaboaz_claim_access_code',{p_code:code,p_user_id:result.user.id},result.access_token).then(function(claimed){
              if(claimed!==true)throw new Error('액세스코드가 다른 가입자에게 먼저 할당되었습니다.');
              return result;
            });
          });
        });
      } else {
        request=api('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:email,password:password})});
      }
      request.then(function(result){
        if(!result.access_token){message.className='auth-message error';message.textContent='가입이 완료되었습니다. 로그인하세요.';submit.disabled=false;return;}
        saveSession(result);
        return profile(result,{signup:mode==='signup',email:email,name:String(data.get('name')||'').trim(),company:String(data.get('company')||'').trim(),phone:String(data.get('phone')||'').trim()}).then(function(rows){
          var item=rows[0];
          if(mode==='signup'){message.className='auth-message success';message.textContent='가입이 완료되었습니다. 로그인하세요.';submit.disabled=false;return;}
          window.location.href=DEST;
        });
      }).catch(function(err){message.className='auth-message error';message.textContent=err.message;submit.disabled=false;});
    }
  }  document.addEventListener('click',function(e){var trigger=e.target.closest('[data-auth-gate]');if(!trigger||trigger.classList.contains('language-switch'))return;e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();if(hasSession()){window.location.href=trigger.getAttribute('href')||DEST;return;}openModal();},true);
  if(new URLSearchParams(window.location.search).get('auth')==='login'){setTimeout(openModal,0);}
})();





