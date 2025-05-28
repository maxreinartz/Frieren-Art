document.addEventListener("DOMContentLoaded", () => {
  const imgContainer = document.querySelector(".image");
  const menuToggle = document.querySelector(".menu-toggle");
  const refreshButton = document.querySelector(".refresh");
  const downloadButton = document.querySelector(".download");
  const slideMenu = document.querySelector(".slide-menu");
  const menuOverlay = document.querySelector(".menu-overlay");
  const fullscreenOverlay = document.querySelector(".fullscreen-overlay");

  newImage();

  const lastUpdateElement = document.querySelector(".last-updated");
  fetch("/api/lastUpdate")
    .then((response) => response.json())
    .then((data) => {
      lastUpdateElement.textContent = `Last updated: ${data.lastUpdate}`;
    })
    .catch((error) => {
      console.error("Error fetching last update:", error);
      lastUpdateElement.textContent = "Failed to load last update";
    });

  menuToggle.addEventListener("click", () => {
    slideMenu.classList.toggle("show");
    menuOverlay.classList.toggle("show");
  });

  menuOverlay.addEventListener("click", () => {
    slideMenu.classList.remove("show");
    menuOverlay.classList.remove("show");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      slideMenu.classList.remove("show");
      menuOverlay.classList.remove("show");
    }
  });

  imgContainer.addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
      const fullScreenImg = document.createElement("img");
      fullScreenImg.src = event.target.src;
      fullScreenImg.style.zIndex = "2";
      fullScreenImg.classList.add("fullscreen");
      document.body.appendChild(fullScreenImg);
      fullscreenOverlay.classList.add("show");

      fullScreenImg.addEventListener("click", () => {
        document.body.removeChild(fullScreenImg);
        fullscreenOverlay.classList.remove("show");
      });
    }
  });

  refreshButton.addEventListener("click", () => {
    newImage();
  });

  downloadButton.addEventListener("click", () => {
    const mediaElement = imgContainer.querySelector(".random-media");
    if (mediaElement) {
      const link = document.createElement("a");
      link.href = mediaElement.src;
      link.download = mediaElement.alt || "downloaded_media";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No image to download");
    }
  });
});

function newImage() {
  const imgContainer = document.querySelector(".image");
  imgContainer.innerHTML = "";
  fetch("/api/img/random")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let mediaElement;
      const isVideo = data.image.endsWith(".mp4");
      if (isVideo) {
        console.log("Recieved video, requesting new image.");
        newImage();
        return;
      } else {
        mediaElement = document.createElement("img");
        mediaElement.src = data.image;
        mediaElement.alt = data.credit.filename || "Random Image";
        mediaElement.classList.add("random-media");
      }
      imgContainer.appendChild(mediaElement);

      const creditElement = document.createElement("p");
      creditElement.innerHTML = `Image By <a href="${data.credit.author_url}" target="_blank" rel="noopener noreferrer">${data.credit.author}</a>, <a href="${data.credit.post_url}" target="_blank" rel="noopener noreferrer">Source</a>`;
      creditElement.classList.add("image-credit");
      imgContainer.appendChild(creditElement);
    })
    .catch((error) => {
      console.error("Error fetching random image:", error);
      imgContainer.innerHTML = "<p>Error loading image</p>";
    });
}
