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
    const imgElement = imgContainer.querySelector("img");
    const randomChars = Math.random().toString(36).substring(2, 7);
    if (imgElement) {
      const link = document.createElement("a");
      link.href = imgElement.src;
      link.download = `frieren-${randomChars}.jpg`;
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
      return response.blob();
    })
    .then((blob) => {
      const imgURL = URL.createObjectURL(blob);
      const imgElement = document.createElement("img");
      imgElement.src = imgURL;
      imgElement.alt = "Random Frieren Art";
      imgContainer.appendChild(imgElement);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      imgContainer.innerHTML = "<p>Failed to load image</p>";
    });
}
