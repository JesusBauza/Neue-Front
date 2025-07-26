document.addEventListener("DOMContentLoaded", async () => {
  const projectsGrid = document.getElementById("projects-grid");
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

    projectsGrid.innerHTML = "";

    // --- Lógica de renderizado con el nuevo patrón ---

    // Función auxiliar para crear una tarjeta de proyecto
    function createProjectCard(project) {
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
      return cardLink;
    }

    // --- Paso 1: Manejar la primera sección especial ---
    if (data.length > 0) {
      // Tomamos los primeros 3 proyectos (o los que haya si son menos de 3)
      const firstChunk = data.slice(0, 3);
      const section1 = document.createElement("section");
      section1.className = "articles-1"; // La primera sección siempre es articles-1

      firstChunk.forEach((project) => {
        const card = createProjectCard(project);
        section1.appendChild(card);
      });
      projectsGrid.appendChild(section1);
    }

    // --- Paso 2: Manejar el resto de secciones (todas como articles-2) ---
    if (data.length > 3) {
      const remainingProjects = data.slice(3); // Tomamos los proyectos a partir del 4to
      for (let i = 0; i < remainingProjects.length; i += 3) {
        const chunk = remainingProjects.slice(i, i + 3);

        const section2 = document.createElement("section");
        section2.className = "articles-2"; // Todas las siguientes secciones son articles-2

        chunk.forEach((project) => {
          const card = createProjectCard(project);
          section2.appendChild(card);
        });
        projectsGrid.appendChild(section2);
      }
    }
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    projectsGrid.innerHTML = "<p>Hubo un error al cargar los proyectos.</p>";
  }
});
