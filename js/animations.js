/**
 * Animations Module
 * Handles scroll-triggered fade-up animations
 */

(function() {
    'use strict';

    // ===== Add Fade-Up Classes =====
    function addFadeUpClasses() {
        const selectors = [
            'section .about-grid',
            'section .education-grid',
            'section .skills-grid',
            'section .projects-grid',
            'section .experience-timeline',
            'section .contact-grid'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));
        elements.forEach(function(el) {
            el.classList.add('fade-up');
        });
    }

    // ===== Initialize Intersection Observer =====
    function initFadeUpObserver() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: make all elements visible
            document.querySelectorAll('.fade-up').forEach(function(el) {
                el.classList.add('visible');
            });
            return;
        }

        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('.fade-up').forEach(function(el) {
                el.classList.add('visible');
            });
            return;
        }

        // Create observer
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: CONFIG.ANIMATION.THRESHOLD || 0.1,
            rootMargin: CONFIG.ANIMATION.ROOT_MARGIN || '0px 0px -50px 0px'
        });

        // Observe elements
        document.querySelectorAll('.fade-up').forEach(function(el) {
            observer.observe(el);
        });
    }

    // ===== Initialize =====
    function init() {
        addFadeUpClasses();
        initFadeUpObserver();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();