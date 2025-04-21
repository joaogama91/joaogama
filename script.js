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
      
      const titulo = document.querySelector("nav ul li.titulo");
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
    if (e.target === lightbox || e.target === lightboxImg) {
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