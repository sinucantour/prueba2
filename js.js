// js.js - completo, actualizado con soporte móvil <400px y altura dinámica del carrusel
let carouselInterval;

function iniciarPagina() {
  // ===== MENÚ HAMBURGUESA =====
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.main-nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isActive = nav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(isActive));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== CARRUSEL =====
  const slides = Array.from(document.querySelectorAll('.carousel .slide'));
  const dots = Array.from(document.querySelectorAll('.carousel .dot'));
  const prevBtn = document.querySelector('.carousel .prev');
  const nextBtn = document.querySelector('.carousel .next');
  const carouselEl = document.querySelector('.carousel');
  let current = 0;
  const total = slides.length || 1;

  function ajustarAltura() {
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) {
        const vh = window.innerHeight;
        if (window.innerWidth < 720) {
          img.style.height = `${Math.max(vh * 0.46, 220)}px`;
        } else if (window.innerWidth < 980) {
          img.style.height = '380px';
        } else {
          img.style.height = '500px';
        }
      }
    });
  }

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % total);
  }

  function prevSlide() {
    showSlide((current - 1 + total) % total);
  }

  function resetInterval() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000);
  }

  // Inicializar intervalo
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(nextSlide, 5000);

  // Botones prev/next
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
  }

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      if (!isNaN(idx)) { showSlide(idx); resetInterval(); }
    });
  });

  // Pausar carrusel al pasar mouse
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carouselEl.addEventListener('mouseleave', resetInterval);
  }

  // Soporte teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); resetInterval(); }
    if (e.key === 'ArrowRight') { nextSlide(); resetInterval(); }
  });

  // Ajustar altura inicial y al cambiar tamaño
  ajustarAltura();
  window.addEventListener('resize', ajustarAltura);

  // ===== FORMULARIO =====
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const existingMsg = form.querySelector('.form-message');
      if (existingMsg) existingMsg.remove();

      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const servicio = form.servicio.value;
      const mensaje = form.mensaje.value.trim();
      const errors = [];

      if (!nombre) errors.push('Por favor ingresa tu nombre.');
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Ingresa un correo válido.');
      if (!servicio) errors.push('Selecciona el servicio que te interesa.');
      if (!mensaje) errors.push('Escribe un mensaje.');

      if (errors.length) {
        showFormMessage('error', errors.join(' '), form);
        return;
      }

      showFormMessage('success', 'Mensaje enviado correctamente. ¡Gracias! Nuestro equipo se contactará contigo pronto.', form);
      form.reset();
    });
  }

  function showFormMessage(type, text, formEl) {
    const msg = document.createElement('div');
    msg.className = 'form-message ' + (type === 'success' ? 'success animate__animated animate__fadeIn' : 'error animate__animated animate__shakeX');
    msg.innerText = text;
    formEl.appendChild(msg);

    if (type === 'success') {
      setTimeout(() => { msg.classList.remove('animate__fadeIn'); msg.classList.add('animate__fadeOut'); }, 3000);
      setTimeout(() => { msg.remove(); }, 3800);
    }
  }

  // ===== BOTÓN SUBIR ARRIBA =====
  const btnTop = document.getElementById('btn-top');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      btnTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== NAVBAR ACTIVA SEGÚN SCROLL =====
  const secciones = document.querySelectorAll("section[id]");
  const enlaces = document.querySelectorAll(".main-nav a");

  function activarLink() {
    const scrollPos = window.scrollY + 100;
    secciones.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        enlaces.forEach(a => a.classList.remove("active"));
        const enlaceActivo = document.querySelector('.main-nav a[href="#' + sec.id + '"]');
        if (enlaceActivo) enlaceActivo.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", activarLink);
  activarLink();
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', iniciarPagina);
} else {
  iniciarPagina();
}
