/* js/transitions.js */
document.addEventListener("DOMContentLoaded", () => {
  const transitionOverlay = document.querySelector(".page-transition-overlay");

  // --- Animación de ENTRADA a la página ---
  // Inicia las animaciones de salida del overlay y entrada del contenido
  // al cargar la página.
  function pageLoad() {
    // Añade la clase 'is-loaded' al body para que el texto se revele
    document.body.classList.add("is-loaded");
    // Añade la clase 'is-leaving' al overlay para que se deslice hacia fuera
    if (transitionOverlay) {
      transitionOverlay.classList.add("is-leaving");
    }
  }

  // Espera a que todo el contenido (imágenes, etc.) esté cargado
  // para una transición más suave.
  window.addEventListener("load", pageLoad);

  // --- Animación de SALIDA de la página ---
  // Intercepta los clics en los enlaces para activar la transición
  // antes de navegar a la nueva página.
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      // Ignorar enlaces externos, anclas, o con target="_blank"
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        this.target === "_blank"
      ) {
        return;
      }

      // Prevenir la navegación inmediata
      event.preventDefault();

      // Activar el overlay
      if (transitionOverlay) {
        transitionOverlay.classList.add("is-active");
      }

      // Esperar a que la animación del overlay termine y luego navegar
      setTimeout(() => {
        window.location.href = href;
      }, 900); // Un poco más que la duración de la transición en CSS
    });
  });

  // Solución para el botón "atrás" del navegador (pageshow event)
  window.addEventListener("pageshow", function (event) {
    // Si la página se carga desde el caché del navegador (bfcache)
    if (event.persisted && transitionOverlay) {
      // Forzamos la animación de salida del overlay de nuevo
      transitionOverlay.classList.remove("is-active");
      transitionOverlay.classList.add("is-leaving");
    }
  });
});
