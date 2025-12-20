// Main JavaScript for HealthAI Website
// Keep your existing workout code, just add Clerk initialization

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Initialize your other components first
        initWorkoutFilters();
        initNavigation();
        initLocalAuth(); // Keep fallback active initially
        
        // Try to initialize Clerk if available
        await initClerk();
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        // Ensure local auth is always active as fallback
        initLocalAuth();
    }
});

// Initialize Clerk with proper error handling
async function initClerk() {
    // Only proceed if Clerk is available and key exists
    if (!window.Clerk || !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
        console.warn('Clerk not available, using local auth');
        return;
    }
    
    try {
        const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
        
        // Check if Clerk is already loaded
        if (window.clerk && window.clerk.user) {
            console.log('Clerk already initialized');
            updateAuthState();
            return;
        }
        
        // Initialize Clerk
        window.clerk = new window.Clerk(clerkPubKey);
        await window.clerk.load({
            // Optional configuration
            signInUrl: '/sign-in.html',
            signUpUrl: '/sign-up.html',
            afterSignInUrl: '/dashboard.html',
            afterSignUpUrl: '/dashboard.html'
        });
        
        // Mount Clerk components if needed
        mountClerkComponents();
        
        // Initialize auth UI
        initClerkAuthUI();
        
        console.log('Clerk initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize Clerk:', error);
        // Don't throw, just fall back to local auth
        initLocalAuth();
    }
}

// Mount Clerk UI components
function mountClerkComponents() {
    if (!window.clerk) return;
    
    // Mount Sign-In button if element exists
    const signInDiv = document.getElementById('clerk-sign-in');
    if (signInDiv) {
        window.clerk.mountSignIn(signInDiv);
    }
    
    // Mount Sign-Up button if element exists
    const signUpDiv = document.getElementById('clerk-sign-up');
    if (signUpDiv) {
        window.clerk.mountSignUp(signUpDiv);
    }
    
    // Mount User Button if element exists
    const userButtonDiv = document.getElementById('clerk-user-button');
    if (userButtonDiv) {
        window.clerk.mountUserButton(userButtonDiv);
    }
}

// Initialize Clerk auth UI
function initClerkAuthUI() {
    if (!window.clerk) return;
    
    // Update UI based on current auth state
    updateAuthState();
    
    // Listen for auth changes
    window.clerk.addListener(({ user }) => {
        updateAuthState();
        
        // Additional logic on auth state change
        if (user) {
            console.log('User signed in:', user.fullName);
            // Redirect or update UI as needed
            if (window.location.pathname.includes('sign-in') || 
                window.location.pathname.includes('sign-up')) {
                window.location.href = '/dashboard.html';
            }
        } else {
            console.log('User signed out');
        }
    });
    
    // Setup custom button handlers
    setupCustomAuthButtons();
}

// Setup custom auth buttons (for buttons you create manually)
function setupCustomAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userAvatar = document.getElementById('userAvatar');
    
    if (loginBtn && window.clerk) {
        loginBtn.addEventListener('click', () => {
            window.clerk.openSignIn();
        });
    }
    
    if (signupBtn && window.clerk) {
        signupBtn.addEventListener('click', () => {
            window.clerk.openSignUp();
        });
    }
    
    if (logoutBtn && window.clerk) {
        logoutBtn.addEventListener('click', async () => {
            await window.clerk.signOut();
            window.location.href = '/index.html';
        });
    }
    
    if (userAvatar && window.clerk) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            if (dropdown && !dropdown.contains(e.target) && !userAvatar.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Update auth state for both Clerk and local auth
function updateAuthState() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    // Check Clerk first
    if (window.clerk && window.clerk.user) {
        // Clerk user is signed in
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        const user = window.clerk.user;
        if (userName) {
            userName.textContent = user.fullName || user.firstName || 'User';
        }
        
        if (userEmail) {
            userEmail.textContent = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || '';
        }
        
        if (userAvatar) {
            const initials = (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
            userAvatar.textContent = initials || 'U';
            userAvatar.style.backgroundColor = getRandomColor();
        }
    } 
    // Check local auth (fallback)
    else if (localStorage.getItem('healthai_user')) {
        // Local user is signed in
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        const user = JSON.parse(localStorage.getItem('healthai_user'));
        if (userName) {
            userName.textContent = user.name || 'User';
        }
        
        if (userEmail) {
            userEmail.textContent = user.email || '';
        }
        
        if (userAvatar) {
            userAvatar.textContent = user.name?.charAt(0) || 'U';
            userAvatar.style.backgroundColor = getRandomColor();
        }
    } else {
        // No user signed in
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Fallback local auth
function initLocalAuth() {
    console.log('Initializing local auth');
    
    // Setup local auth forms if they exist
    const localLoginForm = document.getElementById('localLoginForm');
    const localSignupForm = document.getElementById('localSignupForm');
    
    if (localLoginForm) {
        localLoginForm.addEventListener('submit', handleLocalLogin);
    }
    
    if (localSignupForm) {
        localSignupForm.addEventListener('submit', handleLocalSignup);
    }
    
    // Check if user is already logged in locally
    if (localStorage.getItem('healthai_user')) {
        console.log('User found in local storage');
        updateAuthState();
    }
}

function handleLocalLogin(e) {
    e.preventDefault();
    const email = document.getElementById('localEmail').value;
    const password = document.getElementById('localPassword').value;
    
    // Simple validation - in production, use proper authentication
    const users = JSON.parse(localStorage.getItem('healthai_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('healthai_user', JSON.stringify(user));
        updateAuthState();
        window.location.href = '/dashboard.html';
    } else {
        alert('Invalid credentials');
    }
}

function handleLocalSignup(e) {
    e.preventDefault();
    const name = document.getElementById('localName').value;
    const email = document.getElementById('localSignupEmail').value;
    const password = document.getElementById('localSignupPassword').value;
    
    // Simple signup - in production, add validation, hashing, etc.
    const users = JSON.parse(localStorage.getItem('healthai_users') || '[]');
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password // In production, hash this!
    };
    
    users.push(newUser);
    localStorage.setItem('healthai_users', JSON.stringify(users));
    localStorage.setItem('healthai_user', JSON.stringify(newUser));
    
    updateAuthState();
    window.location.href = '/dashboard.html';
}

// Workout Filter Functionality (your existing code)
function initWorkoutFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workoutCards = document.querySelectorAll('.workout-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.getAttribute('data-filter');

                workoutCards.forEach(card => {
                    if (filter === 'all' ||
                        card.getAttribute('data-level') === filter ||
                        card.getAttribute('data-type') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Navigation Active State
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Helper function for random avatar colors
function getRandomColor() {
    const colors = [
        '#4F46E5', '#7C3AED', '#EC4899', 
        '#10B981', '#F59E0B', '#3B82F6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWorkoutFilters,
        initNavigation,
        updateAuthState
    };
}