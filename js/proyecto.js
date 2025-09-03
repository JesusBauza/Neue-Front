/* // ==========================================================================
// Bloque 1: Lógica del Efecto Parallax para la Imagen de Cover
// ==========================================================================
window.addEventListener("scroll", function () {
  const coverImage = document.getElementById("project-cover");
  if (!coverImage) return;

  const scrollPosition = window.scrollY;
  const speed = 0.1;
  const translateY = -scrollPosition * speed;
  coverImage.style.transform = `translateY(${translateY}px)`;
});

// ==========================================================================
// Bloque 2: Lógica Principal de la Página de Proyecto
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  // === Selectores de Elementos ===
  const titleEl = document.getElementById("project-title");
  const metaEl = document.getElementById("project-meta");
  const coverEl = document.getElementById("project-cover");
  const infoEl = document.getElementById("project-info");
  const collaboratorsEl = document.getElementById("project-collaborators");
  const galleryEl = document.getElementById("project-gallery");
  const relatedWorksGrid = document.getElementById("related-works-grid");
  const contentContainer =
    document.getElementById("project-content") || document.body;

  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content-scroll");
  const lightboxClose = document.querySelector(".lightbox-close");
  const customCursor = document.getElementById("custom-cursor");

  // === Lógica del Cursor Personalizado (zoom-in) ===
  // (Esta sección fue eliminada según tu petición anterior)

  // === Lógica del Lightbox de Galería Vertical (MODIFICADA) ===
  if (galleryEl && lightbox && lightboxContent && lightboxClose) {
    galleryEl.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();

        // --- INICIO DE LA NUEVA LÓGICA ---

        // 1. Encontrar el índice de la imagen en la que se hizo clic
        const allGalleryImages = Array.from(galleryEl.querySelectorAll("img"));
        const clickedIndex = allGalleryImages.indexOf(e.target);

        // 2. Poblar el lightbox (como antes)
        lightboxContent.innerHTML = "";
        allGalleryImages.forEach((imgNode) => {
          const newImg = document.createElement("img");
          newImg.src = imgNode.src;
          lightboxContent.appendChild(newImg);
        });

        // 3. Mostrar el lightbox y el resto
        lightbox.style.display = "block";
        document.body.classList.add("no-scroll");

        // 4. Hacer scroll hasta la imagen correcta
        const lightboxImages = lightboxContent.querySelectorAll("img");
        if (lightboxImages[clickedIndex]) {
          // Usamos scrollIntoView() para ir directamente a la imagen
          lightboxImages[clickedIndex].scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        }

        // --- FIN DE LA NUEVA LÓGICA ---
      }
    });

    // Función para cerrar el lightbox (sin cambios)
    const closeLightbox = () => {
      lightbox.style.display = "none";
      document.body.classList.remove("no-scroll");
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // === Lógica para Cargar Datos de Strapi (sin cambios) ===
  const params = new URLSearchParams(window.location.search);
  const projectUID = params.get("uid");

  if (!projectUID) {
    contentContainer.innerHTML =
      "<h1>Error: No se ha especificado un proyecto.</h1>";
    return;
  }

  try {
    const projectApiUrl = `https://neue-backend-production.up.railway.app/api/proyectos?filters[Uid][$eq]=${projectUID}&populate=*`;
    const projectResponse = await fetch(projectApiUrl);
    if (!projectResponse.ok)
      throw new Error(
        `Error en la API de proyectos: ${projectResponse.status}`
      );

    const projectData = await projectResponse.json();
    if (projectData.data.length === 0)
      throw new Error("Proyecto no encontrado con ese UID.");

    const project = projectData.data[0];

    // --- RENDERIZAR DATOS PRINCIPALES ---
    titleEl.textContent = project.Titulo;
    const servicesListItems = project.servicios
      .map((service) => `<li>${service.Nombre}</li>`)
      .join("");
    metaEl.innerHTML = `<div class="wrapper_meta"><ul class="services-list">${servicesListItems}</ul><span>${project.Year}</span></div>`;
    coverEl.src = project.Cover.url;
    coverEl.alt = project.Titulo;
    infoEl.innerHTML = renderRichTextToHtml(project.Info);

    collaboratorsEl.innerHTML = "";
    project.Credito.forEach((credit) => {
      const colabDiv = document.createElement("div");
      colabDiv.className = "collaborator";
      const professions = [
        credit.Profesion1,
        credit.Profesion2,
        credit.Profesion3,
        credit.Profesion4,
      ].filter((p) => p);
      colabDiv.innerHTML = `<div class="wrapper_creditos"><span class="collaborator-name">${
        credit.Nombre
      }</span><span class="collaborator-profession">${professions.join(
        ", "
      )}</span></div>`;
      collaboratorsEl.appendChild(colabDiv);
    });

    galleryEl.innerHTML = "";
    project.Media.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.url;
      img.alt = image.alternativeText || project.Titulo;
      galleryEl.appendChild(img);
    });

    // --- LLAMADA 2: OBTENER LOS TRABAJOS RELACIONADOS ---
    if (project.related_works && project.related_works.length > 0) {
      const relatedIds = project.related_works.map((work) => work.id);
      const idFilters = relatedIds
        .map((id, index) => `filters[id][$in][${index}]=${id}`)
        .join("&");
      const relatedApiUrl = `https://neue-backend-production.up.railway.app/api/proyectos?${idFilters}&populate=*`;
      const relatedResponse = await fetch(relatedApiUrl);
      if (!relatedResponse.ok)
        throw new Error(
          `Error en la API de trabajos relacionados: ${relatedResponse.status}`
        );
      const relatedData = await relatedResponse.json();

      relatedWorksGrid.innerHTML = "";
      relatedData.data.forEach((relatedWork) => {
        const cardLink = document.createElement("a");
        cardLink.href = `proyecto.html?uid=${relatedWork.Uid}`;
        cardLink.className = "related-card";
        const imageUrl = relatedWork.Home_Cover
          ? relatedWork.Home_Cover.url
          : "";
        const title = relatedWork.Titulo;
        const category = relatedWork.categoria
          ? relatedWork.categoria.Nombre
          : "";
        cardLink.innerHTML = `<img src="${imageUrl}" alt="${title}"><div class="related-card-info"><span>${title}</span><span>${category}</span></div>`;
        relatedWorksGrid.appendChild(cardLink);
      });
    }
  } catch (error) {
    console.error("Error al cargar el proyecto:", error);
    contentContainer.innerHTML = `<h1>Proyecto no encontrado</h1><p>${error.message}</p>`;
  }

  // --- Definiciones de las funciones de Rich Text ---
  function renderRichTextToHtml(blocks) {
    if (!blocks) return "";
    let html = "";
    blocks.forEach((block) => {
      switch (block.type) {
        case "paragraph":
          html += `<p>${renderTextChildren(block.children)}</p>`;
          break;
        case "heading":
          html += `<h${block.level}>${renderTextChildren(block.children)}</h${
            block.level
          }>`;
          break;
        case "list":
          const listTag = block.format === "ordered" ? "ol" : "ul";
          html += `<${listTag}>`;
          block.children.forEach((listItem) => {
            html += `<li>${renderTextChildren(listItem.children)}</li>`;
          });
          html += `</${listTag}>`;
          break;
        default:
          html += `<p>${renderTextChildren(block.children)}</p>`;
      }
    });
    return html;
  }
  function renderTextChildren(children) {
    if (!children) return "";
    let text = "";
    children.forEach((child) => {
      if (child.type === "link") {
        text += `<a href="${
          child.url
        }" target="_blank" rel="noopener noreferrer">${renderTextChildren(
          child.children
        )}</a>`;
      } else {
        let piece = child.text;
        if (child.bold) piece = `<strong>${piece}</strong>`;
        if (child.italic) piece = `<em>${piece}</em>`;
        if (child.underline) piece = `<u>${piece}</u>`;
        text += piece;
      }
    });
    return text;
  }
});
 */

// ==========================================================================
// Bloque 1: Lógica del Efecto Parallax para la Imagen de Cover
// ==========================================================================
window.addEventListener("scroll", function () {
  const coverImage = document.getElementById("project-cover");
  if (!coverImage) return;

  const scrollPosition = window.scrollY;
  const speed = 0.1;
  const translateY = -scrollPosition * speed;
  coverImage.style.transform = `translateY(${translateY}px)`;
});

// ==========================================================================
// Bloque 2: Lógica Principal de la Página de Proyecto
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  // === Selectores de Elementos ===
  const titleEl = document.getElementById("project-title");
  const metaEl = document.getElementById("project-meta");
  const coverEl = document.getElementById("project-cover");
  const infoEl = document.getElementById("project-info");
  const collaboratorsEl = document.getElementById("project-collaborators");
  const galleryEl = document.getElementById("project-gallery");
  const relatedWorksGrid = document.getElementById("related-works-grid");
  const contentContainer =
    document.getElementById("project-content") || document.body;
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = document.getElementById("lightbox-content-scroll");
  const lightboxClose = document.querySelector(".lightbox-close");

  // === Lógica del Lightbox de Galería Vertical ===
  if (galleryEl && lightbox && lightboxContent && lightboxClose) {
    galleryEl.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
        const allGalleryImages = Array.from(galleryEl.querySelectorAll("img"));
        const clickedIndex = allGalleryImages.indexOf(e.target);

        lightboxContent.innerHTML = "";
        allGalleryImages.forEach((imgNode) => {
          const newImg = document.createElement("img");
          newImg.src = imgNode.src;
          lightboxContent.appendChild(newImg);
        });

        lightbox.style.display = "block";
        document.body.classList.add("no-scroll");

        const lightboxImages = lightboxContent.querySelectorAll("img");
        if (lightboxImages[clickedIndex]) {
          lightboxImages[clickedIndex].scrollIntoView({
            behavior: "auto",
            block: "start",
          });
        }
      }
    });

    const closeLightbox = () => {
      lightbox.style.display = "none";
      document.body.classList.remove("no-scroll");
    };
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // ▼▼▼ AQUÍ ESTÁ LA MODIFICACIÓN ▼▼▼
  // === Lógica para Cargar Datos de Strapi desde la RUTA AMIGABLE ===
  const path = window.location.pathname; // ej: "/proyecto/eduardo-carvajal"
  const pathParts = path.split("/"); // -> ["", "proyecto", "eduardo-carvajal"]
  const projectUID = pathParts[pathParts.length - 1]; // -> "eduardo-carvajal"

  if (!projectUID) {
    contentContainer.innerHTML =
      "<h1>Error: No se ha especificado un proyecto.</h1>";
    return;
  }

  try {
    const projectApiUrl = `https://neue-backend-production.up.railway.app/api/proyectos?filters[Uid][$eq]=${projectUID}&populate=*`;
    const projectResponse = await fetch(projectApiUrl);
    if (!projectResponse.ok)
      throw new Error(
        `Error en la API de proyectos: ${projectResponse.status}`
      );

    const projectData = await projectResponse.json();
    if (projectData.data.length === 0)
      throw new Error("Proyecto no encontrado con ese UID.");

    const project = projectData.data[0];

    // --- RENDERIZAR DATOS PRINCIPALES ---
    titleEl.textContent = project.Titulo;
    const servicesListItems = project.servicios
      .map((service) => `<li>${service.Nombre}</li>`)
      .join("");
    metaEl.innerHTML = `<div class="wrapper_meta"><ul class="services-list">${servicesListItems}</ul><span>${project.Year}</span></div>`;
    coverEl.src = project.Cover.url;
    coverEl.alt = project.Titulo;
    infoEl.innerHTML = renderRichTextToHtml(project.Info);

    collaboratorsEl.innerHTML = "";
    project.Credito.forEach((credit) => {
      const colabDiv = document.createElement("div");
      colabDiv.className = "collaborator";
      const professions = [
        credit.Profesion1,
        credit.Profesion2,
        credit.Profesion3,
        credit.Profesion4,
      ].filter((p) => p);
      colabDiv.innerHTML = `<div class="wrapper_creditos"><span class="collaborator-name">${
        credit.Nombre
      }</span><span class="collaborator-profession">${professions.join(
        ", "
      )}</span></div>`;
      collaboratorsEl.appendChild(colabDiv);
    });

    galleryEl.innerHTML = "";
    project.Media.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.url;
      img.alt = image.alternativeText || project.Titulo;
      galleryEl.appendChild(img);
    });

    // --- LLAMADA 2: OBTENER LOS TRABAJOS RELACIONADOS (MODIFICADO) ---
    if (project.related_works && project.related_works.length > 0) {
      const relatedIds = project.related_works.map((work) => work.id);
      const idFilters = relatedIds
        .map((id, index) => `filters[id][$in][${index}]=${id}`)
        .join("&");
      const relatedApiUrl = `https://neue-backend-production.up.railway.app/api/proyectos?${idFilters}&populate=*`;
      const relatedResponse = await fetch(relatedApiUrl);
      if (!relatedResponse.ok)
        throw new Error(
          `Error en la API de trabajos relacionados: ${relatedResponse.status}`
        );

      const relatedData = await relatedResponse.json();

      relatedWorksGrid.innerHTML = "";
      relatedData.data.forEach((relatedWork) => {
        const cardLink = document.createElement("a");
        cardLink.href = `/proyecto/${relatedWork.Uid}`; // Apunta a la URL amigable
        cardLink.className = "related-card"; // Mantén la clase actual
        const imageUrl = relatedWork.Home_Cover
          ? relatedWork.Home_Cover.url
          : "";
        const title = relatedWork.Titulo;
        const category = relatedWork.categoria
          ? relatedWork.categoria.Nombre
          : "";

        // ▼▼▼ MODIFICACIÓN PARA EL ROLLING TEXT ▼▼▼
        cardLink.innerHTML = `
            <img src="${imageUrl}" alt="${title}">
            <div class="related-card-info">
                <span>${title}</span>
                <div class="category-container">
                    <span class="category-original">${category}</span>
                    <span class="category-hover">View Details</span>
                </div>
            </div>
        `;

        // Añadir listeners para el efecto hover
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
        // ▲▲▲ FIN DE LA MODIFICACIÓN ▲▲▲

        relatedWorksGrid.appendChild(cardLink);
      });
    }
  } catch (error) {
    console.error("Error al cargar el proyecto:", error);
    contentContainer.innerHTML = `<h1>Proyecto no encontrado</h1><p>${error.message}</p>`;
  }

  // --- Definiciones de las funciones de Rich Text ---
  function renderRichTextToHtml(blocks) {
    if (!blocks) return "";
    let html = "";
    blocks.forEach((block) => {
      switch (block.type) {
        case "paragraph":
          html += `<p>${renderTextChildren(block.children)}</p>`;
          break;
        case "heading":
          html += `<h${block.level}>${renderTextChildren(block.children)}</h${
            block.level
          }>`;
          break;
        case "list":
          const listTag = block.format === "ordered" ? "ol" : "ul";
          html += `<${listTag}>`;
          block.children.forEach((listItem) => {
            html += `<li>${renderTextChildren(listItem.children)}</li>`;
          });
          html += `</${listTag}>`;
          break;
        default:
          html += `<p>${renderTextChildren(block.children)}</p>`;
      }
    });
    return html;
  }
  function renderTextChildren(children) {
    if (!children) return "";
    let text = "";
    children.forEach((child) => {
      if (child.type === "link") {
        text += `<a href="${
          child.url
        }" target="_blank" rel="noopener noreferrer">${renderTextChildren(
          child.children
        )}</a>`;
      } else {
        let piece = child.text;
        if (child.bold) piece = `<strong>${piece}</strong>`;
        if (child.italic) piece = `<em>${piece}</em>`;
        if (child.underline) piece = `<u>${piece}</u>`;
        text += piece;
      }
    });
    return text;
  }
});
