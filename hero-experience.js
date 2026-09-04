/* =================================================================
   ANDIGITAL — HERO PREMIUM
   Micro-interactions légères, sans dépendance externe :
   1. Apparition progressive des éléments au chargement
   2. Parallax souris sur la composition graphique
   3. Effet magnétique sur le bouton principal
   4. Fondu de la scène au scroll
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const hero = document.querySelector(".hero-premium");
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 1. Apparition au chargement ---------- */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add("is-loaded");
    });
  });

  if (prefersReducedMotion) return;

  /* ---------- 2. Parallax souris ---------- */
  const visual = hero.querySelector(".hero-visual");
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  const maxOffset = 16;

  const onPointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;

    targetX = relX * maxOffset * 2;
    targetY = relY * maxOffset * 2;

    if (!rafId) rafId = requestAnimationFrame(updateParallax);
  };

  function updateParallax() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    hero.style.setProperty("--px", `${currentX.toFixed(2)}px`);
    hero.style.setProperty("--py", `${currentY.toFixed(2)}px`);

    if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }

  if (visual && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(updateParallax);
    });
  }

  /* ---------- 3. Effet magnétique sur le CTA ---------- */
  const magneticEls = hero.querySelectorAll("[data-magnetic]");

  magneticEls.forEach((el) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0, 0)";
    });
  });

  /* ---------- 4. Fondu de la scène au scroll ---------- */
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const heroHeight = hero.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);

      hero.style.setProperty("--scroll-fade", (1 - progress * 0.9).toFixed(3));
      hero.style.setProperty("--scroll-shift", `${(progress * 40).toFixed(1)}px`);

      ticking = false;
    });
  };

  const heroCopy = hero.querySelector(".hero-copy");
  const heroVisual = hero.querySelector(".hero-visual");

  if (heroCopy) {
    hero.style.setProperty("--scroll-fade", "1");
    hero.style.setProperty("--scroll-shift", "0px");

    const applyScrollStyle = () => {
      heroCopy.style.opacity = "var(--scroll-fade)";
      heroCopy.style.transform = "translateY(calc(var(--scroll-shift) * -1))";
      if (heroVisual) {
        heroVisual.style.opacity = "var(--scroll-fade)";
      }
    };

    window.addEventListener("scroll", () => {
      onScroll();
      applyScrollStyle();
    }, { passive: true });
  }
});