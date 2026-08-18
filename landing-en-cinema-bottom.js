(function(){
  function mount(){
    var cinema=document.querySelector('.en-cinema');
    if(!cinema||cinema.querySelector('.en-cinema-bottom'))return;
    var css=document.createElement('style');css.textContent='.en-cinema-bottom{border-top:1px solid #ffffff1c;padding:18px}.en-cinema-description{margin:0 0 16px;color:#d5e6eb;line-height:1.6}.en-cinema-phases{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.en-cinema-phases button{border:1px solid #ffffff25;border-radius:9px;background:#ffffff0d;color:#a9c0ca;text-align:left;padding:10px;cursor:pointer}.en-cinema-phases button b,.en-cinema-phases button span{display:block}.en-cinema-phases button b{font-size:10px;color:#7ee2e5}.en-cinema-phases button span{font-size:10px;margin-top:4px;line-height:1.35}.en-cinema-phases button.active{border-color:#7ee2e5;background:#7ee2e51a;color:#fff}.en-cinema-phases button.active b{color:#fff}@media(max-width:700px){.en-cinema-phases{grid-template-columns:1fr 1fr}}';document.head.appendChild(css);var bottom=document.createElement('div');
    bottom.className='en-cinema-bottom';
    bottom.innerHTML='<p class="en-cinema-description"></p><div class="en-cinema-phases"><button data-phase="0"><b>PHASE 1</b><span>FDE Discovery · 01–05</span></button><button data-phase="1"><b>PHASE 2</b><span>Field Understanding · 06</span></button><button data-phase="2"><b>PHASE 3</b><span>AX Execution Architecture · 07–10</span></button><button data-phase="3"><b>PHASE 4</b><span>Validation &amp; Assetization · 11–13</span></button></div>';
    cinema.querySelector('.en-cinema-player').appendChild(bottom);
    var descriptions=['Define the customer, field, and outcome before the work begins.','Turn field language into a shared structure that AI and people can use.','Design decisions, agents, workflows, screens, and data with human approval.','Validate the result in the field and package what works for reuse.'];
    var phases=bottom.querySelectorAll('[data-phase]'),desc=bottom.querySelector('.en-cinema-description');
    function update(){var n=Number((cinema.querySelector('.en-cinema-number')||{}).textContent||'1'),p=n<=5?0:n===6?1:n<=10?2:3;desc.textContent='Phase '+(p+1)+' · '+descriptions[p];phases.forEach(function(b,i){b.classList.toggle('active',i===p);});}
    phases.forEach(function(b){b.addEventListener('click',function(){var n=[0,5,6,10][Number(b.dataset.phase)],buttons=cinema.querySelectorAll('[data-stage]');if(buttons[n])buttons[n].click();update();});});
    cinema.addEventListener('click',function(e){if(e.target.closest('[data-stage],[data-next],[data-prev]'))setTimeout(update,0);});
    update();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(mount,50);});else setTimeout(mount,50);
})();
