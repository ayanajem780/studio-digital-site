/* Visionary Card VTC — inclinaison 3D au survol + retournement au clic (repris du site VTC) */
(function () {
  var tiltEl = document.getElementById('vcardTilt');
  var cardEl = document.getElementById('vcard');
  if (!tiltEl || !cardEl) return;

  var MAX_TILT = 16, SPRING = 0.12, SHEEN_SPRING = 0.15;
  var tRX = 0, tRY = 0, cRX = 0, cRY = 0;
  var tSheen = 50, cSheen = 50, tSheenOp = 0, cSheenOp = 0;
  var tShScale = 1, cShScale = 1, tShOp = 0.85, cShOp = 0.85;
  var flipped = false, dragStart = null, dragged = false, mouseDownPos = null;

  function setTargets(x, y) {
    var r = tiltEl.getBoundingClientRect();
    var px = (x - r.left) / r.width, py = (y - r.top) / r.height;
    tRY = (px * 2 - 1) * MAX_TILT;
    tRX = -(py * 2 - 1) * MAX_TILT;
    tSheen = px * 100; tSheenOp = 1; tShScale = 1.15; tShOp = 0.55;
  }
  function reset() { tRX = 0; tRY = 0; tSheenOp = 0; tShScale = 1; tShOp = 0.85; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function tick() {
    cRX = lerp(cRX, tRX, SPRING); cRY = lerp(cRY, tRY, SPRING);
    cSheen = lerp(cSheen, tSheen, SHEEN_SPRING); cSheenOp = lerp(cSheenOp, tSheenOp, SHEEN_SPRING);
    cShScale = lerp(cShScale, tShScale, SPRING); cShOp = lerp(cShOp, tShOp, SPRING);
    tiltEl.style.transform = 'rotateX(' + cRX.toFixed(2) + 'deg) rotateY(' + cRY.toFixed(2) + 'deg)';
    tiltEl.style.setProperty('--sheen-pos', cSheen.toFixed(1) + '%');
    tiltEl.style.setProperty('--sheen-opacity', cSheenOp.toFixed(2));
    tiltEl.style.setProperty('--shadow-scale', cShScale.toFixed(2));
    tiltEl.style.setProperty('--shadow-opacity', cShOp.toFixed(2));
    requestAnimationFrame(tick);
  }
  function toggleFlip() {
    flipped = !flipped;
    cardEl.classList.toggle('flipped', flipped);
    tiltEl.setAttribute('aria-pressed', String(flipped));
  }

  tiltEl.addEventListener('mousemove', function (e) { setTargets(e.clientX, e.clientY); });
  tiltEl.addEventListener('mouseleave', reset);
  tiltEl.addEventListener('mousedown', function (e) { mouseDownPos = { x: e.clientX, y: e.clientY }; });
  tiltEl.addEventListener('mouseup', function (e) {
    if (mouseDownPos && Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y) < 6) toggleFlip();
    mouseDownPos = null;
  });
  tiltEl.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; if (!t) return;
    dragStart = { x: t.clientX, y: t.clientY }; dragged = false; setTargets(t.clientX, t.clientY);
  }, { passive: true });
  tiltEl.addEventListener('touchmove', function (e) {
    var t = e.touches[0]; if (!t) return;
    if (dragStart && (Math.abs(t.clientX - dragStart.x) > 6 || Math.abs(t.clientY - dragStart.y) > 6)) dragged = true;
    setTargets(t.clientX, t.clientY);
  }, { passive: true });
  tiltEl.addEventListener('touchend', function (e) {
    reset(); if (!dragged) { e.preventDefault(); toggleFlip(); } dragStart = null;
  });
  tiltEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); }
  });
  window.addEventListener('blur', reset);

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) tick();
})();
