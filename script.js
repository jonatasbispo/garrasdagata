/**
 * Script melhorado para Studio de Unhas
 * Funcionalidades: navegação suave, animações, validação de formulário,
 * carrossel interativo e melhorias de UX
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 80,
    carouselInterval: 4000,
    fadeInThreshold: 0.1,
    whatsappNumber: '5511999999999'
  };
  
  // ===== UTILITÁRIOS =====
  const Utils = {
    // Debounce para otimizar performance
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  
    // Throttle para controlar frequência
    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
  
    // Verificar se elemento está visível
    isElementInViewport(el, threshold = 0) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      return (
        rect.top >= -threshold &&
        rect.bottom <= windowHeight + threshold
      );
    },
  
    // Smooth scroll
    smoothScrollTo(target, offset = 0) {
      const element = document.querySelector(target);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    },
  
    // Formatar telefone
    formatPhone(phone) {
      const cleaned = phone.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return phone;
    },
  
    // Validar email
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  };
  
  // ===== NAVEGAÇÃO =====
  class Navigation {
    constructor() {
      this.navbar = document.querySelector('#mainNavbar');
      this.navLinks = document.querySelectorAll('.nav-link');
      this.init();
    }
  
    init() {
      this.setupSmoothScrolling();
      this.setupActiveNavigation();
      this.setupScrollEffects();
      this.setupMobileNavigation();
    }
  
    setupSmoothScrolling() {
      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            Utils.smoothScrollTo(href, CONFIG.scrollOffset);
            
            // Fechar menu mobile
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
              const navbarToggler = document.querySelector('.navbar-toggler');
              navbarToggler.click();
            }
          }
        });
      });
  
      // Scroll suave para botão de scroll down
      const scrollDown = document.querySelector('.scroll-down');
      if (scrollDown) {
        scrollDown.addEventListener('click', (e) => {
          e.preventDefault();
          Utils.smoothScrollTo('#sobre', CONFIG.scrollOffset);
        });
      }
    }
  
    setupActiveNavigation() {
      const sections = document.querySelectorAll('section[id]');
      const observerOptions = {
        rootMargin: `-${CONFIG.scrollOffset}px 0px -50% 0px`,
        threshold: 0
      };
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.setActiveNavLink(entry.target.id);
          }
        });
      }, observerOptions);
  
      sections.forEach(section => observer.observe(section));
    }
  
    setActiveNavLink(activeId) {
      this.navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        }
      });
    }
  
    setupScrollEffects() {
      const handleScroll = Utils.throttle(() => {
        const scrollTop = window.pageYOffset;
        
        // Efeito na navbar
        if (scrollTop > 50) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
      }, 10);
  
      window.addEventListener('scroll', handleScroll);
    }
  
    setupMobileNavigation() {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');
  
      if (navbarToggler && navbarCollapse) {
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
          if (!navbarToggler.contains(e.target) && 
              !navbarCollapse.contains(e.target) && 
              navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
          }
        });
      }
    }
  }
  
  // ===== CARROSSEL =====
  class CarouselManager {
    constructor() {
      this.carousel = document.querySelector('#portfolioCarousel');
      this.init();
    }
  
    init() {
      if (!this.carousel) return;
  
      this.setupKeyboardNavigation();
      this.setupTouchGestures();
      this.setupAutoplayControl();
    }
  
    setupKeyboardNavigation() {
      this.carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.previousSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSlide();
        }
      });
  
      this.carousel.setAttribute('tabindex', '0');
    }
  
    setupTouchGestures() {
      let startX = 0;
      let endX = 0;
  
      this.carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });
  
      this.carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        this.handleSwipe();
      });
    }
  
    handleSwipe() {
      const threshold = 50;
      const diff = startX - endX;
  
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    }
  
    previousSlide() {
      const prevButton = this.carousel.querySelector('.carousel-control-prev');
      if (prevButton) prevButton.click();
    }
  
    nextSlide() {
      const nextButton = this.carousel.querySelector('.carousel-control-next');
      if (nextButton) nextButton.click();
    }
  
    setupAutoplayControl() {
      let isPlaying = true;
      
      // Pausar ao passar o mouse
      this.carousel.addEventListener('mouseenter', () => {
        if (isPlaying) {
          const bsCarousel = bootstrap.Carousel.getInstance(this.carousel);
          if (bsCarousel) bsCarousel.pause();
        }
      });
  
      // Retomar ao sair o mouse
      this.carousel.addEventListener('mouseleave', () => {
        if (isPlaying) {
          const bsCarousel = bootstrap.Carousel.getInstance(this.carousel);
          if (bsCarousel) bsCarousel.cycle();
        }
      });
    }
  }
  
  // ===== FORMULÁRIO DE CONTATO =====
  class ContactForm {
    constructor() {
      this.form = document.querySelector('.contact-form');
      this.init();
    }
  
    init() {
      if (!this.form) return;
  
      this.setupValidation();
      this.setupSubmission();
      this.setupPhoneFormatting();
    }
  
    setupValidation() {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', Utils.debounce(() => this.validateField(input), 300));
      });
    }
  
    validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let message = '';
  
      // Remover classes anteriores
      field.classList.remove('is-valid', 'is-invalid');
  
      switch (field.type) {
        case 'email':
          isValid = Utils.validateEmail(value);
          message = isValid ? '' : 'Por favor, insira um e-mail válido.';
          break;
        
        case 'tel':
          const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
          isValid = phoneRegex.test(value) || value.length === 0;
          message = isValid ? '' : 'Formato: (11) 99999-9999';
          break;
        
        case 'text':
          isValid = value.length >= 2;
          message = isValid ? '' : 'Nome deve ter pelo menos 2 caracteres.';
          break;
        
        default:
          if (field.tagName.toLowerCase() === 'select') {
            isValid = value !== '';
            message = isValid ? '' : 'Por favor, selecione um serviço.';
          } else if (field.tagName.toLowerCase() === 'textarea') {
            // Textarea é opcional
            isValid = true;
          }
      }
  
      // Aplicar classes de validação
      if (field.hasAttribute('required') && value === '') {
        field.classList.add('is-invalid');
      } else if (value !== '') {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
      }
      
      // Atualizar mensagem de feedback
      const feedback = field.parentNode.querySelector('.invalid-feedback');
      if (feedback && message) {
        feedback.textContent = message;
      }
  
      return isValid;
    }
  
    setupPhoneFormatting() {
      const phoneInput = this.form.querySelector('#phone');
      if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
          const value = e.target.value.replace(/\D/g, '');
          e.target.value = Utils.formatPhone(value);
        });
      }
    }
  
    setupSubmission() {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isFormValid = true;
  
        // Validar todos os campos obrigatórios
        inputs.forEach(input => {
          if (!this.validateField(input) || input.value.trim() === '') {
            isFormValid = false;
          }
        });
  
        if (isFormValid) {
          this.submitForm();
        } else {
          this.showError('Por favor, preencha todos os campos obrigatórios corretamente.');
        }
      });
    }
  
    async submitForm() {
      const submitButton = this.form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Estado de loading
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';
  
      try {
        // Coletar dados do formulário
        const formData = new FormData(this.form);
        const data = {
          name: this.form.querySelector('#name').value,
          phone: this.form.querySelector('#phone').value,
          service: this.form.querySelector('#service').value,
          message: this.form.querySelector('#message').value || 'Gostaria de agendar um horário.'
        };
  
        // Simular envio e redirecionar para WhatsApp
        await this.simulateSubmission();
        
        // Criar mensagem para WhatsApp
        const whatsappMessage = this.createWhatsAppMessage(data);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        this.showSuccess('Redirecionando para o WhatsApp...');
        this.form.reset();
        this.clearValidationClasses();
        
      } catch (error) {
        this.showError('Erro ao processar solicitação. Tente novamente.');
      } finally {
        // Restaurar botão
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }, 2000);
      }
    }
  
    createWhatsAppMessage(data) {
      return `Olá! Gostaria de agendar um horário.
  
  *Nome:* ${data.name}
  *Telefone:* ${data.phone}
  *Serviço:* ${data.service}
  *Mensagem:* ${data.message}
  
  Aguardo retorno para confirmar o agendamento. Obrigada!`;
    }
  
    simulateSubmission() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });
    }
  
    showSuccess(message) {
      this.showAlert(message, 'success');
    }
  
    showError(message) {
      this.showAlert(message, 'danger');
    }
  
    showAlert(message, type) {
      // Remover alertas existentes
      const existingAlert = this.form.querySelector('.alert');
      if (existingAlert) {
        existingAlert.remove();
      }
  
      // Criar novo alerta
      const alert = document.createElement('div');
      alert.className = `alert alert-${type} alert-dismissible fade show`;
      alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
  
      this.form.insertBefore(alert, this.form.firstChild);
  
      // Auto-remover após 5 segundos
      setTimeout(() => {
        if (alert.parentNode) {
          alert.remove();
        }
      }, 5000);
    }
  
    clearValidationClasses() {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
      });
    }
  }
  
  // ===== ANIMAÇÕES =====
  class AnimationManager {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupFadeInAnimations();
      this.setupCounterAnimations();
      this.setupParallaxEffects();
    }
  
    setupFadeInAnimations() {
      const elements = document.querySelectorAll('.fade-in, .service-card, .testimonial-card, .portfolio-item');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
          }
        });
      }, {
        threshold: CONFIG.fadeInThreshold,
        rootMargin: '0px 0px -50px 0px'
      });
  
      elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
      });
    }
  
    setupCounterAnimations() {
      const experienceBadge = document.querySelector('.badge-number');
      if (experienceBadge) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.animateCounter(entry.target, 5, 2000);
              observer.unobserve(entry.target);
            }
          });
        });
  
        observer.observe(experienceBadge);
      }
    }
  
    animateCounter(element, target, duration) {
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start) + '+';
        
        if (start >= target) {
          element.textContent = target + '+';
          clearInterval(timer);
        }
      }, 16);
    }
  
    setupParallaxEffects() {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const handleScroll = Utils.throttle(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.5;
          heroSection.style.transform = `translateY(${rate}px)`;
        }, 10);
  
        window.addEventListener('scroll', handleScroll);
      }
    }
  }
  
  // ===== GALERIA =====
  class GalleryManager {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupGalleryHover();
      this.setupLightbox();
    }
  
    setupGalleryHover() {
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.transform = 'scale(1)';
        });
      });
    }
  
    setupLightbox() {
      const galleryItems = document.querySelectorAll('.gallery-item img');
      
      galleryItems.forEach(img => {
        img.addEventListener('click', () => {
          this.openLightbox(img.src, img.alt);
        });
        
        img.style.cursor = 'pointer';
      });
    }
  
    openLightbox(src, alt) {
      // Criar modal simples para visualizar imagem
      const modal = document.createElement('div');
      modal.className = 'lightbox-modal';
      modal.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img src="${src}" alt="${alt}" class="lightbox-image">
        </div>
      `;
      
      // Estilos inline para o modal
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      const content = modal.querySelector('.lightbox-content');
      content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
      `;
      
      const closeBtn = modal.querySelector('.lightbox-close');
      closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        z-index: 10000;
      `;
      
      const image = modal.querySelector('.lightbox-image');
      image.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        border-radius: 8px;
      `;
      
      document.body.appendChild(modal);
      
      // Animar entrada
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
      
      // Fechar modal
      const closeModal = () => {
        modal.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      };
      
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }
  }
  
  // ===== PERFORMANCE =====
  class PerformanceManager {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupLazyLoading();
      this.setupReducedMotion();
      this.setupKeyboardNavigation();
    }
  
    setupLazyLoading() {
      const images = document.querySelectorAll('img[data-src]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('loading');
              imageObserver.unobserve(img);
            }
          });
        });
  
        images.forEach(img => imageObserver.observe(img));
      }
    }
  
    setupReducedMotion() {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-base', 'none');
        
        // Desabilitar animações CSS
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });
  
      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });
    }
  }
  
  // ===== WHATSAPP INTEGRATION =====
  class WhatsAppManager {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupFloatingButton();
      this.setupQuickActions();
    }
  
    setupFloatingButton() {
      const floatingBtn = document.querySelector('.whatsapp-float a');
      if (floatingBtn) {
        floatingBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openWhatsApp('Olá! Gostaria de agendar um horário para cuidar das minhas unhas. 💅');
        });
      }
    }
  
    setupQuickActions() {
      const agendarButtons = document.querySelectorAll('a[href*="wa.me"]');
      
      agendarButtons.forEach(btn => {
        if (!btn.classList.contains('whatsapp-float')) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openWhatsApp('Olá! Gostaria de agendar um horário. Quando vocês têm disponibilidade?');
          });
        }
      });
    }
  
    openWhatsApp(message) {
      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  }
  
  // ===== INICIALIZAÇÃO =====
  class App {
    constructor() {
      this.init();
    }
  
    init() {
      // Aguardar DOM estar pronto
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
      } else {
        this.initializeComponents();
      }
    }
  
    initializeComponents() {
      try {
        // Inicializar componentes
        new Navigation();
        new CarouselManager();
        new ContactForm();
        new AnimationManager();
        new GalleryManager();
        new PerformanceManager();
        new WhatsAppManager();
  
        // Configurar tooltips do Bootstrap
        this.initializeTooltips();
        
        console.log('✅ Studio de Unhas - Aplicação inicializada com sucesso');
      } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
      }
    }
  
    initializeTooltips() {
      // Inicializar tooltips do Bootstrap se existirem
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }
  
  // ===== INICIALIZAR APLICAÇÃO =====
  new App();
  
  // ===== EXPORTAR PARA TESTES (SE NECESSÁRIO) =====
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      Utils,
      Navigation,
      CarouselManager,
      ContactForm,
      AnimationManager,
      GalleryManager,
      PerformanceManager,
      WhatsAppManager
    };
  }