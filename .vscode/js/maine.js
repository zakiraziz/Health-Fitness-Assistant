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

 
