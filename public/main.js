async function fetchJSON(path){
  try { const r = await fetch(path, { headers: { 'accept': 'application/json' } });
    return r.ok ? await r.json() : []; } catch { return []; }
}

// File-list links keep normal browser behavior, with arrow keys as a shortcut.
(function(){
  document.querySelectorAll('[data-row-navigation]').forEach(function(table){
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr')).filter(function(row){
      return row.querySelector('.post-file-name a[href]');
    });
    if (!rows.length) return;

    var links = rows.map(function(row){
      return row.querySelector('.post-file-name a[href]');
    });

    rows.forEach(function(row, index){
      row.addEventListener('click', function(event){
        if (event.target.closest('a[href]')) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (window.getSelection && String(window.getSelection()).trim()) return;
        links[index].click();
      });
    });

    document.addEventListener('keydown', function(event){
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      var activeElement = document.activeElement;
      var currentIndex = links.indexOf(activeElement);
      if (currentIndex === -1) {
        if (activeElement !== document.body && activeElement !== document.documentElement) return;
        var bounds = table.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      }

      event.preventDefault();
      var nextIndex;
      if (currentIndex === -1) {
        nextIndex = event.key === 'ArrowDown' ? 0 : rows.length - 1;
      } else if (event.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 1, rows.length - 1);
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }
      links[nextIndex].focus();
      rows[nextIndex].scrollIntoView({ block: 'nearest' });
    });
  });
})();

// Keep linked photos in the article, with a dismissible native image viewer.
(function(){
  if (!window.HTMLDialogElement || !HTMLDialogElement.prototype.showModal) return;

  var viewer;
  var photo;
  var opener;

  function createViewer(){
    viewer = document.createElement('dialog');
    viewer.className = 'image-viewer';
    viewer.setAttribute('aria-label', 'Image viewer');

    var closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'image-viewer-close';
    closeButton.textContent = '× Close';
    closeButton.setAttribute('aria-label', 'Close image');
    closeButton.setAttribute('autofocus', '');
    closeButton.addEventListener('click', function(){ viewer.close(); });

    photo = document.createElement('img');
    viewer.append(closeButton, photo);
    document.body.appendChild(viewer);

    viewer.addEventListener('click', function(event){
      if (event.target === viewer) viewer.close();
    });
    // Native dialogs also close on Escape and keep keyboard focus inside.
    viewer.addEventListener('close', function(){
      document.documentElement.classList.remove('image-viewer-open');
      photo.removeAttribute('src');
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
    });
  }

  document.addEventListener('click', function(event){
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    var link = event.target.closest('.content a[href]');
    if (!link || link.hasAttribute('download')) return;
    var thumbnail = link.querySelector('img');
    if (!thumbnail) return;

    var url = new URL(link.href, document.baseURI);
    if (!/^https?:$/.test(url.protocol) || !/\.(?:jpe?g|png|gif|webp|avif|svg|bmp|ico|apng)$/i.test(url.pathname)) return;

    event.preventDefault();
    if (!viewer) createViewer();
    opener = link;
    photo.alt = thumbnail.alt;
    photo.src = url.href;
    viewer.showModal();
    document.documentElement.classList.add('image-viewer-open');
  });
})();

// Random image (CLS-safe)
(function(){
  var el = document.querySelector('#random-image');
  if (!el) return;
  var wrapper = el.querySelector('.image-wrapper');
  var sourceEl = el.querySelector('.image-source');

  function finish(){
    el.classList.remove('skeleton');
    el.setAttribute('aria-busy', 'false');
  }

  function unavailable(){
    wrapper.textContent = 'No image available.';
    sourceEl.replaceChildren();
    finish();
  }

  fetchJSON('/datasource/images.json').then(function(list){
    if (!Array.isArray(list) || list.length === 0) {
      unavailable();
      return;
    }

    function tryImage(remaining, usedIndices){
      if (remaining <= 0 || usedIndices.length >= list.length) {
        unavailable();
        return;
      }

      var availableIndices = [];
      for (var i = 0; i < list.length; i++) {
        if (usedIndices.indexOf(i) === -1) availableIndices.push(i);
      }

      var idx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      var item = list[idx];
      usedIndices.push(idx);

      if (!item || !item.src) {
        tryImage(remaining - 1, usedIndices);
        return;
      }

      var img = new Image();
      img.alt = item.alt || item.title || '';

      img.onload = function(){
        if (img.naturalWidth >= wrapper.clientWidth && img.naturalHeight >= wrapper.clientHeight) {
          var fragments = [];
          if (item.title || item.alt) {
            var titleText = document.createElement('span');
            titleText.textContent = item.title || item.alt;
            titleText.className = 'image-title';
            fragments.push(titleText);
          }
          if (item.source && item.source.path) {
            var link = document.createElement('a');
            link.href = item.source.path;
            link.textContent = item.source.title || 'original post';
            link.className = 'image-source-link';
            fragments.push(document.createTextNode('Image from '), link);
          }
          sourceEl.replaceChildren.apply(sourceEl, fragments);
          wrapper.replaceChildren(img);
          finish();
        } else {
          tryImage(remaining - 1, usedIndices);
        }
      };

      img.onerror = function(){
        tryImage(remaining - 1, usedIndices);
      };
      img.src = item.src;
    }

    tryImage(10, []);
  });
})();

// Random quote (CLS-safe)
(function(){
  var el = document.querySelector('#random-quote');
  if (!el) return;

  fetchJSON('/datasource/quote.json').then(function(list){
    var quotes = Array.isArray(list) ? list.filter(function(item){ return item && item.text; }) : [];
    var item = quotes[Math.floor(Math.random() * quotes.length)];
    var text = el.querySelector('.quote-text');
    var author = el.querySelector('.quote-author');
    var source = el.querySelector('.quote-reference');
    text.textContent = item ? item.text : 'No quote available.';
    var authorName = item && item.attributes && item.attributes['data-author'];
    author.textContent = authorName ? '— ' + authorName : '';
    if (item && item.source && item.source.path) {
      var link = document.createElement('a');
      link.href = item.source.path;
      link.textContent = item.source.title || 'original post';
      link.className = 'quote-source-link';
      source.replaceChildren(document.createTextNode('Quote from '), link);
    }
    el.classList.remove('skeleton');
    el.setAttribute('aria-busy', 'false');
  });
})();

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
