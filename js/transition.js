document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE ENTRADA (sin cambios) ---
  const transitionIn = document.querySelector(".page-transition-in");
  if (transitionIn) {
    setTimeout(() => {
      transitionIn.style.display = "none";
    }, 1000);
  }

  // --- LÓGICA DE SALIDA (con la corrección) ---
  const allLinks = document.querySelectorAll("a");

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return; // Ignorar enlaces sin href

    // --- ¡AQUÍ ESTÁ LA MODIFICACIÓN CLAVE! ---
    // Verificamos si es un enlace interno. Ahora es más flexible.
    // Considera cualquier enlace relativo (que no empieza con http) como interno.
    const isInternalLink =
      !href.startsWith("http") &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      link.target !== "_blank";

    if (isInternalLink) {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        const transitionOut = document.createElement("div");
        transitionOut.className = "page-transition-out";
        document.body.appendChild(transitionOut);

        setTimeout(() => {
          transitionOut.style.transform = "translateY(0)";
        }, 10);

        setTimeout(() => {
          window.location.href = href;
        }, 800);
      });
    }
  });
});
