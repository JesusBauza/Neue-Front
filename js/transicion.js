/* js/transitions.js */

document.addEventListener("DOMContentLoaded", () => {
  const transitionOverlay = document.querySelector(".page-transition-overlay");
  const allLinks = document.querySelectorAll("a");

  // --- LÓGICA DE ENTRADA ---
  // Se ejecuta en cuanto la nueva página empieza a cargarse.
  function pageEntrance() {
    if (transitionOverlay) {
      // Forzamos al slide a estar en la posición "activa" (cubriendo la pantalla)
      // sin animación, para que la página nueva ya EMPIECE en blanco.
      transitionOverlay.style.transition = "none";
      transitionOverlay.classList.add("is-active");

      // Usamos un pequeño timeout para asegurar que el navegador aplique el estilo
      // anterior antes de ejecutar la animación de salida del slide.
      setTimeout(() => {
        transitionOverlay.style.transition = ""; // Reactivamos las transiciones
        transitionOverlay.classList.add("is-leaving");
        document.body.classList.add("is-loaded");
      }, 50); // Un pequeño retraso es suficiente
    }
  }

  // Ejecutamos la animación de entrada
  pageEntrance();

  // --- LÓGICA DE SALIDA ---
  // Se ejecuta cuando el usuario hace clic en un enlace.
  allLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      // Ignorar enlaces que no cambian de página
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        this.target === "_blank"
      ) {
        return;
      }

      event.preventDefault(); // Detenemos la navegación

      // Activamos la animación del slide para que cubra la pantalla
      if (transitionOverlay) {
        transitionOverlay.classList.add("is-active");
      }

      // Esperamos a que la animación termine y luego vamos a la nueva página
      setTimeout(() => {
        window.location.href = href;
      }, 7000); // Duración de la animación en CSS
    });
  });

  // Maneja el botón "atrás" del navegador para que las animaciones se repitan
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      // Resetea el estado si la página se carga del caché
      if (transitionOverlay) {
        transitionOverlay.style.transition = "none";
        transitionOverlay.classList.remove("is-active", "is-leaving");
        document.body.classList.remove("is-loaded");
        // Vuelve a ejecutar la animación de entrada
        pageEntrance();
      }
    }
  });
});
