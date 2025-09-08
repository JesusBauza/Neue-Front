document.addEventListener("DOMContentLoaded", () => {
  // --- Interceptor de Clics ---
  // Escucha todos los clics en el documento.
  window.addEventListener("click", (event) => {
    // Busca el enlace <a> más cercano al elemento clickeado.
    const link = event.target.closest("a");

    // Si no es un enlace válido o es para una nueva pestaña, no hacemos nada.
    if (
      !link ||
      link.target === "_blank" ||
      link.getAttribute("href")?.startsWith("#")
    )
      return;

    const currentUrl = new URL(window.location);
    const targetUrl = new URL(link.href);

    // Si el enlace apunta a un dominio diferente, dejamos que el navegador lo maneje.
    if (currentUrl.origin !== targetUrl.origin) return;

    // Prevenimos la navegación por defecto del navegador.
    event.preventDefault();

    // Iniciamos la transición.
    navigate(link.href);
  });

  /**
   * --- Función de Navegación con View Transitions API ---
   * @param {string} url - La URL de la página a la que queremos navegar.
   */
  function navigate(url) {
    // 1. Inicia la transición. El navegador toma una "foto" del estado actual.
    // Esta función devuelve un objeto (transition) con promesas.
    const transition = document.startViewTransition(async () => {
      try {
        // 2. Cargamos el contenido de la nueva página.
        const response = await fetch(url);
        const text = await response.text();

        // 3. Usamos DOMParser para convertir el texto HTML en un documento manipulable.
        // Esto es mucho más eficiente que usar innerHTML en un div temporal.
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // 4. Reemplazamos el contenido del body y el título de la página actual
        // con el contenido de la página nueva.
        document.body.innerHTML = doc.body.innerHTML;
        document.title = doc.title;

        // Opcional: Re-ejecutar scripts si es necesario.
        // Por la estructura de tus scripts (defer), el navegador debería
        // ejecutar los nuevos scripts del body recién insertado.
      } catch (error) {
        console.error("Error al cargar la página:", error);
        // Si falla, navegamos de la forma tradicional.
        window.location.href = url;
      }
    });

    // La View Transitions API está diseñada para manejar todo, pero si necesitas
    // hacer algo cuando la transición termine, puedes usar la promesa `finished`.
    transition.finished.then(() => {
      // console.log("Transición completada!");
    });
  }
});
