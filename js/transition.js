document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  // Creamos la capa de transición y la añadimos al body
  const layer = document.createElement("div");
  layer.className = "transition-layer";
  body.prepend(layer);

  // --- LÓGICA DE ENTRADA (MÁS FIABLE) ---

  // 1. Establecemos el estado inicial de carga.
  body.classList.add("is-loading");

  // 2. Usamos requestAnimationFrame para asegurar que el navegador haya procesado
  //    el estado inicial antes de que empecemos la animación.
  requestAnimationFrame(() => {
    // 3. Inmediatamente después, quitamos la clase. Esto inicia la animación de
    //    entrada sin esperar a que carguen las imágenes o el modelo 3D.
    body.classList.remove("is-loading");
  });

  // 4. Después de que la animación de entrada termine, avisamos a los otros
  //    scripts (como proyecto.js) que la página está lista.
  setTimeout(() => {
    const event = new CustomEvent("pageReady");
    document.dispatchEvent(event);
  }, 600); // Importante: Debe coincidir con la duración de la transición en tu CSS.

  // --- LÓGICA DE SALIDA (SIN CAMBIOS, YA ERA CORRECTA) ---

  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    const isInternalLink =
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      target !== "_blank" &&
      new URL(href, window.location.origin).origin === window.location.origin;

    if (isInternalLink) {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Simplemente añadimos la clase de salida. El CSS se encarga del resto.
        body.classList.add("is-exiting");

        // Esperamos a que la animación de salida termine antes de navegar.
        setTimeout(() => {
          window.location.href = href;
        }, 600); // Debe coincidir con la duración de la transición en tu CSS.
      });
    }
  });
});
