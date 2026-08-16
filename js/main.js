/**
 * Main Entry Point
 * Initializes all modules and handles page load
 */

(function() {
    'use strict';

    // ===== Console Identity =====
    function showConsoleIdentity() {
        console.log('🚀 Portfolio initialized');
        console.log('📡 Live at: https://dansonjr.github.io');
        console.log('👨‍💻 Built for Software Engineering & IT Roles');
        console.log('🎯 Focus: Python, AWS, React, Cloud Infrastructure');
        console.log('📦 Powered by the GitHub API');
    }

    // ===== Check for Font Loading =====
    function handleFontLoading() {
        if ('fonts' in document) {
            document.fonts.ready.then(function() {
                document.body.classList.add('fonts-loaded');
            });
        }
    }

    // ===== External Link Handler =====
    function handleExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach(function(link) {
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // ===== Service Worker Registration (Optional) =====
    function registerServiceWorker() {
        // Uncomment to enable service worker for offline support
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('/sw.js')
        //         .then(function(registration) {
        //             console.log('Service Worker registered successfully');
        //         })
        //         .catch(function(error) {
        //             console.log('Service Worker registration failed:', error);
        //         });
        // }
    }

    // ===== Initialize =====
    function init() {
        showConsoleIdentity();
        handleFontLoading();
        handleExternalLinks();
        // registerServiceWorker(); // Uncomment to enable
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();