/**
 * Main Application Initialization
 */

(function() {
    'use strict';

    // Initialize the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }

    function initApp() {
        // Setup navigation toggle
        setupNavToggle();
        
        // Setup navbar scroll behavior
        setupNavbarScroll();
    }

    /**
     * Setup mobile navigation toggle
     */
    function setupNavToggle() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close menu when a link is clicked
        if (navMenu) {
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });
        }
    }

    /**
     * Setup navbar scroll behavior (shadow on scroll)
     */
    function setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                navbar.style.boxShadow = 'var(--shadow)';
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.backgroundColor = 'transparent';
            }
        });
    }
})();