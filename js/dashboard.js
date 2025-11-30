// Authentication System for HealthAI
document.addEventListener('DOMContentLoaded', function() {
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    const userName = document.getElementById('userName');
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    const isHomePage = currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/');
    const isDashboard = currentPage === 'dashboard.html';
    
    if (currentUser) {
        // User is logged in
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        if (userName) {
            userName.textContent = currentUser.name;
        }
        
        // Only redirect from homepage to dashboard if not already on dashboard
        if (isHomePage && !isDashboard) {
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 100); // Small delay to prevent flicker
        }
    } else {
        // User is not logged in
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
        
        // Redirect to homepage if trying to access protected pages
        const protectedPages = ['dashboard.html', 'progress.html'];
        
        if (protectedPages.includes(currentPage)) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 100);
        }
    }
    
    // Open auth modal for login
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            authModal.style.display = 'flex';
            loginTab.click();
        });
    }
    
    // Open auth modal for signup
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            authModal.style.display = 'flex';
            signupTab.click();
        });
    }
    
    // Switch between login and signup tabs
    if (loginTab) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
    }
    
    if (signupTab) {
        signupTab.addEventListener('click', function() {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simple validation
            if (email && password) {
                // In a real app, you would send this to a server
                // For demo purposes, we'll just store in localStorage
                const user = {
                    name: email.split('@')[0],
                    email: email,
                    joinDate: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Update UI
                authButtons.style.display = 'none';
                userMenu.style.display = 'block';
                userAvatar.textContent = user.name.charAt(0).toUpperCase();
                if (userName) {
                    userName.textContent = user.name;
                }
                
                // Close modal
                authModal.style.display = 'none';
                
                // Show success message
                alert('Login successful! Welcome to HealthAI. Redirecting to your dashboard...');
                
                // Redirect to dashboard after a smooth delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            // Simple validation
            if (name && email && password && confirmPassword) {
                if (password !== confirmPassword) {
                    alert('Passwords do not match.');
                    return;
                }
                
                if (password.length < 6) {
                    alert('Password must be at least 6 characters long.');
                    return;
                }
                
                // In a real app, you would send this to a server
                // For demo purposes, we'll just store in localStorage
                const user = {
                    name: name,
                    email: email,
                    joinDate: new Date().toISOString(),
                    goals: {
                        workout: 3,
                        weight: null,
                        nutrition: 85
                    }
                };
                
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Update UI
                authButtons.style.display = 'none';
                userMenu.style.display = 'block';
                userAvatar.textContent = user.name.charAt(0).toUpperCase();
                if (userName) {
                    userName.textContent = user.name;
                }
                
                // Close modal
                authModal.style.display = 'none';
                
                // Show success message
                alert('Account created successfully! Welcome to HealthAI. Redirecting to your dashboard...');
                
                // Redirect to dashboard after a smooth delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                alert('Please fill in all fields.');
            }
        });
    }
    
    // Toggle user dropdown
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove user from localStorage
            localStorage.removeItem('currentUser');
            
            // Update UI
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
            
            // Close dropdown
            userDropdown.classList.remove('active');
            
            // Show message
            alert('You have been logged out. Redirecting to homepage...');
            
            // Redirect to homepage after a smooth delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (userAvatar && userDropdown && !userAvatar.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.classList.remove('active');
        }
    });
    
    // Social login buttons
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Simulate social login
            const socialUser = {
                name: 'Social User',
                email: 'social@example.com',
                joinDate: new Date().toISOString(),
                social: true
            };
            
            localStorage.setItem('currentUser', JSON.stringify(socialUser));
            
            // Update UI
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            userAvatar.textContent = socialUser.name.charAt(0).toUpperCase();
            if (userName) {
                userName.textContent = socialUser.name;
            }
            
            // Close modal
            authModal.style.display = 'none';
            
            // Show success message
            alert('Social login successful! Welcome to HealthAI. Redirecting to your dashboard...');
            
            // Redirect to dashboard after a smooth delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        });
    });
});
// Add workout instructions functionality
document.addEventListener('DOMContentLoaded', function() {
    // Start workout buttons with instructions
    document.querySelectorAll('.start-workout-btn').forEach(button => {
        button.addEventListener('click', function() {
            const workoutId = this.getAttribute('data-workout');
            workoutInstructions.showWorkoutInstructions(workoutId);
        });
    });

    // Also update the workout detail page buttons
    document.querySelectorAll('.start-workout-btn').forEach(button => {
        button.addEventListener('click', function() {
            const workoutId = this.getAttribute('data-workout') || 'fullbody-beginner';
            workoutInstructions.showWorkoutInstructions(workoutId);
        });
    });
});