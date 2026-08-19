(function () {
  'use strict';

  var css = document.createElement('style');
  css.textContent = '.yaboz-common-header{display:flex;align-items:center;justify-content:space-between;gap:18px;max-width:1380px;margin:0 auto;padding:18px 22px;border-bottom:1px solid #d8e9ed;background:#fff}.yaboz-lockup{display:flex;align-items:center;gap:10px;color:#10253d;text-decoration:none}.yaboz-lockup img{width:42px;height:42px;border:2px solid #b9dfe5;border-radius:11px;object-fit:cover;box-shadow:0 4px 12px rgba(16,77,99,.12)}.yaboz-lockup strong{display:block;font-size:16px}.yaboz-lockup small{display:block;margin-top:3px;color:#147fa4;font-size:9px;font-weight:800;letter-spacing:.13em}.yaboz-home-link{color:#147fa4;font-size:12px;font-weight:800;text-decoration:none}.yaboz-landing-brand{display:flex!important;align-items:center;gap:10px}.yaboz-landing-brand img{width:34px;height:34px;border-radius:9px;object-fit:cover}.yaboz-landing-brand span{display:block}.yaboz-landing-brand small{display:block;margin-top:3px;color:#147fa4;font-size:9px;font-weight:800;letter-spacing:.13em}.yaboz-common-footer{max-width:1380px;margin:48px auto 0;padding:28px 22px 22px;border-top:1px solid #cce7eb;color:#617687;background:#fff}.yaboz-footer-main{display:flex;align-items:flex-start;justify-content:space-between;gap:30px}.yaboz-footer-identity{display:flex;align-items:center;gap:11px}.yaboz-footer-identity img{width:38px;height:38px;border-radius:10px;object-fit:cover}.yaboz-footer-identity strong{display:block;color:#10253d}.yaboz-footer-identity small{display:block;margin-top:4px;color:#147fa4;font-size:9px;letter-spacing:.12em}.yaboz-footer-copy{margin:12px 0 0;font-size:12px;line-height:1.65}.yaboz-footer-bottom{display:flex;justify-content:space-between;gap:15px;margin-top:24px;padding-top:14px;border-top:1px solid #e3eff1;font-size:11px}@media(max-width:600px){.yaboz-common-header{padding:14px}.yaboz-common-footer{padding:24px 14px 18px}.yaboz-footer-main,.yaboz-footer-bottom{display:block}.yaboz-footer-bottom span{display:block;margin-top:7px}}';
  document.head.appendChild(css);  // YABOAZ print protection: paid learning and execution materials remain screen-only.
  var printCss = document.createElement('style');
  printCss.setAttribute('data-yaboaz-print-protection', 'true');
  printCss.textContent = '/* YABOAZ print protection */ @media print { html, body { background:#fff !important; } body > * { visibility:hidden !important; } body::after { content:"YABOAZ 콘텐츠는 화면에서만 이용할 수 있습니다."; visibility:visible; display:block; position:fixed; inset:42% 0 auto; text-align:center; color:#102a43; font:700 16px/1.5 Arial,"Noto Sans KR",sans-serif; } }';
  document.head.appendChild(printCss);

  function blockPrintShortcut(event) {
    if ((event.ctrlKey || event.metaKey) && String(event.key).toLowerCase() === 'p') {
      event.preventDefault();
      event.stopPropagation();
      window.alert('YABOAZ 콘텐츠는 화면에서만 이용할 수 있습니다.');
      return false;
    }
  }
  document.addEventListener('keydown', blockPrintShortcut, true);
  // YABOAZ copy protection: keep learning and execution materials screen-only.
  var copyCss = document.createElement('style');
  copyCss.setAttribute('data-yaboaz-copy-protection', 'true');
  copyCss.textContent = '/* YABOAZ copy protection */ body.yaboaz-copy-protected { -webkit-user-select:none !important; user-select:none !important; } body.yaboaz-copy-protected input, body.yaboaz-copy-protected textarea, body.yaboaz-copy-protected select, body.yaboaz-copy-protected [contenteditable="true"] { -webkit-user-select:text !important; user-select:text !important; }';
  document.head.appendChild(copyCss);
  document.body.classList.add('yaboaz-copy-protected');

  function blockCopyAction(event) {
    var target = event.target;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    var editable = target && (target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select');
    if (editable) return;
    event.preventDefault();
    event.stopPropagation();
  }
  document.addEventListener('copy', blockCopyAction, true);
  document.addEventListener('cut', blockCopyAction, true);
  document.addEventListener('contextmenu', blockCopyAction, true);
  document.addEventListener('dragstart', blockCopyAction, true);
  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && ['c', 'x'].indexOf(String(event.key).toLowerCase()) !== -1) {
      var target = event.target;
      var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
      if (!(target && (target.isContentEditable || tag === 'input' || tag === 'textarea'))) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }, true);

  function footerMarkup() {
    return '<div class="yaboz-footer-main"><div><div class="yaboz-footer-identity"><img src="/assets/kfde-symbol.jpg" alt="YABOAZ K-FDE symbol"><span><strong>YABOAZ K-FDE Platform</strong><small>FDE FIELD OPERATING SYSTEM</small></span></div><p class="yaboz-footer-copy">현장의 신호를 증거와 온톨로지로 구조화하고,<br>사람의 승인을 거쳐 실행과 성과로 연결합니다.</p></div><div>HUMAN IN THE LOOP · EVIDENCE DRIVEN</div></div><div class="yaboz-footer-bottom"><span>© 2026 YABOAZ K-FDE Platform. All rights reserved.</span><span>현장 실행 · 구조화 · 검증 · 자산화</span></div>';
  }

  var landing = document.querySelector('.landing');
  if (!landing && !document.querySelector('.yaboz-common-header')) {
    var header = document.createElement('header');
    header.className = 'yaboz-common-header';
    header.innerHTML = '<a class="yaboz-lockup" href="/index-ko.html"><img src="/assets/kfde-symbol.jpg" alt="YABOAZ K-FDE symbol"><span><strong>YABOAZ K-FDE Platform</strong><small>FDE FIELD OPERATING SYSTEM</small></span></a><a class="yaboz-home-link" href="/index-ko.html">공개 홈페이지</a>';
    document.body.insertBefore(header, document.body.firstChild);
  }

  if (landing) {
    var brand = landing.querySelector('.landing-brand');
    if (brand && !brand.querySelector('img')) {
      brand.innerHTML = '<img src="/assets/kfde-symbol.jpg" alt="YABOAZ K-FDE symbol"><span>YABOAZ K-FDE Platform<small>FDE FIELD OPERATING SYSTEM</small></span>';
      brand.classList.add('yaboz-landing-brand');
    }
  }

  var oldFooter = document.querySelector('.premium-footer');
  if (oldFooter) oldFooter.remove();
  var footer = document.querySelector('.landing-footer') || document.querySelector('.yaboz-common-footer');
  if (footer) {
    footer.className = 'yaboz-common-footer';
    footer.innerHTML = footerMarkup();
  } else {
    footer = document.createElement('footer');
    footer.className = 'yaboz-common-footer';
    footer.innerHTML = footerMarkup();
    document.body.appendChild(footer);
  }
})();