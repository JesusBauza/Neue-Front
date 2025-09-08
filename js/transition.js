// --- Función que activa las animaciones de texto y tarjetas ---
function animatePageContent() {
  if (document.body.classList.contains("no-content-animation")) return;
  // Animar TEXTO con SplitType y GSAP
  // Selecciona todos los elementos de texto comunes que quieres animar.
  // Ajusta estos selectores según la estructura de tus h1, p, etc.
  const textElements = document.querySelectorAll("h1, h2, h3, p, span, li");

  textElements.forEach((el) => {
    // Si el elemento ya tiene contenido dinámico (como el body de proyecto.js)
    // o es parte de un componente que ya anima, puedes añadir exclusiones.
    if (el.classList.contains("no-split-animation")) return;

    // Dividimos el texto en palabras
    const splitText = new SplitType(el, { types: "words, chars" });

    gsap.fromTo(
      splitText.words,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.05, // Retraso escalonado entre palabras
        delay: 0.2, // Pequeño retraso antes de que empiece la animación de texto
      }
    );
  });

  // Animar TARJETAS DE PROYECTO (Staggered Grid)
  // Asegúrate de que los elementos que quieres animar tengan la clase 'stagger-item'
  const staggerItems = document.querySelectorAll(".stagger-item");
  if (staggerItems.length > 0) {
    gsap.fromTo(
      staggerItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1, // Retraso escalonado entre cada tarjeta
        delay: 0.4, // Retraso antes de que empiece la animación de tarjetas
      }
    );
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE ENTRADA (Esta parte ahora dispara las animaciones de contenido) ---
  const transitionIn = document.querySelector(".page-transition-in");
  if (transitionIn) {
    setTimeout(() => {
      transitionIn.style.display = "none";
      // ¡Ahora, después de que la capa se oculta, activamos las animaciones!
      animatePageContent();
    }, 1000);
  } else {
    // Si no hay capa de entrada (ej. carga directa a la página, no desde un enlace),
    // también disparamos las animaciones.
    animatePageContent();
  }

  // --- LÓGICA DE SALIDA (Esta parte no cambia) ---
  document.body.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    const isInternalLink =
      href &&
      !href.startsWith("http") &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      link.target !== "_blank";

    if (isInternalLink) {
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
    }
  });
});
