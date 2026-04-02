
(() => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.site-nav__toggle');
  const navMenu = document.querySelector('.site-nav__menu');
  const navLinks = document.querySelectorAll('.site-nav__menu a, .site-footer__links a, .site-footer__legal a');

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 50);
  };

  const closeMenu = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href') || '';
      if (href.includes('#')) {
        const hash = href.substring(href.indexOf('#'));
        const target = document.querySelector(hash);
        if (target) {
          event.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top, behavior: 'smooth' });
          closeMenu();
        }
      } else {
        closeMenu();
      }
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const menuItems = document.querySelectorAll('.site-nav__menu a[href*="#"]');
  const activateMenu = () => {
    const offset = (header ? header.offsetHeight : 0) + 100;
    let currentId = '';
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) {
        currentId = section.id;
      }
    });
    menuItems.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const active = href.endsWith(`#${currentId}`);
      link.classList.toggle('is-active', active);
    });
  };

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-slider__dot'));
  const heroSlider = document.querySelector('.hero-slider');
  let slideIndex = 0;
  let sliderTimer = null;

  const setSlide = (index) => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => {
      const active = idx === slideIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === slideIndex));
  };

  const startSlider = () => {
    if (!heroSlider || slides.length < 2) return;
    const delay = parseInt(heroSlider.dataset.autoplay || '20000', 10);
    clearInterval(sliderTimer);
    sliderTimer = window.setInterval(() => setSlide(slideIndex + 1), delay);
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      setSlide(idx);
      startSlider();
    });
  });

  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => clearInterval(sliderTimer));
    heroSlider.addEventListener('mouseleave', startSlider);
    setSlide(0);
    startSlider();
  }

  const tooltipButtons = document.querySelectorAll('.tooltip-toggle');
  tooltipButtons.forEach((button) => {
    const panel = button.parentElement.querySelector('.tooltip-panel');
    if (!panel) return;

    const closePanel = () => {
      panel.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    };

    const openPanel = () => {
      panel.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    };

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = panel.classList.contains('is-open');
      document.querySelectorAll('.tooltip-panel.is-open').forEach((opened) => {
        if (opened !== panel) {
          opened.classList.remove('is-open');
          const opener = opened.parentElement.querySelector('.tooltip-toggle');
          if (opener) opener.setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) closePanel();
      else openPanel();
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.tooltip-panel.is-open').forEach((panel) => {
      if (!panel.contains(event.target)) {
        panel.classList.remove('is-open');
        const opener = panel.parentElement.querySelector('.tooltip-toggle');
        if (opener) opener.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      document.querySelectorAll('.tooltip-panel.is-open').forEach((panel) => {
        panel.classList.remove('is-open');
        const opener = panel.parentElement.querySelector('.tooltip-toggle');
        if (opener) opener.setAttribute('aria-expanded', 'false');
      });
    }
  });

  setHeaderState();
  activateMenu();
  window.addEventListener('scroll', () => {
    setHeaderState();
    activateMenu();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  });
})();
