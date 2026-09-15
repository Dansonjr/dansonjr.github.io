/**
 * Projects Module
 * Renders GitHub projects dynamically
 */

(function() {
    'use strict';

    // ===== Render Functions =====
    const ProjectsRenderer = {
        /**
         * Get DOM references (deferred until page is loaded)
         */
        getDOMRefs() {
            return {
                projectsGrid: document.getElementById('projectsGrid'),
                statProjects: document.getElementById('statProjects'),
                statRepos: document.getElementById('statRepos'),
                statStars: document.getElementById('statStars')
            };
        },

        /**
         * Show loading state
         */
        showLoading(projectsGrid) {
            if (projectsGrid) {
                projectsGrid.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary); grid-column: 1 / -1;">
                        ⏳ Loading projects from GitHub...
                    </div>
                `;
            }
        },

        /**
         * Show error state
         * @param {string} message - Error message
         */
        showError(message, refs) {
            if (refs.projectsGrid) {
                refs.projectsGrid.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary); grid-column: 1 / -1;">
                        ⚠️ ${message}
                    </div>
                `;
            }
            // Reset stats
            this.updateStats(null, null, refs);
        },

        /**
         * Render project cards
         * @param {Array} repos - Array of repository objects
         */
        render(repos, refs) {
            if (!refs.projectsGrid) return;

            // Validate input
            if (!repos || repos.length === 0) {
                this.showError('No repositories found. Check back later!', refs);
                return;
            }

            // Build HTML
            let html = '';
            repos.forEach(repo => {
                const formatted = GitHubAPI.formatRepo(repo);
                const starsDisplay = formatted.stars > 0 ? `⭐ ${formatted.stars}` : '⭐ 0';

                html += `
                    <div class="project-card">
                        <div class="project-header">
                            <span class="project-icon">📁</span>
                            <span class="project-language">${formatted.language}</span>
                        </div>
                        <h3>${formatted.name}</h3>
                        <p>${formatted.description}</p>
                        <div class="project-meta">
                            <span>${starsDisplay}</span>
                            <span>🔄 Updated ${formatted.updatedFormatted}</span>
                        </div>
                        <a href="${formatted.url}" target="_blank" class="project-link">View Repository →</a>
                    </div>
                `;
            });

            refs.projectsGrid.innerHTML = html;
        },

        /**
         * Update hero statistics
         * @param {Array} allRepos - All repositories
         * @param {Array} filteredRepos - Filtered repositories
         */
        updateStats(allRepos, filteredRepos, refs) {
            if (!refs.statProjects || !refs.statRepos || !refs.statStars) return;

            if (!allRepos || !filteredRepos) {
                refs.statProjects.textContent = '--';
                refs.statRepos.textContent = '--';
                refs.statStars.textContent = '--';
                return;
            }

            const totalStars = GitHubAPI.getTotalStars(allRepos);
            refs.statProjects.textContent = filteredRepos.length;
            refs.statRepos.textContent = allRepos.length;
            refs.statStars.textContent = totalStars;
        }
    };

    // ===== Main Load Function =====
    async function loadProjects() {
        const refs = ProjectsRenderer.getDOMRefs();
        const username = CONFIG.GITHUB_USERNAME;
        const excluded = CONFIG.EXCLUDED_REPOS;
        const maxItems = CONFIG.MAX_PROJECTS;

        // Show loading state
        ProjectsRenderer.showLoading(refs.projectsGrid);

        try {
            // Fetch repos from GitHub
            const allRepos = await GitHubAPI.fetchRepos(username);

            // Filter repos for display
            const filteredRepos = GitHubAPI.filterRepos(allRepos, excluded, maxItems);

            // Render projects
            ProjectsRenderer.render(filteredRepos, refs);

            // Update stats
            ProjectsRenderer.updateStats(allRepos, filteredRepos, refs);

        } catch (error) {
            ProjectsRenderer.showError('Unable to load projects from GitHub. Please try again later.', refs);
            console.error('Error loading projects:', error);
        }
    }

    // ===== Export =====
    window.ProjectsRenderer = ProjectsRenderer;
    window.loadProjects = loadProjects;

})();