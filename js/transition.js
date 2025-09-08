document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE ENTRADA ---
  // Esta parte se encarga de la animación cuando llegas a una página nueva.
  const transitionIn = document.querySelector(".page-transition-in");
  if (transitionIn) {
    // Después de que la animación de 0.8s termina, ocultamos la capa
    // para que no interfiera con los clics en la página.
    setTimeout(function () {
      transitionIn.style.display = "none";
    }, 1000); // 1 segundo para dar un pequeño margen.
  }

  // --- LÓGICA DE SALIDA ---
  // Esta parte se encarga de la animación cuando haces clic en un enlace para irte.
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Nos aseguramos de que sea un enlace interno y no uno especial (mailto, #, etc.)
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      link.target !== "_blank"
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault(); // Detenemos la navegación inmediata.

        // 1. Creamos la capa blanca de salida dinámicamente.
        const transitionOut = document.createElement("div");
        transitionOut.className = "page-transition-out";
        document.body.appendChild(transitionOut);

        // 2. Un pequeño retraso para que el navegador la dibuje antes de animarla.
        setTimeout(() => {
          // 3. Activamos la animación para que suba y cubra la pantalla.
          transitionOut.style.transform = "translateY(0)";
        }, 10);

        // 4. Esperamos a que la animación termine para cambiar de página.
        setTimeout(() => {
          window.location.href = href;
        }, 800); // Esta duración coincide con la del CSS.
      });
    }
  });
});
