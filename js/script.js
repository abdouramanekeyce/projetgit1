// ==================== NAVIGATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
      });
    });
  }

  // Marquer le lien actif
  const currentPage = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '/' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// ==================== SCROLL ANIMATIONS ==================== 
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeInUp 0.8s ease-out forwards`;
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer les cartes et sections
document.querySelectorAll('.card, .stat-card, .image-section').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ==================== PARALLAX EFFECT ==================== 
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  parallaxElements.forEach(el => {
    const speed = el.getAttribute('data-parallax') || 0.5;
    el.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ==================== COUNTER ANIMATION ==================== 
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Observer pour les compteurs
const counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const number = parseInt(entry.target.textContent);
      animateCounter(entry.target, number);
      entry.target.dataset.animated = 'true';
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  counterObserver.observe(el);
});

// ==================== SMOOTH SCROLL LINKS ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==================== SCROLL INDICATOR ==================== 
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 100) {
      scrollIndicator.style.opacity = '0';
    } else {
      scrollIndicator.style.opacity = '1';
    }
  });
}

// ==================== MOUSE MOVE EFFECT ==================== 
document.addEventListener('mousemove', function(e) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
});

// Reset on mouse leave
document.addEventListener('mouseleave', function() {
  document.querySelectorAll('.card').forEach(card => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  });
});

// ==================== LAZY LOADING IMAGES ==================== 
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================== FORM HANDLING ==================== 
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validation simple
    const inputs = this.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    
    if (isValid) {
      // Afficher un message de succès
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = 'Merci ! Votre message a été envoyé avec succès.';
      successMsg.style.cssText = `
        background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        animation: slideInUp 0.5s ease-out;
      `;
      this.appendChild(successMsg);
      
      // Réinitialiser le formulaire
      this.reset();
      
      // Supprimer le message après 3 secondes
      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    }
  });
}

// ==================== SCROLL TO TOP BUTTON ==================== 
const scrollTopBtn = document.querySelector('.scroll-to-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.display = 'block';
      scrollTopBtn.style.animation = 'fadeIn 0.3s ease-out';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });

  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ==================== DYNAMIC BACKGROUND ==================== 
function createFloatingElements() {
  const container = document.querySelector('body');
  const elementCount = 5;
  
  for (let i = 0; i < elementCount; i++) {
    const float = document.createElement('div');
    float.className = 'floating-element';
    float.style.cssText = `
      position: fixed;
      width: ${Math.random() * 100 + 50}px;
      height: ${Math.random() * 100 + 50}px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: float ${Math.random() * 20 + 20}s infinite ease-in-out;
    `;
    container.appendChild(float);
  }
}

createFloatingElements();

// ==================== PERFORMANCE OPTIMIZATION ==================== 
// Debounce function pour les événements scroll/resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==================== PAGE TRANSITION ==================== 
document.querySelectorAll('a').forEach(link => {
  if (link.getAttribute('href') && !link.getAttribute('href').startsWith('#')) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href.startsWith('http') && !href.startsWith('mailto')) {
        e.preventDefault();
        document.body.style.opacity = '0.5';
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  }
});

console.log('🌍 EcoWatch - Site Écologie Groupe1B3 chargé avec succès!');

