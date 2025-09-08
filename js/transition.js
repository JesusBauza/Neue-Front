document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Lógica de ENTRADA de Página ---
  // Al cargar cualquier página, creamos el overlay.
  const overlay = document.createElement("div");
  overlay.className = "transition-overlay";
  document.body.prepend(overlay);

  // Forzamos al navegador a que aplique el estilo inicial antes de animar.
  // Esto evita que la animación de entrada se ejecute al instante.
  requestAnimationFrame(() => {
    // Tras un pequeño instante, añadimos la clase 'reveal' para que el
    // overlay se anime y desaparezca, mostrando el contenido de la página.
    overlay.classList.add("reveal");
  });

  // --- 2. Lógica de SALIDA de Página ---
  const allLinks = document.querySelectorAll("a");
  const mainContainer = document.querySelector("main");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Solo aplicamos la transición a enlaces internos que no se abren en nueva pestaña.
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      target !== "_blank" &&
      new URL(href, window.location.origin).origin === window.location.origin
    ) {
      link.addEventListener("click", function (event) {
        // Prevenimos la navegación inmediata.
        event.preventDefault();

        // 1. Animamos la salida del contenido actual.
        if (mainContainer) {
          mainContainer.classList.add("page-exit-animation");
        }

        // 2. Esperamos a que la animación de salida termine.
        setTimeout(() => {
          // 3. Navegamos a la nueva página de forma tradicional.
          window.location.href = href;
        }, 500); // Duración de la animación 'page-out'.
      });
    }
  });
});
