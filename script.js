 // =============================
// TRANSLATION PT TO EN
// =============================	 
  document.getElementById('pt-lang').addEventListener('click', () => {
  setLanguage('pt');
});

document.getElementById('en-lang').addEventListener('click', () => {
  setLanguage('en');
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
      submenu.classList.toggle("open");
      
      const titulo = document.querySelector("li.titulo > a");
      if (submenu.classList.contains("open")) {
        titulo.innerHTML = "Projetos ▾";
      } else {
        titulo.innerHTML = "Projetos ▴";
        
      }
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

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      slides.forEach(s => s.classList.remove("active"));
      dots.forEach(d => d.classList.remove("active"));
      slides[index].classList.add("active");
      dot.classList.add("active");
      track.style.transform = `translateX(-${index * 100}%)`;
    });
  });

// =============================
// 6. Zoom nas imagens do carrossel (página inicial)
// =============================
function enableCarouselZoom() {
  const zoomableImages = document.querySelectorAll("#home .carousel-slide img");

  zoomableImages.forEach(img => {
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

        overlay.appendChild(fullImg);
        overlay.appendChild(caption);

        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {
            overlay.remove();
          }
        });

        document.body.appendChild(overlay);
      }

      const fullImg = overlay.querySelector("img.fullscreen-image");
      const caption = overlay.querySelector(".fullscreen-caption");

      fullImg.src = img.src;

      // Pegar legenda correspondente
      const captionText = img.closest(".carousel-image-wrapper").querySelector(".carousel-caption")?.innerText || "";
      caption.textContent = captionText;

      overlay.style.display = "flex";
    });
  });
}

// Run on page load
enableCarouselZoom();

// Patch mostrarSecao to re-run zoom logic if the home section is shown again
const originalMostrarSecao = mostrarSecao;
mostrarSecao = function (id) {
  originalMostrarSecao(id);
  if (id === "home") {
    setTimeout(enableCarouselZoom, 100); // Rebind in case DOM is refreshed
  }
};

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
