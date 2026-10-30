/* Brand book VTC — carrousel : flèches, clavier, glisser, compteur */
(function () {
  var track = document.getElementById('bbTrack');
  if (!track) return;
  var slides = track.querySelectorAll('.bb-slide');
  var prev = document.getElementById('bbPrev');
  var next = document.getElementById('bbNext');
  var count = document.getElementById('bbCount');
  var total = slides.length;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function current() { return Math.round(track.scrollLeft / (slides[0].offsetWidth + 14)); }
  function go(i) {
    i = Math.max(0, Math.min(total - 1, i));
    track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }
  function update() {
    var i = current();
    count.textContent = pad(i + 1) + ' / ' + pad(total);
    prev.disabled = i === 0;
    next.disabled = i === total - 1;
  }
  prev.addEventListener('click', function () { go(current() - 1); });
  next.addEventListener('click', function () { go(current() + 1); });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
  });
  var t;
  track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(update, 60); }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
