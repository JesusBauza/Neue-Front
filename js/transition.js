document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE ENTRADA ---
  // Cuando la página carga, buscamos la capa de entrada.
  const transitionIn = document.querySelector(".page-transition-in");
  if (transitionIn) {
    // Después de 1 segundo (la duración de la animación + un margen),
    // la ocultamos para que no interfiera con la página.
    setTimeout(function () {
      transitionIn.style.display = "none";
    }, 1000);
  }

  // --- LÓGICA DE SALIDA (AUTOMATIZADA) ---
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Verificamos que sea un enlace interno y no especial (mailto, tel, etc.)
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      link.target !== "_blank"
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault(); // Prevenimos la navegación inmediata.

        // Creamos la capa de transición de salida dinámicamente.
        const transitionOut = document.createElement("div");
        transitionOut.className = "page-transition-out";
        document.body.appendChild(transitionOut);

        // Forzamos un pequeño retraso para que el navegador aplique el estilo inicial.
        setTimeout(() => {
          // Movemos la capa a su posición final (cubriendo la pantalla).
          transitionOut.style.transform = "translateY(0)";
        }, 10);

        // Esperamos a que la animación termine para navegar a la nueva página.
        setTimeout(() => {
          window.location.href = href;
        }, 800); // Coincide con la duración de la transición en el CSS.
      });
    }
  });
});
