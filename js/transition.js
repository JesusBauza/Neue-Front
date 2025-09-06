// Función para inicializar animaciones en la página cargada
// (Como la animación de entrada de texto que hicimos antes. La dejamos aquí para el futuro).
function initializePageAnimations() {
  // Si estás en la página de un proyecto, podrías llamar a la animación de GSAP aquí.
  // Por ahora, la dejamos vacía o con animaciones generales.
  if (document.querySelector(".hero h1")) {
    const heroText = new SplitType(".hero h1", { types: "chars" });
    gsap.from(heroText.chars, {
      y: 400,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 0.5,
    });
  }
}

// Listener principal para las transiciones de página
// Solo se ejecuta en navegadores que soportan la View Transitions API
if (document.startViewTransition) {
  window.addEventListener("DOMContentLoaded", () => {
    initializePageAnimations(); // Anima la primera página que se carga
  });

  document.body.addEventListener("click", async (event) => {
    const link = event.target.closest("a");

    // Salir si no es un enlace o si es un enlace externo/ancla
    if (
      !link ||
      link.target === "_blank" ||
      link.href.includes("#") ||
      link.protocol !== location.protocol ||
      link.host !== location.host
    ) {
      return;
    }

    event.preventDefault(); // Prevenir la navegación por defecto
    const destinationUrl = link.href;

    // Iniciar la transición
    const transition = document.startViewTransition(async () => {
      const response = await fetch(destinationUrl);
      const text = await response.text();

      // Usamos DOMParser para obtener el contenido del body y el title de la nueva página
      const doc = new DOMParser().parseFromString(text, "text/html");

      document.body.innerHTML = doc.body.innerHTML;
      document.title = doc.title;

      // Re-ejecutar scripts necesarios en la nueva página si es necesario
      // (Por ahora, la recarga del DOM es suficiente para los scripts con 'defer')
    });

    // Cuando la transición esté lista, reiniciamos el scroll y las animaciones
    transition.ready.then(() => {
      window.scrollTo(0, 0);
      initializePageAnimations(); // Anima los elementos de la nueva página
    });
  });
}
