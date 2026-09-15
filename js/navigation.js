/**
 * Navigation Module
 * Handles navbar interactions and scroll behavior
 */

(function() {
    'use strict';

    const Navigation = {
        /**
         * Initialize navigation
         */
        init() {
            this.setupMobileToggle();
            this.setupScrollBehavior();
        },

        /**
         * Setup mobile hamburger menu toggle
         */
        setupMobileToggle() {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');

            if (!navToggle || !navMenu) return;

            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        },

        /**
         * Setup navbar scroll effects
         */
        setupScrollBehavior() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                    navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.boxShadow = 'none';
                    navbar.style.backgroundColor = 'transparent';
                    navbar.style.backdropFilter = 'none';
                }
            });
        }
    };

    // Initialize navigation when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Navigation.init());
    } else {
        Navigation.init();
    }

    window.Navigation = Navigation;
})();