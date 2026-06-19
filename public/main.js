
async function fetchJSON(path){
  try { const r = await fetch(path, { headers: { 'accept': 'application/json' } });
    return r.ok ? r.json() : []; } catch { return []; }
}

// File-list row keyboard navigation
(function(){
  document.querySelectorAll('[data-row-navigation]').forEach(function(table){
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr')).filter(function(row){
      return row.querySelector('.post-file-name a[href]');
    });
    if (!rows.length) return;

    var links = rows.map(function(row){
      return row.querySelector('.post-file-name a[href]');
    });
    var selectedIndex = -1;

    function setSelected(index, shouldFocus){
      if (index < 0 || index >= rows.length) return;

      selectedIndex = index;
      rows.forEach(function(row, rowIndex){
        row.classList.toggle('is-selected', rowIndex === index);
        links[rowIndex].setAttribute('tabindex', rowIndex === index ? '0' : '-1');
      });

      if (shouldFocus) {
        links[index].focus();
        rows[index].scrollIntoView({ block: 'nearest' });
      }
    }

    links.forEach(function(link, index){
      link.setAttribute('tabindex', index === 0 ? '0' : '-1');
      link.addEventListener('focus', function(){
        setSelected(index, false);
      });
    });

    rows.forEach(function(row, index){
      row.addEventListener('click', function(event){
        if (event.target.closest('a[href]')) return;
        if (row.classList.contains('is-selected')) return;
        setSelected(index, true);
      });

      row.addEventListener('dblclick', function(event){
        if (event.target.closest('a[href]')) return;
        links[index].click();
      });
    });

    table.addEventListener('keydown', function(event){
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') return;

      var activeRow = event.target.closest('tbody tr');
      var currentIndex = rows.indexOf(activeRow);
      if (currentIndex === -1) currentIndex = selectedIndex === -1 ? 0 : selectedIndex;

      if (event.key === 'Enter') {
        event.preventDefault();
        links[currentIndex].click();
        return;
      }

      event.preventDefault();
      setSelected(
        event.key === 'ArrowDown'
          ? Math.min(currentIndex + 1, rows.length - 1)
          : Math.max(currentIndex - 1, 0),
        true
      );
    });
  });
})();

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
fetchJSON('/datasource/quote.json').then(function(list){
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

// Abbreviation tooltip support
(function(){
  var tooltip = null;
  
  function createTooltip(text){
    if (tooltip) {
      tooltip.remove();
    }
    tooltip = document.createElement('div');
    tooltip.className = 'abbr-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    return tooltip;
  }
  
  function positionTooltip(abbr, tooltipEl){
    var rect = abbr.getBoundingClientRect();
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Position tooltip above the abbr element, centered horizontally
    var tooltipTop = rect.top + scrollTop - tooltipEl.offsetHeight - 8;
    var tooltipLeft = rect.left + scrollLeft + (rect.width / 2) - (tooltipEl.offsetWidth / 2);
    
    // Adjust if tooltip would go off screen
    if (tooltipLeft < 8) {
      tooltipLeft = 8;
    } else if (tooltipLeft + tooltipEl.offsetWidth > window.innerWidth - 8) {
      tooltipLeft = window.innerWidth - tooltipEl.offsetWidth - 8;
    }
    
    // If tooltip would go above viewport, position below instead
    if (tooltipTop < scrollTop + 8) {
      tooltipTop = rect.bottom + scrollTop + 8;
    }
    
    tooltipEl.style.top = tooltipTop + 'px';
    tooltipEl.style.left = tooltipLeft + 'px';
  }
  
  function showTooltip(abbr){
    var title = abbr.getAttribute('title');
    if (!title) return;
    
    var tooltipEl = createTooltip(title);
    positionTooltip(abbr, tooltipEl);
    tooltipEl.classList.add('visible');
  }
  
  function hideTooltip(){
    if (tooltip) {
      tooltip.classList.remove('visible');
      setTimeout(function(){
        if (tooltip && !tooltip.classList.contains('visible')) {
          tooltip.remove();
          tooltip = null;
        }
      }, 200);
    }
  }
  
  document.addEventListener('click', function(e){
    var abbr = e.target.closest('abbr');
    if (abbr && abbr.getAttribute('title')) {
      e.preventDefault();
      if (tooltip && tooltip.classList.contains('visible')) {
        hideTooltip();
      } else {
        showTooltip(abbr);
      }
    } else if (tooltip && !tooltip.contains(e.target)) {
      hideTooltip();
    }
  });
  
  // Hide tooltip on scroll
  document.addEventListener('scroll', hideTooltip, true);
})();
