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

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    button.setAttribute("aria-expanded", String(!isExpanded));
    gallery.classList.toggle("is-expanded", !isExpanded);
    buttonLabel.textContent = isExpanded ? "Tümünü Gör" : "Daha Az Göster";
  });
});
