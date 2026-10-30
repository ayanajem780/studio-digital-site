/* WORK — Brand books en livres 3D : chute à l'arrivée, inclinaison
   qui suit la souris, ouverture au survol (ou au premier tap sur mobile) */
(function () {
  var shelf = document.getElementById('books');
  if (!shelf) return;
  var books = Array.prototype.slice.call(shelf.querySelectorAll('.book3d'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;

  // Les livres tombent quand la section arrive à l'écran
  if (reduce || !('IntersectionObserver' in window)) shelf.classList.add('is-in');
  else new IntersectionObserver(function (en, io) {
    if (en[0].isIntersecting) { shelf.classList.add('is-in'); io.disconnect(); }
  }, { threshold: 0.25 }).observe(shelf);

  books.forEach(function (b) {
    var link = b.querySelector('.book3d__link');
    var obj = b.querySelector('.book3d__obj');

    // Inclinaison qui suit la souris
    if (!touch && !reduce) {
      link.addEventListener('pointermove', function (e) {
        var r = link.getBoundingClientRect();
        obj.style.setProperty('--rx', (((e.clientX - r.left) / r.width - 0.5) * 24).toFixed(1));
        obj.style.setProperty('--ry', (((e.clientY - r.top) / r.height - 0.5) * -14).toFixed(1));
      });
      link.addEventListener('pointerleave', function () {
        obj.style.setProperty('--rx', 0); obj.style.setProperty('--ry', 0);
      });
    }

    link.addEventListener('click', function (e) {
      // Sur mobile : 1er tap = le livre s'ouvre, 2e tap = on va au brand book
      if (touch && !b.classList.contains('is-open')) {
        e.preventDefault();
        books.forEach(function (o) { o.classList.remove('is-open'); });
        b.classList.add('is-open');
        return;
      }
      var t = document.querySelector(link.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      b.classList.add('is-wiggle');
      setTimeout(function () {
        b.classList.remove('is-wiggle');
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }, reduce ? 0 : 350);
    });
  });
})();
