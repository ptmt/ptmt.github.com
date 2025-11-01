
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

// Ideas are rendered server-side via datasource.collectables.ideas


