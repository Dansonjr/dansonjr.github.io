/**
 * GitHub API Service
 * Handles fetching data from the GitHub API
 */

(function() {
    'use strict';

    // ===== GitHub API Functions =====
    const GitHubAPI = {
        /**
         * Fetch all repositories for a user
         * @param {string} username - GitHub username
         * @returns {Promise<Array>} - Array of repository objects
         */
        async fetchRepos(username) {
            try {
                const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
                }

                const repos = await response.json();
                return repos;
            } catch (error) {
                console.error('Failed to fetch GitHub data:', error);
                throw error;
            }
        },

        /**
         * Filter repositories for display
         * @param {Array} repos - All repositories
         * @param {Array} excludeList - Repositories to exclude
         * @param {number} maxItems - Maximum number to return
         * @returns {Array} - Filtered and sorted repositories
         */
        filterRepos(repos, excludeList = [], maxItems = 6) {
            if (!repos || !Array.isArray(repos)) {
                return [];
            }

            const filtered = repos
                .filter(repo => !excludeList.includes(repo.name))
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .slice(0, maxItems);

            return filtered;
        },

        /**
         * Calculate total stars across repositories
         * @param {Array} repos - Array of repositories
         * @returns {number} - Total star count
         */
        getTotalStars(repos) {
            if (!repos || !Array.isArray(repos)) {
                return 0;
            }
            return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        },

        /**
         * Format a repository for display
         * @param {Object} repo - Repository object from GitHub API
         * @returns {Object} - Formatted repository data
         */
        formatRepo(repo) {
            return {
                name: repo.name,
                description: repo.description || 'No description provided.',
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count || 0,
                url: repo.html_url,
                updatedAt: new Date(repo.updated_at),
                updatedFormatted: new Date(repo.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            };
        }
    };

    // ===== Export =====
    // Expose to global scope
    window.GitHubAPI = GitHubAPI;

})();