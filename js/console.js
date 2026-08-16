/**
 * Console / Terminal Animation
 * Displays rotating log lines in the hero section
 */

(function() {
    'use strict';

    const consoleLines = [
        { html: '<span class="k">$</span> ticket <span class="ok">#4412</span> resolved — POS terminal offline, Alexandria' },
        { html: '<span class="k">$</span> stocktake variance: <span class="ok">$2,940</span> <span class="path">/ threshold $3,000</span> — PASS' },
        { html: '<span class="k">$</span> aws cloudformation deploy <span class="path">stack:vpc-rds-prod</span> — <span class="ok">CREATE_COMPLETE</span>' },
        { html: '<span class="k">$</span> oracle wms — inbound receipt <span class="path">#88213</span> put-away <span class="ok">complete</span>' },
        { html: '<span class="k">$</span> python rds-python-connection.py — connection: <span class="ok">OK</span>' },
        { html: '<span class="k">$</span> power bi — throughput dashboard refreshed, <span class="ok">+40%</span> vs. baseline' },
    ];

    const consoleBody = document.getElementById('consoleBody');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderStatic() {
        if (!consoleBody) return;
        consoleBody.innerHTML = consoleLines
            .map(line => `<div class="console-line" style="opacity:1">${line.html}</div>`)
            .join('');
    }

    function runAnimatedConsole() {
        if (!consoleBody) return;

        if (prefersReducedMotion) {
            renderStatic();
            return;
        }

        let lineIndex = 0;
        const maxLines = 5;

        function addLine() {
            if (!consoleBody) return;

            const line = document.createElement('div');
            line.className = 'console-line';
            line.innerHTML = consoleLines[lineIndex % consoleLines.length].html;
            consoleBody.appendChild(line);

            // Remove oldest line if exceeding max
            while (consoleBody.children.length > maxLines) {
                consoleBody.removeChild(consoleBody.firstChild);
            }

            lineIndex++;
            setTimeout(addLine, 1900);
        }

        // Start the animation
        addLine();

        // Add the blinking cursor at the end
        const cursorLine = document.createElement('div');
        cursorLine.innerHTML = '<span class="cursor"></span>';
        consoleBody.appendChild(cursorLine);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAnimatedConsole);
    } else {
        runAnimatedConsole();
    }

})();