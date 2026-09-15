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
                statStars: document.getElementById('statStars'),
                featuredProjects: document.getElementById('featuredProjects')
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
         * Render featured projects (home page)
         * @param {Array} repos - Array of repository objects (top 2)
         */
        renderFeatured(repos, refs) {
            if (!refs.featuredProjects) return;

            if (!repos || repos.length === 0) {
                refs.featuredProjects.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Featured projects loading...</p>';
                return;
            }

            let html = '';
            repos.slice(0, 2).forEach(repo => {
                const formatted = GitHubAPI.formatRepo(repo);
                const starsDisplay = formatted.stars > 0 ? `⭐ ${formatted.stars}` : '⭐ 0';

                html += `
                    <div class="project-card featured">
                        <div class="project-header">
                            <span class="project-icon">⭐</span>
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

            refs.featuredProjects.innerHTML = html;
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

    // ===== Main Load Functions =====
    async function loadProjects() {
        const refs = ProjectsRenderer.getDOMRefs();
        const username = CONFIG.GITHUB_USERNAME;
        const excluded = CONFIG.EXCLUDED_REPOS;
        const maxItems = CONFIG.MAX_PROJECTS;

        // Show loading state
        ProjectsRenderer.showLoading(refs.projectsGrid);

        try {
            // Fetch repos from GitHub with timeout
            const allRepos = await Promise.race([
                GitHubAPI.fetchRepos(username),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('GitHub API request timeout')), 10000)
                )
            ]);

            // Filter repos for display
            const filteredRepos = GitHubAPI.filterRepos(allRepos, excluded, maxItems);

            // Render projects
            ProjectsRenderer.render(filteredRepos, refs);

            // Update stats
            ProjectsRenderer.updateStats(allRepos, filteredRepos, refs);

        } catch (error) {
            console.error('Error loading projects:', error);
            ProjectsRenderer.showError('Unable to load projects from GitHub. Please try again later.', refs);
        }
    }

    async function loadFeaturedProjects() {
        const refs = ProjectsRenderer.getDOMRefs();
        const username = CONFIG.GITHUB_USERNAME;
        const excluded = CONFIG.EXCLUDED_REPOS;

        try {
            // Fetch repos from GitHub with timeout
            const allRepos = await Promise.race([
                GitHubAPI.fetchRepos(username),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('GitHub API request timeout')), 10000)
                )
            ]);

            // Filter and get top 2 repos
            const filteredRepos = GitHubAPI.filterRepos(allRepos, excluded, 2);

            // Render featured projects
            ProjectsRenderer.renderFeatured(filteredRepos, refs);

            // Update stats on home page
            if (refs.statProjects && refs.statRepos && refs.statStars) {
                ProjectsRenderer.updateStats(allRepos, filteredRepos, refs);
            }

        } catch (error) {
            console.error('Error loading featured projects:', error);
        }
    }

    // ===== Export =====
    window.ProjectsRenderer = ProjectsRenderer;
    window.loadProjects = loadProjects;
    window.loadFeaturedProjects = loadFeaturedProjects;

})();