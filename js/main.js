/**
 * Main JavaScript
 * Initializes all modules and handles any additional functionality
 */

(function() {
    'use strict';

    // ===== DOCUMENT READY =====
    function init() {
        console.log('🚀 Portfolio initialized');
        console.log('📡 Live at: https://dansonjr.github.io');

        // Add any additional initialization here
        // For example: analytics tracking, etc.
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();