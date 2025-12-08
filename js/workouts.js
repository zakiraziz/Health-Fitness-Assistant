// HealthAI Workouts System - Complete & Functional
class HealthAIWorkouts {
    constructor() {
        this.currentWorkout = null;
        this.workoutTimer = null;
        this.isTimerRunning = false;
        this.timerSeconds = 0;
        this.currentExerciseIndex = 0;
        this.workoutData = this.getWorkoutData();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.setupWorkoutFilters();
            this.updateWorkoutStats();
            this.setupPlanModal();
            this.setupQuickActions();
            this.setupTimerModal();
            this.loadSavedWorkouts();
            this.setupProgressTracker();
            this.setupChallenges();
            this.setupRecommendations();
            this.setupInstructionsModal();
        });
    }

    setupEventListeners() {
        // Start workout buttons
        document.querySelectorAll('.start-workout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const workoutId = btn.getAttribute('data-workout');
                this.startWorkout(workoutId);
            });
        });

        // View plan buttons
        document.querySelectorAll('.view-plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const workoutId = btn.getAttribute('data-workout');
                this.showWorkoutPlan(workoutId);
            });
        });

        // Save workout buttons
        document.querySelectorAll('.save-workout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const workoutCard = btn.closest('.workout-card');
                this.saveWorkout(workoutCard);
            });
        });

        // View plan details buttons
        document.querySelectorAll('.view-plan-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const planId = btn.getAttribute('data-plan');
                this.showPlanDetails(planId);
            });
        });

        // Join challenge buttons
        document.querySelectorAll('.join-challenge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const challengeCard = btn.closest('.challenge-card');
                this.joinChallenge(challengeCard);
            });
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const equipmentCard = btn.closest('.equipment-card');
                this.addToCart(equipmentCard);
            });
        });

        // Plan modal start workout
        const startPlanBtn = document.querySelector('.start-plan-workout');
        if (startPlanBtn) {
            startPlanBtn.addEventListener('click', () => {
                this.startWorkoutFromPlan();
            });
        }

        // Save plan button
        const savePlanBtn = document.querySelector('.save-plan');
        if (savePlanBtn) {
            savePlanBtn.addEventListener('click', () => {
                this.saveCurrentPlan();
            });
        }

        // Share plan button
        const sharePlanBtn = document.querySelector('.share-plan');
        if (sharePlanBtn) {
            sharePlanBtn.addEventListener('click', () => {
                this.shareCurrentPlan();
            });
        }

        // Schedule day click
        document.querySelectorAll('.schedule-day').forEach(day => {
            day.addEventListener('click', () => {
                this.selectScheduleDay(day);
            });
        });

        // Quick workout button
        const quickWorkoutBtn = document.getElementById('quickWorkoutBtn');
        if (quickWorkoutBtn) {
            quickWorkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startRandomWorkout();
            });
        }
    }

    setupWorkoutFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const workoutCards = document.querySelectorAll('.workout-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterWorkouts(filter, workoutCards);
            });
        });
    }

    filterWorkouts(filter, cards) {
        cards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            if (filter === 'all') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                const level = card.getAttribute('data-level');
                const type = card.getAttribute('data-type');
                
                if (level === filter || type === filter) {
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
            }
        });
    }

    updateWorkoutStats() {
        const totalWorkouts = document.getElementById('totalWorkoutsCount');
        const avgDuration = document.getElementById('avgDuration');
        const caloriesAvg = document.getElementById('caloriesAvg');

        if (totalWorkouts) {
            const savedWorkouts = this.getSavedWorkouts();
            totalWorkouts.textContent = savedWorkouts.length + 6; // Base count
        }

        // Simulate dynamic updates
        setInterval(() => {
            if (avgDuration) {
                const randomChange = Math.floor(Math.random() * 5) - 2;
                let current = parseInt(avgDuration.textContent);
                current = Math.max(20, Math.min(60, current + randomChange));
                avgDuration.textContent = current;
            }

            if (caloriesAvg) {
                const randomChange = Math.floor(Math.random() * 20) - 10;
                let current = parseInt(caloriesAvg.textContent);
                current = Math.max(150, Math.min(500, current + randomChange));
                caloriesAvg.textContent = current;
            }
        }, 5000);
    }

    setupPlanModal() {
        const modal = document.getElementById('workoutPlanModal');
        const closeBtn = document.getElementById('closePlanModal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
    }

    showWorkoutPlan(workoutId) {
        const modal = document.getElementById('workoutPlanModal');
        const workout = this.workoutData[workoutId];

        if (!workout || !modal) return;

        // Update modal content
        document.getElementById('planModalTitle').textContent = `${workout.name} Plan`;
        document.getElementById('planWorkoutName').textContent = workout.name;
        document.getElementById('planDuration').innerHTML = `<i class="fas fa-clock"></i> ${workout.duration}`;
        document.getElementById('planLevel').innerHTML = `<i class="fas fa-signal"></i> ${workout.level}`;
        document.getElementById('planCalories').innerHTML = `<i class="fas fa-fire"></i> ${workout.calories}`;
        
        // Set image if exists
        const planImage = document.getElementById('planImage');
        if (planImage && workout.image) {
            planImage.src = workout.image;
            planImage.alt = workout.name;
        }

        // Update weekly schedule
        this.updateWeeklySchedule(workout.schedule);

        // Update plan statistics
        this.updatePlanStats(workout);

        // Show modal
        modal.style.display = 'flex';
        this.currentWorkout = workoutId;
    }

    updateWeeklySchedule(schedule) {
        const scheduleDays = document.querySelectorAll('.schedule-day');
        scheduleDays.forEach(day => {
            const dayName = day.getAttribute('data-day');
            const workout = schedule[dayName];
            const workoutSpan = day.querySelector('.day-workout');
            
            if (workoutSpan && workout) {
                workoutSpan.textContent = workout;
            }
        });
    }

    updatePlanStats(workout) {
        const totalWorkoutsEl = document.getElementById('totalWorkouts');
        const totalDurationEl = document.getElementById('totalDuration');
        const totalCaloriesEl = document.getElementById('totalCalories');
        const planProgressEl = document.getElementById('planProgress');

        if (totalWorkoutsEl) totalWorkoutsEl.textContent = workout.weeklyWorkouts || 5;
        if (totalDurationEl) totalDurationEl.textContent = workout.totalMinutes || 225;
        if (totalCaloriesEl) totalCaloriesEl.textContent = workout.weeklyCalories || '1,500';
        if (planProgressEl) {
            const progress = this.getPlanProgress(workout.id);
            planProgressEl.textContent = `${progress}%`;
        }
    }

    getPlanProgress(planId) {
        // Simulate progress based on localStorage
        const savedProgress = localStorage.getItem(`plan_progress_${planId}`);
        return savedProgress ? parseInt(savedProgress) : Math.floor(Math.random() * 50);
    }

    selectScheduleDay(dayElement) {
        // Remove active class from all days
        document.querySelectorAll('.schedule-day').forEach(d => {
            d.classList.remove('active');
        });
        
        // Add active class to clicked day
        dayElement.classList.add('active');
        
        // Update daily workout detail
        const dayName = dayElement.getAttribute('data-day');
        const workoutName = dayElement.querySelector('.day-workout').textContent;
        
        const currentDayWorkout = document.getElementById('currentDayWorkout');
        if (currentDayWorkout) {
            currentDayWorkout.textContent = workoutName;
        }
        this.updateDailyWorkout(dayName, workoutName);
    }

    updateDailyWorkout(dayName, workoutName) {
        const exerciseList = document.querySelector('.exercise-list');
        if (!exerciseList) return;

        // Clear current exercises
        exerciseList.innerHTML = '';

        // Add exercises based on workout type
        const exercises = this.getExercisesForWorkout(workoutName);
        exercises.forEach((exercise, index) => {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'exercise-item';
            
            exerciseItem.innerHTML = `
                <div class="exercise-header">
                    <span class="exercise-number">${index + 1}</span>
                    <h5>${exercise.name}</h5>
                    ${exercise.time ? `<span class="exercise-time">${exercise.time}</span>` : ''}
                    ${exercise.sets ? `<span class="exercise-sets">${exercise.sets}</span>` : ''}
                </div>
                <p>${exercise.description}</p>
            `;
            
            exerciseList.appendChild(exerciseItem);
        });
    }

    getExercisesForWorkout(workoutName) {
        // Mock data for different workout types
        const workoutExercises = {
            'Full Body': [
                { name: 'Warm-up', time: '10 min', description: 'Dynamic stretching and light cardio' },
                { name: 'Bodyweight Squats', sets: '3 sets × 12 reps', description: 'Focus on proper form' },
                { name: 'Push-ups', sets: '3 sets × 10 reps', description: 'Modified on knees if needed' },
                { name: 'Glute Bridges', sets: '3 sets × 15 reps', description: 'Activate your glutes' },
                { name: 'Plank', time: '3 sets × 30 sec', description: 'Core activation' }
            ],
            'Cardio': [
                { name: 'Warm-up', time: '5 min', description: 'Light jogging and dynamic stretches' },
                { name: 'HIIT Intervals', time: '20 min', description: '30s high intensity, 30s rest' },
                { name: 'Cool Down', time: '5 min', description: 'Gentle walking and stretching' }
            ],
            'Upper Body': [
                { name: 'Push-ups', sets: '3 sets × 10 reps', description: 'Chest and triceps' },
                { name: 'Dips', sets: '3 sets × 8 reps', description: 'Triceps focus' },
                { name: 'Pull-ups', sets: '3 sets × 5 reps', description: 'Back and biceps' }
            ],
            'Lower Body': [
                { name: 'Squats', sets: '3 sets × 12 reps', description: 'Quad and glute focus' },
                { name: 'Lunges', sets: '3 sets × 10 reps', description: 'Each leg' },
                { name: 'Calf Raises', sets: '3 sets × 15 reps', description: 'Calves' }
            ],
            'Recovery': [
                { name: 'Foam Rolling', time: '10 min', description: 'Full body myofascial release' },
                { name: 'Static Stretching', time: '15 min', description: 'Hold each stretch 30 seconds' },
                { name: 'Breathing Exercises', time: '5 min', description: 'Deep diaphragmatic breathing' }
            ]
        };

        return workoutExercises[workoutName] || workoutExercises['Full Body'];
    }

    startWorkoutFromPlan() {
        if (this.currentWorkout) {
            this.startWorkout(this.currentWorkout);
            // Close plan modal
            const modal = document.getElementById('workoutPlanModal');
            if (modal) modal.style.display = 'none';
        }
    }

    saveCurrentPlan() {
        if (!this.currentWorkout) return;

        const savedPlans = JSON.parse(localStorage.getItem('saved_plans') || '[]');
        if (!savedPlans.includes(this.currentWorkout)) {
            savedPlans.push(this.currentWorkout);
            localStorage.setItem('saved_plans', JSON.stringify(savedPlans));
            this.showToast('Plan saved to your profile!', 'success');
            
            // Update button appearance
            const savePlanBtn = document.querySelector('.save-plan');
            if (savePlanBtn) {
                savePlanBtn.innerHTML = '<i class="fas fa-check"></i> Saved';
                savePlanBtn.style.background = 'var(--success)';
                savePlanBtn.style.color = 'white';
            }
        } else {
            this.showToast('Plan already saved!', 'info');
        }
    }

    shareCurrentPlan() {
        if (!this.currentWorkout) return;

        const workout = this.workoutData[this.currentWorkout];
        const shareText = `Check out this ${workout.name} workout plan on HealthAI!`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: `${workout.name} Workout Plan`,
                text: shareText,
                url: shareUrl
            }).then(() => {
                this.showToast('Plan shared successfully!', 'success');
            }).catch(err => {
                console.error('Error sharing:', err);
                this.copyToClipboard(`${shareText} ${shareUrl}`);
            });
        } else {
            this.copyToClipboard(`${shareText} ${shareUrl}`);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Link copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy link', 'error');
        });
    }

    setupQuickActions() {
        const quickActionBtn = document.getElementById('quickActionBtn');
        const quickActionsMenu = document.getElementById('quickActionsMenu');

        if (quickActionBtn && quickActionsMenu) {
            quickActionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                quickActionBtn.classList.toggle('active');
                quickActionsMenu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!quickActionBtn.contains(e.target) && !quickActionsMenu.contains(e.target)) {
                    quickActionBtn.classList.remove('active');
                    quickActionsMenu.classList.remove('active');
                }
            });

            // Handle quick action items
            document.querySelectorAll('.quick-action-item').forEach(item => {
                if (item.id !== 'quickWorkoutBtn') {
                    item.addEventListener('click', () => {
                        quickActionBtn.classList.remove('active');
                        quickActionsMenu.classList.remove('active');
                    });
                }
            });
        }
    }

    startRandomWorkout() {
        const workoutCards = document.querySelectorAll('.workout-card');
        if (workoutCards.length === 0) return;

        const randomIndex = Math.floor(Math.random() * workoutCards.length);
        const randomCard = workoutCards[randomIndex];
        const workoutBtn = randomCard.querySelector('.start-workout-btn');
        
        if (workoutBtn) {
            const workoutId = workoutBtn.getAttribute('data-workout');
            this.startWorkout(workoutId);
        }
    }

    setupTimerModal() {
        const modal = document.getElementById('timerModal');
        const closeBtn = document.getElementById('closeTimerBtn');
        const startBtn = document.getElementById('startTimerBtn');
        const pauseBtn = document.getElementById('pauseTimerBtn');
        const resetBtn = document.getElementById('resetTimerBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.stopTimer();
                modal.style.display = 'none';
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTimer());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseTimer());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetTimer());
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.stopTimer();
                modal.style.display = 'none';
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.stopTimer();
                modal.style.display = 'none';
            }
        });
    }

    startWorkout(workoutId) {
        const workout = this.workoutData[workoutId];
        if (!workout) return;

        // Show timer modal
        const modal = document.getElementById('timerModal');
        if (modal) {
            const timerWorkoutName = document.getElementById('timerWorkoutName');
            if (timerWorkoutName) {
                timerWorkoutName.textContent = workout.name;
            }
            modal.style.display = 'flex';
            
            // Setup workout exercises
            this.setupWorkoutExercises(workout);
            
            // Reset timer
            this.resetTimer();
        }
    }

    setupWorkoutExercises(workout) {
        const exercises = workout.exercises || this.getDefaultExercises();
        this.currentExerciseIndex = 0;
        
        // Update exercise count
        const totalExercises = document.getElementById('totalExercises');
        if (totalExercises) {
            totalExercises.textContent = exercises.length;
        }
        
        // Set first exercise
        if (exercises.length > 0) {
            this.updateCurrentExercise(exercises[0]);
        }
    }

    getDefaultExercises() {
        return [
            { name: 'Warm-up', description: 'Dynamic stretching and light cardio', duration: 300 },
            { name: 'Exercise 1', description: 'Main workout exercise', duration: 180 },
            { name: 'Exercise 2', description: 'Second workout exercise', duration: 180 },
            { name: 'Cool Down', description: 'Stretching and recovery', duration: 300 }
        ];
    }

    updateCurrentExercise(exercise) {
        const currentExerciseName = document.getElementById('currentExerciseName');
        const currentExerciseDescription = document.getElementById('currentExerciseDescription');
        const currentExerciseIndex = document.getElementById('currentExerciseIndex');
        
        if (currentExerciseName) currentExerciseName.textContent = exercise.name;
        if (currentExerciseDescription) currentExerciseDescription.textContent = exercise.description;
        if (currentExerciseIndex) currentExerciseIndex.textContent = this.currentExerciseIndex + 1;
        
        // Set timer duration
        this.timerSeconds = exercise.duration || 60;
        this.updateTimerDisplay();
        
        // Update progress
        const totalExercises = parseInt(document.getElementById('totalExercises')?.textContent || '1');
        const progress = (this.currentExerciseIndex / totalExercises) * 100;
        const workoutProgress = document.getElementById('workoutProgress');
        if (workoutProgress) {
            workoutProgress.style.width = `${progress}%`;
        }
    }

    startTimer() {
        if (this.isTimerRunning) return;

        this.isTimerRunning = true;
        const startBtn = document.getElementById('startTimerBtn');
        const pauseBtn = document.getElementById('pauseTimerBtn');
        const resetBtn = document.getElementById('resetTimerBtn');
        
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;

        this.workoutTimer = setInterval(() => {
            this.timerSeconds--;
            this.updateTimerDisplay();
            
            if (this.timerSeconds <= 0) {
                this.nextExercise();
            }
            
            // Update stats
            this.updateWorkoutStatsTimer();
        }, 1000);
    }

    pauseTimer() {
        if (!this.isTimerRunning) return;

        this.isTimerRunning = false;
        clearInterval(this.workoutTimer);
        const startBtn = document.getElementById('startTimerBtn');
        const pauseBtn = document.getElementById('pauseTimerBtn');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
    }

    resetTimer() {
        this.pauseTimer();
        this.timerSeconds = 0;
        this.updateTimerDisplay();
        const startBtn = document.getElementById('startTimerBtn');
        const pauseBtn = document.getElementById('pauseTimerBtn');
        const resetBtn = document.getElementById('resetTimerBtn');
        
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = true;
        
        // Reset stats
        const completedExercises = document.getElementById('completedExercises');
        const totalTimeElapsed = document.getElementById('totalTimeElapsed');
        const caloriesBurned = document.getElementById('caloriesBurned');
        
        if (completedExercises) completedExercises.textContent = '0';
        if (totalTimeElapsed) totalTimeElapsed.textContent = '0:00';
        if (caloriesBurned) caloriesBurned.textContent = '0';
    }

    stopTimer() {
        this.pauseTimer();
        this.resetTimer();
    }

    nextExercise() {
        const totalExercises = parseInt(document.getElementById('totalExercises')?.textContent || '1');
        this.currentExerciseIndex++;
        
        if (this.currentExerciseIndex >= totalExercises) {
            // Workout complete
            this.completeWorkout();
            return;
        }
        
        // Get next exercise
        const exercises = this.getDefaultExercises();
        if (this.currentExerciseIndex < exercises.length) {
            this.updateCurrentExercise(exercises[this.currentExerciseIndex]);
        }
    }

    completeWorkout() {
        this.stopTimer();
        this.showToast('Workout completed! Great job!', 'success');
        
        // Update completed exercises
        const totalExercises = document.getElementById('totalExercises');
        const completedExercises = document.getElementById('completedExercises');
        if (totalExercises && completedExercises) {
            completedExercises.textContent = totalExercises.textContent;
        }
        
        // Close timer modal after delay
        setTimeout(() => {
            const modal = document.getElementById('timerModal');
            if (modal) modal.style.display = 'none';
        }, 3000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerSeconds / 60);
        const seconds = this.timerSeconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = display;
        }
    }

    updateWorkoutStatsTimer() {
        // Update elapsed time
        const totalTimeElapsed = document.getElementById('totalTimeElapsed');
        if (totalTimeElapsed) {
            const elapsed = parseInt(totalTimeElapsed.textContent.split(':')[0]) || 0;
            totalTimeElapsed.textContent = `${elapsed + 1}:00`;
        }
        
        // Update calories (simulated)
        const caloriesBurned = document.getElementById('caloriesBurned');
        if (caloriesBurned) {
            const calories = parseInt(caloriesBurned.textContent) || 0;
            caloriesBurned.textContent = (calories + 1).toString();
        }
        
        // Simulate heart rate
        const heartRate = document.getElementById('heartRate');
        if (heartRate) {
            const bpm = 70 + Math.floor(Math.random() * 30);
            heartRate.textContent = bpm.toString();
        }
    }

    saveWorkout(workoutCard) {
        const workoutTitle = workoutCard.querySelector('h3')?.textContent;
        if (!workoutTitle) return;

        const savedWorkouts = JSON.parse(localStorage.getItem('saved_workouts') || '[]');
        
        if (!savedWorkouts.includes(workoutTitle)) {
            savedWorkouts.push(workoutTitle);
            localStorage.setItem('saved_workouts', JSON.stringify(savedWorkouts));
            
            // Update button appearance
            const saveBtn = workoutCard.querySelector('.save-workout-btn');
            if (saveBtn) {
                saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                saveBtn.style.background = 'var(--success)';
                saveBtn.style.color = 'white';
            }
            
            this.showToast('Workout saved to your profile!', 'success');
            this.updateWorkoutStats();
        } else {
            this.showToast('Workout already saved!', 'info');
        }
    }

    loadSavedWorkouts() {
        const savedWorkouts = JSON.parse(localStorage.getItem('saved_workouts') || '[]');
        document.querySelectorAll('.workout-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent;
            if (title && savedWorkouts.includes(title)) {
                const saveBtn = card.querySelector('.save-workout-btn');
                if (saveBtn) {
                    saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                    saveBtn.style.background = 'var(--success)';
                    saveBtn.style.color = 'white';
                }
            }
        });
    }

    setupProgressTracker() {
        // Update progress weekly
        setInterval(() => {
            this.updateProgressTracker();
        }, 10000);
    }

    updateProgressTracker() {
        // Simulate progress updates
        const trackerValues = document.querySelectorAll('.tracker-value');
        trackerValues.forEach(value => {
            const text = value.parentElement?.textContent || '';
            const match = text.match(/\/(\d+)/);
            const max = match ? parseInt(match[1]) : 5;
            const current = parseInt(value.textContent) || 0;
            
            if (current < max) {
                const randomIncrease = Math.floor(Math.random() * 2);
                value.textContent = Math.min(current + randomIncrease, max).toString();
                
                // Update progress circle
                const progressCircle = value.closest('.tracker-item')?.querySelector('.progress');
                if (progressCircle) {
                    const newProgress = (parseInt(value.textContent) / max) * 100;
                    progressCircle.style.setProperty('--progress', `${newProgress}%`);
                    
                    // Update progress text
                    const progressText = progressCircle.parentElement.querySelector('.progress-text');
                    if (progressText) {
                        progressText.textContent = `${Math.round(newProgress)}%`;
                    }
                }
            }
        });
    }

    setupChallenges() {
        // Simulate challenge progress
        setInterval(() => {
            document.querySelectorAll('.challenge-progress .progress').forEach(progress => {
                const currentWidth = parseInt(progress.style.width) || 0;
                if (currentWidth < 100) {
                    const randomIncrease = Math.random() * 2;
                    progress.style.width = `${Math.min(currentWidth + randomIncrease, 100)}%`;
                    
                    // Update progress text
                    const progressText = progress.parentElement.parentElement.querySelector('.progress-text');
                    if (progressText) {
                        progressText.textContent = `${Math.round(parseFloat(progress.style.width))}% completed`;
                    }
                }
            });
        }, 5000);
    }

    joinChallenge(challengeCard) {
        const challengeName = challengeCard.querySelector('h3')?.textContent;
        if (!challengeName) return;
        
        // Update button
        const joinBtn = challengeCard.querySelector('.join-challenge');
        if (joinBtn) {
            joinBtn.innerHTML = '<i class="fas fa-play"></i> Continue';
            joinBtn.classList.remove('btn-outline');
            joinBtn.classList.add('btn-primary');
            joinBtn.classList.remove('join-challenge');
        }
        
        // Update card appearance
        challengeCard.classList.add('active');
        
        this.showToast(`You've joined the ${challengeName}!`, 'success');
    }

    setupRecommendations() {
        // Simulate recommendation updates
        setInterval(() => {
            this.updateRecommendations();
        }, 15000);
    }

    updateRecommendations() {
        const recommendations = [
            "Based on your activity: Try adding 2 strength sessions this week",
            "Trending: Yoga for stress relief is popular this week",
            "Based on time: Quick 15-minute HIIT for busy days",
            "Recovery: Don't forget rest days for muscle growth"
        ];
        
        const recElements = document.querySelectorAll('.recommendation-card p');
        recElements.forEach((el) => {
            if (Math.random() > 0.7) { // 30% chance to update
                const randomRec = recommendations[Math.floor(Math.random() * recommendations.length)];
                el.textContent = randomRec;
            }
        });
    }

    addToCart(equipmentCard) {
        const itemName = equipmentCard.querySelector('h4')?.textContent;
        const price = equipmentCard.querySelector('.equipment-price')?.textContent;
        
        if (!itemName || !price) return;
        
        // Update button
        const cartBtn = equipmentCard.querySelector('.btn');
        if (cartBtn) {
            cartBtn.innerHTML = '<i class="fas fa-check"></i> Added';
            cartBtn.style.background = 'var(--success)';
            cartBtn.style.color = 'white';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                cartBtn.style.background = '';
                cartBtn.style.color = '';
            }, 2000);
        }
        
        this.showToast(`${itemName} (${price}) added to cart!`, 'success');
    }

    showPlanDetails(planId) {
        const plan = this.workoutData[planId];
        if (plan) {
            this.showWorkoutPlan(planId);
        } else {
            this.showToast('Plan details coming soon!', 'info');
        }
    }

    setupInstructionsModal() {
        const closeBtn = document.getElementById('closeInstructionsBtn');
        const startTimerBtn = document.querySelector('.start-workout-timer');
        const saveInstructionsBtn = document.querySelector('.save-instructions');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('workoutInstructionsModal');
                if (modal) modal.style.display = 'none';
            });
        }

        if (startTimerBtn) {
            startTimerBtn.addEventListener('click', () => {
                const modal = document.getElementById('workoutInstructionsModal');
                if (modal) modal.style.display = 'none';
                this.startWorkout('fullbody-beginner');
            });
        }

        if (saveInstructionsBtn) {
            saveInstructionsBtn.addEventListener('click', () => {
                this.showToast('Workout saved to your favorites!', 'success');
            });
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('workoutInstructionsModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    getWorkoutData() {
        return {
            'fullbody-beginner': {
                id: 'fullbody-beginner',
                name: 'Full Body Beginner',
                duration: '30 minutes',
                level: 'Beginner',
                calories: '240 calories',
                weeklyWorkouts: 5,
                totalMinutes: 225,
                weeklyCalories: '1,500',
                schedule: {
                    monday: 'Full Body',
                    tuesday: 'Cardio',
                    wednesday: 'Recovery',
                    thursday: 'Upper Body',
                    friday: 'Lower Body',
                    saturday: 'Cardio',
                    sunday: 'Rest'
                },
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            'hiit-cardio': {
                id: 'hiit-cardio',
                name: 'HIIT Cardio Blast',
                duration: '25 minutes',
                level: 'Intermediate',
                calories: '320 calories',
                weeklyWorkouts: 4,
                totalMinutes: 180,
                weeklyCalories: '1,280',
                schedule: {
                    monday: 'HIIT',
                    tuesday: 'Strength',
                    wednesday: 'Active Recovery',
                    thursday: 'HIIT',
                    friday: 'Strength',
                    saturday: 'Cardio',
                    sunday: 'Rest'
                },
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            'yoga-flow': {
                id: 'yoga-flow',
                name: 'Morning Yoga Flow',
                duration: '25 minutes',
                level: 'Beginner',
                calories: '180 calories',
                image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1420&q=80'
            },
            'power-building': {
                id: 'power-building',
                name: 'Power Building Program',
                duration: '60 minutes',
                level: 'Advanced',
                calories: '450 calories',
                image: 'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            'cardio-dance': {
                id: 'cardio-dance',
                name: 'Cardio Dance Party',
                duration: '35 minutes',
                level: 'Intermediate',
                calories: '380 calories',
                image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80'
            },
            'core-crusher': {
                id: 'core-crusher',
                name: 'Core Crusher',
                duration: '20 minutes',
                level: 'Intermediate',
                calories: '200 calories',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
            },
            'weight-loss-30': {
                id: 'weight-loss-30',
                name: '30-Day Weight Loss Challenge',
                duration: '30-45 minutes',
                level: 'Intermediate',
                calories: '350 calories avg'
            },
            'muscle-building-8': {
                id: 'muscle-building-8',
                name: 'Muscle Building Program',
                duration: '45-60 minutes',
                level: 'Intermediate',
                calories: '400 calories avg'
            }
        };
    }

    getSavedWorkouts() {
        return JSON.parse(localStorage.getItem('saved_workouts') || '[]');
    }

    showToast(message, type = 'info') {
        // Check if auth system toast exists
        if (typeof healthAIAuth !== 'undefined' && healthAIAuth.showToast) {
            healthAIAuth.showToast(message, type);
            return;
        }

        // Create custom toast
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
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

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize the workouts system
const healthAIWorkouts = new HealthAIWorkouts();