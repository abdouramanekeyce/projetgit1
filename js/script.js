// ==================== NAVIGATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      // MODIFICATION 1 : Animation du bouton menu
      this.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      });
    });

    // MODIFICATION 2 : Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.textContent = '☰';
      }
    });
  }

  // Marquer le lien actif
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// ==================== SCROLL ANIMATIONS ==================== 
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`;
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observer les cartes et sections
document.querySelectorAll('.card, .stat-card, .image-section, .footer-section').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ==================== COUNTER ANIMATION ==================== 
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  // MODIFICATION 3 : Gestion des suffixes (M, B, T)
  const suffix = element.textContent.replace(/[0-9]/g, '');
  const numericTarget = parseFloat(element.textContent);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= numericTarget) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

// Observer pour les compteurs
const counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const text = entry.target.textContent;
      const number = parseFloat(text);
      animateCounter(entry.target, number);
      entry.target.dataset.animated = 'true';
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 }); // MODIFICATION 4 : Seuil réduit pour déclenchement plus tôt

document.querySelectorAll('.stat-number').forEach(el => {
  counterObserver.observe(el);
});

// ==================== SMOOTH SCROLL ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      // MODIFICATION 5 : Calcul de la position avec offset pour la navigation fixe
      const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
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
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  });
}

// ==================== MOUSE MOVE EFFECT ==================== 
// MODIFICATION 6 : Effet de souris optimisé pour les performances
let mouseMoveEnabled = true;

// Vérifier les préférences de réduction des animations
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  mouseMoveEnabled = false;
}

if (mouseMoveEnabled) {
  const mouseMoveHandler = function(e) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 25; // MODIFICATION 7 : Effet plus subtil
      const rotateY = (centerX - x) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
  };

  // Utiliser throttle pour les performances
  const throttledMouseMove = throttle(mouseMoveHandler, 50);
  document.addEventListener('mousemove', throttledMouseMove);

  // Reset on mouse leave
  document.addEventListener('mouseleave', function() {
    document.querySelectorAll('.card').forEach(card => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

// ==================== FORM HANDLING ==================== 
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // MODIFICATION 8 : Validation améliorée
    const inputs = this.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        isValid = false;
        
        // Ajouter un message d'erreur
        let errorMsg = input.parentNode.querySelector('.error-message');
        if (!errorMsg) {
          errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          `;
          input.parentNode.appendChild(errorMsg);
        }
        errorMsg.textContent = 'Ce champ est obligatoire';
      } else {
        input.style.borderColor = '';
        const errorMsg = input.parentNode.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
      }
    });

    // Validation email
    const emailInput = this.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        emailInput.style.borderColor = '#ef4444';
        isValid = false;
      }
    }
    
    if (isValid) {
      // Afficher le message de succès existant
      const successMsg = document.getElementById('formMessage');
      if (successMsg) {
        successMsg.style.display = 'block';
        
        // Réinitialiser le formulaire
        this.reset();
        
        // MODIFICATION 9 : Masquer le message après 5 secondes
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      }
    }
  });

  // MODIFICATION 10 : Effacer les erreurs en temps réel
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      const errorMsg = this.parentNode.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    });
  });
}

// ==================== SCROLL TO TOP BUTTON ==================== 
const scrollTopBtn = document.querySelector('.scroll-to-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.display = 'block';
      setTimeout(() => {
        scrollTopBtn.style.opacity = '1';
      }, 10);
    } else {
      scrollTopBtn.style.opacity = '0';
      setTimeout(() => {
        scrollTopBtn.style.display = 'none';
      }, 300);
    }
  });

  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // MODIFICATION 11 : Effet hover sur le bouton
  scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}

// ==================== FAQ INTERACTION ==================== 
// MODIFICATION 12 : Fonctionnalité FAQ améliorée
document.querySelectorAll('.faq-item, [onclick*="faq-answer"]').forEach(item => {
  // Retirer l'ancien gestionnaire onclick
  const originalOnClick = item.getAttribute('onclick');
  if (originalOnClick) {
    item.removeAttribute('onclick');
  }
  
  item.addEventListener('click', function() {
    const answer = this.querySelector('.faq-answer');
    const arrow = this.querySelector('span');
    
    if (answer && arrow) {
      const isVisible = answer.style.display === 'block';
      
      // Fermer toutes les autres FAQs
      document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
        if (otherAnswer !== answer) {
          otherAnswer.style.display = 'none';
        }
      });
      
      // Mettre à jour toutes les flèches
      document.querySelectorAll('[onclick*="faq-answer"] span, .faq-item span').forEach(otherArrow => {
        if (otherArrow !== arrow) {
          otherArrow.textContent = '▼';
        }
      });
      
      // Basculer l'état actuel
      answer.style.display = isVisible ? 'none' : 'block';
      arrow.textContent = isVisible ? '▼' : '▲';
      arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  });
});

// ==================== PERFORMANCE OPTIMIZATION ==================== 
// Debounce function
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

// MODIFICATION 13 : Optimisation des événements de scroll
const optimizedScroll = debounce(function() {
  // Code qui nécessite d'être exécuté au scroll
}, 10);

window.addEventListener('scroll', optimizedScroll);

// ==================== LAZY LOADING IMAGES ==================== 
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('img[data-src]').forEach(img => {
    img.classList.add('lazy');
    imageObserver.observe(img);
  });
}

// ==================== DYNAMIC YEAR UPDATE ==================== 
// MODIFICATION 14 : Mise à jour automatique de l'année dans le footer
const currentYear = new Date().getFullYear();
document.querySelectorAll('.footer-bottom p').forEach(p => {
  if (p.textContent.includes('2024')) {
    p.textContent = p.textContent.replace('2024', currentYear);
  }
});

// ==================== LOADING STATES ==================== 
// MODIFICATION 15 : États de chargement pour les boutons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
      this.classList.add('loading');
      this.innerHTML = '⏳ ' + this.textContent;
      
      setTimeout(() => {
        this.classList.remove('loading');
        this.innerHTML = this.textContent.replace('⏳ ', '');
      }, 1500);
    }
  });
});

console.log('🌍 EcoWatch - Site Écologie Groupe1B3 chargé avec succès!');

// MODIFICATION 16 : Ajout des animations CSS manquantes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(180deg);
    }
  }
  
  .lazy {
    opacity: 0;
    transition: opacity 0.3s ease-in;
  }
  
  .loaded {
    opacity: 1;
  }
  
  .btn.loading {
    opacity: 0.7;
    pointer-events: none;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;
document.head.appendChild(style);