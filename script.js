// ===== Hero background rotation =====
// Para agregar fotos: poner el archivo en assets/images/heros/ y sumarlo a esta lista.
const HERO_IMAGES = [
  'assets/images/heros/hero-1.jpg',
  'assets/images/heros/hero-2.jpg',
  'assets/images/heros/hero-3.jpg',
  'assets/images/heros/hero-4.jpg'
];
const HERO_OPACITY = 0.55;
const HERO_INTERVAL_MS = 3000;
const heroLayers = [document.getElementById('hero-bg-1'), document.getElementById('hero-bg-2')];
const heroReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (HERO_IMAGES.length) {
  heroLayers[0].src = HERO_IMAGES[0];
  heroLayers[0].style.opacity = HERO_OPACITY;
}

if (HERO_IMAGES.length > 1 && !heroReducedMotion) {
  let heroIndex = 0;
  let heroActiveLayer = 0;
  setInterval(() => {
    const nextIndex = (heroIndex + 1) % HERO_IMAGES.length;
    const nextLayer = 1 - heroActiveLayer;
    const img = heroLayers[nextLayer];
    img.onload = () => {
      img.style.opacity = HERO_OPACITY;
      heroLayers[heroActiveLayer].style.opacity = 0;
      heroActiveLayer = nextLayer;
      heroIndex = nextIndex;
    };
    img.src = HERO_IMAGES[nextIndex];
  }, HERO_INTERVAL_MS);
}

// ===== Footer year =====
document.getElementById('footer-year').textContent = new Date().getFullYear();

// ===== Nav scroll state =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

function closeNavMenu() {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNavMenu);
});

// ===== Fade in on scroll =====
const faders = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
faders.forEach(el => io.observe(el));

// ===== i18n =====
function setLang(l) {
  document.querySelectorAll('[data-' + l + ']').forEach(el => {
    el.innerHTML = el.getAttribute('data-' + l);
  });
  ['es', 'en', 'de'].forEach(code => {
    document.getElementById('lang-' + code).classList.toggle('active', l === code);
  });
  document.documentElement.lang = l;
}
// Aplicar el idioma por defecto al cargar para que los textos data-es se muestren
// desde el inicio (sin esperar a que el usuario toque el switch ES/EN).
setLang('es');

// ===== Reel play =====
const reelWrap = document.getElementById('reel-wrap');
const reelIframe = document.getElementById('reel-iframe');
const REEL_URL = 'https://www.youtube.com/embed/kaGn5DDFC8M?autoplay=1&playsinline=1&rel=0';
function playReel() {
  reelIframe.src = REEL_URL;
  reelWrap.classList.add('playing');
}
document.getElementById('reel-poster').addEventListener('click', playReel);
document.getElementById('reel-play').addEventListener('click', playReel);

// ===== Works lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxIframe = document.getElementById('lightbox-iframe');

document.querySelectorAll('.work-card[data-video-url]').forEach(card => {
  card.addEventListener('click', () => {
    // playsinline=1 mantiene el video dentro del lightbox en iOS (evita el reproductor
    // nativo a pantalla completa); rel=0 limita los videos relacionados al mismo canal.
    lightboxIframe.src = card.getAttribute('data-video-url') + '&playsinline=1&rel=0';
    lightbox.classList.add('open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxIframe.src = '';
}
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// ===== Gallery carousel =====
const track = document.getElementById('carousel-track');
const slides = track.querySelectorAll('.slide');
let carouselIndex = 0;

function visibleSlides() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function updateCarousel() {
  const slideWidth = slides[0].offsetWidth + 16; // gap 1rem
  const maxIndex = Math.max(0, slides.length - visibleSlides());
  carouselIndex = Math.min(Math.max(carouselIndex, 0), maxIndex);
  track.style.transform = 'translateX(' + (-carouselIndex * slideWidth) + 'px)';
}

function scrollToIndex(i) {
  const maxIndex = Math.max(0, slides.length - visibleSlides());
  if (i < carouselIndex) {
    carouselIndex = i;
  } else if (i > carouselIndex + visibleSlides() - 1) {
    carouselIndex = i - visibleSlides() + 1;
  }
  carouselIndex = Math.min(Math.max(carouselIndex, 0), maxIndex);
  updateCarousel();
}

document.getElementById('carousel-next').addEventListener('click', () => {
  selectGalleryImage(mod(galleryActiveIndex + 1, slides.length));
});
document.getElementById('carousel-prev').addEventListener('click', () => {
  selectGalleryImage(mod(galleryActiveIndex - 1, slides.length));
});
window.addEventListener('resize', updateCarousel);
updateCarousel();

// ===== Gallery -> big photo crossfade =====
const aboutLayers = [document.getElementById('about-photo-1'), document.getElementById('about-photo-2')];
let aboutActiveLayer = 0;
let galleryActiveIndex = -1;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function crossfadeAboutPhoto(src) {
  const nextLayer = 1 - aboutActiveLayer;
  const img = aboutLayers[nextLayer];
  img.onload = () => {
    img.classList.add('active');
    aboutLayers[aboutActiveLayer].classList.remove('active');
    aboutActiveLayer = nextLayer;
  };
  img.src = src;
}

function selectGalleryImage(i) {
  const img = slides[i].querySelector('img');
  crossfadeAboutPhoto(img.currentSrc || img.src);
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');
  galleryActiveIndex = i;
  scrollToIndex(i);
}

slides.forEach((slide, i) => {
  slide.addEventListener('click', () => selectGalleryImage(i));
});

// La foto grande arranca mostrando la primera imagen de la galería, sin fade.
const firstSlideImg = slides[0].querySelector('img');
aboutLayers[aboutActiveLayer].src = firstSlideImg.currentSrc || firstSlideImg.src;
slides[0].classList.add('active');
galleryActiveIndex = 0;
scrollToIndex(0);

const _e = ['agustinasidotrabajo', '@', 'gmail.com'];
const _w = ['549', '3546', '418200'];

const reveal = document.getElementById('contact-reveal');
let emailOpen = false;

document.getElementById('contact-email').addEventListener('click', () => {
  emailOpen = !emailOpen;
  reveal.textContent = emailOpen ? _e.join('') : '';
});

document.getElementById('contact-whatsapp').addEventListener('click', () => {
  window.open('https://wa.me/' + _w.join(''), '_blank', 'noopener');
});
