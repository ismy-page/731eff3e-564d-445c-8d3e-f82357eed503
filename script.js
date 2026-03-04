/*
  script.js
  - Matrix rain effect for hero
  - Mobile nav toggle + accessibility helpers
  - Fallback when canvas 2D context unsupported
*/

(function(){
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var header = document.querySelector('.site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var menu   = document.getElementById('nav-menu');
  if (toggle && header && menu){
    toggle.addEventListener('click', function(){
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      header.classList.toggle('open', !expanded);
    });
    // Close menu when a link is clicked (especially on mobile)
    menu.addEventListener('click', function(ev){
      var t = ev.target;
      if (t && t.tagName === 'A'){
        toggle.setAttribute('aria-expanded', 'false');
        header.classList.remove('open');
      }
    });
  }

  // Matrix Rain effect
  var canvas = document.getElementById('matrix');
  if (!canvas || !canvas.getContext){
    document.documentElement.classList.add('no-canvas');
    return; // graceful fallback
  }
  var ctx = canvas.getContext('2d');
  if (!ctx){
    document.documentElement.classList.add('no-canvas');
    return;
  }

  // DPR-aware sizing
  var dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  var width = 0, height = 0;
  function resize(){
    var rect = canvas.getBoundingClientRect();
    width  = Math.floor(rect.width);
    height = Math.floor(rect.height);
    canvas.width  = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    setupColumns();
  }

  // Glyphs and columns
  var glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789abcdef'.split('');
  var fontSize = 16; // will be recomputed
  var columns = [];
  function setupColumns(){
    // font size adaptive to viewport width for density control
    var vw = Math.max(320, Math.min(1600, width));
    fontSize = Math.round(vw / 60); // ~ 5vw -> readable density
    fontSize = Math.max(12, Math.min(28, fontSize));
    var colCount = Math.ceil(width / fontSize);
    columns = new Array(colCount);
    for (var i=0; i<colCount; i++){
      columns[i] = Math.floor(Math.random() * -50); // start above the top
    }
    ctx.font = fontSize + 'px monospace';
  }

  // Animation
  var last = 0;
  function draw(ts){
    // create trail effect
    ctx.fillStyle = 'rgba(3,7,17,0.06)'; // same base bg with softer alpha
    ctx.fillRect(0, 0, width, height);

    for (var i=0; i<columns.length; i++){
      var x = i * fontSize;
      var y = columns[i] * fontSize;
      var ch = glyphs[Math.floor(Math.random() * glyphs.length)];

      // Tail color fade: head bright, trail handled by alpha clearing above
      ctx.fillStyle = i % 7 === 0 ? 'rgba(79,195,255,0.85)' : 'rgba(102,255,204,0.85)';
      ctx.fillText(ch, x, y);

      if (y > height + Math.random() * 200){
        columns[i] = Math.floor(Math.random() * -50);
      } else {
        columns[i]++;
      }
    }
    requestAnimationFrame(draw);
  }

  // Throttled resize
  var resizeTimeout = null;
  function onResize(){
    if (resizeTimeout) return;
    resizeTimeout = setTimeout(function(){
      resizeTimeout = null;
      resize();
    }, 100);
  }

  // Kickoff
  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', onResize);
})();

