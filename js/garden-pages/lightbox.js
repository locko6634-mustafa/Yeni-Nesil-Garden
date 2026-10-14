export function initGardenLightbox() {
  const galleryImages = document.querySelectorAll(".garden-gallery figure > img");

  if (galleryImages.length === 0) {
    return;
  }

  const lightbox = document.createElement("dialog");
  const lightboxImage = document.createElement("img");
  const closeButton = document.createElement("button");
  let activeTrigger = null;
  let previousBodyOverflow = "";

  lightbox.className = "garden-lightbox";
  lightbox.setAttribute("aria-label", "Galeri görseli");
  lightboxImage.className = "garden-lightbox__image";
  closeButton.className = "garden-lightbox__close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Tam ekran görseli kapat");
  closeButton.innerHTML = '<span aria-hidden="true">×</span>';
  lightbox.append(closeButton, lightboxImage);
  document.body.append(lightbox);

  const openLightbox = (trigger, image) => {
    activeTrigger = trigger;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lightbox.showModal();
  };

  galleryImages.forEach((image) => {
    const trigger = document.createElement("button");

    trigger.className = "garden-gallery-open";
    trigger.type = "button";
    trigger.setAttribute("aria-label", `${image.alt || "Galeri görseli"} — tam ekran aç`);
    image.before(trigger);
    trigger.append(image);
    trigger.addEventListener("click", () => openLightbox(trigger, image));
  });

  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });
  lightbox.addEventListener("close", () => {
    document.body.style.overflow = previousBodyOverflow;
    lightboxImage.removeAttribute("src");
    activeTrigger?.focus();
    activeTrigger = null;
  });
}
