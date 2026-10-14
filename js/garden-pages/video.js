export function initGardenVideos() {
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
}
