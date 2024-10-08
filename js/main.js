// Import necessary translations and functions
import { translations } from './translations.js';
import { validateInput, validateForm } from './formValidation.js';
import { loadProjects } from './projects.js';

let currentLanguage = "en";

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
 
  let lastClickedLink = null;

  function updateAboutDescription() {
    const aboutDescriptionElement = document.getElementById('about-description');
    aboutDescriptionElement.innerHTML = translations[currentLanguage]["about-description"];
  }

  function updateHighlightItems() {
    const aboutSection = document.querySelector('#about');
    if (!aboutSection) {
      return;
    }
    
    let aboutHighlights = aboutSection.querySelector('.about-highlights');
    
    if (!aboutHighlights) {
      aboutHighlights = document.createElement('div');
      aboutHighlights.className = 'about-highlights';
      aboutSection.appendChild(aboutHighlights);
    }
  
    const highlightItems = [
      { icon: 'fas fa-code', key: 'highlight-1' },
      { icon: 'fas fa-gamepad', key: 'highlight-2' },
      { icon: 'fas fa-globe', key: 'highlight-3' },
      { icon: 'fas fa-tv', key: 'highlight-4' },
      { icon: 'fas fa-laptop-code', key: 'highlight-5' },
      { icon: 'fas fa-tasks', key: 'highlight-6' }
    ];
  
    aboutHighlights.innerHTML = highlightItems.map(item => `
      <div class="highlight-item">
        <i class="${item.icon}"></i>
        <span data-translate="${item.key}">${translations[currentLanguage][item.key] || ''}</span>
      </div>
    `).join('');
  
  }

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
  function changeLanguage() {
    currentLanguage = currentLanguage === "es" ? "en" : "es";
    languageToggle.querySelector("span").textContent = currentLanguage.toUpperCase();
  
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations[currentLanguage][key]) {
        element.textContent = translations[currentLanguage][key];
      }
    });
  
    updateHighlightItems();
    updateAboutDescription();
  
    loadProjects(currentLanguage).catch(error => {
      console.error('Error recargando proyectos:', error);
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
      "Dev Web-Ui",
      "cook",
      "confectioner"
    ].map(phrase => getTranslatedPhrase(phrase));

    // Reinicia el efecto de escritura
    clearTimeout(typingInterval);
    letterIndex = 0;
    isDeleting = false;
    phraseIndex = 0;
    currentPhrase = "";
    typingElement.textContent = "";
    typeEffect();

    lastClickedLink = null;
    updateActiveNavLink();
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
    updateHighlightItems();
    updateAboutDescription();
  }

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
  const yourEmail = '96.nicolas.gonzalez@gmail.com';


  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateForm(form, currentLanguage)) {
      const message = document.getElementById('message').value;
      const subject = encodeURIComponent(translations[currentLanguage]['email-subject']);

      const overlay = document.createElement('div');
      overlay.className = 'email-options-overlay';
      overlay.innerHTML = `
    <div class="email-options">
      <h3>${translations[currentLanguage]['email-instructions-title']}</h3>
      <p>${translations[currentLanguage]['email-instructions']}</p>
      <textarea id="message-body" readonly rows="5">${message}</textarea>
      <div class="button-group">
        <button id="copy-body"><i class="fas fa-copy"></i> ${translations[currentLanguage]['copy-body']}</button>
        <button id="default-client"><i class="fas fa-envelope"></i> ${translations[currentLanguage]['default-email-client']}</button>
        <button id="gmail"><i class="fab fa-google"></i> Gmail</button>
        <button id="outlook"><i class="fab fa-microsoft"></i> Outlook</button>
        <button id="cancel"><i class="fas fa-times"></i> ${translations[currentLanguage]['cancel']}</button>
      </div>
    </div>
    `;
      document.body.appendChild(overlay);

      const dialog = document.createElement('div');
      dialog.innerHTML = `
      <div class="email-options">
        <h3>${translations[currentLanguage]['email-instructions-title']}</h3>
        <p>${translations[currentLanguage]['email-instructions']}</p>
        <p><strong>${translations[currentLanguage]['to']}:</strong> ${yourEmail}</p>
        <p><strong>${translations[currentLanguage]['subject']}:</strong> ${decodeURIComponent(subject)}</p>
        <p><strong>${translations[currentLanguage]['body']}:</strong></p>
        <textarea id="message-body" readonly rows="10" cols="50">${message}</textarea>
        <button id="copy-body">${translations[currentLanguage]['copy-body']}</button>
        <button id="default-client">${translations[currentLanguage]['default-email-client']}</button>
        <button id="gmail">Gmail</button>
        <button id="outlook">Outlook</button>
        <button id="cancel">${translations[currentLanguage]['cancel']}</button>
      </div>
    `;
      document.body.appendChild(dialog);

      document.getElementById('copy-body').addEventListener('click', () => {
        const textarea = document.getElementById('message-body');
        textarea.select();
        document.execCommand('copy');
        alert(translations[currentLanguage]['body-copied']);
      });

      const mailtoLink = `mailto:${yourEmail}?subject=${subject}&body=${encodeURIComponent(message)}`;
      const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${yourEmail}&su=${subject}&body=${encodeURIComponent(message)}`;
      const outlookLink = `https://outlook.live.com/mail/0/deeplink/compose?to=${yourEmail}&subject=${subject}&body=${encodeURIComponent(message)}`;

      function handleEmailAction(action) {
        action();
        document.body.removeChild(dialog);
        form.reset(); 
      }

      document.getElementById('cancel').addEventListener('click', () => {
        document.body.removeChild(overlay);
      });

      document.getElementById('default-client').addEventListener('click', () => {
        handleEmailAction(() => { window.location.href = mailtoLink; });
      });
      document.getElementById('gmail').addEventListener('click', () => {
        handleEmailAction(() => { window.open(gmailLink, '_blank'); });
      });
      document.getElementById('outlook').addEventListener('click', () => {
        handleEmailAction(() => { window.open(outlookLink, '_blank'); });
      });
      document.getElementById('cancel').addEventListener('click', () => {
        document.body.removeChild(dialog);
      });
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

  messageTextarea.addEventListener('input', function () {
    const remainingChars = 3000 - this.value.length;
    charCount.textContent = this.value.length;

    if (remainingChars < 0) {
      this.value = this.value.slice(0, 3000);
      charCount.textContent = 3000;
    }
  });

  // Load projects and initialize carousels
  function loadAndInitProjects() {
    loadProjects(currentLanguage)
      .then(() => {
        console.log('Projects loaded successfully');
      })
      .catch(error => {
        console.error('Error loading projects:', error);
      });
  }

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
    updateHighlightItems();
    updateAboutDescription();
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

  initializeTranslations();
  updateHighlightItems();
  loadAndInitProjects();
});