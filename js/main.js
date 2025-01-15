let currentLanguage = "en";
let lastClickedLink = null;

// Function to change language
function changeLanguage() {
  currentLanguage = currentLanguage === "en" ? "es" : "en";
  const languageText = languageToggle.querySelector("span");
  languageText.textContent = currentLanguage.toUpperCase();
  initializeTranslations();
  loadAndInitProjects();
  updateHighlightItems(); // Explicitly update highlights after language change
}

function initializeTranslations() {
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[currentLanguage][key]) {
      element.textContent = translations[currentLanguage][key];
    }
  });
  updateHighlightItems();
  updateAboutDescription();
}

function updateAboutDescription() {
  const aboutDescriptionElement = document.getElementById('about-description');
  if (aboutDescriptionElement) {
    aboutDescriptionElement.innerHTML = translations[currentLanguage]["about-description"];
  }
}

function updateHighlightItems() {
  const aboutSection = document.querySelector('#about');
  if (!aboutSection) return;
  
  let aboutHighlights = aboutSection.querySelector('.about-highlights');
  if (!aboutHighlights) {
    aboutHighlights = document.createElement('div');
    aboutHighlights.className = 'about-highlights';
    const aboutContent = aboutSection.querySelector('.about-content .col-md-8');
    if (aboutContent) {
      aboutContent.appendChild(aboutHighlights);
    }
  }

  const highlightItems = [
    { icon: 'fas fa-code', key: 'highlight-1' },
    { icon: 'fas fa-gamepad', key: 'highlight-2' },
    { icon: 'fas fa-globe', key: 'highlight-3' },
    { icon: 'fas fa-tv', key: 'highlight-4' },
    { icon: 'fas fa-laptop-code', key: 'highlight-5' },
    { icon: 'fas fa-tasks', key: 'highlight-6' }
  ];

  aboutHighlights.innerHTML = highlightItems.map((item, index) => `
    <div class="highlight-item animate-fade-${index % 2 ? 'right' : 'left'}">
      <i class="${item.icon}"></i>
      <span>${translations[currentLanguage][item.key] || ''}</span>
    </div>
  `).join('');

  // Remove any existing highlight items
  const existingHighlights = aboutHighlights.querySelectorAll('.highlight-item');
  existingHighlights.forEach(item => item.classList.remove('active'));

  // Trigger animations after a short delay
  setTimeout(() => {
    const newHighlights = aboutHighlights.querySelectorAll('.highlight-item');
    newHighlights.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('active');
      }, index * 100);
    });
  }, 100);
}

function handleNavLinkClick(event) {
  event.preventDefault();
  lastClickedLink = event.currentTarget;
  const targetId = lastClickedLink.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { lastClickedLink = null; }, 1000);
  }
}

function loadAndInitProjects() {
  if (typeof loadProjects === 'function') {
    loadProjects(currentLanguage)
      .then(() => {
        console.log('Projects loaded successfully');
      })
      .catch(error => {
        console.error('Error loading projects:', error);
      });
  } else {
    console.error('loadProjects function not found');
  }
}

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

  // Configure the progress circle
  progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  progressRing.style.strokeDashoffset = circumference;

  // Initialize translations and projects
  initializeTranslations();
  updateHighlightItems();
  loadAndInitProjects();

  // Make sections visible initially
  sections.forEach(section => {
    section.style.opacity = "1";
    section.style.transform = "translateY(0)";
  });

  // Initialize animations
  const animateOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Add 'active' class when element enters viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          
          // Find and animate child elements
          const animatedChildren = entry.target.querySelectorAll('[class*="animate-"]');
          animatedChildren.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('active');
            }, index * 150);
          });
        } else {
          // Remove 'active' class when element leaves viewport
          entry.target.classList.remove('active');
          
          // Reset child elements
          const animatedChildren = entry.target.querySelectorAll('[class*="animate-"]');
          animatedChildren.forEach(child => {
            child.classList.remove('active');
          });
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-50px'
    });

    // Observe sections and animated elements
    document.querySelectorAll('.section, [class*="animate-"], .skill-item, .project-card, .highlight-item').forEach(element => {
      observer.observe(element);
    });
  };

  // Initialize animations
  animateOnScroll();

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

  // Update the active navigation link with debouncing
  let scrollTimeout;
  function updateActiveNavLink() {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }

    scrollTimeout = window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sections = document.querySelectorAll('.section');
      const navLinks = document.querySelectorAll('.nav-link');
      
      let currentSectionId = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.id;
        }
      });
      
      navLinks.forEach(link => {
        const linkHref = link.getAttribute('href').substring(1);
        link.classList.remove('active');
        link.style.backgroundColor = 'transparent';
        link.style.color = 'var(--text-color)';
        
        if (linkHref === currentSectionId) {
          link.classList.add('active');
          if (sidebar.classList.contains('expanded')) {
            link.style.backgroundColor = 'var(--secondary-color)';
            link.style.color = 'var(--primary-color)';
          } else {
            link.style.backgroundColor = 'transparent';
            link.style.color = 'var(--secondary-color)';
          }
        }
      });
    });
  }

  // Add scroll event listener with passive option for better performance
  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // Initialize the active nav link on page load
  updateActiveNavLink();
  updateHighlightItems();

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
    "cook",
    "confectioner"
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
  languageToggle.addEventListener("click", changeLanguage);

  // Handle click on navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', handleNavLinkClick);
  });

  // Handle form validation
  const form = document.querySelector('.contact-form');
  if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    const yourEmail = '96.nicolas.gonzalez@gmail.com';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (validateForm(form, currentLanguage)) {
        const message = document.getElementById('message').value;
        const subject = encodeURIComponent(translations[currentLanguage]['email-subject']);

        const mailtoLink = `mailto:${yourEmail}?subject=${subject}&body=${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;
        form.reset();
      }
    });

    inputs.forEach(input => {
      input.addEventListener('input', function () {
        validateInput(this, currentLanguage);
      });
    });

    // Handle character count for message
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    if (messageTextarea && charCount) {
      messageTextarea.addEventListener('input', function () {
        const remainingChars = 3000 - this.value.length;
        charCount.textContent = this.value.length;

        if (remainingChars < 0) {
          this.value = this.value.slice(0, 3000);
          charCount.textContent = 3000;
        }
      });
    }
  }

  // Smooth scroll to footer links
  const footerLinks = document.querySelectorAll('.footer-links a');
  footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Add animation to skill items
  document.querySelectorAll('.skill-item').forEach((item, index) => {
    item.classList.add('reveal');
    item.style.animationDelay = `${index * 100}ms`;
  });

  // Add animation to project cards
  document.querySelectorAll('.project-card').forEach((card, index) => {
    card.classList.add('reveal');
    card.style.animationDelay = `${index * 100}ms`;
  });
});