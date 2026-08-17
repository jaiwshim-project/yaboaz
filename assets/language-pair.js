(function () {
  'use strict';
  if (document.querySelector('.language-pair')) return;
  var file = window.location.pathname.split('/').pop() || 'index.html';
  var en = /-en\.html$/i.test(file);
  var ko = file.replace(/-en\.html$/i, '.html');
  var enFile = file.replace(/\.html$/i, '-en.html');
  var bar = document.createElement('nav');
  bar.className = 'language-pair';
  bar.innerHTML = '<a class="' + (en ? '' : 'active') + '" href="' + ko + '" aria-label="한국어">🇰🇷 <span>한국어</span></a><i>|</i><a class="' + (en ? 'active' : '') + '" href="' + enFile + '" aria-label="English">🇺🇸 <span>English</span></a>';
  document.body.appendChild(bar);
})();
