// Import the project data
import { projects } from './projects-data.js';

// Function to load projects into the DOM
export function loadProjects() {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous load with a setTimeout
    setTimeout(() => {
      // Iterate over each project category
      for (const [category, projectList] of Object.entries(projects)) {
        // Get the carousel corresponding to the category
        const carousel = document.getElementById(`${category}-carousel`);
        
        // Create and add each project to the carousel
        projectList.forEach((project, index) => {
          const projectItem = document.createElement('div');
          projectItem.classList.add('project-slide');
          projectItem.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
          `;
          carousel.appendChild(projectItem);
        });

        // Add navigation buttons and indicator dots
        carousel.insertAdjacentHTML('beforeend', `
          <button class="carousel-button prev">&lt;</button>
          <button class="carousel-button next">&gt;</button>
          <div class="carousel-indicators">
            ${projectList.map((_, i) => `<span class="carousel-dot"></span>`).join('')}
          </div>
        `);

        // Set up the carousel for this category
        setupCarousel(carousel);
      }

      // Resolve the promise when everything is loaded
      resolve();
    }, 1000); // Simulate one second of loading time
  });
}

// Function to set up each carousel
function setupCarousel(carousel) {
  const slides = carousel.querySelectorAll('.project-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  const prevButton = carousel.querySelector('.carousel-button.prev');
  const nextButton = carousel.querySelector('.carousel-button.next');
  let currentSlide = 0;

  // Function to show a specific slide
  function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  // Functions to navigate between slides
  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Add event listeners for navigation buttons
  nextButton.addEventListener('click', nextSlide);
  prevButton.addEventListener('click', prevSlide);

  // Add event listeners for indicator dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Ensure the first slide and dot are active at the start
  showSlide(0);

  // Set up auto-play for the carousel
  let intervalId = setInterval(nextSlide, 5000);

  // Pause auto-play when the mouse is over the carousel
  carousel.addEventListener('mouseenter', () => clearInterval(intervalId));
  carousel.addEventListener('mouseleave', () => intervalId = setInterval(nextSlide, 5000));
}