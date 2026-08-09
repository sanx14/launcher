// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');

// ===== Navbar Scroll Effect =====
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
  const isActive = hamburger.classList.contains('active');
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = isActive ? '' : 'hidden';
}

hamburger.addEventListener('click', toggleMobileMenu);

// ===== Navigation State Variables =====
const sections = document.querySelectorAll('section[id]');
let currentActiveSection = 'home';

// Close mobile menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', function(e) {
    // Immediately update active state on clicked button
    document.querySelectorAll('.nav-link').forEach((navLink) => {
      navLink.classList.remove('active');
    });
    this.classList.add('active');
    currentActiveSection = this.getAttribute('href').replace('#', '');
    
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
  const isClickInsideNav = navLinks.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);
  
  if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navLinks.classList.contains('active')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== Active Nav Link on Scroll =====

function handleActiveNav() {
  const scrollPosition = window.scrollY + 120;

  let newActiveSection = 'home';

  // Find the current section based on scroll position
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionBottom = sectionTop + sectionHeight;

    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      newActiveSection = section.getAttribute('id');
    }
  });

  // Update active nav link if changed
  if (newActiveSection !== currentActiveSection) {
    currentActiveSection = newActiveSection;
    
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      const shouldBeActive = href === `#${currentActiveSection}`;
      
      if (shouldBeActive) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ===== Back to Top Button =====
function handleBackToTop() {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Animated Counters =====
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const duration = 2000;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic for a smooth deceleration
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easedProgress * target);

    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(updateCounter);
}

// ===== Skill Bars Animation =====
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach((bar) => {
    const width = bar.getAttribute('data-width');
    if (width) {
      bar.style.width = width;
    }
  });
}

// ===== Scroll Reveal =====
function setupScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .about-text, .skills-grid, .projects-grid, .contact-details, .project-card'
  );

  revealElements.forEach((element) => {
    element.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
  
  // Immediately show skill cards so blue bars are visible
  setTimeout(() => {
    document.querySelectorAll('.skill-card').forEach((card) => {
      card.classList.add('visible');
    });
  }, 100);
}

// ===== Stats Observer (triggers counter animation once) =====
function setupStatsAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
}

// ===== Skills Observer (triggers bar animation once) =====
function setupSkillsAnimation() {
  const skillsSection = document.querySelector('.skills-grid');
  let skillsAnimated = false;

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          // Wait for reveal animation to complete, then animate bars
          setTimeout(() => {
            animateSkillBars();
          }, 400);
          skillsObserver.disconnect();
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
  );

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
}

// ===== Contact Form Handling =====
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }

  // Simulate form submission (replace with actual API call in production)
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;

  setTimeout(() => {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    contactForm.reset();
    showFormMessage('Your message has been sent successfully!', 'success');
  }, 1500);
  });
}

// ===== Form Message Helper =====
function showFormMessage(text, type) {
  // Remove any existing message
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const message = document.createElement('p');
  message.className = `form-message ${type}`;
  message.textContent = text;

  if (contactForm) {
    contactForm.appendChild(message);
  }

  // Auto-remove after 5 seconds
  setTimeout(() => {
    message.remove();
  }, 5000);
}

// ===== Scroll Event Handler =====
function handleScroll() {
  handleNavbarScroll();
  handleActiveNav();
  handleBackToTop();
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== Login System =====
function showLogin() {
  document.getElementById('loginOverlay').classList.add('active');
}

function checkLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  if (username === 'sanx' && password === 'sanjeeveeabhi') {
    // Hide login overlay
    document.getElementById('loginOverlay').classList.remove('active');
    // Show APK page
    document.getElementById('apkPage').classList.add('active');
    // Hide main content
    document.querySelector('nav').style.display = 'none';
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#about').style.display = 'none';
    document.querySelector('#skills').style.display = 'none';
    document.querySelector('#projects').style.display = 'none';
    document.querySelector('#contact').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
  } else {
    alert('Invalid username or password!');
  }
}

function closeLogin() {
  document.getElementById('loginOverlay').classList.remove('active');
}

// Allow Enter key to submit login
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('loginOverlay').classList.contains('active')) {
    checkLogin();
  }
});

// ===== Initialize =====
function init() {
  handleNavbarScroll();
  handleBackToTop();
  setupScrollReveal();
  setupStatsAnimation();
  setupSkillsAnimation();
  
  // Close login button
  const loginClose = document.getElementById('loginClose');
  if (loginClose) {
    loginClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeLogin();
    });
  }
  
  // Immediately show all skill bars with blue proficiency lines
  setTimeout(() => {
    // First, make sure skill cards are visible
    document.querySelectorAll('.skill-card').forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    
    // Then set the skill bar widths
    document.querySelectorAll('.skill-fill').forEach((bar) => {
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.transition = 'none';
        bar.style.width = width;
      }
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', init);
