export function initPackages() {
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
}
