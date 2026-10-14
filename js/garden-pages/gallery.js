export function initGardenGallery() {
  const galleryToggleButtons = document.querySelectorAll(".garden-gallery-toggle");

  galleryToggleButtons.forEach((button) => {
    const gallery = document.getElementById(button.getAttribute("aria-controls"));
    const buttonLabel = button.querySelector("span:first-child");

    if (!gallery || !buttonLabel) {
      return;
    }

    const figures = Array.from(gallery.children).filter((element) => element.tagName === "FIGURE");
    const hasMoreImages = figures.length > 5;
    const fullWidthFigure = !hasMoreImages && figures.length % 2 === 1 ? figures.at(-1) : null;
    const columnsContainer = document.createElement("div");
    const columns = [document.createElement("div"), document.createElement("div")];
    const estimatedColumnHeights = [0, 0];

    columnsContainer.className = "garden-gallery-columns";
    columns.forEach((column) => {
      column.className = "garden-gallery-column";
      columnsContainer.append(column);
    });

    figures.forEach((figure, index) => {
      if (figure === fullWidthFigure) {
        figure.classList.add("garden-gallery-full-width");
        figure.style.setProperty("--gallery-reveal-delay", `${Math.min(index * 24, 192)}ms`);
        return;
      }

      const image = figure.querySelector("img");
      const imageWidth = Number(image?.getAttribute("width")) || 1;
      const imageHeight = Number(image?.getAttribute("height")) || imageWidth;
      const targetColumn = index === 0 || estimatedColumnHeights[0] <= estimatedColumnHeights[1] ? 0 : 1;

      figure.style.setProperty("--gallery-reveal-delay", `${Math.min(index * 24, 192)}ms`);
      columns[targetColumn].append(figure);
      estimatedColumnHeights[targetColumn] += imageHeight / imageWidth;
    });

    if (fullWidthFigure) {
      columnsContainer.append(fullWidthFigure);
    }

    gallery.insertBefore(columnsContainer, button);
    gallery.classList.add("is-layout-ready");
    gallery.classList.toggle("has-no-overflow", !hasMoreImages);
    button.hidden = !hasMoreImages;

    const syncExpandedHeight = () => {
      gallery.style.setProperty("--gallery-expanded-height", `${Math.ceil(columnsContainer.scrollHeight)}px`);
    };

    requestAnimationFrame(syncExpandedHeight);
    window.addEventListener("load", syncExpandedHeight, { once: true });

    if ("ResizeObserver" in window) {
      const galleryResizeObserver = new ResizeObserver(syncExpandedHeight);
      galleryResizeObserver.observe(columnsContainer);
    }

    let openingAnimationTimer;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      syncExpandedHeight();
      button.setAttribute("aria-expanded", String(!isExpanded));
      gallery.classList.toggle("is-expanded", !isExpanded);
      buttonLabel.textContent = isExpanded ? "Tümünü Gör" : "Daha Az Göster";

      clearTimeout(openingAnimationTimer);
      gallery.classList.remove("is-opening");

      if (!isExpanded) {
        requestAnimationFrame(() => gallery.classList.add("is-opening"));
        openingAnimationTimer = window.setTimeout(() => gallery.classList.remove("is-opening"), 800);
      }
    });
  });
}
