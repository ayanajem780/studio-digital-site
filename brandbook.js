/* Brand books — carrousels de pages (VTC, Amori…) : flèches, clavier, glisser, compteur */
(function () {
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  document.querySelectorAll('.bb').forEach(function (bb) {
    var track = bb.querySelector('.bb-track');
    var slides = track ? track.querySelectorAll('.bb-slide') : [];
    if (!slides.length) return;
    var prev = bb.querySelector('.bb-prev');
    var next = bb.querySelector('.bb-next');
    var count = bb.querySelector('.bb-count');
    var total = slides.length;
    function step() { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : slides[0].offsetWidth; }
    function current() { return Math.round(track.scrollLeft / step()); }
    function go(i) {
      i = Math.max(0, Math.min(total - 1, i));
      track.scrollTo({ left: i * step(), behavior: 'smooth' });
    }
    function update() {
      var i = current();
      if (count) count.textContent = pad(i + 1) + ' / ' + pad(total);
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === total - 1;
    }
    if (prev) prev.addEventListener('click', function () { go(current() - 1); });
    if (next) next.addEventListener('click', function () { go(current() + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
    });
    var t;
    track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();
