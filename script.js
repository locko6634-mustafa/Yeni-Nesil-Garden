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
