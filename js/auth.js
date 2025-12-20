// js/auth.js - ENHANCED SINGLE auth file for ALL pages
(function() {
    'use strict';
    
    // Configuration
    const AUTH_CONFIG = {
        publishableKey: 'pk_test_bWFnbmV0aWMtbXVkZnIzaC0xLmNsZXJrLmFjY291bnRzLmRldiQ',
        protectedPages: ['dashboard.html', 'profile.html', 'progress.html', 'settings.html', 'chat.html'],
        publicPages: ['index.html', 'workouts.html', 'nutrition.html', 'about.html', 'contact.html'],
        authPages: ['auth.html'],
        redirectAfterLogin: 'dashboard.html',
        redirectAfterLogout: 'index.html',
        authPageUrl: 'auth.html',
        appName: 'HealthAI',
        appLogo: '💪'
    };
    
    // State management
    let clerk = null;
    let isInitialized = false;
    let isInitializing = false;
    let authListeners = [];
    
    // NEW: Toast notification system
    function showToast(message, type = 'info', duration = 5000) {
        // Remove existing toasts
        document.querySelectorAll('.healthai-toast').forEach(toast => {
            toast.remove();
        });
        
        const toast = document.createElement('div');
        toast.className = `healthai-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        // Add inline styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: toastSlideIn 0.3s ease;
            min-width: 250px;
            max-width: 350px;
        `;
        
        const toastContent = toast.querySelector('.toast-content');
        toastContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        `;
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        `;
        
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.2)';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'none';
        });
        
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Add CSS animations if not present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'toastSlideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
        
        return toast;
    }
    
    // NEW: Add auth event listener
    function addAuthListener(callback) {
        authListeners.push(callback);
        return () => {
            authListeners = authListeners.filter(cb => cb !== callback);
        };
    }
    
    // NEW: Notify all listeners
    function notifyAuthListeners(user) {
        authListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('Auth listener error:', error);
            }
        });
    }
    
    // NEW: Get user session token
    async function getSessionToken() {
        if (!clerk || !clerk.session) return null;
        
        try {
            return await clerk.session.getToken();
        } catch (error) {
            console.error('Failed to get session token:', error);
            return null;
        }
    }
    
    // Initialize auth
    async function initAuth() {
        if (isInitialized || isInitializing) return;
        
        isInitializing = true;
        
        try {
            console.log('🔐 Initializing auth system...');
            showToast('Loading authentication...', 'info', 2000);
            
            // Load Clerk SDK if not loaded
            if (!window.Clerk) {
                console.log('📦 Loading Clerk SDK...');
                await loadClerkSDK();
            }
            
            console.log('✅ Clerk SDK loaded, initializing...');
            
            // Initialize Clerk with enhanced options
            clerk = await window.Clerk.load({
                publishableKey: AUTH_CONFIG.publishableKey,
                options: {
                    appearance: {
                        variables: {
                            colorPrimary: '#6C63FF',
                            colorText: '#333333',
                            colorBackground: '#ffffff',
                            colorInputBackground: '#f8f9fa',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }
                    }
                }
            });
            
            isInitialized = true;
            isInitializing = false;
            console.log('✅ Auth system initialized');
            
            // Update UI
            updateAuthUI();
            
            // Setup event listeners
            setupAuthEvents();
            
            // Protect current page
            protectCurrentPage();
            
            // Listen for auth changes
            clerk.addListener(handleAuthChange);
            
            // NEW: Load user preferences
            loadUserPreferences();
            
            showToast('Authentication ready!', 'success', 2000);
            
        } catch (error) {
            console.error('❌ Auth initialization failed:', error);
            isInitializing = false;
            showToast('Authentication service unavailable', 'error', 5000);
            showFallbackUI();
        }
    }
    
    // NEW: Load user preferences
    function loadUserPreferences() {
        if (!clerk?.user) return;
        
        try {
            // Load user preferences from localStorage
            const prefs = localStorage.getItem(`healthai_prefs_${clerk.user.id}`);
            if (prefs) {
                console.log('Loaded user preferences:', JSON.parse(prefs));
            }
            
            // Set user theme preference
            const theme = localStorage.getItem('healthai_theme') || 'light';
            document.documentElement.setAttribute('data-theme', theme);
            
        } catch (error) {
            console.error('Failed to load user preferences:', error);
        }
    }
    
    // Load Clerk SDK
    async function loadClerkSDK() {
        return new Promise((resolve, reject) => {
            if (window.Clerk) {
                resolve();
                return;
            }
            
            // Check if already loading
            if (document.querySelector('script[src*="clerk-js"]')) {
                // Wait for existing script to load
                const checkInterval = setInterval(() => {
                    if (window.Clerk) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
            script.async = true;
            
            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    }
    
    // Update auth UI
    function updateAuthUI() {
        if (!clerk) return;
        
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');
        const userInitials = document.getElementById('userInitials');
        
        if (!authButtons || !userMenu) {
            console.log('⚠️ Auth UI elements not found on this page');
            return;
        }
        
        if (clerk.user) {
            // User is logged in
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            
            const user = clerk.user;
            const firstName = user.firstName || '';
            const lastName = user.lastName || '';
            const fullName = firstName + (lastName ? ' ' + lastName : '');
            const email = user.primaryEmailAddress?.emailAddress || 
                         user.emailAddresses[0]?.emailAddress || '';
            
            if (userName) userName.textContent = fullName || 'User';
            if (userEmail) userEmail.textContent = email;
            
            // Generate initials
            const initials = (firstName.charAt(0) + (lastName.charAt(0) || '')).toUpperCase() || 'U';
            
            if (userAvatar) {
                userAvatar.textContent = initials;
                // Add random background color
                const colors = ['#6C63FF', '#4A47B9', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                userAvatar.style.backgroundColor = randomColor;
            }
            
            if (userInitials) {
                userInitials.textContent = initials;
            }
            
            console.log('✅ User is logged in:', fullName);
            
            // NEW: Update page title with user info
            updatePageTitle(fullName);
            
        } else {
            // User is logged out
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
            console.log('👤 User is logged out');
            
            // Reset page title
            updatePageTitle();
        }
    }
    
    // NEW: Update page title with user info
    function updatePageTitle(userName = '') {
        const currentPage = getCurrentPage();
        const pageTitles = {
            'index.html': 'HealthAI - Home',
            'dashboard.html': `Dashboard${userName ? ` - ${userName}` : ''}`,
            'profile.html': `Profile${userName ? ` - ${userName}` : ''}`,
            'progress.html': 'Progress',
            'settings.html': 'Settings',
            'chat.html': 'AI Assistant',
            'workouts.html': 'Workouts',
            'nutrition.html': 'Nutrition'
        };
        
        document.title = pageTitles[currentPage] || 'HealthAI';
    }
    
    // Handle auth changes
    function handleAuthChange({ user }) {
        console.log('🔄 Auth state changed:', user ? 'User signed in' : 'User signed out');
        
        updateAuthUI();
        notifyAuthListeners(user);
        
        const currentPage = getCurrentPage();
        
        if (user) {
            // User signed in
            const userName = user.firstName || user.emailAddresses[0]?.emailAddress;
            console.log('✅ User signed in:', userName);
            showToast(`Welcome ${user.firstName ? `back, ${user.firstName}!` : 'back!'}`, 'success', 3000);
            
            // Redirect from auth pages
            if (AUTH_CONFIG.authPages.includes(currentPage)) {
                const redirect = getRedirectFromStorage() || AUTH_CONFIG.redirectAfterLogin;
                console.log(`🔀 Redirecting from auth page to: ${redirect}`);
                
                setTimeout(() => {
                    window.location.href = redirect;
                }, 1500);
            }
            
            // NEW: Track login event
            trackAuthEvent('login_success', { userId: user.id });
            
        } else {
            // User signed out
            console.log('👤 User signed out');
            showToast('Signed out successfully', 'info', 3000);
            
            // Redirect from protected pages
            if (AUTH_CONFIG.protectedPages.includes(currentPage)) {
                console.log(`🔀 Redirecting from protected page to: ${AUTH_CONFIG.redirectAfterLogout}`);
                
                setTimeout(() => {
                    window.location.href = AUTH_CONFIG.redirectAfterLogout;
                }, 1000);
            }
            
            // NEW: Track logout event
            trackAuthEvent('logout');
        }
    }
    
    // NEW: Track auth events
    function trackAuthEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            page: getCurrentPage(),
            ...data
        };
        
        console.log('📊 Auth event:', eventData);
        
        // In a real app, send to analytics service
        // Example: sendToAnalytics('auth_event', eventData);
    }
    
    // Setup event listeners
    function setupAuthEvents() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            // Remove existing listeners
            const newLoginBtn = loginBtn.cloneNode(true);
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            newLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Login button clicked');
                trackAuthEvent('login_click');
                redirectToAuth('login');
            });
        }
        
        // Signup button
        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn) {
            // Remove existing listeners
            const newSignupBtn = signupBtn.cloneNode(true);
            signupBtn.parentNode.replaceChild(newSignupBtn, signupBtn);
            
            newSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Signup button clicked');
                trackAuthEvent('signup_click');
                redirectToAuth('signup');
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!clerk) return;
                
                try {
                    console.log('🖱️ Logout button clicked');
                    trackAuthEvent('logout_click');
                    await clerk.signOut();
                } catch (error) {
                    console.error('❌ Logout failed:', error);
                    showToast('Logout failed. Please try again.', 'error', 3000);
                }
            });
        }
        
        // User dropdown
        const userAvatar = document.getElementById('userAvatar');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.user-dropdown.active').forEach(dropdown => {
                    if (dropdown !== userDropdown) {
                        dropdown.classList.remove('active');
                    }
                });
            });
            
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userAvatar.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
            
            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && userDropdown.classList.contains('active')) {
                    userDropdown.classList.remove('active');
                    userAvatar.focus();
                }
            });
        }
        
        // Protect links to protected pages
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href) return;
            
            const pageName = href.split('/').pop() || href;
            
            // Check if it's a protected page
            if (AUTH_CONFIG.protectedPages.includes(pageName)) {
                // If user is not logged in, intercept
                if (!clerk?.user) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log(`🔒 Protecting link to: ${href}`);
                    trackAuthEvent('protected_link_click', { page: pageName });
                    
                    // Store redirect URL
                    saveRedirectToStorage(href);
                    
                    // Show message first
                    showToast('Please sign in to continue', 'info', 2000);
                    
                    // Then redirect to auth page
                    setTimeout(() => {
                        redirectToAuth('login', href);
                    }, 1000);
                }
            }
        }, true);
        
        // NEW: Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+L for login (development only)
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                redirectToAuth('login');
            }
            
            // Ctrl+Shift+K for signup (development only)
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                e.preventDefault();
                redirectToAuth('signup');
            }
        });
    }
    
    // Protect current page
    function protectCurrentPage() {
        if (!clerk) return;
        
        const currentPage = getCurrentPage();
        
        // Check if current page is protected
        if (AUTH_CONFIG.protectedPages.includes(currentPage)) {
            if (!clerk.user) {
                console.log(`🚫 Protected page accessed without auth: ${currentPage}`);
                trackAuthEvent('protected_page_access', { page: currentPage, unauthorized: true });
                
                // Store current page for redirect after login
                saveRedirectToStorage(currentPage);
                
                // Show message first
                showToast('Authentication required', 'info', 2000);
                
                // Then redirect to auth page
                setTimeout(() => {
                    redirectToAuth('login', currentPage);
                }, 1500);
            } else {
                trackAuthEvent('protected_page_access', { page: currentPage, authorized: true });
            }
        }
        
        // If on auth page and already logged in, redirect
        if (AUTH_CONFIG.authPages.includes(currentPage)) {
            if (clerk.user) {
                console.log(`✅ Already logged in, redirecting from auth page`);
                
                const redirect = getRedirectFromStorage() || AUTH_CONFIG.redirectAfterLogin;
                
                showToast('Already signed in! Redirecting...', 'success', 2000);
                
                setTimeout(() => {
                    window.location.href = redirect;
                }, 2000);
            }
        }
    }
    
    // Redirect to auth page
    function redirectToAuth(action = 'login', redirectTo = null) {
        const currentPage = getCurrentPage();
        const redirect = redirectTo || currentPage;
        
        let url = `${AUTH_CONFIG.authPageUrl}?action=${action}`;
        
        if (redirect && !AUTH_CONFIG.authPages.includes(redirect)) {
            url += `&redirect=${encodeURIComponent(redirect)}`;
        }
        
        console.log(`🔗 Redirecting to auth page: ${url}`);
        
        // Add timestamp to prevent caching issues
        url += `&_t=${Date.now()}`;
        
        window.location.href = url;
    }
    
    // Save redirect URL to storage
    function saveRedirectToStorage(url) {
        sessionStorage.setItem('healthai_redirect', url);
        localStorage.setItem('healthai_last_redirect', url);
    }
    
    // Get redirect URL from storage
    function getRedirectFromStorage() {
        return sessionStorage.getItem('healthai_redirect') || 
               localStorage.getItem('healthai_last_redirect');
    }
    
    // Clear redirect storage
    function clearRedirectStorage() {
        sessionStorage.removeItem('healthai_redirect');
        localStorage.removeItem('healthai_last_redirect');
    }
    
    // Get current page
    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // Handle hash URLs
        if (page.includes('#')) {
            return page.split('#')[0];
        }
        
        return page;
    }
    
    // Show fallback UI
    function showFallbackUI() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        
        if (authButtons) {
            authButtons.style.display = 'flex';
            
            // Add offline mode indicators
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline Login';
                loginBtn.title = 'Authentication service is offline';
                loginBtn.style.opacity = '0.7';
            }
            
            if (signupBtn) {
                signupBtn.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline Signup';
                signupBtn.title = 'Authentication service is offline';
                signupBtn.style.opacity = '0.7';
            }
        }
        
        if (userMenu) {
            userMenu.style.display = 'none';
        }
        
        console.log('⚠️ Showing fallback auth UI');
        
        // Show offline message
        showToast('Working in offline mode. Some features may be limited.', 'warning', 5000);
    }
    
    // NEW: Check auth status periodically
    function startAuthHealthCheck() {
        setInterval(async () => {
            if (clerk && clerk.user) {
                try {
                    // Try to refresh session
                    await clerk.session?.touch();
                } catch (error) {
                    console.warn('Session health check failed:', error);
                }
            }
        }, 5 * 60 * 1000); // Every 5 minutes
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded, initializing auth...');
        
        // Check if we're on an auth page (don't auto-init there)
        const currentPage = getCurrentPage();
        
        if (AUTH_CONFIG.authPages.includes(currentPage)) {
            console.log('🔐 On auth page, delaying auth init...');
            // Auth page has its own initialization
        } else {
            // Start auth initialization for regular pages
            setTimeout(() => {
                initAuth();
                startAuthHealthCheck();
            }, 100);
        }
        
        // NEW: Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && clerk) {
                // Page became visible, refresh auth state
                updateAuthUI();
            }
        });
    });
    
    // Make functions globally available
    window.getCurrentUser = () => clerk?.user || null;
    window.isUserAuthenticated = () => !!clerk?.user;
    window.getSessionToken = getSessionToken;
    window.showAuthToast = showToast;
    window.addAuthListener = addAuthListener;
    window.clearAuthRedirect = clearRedirectStorage;
    
    window.healthaiAuth = {
        init: initAuth,
        user: () => clerk?.user,
        signOut: () => clerk?.signOut(),
        redirectToAuth: redirectToAuth,
        getToken: getSessionToken,
        isInitialized: () => isInitialized,
        getConfig: () => ({ ...AUTH_CONFIG }),
        refresh: () => {
            if (clerk) {
                updateAuthUI();
                return true;
            }
            return false;
        }
    };
    
    console.log('✅ Enhanced auth system script loaded');
    
})();