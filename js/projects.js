/**
 * Projects Module
 * Renders GitHub projects dynamically
 */

(function() {
    'use strict';

    // ===== DOM References =====
    const projectsGrid = document.getElementById('projectsGrid');
    const statProjects = document.getElementById('statProjects');
    const statRepos = document.getElementById('statRepos');
    const statStars = document.getElementById('statStars');

    // ===== Render Functions =====
    const ProjectsRenderer = {
        /**
         * Show loading state
         */
        showLoading() {
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
        showError(message) {
            if (projectsGrid) {
                projectsGrid.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary); grid-column: 1 / -1;">
                        ⚠️ ${message}
                    </div>
                `;
            }
            // Reset stats
            this.updateStats(null);
        },

        /**
         * Render project cards
         * @param {Array} repos - Array of repository objects
         */
        render(repos) {
            if (!projectsGrid) return;

            // Validate input
            if (!repos || repos.length === 0) {
                this.showError('No repositories found. Check back later!');
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

            projectsGrid.innerHTML = html;
        },

        /**
         * Update hero statistics
         * @param {Array} allRepos - All repositories
         * @param {Array} filteredRepos - Filtered repositories
         */
        updateStats(allRepos, filteredRepos) {
            if (!statProjects || !statRepos || !statStars) return;

            if (!allRepos || !filteredRepos) {
                statProjects.textContent = '--';
                statRepos.textContent = '--';
                statStars.textContent = '--';
                return;
            }

            const totalStars = GitHubAPI.getTotalStars(allRepos);
            statProjects.textContent = filteredRepos.length;
            statRepos.textContent = allRepos.length;
            statStars.textContent = totalStars;
        }
    };

    // ===== Main Load Function =====
    async function loadProjects() {
        const username = CONFIG.GITHUB_USERNAME;
        const excluded = CONFIG.EXCLUDED_REPOS;
        const maxItems = CONFIG.MAX_PROJECTS;

        // Show loading state
        ProjectsRenderer.showLoading();

        try {
            // Fetch repos from GitHub
            const allRepos = await GitHubAPI.fetchRepos(username);

            // Filter repos for display
            const filteredRepos = GitHubAPI.filterRepos(allRepos, excluded, maxItems);

            // Render projects
            ProjectsRenderer.render(filteredRepos);

            // Update stats
            ProjectsRenderer.updateStats(allRepos, filteredRepos);

        } catch (error) {
            ProjectsRenderer.showError('Unable to load projects from GitHub. Please try again later.');
            console.error('Error loading projects:', error);
        }
    }

    // ===== Export =====
    window.ProjectsRenderer = ProjectsRenderer;
    window.loadProjects = loadProjects;

    // Auto-load if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProjects);
    } else {
        loadProjects();
    }

})();