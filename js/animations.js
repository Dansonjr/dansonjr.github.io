/**
 * Page Animations & Scroll Effects
 */

(function() {
    'use strict';

    /**
     * Setup scroll-based fade-in animations
     */
    function setupAnimations() {
        const elements = document.querySelectorAll('section, .project-card, .exp-item, .edu-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    /**
     * Smooth scroll for anchor links
     */
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#home' && href !== '#about' && href !== '#projects' && 
                    href !== '#contact' && href !== '#experience' && href !== '#skills') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Initialize animations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupAnimations();
            setupSmoothScroll();
        });
    } else {
        setupAnimations();
        setupSmoothScroll();
    }

    // Export for dynamic page updates
    window.setupAnimations = setupAnimations;

})();