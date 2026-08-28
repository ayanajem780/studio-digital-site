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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Repli si IntersectionObserver n'est pas supporté
    revealEls.forEach((el) => el.classList.add("is-visible"));
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

  /* ---------- 5bis. Sélecteur de sujet (carte du Hero) ---------- */
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
