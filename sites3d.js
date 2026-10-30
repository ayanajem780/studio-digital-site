/* WORK — Sites web animés : à l'arrivée, chaque fenêtre rebondit,
   l'adresse se tape lettre par lettre, l'écran « s'allume », la vidéo
   démarre et le téléphone surgit. Clic : page du projet. */
(function () {
  var root = document.getElementById('websites');
  if (!root) return;
  var sites = Array.prototype.slice.call(root.querySelectorAll('.site3d'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;

  function type(site, delay) {
    var el = site.querySelector('.site3d__typed');
    var txt = el.getAttribute('data-url'); var n = 0;
    if (reduce) { el.textContent = txt; site.classList.add('is-on'); return; }
    setTimeout(function tick() {
      el.textContent = txt.slice(0, ++n);
      if (n < txt.length) setTimeout(tick, 45 + Math.random() * 55);
      else setTimeout(function () { site.classList.add('is-on'); }, 250);
    }, delay);
  }

  function start() {
    root.classList.add('is-in');
    sites.forEach(function (s, i) { type(s, 900 + i * 450); });
  }
  if (!('IntersectionObserver' in window)) start();
  else new IntersectionObserver(function (en, io) {
    if (en[0].isIntersecting) { start(); io.disconnect(); }
  }, { threshold: 0.3 }).observe(root);

  sites.forEach(function (s) {
    var link = s.querySelector('.site3d__link');
    var win = s.querySelector('.site3d__win');
    if (!touch && !reduce) {
      link.addEventListener('pointermove', function (e) {
        var r = link.getBoundingClientRect();
        win.style.setProperty('--rx', (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(1));
      });
      link.addEventListener('pointerleave', function () { win.style.setProperty('--rx', 0); });
    }
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var href = link.getAttribute('href');
      s.classList.add('is-wiggle');
      setTimeout(function () { window.location.href = href; }, reduce ? 0 : 380);
    });
  });
})();
