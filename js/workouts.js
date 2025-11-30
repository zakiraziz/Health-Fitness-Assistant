// Workouts Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workoutCards = document.querySelectorAll('.workout-card');
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Filter workouts
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
    
    // Category filter
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update filter buttons
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === category) {
                    btn.click();
                }
            });
            
            // Scroll to workouts
            document.querySelector('.workouts-grid').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Save workout functionality
    const saveButtons = document.querySelectorAll('.save-workout-btn');
    saveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const workoutCard = this.closest('.workout-card');
            const workoutName = workoutCard.querySelector('h3').textContent;
            
            // Toggle save state
            const isSaved = this.classList.contains('saved');
            
            if (isSaved) {
                this.classList.remove('saved');
                this.innerHTML = '<i class="far fa-bookmark"></i> Save';
                showMessage(`Removed ${workoutName} from saved workouts`, 'info');
            } else {
                this.classList.add('saved');
                this.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                showMessage(`Saved ${workoutName} to your workouts`, 'success');
            }
        });
    });
    
    // Update workout stats
    updateWorkoutStats();
    
    function updateWorkoutStats() {
        // In a real app, this would fetch data from an API
        const stats = {
            total: workoutCards.length,
            avgDuration: 35,
            caloriesAvg: 280
        };
        
        document.getElementById('totalWorkouts').textContent = stats.total;
        document.getElementById('avgDuration').textContent = stats.avgDuration;
        document.getElementById('caloriesAvg').textContent = stats.caloriesAvg;
    }
    
    function showMessage(message, type = 'info') {
        // Use the toast function from auth.js or create a simple alert
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            alert(message);
        }
    }
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