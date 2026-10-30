/* =================================================================
   WORK — Brand books en diaporama plein écran avec parallaxe
   (inspiré des sliders « artistic parallax » : image qui glisse
   en profondeur, titre qui monte, petit texte à droite)
   ================================================================= */
(function () {
  var root = document.getElementById('books');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('.books__slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.books__dots button'));
  var now = root.querySelector('.books__now');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 6500;
  var idx = 0, timer = null, busy = false;

  function pad(n) { return (n < 9 ? '0' : '') + (n + 1); }

  function go(next, dir) {
    if (busy || next === idx) return;
    busy = true;
    var from = slides[idx], to = slides[next];
    dir = dir || (next > idx ? 1 : -1);
    root.style.setProperty('--dir', dir);
    root.classList.toggle('is-back', dir < 0);
    from.classList.remove('is-active'); from.classList.add('is-leaving');
    to.classList.add('is-entering');
    // force reflow pour relancer les animations
    void to.offsetWidth;
    to.classList.add('is-active');
    idx = next;
    if (now) now.textContent = pad(idx);
    root.style.setProperty('--accent', to.getAttribute('data-accent') || '#fff');
    dots.forEach(function (d, i) {
      d.classList.toggle('is-current', i === idx);
      d.setAttribute('aria-current', i === idx ? 'true' : 'false');
    });
    setTimeout(function () {
      from.classList.remove('is-leaving');
      to.classList.remove('is-entering');
      busy = false;
    }, reduce ? 50 : 1300);
    restart();
  }
  function nextSlide() { go((idx + 1) % slides.length, 1); }
  function prevSlide() { go((idx - 1 + slides.length) % slides.length, -1); }

  function restart() {
    clearTimeout(timer);
    root.classList.remove('is-timing'); void root.offsetWidth; root.classList.add('is-timing');
    if (!reduce) timer = setTimeout(nextSlide, DURATION);
  }

  root.querySelector('.books__next').addEventListener('click', nextSlide);
  root.querySelector('.books__prev').addEventListener('click', prevSlide);
  dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i); }); });

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Glisser au doigt
  var x0 = null;
  root.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) (dx < 0 ? nextSlide : prevSlide)();
  });

  // Parallaxe souris sur l'image active
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    root.addEventListener('pointermove', function (e) {
      var r = root.getBoundingClientRect();
      root.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      root.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
    root.addEventListener('pointerleave', function () { root.style.setProperty('--mx', 0); root.style.setProperty('--my', 0); });
  }

  // Pause quand l'onglet ou la section n'est pas visible
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) restart(); else clearTimeout(timer);
    }, { threshold: 0.3 }).observe(root);
  }
  root.addEventListener('mouseenter', function () { clearTimeout(timer); root.classList.add('is-paused'); });
  root.addEventListener('mouseleave', function () { root.classList.remove('is-paused'); restart(); });

  // Lien « Ouvrir le brand book » : défilement doux vers le projet
  root.querySelectorAll('.books__more').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  dots[0].classList.add('is-current');
  root.style.setProperty('--accent', slides[0].getAttribute('data-accent'));
  restart();
})();
