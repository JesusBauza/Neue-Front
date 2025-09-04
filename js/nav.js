document.addEventListener("DOMContentLoaded", function () {
  // --- Selectores ---
  const navbar = document.querySelector(".navbar");
  const sections = document.querySelectorAll("[data-section-theme]");
  const navToggler = document.querySelector(".nav-toggler");
  const mobileNav = document.querySelector(".mobile-nav");
  const closeBtn = document.querySelector(".close-btn");
  const mobileMenuLinks = document.querySelectorAll(".mobile-nav a");

  if (mobileNav) {
    mobileNav.classList.remove("is-active");
  }
  document.documentElement.classList.remove("no-scroll");
  // ▼▼▼ CÓDIGO AÑADIDO PARA EL ROLLING TEXT ▼▼▼
  // Selecciona todos los enlaces que necesitan el efecto en desktop y móvil.
  const rollingLinks = document.querySelectorAll(
    ".nav-link span, .mobile-main-links a span"
  );

  rollingLinks.forEach((span) => {
    const originalText = span.textContent.trim();
    if (originalText) {
      // Duplicamos el texto con un <br> en medio para crear el efecto.
      span.innerHTML = `${originalText}<br>${originalText}`;
    }
  });
  // ▲▲▲ FIN DEL CÓDIGO AÑADIDO ▲▲▲

  // --- Corrección del color inicial del Navbar al cargar la página ---
  if (sections.length > 0) {
    const firstSectionTheme = sections[0].dataset.sectionTheme;
    if (firstSectionTheme === "light") {
      navbar.classList.add("invert-colors");
    } else {
      navbar.classList.remove("invert-colors");
    }
  }

  // --- Lógica para color adaptativo con SCROLL (IntersectionObserver) ---
  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -90% 0px",
      threshold: 0,
    };
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const theme = entry.target.dataset.sectionTheme;
          if (theme === "light") {
            navbar.classList.add("invert-colors");
          } else {
            navbar.classList.remove("invert-colors");
          }
        }
      });
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    sections.forEach((section) => {
      observer.observe(section);
    });
  }

  // --- Lógica del MENÚ MÓVIL ---

  // Función para abrir el menú
  function openMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.add("is-active");
    }
    document.documentElement.classList.add("no-scroll");
  }

  // Función para cerrar el menú (reutilizable)
  function closeMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.remove("is-active");
    }
    document.documentElement.classList.remove("no-scroll");
  }

  if (navToggler && mobileNav && closeBtn) {
    // El botón de hamburguesa abre el menú
    navToggler.addEventListener("click", openMobileMenu);

    // El botón de "X" cierra el menú
    closeBtn.addEventListener("click", closeMobileMenu);

    // Cada enlace dentro del menú móvil también lo cerrará.
    if (mobileMenuLinks.length > 0) {
      mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });
    }
  }
});
