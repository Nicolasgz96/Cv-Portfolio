import { projects } from './projects-data.js';

export function loadProjects() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const [category, projectList] of Object.entries(projects)) {
        const carousel = document.getElementById(`${category}-carousel`);
        projectList.forEach((project, index) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-slide');
          projectItem.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
          `;
          carousel.appendChild(projectItem);
        });

        // Añade los botones de navegación y los puntos
        carousel.insertAdjacentHTML('beforeend', `
          <button class="carousel-button prev">&lt;</button>
          <button class="carousel-button next">&gt;</button>
          <div class="carousel-indicators">
            ${projectList.map((_, i) => `<span class="carousel-dot"></span>`).join('')}
          </div>
        `);

        setupCarousel(carousel);
      }

      resolve();
    }, 1000);
  });
}

function setupCarousel(carousel) {
  const slides = carousel.querySelectorAll('.project-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevButton = carousel.querySelector('.carousel-button.prev');
  const nextButton = carousel.querySelector('.carousel-button.next');
  let currentSlide = 0;

  function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Asegúrate de que el primer slide y dot estén activos al inicio
  showSlide(0);

  let intervalId = setInterval(nextSlide, 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
  carousel.addEventListener('mouseleave', () => intervalId = setInterval(nextSlide, 5000));
}