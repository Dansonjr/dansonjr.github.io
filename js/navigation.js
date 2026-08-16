/**
 * Navigation Module
 * Handles mobile toggle, scroll behavior, and smooth scroll
 */

(function() {
    'use strict';

    // ===== DOM Elements =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    const body = document.body;

    // ===== Mobile Nav Toggle =====
    function initMobileNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('open');
            this.classList.toggle('active');
            body.classList.toggle('nav-open');
            
            // Update aria-label
            this.setAttribute('aria-label', 
                isOpen ? 'Close navigation menu' : 'Open navigation menu'
            );
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-label', 'Open navigation menu');
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                body.classList.remove('nav-open');
                navToggle.setAttribute('aria-label', 'Open navigation menu');
                navToggle.focus();
            }
        });
    }

    // ===== Navbar Shadow on Scroll =====
    function initNavbarShadow() {
        if (!navbar) return;

        let ticking = false;

        function updateNavbarShadow() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateNavbarShadow();
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial check
        updateNavbarShadow();
    }

    // ===== Smooth Scroll for Anchor Links =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== iOS Safari 100vh Fix =====
    function initHeroHeightFix() {
        const hero = document.getElementById('hero');
        if (hero) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
            
            window.addEventListener('resize', function() {
                const newVh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', newVh + 'px');
            }, { passive: true });
        }
    }

    // ===== Initialize =====
    function init() {
        initMobileNav();
        initNavbarShadow();
        initSmoothScroll();
        initHeroHeightFix();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();