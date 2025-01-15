function setupZoomEffect(container) {
  if (!container) return;
  
  const image = container.querySelector('img');
  if (!image) return;

  container.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    image.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  });

  container.addEventListener('mouseenter', () => {
    image.style.transform = 'scale(1.5)';
  });

  container.addEventListener('mouseleave', () => {
    image.style.transform = 'scale(1)';
    image.style.transformOrigin = 'center center';
  });
}

function setupCarousel(carousel) {
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.project-slide');
  const prevBtn = carousel.querySelector('.carousel-button.prev');
  const nextBtn = carousel.querySelector('.carousel-button.next');
  const dots = carousel.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
      slide.setAttribute('aria-hidden', index !== currentSlide);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
      dot.setAttribute('aria-current', index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
  }

  // Add keyboard navigation
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Add touch support
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  carousel.addEventListener('touchmove', (e) => {
    touchEndX = e.touches[0].clientX;
  });

  carousel.addEventListener('touchend', () => {
    const touchDiff = touchStartX - touchEndX;
    if (Math.abs(touchDiff) > 50) {
      if (touchDiff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
    prevBtn.setAttribute('aria-label', 'Previous slide');
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
    nextBtn.setAttribute('aria-label', 'Next slide');
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlides();
    });
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  });

  // Auto-advance slides every 5 seconds
  let autoAdvance = setInterval(nextSlide, 5000);

  // Pause auto-advance on hover or focus
  carousel.addEventListener('mouseenter', () => {
    clearInterval(autoAdvance);
  });

  carousel.addEventListener('focus', () => {
    clearInterval(autoAdvance);
  });

  // Resume auto-advance when mouse leaves or focus is lost
  carousel.addEventListener('mouseleave', () => {
    if (!carousel.matches(':focus-within')) {
      autoAdvance = setInterval(nextSlide, 5000);
    }
  });

  carousel.addEventListener('blur', () => {
    if (!carousel.matches(':hover')) {
      autoAdvance = setInterval(nextSlide, 5000);
    }
  });

  updateSlides();
}

function loadProjects(currentLanguage = 'es') {
  return new Promise((resolve) => {
    try {
      for (const [category, projectList] of Object.entries(projects)) {
        const carousel = document.getElementById(`${category}-carousel`);
        if (!carousel) {
          console.warn(`Carousel not found for category: ${category}`);
          continue;
        }

        // Clear existing content
        carousel.innerHTML = '';

        if (!projectList || projectList.length === 0) {
          console.warn(`No projects found for category: ${category}`);
          carousel.innerHTML = `<p class="no-projects" data-translate="no-projects">${translations[currentLanguage]['no-projects']}</p>`;
          continue;
        }

        // Create slides container
        const slidesContainer = document.createElement('div');
        slidesContainer.classList.add('slides-container');
        carousel.appendChild(slidesContainer);

        // Create project slides
        projectList.forEach((project, index) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-slide');
          projectItem.setAttribute('role', 'tabpanel');
          projectItem.setAttribute('aria-label', `Project ${index + 1} of ${projectList.length}`);
          projectItem.innerHTML = `
            <div class="project-image-container">
              <img src="${project.image}" alt="${translations[currentLanguage][project.title] || project.title}" class="project-image">
            </div>
            <div class="project-content">
              <h4>${translations[currentLanguage][project.title] || project.title}</h4>
              <p>${translations[currentLanguage][project.description] || project.description}</p>
              <a href="${project.link}" target="_blank" class="project-link" rel="noopener noreferrer">
                <i class="fas fa-external-link-alt"></i>
                ${translations[currentLanguage]['view-project'] || 'View Project'}
              </a>
            </div>
          `;
          slidesContainer.appendChild(projectItem);
          setupZoomEffect(projectItem.querySelector('.project-image-container'));
        });

        // Add carousel controls
        carousel.insertAdjacentHTML('beforeend', `
          <button class="carousel-button prev" aria-label="Previous slide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-button next" aria-label="Next slide">
            <i class="fas fa-chevron-right"></i>
          </button>
          <div class="carousel-indicators" role="tablist">
            ${projectList.map((_, i) => `
              <span class="carousel-dot" role="tab" tabindex="0" aria-label="Go to slide ${i + 1}"></span>
            `).join('')}
          </div>
        `);

        // Initialize carousel
        setupCarousel(carousel);
      }

      console.log('Projects loaded successfully');
      resolve();
    } catch (error) {
      console.error('Error loading projects:', error);
      resolve(); // Resolve even on error to prevent blocking
    }
  });
}