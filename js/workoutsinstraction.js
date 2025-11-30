// Workout Instructions System - Complete Integration
class WorkoutInstructions {
    constructor() {
        this.workouts = {
            'fullbody-beginner': {
                name: 'Full Body Beginner Workout',
                instructions: [
                    {
                        exercise: 'Warm-up (5 minutes)',
                        steps: [
                            'Start with 2 minutes of light jogging in place',
                            '30 seconds of arm circles (forward)',
                            '30 seconds of arm circles (backward)',
                            '30 seconds of leg swings (each side)',
                            '30 seconds of torso twists',
                            '1 minute of dynamic stretching'
                        ],
                        tips: [
                            'Focus on controlled movements',
                            'Breathe deeply throughout',
                            'Stop if you feel any pain'
                        ]
                    },
                    {
                        exercise: 'Bodyweight Squats (3 sets × 12 reps)',
                        steps: [
                            'Stand with feet shoulder-width apart',
                            'Keep your chest up and back straight',
                            'Lower your body as if sitting in a chair',
                            'Go as low as you comfortably can',
                            'Push through your heels to return to start'
                        ],
                        tips: [
                            'Keep knees behind toes',
                            'Engage your core throughout',
                            'Don\'t let knees cave inward'
                        ],
                        rest: '60 seconds between sets'
                    },
                    {
                        exercise: 'Push-ups (Knee) (3 sets × 10 reps)',
                        steps: [
                            'Start on hands and knees',
                            'Hands slightly wider than shoulders',
                            'Lower chest towards the ground',
                            'Keep body in straight line',
                            'Push back up to starting position'
                        ],
                        tips: [
                            'Keep elbows at 45-degree angle',
                            'Don\'t let hips sag',
                            'Full range of motion is key'
                        ],
                        rest: '45 seconds between sets'
                    },
                    {
                        exercise: 'Plank (3 sets × 30 seconds)',
                        steps: [
                            'Start on forearms and toes',
                            'Keep body in straight line',
                            'Engage core and glutes',
                            'Hold position for time',
                            'Maintain neutral spine'
                        ],
                        tips: [
                            'Don\'t let hips rise or sag',
                            'Breathe normally',
                            'Focus on keeping core tight'
                        ],
                        rest: '30 seconds between sets'
                    },
                    {
                        exercise: 'Glute Bridges (3 sets × 15 reps)',
                        steps: [
                            'Lie on back with knees bent',
                            'Feet flat on floor, hip-width apart',
                            'Lift hips towards ceiling',
                            'Squeeze glutes at the top',
                            'Lower with control'
                        ],
                        tips: [
                            'Don\'t over-arch your back',
                            'Focus on glute activation',
                            'Keep core engaged'
                        ],
                        rest: '45 seconds between sets'
                    },
                    {
                        exercise: 'Cool-down (5 minutes)',
                        steps: [
                            '30 seconds quad stretch (each side)',
                            '30 seconds hamstring stretch',
                            '30 seconds chest stretch',
                            '30 seconds triceps stretch',
                            '1 minute deep breathing'
                        ],
                        tips: [
                            'Hold each stretch for 20-30 seconds',
                            'Don\'t bounce during stretches',
                            'Breathe deeply and relax'
                        ]
                    }
                ],
                totalTime: '30 minutes',
                calories: '240',
                difficulty: 'Beginner',
                // Enhanced workout data for timer integration
                exercises: [
                    {
                        name: 'Warm-up',
                        type: 'warmup',
                        duration: 300, // 5 minutes in seconds
                        description: 'Dynamic warm-up exercises'
                    },
                    {
                        name: 'Bodyweight Squats',
                        type: 'strength',
                        sets: 3,
                        reps: 12,
                        workTime: 45,
                        restTime: 60
                    },
                    {
                        name: 'Push-ups (Knee)',
                        type: 'strength',
                        sets: 3,
                        reps: 10,
                        workTime: 40,
                        restTime: 45
                    },
                    {
                        name: 'Plank',
                        type: 'core',
                        sets: 3,
                        duration: 30,
                        workTime: 30,
                        restTime: 30
                    },
                    {
                        name: 'Glute Bridges',
                        type: 'strength',
                        sets: 3,
                        reps: 15,
                        workTime: 35,
                        restTime: 45
                    },
                    {
                        name: 'Cool-down',
                        type: 'cooldown',
                        duration: 300, // 5 minutes in seconds
                        description: 'Static stretching'
                    }
                ]
            },
            'hiit-cardio': {
                name: 'HIIT Cardio Blast',
                instructions: [
                    {
                        exercise: 'Warm-up (5 minutes)',
                        steps: [
                            '2 minutes light jogging',
                            '1 minute high knees',
                            '1 minute butt kicks',
                            '1 minute dynamic stretching'
                        ],
                        tips: [
                            'Gradually increase intensity',
                            'Focus on proper form',
                            'Listen to your body'
                        ]
                    },
                    {
                        exercise: 'Jumping Jacks (45 seconds work, 15 seconds rest)',
                        steps: [
                            'Start with feet together, arms at sides',
                            'Jump feet out while raising arms overhead',
                            'Jump back to starting position',
                            'Maintain steady rhythm'
                        ],
                        tips: [
                            'Land softly on balls of feet',
                            'Keep core engaged',
                            'Breathe consistently'
                        ],
                        rest: '15 seconds between sets'
                    },
                    {
                        exercise: 'Mountain Climbers (45 seconds work, 15 seconds rest)',
                        steps: [
                            'Start in plank position',
                            'Bring right knee towards chest',
                            'Quickly switch legs',
                            'Maintain fast pace'
                        ],
                        tips: [
                            'Keep hips level',
                            'Maintain straight back',
                            'Focus on speed and control'
                        ],
                        rest: '15 seconds between sets'
                    },
                    {
                        exercise: 'Burpees (45 seconds work, 15 seconds rest)',
                        steps: [
                            'Start standing',
                            'Drop into squat position',
                            'Kick feet back to plank',
                            'Do a push-up',
                            'Jump feet forward and explode up'
                        ],
                        tips: [
                            'Modify by stepping back',
                            'Maintain good form',
                            'Land softly'
                        ],
                        rest: '15 seconds between sets'
                    }
                ],
                totalTime: '25 minutes',
                calories: '320',
                difficulty: 'Intermediate'
            }
        };
        
        // Initialize workout timer integration
        this.initTimerIntegration();
    }

    initTimerIntegration() {
        // Make startWorkoutTimer available globally
        window.startWorkoutTimer = this.startWorkoutTimer.bind(this);
    }

    showWorkoutInstructions(workoutId) {
        const workout = this.workouts[workoutId];
        if (!workout) {
            this.showToast('Workout instructions not available yet.', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'workout-instructions-modal';
        modal.style.display = 'flex';
        
        let instructionsHTML = '';
        workout.instructions.forEach((section, index) => {
            instructionsHTML += `
                <div class="instruction-section">
                    <h3>${section.exercise}</h3>
                    ${section.rest ? `<div class="rest-time">Rest: ${section.rest}</div>` : ''}
                    <div class="steps">
                        <h4>Steps:</h4>
                        <ol>
                            ${section.steps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    ${section.tips ? `
                    <div class="tips">
                        <h4>Pro Tips:</h4>
                        <ul>
                            ${section.tips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
            `;
        });

        modal.innerHTML = `
            <div class="instructions-container">
                <div class="instructions-header">
                    <h2>${workout.name}</h2>
                    <div class="workout-meta">
                        <span><i class="fas fa-clock"></i> ${workout.totalTime}</span>
                        <span><i class="fas fa-fire"></i> ${workout.calories} calories</span>
                        <span><i class="fas fa-signal"></i> ${workout.difficulty}</span>
                    </div>
                    <button class="close-instructions">&times;</button>
                </div>
                <div class="instructions-content">
                    <div class="workout-overview">
                        <h3>Workout Overview</h3>
                        <p>Complete all exercises in order. Follow the rest periods between sets.</p>
                    </div>
                    ${instructionsHTML}
                    <div class="instructions-actions">
                        <button class="btn btn-primary start-workout-final" data-workout="${workoutId}">
                            <i class="fas fa-play"></i> Start Workout with Timer
                        </button>
                        <button class="btn btn-outline save-workout-plan">
                            <i class="fas fa-bookmark"></i> Save This Plan
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.close-instructions').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.start-workout-final').addEventListener('click', (e) => {
            const workoutId = e.target.getAttribute('data-workout');
            document.body.removeChild(modal);
            this.startWorkoutWithTimer(workoutId);
        });

        modal.querySelector('.save-workout-plan').addEventListener('click', () => {
            this.showToast('Workout plan saved to your favorites!', 'success');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    startWorkoutWithTimer(workoutId) {
        const workout = this.workouts[workoutId];
        this.showToast(`Starting ${workout.name}! Opening workout timer...`, 'success');
        
        // Use the enhanced workout timer system
        this.startWorkoutTimer(workoutId);
    }

    // Enhanced workout timer system
    startWorkoutTimer(workoutId) {
        const workout = this.workouts[workoutId];
        if (!workout || !workout.exercises) {
            // Fallback to basic timer experience
            setTimeout(() => {
                alert(`Workout Timer Started!\n\n${workout.name}\nDuration: ${workout.totalTime}\n\nFollow the instructions and complete your workout!`);
            }, 1000);
            return;
        }

        // Create and show the enhanced workout timer
        this.createWorkoutTimer(workout);
    }

    createWorkoutTimer(workout) {
        const timerModal = document.createElement('div');
        timerModal.className = 'workout-timer-modal';
        timerModal.style.display = 'flex';
        timerModal.innerHTML = `
            <div class="timer-container">
                <div class="timer-header">
                    <h2>${workout.name}</h2>
                    <button class="close-timer">&times;</button>
                </div>
                <div class="timer-content">
                    <div class="current-exercise">
                        <h3 id="currentExerciseName">Getting Ready...</h3>
                        <p id="currentExerciseDetails">Starting workout timer</p>
                    </div>
                    <div class="timer-display">
                        <div class="time-circle">
                            <span class="time" id="timerDisplay">00:30</span>
                            <div class="timer-progress" id="timerProgress"></div>
                        </div>
                    </div>
                    <div class="timer-controls">
                        <button class="btn btn-outline" id="pauseTimer">
                            <i class="fas fa-pause"></i> Pause
                        </button>
                        <button class="btn btn-primary" id="nextExercise">
                            <i class="fas fa-forward"></i> Next
                        </button>
                    </div>
                    <div class="exercise-progress">
                        <div class="progress-bar">
                            <div class="progress" id="workoutProgress" style="width: 0%"></div>
                        </div>
                        <span id="progressText">0 of ${workout.exercises.length} exercises</span>
                    </div>
                    <div class="workout-stats">
                        <div class="stat">
                            <span class="stat-value" id="currentReps">-</span>
                            <span class="stat-label">Reps</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value" id="currentSets">-</span>
                            <span class="stat-label">Sets</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value" id="workTime">-</span>
                            <span class="stat-label">Work</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value" id="restTime">-</span>
                            <span class="stat-label">Rest</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(timerModal);

        // Initialize timer state
        let currentExerciseIndex = 0;
        let currentSet = 1;
        let currentTime = 5; // 5 second countdown to start
        let timerInterval;
        let isPaused = false;
        let isRestPeriod = false;

        const elements = {
            exerciseName: document.getElementById('currentExerciseName'),
            exerciseDetails: document.getElementById('currentExerciseDetails'),
            timerDisplay: document.getElementById('timerDisplay'),
            timerProgress: document.getElementById('timerProgress'),
            workoutProgress: document.getElementById('workoutProgress'),
            progressText: document.getElementById('progressText'),
            currentReps: document.getElementById('currentReps'),
            currentSets: document.getElementById('currentSets'),
            workTime: document.getElementById('workTime'),
            restTime: document.getElementById('restTime'),
            pauseBtn: document.getElementById('pauseTimer'),
            nextBtn: document.getElementById('nextExercise'),
            closeBtn: timerModal.querySelector('.close-timer')
        };

        // Start the workout
        startWorkout();

        function startWorkout() {
            updateProgress();
            startCountdown();
        }

        function startCountdown() {
            elements.exerciseName.textContent = 'Get Ready!';
            elements.exerciseDetails.textContent = 'Workout starting in...';
            currentTime = 5;
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
                if (currentTime > 0) {
                    currentTime--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    startExercise();
                }
            }, 1000);
        }

        function startExercise() {
            if (currentExerciseIndex >= workout.exercises.length) {
                workoutCompleted();
                return;
            }

            const exercise = workout.exercises[currentExerciseIndex];
            
            if (exercise.type === 'warmup' || exercise.type === 'cooldown') {
                // Handle timed exercises (warmup/cooldown)
                elements.exerciseName.textContent = exercise.name;
                elements.exerciseDetails.textContent = exercise.description;
                elements.currentReps.textContent = '-';
                elements.currentSets.textContent = '-';
                elements.workTime.textContent = this.formatTime(exercise.duration);
                elements.restTime.textContent = '-';
                
                currentTime = exercise.duration;
                isRestPeriod = false;
            } else {
                // Handle strength exercises with sets/reps
                elements.exerciseName.textContent = exercise.name;
                elements.exerciseDetails.textContent = `Set ${currentSet} of ${exercise.sets}`;
                elements.currentReps.textContent = exercise.reps || '-';
                elements.currentSets.textContent = `${currentSet}/${exercise.sets}`;
                elements.workTime.textContent = this.formatTime(exercise.workTime);
                elements.restTime.textContent = this.formatTime(exercise.restTime);
                
                currentTime = exercise.workTime;
                isRestPeriod = false;
            }

            updateTimerDisplay();
            startTimer();
        }

        function startTimer() {
            clearInterval(timerInterval);
            isPaused = false;
            elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            elements.pauseBtn.classList.remove('btn-primary');
            elements.pauseBtn.classList.add('btn-outline');

            timerInterval = setInterval(() => {
                if (!isPaused && currentTime > 0) {
                    currentTime--;
                    updateTimerDisplay();
                } else if (!isPaused && currentTime === 0) {
                    clearInterval(timerInterval);
                    handleTimerComplete();
                }
            }, 1000);
        }

        function handleTimerComplete() {
            const exercise = workout.exercises[currentExerciseIndex];
            
            if (exercise.type === 'warmup' || exercise.type === 'cooldown') {
                // Move to next exercise after warmup/cooldown
                currentExerciseIndex++;
                currentSet = 1;
                startExercise();
            } else if (isRestPeriod) {
                // Rest period completed, start next set or exercise
                if (currentSet < exercise.sets) {
                    currentSet++;
                    startExercise();
                } else {
                    currentExerciseIndex++;
                    currentSet = 1;
                    startExercise();
                }
            } else {
                // Work period completed, start rest period
                isRestPeriod = true;
                currentTime = exercise.restTime;
                elements.exerciseName.textContent = 'Rest Period';
                elements.exerciseDetails.textContent = `Next: ${exercise.name} - Set ${currentSet}`;
                updateTimerDisplay();
                startTimer();
            }
        }

        function updateTimerDisplay() {
            elements.timerDisplay.textContent = this.formatTime(currentTime);
            
            const exercise = workout.exercises[currentExerciseIndex];
            if (exercise) {
                const totalTime = isRestPeriod ? exercise.restTime : 
                                exercise.type === 'warmup' || exercise.type === 'cooldown' ? 
                                exercise.duration : exercise.workTime;
                const progress = ((totalTime - currentTime) / totalTime) * 100;
                elements.timerProgress.style.background = 
                    `conic-gradient(var(--accent) ${progress}%, var(--light-gray) 0%)`;
            }
        }

        function updateProgress() {
            const progress = (currentExerciseIndex / workout.exercises.length) * 100;
            elements.workoutProgress.style.width = `${progress}%`;
            elements.progressText.textContent = 
                `${currentExerciseIndex} of ${workout.exercises.length} exercises`;
        }

        function workoutCompleted() {
            clearInterval(timerInterval);
            elements.exerciseName.textContent = 'Workout Completed!';
            elements.exerciseDetails.textContent = 'Great job! You finished the workout.';
            elements.timerDisplay.textContent = '00:00';
            elements.workoutProgress.style.width = '100%';
            elements.progressText.textContent = 'Workout Complete!';
            
            setTimeout(() => {
                document.body.removeChild(timerModal);
                this.showToast('Workout completed successfully! 🎉', 'success');
            }, 3000);
        }

        // Event listeners
        elements.pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) {
                elements.pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
                elements.pauseBtn.classList.remove('btn-outline');
                elements.pauseBtn.classList.add('btn-primary');
            } else {
                elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
                elements.pauseBtn.classList.remove('btn-primary');
                elements.pauseBtn.classList.add('btn-outline');
            }
        });

        elements.nextBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            if (isRestPeriod) {
                // Skip rest period
                const exercise = workout.exercises[currentExerciseIndex];
                if (currentSet < exercise.sets) {
                    currentSet++;
                    startExercise();
                } else {
                    currentExerciseIndex++;
                    currentSet = 1;
                    startExercise();
                }
            } else {
                // Skip current work period
                isRestPeriod = true;
                handleTimerComplete();
            }
        });

        elements.closeBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to end the workout? Your progress will be lost.')) {
                clearInterval(timerInterval);
                document.body.removeChild(timerModal);
            }
        });

        timerModal.addEventListener('click', (e) => {
            if (e.target === timerModal) {
                if (confirm('Are you sure you want to end the workout? Your progress will be lost.')) {
                    clearInterval(timerInterval);
                    document.body.removeChild(timerModal);
                }
            }
        });

        // Bind methods to maintain 'this' context
        this.formatTime = this.formatTime.bind(this);
        updateTimerDisplay = updateTimerDisplay.bind(this);
        workoutCompleted = workoutCompleted.bind(this);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

// Initialize workout instructions system
const workoutInstructions = new WorkoutInstructions();