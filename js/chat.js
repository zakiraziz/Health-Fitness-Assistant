// HealthAI Chat System - Production Ready
class HealthAIChat {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.loadWelcomeMessage();
            this.setupAutoResize();
        });
    }

    setupEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const suggestionChips = document.querySelectorAll('.suggestion-chip');

        // Send message on button click
        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Send message on Enter key (but allow Shift+Enter for new line)
        if (messageInput) {
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            messageInput.addEventListener('input', () => {
                this.autoResizeTextarea(messageInput);
            });
        }

        // Suggestion chips
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                if (question) {
                    this.setMessageInput(question);
                }
            });
        });

        // Handle paste events for security
        if (messageInput) {
            messageInput.addEventListener('paste', (e) => {
                setTimeout(() => {
                    this.sanitizeInput(messageInput);
                }, 0);
            });
        }
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    setupAutoResize() {
        const messageInput = document.getElementById('messageInput');
        if (messageInput && messageInput.tagName === 'TEXTAREA') {
            this.autoResizeTextarea(messageInput);
        }
    }

    setMessageInput(text) {
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = text;
            messageInput.focus();
            this.autoResizeTextarea(messageInput);
        }
    }

    sanitizeInput(input) {
        // Basic sanitization to prevent XSS
        let value = input.value;
        value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        value = value.replace(/javascript:/gi, '');
        value = value.replace(/on\w+=/gi, '');
        input.value = value;
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput?.value.trim();

        if (!message || this.isTyping) {
            return;
        }

        // Basic validation
        if (message.length > 500) {
            this.showToast('Message too long. Please keep it under 500 characters.', 'error');
            return;
        }

        if (message.length < 2) {
            this.showToast('Please enter a message', 'error');
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        messageInput.value = '';
        this.autoResizeTextarea(messageInput);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate AI response
        try {
            const response = await this.generateAIResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'ai');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I encountered an error. Please try again.', 'ai');
            console.error('Chat error:', error);
        }
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.setAttribute('aria-label', `${sender === 'user' ? 'You' : 'HealthAI'} said`);

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.setAttribute('aria-hidden', 'true');

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        if (sender === 'user') {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
            contentDiv.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
            messageDiv.appendChild(contentDiv);
            messageDiv.appendChild(avatarDiv);
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
            contentDiv.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(contentDiv);
        }

        chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message
        this.messages.push({
            text: text,
            sender: sender,
            timestamp: new Date().toISOString()
        });

        // Limit messages to prevent memory issues
        if (this.messages.length > 100) {
            this.messages = this.messages.slice(-50);
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    }

    async generateAIResponse(userMessage) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const lowerMessage = userMessage.toLowerCase();

        // Health and fitness responses
        if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
            return this.getWorkoutResponse(lowerMessage);
        } else if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
            return this.getNutritionResponse(lowerMessage);
        } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('injury')) {
            return this.getPainResponse(lowerMessage);
        } else if (lowerMessage.includes('weight') || lowerMessage.includes('lose') || lowerMessage.includes('gain')) {
            return this.getWeightResponse(lowerMessage);
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return this.getGreetingResponse();
        } else {
            return this.getGeneralResponse();
        }
    }

    getWorkoutResponse(message) {
        const responses = {
            beginner: "For beginners, I recommend starting with bodyweight exercises like squats, push-ups (modified if needed), and planks. Aim for 2-3 sessions per week, focusing on proper form. Would you like me to create a specific beginner workout plan for you?",
            strength: "For strength training, compound exercises like squats, deadlifts, and bench presses are most effective. Start with 3 sets of 8-12 repetitions, 2-3 times per week. Remember to progressively increase weight as you get stronger.",
            cardio: "Great choice! For cardio, I recommend 150 minutes of moderate intensity or 75 minutes of high intensity per week. You can try running, cycling, swimming, or HIIT workouts. What's your current fitness level?",
            home: "For home workouts without equipment, try bodyweight exercises: squats, push-ups, lunges, planks, and glute bridges. You can also use household items like water bottles as weights!",
            general: "I can help you with various workout plans! Could you tell me your fitness goals (weight loss, muscle building, endurance) and your current fitness level?"
        };

        if (message.includes('beginner')) return responses.beginner;
        if (message.includes('strength') || message.includes('weight')) return responses.strength;
        if (message.includes('cardio') || message.includes('running')) return responses.cardio;
        if (message.includes('home') || message.includes('no equipment')) return responses.home;
        return responses.general;
    }

    getNutritionResponse(message) {
        const responses = {
            weightLoss: "For weight loss, focus on a calorie deficit with nutrient-dense foods. Include lean proteins, vegetables, whole grains, and healthy fats. Avoid processed foods and sugary drinks. Would you like a sample meal plan?",
            muscle: "To support muscle growth, aim for 1.6-2.2g of protein per kg of body weight daily. Good sources include chicken, fish, eggs, Greek yogurt, tofu, and legumes. Don't forget carbohydrates for energy!",
            healthy: "A balanced meal should include protein, complex carbs, healthy fats, and vegetables. For example: grilled chicken, quinoa, avocado, and roasted vegetables. Need specific recipe ideas?",
            general: "Nutrition is key to reaching your health goals! Could you tell me more about your dietary preferences and what you're hoping to achieve?"
        };

        if (message.includes('lose') || message.includes('weight loss')) return responses.weightLoss;
        if (message.includes('muscle') || message.includes('protein')) return responses.muscle;
        if (message.includes('healthy') || message.includes('meal')) return responses.healthy;
        return responses.general;
    }

    getPainResponse(message) {
        return "I'm sorry to hear you're experiencing discomfort. While I can offer general advice, it's important to consult with a healthcare professional for proper diagnosis and treatment. For minor muscle soreness, rest, ice, and gentle stretching may help. If you're experiencing severe or persistent pain, please seek medical attention.";
    }

    getWeightResponse(message) {
        if (message.includes('lose')) {
            return "For healthy weight loss, aim for 1-2 pounds per week through a combination of diet and exercise. Create a calorie deficit of 500-1000 calories daily, focus on protein and fiber-rich foods, and incorporate both cardio and strength training.";
        } else if (message.includes('gain')) {
            return "To gain weight healthily, focus on a calorie surplus with nutrient-dense foods. Increase protein intake, include healthy fats and complex carbs, and incorporate strength training to build muscle rather than fat.";
        }
        return "Whether you want to lose or gain weight, the key is consistency with nutrition and exercise. Would you like me to help you create a personalized plan?";
    }

    getGreetingResponse() {
        const greetings = [
            "Hello! I'm your HealthAI assistant. How can I help you with your health and fitness goals today?",
            "Hi there! Ready to work on your fitness journey? What would you like to know?",
            "Hey! I'm here to help with all your health and fitness questions. What's on your mind?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getGeneralResponse() {
        return "That's an interesting question about health and fitness! I'd be happy to help you with that. Could you provide a bit more detail so I can give you the most accurate and helpful information?";
    }

    loadWelcomeMessage() {
        // Welcome message is already in HTML, but we can add timestamp
        const welcomeMessage = document.querySelector('.ai-message .message-content p');
        if (welcomeMessage) {
            this.messages.push({
                text: welcomeMessage.textContent,
                sender: 'ai',
                timestamp: new Date().toISOString()
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        // Use the same toast system as auth.js
        if (typeof healthAIAuth !== 'undefined' && healthAIAuth.showToast) {
            healthAIAuth.showToast(message, type);
        } else {
            // Fallback
            alert(message);
        }
    }
}

// Initialize the chat system
const healthAIChat = new HealthAIChat();