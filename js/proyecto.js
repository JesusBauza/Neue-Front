/* document.addEventListener("DOMContentLoaded", async () => {
  // === Bloque 1: Obtener UID y seleccionar elementos ===
  const params = new URLSearchParams(window.location.search);
  const projectUID = params.get("uid");

  const titleEl = document.getElementById("project-title");
  const metaEl = document.getElementById("project-meta");
  const coverEl = document.getElementById("project-cover");
  const infoEl = document.getElementById("project-info");
  const collaboratorsEl = document.getElementById("project-collaborators");
  const galleryEl = document.getElementById("project-gallery");
  const contentContainer =
    document.getElementById("project-content") || document.body;

  if (!projectUID) {
    contentContainer.innerHTML =
      "<h1>Error: No se ha especificado un proyecto.</h1>";
    return;
  }

  // === Bloque 2: Funciones para renderizar (sin cambios) ===
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

  // === Bloque 3: Lógica principal con una sola llamada a la API ===
  try {
    // Usamos populate=* porque es simple y ahora contiene toda la información que necesitamos.
    const apiUrl = `http://localhost:1337/api/proyectos?filters[Uid][$eq]=${projectUID}&populate=*`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error en la API: ${response.status}`);

    const projectData = await response.json();
    if (projectData.data.length === 0)
      throw new Error("Proyecto no encontrado con ese UID.");

    const project = projectData.data[0];

    // --- RENDERIZAR TODO EN EL HTML ---
    titleEl.textContent = project.Titulo;
    const servicesListItems = project.servicios
      .map((service) => `<li>${service.Nombre}</li>`)
      .join("");
    metaEl.innerHTML = `<div class="wrapper_meta">
                            <ul class="services-list">${servicesListItems}</ul>

                            <span>${project.Year}</span>
                        </div>`;
    coverEl.src = project.Cover.url;
    coverEl.alt = project.Titulo;
    infoEl.innerHTML = renderRichTextToHtml(project.Info);

    // ▼▼▼ LÓGICA SIMPLIFICADA PARA LOS COLABORADORES ▼▼▼
    collaboratorsEl.innerHTML = "";
    // El campo ahora se llama "Credito" (singular) según tu JSON
    project.Credito.forEach((credit) => {
      const colabDiv = document.createElement("div");
      colabDiv.className = "collaborator";

      // Creamos un array con las profesiones que no sean nulas
      const professions = [
        credit.Profesion1,
        credit.Profesion2,
        credit.Profesion3,
        credit.Profesion4,
      ].filter((p) => p !== null); // Filtramos para quitar los valores nulos

      const professionNames = professions.join(", ");

      colabDiv.innerHTML = `
              <div class="wrapper_creditos">
                <span class="collaborator-name">${credit.Nombre}</span>
                <span class="collaborator-profession">${professionNames}</span>
              </div>
            `;
      collaboratorsEl.appendChild(colabDiv);
    });

    // Renderizar Galería
    galleryEl.innerHTML = "";
    project.Media.forEach((image) => {
      const img = document.createElement("img");
      img.src = image.url;
      img.alt = image.alternativeText || project.Titulo;
      galleryEl.appendChild(img);
    });
  } catch (error) {
    console.error("Error al cargar el proyecto:", error);
    contentContainer.innerHTML = `<h1>Proyecto no encontrado</h1><p>${error.message}</p>`;
  }
});
 */

document.addEventListener("DOMContentLoaded", async () => {
  // === Bloque 1: Obtener UID y seleccionar elementos ===
  const params = new URLSearchParams(window.location.search);
  const projectUID = params.get("uid");

  const titleEl = document.getElementById("project-title");
  const metaEl = document.getElementById("project-meta");
  const coverEl = document.getElementById("project-cover");
  const infoEl = document.getElementById("project-info");
  const collaboratorsEl = document.getElementById("project-collaborators");
  const galleryEl = document.getElementById("project-gallery");
  const relatedWorksGrid = document.getElementById("related-works-grid");
  const contentContainer =
    document.getElementById("project-content") || document.body;

  if (!projectUID) {
    contentContainer.innerHTML =
      "<h1>Error: No se ha especificado un proyecto.</h1>";
    return;
  }

  // === Bloque 2: Funciones para renderizar (sin cambios) ===
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

  // === Bloque 3: Lógica principal ===
  try {
    // --- LLAMADA 1: OBTENER EL PROYECTO ---
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
    metaEl.innerHTML = `<div class="wrapper_meta">
                            <ul class="services-list">${servicesListItems}</ul>

                            <span>${project.Year}</span>
                        </div>`;
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
      const professionNames = professions.join(", ");
      colabDiv.innerHTML = `<div class="wrapper_creditos">
                              <span class="collaborator-name">${credit.Nombre}</span>
                              <span class="collaborator-profession">${professionNames}</span>
                            </div>`;
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

      // ▼▼▼ CAMBIO CLAVE: Usamos populate=* también aquí ▼▼▼
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

        cardLink.innerHTML = `
                  <img src="${imageUrl}" alt="${title}">
                  <div class="related-card-info">
                    <span>${title}</span>
                    <span>${category}</span>
                  </div>
                `;
        relatedWorksGrid.appendChild(cardLink);
      });
    }
  } catch (error) {
    console.error("Error al cargar el proyecto:", error);
    contentContainer.innerHTML = `<h1>Proyecto no encontrado</h1><p>${error.message}</p>`;
  }
});
