"use strict";

const detailsElements = document.querySelectorAll("details");

detailsElements.forEach((detailsElement) => {
  const summaryElement = detailsElement.querySelector("summary");

  if (!summaryElement) {
    return;
  }

  const syncExpandedState = () => {
    summaryElement.setAttribute("aria-expanded", String(detailsElement.open));
  };

  syncExpandedState();
  detailsElement.addEventListener("toggle", syncExpandedState);
});

const packageMoreButtons = document.querySelectorAll(".package-more");

packageMoreButtons.forEach((button) => {
  const featureList = document.getElementById(button.getAttribute("aria-controls"));
  const buttonLabel = button.querySelector("span:first-child");
  const packageCard = button.closest(".package-card");

  if (!featureList || !buttonLabel || !packageCard) {
    return;
  }

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isExpanded));
    featureList.classList.toggle("is-expanded", !isExpanded);
    packageCard.classList.toggle("is-expanded", !isExpanded);
    buttonLabel.textContent = isExpanded ? "Devamını Göster" : "Daha Az Göster";
  });
});

const galleryToggleButtons = document.querySelectorAll(".garden-gallery-toggle");

galleryToggleButtons.forEach((button) => {
  const gallery = document.getElementById(button.getAttribute("aria-controls"));
  const buttonLabel = button.querySelector("span:first-child");

  if (!gallery || !buttonLabel) {
    return;
  }

  const figures = Array.from(gallery.children).filter((element) => element.tagName === "FIGURE");
  const columnsContainer = document.createElement("div");
  const columns = [document.createElement("div"), document.createElement("div")];
  const estimatedColumnHeights = [0, 0];

  columnsContainer.className = "garden-gallery-columns";
  columns.forEach((column) => {
    column.className = "garden-gallery-column";
    columnsContainer.append(column);
  });

  figures.forEach((figure, index) => {
    const image = figure.querySelector("img");
    const imageWidth = Number(image?.getAttribute("width")) || 1;
    const imageHeight = Number(image?.getAttribute("height")) || imageWidth;
    const targetColumn = index === 0 || estimatedColumnHeights[0] <= estimatedColumnHeights[1] ? 0 : 1;

    figure.style.setProperty("--gallery-reveal-delay", `${Math.min(index * 24, 192)}ms`);
    columns[targetColumn].append(figure);
    estimatedColumnHeights[targetColumn] += imageHeight / imageWidth;
  });

  gallery.insertBefore(columnsContainer, button);
  gallery.classList.add("is-layout-ready");

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

const galleryImages = document.querySelectorAll(".garden-gallery figure > img");

if (galleryImages.length > 0) {
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

const videoCards = document.querySelectorAll(".garden-video-card[data-video-src]");

videoCards.forEach((card) => {
  const video = card.querySelector("video");
  const playButton = card.querySelector(".garden-video-play");
  const videoSource = card.dataset.videoSrc;

  if (!video || !playButton || !videoSource) {
    return;
  }

  playButton.addEventListener("click", async () => {
    if (!video.src) {
      video.src = videoSource;
      video.load();
    }

    playButton.disabled = true;

    try {
      await video.play();
      card.classList.add("is-playing");
      playButton.hidden = true;
    } catch {
      playButton.disabled = false;
      playButton.setAttribute("aria-label", "Video yüklenemedi. Yeniden denemek için tıklayın");
    }
  });

  video.addEventListener("playing", () => {
    card.classList.add("is-playing");
    playButton.hidden = true;
  });
});
