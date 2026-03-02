function setLang(l){
  document.documentElement.lang=l;
  document.querySelectorAll('[data-sv]').forEach(function(e){e.innerHTML=e.getAttribute('data-'+l);});
  document.getElementById('btn-sv').classList.toggle('active',l==='sv');
  document.getElementById('btn-en').classList.toggle('active',l==='en');
  // Show/hide language-specific elements
  document.querySelectorAll('[data-lang]').forEach(function(e){
    e.style.display = e.getAttribute('data-lang') === l ? '' : 'none';
  });
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

// Close hamburger menu when clicking outside or on a link
document.addEventListener('click', function(e) {
  var nav = document.querySelector('.nav-links');
  var btn = document.querySelector('.nav-hamburger');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && e.target !== btn) {
    nav.classList.remove('open');
  }
});
document.addEventListener('click', function(e) {
  if (e.target.closest('.nav-links a')) {
    var nav = document.querySelector('.nav-links');
    if (nav) nav.classList.remove('open');
  }
});
