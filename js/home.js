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
// Bloque 1: Lógica del Efecto Parallax
// ==========================================================================
window.addEventListener("scroll", function () {
  const scrollPosition = window.scrollY;
  const parallaxCards = document.querySelectorAll(".parallax-card");

  parallaxCards.forEach((card) => {
    const speed = parseFloat(card.dataset.speed) || 0.2;
    const translateY = scrollPosition * speed;
    card.style.transform = `translateY(${translateY}px)`;
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

        // 1. Lógica del Parallax: Asignamos clase y velocidad
        cardLink.className = "project-card parallax-card";
        cardLink.dataset.speed = "0.15";

        // 2. Lógica del Rolling Text: Creamos la estructura HTML necesaria
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

        // 3. Lógica del Rolling Text: Añadimos los eventos de hover
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
