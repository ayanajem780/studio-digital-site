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
