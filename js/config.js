/**
 * Configuration
 * Centralized settings for the portfolio
 */

const CONFIG = {
    // GitHub username
    GITHUB_USERNAME: 'Dansonjr',
    
    // Repositories to exclude from the project list
    EXCLUDED_REPOS: [
        'dansonjr.github.io'  // Exclude the portfolio repo itself
    ],
    
    // Maximum number of projects to show
    MAX_PROJECTS: 6,
    
    // Animation settings
    ANIMATION: {
        THRESHOLD: 0.1,
        ROOT_MARGIN: '0px 0px -50px 0px'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}