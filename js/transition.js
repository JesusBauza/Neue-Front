document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE ENTRADA ---
  // Se asegura de que la capa blanca de entrada se oculte después de la animación.
  const transitionIn = document.querySelector(".page-transition-in");
  if (transitionIn) {
    setTimeout(() => {
      transitionIn.style.display = "none";
    }, 1000); // Oculta la capa después de 1s para no bloquear clics.
  }

  // --- LÓGICA DE SALIDA ---
  // Intercepta los clics en todos los enlaces internos.
  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isInternalLink =
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      link.target !== "_blank";

    if (isInternalLink) {
      link.addEventListener("click", function (event) {
        event.preventDefault(); // Previene la navegación instantánea.

        // Crea la capa blanca de salida.
        const transitionOut = document.createElement("div");
        transitionOut.className = "page-transition-out";
        document.body.appendChild(transitionOut);

        // Activa la animación para que la capa cubra la pantalla.
        setTimeout(() => {
          transitionOut.style.transform = "translateY(0)";
        }, 10);

        // Espera a que la animación termine antes de cambiar de página.
        setTimeout(() => {
          window.location.href = href;
        }, 800); // Esta duración coincide con tu CSS.
      });
    }
  });
});
