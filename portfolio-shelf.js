/* Portfolio — étagère 3D : survol ou clic pour ouvrir une catégorie, défilement automatique doux */
(function () {
  var shelf = document.querySelector('[data-shelf]');
  if (!shelf) return;
  var items = Array.prototype.slice.call(shelf.querySelectorAll('.shelf__item'));
  var active = 0, timer = null, inside = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  function set(i) {
    active = (i + items.length) % items.length;
    items.forEach(function (it, k) {
      var d = k - active;
      it.classList.toggle('is-active', d === 0);
      var panel = it.querySelector('.shelf__panel');
      // tranches inclinées comme des pochettes vues de côté, vers la carte ouverte
      panel.style.setProperty('--ry', d === 0 ? '0deg' : (d < 0 ? '38deg' : '-38deg'));
      panel.style.setProperty('--sc', d === 0 ? '1' : String(Math.max(0.86, 1 - Math.abs(d) * 0.035)));
      it.setAttribute('aria-current', d === 0 ? 'true' : 'false');
    });
  }
  function start() { if (reduce) return; stop(); timer = setInterval(function () { if (!inside) set(active + 1); }, 4200); }
  function stop() { if (timer) clearInterval(timer); timer = null; }

  items.forEach(function (it, k) {
    if (canHover) it.addEventListener('mouseenter', function () { set(k); });
    var openOnPress = null;
    it.addEventListener('pointerdown', function (e) { openOnPress = (k === active) || (canHover && e.pointerType === 'mouse'); });
    it.addEventListener('focus', function () { set(k); });
    it.addEventListener('click', function (e) {
      var ok = openOnPress === null ? k === active : openOnPress;
      openOnPress = null;
      if (!ok) { e.preventDefault(); set(k); }
    });
  });
  shelf.addEventListener('mouseenter', function () { inside = true; });
  shelf.addEventListener('mouseleave', function () { inside = false; });

  // Glisser sur mobile pour passer d’une catégorie à l’autre
  var x0 = null;
  shelf.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; inside = true; }, { passive: true });
  shelf.addEventListener('touchend', function (e) {
    if (x0 !== null) { var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) set(active + (dx < 0 ? 1 : -1)); }
    x0 = null; setTimeout(function () { inside = false; }, 3000);
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: 0.2 }).observe(shelf);
  } else start();
  set(0);
})();
