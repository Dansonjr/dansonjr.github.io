/**
 * Live Sydney Clock
 * Updates the clock in the navigation bar
 */

(function() {
    'use strict';

    function updateClock() {
        const clockElement = document.getElementById('clock');
        if (!clockElement) return;

        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-AU', {
                timeZone: 'Australia/Sydney',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            clockElement.textContent = 'SYD ' + formatter.format(now);
        } catch (error) {
            // Fallback if timezone formatting fails
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            clockElement.textContent = 'SYD ' + hours + ':' + minutes;
        }
    }

    // Update immediately and then every 15 seconds
    updateClock();
    setInterval(updateClock, 15000);

})();