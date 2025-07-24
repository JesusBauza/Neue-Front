document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://neue-backend-production.up.railway.app/api/about";
  const textElement = document.getElementById("about-text");

  function renderRichTextToHtml(blocks) {
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

  /**
   * Esta función auxiliar ha sido actualizada para reconocer enlaces.
   */
  function renderTextChildren(children) {
    let text = "";
    children.forEach((child) => {
      // ▼▼▼ INICIO DE LA MODIFICACIÓN ▼▼▼
      if (child.type === "link") {
        // Si el hijo es un enlace, crea una etiqueta <a>
        // y procesa el texto del enlace de forma recursiva.
        // target="_blank" abre el enlace en una nueva pestaña.
        text += `<a href="${
          child.url
        }" target="_blank" rel="noopener noreferrer">${renderTextChildren(
          child.children
        )}</a>`;
      } else {
        // Si no es un enlace, aplica el formato de texto normal.
        let piece = child.text;
        if (child.bold) piece = `<strong>${piece}</strong>`;
        if (child.italic) piece = `<em>${piece}</em>`;
        if (child.underline) piece = `<u>${piece}</u>`;
        text += piece;
      }
      // ▲▲▲ FIN DE LA MODIFICACIÓN ▲▲▲
    });
    return text;
  }

  // --- Lógica principal ---
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Error de red: ${response.status}`);
      return response.json();
    })
    .then((apiData) => {
      if (!apiData.data) {
        console.warn("No se encontró contenido publicado para 'About'.");
        textElement.textContent = "Contenido no disponible.";
        return;
      }

      const aboutContent = apiData.data;
      const contentHtml = renderRichTextToHtml(aboutContent.Texto);
      textElement.innerHTML = contentHtml;
    })
    .catch((error) => {
      console.error("Hubo un problema al obtener los datos:", error);
      if (textElement) {
        textElement.textContent = "Error al cargar el contenido.";
      }
    });
});
