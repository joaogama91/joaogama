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
  initializeProjetosLabel();
}

function initializeProjetosLabel() {
  const projetosLink = document.getElementById("projetosLink");
  const submenu = document.getElementById("submenuProjetos");

  const isEnglish = document.documentElement.lang === "en";
  const currentLabel = isEnglish ? projetosLink.dataset.en : projetosLink.dataset.pt;
  const arrow = submenu.classList.contains("open") ? "\u25B4" : "\u25BE";

  projetosLink.textContent = `${currentLabel} ${arrow}`;
}

window.onload = () => {
  const language = localStorage.getItem('language') || 'pt';
  applyLanguage(language);
};

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

  submenu.classList.toggle("open");

  const isEnglish = document.documentElement.lang === "en";
  const currentLabel = isEnglish ? projetosLink.dataset.en : projetosLink.dataset.pt;
  const arrow = submenu.classList.contains("open") ? "\u25B4" : "\u25BE";

  projetosLink.textContent = `${currentLabel} ${arrow}`;
}

// =============================
// 3. Galerias dinâmicas
// =============================
const imagensInterior = [...Array(23)].map((_, i) => `interioridades/${String(i + 1).padStart(4, '0')}.jpg`);
const brotardaterra = [...Array(19)].map((_, i) => `brotardaterra/${String(i + 1).padStart(4, '0')}.jpg`);

function criarGaleria(imagens, containerId) {
  const container = document.getElementById(containerId);
  imagens.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${containerId} ${i + 1}`;
    img.onclick = () => abrirLightbox(imagens, i);
    container.appendChild(img);
  });
}

criarGaleria(imagensInterior, "galeriaInterior");
criarGaleria(brotardaterra, "brotardaterra");

// =============================
// 4. Lightbox Genérico
// =============================
let imagensAtuais = [];
let indexAtual = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function abrirLightbox(imagens, index) {
  imagensAtuais = imagens;
  indexAtual = index;
  lightbox.style.display = "flex";
  atualizarLightbox();
}

function atualizarLightbox() {
  lightboxImg.src = imagensAtuais[indexAtual];
}

function navegar(direcao) {
  indexAtual = (indexAtual + direcao + imagensAtuais.length) % imagensAtuais.length;
  atualizarLightbox();
}

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = "none";
  }
});

// =============================
// 5. Botões "Ler Mais"
// =============================
function configurarToggle(idBotao, idTexto) {
  const botao = document.getElementById(idBotao);
  const texto = document.getElementById(idTexto);
  if (!botao || !texto) return;

  botao.addEventListener("click", () => {
    const visivel = texto.style.display === "block";
    texto.style.display = visivel ? "none" : "block";
    botao.textContent = visivel ? "\u22EE" : "...";
  });
}

configurarToggle("toggleMore", "moreText");
configurarToggle("toggleMore1", "moreText1");

// =============================
// 6. Carrossel
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

setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  goToSlide(currentIndex);
}, 5000);

goToSlide(currentIndex);

// =============================
// 7. Zoom nas imagens do carrossel (Home)
// =============================
function enableCarouselZoom() {
  const zoomableImages = document.querySelectorAll("#home .carousel-slide img");

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
          if (e.target === overlay) overlay.remove();
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
