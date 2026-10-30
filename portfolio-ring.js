/* Portfolio — carrousel 3D en anneau : rotation auto, glisser, flèches, clic pour amener un projet devant */
(function () {
  var ring = document.querySelector('[data-ring]');
  if (!ring) return;
  var stage = ring.querySelector('.ring__stage');
  var track = ring.querySelector('.ring__track');
  var cards = Array.prototype.slice.call(ring.querySelectorAll('.ring__card'));
  var total = cards.length;
  // On double l’anneau pour qu’il remplisse toute la largeur (les copies sont décoratives)
  var copies = Math.max(0, Math.ceil(19 / total) - 1);
  var originals = cards.slice();
  for (var r = 0; r < copies; r++) {
    originals.forEach(function (c) {
      var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.setAttribute('data-clone', '');
      track.appendChild(k); cards.push(k);
    });
  }
  var glow = ring.querySelector('.ring__glow');
  var now = ring.querySelector('.ring__now');
  var n = cards.length, step = 360 / n;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var rot = 0, target = null, speed = 0, baseSpeed = reduce ? 0 : 7; // degrés / seconde
  var hovering = false, visible = true, front = -1, radius = 0;
  var drag = null, moved = false;

  function layout() {
    var w = Math.min(290, Math.max(180, ring.clientWidth * 0.19));
    var h = w * 4 / 3;
    ring.style.setProperty('--card-w', w + 'px');
    ring.style.setProperty('--ring-h', Math.round(h + 40) + 'px');
    radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.06);
    cards.forEach(function (c, i) { c.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)'; });
    render();
  }
  function norm(a) { a = ((a % 360) + 540) % 360 - 180; return a; }
  function render() {
    track.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + (-rot) + 'deg)';
    var best = 0, bestAbs = 999;
    cards.forEach(function (c, i) {
      var rel = norm(i * step - rot), abs = Math.abs(rel);
      if (abs < bestAbs) { bestAbs = abs; best = i; }
      var k = Math.max(0, Math.cos(rel * Math.PI / 180));
      c.style.filter = 'brightness(' + (0.6 + 0.4 * k).toFixed(3) + ')';
      c.style.opacity = (0.35 + 0.65 * k).toFixed(3);
      c.style.pointerEvents = abs > 80 ? 'none' : '';
      c.tabIndex = (abs > 80 || c.hasAttribute('data-clone')) ? -1 : 0;
    });
    if (best !== front) {
      if (front >= 0) cards[front].classList.remove('is-front');
      front = best; cards[front].classList.add('is-front');
      var idx = front % total + 1;
      if (now) now.textContent = (idx < 10 ? '0' : '') + idx;
    }
  }
  function goTo(angle) { target = angle; }
  function nearest(a) { return Math.round(a / step) * step; }

  var last = performance.now();
  function tick(t) {
    var dt = Math.min(0.05, (t - last) / 1000); last = t;
    if (!drag && visible) {
      if (target !== null) {
        var d = target - rot; rot += d * Math.min(1, dt * 7);
        if (Math.abs(d) < 0.05) { rot = target; target = null; }
      } else {
        var want = hovering ? 0 : baseSpeed;
        speed += (want - speed) * Math.min(1, dt * 3);
        rot += speed * dt;
      }
      render();
    }
    requestAnimationFrame(tick);
  }

  ring.querySelector('.ring__prev').addEventListener('click', function () { goTo(nearest(target !== null ? target : rot) - step); });
  ring.querySelector('.ring__next').addEventListener('click', function () { goTo(nearest(target !== null ? target : rot) + step); });
  ring.addEventListener('mouseenter', function () { hovering = true; });
  ring.addEventListener('mouseleave', function () { hovering = false; });
  ring.addEventListener('focusin', function () { hovering = true; });
  ring.addEventListener('focusout', function () { hovering = false; });

  cards.forEach(function (c, i) {
    c.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); return; }
      if (i !== front) { e.preventDefault(); goTo(rot + norm(i * step - rot)); }
    });
    c.addEventListener('focus', function () { if (i !== front) goTo(rot + norm(i * step - rot)); });
  });

  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    drag = { x: e.clientX, rot: rot, id: e.pointerId }; moved = false; target = null;
  });
  window.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x;
    if (!moved && Math.abs(dx) > 6) { moved = true; ring.classList.add('is-dragging'); try { stage.setPointerCapture(drag.id); } catch (err) {} }
    if (moved) { rot = drag.rot - dx * 0.25; render(); }
  });
  function endDrag() {
    if (!drag) return;
    if (moved) { goTo(nearest(rot)); speed = 0; }
    drag = null; ring.classList.remove('is-dragging');
    setTimeout(function () { moved = false; }, 0);
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.05 }).observe(ring);
  }
  window.addEventListener('resize', layout);
  layout();
  requestAnimationFrame(tick);
})();
