document.addEventListener("DOMContentLoaded", () => {
  const imgContainer = document.querySelector(".image");

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
  const menuToggle = document.querySelector(".menu-toggle");
  const slideMenu = document.querySelector(".slide-menu");
  const menuOverlay = document.querySelector(".menu-overlay");
  const fullscreenOverlay = document.querySelector(".fullscreen-overlay");

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
});
