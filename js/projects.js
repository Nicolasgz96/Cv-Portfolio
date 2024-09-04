import { projects } from './projects-data.js';
import { translations } from './translations.js';

export function loadProjects(currentLanguage = 'es') {
  return new Promise((resolve) => {
    setTimeout(() => {
      for (const [category, projectList] of Object.entries(projects)) {
        console.log(`Loading ${category} projects:`, projectList);
        const carousel = document.getElementById(`${category}-carousel`);
        if (!carousel) {
          console.warn(`Carousel not found for category: ${category}`);
          continue;
        }
        
        carousel.innerHTML = '';
        
        if (projectList.length === 0) {
          console.warn(`No projects found for category: ${category}`);
          continue;
        }
        
        projectList.forEach((project, index) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-slide');
          projectItem.innerHTML = `
            <img src="${project.image}" alt="${translations[currentLanguage][project.title] || project.title}" class="project-image">
            <div class="project-content">
              <h4>${translations[currentLanguage][project.title] || project.title}</h4>
              <p>${translations[currentLanguage][project.description] || project.description}</p>
              <a href="${project.link}" target="_blank" class="project-link">${translations[currentLanguage]['view-project'] || 'View Project'} ${index + 1}</a>
            </div>
          `;
          carousel.appendChild(projectItem);
          console.log(`Added project to ${category} carousel:`, project);
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