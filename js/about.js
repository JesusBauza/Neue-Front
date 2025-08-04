/* document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://neue-backend-production.up.railway.app/api/about";
    const textElement = document.getElementById("about-text");

    // --- Funciones para procesar Rich Text (sin cambios) ---
    function renderRichTextToHtml(blocks) {
        let html = "";
        blocks.forEach((block) => {
            switch (block.type) {
                case "paragraph": html += `<p>${renderTextChildren(block.children)}</p>`; break;
                case "heading": html += `<h${block.level}>${renderTextChildren(block.children)}</h${block.level}>`; break;
                case "list":
                    const listTag = block.format === "ordered" ? "ol" : "ul";
                    html += `<${listTag}>`;
                    block.children.forEach((listItem) => { html += `<li>${renderTextChildren(listItem.children)}</li>`; });
                    html += `</${listTag}>`;
                    break;
                default: html += `<p>${renderTextChildren(block.children)}</p>`;
            }
        });
        return html;
    }

    function renderTextChildren(children) {
        let text = "";
        children.forEach((child) => {
            if (child.type === "link") {
                text += `<a href="${child.url}" target="_blank" rel="noopener noreferrer">${renderTextChildren(child.children)}</a>`;
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

    // --- Lógica principal para obtener y mostrar datos ---
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

            // ▼▼▼ INICIO DEL CÓDIGO INTEGRADO PARA EL EFECTO HOVER ▼▼▼
            // Este código se ejecuta DESPUÉS de que el contenido se ha insertado en la página.
            const emailLinks = textElement.querySelectorAll('a[href^="mailto:"]');
            
            emailLinks.forEach(emailLink => {
                const parentParagraph = emailLink.closest('p');
                if (parentParagraph && parentParagraph.textContent.includes("Let's talk.")) {
                    parentParagraph.innerHTML = parentParagraph.innerHTML.replace(
                        "Let's talk.",
                        '<span class="highlight-target">Let\'s talk.</span>'
                    );

                    const targetSpan = parentParagraph.querySelector('.highlight-target');
                    // Volvemos a encontrar el enlace dentro del párrafo actualizado
                    const freshEmailLink = parentParagraph.querySelector('a[href^="mailto:"]');

                    if (targetSpan && freshEmailLink) {
                        freshEmailLink.addEventListener('mouseover', () => {
                            targetSpan.classList.add('highlighted');
                        });

                        freshEmailLink.addEventListener('mouseout', () => {
                            targetSpan.classList.remove('highlighted');
                        });
                    }
                }
            });
            // ▲▲▲ FIN DEL CÓDIGO INTEGRADO ▲▲▲
        })
        .catch((error) => {
            console.error("Hubo un problema al obtener los datos:", error);
            if (textElement) {
                textElement.textContent = "Error al cargar el contenido.";
            }
        });
}); */

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://neue-backend-production.up.railway.app/api/about";
  const textElement = document.getElementById("about-text");

  /**
   * Convierte el array de bloques JSON de Strapi en HTML.
   */
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

  /**
   * Procesa los hijos de un bloque (texto, formatos y enlaces).
   */
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

  // --- Lógica principal ---
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Error de red: ${response.status}`);
      return response.json();
    })
    .then((apiData) => {
      if (!apiData.data) {
        textElement.textContent = "Contenido no disponible.";
        return;
      }

      const aboutContent = apiData.data;
      const contentHtml = renderRichTextToHtml(aboutContent.Texto);
      textElement.innerHTML = contentHtml;

      // --- Lógica para el efecto de hover ---
      // Se ejecuta después de que el contenido se ha insertado en la página.
      const emailLinks = textElement.querySelectorAll('a[href^="mailto:"]');

      emailLinks.forEach((emailLink) => {
        const parentParagraph = emailLink.closest("p");
        // Buscamos el texto con el apóstrofo tipográfico correcto ’
        if (
          parentParagraph &&
          parentParagraph.textContent.includes("Let’s talk.")
        ) {
          parentParagraph.innerHTML = parentParagraph.innerHTML.replace(
            "Let’s talk.",
            '<span class="highlight-target">Let’s talk.</span>'
          );

          const targetSpan = parentParagraph.querySelector(".highlight-target");
          const freshEmailLink =
            parentParagraph.querySelector('a[href^="mailto:"]');

          if (targetSpan && freshEmailLink) {
            freshEmailLink.addEventListener("mouseover", () => {
              targetSpan.classList.add("highlighted");
            });

            freshEmailLink.addEventListener("mouseout", () => {
              targetSpan.classList.remove("highlighted");
            });
          }
        }
      });
    })
    .catch((error) => {
      console.error("Hubo un problema al obtener los datos:", error);
      if (textElement) {
        textElement.textContent = "Error al cargar el contenido.";
      }
    });
});
