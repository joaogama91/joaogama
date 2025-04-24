 // =============================
// TRANSLATION PT TO EN
// =============================	 
document.getElementById('pt-lang').addEventListener('click', () => {
  setLanguage('pt');
  initializeProjetosLabel()
});

document.getElementById('en-lang').addEventListener('click', () => {
  setLanguage('en');
  initializeProjetosLabel()
});

function setLanguage(lang) {
  localStorage.setItem('language', lang);
  window.location.reload();
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang').forEach(element => {
    const text = element.getAttribute(`data-${lang}`);
    if (!element.classList.contains('toggle-button')) {
      element.textContent = text;
    } else {
      element.setAttribute('title', text);
      element.setAttribute('aria-label', text);
    }
  });
  initializeProjetosLabel()
}

window.onload = () => {
  const language = localStorage.getItem('language') || 'pt';
  applyLanguage(language);
};
	  
// =============================
// Da Interioridade Button MORE TEXT
// =============================	  
// Get references to the button and the div
const toggleButton = document.getElementById('toggleMore');
const contentDiv = document.getElementById('moreText');

// Add an event listener to the button to toggle visibility
toggleButton.addEventListener('click', () => {
	// Toggle visibility of the contentDiv
	if (contentDiv.style.display === 'block') {
		contentDiv.style.display = 'none'; // Show the div
		toggleButton.textContent = '⋮'; // Change button text
	} else {
		contentDiv.style.display = 'block'; // Hide the div
		toggleButton.textContent = '...'; // Change button text
	}
});
  
  // =============================
  // 1. Navegação entre seções
  // =============================
  const secoes = document.querySelectorAll('main section');
  function mostrarSecao(id) {
    secoes.forEach(secao => secao.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  // =============================
  // 2. Toggle Submenu de Projetos
  // =============================
  function toggleSubmenu() {
    const submenu = document.getElementById("submenuProjetos");
    const projetosLink = document.getElementById("projetosLink");
  
    // Toggle submenu visibility
    submenu.classList.toggle("open");
  
    // Determine current language
    const isEnglish = document.documentElement.lang === "en";
    const currentLabel = isEnglish ? projetosLink.dataset.en : projetosLink.dataset.pt;
  
    // Set the correct arrow (▴ for open, ▾ for closed)
    const arrow = submenu.classList.contains("open") ? "▴" : "▾";
  
    // Update display text without breaking language support
    projetosLink.textContent = `${currentLabel} ${arrow}`;
  }
  function toggleSubmenu() {
    const submenu = document.getElementById("submenuProjetos");
    const projetosLink = document.getElementById("projetosLink");
  
    submenu.classList.toggle("open");
  
    const isEnglish = document.documentElement.lang === "en";
    const currentLabel = isEnglish ? projetosLink.dataset.en : projetosLink.dataset.pt;
  
    const arrow = submenu.classList.contains("open") ? "▴" : "▾";
    projetosLink.textContent = `${currentLabel} ${arrow}`;
  }
  
  // ✅ Add this function right below
  function initializeProjetosLabel() {
    const projetosLink = document.getElementById("projetosLink");
    const submenu = document.getElementById("submenuProjetos");
  
    const isEnglish = document.documentElement.lang === "en";
    const currentLabel = isEnglish ? projetosLink.dataset.en : projetosLink.dataset.pt;
  
    const arrow = submenu.classList.contains("open") ? "▴" : "▾";
    projetosLink.textContent = `${currentLabel} ${arrow}`;
  }

  // =============================
  // 3. Galeria dinâmica: Paisagem Interior
  // =============================
  const imagensInterior = [
    "0001.jpg", "0002.jpg", "0003.jpg", "0004.jpg", "0005.jpg",
    "0006.jpg", "0007.jpg", "0008.jpg", "0009.jpg", "0010.jpg",
    "0011.jpg", "0012.jpg", "0013.jpg", "0014.jpg", "0015.jpg",
    "0016.jpg", "0017.jpg", "0018.jpg", "0019.jpg", "0020.jpg",
    "0021.jpg", "0022.jpg", "0023.jpg"
  ];

  const galeria = document.getElementById("galeriaInterior");

  imagensInterior.forEach((nome, i) => {
    const img = document.createElement("img");
    img.src = `interioridades/${nome}`;
    img.alt = `Paisagem Interior ${i + 1}`;
    img.onclick = () => abrirLightbox(i);
    galeria.appendChild(img);
  });

  // =============================
  // 4. Lightbox para galeria
  // =============================
  let indexAtual = 0;
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  function abrirLightbox(index) {
    indexAtual = index;
    lightbox.style.display = "flex";
    atualizarLightbox();
  }

  function atualizarLightbox() {
    lightboxImg.src = `interioridades/${imagensInterior[indexAtual]}`;
  }

  function navegar(direcao) {
    indexAtual = (indexAtual + direcao + imagensInterior.length) % imagensInterior.length;
    atualizarLightbox();
  }

  // Fechar lightbox ao clicar fora da imagem
  lightbox.addEventListener("click", (e) => {
    // Close lightbox if the click target is the background (not the image itself)
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

// =============================
// 5. Carrossel da página inicial
// =============================
const track = document.querySelector(".carousel-track");
const slides = Array.from(document.querySelectorAll(".carousel-slide"));
const dots = document.querySelectorAll(".carousel-dot");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

let currentIndex = 0;
const totalSlides = slides.length;

function goToSlide(index) {
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");

  track.style.transform = `translateX(-${index * 100}%)`;
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    goToSlide(currentIndex);
  });
});

// ✅ Only add event listeners if arrows exist
if (leftArrow && rightArrow) {
  leftArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentIndex);
  });

  rightArrow.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
  });
}

// Auto slide
setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  goToSlide(currentIndex);
}, 5000);

goToSlide(currentIndex); // Initialize

// =============================
// 6. Zoom nas imagens do carrossel
// =============================
function enableCarouselZoom() {
  const zoomableImages = document.querySelectorAll(".carousel-slide img");
  let allImages = Array.from(zoomableImages);
  let currentZoomIndex = 0;

  zoomableImages.forEach((img, index) => {
    img.classList.add("zoomable");

    img.addEventListener("click", () => {
      let overlay = document.querySelector(".fullscreen-overlay");

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("fullscreen-overlay");

        const fullImg = document.createElement("img");
        fullImg.classList.add("fullscreen-image");

        const caption = document.createElement("div");
        caption.classList.add("fullscreen-caption");

        const left = document.createElement("div");
        left.classList.add("fullscreen-arrow", "fullscreen-left");
        left.innerHTML = "&#10094;";

        const right = document.createElement("div");
        right.classList.add("fullscreen-arrow", "fullscreen-right");
        right.innerHTML = "&#10095;";

        overlay.appendChild(left);
        overlay.appendChild(fullImg);
        overlay.appendChild(right);
        overlay.appendChild(caption);

        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.remove();
          }
        });

        left.addEventListener("click", (e) => {
          e.stopPropagation();
          currentZoomIndex = (currentZoomIndex - 1 + allImages.length) % allImages.length;
          showFullscreen(currentZoomIndex);
        });

        right.addEventListener("click", (e) => {
          e.stopPropagation();
          currentZoomIndex = (currentZoomIndex + 1) % allImages.length;
          showFullscreen(currentZoomIndex);
        });

        document.body.appendChild(overlay);
      }

      currentZoomIndex = index;
      showFullscreen(currentZoomIndex);
    });
  });

  function showFullscreen(index) {
    const overlay = document.querySelector(".fullscreen-overlay");
    const fullImg = overlay.querySelector(".fullscreen-image");
    const caption = overlay.querySelector(".fullscreen-caption");

    const img = allImages[index];
    fullImg.src = img.src;
    caption.textContent = img.closest(".carousel-image-wrapper").querySelector(".carousel-caption")?.innerText || "";

    overlay.style.display = "flex";
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlay = document.querySelector(".fullscreen-overlay");
      if (overlay) overlay.remove();
    }
  });
}

enableCarouselZoom();


// =============================
// 6. Zoom nas imagens do carrossel (página inicial)
// =============================
function enableCarouselZoom() {
  const zoomableImages = document.querySelectorAll("#home .carousel-slide img");

  let allImages = Array.from(zoomableImages); // store globally
  let currentZoomIndex = 0;

  zoomableImages.forEach((img, index) => {
    img.classList.add("zoomable");

    img.addEventListener("click", () => {
      let overlay = document.querySelector(".fullscreen-overlay");

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("fullscreen-overlay");

        const fullImg = document.createElement("img");
        fullImg.classList.add("fullscreen-image");

        const caption = document.createElement("div");
        caption.classList.add("fullscreen-caption");

        const leftArrow = document.createElement("div");
        leftArrow.classList.add("fullscreen-arrow", "left-arrow");
        leftArrow.innerHTML = "&#10094;"; // Left arrow symbol

        const rightArrow = document.createElement("div");
        rightArrow.classList.add("fullscreen-arrow", "right-arrow");
        rightArrow.innerHTML = "&#10095;"; // Right arrow symbol

        overlay.appendChild(leftArrow);
        overlay.appendChild(fullImg);
        overlay.appendChild(rightArrow);
        overlay.appendChild(caption);

        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.remove();
          }
        });

        document.body.appendChild(overlay);

        // Navigation logic
        leftArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          currentZoomIndex = (currentZoomIndex - 1 + allImages.length) % allImages.length;
          showFullscreenImage(currentZoomIndex);
        });

        rightArrow.addEventListener("click", (e) => {
          e.stopPropagation();
          currentZoomIndex = (currentZoomIndex + 1) % allImages.length;
          showFullscreenImage(currentZoomIndex);
        });
      }

      currentZoomIndex = index;
      showFullscreenImage(currentZoomIndex);
    });
  });

  function showFullscreenImage(index) {
    const overlay = document.querySelector(".fullscreen-overlay");
    const fullImg = overlay.querySelector(".fullscreen-image");
    const caption = overlay.querySelector(".fullscreen-caption");

    const img = allImages[index];
    fullImg.src = img.src;
    caption.textContent = img.closest(".carousel-image-wrapper").querySelector(".carousel-caption")?.innerText || "";
    overlay.style.display = "flex";
  }
}
// =============================
// 7. Fullscreen Image View (Novas Funções)
// =============================

function openFullscreen(imageSrc) {
  const overlay = document.createElement("div");
  overlay.classList.add("fullscreen-overlay");

  const fullImg = document.createElement("img");
  fullImg.src = imageSrc;
  overlay.appendChild(fullImg);
  document.body.appendChild(overlay);

  // Fechar fullscreen ao clicar fora da imagem
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove(); // Remove o overlay e a imagem ao clicar fora
    }
  });
}
