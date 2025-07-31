document.addEventListener("DOMContentLoaded", async () => {
  const projectsGrid = document.getElementById("projects-grid");

  // URL de tu API en producción. Asegúrate de que usa https://
  const apiUrl =
    "https://neue-backend-production.up.railway.app/api/proyectos?populate=*";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("No se pudieron cargar los proyectos.");

    const { data } = await response.json();

    if (data.length === 0) {
      projectsGrid.innerHTML = "<p>No hay proyectos para mostrar.</p>";
      return;
    }

    projectsGrid.innerHTML = ""; // Limpiamos el contenedor.

    let sectionCounter = 0; // Contador para alternar las clases.

    // Bucle principal que avanza de 3 en 3.
    for (let i = 0; i < data.length; i += 3) {
      // Tomamos un "trozo" de hasta 3 proyectos.
      const projectsChunk = data.slice(i, i + 3);

      // Creamos el elemento <section> que los agrupará.
      const sectionElement = document.createElement("section");

      // Decidimos la clase basándonos en si el contador es par o impar.
      const sectionClass =
        sectionCounter % 2 === 0 ? "articles-1" : "articles-2";
      sectionElement.className = sectionClass;

      // Llenamos la sección con las tarjetas de los proyectos.
      projectsChunk.forEach((project) => {
        // Asumimos la estructura de tu API sin la capa 'attributes'.
        const uid = project.Uid;
        const title = project.Titulo;
        const imageUrl = project.Home_Cover?.url || "";
        const category = project.categoria?.Nombre || "Sin categoría";

        const cardLink = document.createElement("a");
        cardLink.href = `proyecto.html?uid=${uid}`;
        cardLink.className = "project-card";

        cardLink.innerHTML = `
                    <img src="${imageUrl}" alt="${title}">
                    <div class="project-card-info">
                        <span>${title}</span>
                        <span>${category}</span>
                    </div>
                `;

        // Añadimos la tarjeta a la sección actual.
        sectionElement.appendChild(cardLink);
      });

      // Añadimos la sección completa al contenedor principal.
      projectsGrid.appendChild(sectionElement);

      sectionCounter++; // Incrementamos el contador para la siguiente sección.
    }
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    projectsGrid.innerHTML = "<p>Hubo un error al cargar los proyectos.</p>";
  }
});
