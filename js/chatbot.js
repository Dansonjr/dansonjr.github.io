/**
 * AI Chatbot Widget
 * Interactive chat interface powered by Groq AI
 * Uses Cloudflare Worker as serverless proxy
 */

class PortfolioChatbot {
    constructor(config = {}) {
        this.config = {
            proxyURL: config.proxyURL || '/api/chat', // Cloudflare Worker endpoint
            position: config.position || 'bottom-right',
            theme: config.theme || 'dark',
            ...config
        };

        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        this.messageHistory = []; // For conversation context

        this.init();
    }

    /**
     * Initialize chatbot widget
     */
    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    /**
     * Create chatbot DOM elements
     */
    createWidget() {
        // Container
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.dataset.position = this.config.position;

        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chatbot-toggle';
        toggleBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        `;
        toggleBtn.id = 'chatbot-toggle';
        toggleBtn.title = 'Open AI Assistant';

        // Chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chatbot-window';
        chatWindow.id = 'chatbot-window';

        // Header
        const header = document.createElement('div');
        header.className = 'chatbot-header';
        header.innerHTML = `
            <div class="chatbot-header-content">
                <h3>Rabindra's AI Assistant</h3>
                <p>Ask me about skills, projects & experience</p>
            </div>
            <button class="chatbot-close" id="chatbot-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Messages container
        const messagesContainer = document.createElement('div');
        messagesContainer.className = 'chatbot-messages';
        messagesContainer.id = 'chatbot-messages';

        // Input area
        const inputArea = document.createElement('div');
        inputArea.className = 'chatbot-input-area';
        inputArea.innerHTML = `
            <input 
                type="text" 
                id="chatbot-input" 
                class="chatbot-input" 
                placeholder="Ask me anything..."
                autocomplete="off"
            />
            <button class="chatbot-send" id="chatbot-send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            </button>
        `;

        // Suggestions (shown initially)
        const suggestions = document.createElement('div');
        suggestions.className = 'chatbot-suggestions';
        suggestions.id = 'chatbot-suggestions';
        suggestions.innerHTML = `
            <div class="chatbot-suggestion-title">Suggested questions:</div>
            ${PORTFOLIO_CONFIG.chatbot.suggestions.map((suggestion, i) => `
                <button class="chatbot-suggestion-btn" data-suggestion="${i}">
                    ${suggestion}
                </button>
            `).join('')}
        `;

        // Assemble
        chatWindow.appendChild(header);
        chatWindow.appendChild(messagesContainer);
        chatWindow.appendChild(suggestions);
        chatWindow.appendChild(inputArea);

        container.appendChild(toggleBtn);
        container.appendChild(chatWindow);

        document.body.appendChild(container);
        this.container = container;
        this.messagesContainer = messagesContainer;
        this.suggestionsContainer = suggestions;
        this.inputField = document.getElementById('chatbot-input');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Toggle button
        document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggle());

        // Close button
        document.getElementById('chatbot-close').addEventListener('click', () => this.close());

        // Send button
        document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());

        // Input field - send on Enter
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Suggestion buttons
        document.querySelectorAll('.chatbot-suggestion-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent;
                this.inputField.value = text;
                this.sendMessage();
            });
        });
    }

    /**
     * Toggle chat window
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open chat window
     */
    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.inputField.focus();

        // Show welcome message if no messages yet
        if (this.messages.length === 0) {
            this.addMessage(PORTFOLIO_CONFIG.chatbot.welcomeMessage, 'bot');
        }
    }

    /**
     * Close chat window
     */
    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
    }

    /**
     * Add message to chat
     */
    addMessage(text, sender = 'user') {
        const messageEl = document.createElement('div');
        messageEl.className = `chatbot-message chatbot-message-${sender}`;

        const content = document.createElement('div');
        content.className = 'chatbot-message-content';
        
        // Parse markdown links in response
        content.innerHTML = this.parseMessageContent(text);

        messageEl.appendChild(content);
        this.messagesContainer.appendChild(messageEl);

        this.messages.push({ text, sender, timestamp: Date.now() });

        // Scroll to bottom
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 0);
    }

    /**
     * Parse message content for links and formatting
     */
    parseMessageContent(text) {
        let html = text
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');
        
        return html;
    }

    /**
     * Send message to chatbot
     */
    async sendMessage() {
        const text = this.inputField.value.trim();
        if (!text || this.isLoading) return;

        // Clear input
        this.inputField.value = '';

        // Hide suggestions after first message
        if (this.messages.length === 1) {
            this.suggestionsContainer.style.display = 'none';
        }

        // Add user message
        this.addMessage(text, 'user');

        // Show loading state
        this.isLoading = true;
        const loadingEl = document.createElement('div');
        loadingEl.className = 'chatbot-message chatbot-message-bot chatbot-loading';
        loadingEl.innerHTML = '<div class="chatbot-message-content"><span class="chatbot-typing">●●●</span></div>';
        this.messagesContainer.appendChild(loadingEl);

        // Get AI response
        try {
            const response = await this.getAIResponse(text);
            loadingEl.remove();
            this.addMessage(response, 'bot');
        } catch (error) {
            loadingEl.remove();
            this.addMessage(
                'Sorry, I encountered an error. Please try again or check back later.',
                'bot'
            );
            console.error('Chatbot error:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Get response from AI (via Cloudflare Worker proxy)
     */
    async getAIResponse(userMessage) {
        // Prepare context from portfolio config
        const context = this.buildContext();

        const payload = {
            message: userMessage,
            context,
            conversationHistory: this.messageHistory.slice(-10) // Last 10 messages for context
        };

        const response = await fetch(this.config.proxyURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API error: ${response.status} - ${error}`);
        }

        const data = await response.json();

        // Store in conversation history
        this.messageHistory.push(
            { role: 'user', content: userMessage },
            { role: 'assistant', content: data.response }
        );

        return data.response;
    }

    /**
     * Build context string from portfolio config
     */
    buildContext() {
        const config = PORTFOLIO_CONFIG;
        const skillsText = Object.entries(config.skills)
            .map(([category, items]) => `${category}: ${items.join(', ')}`)
            .join('\n');

        const projectsText = config.projects
            .map(p => `- ${p.name}: ${p.description}`)
            .join('\n');

        return `
Portfolio Owner: ${config.personal.name}
Title: ${config.personal.title}
Bio: ${config.personal.bio}

Skills:
${skillsText}

Projects:
${projectsText}

Experience:
${config.experience.map(e => `- ${e.title} at ${e.company}: ${e.description}`).join('\n')}

Education:
${config.education.map(e => `- ${e.degree} from ${e.school} (${e.year})`).join('\n')}

Interests: ${config.interests.join(', ')}
`.trim();
    }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.chatbot = new PortfolioChatbot({
            proxyURL: 'https://your-worker-domain.workers.dev/chat'
        });
    });
} else {
    window.chatbot = new PortfolioChatbot({
        proxyURL: 'https://your-worker-domain.workers.dev/chat'
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioChatbot;
}
