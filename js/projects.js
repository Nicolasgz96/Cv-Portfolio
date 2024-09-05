import { projects } from './projects-data.js';
import { translations } from './translations.js';

export function loadProjects(currentLanguage = 'es') {
  return new Promise((resolve) => {
    for (const [category, projectList] of Object.entries(projects)) {
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
        projectItem.classList.add('project-slide', 'project-item');
        projectItem.innerHTML = `
          <div class="project-image-container">
            <img src="${project.image}" alt="${translations[currentLanguage][project.title] || project.title}" class="project-image">
          </div>
          <div class="project-content">
            <h4>${translations[currentLanguage][project.title] || project.title}</h4>
            <p>${translations[currentLanguage][project.description] || project.description}</p>
            <a href="${project.link}" target="_blank" class="project-link">${translations[currentLanguage]['view-project'] || 'View Project'} ${index + 1}</a>
          </div>
        `;
        carousel.appendChild(projectItem);
        setupZoomEffect(projectItem.querySelector('.project-image-container'));
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
  });
}

function setupZoomEffect(container) {
  const image = container.querySelector('.project-image');

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    image.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  });

  container.addEventListener('mouseenter', () => {
    image.style.transform = 'scale(1.5)';
  });

  container.addEventListener('mouseleave', () => {
    image.style.transform = 'scale(1)';
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

  if (prevButton) {
    prevButton.addEventListener('click', prevSlide);
  } else {
    console.warn(`Prev button not found for carousel ${carousel.id}`);
  }

  if (nextButton) {
    nextButton.addEventListener('click', nextSlide);
  } else {
    console.warn(`Next button not found for carousel ${carousel.id}`);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  showSlide(0);

  let intervalId = setInterval(nextSlide, 5000);

  carousel.addEventListener('mouseenter', () => {
    clearInterval(intervalId);
  });
  carousel.addEventListener('mouseleave', () => {
    intervalId = setInterval(nextSlide, 5000);
  });
}