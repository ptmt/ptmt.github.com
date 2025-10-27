// Theme toggle
(function(){
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

async function fetchJSON(path){
  try { const r = await fetch(path, { headers: { 'accept': 'application/json' } });
    return r.ok ? r.json() : []; } catch { return []; }
}

// Random image (CLS-safe)
fetchJSON('/datasource/images.json').then(function(list){
  if (!Array.isArray(list) || list.length === 0) return;
  var el = document.querySelector('#random-image');
  if (!el) return;
  var item = list[Math.floor(Math.random() * list.length)];
  var img = new Image();
  img.src = item.src; img.alt = item.alt || '';
  img.onload = function(){ el.classList.remove('skeleton'); el.setAttribute('aria-busy','false'); };
  el.replaceChildren(img);
});

// Random quote (CLS-safe)
fetchJSON('/datasource/quotes.json').then(function(list){
  if (!Array.isArray(list) || list.length === 0) return;
  var el = document.querySelector('#random-quote');
  if (!el) return;
  var item = list[Math.floor(Math.random() * list.length)];
  var text = el.querySelector('.quote-text');
  var author = el.querySelector('.quote-author');
  if (text) text.textContent = item.text || '';
  if (author) author.textContent = item.attributes && item.attributes['data-author'] || '';
  el.classList.remove('skeleton'); el.setAttribute('aria-busy','false');
});

// Language filter (default EN)
(function(){
  var root = document.querySelector('[data-lang-scope]');
  if (!root) return;
  function apply(lang){
    try { document.documentElement.setAttribute('data-current-lang', lang); } catch (e) {}
    root.querySelectorAll('[data-post-lang]').forEach(function(n){
      n.style.display = (lang === 'all' || n.dataset.postLang === lang) ? '' : 'none';
    });
  }
  apply('en');
  document.querySelectorAll('[data-lang-select]').forEach(function(btn){
    btn.addEventListener('click', function(){ apply(btn.dataset.langSelect); });
  });
})();

// Ideas are rendered server-side via datasource.collectables.ideas


