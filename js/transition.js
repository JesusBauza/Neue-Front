document.addEventListener("DOMContentLoaded", () => {
  // --- Configuración Inicial ---
  const body = document.body;

  // Creamos la capa de transición y la añadimos al body.
  const layer = document.createElement("div");
  layer.className = "transition-layer";
  body.prepend(layer);

  // --- 1. Lógica de ENTRADA de Página ---
  // Al cargar, el body tiene la clase 'is-loading' para posicionar
  // los elementos en su estado inicial (contenido abajo, capa visible).
  body.classList.add("is-loading");

  // Usamos window.onload para asegurarnos de que toda la página (imágenes, etc.)
  // esté lista antes de iniciar la animación de entrada.
  window.onload = function () {
    // Quitamos la clase 'is-loading' para que los elementos se animen
    // a su posición final (contenido visible, capa oculta arriba).
    body.classList.remove("is-loading");
  };

  // --- 2. Lógica de SALIDA de Página ---
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    // Aplicamos la transición solo a enlaces internos que no se abren en nueva pestaña.
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      target !== "_blank" &&
      new URL(href, window.location.origin).origin === window.location.origin
    ) {
      link.addEventListener("click", function (event) {
        event.preventDefault();

        // 1. Añadimos la clase 'is-exiting' para que el contenido actual
        // se deslice hacia arriba y la capa cubra la pantalla.
        body.classList.add("is-exiting");

        // 2. Esperamos a que la animación de salida termine.
        setTimeout(() => {
          // 3. Navegamos a la nueva página.
          window.location.href = href;
        }, 600); // Esta duración debe coincidir con la de las transiciones en el CSS.
      });
    }
  });
});
