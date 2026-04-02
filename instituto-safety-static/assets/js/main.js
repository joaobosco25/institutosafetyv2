/**
 * Instituto Safety - JavaScript Principal
 * Substitui funcionalidades do Elementor/WordPress para o site estático
 */

(function() {
    'use strict';

    // ===== STICKY HEADER =====
    function initStickyHeader() {
        const header = document.querySelector('.elementor-69, .elementor-location-header');
        if (!header) return;
        
        header.style.position = 'sticky';
        header.style.top = '0';
        header.style.zIndex = '9999';
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            }
        });
    }

    // ===== MENU HAMBURGUER MOBILE =====
    function initMobileMenu() {
        const toggleBtn = document.querySelector('.eael-simple-menu-toggle');
        const menuContainer = document.querySelector('.eael-simple-menu-container');
        const menu = document.querySelector('.eael-simple-menu');
        
        if (!toggleBtn || !menu) return;
        
        toggleBtn.addEventListener('click', function() {
            const isOpen = menu.classList.contains('open');
            if (isOpen) {
                menu.classList.remove('open');
                menu.style.display = 'none';
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                menu.classList.add('open');
                menu.style.display = 'flex';
                toggleBtn.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Fechar menu ao clicar em um link
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menu.classList.remove('open');
                menu.style.display = '';
            });
        });
    }

    // ===== SMOOTH SCROLL PARA ÂNCORAS =====
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href*="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = link.getAttribute('href');
                if (!href) return;
                
                // Extrair o hash
                const hashIndex = href.indexOf('#');
                if (hashIndex === -1) return;
                
                const hash = href.substring(hashIndex);
                const target = document.querySelector(hash);
                
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.elementor-69')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== SLIDER HERO (SWIPER) =====
    function initHeroSlider() {
        // Verificar se existe um slider na página
        const sliderEl = document.querySelector('.elementor-element-019b3e0 .swiper, .eael-slider-wrapper .swiper');
        
        if (typeof Swiper !== 'undefined' && sliderEl) {
            new Swiper(sliderEl, {
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                effect: 'fade',
            });
        }
    }

    // ===== ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER) =====
    function initAnimations() {
        if (!('IntersectionObserver' in window)) return;
        
        const animatedElements = document.querySelectorAll('.elementor-invisible, [data-settings*="animation"]');
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('elementor-invisible');
                    entry.target.classList.add('animated', 'fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ===== LAZY LOADING DE IMAGENS =====
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src], img.lazyload');
        
        if (!lazyImages.length) return;
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        img.classList.remove('lazyload');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores sem IntersectionObserver
            lazyImages.forEach(function(img) {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            });
        }
    }

    // ===== ACTIVE STATE DO MENU =====
    function initActiveMenu() {
        const currentPath = window.location.pathname;
        const menuLinks = document.querySelectorAll('.eael-simple-menu a, .elementor-icon-list-item a');
        
        menuLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.replace(/^\.\.\//, '').replace(/index\.html$/, ''))) {
                link.parentElement.classList.add('current-menu-item');
            }
        });
    }

    // ===== ACCORDION / TABS =====
    function initAccordion() {
        const accordionItems = document.querySelectorAll('.elementor-accordion-item');
        
        accordionItems.forEach(function(item) {
            const title = item.querySelector('.elementor-tab-title');
            const content = item.querySelector('.elementor-tab-content');
            
            if (title && content) {
                title.addEventListener('click', function() {
                    const isActive = item.classList.contains('elementor-active');
                    
                    // Fechar todos
                    accordionItems.forEach(function(i) {
                        i.classList.remove('elementor-active');
                        const c = i.querySelector('.elementor-tab-content');
                        if (c) c.style.display = 'none';
                    });
                    
                    // Abrir o clicado se não estava ativo
                    if (!isActive) {
                        item.classList.add('elementor-active');
                        content.style.display = 'block';
                    }
                });
            }
        });
    }

    // ===== INICIALIZAR TUDO =====
    document.addEventListener('DOMContentLoaded', function() {
        initStickyHeader();
        initMobileMenu();
        initSmoothScroll();
        initHeroSlider();
        initAnimations();
        initLazyLoading();
        initActiveMenu();
        initAccordion();
        
        console.log('Instituto Safety - Site estático inicializado');
    });

})();
