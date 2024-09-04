import { projects } from './projects-data.js';

export function loadProjects() {
  return new Promise((resolve) => {
    setTimeout(() => {
      for (const [category, projectList] of Object.entries(projects)) {
        const carousel = document.getElementById(`${category}-carousel`);
        if (!carousel) continue;
        
        projectList.forEach((project, index) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-slide');
          projectItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
              <h4>${project.title}</h4>
              <p>${project.description}</p>
              <a href="${project.link}" target="_blank" class="project-link">Ver proyecto ${index + 1}</a>
            </div>
          `;
          carousel.appendChild(projectItem);
        });

        carousel.insertAdjacentHTML('beforeend', `
          <button class="carousel-button prev">&lt;</button>
          <button class="carousel-button next">&gt;</button>
          <div class="carousel-indicators">
            ${projectList.map(() => `<span class="carousel-dot"></span>`).join('')}
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

  if (prevButton) prevButton.addEventListener('click', prevSlide);
  if (nextButton) nextButton.addEventListener('click', nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  showSlide(0);

  let intervalId = setInterval(nextSlide, 5000);

  carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
  carousel.addEventListener('mouseleave', () => intervalId = setInterval(nextSlide, 5000));
}