/**
 * Theme Toggle
 * Handles dark/light mode with system preference detection and localStorage persistence
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'portfolio-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    /**
     * Get the user's preferred theme
     * Priority: localStorage > system preference > dark (default)
     */
    function getPreferredTheme() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === DARK || stored === LIGHT) return stored;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return LIGHT;
        }
        return DARK;
    }

    /**
     * Apply theme to the document
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.textContent = theme === DARK ? '☀️' : '🌙';
            toggle.setAttribute('aria-label',
                theme === DARK ? 'Switch to light mode' : 'Switch to dark mode'
            );
            toggle.setAttribute('title',
                theme === DARK ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
    }

    /**
     * Toggle between light and dark
     */
    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || DARK;
        const next = current === DARK ? LIGHT : DARK;
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
    }

    /**
     * Initialize
     */
    function init() {
        applyTheme(getPreferredTheme());

        function attachToggle() {
            const toggle = document.getElementById('themeToggle');
            if (toggle && !toggle.dataset.bound) {
                toggle.addEventListener('click', toggleTheme);
                toggle.dataset.bound = 'true';
                const current = document.documentElement.getAttribute('data-theme') || DARK;
                toggle.textContent = current === DARK ? '☀️' : '🌙';
            }
        }

        attachToggle();
        setTimeout(attachToggle, 500);
        setTimeout(attachToggle, 1500);

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    applyTheme(e.matches ? LIGHT : DARK);
                }
            });
        }
    }

    init();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }

})();