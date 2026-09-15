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
            this.setupActiveLinkObserver();
        },

        /**
         * Setup mobile hamburger menu toggle
         */
        setupMobileToggle() {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');

            if (!navToggle || !navMenu) return;

            navToggle.addEventListener('click', (e) => {
                const isOpen = navMenu.classList.toggle('active');
                navToggle.classList.toggle('active', isOpen);
                navToggle.setAttribute('aria-expanded', String(isOpen));
                document.body.classList.toggle('nav-open', isOpen);
                e.stopPropagation();
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                }
            });

            // Close menu when a nav link is clicked
            navMenu.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                });
            });
        },

        /**
         * Setup navbar scroll effects
         */
        setupScrollBehavior() {
            const navbar = document.getElementById('navbar');
            if (!navbar) return;

            const onScroll = () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            };

            window.addEventListener('scroll', onScroll);
            onScroll();
        },

        /**
         * Highlight active nav item based on section in view
         */
        setupActiveLinkObserver() {
            const links = Array.from(document.querySelectorAll('.nav-menu a'));
            if (!links.length) return;

            const sections = links
                .map(l => {
                    try { return document.querySelector(l.getAttribute('href')); } catch(e) { return null; }
                })
                .filter(Boolean);

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.target || !entry.isIntersecting) return;
                    const id = '#' + entry.target.id;
                    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
                });
            }, { threshold: 0.45 });

            sections.forEach(s => observer.observe(s));
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
