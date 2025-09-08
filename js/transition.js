document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const layer = document.createElement("div");
  layer.className = "transition-layer";
  body.prepend(layer);

  body.classList.add("is-loading");

  window.onload = function () {
    body.classList.remove("is-loading");

    // After the transition time, fire a custom event
    setTimeout(() => {
      const event = new CustomEvent("pageReady");
      document.dispatchEvent(event);
    }, 600); // This must match the CSS transition duration
  };

  const allLinks = document.querySelectorAll("a");
  allLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:") &&
      target !== "_blank" &&
      new URL(href, window.location.origin).origin === window.location.origin
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        body.classList.add("is-exiting");
        setTimeout(() => {
          window.location.href = href;
        }, 600);
      });
    }
  });
});
