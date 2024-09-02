// Import necessary translations and functions
import { translations } from './translations.js';
import { validateInput } from './formValidation.js';
import { loadProjects } from './projects.js';

document.addEventListener("DOMContentLoaded", () => {
  // Get the DOM elements I'll need
  const sidebar = document.getElementById("sidebar");
  const body = document.body;
  const navLinks = sidebar.getElementsByClassName("nav-link");
  const scrollToTopBtn = document.getElementById("scrollToTop");
  const progressRing = document.querySelector(".progress-ring__circle");
  const radius = progressRing.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  const sections = document.querySelectorAll(".section");
  const languageToggle = document.getElementById("languageToggle");
  let currentLanguage = "es";
  let lastClickedLink = null;

  // Configure the progress circle
  progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  progressRing.style.strokeDashoffset = circumference;

  // Function to update the progress circle
  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
  }

  // Handle scroll to show/hide the back-to-top button and update progress
  function handleScroll() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const scrollPercentage = (scrolled / scrollTotal) * 100;
  
    if (scrolled > 300) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  
    setProgress(scrollPercentage);
  
    if (!lastClickedLink) {
      updateActiveNavLink();
    }
  }

  // Update the active navigation link
  function updateActiveNavLink() {
    const isNavbarExpanded = sidebar.classList.contains('expanded');
    
    if (!lastClickedLink) {
      const currentSection = Array.from(sections).reverse().find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight / 2;
      });

      if (currentSection) {
        setActiveLink(currentSection.id);
      }
    } else {
      setActiveLink(lastClickedLink.getAttribute("href").substring(1));
    }

    function setActiveLink(sectionId) {
      Array.from(navLinks).forEach(link => {
        link.classList.remove("active");
        link.style.backgroundColor = "transparent";
        link.style.color = "var(--text-color)";

        if (link.getAttribute("href").substring(1) === sectionId) {
          link.classList.add("active");
          if (isNavbarExpanded) {
            link.style.backgroundColor = "var(--secondary-color)";
            link.style.color = "var(--primary-color)";
          } else {
            link.style.backgroundColor = "transparent";
            link.style.color = "var(--secondary-color)";
          }
        }
      });
    }
  }

  // Update styles when the sidebar transition ends
  sidebar.addEventListener("transitionend", (e) => {
    if (e.propertyName === "width") {
      updateActiveNavLink();
    }
  });

  // Function to expand/collapse the sidebar
  function toggleSidebar(expand) {
    if (expand) {
      sidebar.classList.add('expanded');
      sidebar.classList.remove('collapsed');
      body.classList.add('sidebar-expanded');
    } else {
      sidebar.classList.remove('expanded');
      sidebar.classList.add('collapsed');
      body.classList.remove('sidebar-expanded');
    }
  }
  
  // Expand/collapse the sidebar on mouse enter/leave
  sidebar.addEventListener("mouseenter", () => toggleSidebar(true));
  sidebar.addEventListener("mouseleave", () => toggleSidebar(false));

  // Handle scroll
  window.addEventListener("scroll", handleScroll);

  // Scroll to top when button is clicked
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Configuration for typing effect
  let typingInterval;
  const typingElement = document.getElementById("typing-text");
  let phrases = [
    "Front-end Developer",
    "Video Game Tester",
    "Web Experience Creator",
  ];
  let phraseIndex = 0;
  let letterIndex = 0;
  let currentPhrase = "";
  let isDeleting = false;

  // Get the translated phrase
  function getTranslatedPhrase(phrase) {
    return translations[currentLanguage][phrase] || phrase;
  }

  // Typing effect
  function typeEffect() {
    const translatedPhrase = getTranslatedPhrase(phrases[phraseIndex]);

    if (isDeleting) {
      currentPhrase = translatedPhrase.substring(0, letterIndex - 1);
      letterIndex--;
    } else {
      currentPhrase = translatedPhrase.substring(0, letterIndex + 1);
      letterIndex++;
    }

    typingElement.textContent = currentPhrase;

    let delta = 150 - Math.random() * 100;

    if (isDeleting) {
      delta /= 2;
    }

    if (!isDeleting && letterIndex === translatedPhrase.length) {
      delta = 2000;
      isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delta = 500;
    }

    typingInterval = setTimeout(typeEffect, delta);
  }

  // Start the typing effect
  typeEffect();

  // Change language
  function changeLanguage() {
    currentLanguage = currentLanguage === "es" ? "en" : "es";
    languageToggle.querySelector("span").textContent = currentLanguage.toUpperCase();

    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[currentLanguage][key]) {
        element.textContent = translations[currentLanguage][key];
      }
    });

    document.querySelectorAll("[data-subtitle]").forEach((element) => {
      const key = element.getAttribute("data-subtitle");
      if (translations[currentLanguage][key]) {
        element.setAttribute("data-subtitle", translations[currentLanguage][key]);
      } else {
        element.removeAttribute('data-subtitle');
      }
    });

    document.querySelectorAll("input, textarea").forEach((input) => {
      const key = input.getAttribute("placeholder");
      if (key && translations[currentLanguage][key]) {
        input.setAttribute("placeholder", translations[currentLanguage][key]);
      }
    });

    // Update typing effect phrases
    phrases = [
      "Front-end Developer",
      "Video Game Tester",
      "Web Experience Creator",
    ].map(phrase => getTranslatedPhrase(phrase));

    // Restart typing effect
    clearTimeout(typingInterval);
    letterIndex = 0;
    isDeleting = false;
    phraseIndex = 0;
    currentPhrase = "";
    typingElement.textContent = "";
    typeEffect();

    lastClickedLink = null;
    updateActiveNavLink();

    console.log(`Language changed to: ${currentLanguage}`);
  }

  // Add event listener for language change
  languageToggle.addEventListener("click", changeLanguage);

  // Initialize translations
  function initializeTranslations() {
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[currentLanguage][key]) {
        element.textContent = translations[currentLanguage][key];
      }
    });
  }

  initializeTranslations();

  // Set up intersection observer for animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  document.querySelectorAll(".section-title").forEach((title) => {
    observer.observe(title);
  });

  // Handle form validation
  const form = document.querySelector('.contact-form');
  const inputs = form.querySelectorAll('input, textarea');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let isValid = true;

    inputs.forEach(input => {
      if (!validateInput(input, currentLanguage)) {
        isValid = false;
      }
    });

    if (isValid) {
      console.log('Form submitted');
      // Here I can add the code to send the form
    }
  });

  inputs.forEach(input => {
    input.addEventListener('input', function() {
      validateInput(this, currentLanguage);
    });
  });

  // Handle character count for message
  const messageTextarea = document.getElementById('message');
  const charCount = document.getElementById('char-count');

  messageTextarea.addEventListener('input', function() {
    const remainingChars = 3000 - this.value.length;
    charCount.textContent = this.value.length;
    
    if (remainingChars < 0) {
      this.value = this.value.slice(0, 3000);
      charCount.textContent = 3000;
    }
  });

  // Initialize project carousels
  function initCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');
    carousels.forEach(carousel => {
      const items = carousel.querySelectorAll('.project-item');
      if (items.length === 0) {
        console.log('No items in carousel:', carousel.id);
        return;
      }
  
      console.log('Initializing carousel:', carousel.id, 'with', items.length, 'items');
  
      const buttonsHtml = Array.from(items, () => {
        return `<span class="carousel-dot"></span>`;
      });
  
      carousel.insertAdjacentHTML("afterend", `
        <div class="carousel-nav">
          ${buttonsHtml.join("")}
        </div>
      `);
  
      const buttons = carousel.nextElementSibling.querySelectorAll('.carousel-dot');
  
      buttons.forEach((button, i) => {
        button.addEventListener('click', () => {
          items.forEach(item => item.classList.remove('active'));
          buttons.forEach(button => button.classList.remove('active'));
  
          items[i].classList.add('active');
          button.classList.add('active');
        });
      });
  
      if (items.length > 0 && buttons.length > 0) {
        items[0].classList.add('active');
        buttons[0].classList.add('active');
      }
  
      carousel.insertAdjacentHTML("beforeend", `
        <button class="carousel-button prev">&lt;</button>
        <button class="carousel-button next">&gt;</button>
      `);
  
      const prevButton = carousel.querySelector('.prev');
      const nextButton = carousel.querySelector('.next');
  
      prevButton.addEventListener('click', () => {
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        buttons[prevIndex].click();
      });
  
      nextButton.addEventListener('click', () => {
        const currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
        const nextIndex = (currentIndex + 1) % items.length;
        buttons[nextIndex].click();
      });
    });
  }

  // Load projects and initialize carousels
  function loadAndInitProjects() {
    loadProjects().then(() => {
      console.log('Projects loaded, initializing carousels...');
      initCarousels();
    }).catch(error => {
      console.error('Error loading projects:', error);
    });
  }

  loadAndInitProjects();

  // Handle click on navigation links
  function handleNavLinkClick(event) {
    const clickedLink = event.currentTarget;
    const sectionId = clickedLink.getAttribute("href").substring(1);
    
    if (sectionId === "languages") {
      event.preventDefault();
      lastClickedLink = clickedLink;
      updateActiveNavLink();
      
      // Smooth scroll to languages section
      const languagesSection = document.getElementById("languages");
      if (languagesSection) {
        languagesSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      lastClickedLink = null;
    }
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });

  // Initialize translations
  function initializeTranslations() {
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[currentLanguage][key]) {
        element.textContent = translations[currentLanguage][key];
      }
    });
  }

  initializeTranslations();
  
});