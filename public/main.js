
async function fetchJSON(path){
  try { const r = await fetch(path, { headers: { 'accept': 'application/json' } });
    return r.ok ? r.json() : []; } catch { return []; }
}

// Random image (CLS-safe)
fetchJSON('/datasource/images.json').then(function(list){
  if (!Array.isArray(list) || list.length === 0) return;
  var el = document.querySelector('#random-image');
  if (!el) return;
  
  // Ensure structure exists for layout calculations
  var wrapper = el.querySelector('.image-wrapper');
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    el.insertBefore(wrapper, el.firstChild);
  }
  if (el.firstChild !== wrapper) {
    el.insertBefore(wrapper, el.firstChild);
  }
  
  var sourceEl = el.querySelector('.image-source');
  if (!sourceEl) {
    sourceEl = document.createElement('div');
    sourceEl.className = 'image-source';
    el.appendChild(sourceEl);
  }
  
  function loadImage(){
    // Get container dimensions (wait for layout if needed)
    var containerWidth = wrapper.offsetWidth || wrapper.clientWidth;
    var containerHeight = wrapper.offsetHeight || wrapper.clientHeight;
    
    // If container not yet rendered, wait a bit for layout
    if (containerWidth === 0 || containerHeight === 0) {
      setTimeout(loadImage, 50);
      return;
    }
    
    function tryImage(remaining, usedIndices){
      if (remaining <= 0 || usedIndices.length >= list.length) return;
      
      var availableIndices = [];
      for (var i = 0; i < list.length; i++) {
        if (usedIndices.indexOf(i) === -1) availableIndices.push(i);
      }
      if (availableIndices.length === 0) return;
      
      var idx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      var item = list[idx];
      var img = new Image();
      img.src = item.src; img.alt = item.alt || '';
      
      img.onload = function(){
        // Check if image is large enough
        if (img.naturalWidth >= containerWidth && img.naturalHeight >= containerHeight) {
          el.classList.remove('skeleton');
          el.setAttribute('aria-busy','false');
          
          // Create/update source if available
          if (item.source) {
            if (!sourceEl) {
              sourceEl = document.createElement('div');
              sourceEl.className = 'image-source';
              el.appendChild(sourceEl);
            }
            var link = document.createElement('a');
            link.href = item.source.path;
            link.textContent = item.source.title;
            link.className = 'image-source-link';
            var fragments = [];
            if (item.title) {
              var titleText = document.createElement('span');
              titleText.textContent = item.title;
              titleText.className = 'image-title';
              fragments.push(titleText);
            }
            var fromText = document.createTextNode('from ');
            fragments.push(fromText, link);
            sourceEl.replaceChildren.apply(sourceEl, fragments);
            if (!sourceEl.parentNode) {
              el.appendChild(sourceEl);
            }
          } else if (sourceEl && sourceEl.parentNode) {
            sourceEl.remove();
          }
          
          // Ensure image is inside wrapper
          wrapper.replaceChildren(img);
          if (el.firstChild !== wrapper) {
            el.insertBefore(wrapper, el.firstChild);
          }
        } else {
          // Try next image
          usedIndices.push(idx);
          tryImage(remaining - 1, usedIndices);
        }
      };
      
      img.onerror = function(){
        // Try next image on error
        usedIndices.push(idx);
        tryImage(remaining - 1, usedIndices);
      };
    }
    
    tryImage(10, []); // Try up to 10 images
  }
  
  loadImage();
});

// Random quote (CLS-safe)
fetchJSON('/datasource/quotes.json').then(function(list){
  if (!Array.isArray(list) || list.length === 0) return;
  var el = document.querySelector('#random-quote');
  if (!el) return;
  var item = list[Math.floor(Math.random() * list.length)];
  var text = el.querySelector('.quote-text');
  var author = el.querySelector('.quote-author');
  var source = el.querySelector('.quote-source');
  if (text) text.textContent = item.text || '';
  if (author) author.textContent = item.attributes && item.attributes['data-author'] || '';
  if (source && item.source) {
    var link = document.createElement('a');
    link.href = item.source.path;
    link.textContent = item.source.title;
    link.className = 'quote-source-link';
    var text = document.createTextNode('from ');
    source.replaceChildren(text, link);
  }
  el.classList.remove('skeleton'); el.setAttribute('aria-busy','false');
});

// Ideas are rendered server-side via datasource.collectables.ideas


