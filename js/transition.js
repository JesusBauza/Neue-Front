document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Configuración del Overlay ---
  // Crea el elemento overlay que revelará la nueva página
  const overlay = document.createElement("div");
  overlay.className = "transition-overlay";
  document.body.appendChild(overlay);

  // --- 2. Animación de Entrada de Página ---
  // Al cargar una nueva página, el overlay está cubriendo todo.
  // Le damos un pequeño respiro al navegador y luego añadimos la clase
  // para que se anime y revele el contenido.
  setTimeout(() => {
    overlay.classList.add("is-revealing");
  }, 100); // 100ms de retraso para asegurar que el renderizado inicial haya ocurrido

  // --- 3. Animación de Salida de Página ---
  // Selecciona el contenedor principal que animaremos al salir
  const mainContainer = document.querySelector("main");
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Aplicamos la transición solo a enlaces internos que no abren en una nueva pestaña
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      target !== "_blank"
    ) {
      link.addEventListener("click", function (event) {
        // Prevenimos la navegación inmediata
        event.preventDefault();

        // Si hay un contenedor principal, le aplicamos la animación de salida
        if (mainContainer) {
          mainContainer.classList.add("is-exiting");
        }

        // Esperamos a que la animación de salida termine para navegar
        setTimeout(() => {
          window.location = href;
        }, 500); // Esta duración DEBE coincidir con la duración de la animación 'page-exit'
      });
    }
  });
});
