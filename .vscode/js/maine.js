// progress-dashboard.js - Complete Progress Tracking Dashboard

class HealthAIProgressDashboard {
    constructor() {
        this.init();
    }

    // Initialize dashboard
    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.initializeCharts();
        this.updateDashboard();
        this.setupTheme();
        this.setupOfflineDetection();
    }

    // ========== DATA MANAGEMENT ==========
    loadUserData() {
        // Load user data from localStorage or API
        this.userData = JSON.parse(localStorage.getItem('healthAI_userData') || '{}');
        this.progressData = JSON.parse(localStorage.getItem('healthAI_progressData') || '[]');
        this.goals = JSON.parse(localStorage.getItem('healthAI_goals') || this.getDefaultGoals());
        this.achievements = JSON.parse(localStorage.getItem('healthAI_achievements') || this.getDefaultAchievements());
        
        // If no data exists, create demo data
        if (this.progressData.length === 0) {
            this.createDemoData();
        }
    }

    getDefaultGoals() {
        return [
            {
                id: 'weight_loss',
                title: 'Weight Loss Goal',
                target: 20,
                current: 8.5,
                unit: 'lbs',
                type: 'weight',
                color: '#3b82f6',
                startDate: '2024-01-01',
                deadline: '2024-03-01'
            },
            {
                id: 'workout_consistency',
                title: 'Workout Consistency',
                target: 30,
                current: 18,
                unit: 'days',
                type: 'consistency',
                color: '#8b5cf6',
                startDate: '2024-01-01',
                deadline: '2024-01-31'
            },
            {
                id: 'running_distance',
                title: 'Running Distance',
                target: 50,
                current: 17.5,
                unit: 'miles',
                type: 'distance',
                color: '#10b981',
                startDate: '2024-01-01',
                deadline: '2024-02-01'
            }
        ];
    }

    getDefaultAchievements() {
        return [
            {
                id: 'first_week',
                title: 'First Week Complete',
                description: 'Completed 5 workouts in your first week',
                icon: 'fas fa-dumbbell',
                unlocked: true,
                date: '2024-01-08',
                points: 50
            },
            {
                id: 'calorie_burner',
                title: 'Calorie Burner',
                description: 'Burned 10,000 total calories',
                icon: 'fas fa-fire',
                unlocked: true,
                date: '2024-01-15',
                points: 100
            },
            {
                id: 'weight_loss_champion',
                title: 'Weight Loss Champion',
                description: 'Lose 10 pounds total',
                icon: 'fas fa-weight',
                unlocked: false,
                progress: 8.5,
                target: 10,
                unit: 'lbs',
                points: 150
            }
        ];
    }

    createDemoData() {
        // Create 30 days of demo data
        const demoData = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            demoData.push({
                date: date.toISOString().split('T')[0],
                weight: 185 - (i * 0.3) + (Math.random() * 0.5 - 0.25),
                workoutTime: Math.random() > 0.3 ? Math.floor(Math.random() * 90) : 0,
                caloriesBurned: Math.floor(Math.random() * 800),
                sleepHours: 6.5 + Math.random() * 2,
                mood: Math.floor(Math.random() * 5) + 1,
                steps: Math.floor(Math.random() * 12000),
                waterIntake: Math.floor(Math.random() * 10),
                notes: i % 7 === 0 ? 'Feeling great today!' : null
            });
        }

        this.progressData = demoData;
        localStorage.setItem('healthAI_progressData', JSON.stringify(demoData));
    }
   // ========== CHARTS ==========
    initializeCharts() {
        this.charts = {};
        this.initWeightChart();
        this.initWorkoutChart();
        this.initSleepChart();
        this.initCaloriesChart();
        this.initMoodChart();
        this.initConsistencyChart();
    }

    initWeightChart() {
        const ctx = document.getElementById('weightChart');
        if (!ctx) return;

        const data = this.getLastNDaysData(7);
        
        this.charts.weight = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Weight (lbs)',
                    data: data.map(d => d.weight),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: this.getChartOptions('Weight Trend', 'lbs')
        });
    }

    initWorkoutChart() {
        const ctx = document.getElementById('workoutChart');
        if (!ctx) return;

        const data = this.getLastNDaysData(7);
        
        this.charts.workout = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Workout Minutes',
                    data: data.map(d => d.workoutTime),
                    backgroundColor: '#8b5cf6',
                    borderColor: '#7c3aed',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: this.getChartOptions('Workout Minutes', 'min')
        });
    }

    initSleepChart() {
        const ctx = document.getElementById('sleepChart');
        if (!ctx) return;

        const data = this.getLastNDaysData(7);
        
        this.charts.sleep = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Sleep Hours',
                    data: data.map(d => d.sleepHours),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: this.getChartOptions('Sleep Quality', 'hours')
        });
    }

    initCaloriesChart() {
        const ctx = document.getElementById('caloriesChart');
        if (!ctx) return;

        const data = this.getLastNDaysData(7);
        
        this.charts.calories = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Calories Burned',
                    data: data.map(d => d.caloriesBurned),
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 800
                    }
                }
            }
        });
    }

    initMoodChart() {
        const ctx = document.getElementById('moodChart');
        if (!ctx) return;

        const data = this.getLastNDaysData(7);
        const moodEmojis = ['😞', '😕', '😐', '🙂', '😊'];
        
        this.charts.mood = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Mood',
                    data: data.map(d => d.mood),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: (ctx) => {
                        const value = ctx.raw;
                        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];
                        return colors[value - 1] || '#f59e0b';
                    },
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 5,
                        ticks: {
                            callback: function(value) {
                                return moodEmojis[value - 1] || '';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const descriptions = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];
                                return `Mood: ${descriptions[value - 1] || 'Unknown'} ${moodEmojis[value - 1] || ''}`;
                            }
                        }
                    }
                }
            }
        });
    }

    initConsistencyChart() {
        const ctx = document.getElementById('consistencyChart');
        if (!ctx) return;

        const data = this.getLastNDaysData(30);
        const workoutDays = data.filter(d => d.workoutTime > 0).length;
        const consistency = (workoutDays / 30) * 100;
        
        this.charts.consistency = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Workout Days', 'Rest Days'],
                datasets: [{
                    data: [workoutDays, 30 - workoutDays],
                    backgroundColor: ['#10b981', '#e5e7eb'],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} days (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    getChartOptions(title, unit) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: unit }
                }
            }
        };
    }

    // ========== DASHBOARD UPDATES ==========
    updateDashboard() {
        this.updateStats();
        this.updateGoals();
        this.updateAchievements();
        this.updateMilestones();
        this.updateRecentActivity();
        this.updateProgressSummary();
    }

    updateStats() {
        const stats = this.calculateStats();
        
        // Update progress circles
        document.querySelectorAll('.progress-circle').forEach((circle, index) => {
            let percentage;
            switch(index) {
                case 0: percentage = stats.consistency; break;
                case 1: percentage = stats.nutritionScore; break;
                case 2: percentage = stats.sleepQuality; break;
            }
            
            if (percentage !== undefined) {
                circle.dataset.percentage = percentage;
                circle.querySelector('span').textContent = `${percentage}%`;
                circle.style.setProperty('--percentage', `${percentage}%`);
            }
        });

        // Update weight progress
        const weightElement = document.querySelector('.weight-progress');
        if (weightElement) {
            const weightChange = stats.currentWeight - stats.startingWeight;
            const trend = weightChange < 0 ? '↓' : weightChange > 0 ? '↑' : '→';
            const color = weightChange < 0 ? '#10b981' : weightChange > 0 ? '#ef4444' : '#6b7280';
            
            weightElement.innerHTML = `
                <span class="weight-change" style="color: ${color}">
                    ${trend} ${Math.abs(weightChange).toFixed(1)} lbs
                </span>
                <small>From ${stats.startingWeight} to ${stats.currentWeight} lbs</small>
            `;
        }

        // Update streak
        const streakElement = document.getElementById('currentStreak');
        if (streakElement) {
            streakElement.textContent = stats.currentStreak;
            streakElement.style.color = stats.currentStreak >= 7 ? '#10b981' : '#f59e0b';
        }
    }

    calculateStats() {
        if (this.progressData.length === 0) return {};
        
        const recentData = this.getLastNDaysData(7);
        const allData = this.progressData;
        
        const stats = {
            consistency: Math.round((recentData.filter(d => d.workoutTime > 0).length / 7) * 100),
            nutritionScore: this.calculateNutritionScore(),
            sleepQuality: Math.round((recentData.reduce((sum, d) => sum + d.sleepHours, 0) / 7) * 10),
            currentWeight: allData[allData.length - 1]?.weight || 0,
            startingWeight: allData[0]?.weight || 0,
            totalWorkouts: allData.filter(d => d.workoutTime > 0).length,
            totalCalories: allData.reduce((sum, d) => sum + d.caloriesBurned, 0),
            averageMood: (recentData.reduce((sum, d) => sum + d.mood, 0) / recentData.length).toFixed(1),
            currentStreak: this.calculateCurrentStreak()
        };
        
        return stats;
    }

    calculateNutritionScore() {
        // Simulate nutrition score calculation
        const recentData = this.getLastNDaysData(7);
        let score = 75; // Base score
        
        // Adjust based on water intake
        const avgWater = recentData.reduce((sum, d) => sum + (d.waterIntake || 0), 0) / 7;
        if (avgWater >= 8) score += 10;
        else if (avgWater >= 6) score += 5;
        else score -= 5;
        
        // Adjust based on consistency
        const workoutDays = recentData.filter(d => d.workoutTime > 0).length;
        if (workoutDays >= 5) score += 10;
        else if (workoutDays >= 3) score += 5;
        
        return Math.min(Math.max(score, 0), 100);
    }

    calculateCurrentStreak() {
        let streak = 0;
        let today = new Date();
        
        // Check consecutive days with workouts
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayData = this.progressData.find(d => d.date === dateStr);
            if (dayData && dayData.workoutTime > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    updateGoals() {
        const goalsContainer = document.getElementById('goalsContainer');
        if (!goalsContainer) return;
        
        goalsContainer.innerHTML = this.goals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = this.calculateDaysRemaining(goal.deadline);
            
            return `
                <div class="goal-card" data-goal-id="${goal.id}">
                    <div class="goal-header">
                        <h4>${goal.title}</h4>
                        <span class="goal-progress-text">${progress.toFixed(1)}%</span>
                    </div>
                    <div class="goal-progress-bar">
                        <div class="goal-progress-fill" 
                             style="width: ${progress}%; background: ${goal.color}"></div>
                    </div>
                    <div class="goal-details">
                        <span>${goal.current} / ${goal.target} ${goal.unit}</span>
                        <small>${daysRemaining} days remaining</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateAchievements() {
        const achievementsContainer = document.getElementById('achievementsContainer');
        if (!achievementsContainer) return;
        
        achievementsContainer.innerHTML = this.achievements.map(achievement => {
            const isUnlocked = achievement.unlocked;
            const progress = achievement.progress ? 
                `<div class="achievement-progress">
                    <span>${achievement.progress}/${achievement.target} ${achievement.unit}</span>
                    <div class="progress-bar">
                        <div style="width: ${(achievement.progress/achievement.target)*100}%"></div>
                    </div>
                </div>` : '';
            
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">
                        <i class="${achievement.icon}"></i>
                    </div>
                    <div class="achievement-content">
                        <h4>${achievement.title}</h4>
                        <p>${achievement.description}</p>
                        ${progress}
                        ${isUnlocked ? 
                            `<span class="achievement-date">Earned: ${new Date(achievement.date).toLocaleDateString()}</span>` : 
                            `<span class="achievement-points">${achievement.points} points</span>`
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    updateMilestones() {
        const milestones = this.calculateMilestones();
        const milestonesContainer = document.getElementById('milestonesContainer');
        
        if (!milestonesContainer) return;
        
        milestonesContainer.innerHTML = milestones.map(milestone => `
            <div class="milestone-item">
                <div class="milestone-date">${milestone.date}</div>
                <div class="milestone-content">
                    <strong>${milestone.title}</strong>
                    <p>${milestone.description}</p>
                </div>
                <div class="milestone-badge">
                    <i class="${milestone.icon}"></i>
                </div>
            </div>
        `).join('');
    }

    updateRecentActivity() {
        const recentData = this.getLastNDaysData(5).reverse();
        const activityContainer = document.getElementById('recentActivity');
        
        if (!activityContainer) return;
        
        activityContainer.innerHTML = recentData.map(day => `
            <div class="activity-item">
                <div class="activity-date">
                    ${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div class="activity-content">
                    <div class="activity-metric">
                        <i class="fas fa-weight"></i>
                        <span>${day.weight?.toFixed(1) || '--'} lbs</span>
                    </div>
                    <div class="activity-metric">
                        <i class="fas fa-dumbbell"></i>
                        <span>${day.workoutTime || 0} min</span>
                    </div>
                    <div class="activity-metric">
                        <i class="fas fa-fire"></i>
                        <span>${day.caloriesBurned || 0} cal</span>
                    </div>
                    <div class="activity-metric">
                        <i class="fas fa-bed"></i>
                        <span>${day.sleepHours?.toFixed(1) || '--'}h</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateProgressSummary() {
        const summary = this.generateProgressSummary();
        const summaryElement = document.getElementById('progressSummary');
        
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div class="summary-item">
                    <i class="fas fa-calendar-check"></i>
                    <div>
                        <strong>${summary.totalDays} Days</strong>
                        <small>Total tracking period</small>
                    </div>
                </div>
                <div class="summary-item">
                    <i class="fas fa-dumbbell"></i>
                    <div>
                        <strong>${summary.workoutDays} Days</strong>
                        <small>Workouts completed</small>
                    </div>
                </div>
                <div class="summary-item">
                    <i class="fas fa-fire"></i>
                    <div>
                        <strong>${summary.totalCalories.toLocaleString()} cal</strong>
                        <small>Total calories burned</small>
                    </div>
                </div>
                <div class="summary-item">
                    <i class="fas fa-trend-down"></i>
                    <div>
                        <strong>${summary.weightChange.toFixed(1)} lbs</strong>
                        <small>Weight ${summary.weightChange < 0 ? 'lost' : 'gained'}</small>
                    </div>
                </div>
            `;
        }
    }

    // ========== UTILITIES ==========
    getLastNDaysData(n) {
        const today = new Date();
        const result = [];
        
        for (let i = 0; i < n; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const dayData = this.progressData.find(d => d.date === dateStr);
            if (dayData) {
                result.unshift(dayData);
            } else {
                // Fill with empty data if no data for that day
                result.unshift({
                    date: dateStr,
                    weight: null,
                    workoutTime: 0,
                    caloriesBurned: 0,
                    sleepHours: 0,
                    mood: 3
                });
            }
        }
        
        return result;
    }

    calculateDaysRemaining(deadline) {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diffTime = deadlineDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calculateMilestones() {
        const milestones = [];
        const data = this.progressData;
        
        if (data.length >= 7) {
            const firstWeekData = data.slice(0, 7);
            const workouts = firstWeekData.filter(d => d.workoutTime > 0).length;
            if (workouts >= 5) {
                milestones.push({
                    date: 'Week 1',
                    title: 'First Week Complete',
                    description: `Completed ${workouts} workouts in your first week`,
                    icon: 'fas fa-award'
                });
            }
        }
        
        const totalCalories = data.reduce((sum, d) => sum + d.caloriesBurned, 0);
        if (totalCalories >= 10000) {
            milestones.push({
                date: 'Recent',
                title: 'Calorie Burner',
                description: 'Burned 10,000 total calories',
                icon: 'fas fa-fire'
            });
        }
        
        const weightChange = data[data.length - 1]?.weight - data[0]?.weight || 0;
        if (weightChange <= -5) {
            milestones.push({
                date: 'Recent',
                title: 'Weight Loss Milestone',
                description: `Lost ${Math.abs(weightChange).toFixed(1)} lbs`,
                icon: 'fas fa-weight'
            });
        }
        
        return milestones;
    }

    generateProgressSummary() {
        const data = this.progressData;
        return {
            totalDays: data.length,
            workoutDays: data.filter(d => d.workoutTime > 0).length,
            totalCalories: data.reduce((sum, d) => sum + d.caloriesBurned, 0),
            weightChange: (data[data.length - 1]?.weight || 0) - (data[0]?.weight || 0),
            averageWorkoutTime: (data.reduce((sum, d) => sum + d.workoutTime, 0) / data.length).toFixed(1),
            averageSleep: (data.reduce((sum, d) => sum + d.sleepHours, 0) / data.length).toFixed(1)
        };
    }

    // ========== EVENT HANDLERS ==========
    setupEventListeners() {
        // Period selector
        document.querySelectorAll('.period-selector').forEach(button => {
            button.addEventListener('click', (e) => this.handlePeriodChange(e));
        });

        // Log progress
        const logButton = document.getElementById('logProgress');
        if (logButton) {
            logButton.addEventListener('click', () => this.showLogModal());
        }

        // Export data
        const exportButton = document.getElementById('exportData');
        if (exportButton) {
            exportButton.addEventListener('click', () => this.exportData());
        }

        // Share progress
        const shareButton = document.getElementById('shareProgress');
        if (shareButton) {
            shareButton.addEventListener('click', () => this.shareProgress());
        }

        // Refresh data
        const refreshButton = document.getElementById('refreshData');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => this.refreshDashboard());
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    handlePeriodChange(event) {
        const period = event.target.dataset.period;
        document.querySelectorAll('.period-selector').forEach(btn => {
            btn.classList.toggle('active', btn === event.target);
        });
        
        // Update charts for selected period
        this.updateChartsForPeriod(period);
    }

    showLogModal() {
        // Create and show modal for logging progress
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Log Today's Progress</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="progressForm">
                        <div class="form-group">
                            <label for="weight">Weight (lbs)</label>
                            <input type="number" id="weight" step="0.1" placeholder="Enter your weight">
                        </div>
                        <div class="form-group">
                            <label for="workout">Workout Time (min)</label>
                            <input type="number" id="workout" placeholder="Enter workout duration">
                        </div>
                        <div class="form-group">
                            <label for="calories">Calories Burned</label>
                            <input type="number" id="calories" placeholder="Enter calories burned">
                        </div>
                        <div class="form-group">
                            <label for="sleep">Sleep Hours</label>
                            <input type="number" id="sleep" step="0.1" placeholder="Enter sleep duration">
                        </div>
                        <div class="form-group">
                            <label for="mood">Today's Mood</label>
                            <select id="mood">
                                <option value="">Select mood</option>
                                <option value="1">😞 Poor</option>
                                <option value="2">😕 Below Average</option>
                                <option value="3">😐 Average</option>
                                <option value="4">🙂 Good</option>
                                <option value="5">😊 Excellent</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="notes">Notes</label>
                            <textarea id="notes" placeholder="Any notes about today..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" id="cancelLog">Cancel</button>
                    <button class="btn-primary" id="submitLog">Save Progress</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners for modal
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancelLog').addEventListener('click', () => modal.remove());
        modal.querySelector('#submitLog').addEventListener('click', () => {
            this.submitProgress();
            modal.remove();
        });
    }

    submitProgress() {
        const form = document.getElementById('progressForm');
        if (!form) return;

        const progress = {
            date: new Date().toISOString().split('T')[0],
            weight: parseFloat(form.querySelector('#weight').value) || null,
            workoutTime: parseInt(form.querySelector('#workout').value) || 0,
            caloriesBurned: parseInt(form.querySelector('#calories').value) || 0,
            sleepHours: parseFloat(form.querySelector('#sleep').value) || null,
            mood: parseInt(form.querySelector('#mood').value) || null,
            notes: form.querySelector('#notes').value || null
        };

        // Add to progress data
        this.progressData.push(progress);
        localStorage.setItem('healthAI_progressData', JSON.stringify(this.progressData));

        // Update dashboard
        this.refreshDashboard();
        this.showNotification('Progress logged successfully!', 'success');
    }

    exportData() {
        const data = {
            user: this.userData,
            progress: this.progressData,
            goals: this.goals,
            achievements: this.achievements,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `healthai-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Data exported successfully!', 'success');
    }

    shareProgress() {
        const stats = this.calculateStats();
        const text = `Check out my fitness progress! 🎯\n\n` +
                   `✅ ${stats.consistency}% workout consistency\n` +
                   `✅ ${Math.abs(stats.currentWeight - stats.startingWeight).toFixed(1)} lbs ${stats.currentWeight < stats.startingWeight ? 'lost' : 'gained'}\n` +
                   `✅ ${stats.totalWorkouts} workouts completed\n` +
                   `✅ ${stats.totalCalories.toLocaleString()} calories burned\n\n` +
                   `Powered by HealthAI 💪`;

        if (navigator.share) {
            navigator.share({
                title: 'My HealthAI Progress',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Progress summary copied to clipboard!', 'success');
            });
        }
    }

    refreshDashboard() {
        this.loadUserData();
        this.updateAllCharts();
        this.updateDashboard();
    }

    updateChartsForPeriod(period) {
        // Update charts based on selected period
        const data = this.getDataForPeriod(period);
        
        // Update each chart
        Object.keys(this.charts).forEach(chartName => {
            if (this.charts[chartName] && data[chartName]) {
                this.charts[chartName].data.datasets[0].data = data[chartName];
                this.charts[chartName].update();
            }
        });
    }

    updateAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.update();
        });
    }

    getDataForPeriod(period) {
        let days;
        switch(period) {
            case 'week': days = 7; break;
            case 'month': days = 30; break;
            case 'quarter': days = 90; break;
            default: days = 7;
        }
        
        const data = this.getLastNDaysData(days);
        
        return {
            weight: data.map(d => d.weight),
            workout: data.map(d => d.workoutTime),
            sleep: data.map(d => d.sleepHours),
            calories: data.map(d => d.caloriesBurned),
            mood: data.map(d => d.mood)
        };
    }

    // ========== THEME MANAGEMENT ==========
    setupTheme() {
        const savedTheme = localStorage.getItem('healthAI-theme') || 'light';
        this.setTheme(savedTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('healthAI-theme', theme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // ========== OFFLINE DETECTION ==========
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showNotification('Back online! Syncing data...', 'info');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showNotification('You are offline. Data will be saved locally.', 'warning');
        });
    }

    syncOfflineData() {
        // Sync offline data with server
        console.log('Syncing offline data...');
        // Implementation would depend on your backend API
    }

    // ========== NOTIFICATION SYSTEM ==========
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // ========== PUBLIC API ==========
    getProgressData() {
        return this.progressData;
    }

    getStats() {
        return this.calculateStats();
    }

    addGoal(goal) {
        this.goals.push(goal);
        localStorage.setItem('healthAI_goals', JSON.stringify(this.goals));
        this.updateGoals();
    }

    updateGoalProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.current = progress;
            localStorage.setItem('healthAI_goals', JSON.stringify(this.goals));
            this.updateGoals();
        }
    }

    addAchievement(achievement) {
        this.achievements.push(achievement);
        localStorage.setItem('healthAI_achievements', JSON.stringify(this.achievements));
        this.updateAchievements();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.HealthAIDashboard = new HealthAIProgressDashboard();
    
    // Make dashboard available globally
    console.log('🏋️‍♂️ HealthAI Progress Dashboard initialized!');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HealthAIProgressDashboard;
}
 

