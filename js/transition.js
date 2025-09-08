document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE ENTRADA (Esta parte no cambia) ---
  const transitionIn = document.querySelector(".page-transition-in");
  if (transitionIn) {
    setTimeout(() => {
      transitionIn.style.display = "none";
    }, 1000);
  }

  // --- LÓGICA DE SALIDA (Ahora es más inteligente) ---

  // En lugar de buscar cada enlace, escuchamos clics en todo el documento.
  document.body.addEventListener("click", function (e) {
    // Verificamos si el elemento clickeado es (o está dentro de) un enlace.
    const link = e.target.closest("a");

    // Si no se hizo clic en un enlace, no hacemos nada.
    if (!link) return;

    const href = link.getAttribute("href");

    // Verificamos si es un enlace válido para la transición.
    const isInternalLink =
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      link.target !== "_blank";

    if (isInternalLink) {
      e.preventDefault(); // Prevenimos la navegación.

      // Creamos y activamos la animación de salida.
      const transitionOut = document.createElement("div");
      transitionOut.className = "page-transition-out";
      document.body.appendChild(transitionOut);

      setTimeout(() => {
        transitionOut.style.transform = "translateY(0)";
      }, 10);

      // Navegamos después de que la animación termine.
      setTimeout(() => {
        window.location.href = href;
      }, 800);
    }
  });
});
