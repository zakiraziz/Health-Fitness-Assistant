// Main JavaScript for HealthAI Website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initWorkoutFilters();
    initAuthButtons();
    initNavigation();
});

// Workout Filter Functionality
function initWorkoutFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workoutCards = document.querySelectorAll('.workout-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter workout cards
                workoutCards.forEach(card => {
                    if (filter === 'all' || 
                        card.getAttribute('data-level') === filter || 
                        card.getAttribute('data-type') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// Auth Button Functionality (Placeholder)
function initAuthButtons() {
    const loginButtons = document.querySelectorAll('.btn-outline');
    const signupButtons = document.querySelectorAll('.btn-primary');
    
    loginButtons.forEach(button => {
        if (button.textContent.trim() === 'Login') {
            button.addEventListener('click', function() {
                alert('Login functionality would be implemented here!');
            });
        }
    });
    
    signupButtons.forEach(button => {
        if (button.textContent.trim() === 'Sign Up') {
            button.addEventListener('click', function() {
                alert('Sign up functionality would be implemented here!');
            });
        }
    });
}

// Navigation Active State
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});