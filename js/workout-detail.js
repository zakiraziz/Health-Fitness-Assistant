// Workout Detail Functionality
document.addEventListener('DOMContentLoaded', function() {
    const startWorkoutBtn = document.querySelector('.start-workout-btn');
    const workoutTimerModal = document.getElementById('workoutTimerModal');
    const closeTimerBtn = document.querySelector('.close-timer');
    const pauseTimerBtn = document.getElementById('pauseTimer');
    const nextExerciseBtn = document.getElementById('nextExercise');
    const timeDisplay = document.querySelector('.time');
    const timerProgress = document.querySelector('.timer-progress');
    const currentExerciseEl = document.querySelector('.current-exercise h3');
    const currentSetEl = document.querySelector('.current-exercise p');
    const exerciseProgressEl = document.querySelector('.exercise-progress span');
    const progressBar = document.querySelector('.progress-bar .progress');
    
    let timerInterval;
    let currentTime = 30; // 30 seconds for demo
    let isPaused = false;
    let currentWorkout = null;
    let currentExerciseIndex = 0;
    let currentSet = 1;
    let totalSets = 3;
    
    // Workout data structure
    const workoutData = {
        'fullbody-beginner': {
            exercises: [
                {
                    name: 'Bodyweight Squats',
                    sets: 3,
                    reps: 12,
                    restTime: 60,
                    workTime: 45
                },
                {
                    name: 'Push-ups (Knee)',
                    sets: 3,
                    reps: 10,
                    restTime: 45,
                    workTime: 40
                },
                {
                    name: 'Plank',
                    sets: 3,
                    duration: 30, // seconds
                    restTime: 30,
                    workTime: 30
                },
                {
                    name: 'Glute Bridges',
                    sets: 3,
                    reps: 15,
                    restTime: 45,
                    workTime: 35
                }
            ],
            totalExercises: 4
        }
    };
    
    // Start workout with instructions first
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function() {
            const workoutId = this.getAttribute('data-workout') || 'fullbody-beginner';
            workoutInstructions.showWorkoutInstructions(workoutId);
        });
    }
    
    // Enhanced start workout function
    function startWorkoutTimer(workoutId) {
        currentWorkout = workoutData[workoutId];
        if (!currentWorkout) return;
        
        currentExerciseIndex = 0;
        currentSet = 1;
        startExercise();
        workoutTimerModal.style.display = 'flex';
    }
    
    function startExercise() {
        if (currentExerciseIndex >= currentWorkout.exercises.length) {
            // Workout completed
            workoutCompleted();
            return;
        }
        
        const exercise = currentWorkout.exercises[currentExerciseIndex];
        currentTime = exercise.workTime;
        updateTimerDisplay();
        
        // Update UI
        if (currentExerciseEl) {
            currentExerciseEl.textContent = exercise.name;
        }
        if (currentSetEl) {
            currentSetEl.textContent = `Set ${currentSet} of ${exercise.sets}`;
        }
        if (exerciseProgressEl) {
            exerciseProgressEl.textContent = `${currentExerciseIndex + 1} of ${currentWorkout.totalExercises} exercises`;
        }
        if (progressBar) {
            const progress = ((currentExerciseIndex) / currentWorkout.totalExercises) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        startTimer();
    }
    
    function nextSet() {
        const exercise = currentWorkout.exercises[currentExerciseIndex];
        currentSet++;
        
        if (currentSet > exercise.sets) {
            // Move to next exercise
            currentExerciseIndex++;
            currentSet = 1;
            
            if (currentExerciseIndex >= currentWorkout.exercises.length) {
                // Workout completed
                workoutCompleted();
                return;
            }
        }
        
        // Start rest period before next set
        const nextExercise = currentWorkout.exercises[currentExerciseIndex];
        currentTime = nextExercise.restTime;
        updateTimerDisplay();
        
        if (currentExerciseEl) {
            currentExerciseEl.textContent = 'Rest Period';
        }
        if (currentSetEl) {
            currentSetEl.textContent = `Next: ${nextExercise.name} - Set ${currentSet}`;
        }
        
        startTimer();
    }
    
    function workoutCompleted() {
        clearInterval(timerInterval);
        if (timeDisplay) {
            timeDisplay.textContent = '00:00';
        }
        if (currentExerciseEl) {
            currentExerciseEl.textContent = 'Workout Completed!';
        }
        if (currentSetEl) {
            currentSetEl.textContent = 'Great job! You finished the workout.';
        }
        
        // Show completion message
        setTimeout(() => {
            if (workoutTimerModal) {
                workoutTimerModal.style.display = 'none';
            }
            workoutInstructions.showToast('Workout completed successfully! 🎉', 'success');
        }, 3000);
    }
    
    // Close timer
    if (closeTimerBtn) {
        closeTimerBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to end the workout? Your progress will be lost.')) {
                workoutTimerModal.style.display = 'none';
                resetTimer();
            }
        });
    }
    
    // Pause/Resume timer
    if (pauseTimerBtn) {
        pauseTimerBtn.addEventListener('click', function() {
            if (isPaused) {
                startTimer();
                pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                pauseTimerBtn.classList.remove('btn-primary');
                pauseTimerBtn.classList.add('btn-outline');
            } else {
                clearInterval(timerInterval);
                pauseTimerBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                pauseTimerBtn.classList.remove('btn-outline');
                pauseTimerBtn.classList.add('btn-primary');
            }
            isPaused = !isPaused;
        });
    }
    
    // Next exercise
    if (nextExerciseBtn) {
        nextExerciseBtn.addEventListener('click', function() {
            clearInterval(timerInterval);
            nextSet();
        });
    }
    
    function startTimer() {
        clearInterval(timerInterval);
        isPaused = false;
        if (pauseTimerBtn) {
            pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseTimerBtn.classList.remove('btn-primary');
            pauseTimerBtn.classList.add('btn-outline');
        }
        
        timerInterval = setInterval(function() {
            if (currentTime > 0) {
                currentTime--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                // Timer completed - check if it's work or rest period
                const exercise = currentWorkout.exercises[currentExerciseIndex];
                const isRestPeriod = currentExerciseEl.textContent === 'Rest Period';
                
                if (isRestPeriod) {
                    // Rest period ended, start next set
                    startExercise();
                } else {
                    // Work period ended, start rest or next set
                    if (currentSet < exercise.sets) {
                        // Start rest period for next set
                        currentTime = exercise.restTime;
                        updateTimerDisplay();
                        if (currentExerciseEl) {
                            currentExerciseEl.textContent = 'Rest Period';
                        }
                        if (currentSetEl) {
                            currentSetEl.textContent = `Next: Set ${currentSet + 1} of ${exercise.sets}`;
                        }
                        startTimer();
                    } else {
                        // Move to next exercise
                        nextSet();
                    }
                }
            }
        }, 1000);
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        currentTime = 30;
        isPaused = false;
        if (pauseTimerBtn) {
            pauseTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            pauseTimerBtn.classList.remove('btn-primary');
            pauseTimerBtn.classList.add('btn-outline');
        }
        updateTimerDisplay();
    }
    
    function updateTimerDisplay() {
        if (timeDisplay) {
            timeDisplay.textContent = formatTime(currentTime);
        }
        if (timerProgress) {
            const exercise = currentWorkout ? currentWorkout.exercises[currentExerciseIndex] : null;
            const totalTime = exercise ? (currentExerciseEl.textContent === 'Rest Period' ? exercise.restTime : exercise.workTime) : 30;
            const progress = ((totalTime - currentTime) / totalTime) * 100;
            timerProgress.style.background = `conic-gradient(var(--accent) ${progress}%, var(--light-gray) 0%)`;
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Exercise demo buttons
    document.querySelectorAll('.exercise-demo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseName = this.closest('.exercise-item').querySelector('h3').textContent;
            workoutInstructions.showToast(`Demo video would play for: ${exerciseName}`, 'info');
        });
    });
    
    // Make startWorkoutTimer available globally for the instructions system
    window.startWorkoutTimer = startWorkoutTimer;
});

// Enhanced workout instructions system integration
document.addEventListener('DOMContentLoaded', function() {
    // Override the startWorkoutWithTimer method to use our enhanced timer
    if (typeof workoutInstructions !== 'undefined') {
        workoutInstructions.startWorkoutWithTimer = function(workoutId) {
            this.showToast(`Starting ${this.workouts[workoutId].name}!`, 'success');
            
            // Start the enhanced workout timer
            if (typeof startWorkoutTimer !== 'undefined') {
                startWorkoutTimer(workoutId);
            } else {
                // Fallback to basic timer
                setTimeout(() => {
                    alert(`Workout Timer Started!\n\n${this.workouts[workoutId].name}\nDuration: ${this.workouts[workoutId].totalTime}\n\nFollow the instructions and complete your workout!`);
                }, 1000);
            }
        };
    }
});
// Workout Detail Functionality - Simplified
document.addEventListener('DOMContentLoaded', function() {
    const startWorkoutBtn = document.querySelector('.start-workout-btn');
    
    // Start workout with instructions
    if (startWorkoutBtn) {
        startWorkoutBtn.addEventListener('click', function() {
            const workoutId = this.getAttribute('data-workout') || 'fullbody-beginner';
            workoutInstructions.showWorkoutInstructions(workoutId);
        });
    }
    
    // Exercise demo buttons
    document.querySelectorAll('.exercise-demo-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseName = this.closest('.exercise-item').querySelector('h3').textContent;
            workoutInstructions.showToast(`Demo video would play for: ${exerciseName}`, 'info');
        });
    });
});