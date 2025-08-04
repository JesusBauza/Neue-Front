/* 
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

    let sectionCounter = 0;

    for (let i = 0; i < data.length; i += 3) {
      const projectsChunk = data.slice(i, i + 3);
      const sectionElement = document.createElement("section");
      const sectionClass =
        sectionCounter % 2 === 0 ? "articles-1" : "articles-2";
      sectionElement.className = sectionClass;

      projectsChunk.forEach((project) => {
        const uid = project.Uid;
        const title = project.Titulo;
        const imageUrl = project.Home_Cover?.url || "";
        const category = project.categoria?.Nombre || "Sin categoría";

        const cardLink = document.createElement("a");
        cardLink.href = `proyecto.html?uid=${uid}`;
        cardLink.className = "project-card";

        // Se añade la nueva estructura para el efecto "rolling text"
        cardLink.innerHTML = `
                    <img src="${imageUrl}" alt="${title}">
                    <div class="project-card-info">
                        <span>${title}</span>
                        <div class="category-container">
                            <span class="category-original">${category}</span>
                            <span class="category-hover">View Details</span>
                        </div>
                    </div>
                `;

        // Se añaden los eventos para activar/desactivar el efecto
        cardLink.addEventListener("mouseover", () => {
          const categoryContainer = cardLink.querySelector(
            ".category-container"
          );
          if (categoryContainer) {
            categoryContainer.classList.add("hovered");
          }
        });

        cardLink.addEventListener("mouseout", () => {
          const categoryContainer = cardLink.querySelector(
            ".category-container"
          );
          if (categoryContainer) {
            categoryContainer.classList.remove("hovered");
          }
        });

        sectionElement.appendChild(cardLink);
      });

      projectsGrid.appendChild(sectionElement);
      sectionCounter++;
    }
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    projectsGrid.innerHTML = "<p>Hubo un error al cargar los proyectos.</p>";
  }
});
 */
// ==========================================================================
// Bloque 1: Lógica del Efecto Parallax para Imágenes
// ==========================================================================
window.addEventListener("scroll", function () {
  const parallaxImages = document.querySelectorAll(".parallax-image");
  const speed = 0.2;

  parallaxImages.forEach((image) => {
    const imageContainer = image.parentElement;
    const rect = imageContainer.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const yPos = (rect.top - window.innerHeight / 2) * -speed;
      image.style.transform = `translateY(${yPos}px)`;
    }
  });
});

// ==========================================================================
// Bloque 2: Lógica para Cargar y Renderizar los Proyectos
// ==========================================================================
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
    let sectionCounter = 0;

    for (let i = 0; i < data.length; i += 3) {
      const projectsChunk = data.slice(i, i + 3);
      const sectionElement = document.createElement("section");
      const sectionClass =
        sectionCounter % 2 === 0 ? "articles-1" : "articles-2";
      sectionElement.className = sectionClass;

      projectsChunk.forEach((project) => {
        const uid = project.Uid;
        const title = project.Titulo;
        const imageUrl = project.Home_Cover?.url || "";
        const category = project.categoria?.Nombre || "Sin categoría";

        const cardLink = document.createElement("a");
        cardLink.href = `proyecto.html?uid=${uid}`;
        cardLink.className = "project-card";

        // Estructura HTML que incluye el parallax de imagen Y el rolling text
        cardLink.innerHTML = `
                    <div class="card-image-container">
                        <img class="parallax-image" src="${imageUrl}" alt="${title}">
                    </div>
                    <div class="project-card-info">
                        <span>${title}</span>
                        <div class="category-container">
                            <span class="category-original">${category}</span>
                            <span class="category-hover">View Details</span>
                        </div>
                    </div>
                `;

        // Lógica de eventos para el "rolling text"
        cardLink.addEventListener("mouseover", () => {
          const categoryContainer = cardLink.querySelector(
            ".category-container"
          );
          if (categoryContainer) {
            categoryContainer.classList.add("hovered");
          }
        });

        cardLink.addEventListener("mouseout", () => {
          const categoryContainer = cardLink.querySelector(
            ".category-container"
          );
          if (categoryContainer) {
            categoryContainer.classList.remove("hovered");
          }
        });

        sectionElement.appendChild(cardLink);
      });

      projectsGrid.appendChild(sectionElement);
      sectionCounter++;
    }
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    projectsGrid.innerHTML = "<p>Hubo un error al cargar los proyectos.</p>";
  }
});
