// progress.js - Main functionality for Progress Tracking page

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();
    
    // Initialize all components
    initPeriodSelector();
    initProgressCharts();
    initProgressLogging();
    initProgressCircles();
    initNotesSystem();
    initShareFunctionality();
    initGoalTracking();
    initExportFunctionality();
    initMilestoneSystem();
});

// ========== AUTHENTICATION & USER STATE ==========
function checkAuthStatus() {
    // Check if user is logged in (simulated)
    const isLoggedIn = localStorage.getItem('healthAI_userLoggedIn') === 'true';
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (isLoggedIn && authButtons && userMenu) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        
        // Load user data
        const userData = JSON.parse(localStorage.getItem('healthAI_userData') || '{}');
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar && userData.name) {
            const initials = userData.name.split(' ').map(n => n[0]).join('');
            userAvatar.textContent = initials.toUpperCase();
        }
    }
}

// ========== PERIOD SELECTOR ==========
function initPeriodSelector() {
    const periodBtns = document.querySelectorAll('.period-btn');
    periodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            periodBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get period data
            const period = this.dataset.period || this.textContent.toLowerCase().replace(' ', '');
            
            // Update charts and data based on selected period
            updateDataForPeriod(period);
            
            // Save selected period to localStorage
            localStorage.setItem('selectedProgressPeriod', period);
        });
    });
    
    // Load saved period selection
    const savedPeriod = localStorage.getItem('selectedProgressPeriod') || 'week';
    const savedBtn = document.querySelector(`.period-btn[data-period="${savedPeriod}"]`);
    if (savedBtn) {
        savedBtn.classList.add('active');
        updateDataForPeriod(savedPeriod);
    }
}

function updateDataForPeriod(period) {
    console.log(`Loading data for period: ${period}`);
    
    // This would typically fetch data from an API
    // For now, we'll simulate data based on period
    const mockData = generateMockDataForPeriod(period);
    
    // Update all charts with new data
    updateChartsWithData(mockData);
    
    // Update stats overview
    updateStatsOverview(mockData.stats);
    
    // Update comparison section
    updateComparisonSection(mockData.comparison);
    
    // Update achievements
    updateAchievementsForPeriod(period);
}

function generateMockDataForPeriod(period) {
    const data = {
        stats: {},
        charts: {},
        comparison: {}
    };
    
    switch(period) {
        case 'week':
            data.stats = {
                consistency: 85,
                weightChange: -2.1,
                nutritionScore: 78,
                sleepQuality: 72
            };
            data.charts = {
                weight: [176.5, 176.2, 176.0, 175.8, 175.5, 175.3, 175.1],
                workouts: [45, 60, 0, 75, 45, 90, 30],
                calories: [420, 580, 0, 650, 420, 720, 310],
                sleep: [7.5, 6.8, 7.2, 7.0, 6.5, 8.2, 7.8]
            };
            data.comparison = {
                workouts: { current: 5, previous: 4, change: 25 },
                calories: { current: 420, previous: 365, change: 15 },
                sleep: { current: 7.2, previous: 7.5, change: -4 }
            };
            break;
            
        case 'month':
            data.stats = {
                consistency: 82,
                weightChange: -4.2,
                nutritionScore: 76,
                sleepQuality: 75
            };
            data.charts = {
                weight: [179, 178.5, 177.8, 177.2, 176.8, 176.5, 176.2, 176.0, 175.8, 175.5, 175.3, 175.1, 174.8],
                workouts: Array.from({length: 30}, () => Math.floor(Math.random() * 90)),
                calories: Array.from({length: 30}, () => Math.floor(Math.random() * 800)),
                sleep: Array.from({length: 30}, () => 6 + Math.random() * 3)
            };
            data.comparison = {
                workouts: { current: 18, previous: 15, change: 20 },
                calories: { current: 485, previous: 420, change: 15 },
                sleep: { current: 7.4, previous: 7.1, change: 4 }
            };
            break;
            
        case 'all':
        default:
            data.stats = {
                consistency: 85,
                weightChange: -8.5,
                nutritionScore: 78,
                sleepQuality: 72
            };
            data.charts = {
                weight: [185, 182.5, 180.5, 179, 177.5, 176.5, 175.5, 175, 174.5],
                workouts: [30, 45, 60, 45, 75, 45, 60, 30, 90, 45, 60, 75],
                calories: [320, 420, 580, 420, 650, 420, 580, 310, 720, 420, 580, 650],
                sleep: [6.5, 7.0, 6.8, 7.2, 7.0, 7.5, 6.8, 7.2, 8.2, 7.0, 7.5, 7.8]
            };
            data.comparison = {
                workouts: { current: 12, previous: 8, change: 50 },
                calories: { current: 520, previous: 380, change: 37 },
                sleep: { current: 7.3, previous: 6.9, change: 6 }
            };
            break;
    }
    
    return data;
}

// ========== CHARTS INITIALIZATION ==========
let weightChart, workoutChart, caloriesChart, sleepChart;

function initProgressCharts() {
    // Initialize charts with empty data
    const weightCtx = document.getElementById('weightChart')?.getContext('2d');
    const workoutCtx = document.getElementById('workoutChart')?.getContext('2d');
    const caloriesCtx = document.getElementById('caloriesChart')?.getContext('2d');
    const sleepCtx = document.getElementById('sleepChart')?.getContext('2d');
    
    if (weightCtx) {
        weightChart = new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Weight (lbs)',
                    data: [],
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
            options: getChartOptions('Weight Trend', 'lbs')
        });
    }
    
    if (workoutCtx) {
        workoutChart = new Chart(workoutCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Workout Minutes',
                    data: [],
                    backgroundColor: '#8b5cf6',
                    borderColor: '#7c3aed',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: getChartOptions('Workout Minutes', 'min')
        });
    }
    
    if (caloriesCtx) {
        caloriesChart = new Chart(caloriesCtx, {
            type: 'radar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Calories Burned',
                    data: [],
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: getRadarChartOptions('Calories Burned')
        });
    }
    
    if (sleepCtx) {
        sleepChart = new Chart(sleepCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sleep Hours',
                    data: [],
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
            options: getChartOptions('Sleep Quality', 'hours')
        });
    }
}

function getChartOptions(title, unit) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
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
                title: {
                    display: true,
                    text: unit
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        }
    };
}

function getRadarChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                suggestedMin: 0,
                suggestedMax: 800
            }
        }
    };
}

function updateChartsWithData(data) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    
    if (weightChart && data.charts.weight) {
        weightChart.data.labels = weeks.slice(0, data.charts.weight.length);
        weightChart.data.datasets[0].data = data.charts.weight;
        weightChart.update();
    }
    
    if (workoutChart && data.charts.workouts) {
        workoutChart.data.labels = days.slice(0, data.charts.workouts.length);
        workoutChart.data.datasets[0].data = data.charts.workouts;
        workoutChart.update();
    }
    
    if (caloriesChart && data.charts.calories) {
        caloriesChart.data.labels = days.slice(0, data.charts.calories.length);
        caloriesChart.data.datasets[0].data = data.charts.calories;
        caloriesChart.update();
    }
    
    if (sleepChart && data.charts.sleep) {
        sleepChart.data.labels = days.slice(0, data.charts.sleep.length);
        sleepChart.data.datasets[0].data = data.charts.sleep;
        sleepChart.update();
    }
}

// ========== PROGRESS LOGGING ==========
function initProgressLogging() {
    const logProgressBtn = document.getElementById('logProgressBtn');
    if (!logProgressBtn) return;
    
    logProgressBtn.addEventListener('click', function() {
        logDailyProgress();
    });
    
    // Load previous values
    loadPreviousProgressValues();
}

function logDailyProgress() {
    const weightInput = document.getElementById('weightInput');
    const workoutTimeInput = document.getElementById('workoutTime');
    const caloriesBurnedInput = document.getElementById('caloriesBurned');
    const moodSelect = document.getElementById('mood');
    
    const progressData = {
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        weight: weightInput.value ? parseFloat(weightInput.value) : null,
        workoutTime: workoutTimeInput.value ? parseInt(workoutTimeInput.value) : null,
        caloriesBurned: caloriesBurnedInput.value ? parseInt(caloriesBurnedInput.value) : null,
        mood: moodSelect.value ? parseInt(moodSelect.value) : null,
        moodEmoji: moodSelect.options[moodSelect.selectedIndex]?.text.split(' ')[0] || null
    };
    
    // Validate input
    if (!progressData.weight && !progressData.workoutTime && !progressData.caloriesBurned) {
        showNotification('Please enter at least one metric to log!', 'error');
        return;
    }
    
    // Save progress to localStorage
    saveProgressData(progressData);
    
    // Update charts and stats
    updateAfterProgressLog(progressData);
    
    // Show success message
    showNotification('Progress logged successfully!', 'success');
    
    // Clear inputs
    clearProgressInputs();
    
    // Check for new achievements
    checkForNewAchievements(progressData);
}

function saveProgressData(progressData) {
    // Get existing progress data
    let allProgress = JSON.parse(localStorage.getItem('healthAI_progressData') || '[]');
    
    // Check if there's already an entry for today
    const todayIndex = allProgress.findIndex(entry => 
        entry.date === progressData.date
    );
    
    if (todayIndex >= 0) {
        // Update existing entry
        allProgress[todayIndex] = {
            ...allProgress[todayIndex],
            ...progressData
        };
    } else {
        // Add new entry
        allProgress.push(progressData);
    }
    
    // Save back to localStorage
    localStorage.setItem('healthAI_progressData', JSON.stringify(allProgress));
    
    // Update aggregated stats
    updateAggregatedStats(allProgress);
}

function updateAfterProgressLog(progressData) {
    // This would typically make an API call to update backend
    console.log('Progress logged:', progressData);
    
    // Update the UI immediately
    updateStatsFromNewData(progressData);
    
    // Refresh charts
    const savedPeriod = localStorage.getItem('selectedProgressPeriod') || 'week';
    updateDataForPeriod(savedPeriod);
}

function loadPreviousProgressValues() {
    const allProgress = JSON.parse(localStorage.getItem('healthAI_progressData') || '[]');
    if (allProgress.length === 0) return;
    
    // Get yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const yesterdayData = allProgress.find(entry => entry.date === yesterdayStr);
    
    if (yesterdayData) {
        // Set placeholder values
        const weightInput = document.getElementById('weightInput');
        if (weightInput && yesterdayData.weight) {
            weightInput.placeholder = `Yesterday: ${yesterdayData.weight} lbs`;
        }
    }
}

function clearProgressInputs() {
    document.getElementById('weightInput').value = '';
    document.getElementById('workoutTime').value = '';
    document.getElementById('caloriesBurned').value = '';
    document.getElementById('mood').value = '';
}

// ========== PROGRESS CIRCLES ANIMATION ==========
function initProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach(circle => {
        const percentage = circle.dataset.percentage;
        circle.style.setProperty('--percentage', `${percentage}%`);
        
        // Add animation
        circle.style.animation = 'progressFill 1.5s ease-out forwards';
    });
}

function updateStatsOverview(stats) {
    // Update progress circles
    const progressCircles = document.querySelectorAll('.progress-circle');
    progressCircles.forEach((circle, index) => {
        let percentage;
        switch(index) {
            case 0: percentage = stats.consistency; break;
            case 1: // Weight progress is not a circle
            case 2: percentage = stats.nutritionScore; break;
            case 3: percentage = stats.sleepQuality; break;
        }
        
        if (percentage !== undefined) {
            circle.dataset.percentage = percentage;
            circle.querySelector('span').textContent = `${percentage}%`;
            circle.style.setProperty('--percentage', `${percentage}%`);
        }
    });
    
    // Update weight progress
    const weightNumber = document.querySelector('.progress-number .number');
    if (weightNumber && stats.weightChange !== undefined) {
        weightNumber.textContent = stats.weightChange > 0 ? `+${stats.weightChange}` : stats.weightChange;
        weightNumber.style.color = stats.weightChange < 0 ? '#10b981' : '#ef4444';
    }
}

function updateStatsFromNewData(newData) {
    // Update local stats based on new data
    console.log('Updating stats with new data:', newData);
    // This would recalculate and update all stats
}

// ========== COMPARISON SECTION ==========
function updateComparisonSection(comparisonData) {
    const comparisonCards = document.querySelectorAll('.compare-card');
    
    comparisonCards.forEach(card => {
        const comparisons = card.querySelectorAll('.comparison-metric');
        
        comparisons.forEach(metric => {
            const metricName = metric.querySelector('span:first-child').textContent;
            const comparisonValue = metric.querySelector('.comparison-value');
            const changeSpan = metric.querySelector('.improvement, .decline');
            
            // Find relevant data
            let data;
            if (metricName.includes('Workouts')) {
                data = comparisonData.workouts;
            } else if (metricName.includes('Calories')) {
                data = comparisonData.calories;
            } else if (metricName.includes('Sleep')) {
                data = comparisonData.sleep;
            }
            
            if (data && comparisonValue) {
                comparisonValue.textContent = data.current;
                
                if (changeSpan) {
                    const changeClass = data.change > 0 ? 'improvement' : 'decline';
                    const changeSymbol = data.change > 0 ? '↑' : '↓';
                    const changeValue = Math.abs(data.change);
                    
                    changeSpan.className = changeClass;
                    changeSpan.textContent = `${changeSymbol} ${changeValue}%`;
                }
            }
        });
    });
}

// ========== NOTES SYSTEM ==========
function initNotesSystem() {
    const addNoteBtn = document.getElementById('addNoteBtn');
    if (!addNoteBtn) return;
    
    addNoteBtn.addEventListener('click', function() {
        showNoteModal();
    });
    
    // Load existing notes
    loadNotes();
}

function showNoteModal() {
    const noteText = prompt('Enter your progress note:');
    if (noteText && noteText.trim()) {
        saveNote(noteText.trim());
    }
}

function saveNote(text) {
    const note = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString(),
        text: text
    };
    
    // Save to localStorage
    let notes = JSON.parse(localStorage.getItem('healthAI_progressNotes') || '[]');
    notes.unshift(note); // Add to beginning
    localStorage.setItem('healthAI_progressNotes', JSON.stringify(notes));
    
    // Update UI
    addNoteToUI(note);
}

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('healthAI_progressNotes') || '[]');
    const notesGrid = document.querySelector('.notes-grid');
    
    if (!notesGrid) return;
    
    // Clear existing notes (except first few example ones if they exist)
    const exampleNotes = notesGrid.querySelectorAll('.note-card');
    if (exampleNotes.length > 3) {
        notesGrid.innerHTML = '';
    }
    
    // Add notes to UI
    notes.slice(0, 10).forEach(note => {
        addNoteToUI(note);
    });
}

function addNoteToUI(note) {
    const notesGrid = document.querySelector('.notes-grid');
    if (!notesGrid) return;
    
    const noteCard = document.createElement('div');
    noteCard.className = 'note-card';
    noteCard.innerHTML = `
        <div class="note-date">${note.date}</div>
        <p>${note.text}</p>
    `;
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
    deleteBtn.className = 'note-delete-btn';
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        deleteNote(note.id, noteCard);
    };
    noteCard.appendChild(deleteBtn);
    
    notesGrid.insertBefore(noteCard, notesGrid.firstChild);
}

function deleteNote(noteId, noteElement) {
    if (confirm('Are you sure you want to delete this note?')) {
        // Remove from localStorage
        let notes = JSON.parse(localStorage.getItem('healthAI_progressNotes') || '[]');
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('healthAI_progressNotes', JSON.stringify(notes));
        
        // Remove from UI
        noteElement.remove();
    }
}

// ========== ACHIEVEMENTS SYSTEM ==========
function updateAchievementsForPeriod(period) {
    // This would filter achievements based on the selected period
    const achievements = document.querySelectorAll('.achievement-card');
    
    achievements.forEach(achievement => {
        const dateSpan = achievement.querySelector('.achievement-date');
        if (dateSpan && period !== 'all') {
            // Filter logic based on period
            // For demo, just highlight recent achievements
            if (dateSpan.textContent.includes('ago')) {
                achievement.style.opacity = '1';
            } else {
                achievement.style.opacity = '0.7';
            }
        }
    });
}

function checkForNewAchievements(progressData) {
    // Check if any new achievements were unlocked
    const achievements = [
        {
            id: 'weight_loss_10',
            title: 'Weight Loss Champion',
            description: 'Lose 10 pounds total',
            condition: (stats) => stats.totalWeightLoss >= 10,
            icon: 'fas fa-weight',
            progress: '8.5/10 lbs'
        },
        {
            id: 'workout_streak_30',
            title: 'Workout Warrior',
            description: '30-day workout streak',
            condition: (stats) => stats.workoutStreak >= 30,
            icon: 'fas fa-dumbbell',
            progress: '18/30 days'
        }
        // Add more achievements...
    ];
    
    // Check each achievement
    achievements.forEach(achievement => {
        // This would check against user's actual stats
        console.log(`Checking achievement: ${achievement.title}`);
    });
}

// ========== GOAL TRACKING ==========
function initGoalTracking() {
    // Load goals from localStorage
    const goals = JSON.parse(localStorage.getItem('healthAI_goals') || '[]');
    
    if (goals.length === 0) {
        // Set default goals
        const defaultGoals = [
            {
                id: 'weight_goal',
                title: 'Weight Loss Goal',
                target: 20,
                current: 8.5,
                unit: 'lbs',
                color: '#3b82f6'
            },
            {
                id: 'consistency_goal',
                title: 'Workout Consistency',
                target: 30,
                current: 18,
                unit: 'days',
                color: '#8b5cf6'
            },
            {
                id: 'running_goal',
                title: 'Running Distance',
                target: 50,
                current: 17.5,
                unit: 'miles',
                color: '#10b981'
            }
        ];
        
        localStorage.setItem('healthAI_goals', JSON.stringify(defaultGoals));
        goals = defaultGoals;
    }
    
    // Update goal progress bars
    updateGoalProgressBars(goals);
}

function updateGoalProgressBars(goals) {
    const goalCards = document.querySelectorAll('.goal-card');
    
    goalCards.forEach((card, index) => {
        if (goals[index]) {
            const goal = goals[index];
            const progress = (goal.current / goal.target) * 100;
            
            const progressBar = card.querySelector('.goal-progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
                progressBar.style.background = `linear-gradient(90deg, ${goal.color}, ${goal.color}99)`;
            }
            
            const progressText = card.querySelector('p:last-child');
            if (progressText) {
                progressText.textContent = `Progress: ${goal.current}/${goal.target} ${goal.unit} (${progress.toFixed(1)}%)`;
            }
        }
    });
}

// ========== SHARE FUNCTIONALITY ==========
function initShareFunctionality() {
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('share-facebook') ? 'facebook' :
                          this.classList.contains('share-twitter') ? 'twitter' : 'instagram';
            shareProgress(platform);
        });
    });
}

function shareProgress(platform) {
    const stats = {
        consistency: 85,
        weightChange: -8.5,
        workouts: 12,
        calories: 10000
    };
    
    const message = `I've been crushing my fitness goals with HealthAI! 🎯\n\n` +
                   `✅ ${stats.consistency}% workout consistency\n` +
                   `✅ ${Math.abs(stats.weightChange)} lbs weight loss\n` +
                   `✅ ${stats.workouts} workouts completed\n` +
                   `✅ ${stats.calories.toLocaleString()} calories burned\n\n` +
                   `#HealthAI #FitnessJourney #Progress`;
    
    const url = 'https://healthai.app/progress';
    
    switch(platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
            break;
        case 'instagram':
            // Instagram doesn't support direct sharing via URL
            showNotification('Copy your progress summary to share on Instagram:', 'info');
            copyToClipboard(message);
            break;
    }
}

// ========== EXPORT FUNCTIONALITY ==========
function initExportFunctionality() {
    const exportBtn = document.getElementById('exportProgress');
    if (!exportBtn) return;
    
    exportBtn.addEventListener('click', function() {
        exportProgressReport();
    });
}

function exportProgressReport() {
    const progressData = JSON.parse(localStorage.getItem('healthAI_progressData') || '[]');
    const notes = JSON.parse(localStorage.getItem('healthAI_progressNotes') || '[]');
    const goals = JSON.parse(localStorage.getItem('healthAI_goals') || '[]');
    
    const report = {
        generated: new Date().toISOString(),
        summary: generateProgressSummary(),
        progressData: progressData,
        notes: notes,
        goals: goals,
        achievements: getAchievementsSummary()
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `healthai-progress-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Progress report exported successfully!', 'success');
}

function generateProgressSummary() {
    const progressData = JSON.parse(localStorage.getItem('healthAI_progressData') || '[]');
    
    if (progressData.length === 0) {
        return 'No progress data available.';
    }
    
    const weightData = progressData.filter(d => d.weight).map(d => d.weight);
    const workoutData = progressData.filter(d => d.workoutTime).map(d => d.workoutTime);
    const calorieData = progressData.filter(d => d.caloriesBurned).map(d => d.caloriesBurned);
    
    const summary = {
        totalEntries: progressData.length,
        averageWeight: weightData.length > 0 ? 
            (weightData.reduce((a, b) => a + b, 0) / weightData.length).toFixed(1) : 'N/A',
        totalWorkoutMinutes: workoutData.reduce((a, b) => a + b, 0),
        totalCaloriesBurned: calorieData.reduce((a, b) => a + b, 0),
        startDate: progressData[0]?.date || 'N/A',
        endDate: progressData[progressData.length - 1]?.date || 'N/A'
    };
    
    return summary;
}

function getAchievementsSummary() {
    const achievements = document.querySelectorAll('.achievement-card');
    const summary = [];
    
    achievements.forEach(achievement => {
        const title = achievement.querySelector('h3')?.textContent || '';
        const isUnlocked = achievement.classList.contains('unlocked');
        const progress = achievement.querySelector('.achievement-progress')?.textContent || '';
        
        summary.push({
            title,
            unlocked: isUnlocked,
            progress: isUnlocked ? 'Unlocked' : progress
        });
    });
    
    return summary;
}

// ========== MILESTONE SYSTEM ==========
function initMilestoneSystem() {
    // Load milestones from localStorage
    const milestones = JSON.parse(localStorage.getItem('healthAI_milestones') || '[]');
    
    if (milestones.length === 0) {
        // Create default milestones
        const defaultMilestones = [
            {
                date: 'Today',
                content: 'Logged 45-minute HIIT workout and burned 520 calories',
                type: 'workout'
            },
            {
                date: '3 Days Ago',
                content: 'Achieved personal best in 5K run - 24:35 minutes',
                type: 'achievement'
            },
            {
                date: '1 Week Ago',
                content: 'Reached 10,000 total calories burned milestone',
                type: 'milestone'
            },
            {
                date: '2 Weeks Ago',
                content: 'Completed first week with 5 consecutive workouts',
                type: 'consistency'
            }
        ];
        
        localStorage.setItem('healthAI_milestones', JSON.stringify(defaultMilestones));
    }
}

function updateAggregatedStats(progressData) {
    if (progressData.length === 0) return;
    
    const stats = {
        totalEntries: progressData.length,
        totalWorkoutMinutes: 0,
        totalCaloriesBurned: 0,
        weightEntries: [],
        moodEntries: []
    };
    
    progressData.forEach(entry => {
        if (entry.workoutTime) stats.totalWorkoutMinutes += entry.workoutTime;
        if (entry.caloriesBurned) stats.totalCaloriesBurned += entry.caloriesBurned;
        if (entry.weight) stats.weightEntries.push(entry.weight);
        if (entry.mood) stats.moodEntries.push(entry.mood);
    });
    
    localStorage.setItem('healthAI_aggregatedStats', JSON.stringify(stats));
}

// ========== UTILITY FUNCTIONS ==========
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.onclick = function() {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    };
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes progressFill {
        from { --percentage: 0%; }
        to { --percentage: attr(data-percentage); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        line-height: 1;
    }
    
    .note-delete-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #ef4444;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
    }
    
    .note-delete-btn:hover {
        background: #ef4444;
        color: white;
    }
    
    .progress-circle {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: conic-gradient(var(--primary-color) calc(var(--percentage) * 3.6deg), var(--border-color) 0deg);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
    }
    
    .progress-circle::before {
        content: '';
        position: absolute;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: var(--card-bg);
    }
    
 
`;
document.head.appendChild(style);