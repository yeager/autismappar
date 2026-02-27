function setLang(l){
  document.documentElement.lang=l;
  document.querySelectorAll('[data-sv]').forEach(function(e){e.innerHTML=e.getAttribute('data-'+l);});
  document.getElementById('btn-sv').classList.toggle('active',l==='sv');
  document.getElementById('btn-en').classList.toggle('active',l==='en');
  localStorage.setItem('lang',l);
}
(function(){var s=localStorage.getItem('lang');var b=navigator.language.startsWith('sv')?'sv':'en';setLang(s||b);})();

function filterCat(c){
  document.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('active');});
  event.target.classList.add('active');
  document.querySelectorAll('.app-card').forEach(function(card){
    card.style.display=(c==='all'||card.dataset.cat===c)?'':'none';
  });
}
