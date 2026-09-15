/**
 * Simple Client-Side Router
 * Manages page navigation without full page reloads
 */

(function() {
    'use strict';

    const Router = {
        pages: {
            home: 'pages/home.html',
            about: 'pages/about.html',
            skills: 'pages/skills.html',
            projects: 'pages/projects.html',
            experience: 'pages/experience.html',
            contact: 'pages/contact.html'
        },

        currentPage: 'home',
        appContainer: document.getElementById('app'),

        /**
         * Navigate to a page
         * @param {string} pageName - Name of the page to navigate to
         */
        async navigate(pageName) {
            // Validate page exists
            if (!this.pages[pageName]) {
                console.error(`Page not found: ${pageName}`);
                return;
            }

            // Close mobile menu if open
            this.closeMobileMenu();

            try {
                // Fetch page content
                const response = await fetch(this.pages[pageName]);
                if (!response.ok) {
                    throw new Error(`Failed to load page: ${response.statusText}`);
                }

                const content = await response.text();

                // Render page
                if (this.appContainer) {
                    this.appContainer.innerHTML = content;
                }

                // Update current page
                this.currentPage = pageName;

                // Scroll to top
                window.scrollTo(0, 0);

                // Update browser history
                window.history.pushState({ page: pageName }, '', `#${pageName}`);

                // Load dynamic content if applicable
                if (pageName === 'projects') {
                    // Trigger projects loading after DOM is ready
                    setTimeout(() => {
                        if (window.loadProjects) {
                            window.loadProjects();
                        }
                    }, 100);
                } else if (pageName === 'home') {
                    // Load featured projects on home page
                    setTimeout(() => {
                        if (window.loadFeaturedProjects) {
                            window.loadFeaturedProjects();
                        }
                    }, 100);
                }

                // Trigger animations
                if (window.setupAnimations) {
                    window.setupAnimations();
                }
            } catch (error) {
                console.error('Navigation error:', error);
                if (this.appContainer) {
                    this.appContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: var(--text-secondary);">⚠️ Error loading page. Please try again.</div>';
                }
            }
        },

        /**
         * Close mobile menu
         */
        closeMobileMenu() {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        },

        /**
         * Initialize router
         */
        init() {
            // Handle browser back/forward buttons
            window.addEventListener('popstate', (event) => {
                const page = event.state?.page || 'home';
                this.navigate(page);
            });

            // Load initial page from URL hash or default to home
            const hash = window.location.hash.slice(1);
            const initialPage = this.pages[hash] ? hash : 'home';
            this.navigate(initialPage);
        }
    };

    // Export to global scope
    window.router = Router;

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => router.init());
    } else {
        router.init();
    }
})();