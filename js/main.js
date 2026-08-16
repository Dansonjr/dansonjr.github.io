/**
 * Main JavaScript
 * Initializes all modules and handles page interactions
 */

(function() {
    'use strict';

    // ===== Document Ready =====
    function init() {
        console.log('🚀 Portfolio initialized');
        console.log('📡 Live at: https://dansonjr.github.io');
        console.log('👨‍💻 Built with ❤️ for Software Engineering & IT Support');
        
        // ===== Intersection Observer for Animations =====
        if ('IntersectionObserver' in window) {
            const sections = document.querySelectorAll('section');
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            sections.forEach(function(section) {
                observer.observe(section);
            });
        }

        // ===== Add smooth class to body when fonts are loaded =====
        if ('fonts' in document) {
            document.fonts.ready.then(function() {
                document.body.classList.add('fonts-loaded');
            });
        }

        // ===== Handle console warnings for external links =====
        document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // ===== Run when DOM is ready =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            init();
        } else {
            document.addEventListener('DOMContentLoaded', init);
        }
    }

})();