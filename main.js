/* =================================================================
   ANDIGITAL — SCRIPT PRINCIPAL (toutes les pages)
   1. Header au scroll
   2. Menu mobile
   3. Apparitions au scroll (reveal)
   4. Accordéon FAQ
   5. Formulaires de contact
   6. Sélecteur de sujet (carte du Hero)
   7. Filtres du portfolio (Work)
   8. Année du footer
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1. Header au scroll ---------- */
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 12) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 2. Menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    // Barre d'icônes en bas du menu (style plein écran)
    if (!mainNav.querySelector(".nav-bar")) {
      const bar = document.createElement("div");
      bar.className = "nav-bar";
      bar.innerHTML =
        '<a href="https://wa.me/212660147345" target="_blank" rel="noopener" aria-label="WhatsApp">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.5 8.5 0 01-12.7 7.4L3 20l1.2-5.1A8.5 8.5 0 1121 11.5z"/></svg></a>' +
        '<span aria-label="Agadir, Maroc" title="Agadir, Maroc">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg></span>' +
        '<span class="nav-bar__lang">FR</span>' +
        '<a href="contact.html" aria-label="Contact">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>';
      mainNav.appendChild(bar);
    }
    const setHeaderH = () => { if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px"); };
    const closeNav = () => {
      mainNav.classList.remove("is-open");
      document.documentElement.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Ouvrir le menu");
    };
    navToggle.addEventListener("click", () => {
      setHeaderH();
      const isOpen = mainNav.classList.toggle("is-open");
      document.documentElement.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
  }

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
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 4. Accordéon FAQ ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          const otherQ = other.querySelector(".faq-question");
          const otherA = other.querySelector(".faq-answer");
          if (otherQ) otherQ.setAttribute("aria-expanded", "false");
          if (otherA) otherA.style.maxHeight = null;
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

  /* ---------- 5. Formulaires de contact ---------- */
  const contactForms = document.querySelectorAll(".contact-form, .contact-page-form");

  contactForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']");
      if (!submitBtn) return;
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

  /* ---------- 6. Sélecteur de sujet (carte du Hero) ---------- */
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

  /* ---------- 7. Filtres du portfolio (Work) ---------- */
  const filterButtons = document.querySelectorAll(".work-filter button");
  const workCards = document.querySelectorAll(".work-card");

  if (filterButtons.length && workCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        const filter = btn.getAttribute("data-filter");

        workCards.forEach((card) => {
          const cats = (card.getAttribute("data-category") || "").split(" ");
          const show = filter === "all" || cats.includes(filter);
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- 8. Année du footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});


/* ===== kréova : formulaire -> WhatsApp ===== */
(function(){
  var WA_NUMBER = "212660147345"; // <-- ton numéro WhatsApp (sans + ni espaces)
  var wa = document.getElementById("kvWa");
  if (wa) wa.href = "https://wa.me/" + WA_NUMBER;
  var form = document.getElementById("kvForm");
  if (!form) return;
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var f = form.elements;
    var msg = "Bonjour kréova, je souhaite parler de mon projet.\n\n" +
      "Nom : " + f.name.value + "\n" +
      "E-mail : " + f.email.value + "\n" +
      (f.phone.value ? "Téléphone : " + f.code.value + " " + f.phone.value + "\n" : "") +
      (f.message.value ? "\nMessage : " + f.message.value : "");
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank");
    form.reset();
  });
})();


/* ===== kréova : story, logo N&B -> couleur (toucher / survol / défilement mobile) ===== */
(function(){
  var media = document.getElementById("kvStoryMedia");
  if (!media) return;
  media.addEventListener("click", function(){ media.classList.toggle("is-color"); });
  var touch = window.matchMedia("(hover: none)").matches;
  if (touch && "IntersectionObserver" in window){
    new IntersectionObserver(function(entries){
      entries.forEach(function(e){ media.classList.toggle("is-color", e.intersectionRatio > 0.6); });
    }, { threshold: [0, 0.6, 1] }).observe(media);
  }
})();

