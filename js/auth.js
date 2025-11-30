// HealthAI Authentication System - Production Ready with Enhanced Profiling
class HealthAIAuth {
    constructor() {
        this.storage = this.initStorage();
        this.currentUser = null;
        this.init();
    }

    initStorage() {
        return {
            get: (key) => {
                try {
                    if (typeof localStorage !== 'undefined') {
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : null;
                    }
                    return null;
                } catch (error) {
                    console.warn('LocalStorage not available:', error);
                    return this.getSessionFallback(key);
                }
            },
            set: (key, value) => {
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem(key, JSON.stringify(value));
                        return true;
                    }
                    return this.setSessionFallback(key, value);
                } catch (error) {
                    console.warn('LocalStorage not available:', error);
                    return this.setSessionFallback(key, value);
                }
            },
            remove: (key) => {
                try {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.removeItem(key);
                    }
                    this.removeSessionFallback(key);
                    return true;
                } catch (error) {
                    console.warn('Storage removal failed:', error);
                    return false;
                }
            }
        };
    }

    getSessionFallback(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            return null;
        }
    }

    setSessionFallback(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Session storage also failed:', error);
            return false;
        }
    }

    removeSessionFallback(key) {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            // Ignore errors during removal
        }
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.checkAuthState();
            this.setupPageProtection();
        });
    }

    setupEventListeners() {
        // Auth modal
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const authModal = document.getElementById('authModal');
        const closeAuth = document.getElementById('closeAuth');

        if (loginBtn) loginBtn.addEventListener('click', () => this.openAuthModal('login'));
        if (signupBtn) signupBtn.addEventListener('click', () => this.openAuthModal('signup'));
        if (closeAuth) closeAuth.addEventListener('click', () => this.closeAuthModal());
        if (authModal) authModal.addEventListener('click', (e) => {
            if (e.target === authModal) this.closeAuthModal();
        });

        // Auth tabs
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');

        if (loginTab) loginTab.addEventListener('click', () => this.switchAuthTab('login'));
        if (signupTab) signupTab.addEventListener('click', () => this.switchAuthTab('signup'));

        // Auth forms
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignup(e));

        // User menu
        const userAvatar = document.getElementById('userAvatar');
        const logoutBtn = document.getElementById('logoutBtn');

        if (userAvatar) userAvatar.addEventListener('click', (e) => this.toggleUserMenu(e));
        if (logoutBtn) logoutBtn.addEventListener('click', (e) => this.handleLogout(e));

        // Social login
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleSocialLogin());
        });

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            const userDropdown = document.getElementById('userDropdown');
            const userAvatar = document.getElementById('userAvatar');

            if (userMenu && userDropdown && userAvatar && 
                !userMenu.contains(e.target)) {
                userDropdown.classList.remove('active');
                userAvatar.setAttribute('aria-expanded', 'false');
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAuthModal();
                const userDropdown = document.getElementById('userDropdown');
                if (userDropdown) {
                    userDropdown.classList.remove('active');
                    const userAvatar = document.getElementById('userAvatar');
                    if (userAvatar) userAvatar.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }

    checkAuthState() {
        this.currentUser = this.storage.get('healthai_current_user') || 
                          this.storage.get('healthai_user');

        if (this.currentUser) {
            this.handleUserLoggedIn();
        } else {
            this.handleUserLoggedOut();
        }
    }

    handleUserLoggedIn() {
        // Update UI
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        if (userAvatar) {
            userAvatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
            userAvatar.setAttribute('aria-label', `User menu for ${this.currentUser.name}`);
        }
        if (userName) userName.textContent = this.currentUser.name;

        // Redirect logic
        this.handleRedirects();
    }

    handleUserLoggedOut() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');

        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';

        // Protect routes
        this.protectRoutes();
    }

    handleRedirects() {
        const currentPage = this.getCurrentPage();
        const isHomePage = currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/');

        if (isHomePage) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 100);
        }
    }

    protectRoutes() {
        const currentPage = this.getCurrentPage();
        const protectedPages = ['dashboard.html', 'progress.html'];

        if (protectedPages.includes(currentPage)) {
            window.location.href = 'index.html';
        }
    }

    setupPageProtection() {
        // Additional page protection logic
        const currentPage = this.getCurrentPage();
        const protectedPages = ['dashboard.html', 'progress.html'];

        if (protectedPages.includes(currentPage) && !this.currentUser) {
            window.location.href = 'index.html';
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }

    openAuthModal(tab = 'login') {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'flex';
            authModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';

            if (tab === 'login') {
                this.switchAuthTab('login');
            } else {
                this.switchAuthTab('signup');
            }

            // Focus management
            setTimeout(() => {
                const firstInput = authModal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    }

    closeAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.style.display = 'none';
            authModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            // Reset forms
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
        }
    }

    switchAuthTab(tab) {
        const loginTab = document.getElementById('loginTab');
        const signupTab = document.getElementById('signupTab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (tab === 'login') {
            if (loginTab) {
                loginTab.classList.add('active');
                loginTab.setAttribute('aria-selected', 'true');
            }
            if (signupTab) {
                signupTab.classList.remove('active');
                signupTab.setAttribute('aria-selected', 'false');
            }
            if (loginForm) {
                loginForm.classList.add('active');
                loginForm.removeAttribute('hidden');
            }
            if (signupForm) {
                signupForm.classList.remove('active');
                signupForm.setAttribute('hidden', 'true');
            }
        } else {
            if (signupTab) {
                signupTab.classList.add('active');
                signupTab.setAttribute('aria-selected', 'true');
            }
            if (loginTab) {
                loginTab.classList.remove('active');
                loginTab.setAttribute('aria-selected', 'false');
            }
            if (signupForm) {
                signupForm.classList.add('active');
                signupForm.removeAttribute('hidden');
            }
            if (loginForm) {
                loginForm.classList.remove('active');
                loginForm.setAttribute('hidden', 'true');
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!password || password.length < 1) {
            this.showToast('Please enter your password', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await this.simulateAPICall(1000);

            let user = this.storage.get('healthai_current_user');
            
            // If user exists but profile is incomplete, show profiling
            if (user && (!user.profile || !user.profile.fitnessLevel)) {
                const userProfile = await this.showUserProfilingQuestions(user.name);
                user.profile = userProfile;
                user.preferences = {
                    workoutLevel: userProfile.fitnessLevel,
                    workoutType: userProfile.preferredWorkouts,
                    diet: userProfile.dietaryPreference,
                    equipment: userProfile.equipmentAvailable,
                    timeAvailable: userProfile.workoutTime,
                    notifications: true
                };
            }

            if (!user) {
                // Create new user with basic profile
                user = {
                    name: email.split('@')[0],
                    email: email,
                    joinDate: new Date().toISOString(),
                    profile: await this.showUserProfilingQuestions(email.split('@')[0]),
                    userId: this.generateUserId(),
                    lastLogin: new Date().toISOString()
                };
            }

            if (this.storage.set('healthai_current_user', user)) {
                this.currentUser = user;
                this.handleUserLoggedIn();
                this.closeAuthModal();
                this.showToast('Login successful! Welcome to HealthAI.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error('Storage failed');
            }
        } catch (error) {
            this.showToast('Login failed. Please try again.', 'error');
            console.error('Login error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName')?.value.trim();
        const email = document.getElementById('signupEmail')?.value.trim();
        const password = document.getElementById('signupPassword')?.value;
        const confirmPassword = document.getElementById('signupConfirmPassword')?.value;

        // Validation
        if (!name || name.length < 2) {
            this.showToast('Please enter your full name', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (!password || password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;

        try {
            // Show user profiling questions
            const userProfile = await this.showUserProfilingQuestions(name);
            
            const user = {
                name: name,
                email: email,
                joinDate: new Date().toISOString(),
                profile: userProfile,
                goals: {
                    workout: userProfile.fitnessGoal,
                    weight: userProfile.targetWeight,
                    nutrition: 85
                },
                preferences: {
                    workoutLevel: userProfile.fitnessLevel,
                    workoutType: userProfile.preferredWorkouts,
                    diet: userProfile.dietaryPreference,
                    equipment: userProfile.equipmentAvailable,
                    timeAvailable: userProfile.workoutTime,
                    notifications: true
                },
                userId: this.generateUserId()
            };

            if (this.storage.set('healthai_current_user', user)) {
                this.currentUser = user;
                this.handleUserLoggedIn();
                this.closeAuthModal();
                this.showToast('Account created successfully! Welcome to HealthAI.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                throw new Error('Storage failed');
            }
        } catch (error) {
            this.showToast('Signup failed. Please try again.', 'error');
            console.error('Signup error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // New method for user profiling questions
    async showUserProfilingQuestions(name) {
        return new Promise((resolve) => {
            // Create profiling modal
            const profilingModal = document.createElement('div');
            profilingModal.className = 'auth-modal';
            profilingModal.style.display = 'flex';
            profilingModal.innerHTML = `
                <div class="auth-container" style="max-width: 600px;">
                    <div class="auth-header">
                        <h2>Tell Us About Yourself</h2>
                        <p>Help us personalize your HealthAI experience, ${name}!</p>
                        <button class="close-auth" id="closeProfiling">&times;</button>
                    </div>
                    <div class="profiling-content">
                        <form id="profilingForm">
                            <!-- Fitness Level -->
                            <div class="form-group">
                                <label for="fitnessLevel">What's your current fitness level?</label>
                                <select id="fitnessLevel" required>
                                    <option value="">Select your level</option>
                                    <option value="beginner">Beginner - New to exercise</option>
                                    <option value="intermediate">Intermediate - Some experience</option>
                                    <option value="advanced">Advanced - Regular exerciser</option>
                                </select>
                            </div>

                            <!-- Fitness Goal -->
                            <div class="form-group">
                                <label for="fitnessGoal">What's your primary fitness goal?</label>
                                <select id="fitnessGoal" required>
                                    <option value="">Select your goal</option>
                                    <option value="weight_loss">Weight Loss</option>
                                    <option value="muscle_gain">Muscle Building</option>
                                    <option value="endurance">Improve Endurance</option>
                                    <option value="strength">Get Stronger</option>
                                    <option value="general_fitness">General Fitness</option>
                                </select>
                            </div>

                            <!-- Preferred Workouts -->
                            <div class="form-group">
                                <label>What type of workouts do you prefer? (Select all that apply)</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="workoutType" value="strength"> Strength Training
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="workoutType" value="cardio"> Cardio
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="workoutType" value="yoga"> Yoga & Flexibility
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="workoutType" value="hiit"> HIIT
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="workoutType" value="sports"> Sports
                                    </label>
                                </div>
                            </div>

                            <!-- Available Equipment -->
                            <div class="form-group">
                                <label>What equipment do you have access to?</label>
                                <div class="checkbox-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="equipment" value="none" checked> Bodyweight Only
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="equipment" value="dumbbells"> Dumbbells
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="equipment" value="resistance_bands"> Resistance Bands
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="equipment" value="yoga_mat"> Yoga Mat
                                    </label>
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="equipment" value="gym_access"> Gym Access
                                    </label>
                                </div>
                            </div>

                            <!-- Workout Time -->
                            <div class="form-group">
                                <label for="workoutTime">How much time can you dedicate to workouts?</label>
                                <select id="workoutTime" required>
                                    <option value="">Select time availability</option>
                                    <option value="15-30">15-30 minutes</option>
                                    <option value="30-45">30-45 minutes</option>
                                    <option value="45-60">45-60 minutes</option>
                                    <option value="60+">60+ minutes</option>
                                </select>
                            </div>

                            <!-- Dietary Preference -->
                            <div class="form-group">
                                <label for="dietaryPreference">What's your dietary preference?</label>
                                <select id="dietaryPreference" required>
                                    <option value="">Select preference</option>
                                    <option value="balanced">Balanced</option>
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="keto">Keto</option>
                                    <option value="low_carb">Low Carb</option>
                                    <option value="gluten_free">Gluten Free</option>
                                </select>
                            </div>

                            <!-- Target Weight -->
                            <div class="form-group">
                                <label for="targetWeight">What's your target weight? (optional)</label>
                                <input type="number" id="targetWeight" placeholder="Enter in lbs or kgs">
                            </div>

                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                                Complete Profile & Get Started
                            </button>
                        </form>
                    </div>
                </div>
            `;

            document.body.appendChild(profilingModal);

            // Close button
            document.getElementById('closeProfiling').addEventListener('click', () => {
                document.body.removeChild(profilingModal);
                resolve(null);
            });

            // Handle form submission
            document.getElementById('profilingForm').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const workoutTypes = formData.getAll('workoutType');
                const equipment = formData.getAll('equipment');

                const profile = {
                    fitnessLevel: document.getElementById('fitnessLevel').value,
                    fitnessGoal: document.getElementById('fitnessGoal').value,
                    preferredWorkouts: workoutTypes,
                    equipmentAvailable: equipment,
                    workoutTime: document.getElementById('workoutTime').value,
                    dietaryPreference: document.getElementById('dietaryPreference').value,
                    targetWeight: document.getElementById('targetWeight').value || null
                };

                document.body.removeChild(profilingModal);
                resolve(profile);
            });

            // Close modal when clicking outside
            profilingModal.addEventListener('click', (e) => {
                if (e.target === profilingModal) {
                    document.body.removeChild(profilingModal);
                    resolve(null);
                }
            });
        });
    }

    handleSocialLogin() {
        const socialUser = {
            name: 'Social User',
            email: 'social@example.com',
            joinDate: new Date().toISOString(),
            social: true,
            userId: this.generateUserId()
        };

        if (this.storage.set('healthai_current_user', socialUser)) {
            this.currentUser = socialUser;
            this.handleUserLoggedIn();
            this.closeAuthModal();
            this.showToast('Social login successful! Welcome to HealthAI.', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        }
    }

    handleLogout(e) {
        e.preventDefault();
        
        this.storage.remove('healthai_current_user');
        this.storage.remove('healthai_user');
        this.currentUser = null;
        
        this.handleUserLoggedOut();
        
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) userDropdown.classList.remove('active');
        
        this.showToast('You have been logged out successfully.', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    toggleUserMenu(e) {
        e.stopPropagation();
        const userDropdown = document.getElementById('userDropdown');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userDropdown && userAvatar) {
            const isExpanded = userDropdown.classList.toggle('active');
            userAvatar.setAttribute('aria-expanded', isExpanded.toString());
        }
    }

    // Utility methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    simulateAPICall(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    showToast(message, type = 'info') {
        // Remove existing toasts
        document.querySelectorAll('.toast-message').forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" aria-label="Close notification">
                &times;
            </button>
        `;

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Initialize the authentication system
const healthAIAuth = new HealthAIAuth();