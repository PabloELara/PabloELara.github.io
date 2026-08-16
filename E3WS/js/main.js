// =========================================================
// E3WS - main.js
// Base estable comentada
// =========================================================

// ---------------------------------------------------------
// 1) Navegación con scroll suave hacia secciones internas
// ---------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();

    const targetId = id.slice(1);

    // Mantiene activo el link clicado durante el scroll suave
    setActiveLink(targetId);
    navClickLock = true;

    if (navClickTimer) clearTimeout(navClickTimer);
    navClickTimer = setTimeout(() => {
      navClickLock = false;
    }, 900);

    // Compensa la altura del header fijo
    const headerH = (document.querySelector("header")?.offsetHeight || 72) - 2;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ---------------------------------------------------------
// 2) Menú activo según la sección visible
// ---------------------------------------------------------
const observedSections = document.querySelectorAll("section[id]");
const desktopLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const mobileLinks = document.querySelectorAll('.off-links a[href^="#"]');

let navClickLock = false;
let navClickTimer = null;

function clearActiveLinks() {
  desktopLinks.forEach(link => link.classList.remove("active"));
  mobileLinks.forEach(link => link.classList.remove("active"));
}

function setActiveLink(id) {
  clearActiveLinks();

  const desktopLink = document.querySelector(`.nav-links a[href="#${id}"]`);
  const mobileLink = document.querySelector(`.off-links a[href="#${id}"]`);

  if (desktopLink) desktopLink.classList.add("active");
  if (mobileLink) mobileLink.classList.add("active");
}

const sectionObserver = new IntersectionObserver((entries) => {
  if (navClickLock) return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.id);
    }
  });
}, {
  rootMargin: "-35% 0px -50% 0px",
  threshold: 0.08
});

observedSections.forEach(section => sectionObserver.observe(section));

// ---------------------------------------------------------
// 3) Aparición general de hero y secciones al entrar en pantalla
// ---------------------------------------------------------
const appearObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".hero, section").forEach(el => appearObserver.observe(el));

// ---------------------------------------------------------
// 4) Slider automático del hero
// ---------------------------------------------------------
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 6000);
}

// ---------------------------------------------------------
// 5) Carrusel de la sección Casos
//    - botones
//    - swipe móvil
//    - autoplay
// ---------------------------------------------------------
const track = document.getElementById("track");
const items = document.querySelectorAll(".item");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const casosSection = document.getElementById("casos");

let currentCase = 0;
let autoTimer = null;
let pauseUntil = 0;
let startX = null;
let casosVisible = false;

function moveCarousel() {
  if (!track || !items.length) return;

  const slideWidth = items[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${currentCase * slideWidth}px)`;
}

window.addEventListener("resize", moveCarousel);
window.addEventListener("load", moveCarousel);

function userInteracted() {
  pauseUntil = Date.now() + 12000;
}

function goNext() {
  currentCase = (currentCase === items.length - 1) ? 0 : currentCase + 1;
  moveCarousel();
  userInteracted();
}

function goPrev() {
  currentCase = (currentCase === 0) ? items.length - 1 : currentCase - 1;
  moveCarousel();
  userInteracted();
}

if (prev) prev.addEventListener("click", goPrev);
if (next) next.addEventListener("click", goNext);

if (track) {
  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;

    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  }, { passive: true });
}

const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function startAutoCarousel() {
  if (prefersReducedMotion) return;
  if (autoTimer) return;

  autoTimer = setInterval(() => {
    if (Date.now() < pauseUntil) return;
    currentCase = (currentCase + 1) % items.length;
    moveCarousel();
  }, 9000);
}

function stopAutoCarousel() {
  if (!autoTimer) return;
  clearInterval(autoTimer);
  autoTimer = null;
}

if (casosSection) {
  const casosVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) startAutoCarousel();
      else stopAutoCarousel();
    });
  }, {
    threshold: 0.35
  });

  casosVisibilityObserver.observe(casosSection);
}

if (casosSection) {
  const casosKeyboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      casosVisible = entry.isIntersecting;
    });
  }, {
    threshold: 0.35
  });

  casosKeyboardObserver.observe(casosSection);
}

document.addEventListener("keydown", (e) => {
  if (!casosVisible) return;

  if (e.key === "ArrowRight") {
    e.preventDefault();
    goNext();
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    goPrev();
  }
});

// ---------------------------------------------------------
// 6) Formulario de contacto (PRO)
// ---------------------------------------------------------
const form = document.getElementById("contactForm");
const ok = document.getElementById("ok");
const btn = form?.querySelector(".send");

if (form && ok && btn) {
  const inputs = form.querySelectorAll("input, textarea");

  // Validación menos agresiva:
  // si el usuario solo entra y sale sin escribir, no marcamos error.
  inputs.forEach(input => {
    input.addEventListener("blur", () => {
      const value = input.value.trim();

      if (value === "") {
        input.classList.remove("touched");
        input.closest(".group")?.classList.remove("error");
        return;
      }

      input.classList.add("touched");
      validateField(input);
    });
  });

  function validateField(input) {
    const group = input.closest(".group");
    if (!group) return;

    if (!input.checkValidity()) {
      group.classList.add("error");
    } else {
      group.classList.remove("error");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;

    inputs.forEach(input => {
      input.classList.add("touched");
      validateField(input);

      if (!input.checkValidity()) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Loader ON
    btn.classList.add("loading");

    try {
      const data = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        form.reset();

        // limpiar estados visuales
        inputs.forEach(input => {
          input.classList.remove("touched");

          const group = input.closest(".group");
          if (group) {
            group.classList.remove("error");
          }
        });

        ok.textContent = "✅ Message sent successfully";
        ok.classList.add("visible");

        setTimeout(() => {
          ok.classList.remove("visible");
        }, 4000);
      } else {
        ok.textContent = "❌ Error sending message. Please try again";
        ok.classList.add("visible");

        setTimeout(() => {
          ok.classList.remove("visible");
        }, 4000);
      }
    } catch (error) {
      ok.textContent = "❌ Connection error";
      ok.classList.add("visible");

      setTimeout(() => {
        ok.classList.remove("visible");
      }, 4000);
    }

    // Loader OFF
    btn.classList.remove("loading");
  });
}

// ---------------------------------------------------------
// 7) Menú móvil: abrir, cerrar, foco y accesibilidad
// ---------------------------------------------------------
const burger = document.getElementById("burger");
const offcanvas = document.getElementById("offcanvas");
const closeMenuBtn = document.getElementById("closeMenu");
const backdrop = document.getElementById("backdrop");
let lastFocus = null;

function getFocusable(container) {
  return [...container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )].filter(el =>
    !el.hasAttribute("disabled") &&
    el.getAttribute("aria-hidden") !== "true"
  );
}

function isMenuOpen() {
  return offcanvas?.classList.contains("open");
}

function openMenu() {
  if (!offcanvas || !backdrop || !burger) return;

  lastFocus = document.activeElement;

  offcanvas.classList.add("open");
  backdrop.classList.add("open");
  burger.classList.add("active");

  burger.setAttribute("aria-expanded", "true");
  offcanvas.setAttribute("aria-hidden", "false");
  backdrop.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  const focusables = getFocusable(offcanvas);
  if (focusables.length) focusables[0].focus();
}

function closeMenu() {
  if (!offcanvas || !backdrop || !burger) return;

  offcanvas.classList.remove("open");
  backdrop.classList.remove("open");
  burger.classList.remove("active");

  burger.setAttribute("aria-expanded", "false");
  offcanvas.setAttribute("aria-hidden", "true");
  backdrop.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  else burger.focus();
}

if (burger) {
  burger.addEventListener("click", () => {
    if (isMenuOpen()) closeMenu();
    else openMenu();
  });
}

if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", closeMenu);
}

if (backdrop) {
  backdrop.addEventListener("click", () => {
    if (isMenuOpen()) closeMenu();
  });
}

document.addEventListener("keydown", (e) => {
  if (!isMenuOpen() || !offcanvas) return;

  if (e.key === "Escape") {
    e.preventDefault();
    closeMenu();
    return;
  }

  if (e.key === "Tab") {
    const focusables = getFocusable(offcanvas);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
      return;
    }

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Cierra el menú móvil al tocar un enlace interno
if (offcanvas) {
  offcanvas.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", () => {
      if (isMenuOpen()) closeMenu();
    });
  });
}

// ---------------------------------------------------------
// 8) Año automático en footer
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});