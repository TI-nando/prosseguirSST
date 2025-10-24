// Header Auto-Hide Functionality
class HeaderAutoHide {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 10; // Pixels mínimos para detectar rolagem
        this.hideTimeout = null;
        this.isScrolling = false;
        
        if (!this.header) return;
        
        this.init();
    }
    
    init() {
        this.setupScrollListener();
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);
        
        // Se a rolagem for muito pequena, ignora
        if (scrollDifference < this.scrollThreshold) return;
        
        // Detecta se está rolando
        this.isScrolling = true;
        
        // Limpa timeout anterior
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }
        
        // Calcula a altura da primeira seção (hero) - 100vh
        const heroHeight = window.innerHeight;
        
        // Se está na primeira seção (hero), mantém o header visível
        if (currentScrollY <= heroHeight) {
            this.showHeader();
            this.lastScrollY = currentScrollY;
            return;
        }
        
        // Quando está rolando fora da primeira seção, mostra o header
        this.showHeader();
        
        // Define timeout para esconder quando parar de rolar (fora da primeira seção)
        this.hideTimeout = setTimeout(() => {
            this.isScrolling = false;
            // Se não estiver na primeira seção, esconde quando para de rolar
            if (window.scrollY > heroHeight) {
                this.hideHeader();
            }
        }, 300); // 300ms após parar de rolar
        
        this.lastScrollY = currentScrollY;
    }
    
    hideHeader() {
        this.header.classList.add('hidden');
        this.header.classList.remove('visible');
    }
    
    showHeader() {
        this.header.classList.add('visible');
        this.header.classList.remove('hidden');
    }
}

// Galeria de Imagens com Slider Automático
class GallerySlider {
    constructor() {
        this.track = document.querySelector('.gallery-track');
        this.slides = document.querySelectorAll('.gallery-slide');
        this.prevBtn = document.querySelector('.gallery-prev');
        this.nextBtn = document.querySelector('.gallery-next');
        this.container = document.querySelector('.gallery-slider');
        
        if (!this.track || !this.slides.length) return;
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.isPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 segundos
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoPlay();
        this.updateSlider();
    }
    
    setupEventListeners() {
        // Navegação com botões
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Pause no hover
        this.container?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container?.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/Swipe para dispositivos móveis
        let startX = 0;
        let endX = 0;
        
        this.container?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar swipe
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
    
    updateSlider() {
        if (!this.track) return;
        
        const translateX = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar acessibilidade
        this.slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                img.setAttribute('aria-hidden', index !== this.currentIndex);
            }
        });
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlider();
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.resetAutoPlay();
    }
    
    startAutoPlay() {
        if (!this.isPlaying) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        this.isPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        this.isPlaying = true;
        this.startAutoPlay();
    }
    
    resetAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        if (this.isPlaying) {
            this.startAutoPlay();
        }
    }
}

// Inicializar galeria quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new GallerySlider();
    new HeaderAutoHide(); // Inicializar funcionalidade de auto-hide do header
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
    
    // Smooth Scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-category, .differential-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Reset button after form submission (whether success or error)
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveNavLink);
    
    // Parallax effect for hero section (optional enhancement)
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (hero && heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
        });
    }
    
    // Scroll to top functionality (optional)
    let scrollToTopButton = null;
    
    function createScrollToTopButton() {
        scrollToTopButton = document.createElement('button');
        scrollToTopButton.innerHTML = '↑';
        scrollToTopButton.className = 'scroll-to-top';
        scrollToTopButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-green);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        scrollToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollToTopButton);
    }
    
    // Show/hide scroll to top button
    function toggleScrollToTopButton() {
        if (!scrollToTopButton) {
            createScrollToTopButton();
        }
        
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    }
    
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    // Form validation enhancement
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing error styling
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validate based on field type
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            showFieldError(field, 'Este campo é obrigatório');
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            showFieldError(field, 'Por favor, insira um e-mail válido');
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
            showFieldError(field, 'Por favor, insira um telefone válido');
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e53e3e;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        field.parentNode.appendChild(errorElement);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    // Add error styles to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #e53e3e;
            box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
        
        .scroll-to-top:hover {
            background-color: var(--dark-green) !important;
            transform: translateY(-2px);
        }
        
        .nav-link.active {
            color: var(--primary-green);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);
});

// Utility function for debouncing scroll events
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

// Performance optimization for scroll events
const debouncedScroll = debounce(() => {
    // Any additional scroll-based functionality can be added here
}, 10);