/* =================================================================
   STUDIO DIGITAL — SCRIPT
   1. Header au scroll
   2. Menu mobile
   3. Apparitions au scroll (reveal)
   4. Accordéon FAQ
   5. Formulaire de contact
   6. Année du footer
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Header au scroll ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 2. Menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 3. Apparitions au scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Repli si IntersectionObserver n'est pas supporté
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 3bis. Parallaxe légère — accent SVG de la section "Le constat" ---------- */
  const statementAccent = document.getElementById("statementAccent");
  const statementPhotos = document.getElementById("statementPhotos");

  if (
    statementAccent &&
    statementPhotos &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    let parallaxActive = false;
    let ticking = false;

    const updateParallax = () => {
      const rect = statementPhotos.getBoundingClientRect();
      const progress = 1 - rect.top / (window.innerHeight || 1); // 0 → entre en bas, 1 → en haut
      const clamped = Math.max(-1, Math.min(1, progress - 0.5));
      const offset = clamped * 18; // déplacement max ±18px, volontairement discret
      statementAccent.style.transform = `translateY(${offset}px)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!parallaxActive || ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    };

    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          parallaxActive = entry.isIntersecting;
          if (parallaxActive) updateParallax();
        });
      },
      { threshold: 0 }
    );
    parallaxObserver.observe(statementPhotos);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 3ter. Pile qui se déplie au scroll — section "Le constat" ---------- */
  const pinStage = document.getElementById("statementPhotosStage");
  const pinPhotos = document.getElementById("statementPhotos");

  if (
    pinStage &&
    pinPhotos &&
    "IntersectionObserver" in window &&
    window.matchMedia("(min-width: 901px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const slotEls = Array.from(pinPhotos.querySelectorAll(".photo-slot"));
    const stackRotations = [-7, 5, -4, 6, -3]; // légère rotation par carte, façon pile physique
    let slotData = [];
    let pinActive = false;
    let ticking = false;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function measureSlots() {
      const cx = pinPhotos.offsetWidth / 2;
      const cy = pinPhotos.offsetHeight / 2;
      slotData = slotEls.map((el, i) => {
        el.style.transform = "none"; // mesure à partir de la position naturelle
        const sx = el.offsetLeft + el.offsetWidth / 2;
        const sy = el.offsetTop + el.offsetHeight / 2;
        return {
          el,
          dx: cx - sx,
          dy: cy - sy,
          rot: stackRotations[i % stackRotations.length]
        };
      });
    }

    function updatePin() {
      const stageRect = pinStage.getBoundingClientRect();
      const stickyTop = 96;
      const pinnedHeight = (window.innerHeight || 800) - stickyTop;
      const scrollable = pinStage.offsetHeight - pinnedHeight;
      const scrolledIntoStage = -stageRect.top;
      const progress = Math.max(0, Math.min(1, scrolledIntoStage / (scrollable || 1)));

      const stagger = 0.13;
      const duration = 0.44;

      slotData.forEach((slot, i) => {
        const start = i * stagger;
        const local = Math.max(0, Math.min(1, (progress - start) / duration));
        const eased = easeOutCubic(local);
        const tx = slot.dx * (1 - eased);
        const ty = slot.dy * (1 - eased);
        const rot = slot.rot * (1 - eased);
        const scale = 0.82 + 0.18 * eased;
        slot.el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`;
      });

      ticking = false;
    }

    const onPinScroll = () => {
      if (!pinActive || ticking) return;
      ticking = true;
      requestAnimationFrame(updatePin);
    };

    measureSlots();
    updatePin();

    const pinObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          pinActive = entry.isIntersecting;
          if (pinActive) updatePin();
        });
      },
      { threshold: 0 }
    );
    pinObserver.observe(pinStage);

    window.addEventListener("scroll", onPinScroll, { passive: true });
    window.addEventListener(
      "resize",
      () => {
        if (!window.matchMedia("(min-width: 901px)").matches) {
          slotEls.forEach((el) => { el.style.transform = ""; });
          return;
        }
        measureSlots();
        updatePin();
      },
      { passive: true }
    );
  }

  /* ---------- 4. Accordéon FAQ ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Ferme les autres questions ouvertes
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        question.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- 5. Formulaires de contact (hero + brief) ---------- */
  const contactForms = document.querySelectorAll(".contact-form");

  contactForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // TODO : brancher cet envoi sur votre service d'emailing / CRM
      // (ex : Formspree, EmailJS, Google Apps Script, etc.)
      const submitBtn = form.querySelector("button[type='submit']");
      const originalHTML = submitBtn.innerHTML;
      submitBtn.textContent = "Message envoyé ✓";
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        form.reset();
      }, 2500);
    });
  });

  /* ---------- 5bis. Pile de cartes interactive du Hero ---------- */
  const collageStack = document.getElementById("collageStack");
  const collageDots = document.getElementById("collageDots");

  if (collageStack && collageDots) {
    const collageImages = [
      { src: "assets/services/strategie-de-marque.jpg", label: "Stratégie de marque" },
      { src: "assets/services/identite-visuelle.png", label: "Identité visuelle" },
      { src: "assets/services/refonte-graphique.png", label: "Refonte graphique" },
      { src: "assets/services/brand-content.png", label: "Brand content" },
      { src: "assets/services/motion-design.png", label: "Motion design" },
      { src: "assets/services/marketing-communication.png", label: "Marketing & communication" },
      { src: "assets/services/social-media-management.png", label: "Social media management" },
      { src: "assets/services/photographie.png", label: "Photographie" }
    ];

    let activeIndex = 0;
    let isAnimating = false;
    const slots = [0, 1, 2].map((n) =>
      collageStack.querySelector(`[data-slot="${n}"]`)
    );

    // Construit les points de progression (1 par image)
    collageImages.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "collage-dot" + (i === 0 ? " is-active" : "");
      collageDots.appendChild(dot);
    });
    const dotEls = collageDots.querySelectorAll(".collage-dot");

    function renderSlots() {
      slots.forEach((slot, offset) => {
        const img = collageImages[(activeIndex + offset) % collageImages.length];
        const imgEl = slot.querySelector("img");
        const capEl = slot.querySelector("figcaption");
        imgEl.src = img.src;
        imgEl.alt = img.label;
        capEl.textContent = img.label;
      });
      dotEls.forEach((dot, i) => dot.classList.toggle("is-active", i === activeIndex));
    }

    function advance() {
      if (isAnimating) return;
      isAnimating = true;

      const front = slots[0];
      front.classList.add("is-leaving");

      setTimeout(() => {
        activeIndex = (activeIndex + 1) % collageImages.length;
        front.classList.remove("is-leaving");
        renderSlots();
        isAnimating = false;
      }, 450);
    }

    renderSlots();

    collageStack.addEventListener("click", advance);
    collageStack.addEventListener("mouseenter", advance);
    collageStack.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        advance();
      }
    });
  }

  /* ---------- 5ter. Sélecteur de sujet (carte du Hero) ---------- */
  const heroTabs = document.querySelectorAll(".hero-tab");

  heroTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      heroTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
    });
  });

  /* ---------- 6. Année du footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
