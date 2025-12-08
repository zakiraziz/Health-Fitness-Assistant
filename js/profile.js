// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Load profile data
    loadProfileData();
    
    // Setup event listeners
    setupProfileListeners();
});

function loadProfileData() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Update profile picture
    const profileImg = document.getElementById('profileImage');
    if (profileImg) {
        if (user.profilePic) {
            profileImg.src = user.profilePic;
        }
        profileImg.onclick = () => document.getElementById('pictureUpload').click();
    }

    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('joinDate').textContent = new Date(user.joinedDate).toLocaleDateString();

    // Populate form fields
    const fields = {
        'inputName': user.name,
        'inputEmail': user.email,
        'inputPhone': user.phone || '',
        'targetWeight': user.fitnessGoals?.targetWeight || '',
        'workoutTarget': user.fitnessGoals?.weeklyWorkouts || 3,
        'calorieTarget': user.fitnessGoals?.dailyCalories || 2000,
        'currentWeight': user.fitnessGoals?.currentWeight || ''
    };

    for (const [id, value] of Object.entries(fields)) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value;
        }
    }

    // Update stats
    updateProfileStats();
}

function updateProfileStats() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const stats = {
        'activeDays': user.progress?.length || 0,
        'workoutsCompleted': user.workouts?.filter(w => w.completed).length || 0,
        'currentWeight': user.fitnessGoals?.currentWeight ? `${user.fitnessGoals.currentWeight} kg` : '-- kg'
    };

    for (const [id, value] of Object.entries(stats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

function setupProfileListeners() {
    // Profile picture upload
    const pictureUpload = document.getElementById('pictureUpload');
    if (pictureUpload) {
        pictureUpload.addEventListener('change', handlePictureUpload);
    }

    // Form submissions
    const personalForm = document.getElementById('personalInfoForm');
    if (personalForm) {
        personalForm.addEventListener('submit', savePersonalInfo);
    }

    const goalsForm = document.getElementById('goalsForm');
    if (goalsForm) {
        goalsForm.addEventListener('submit', saveFitnessGoals);
    }

    // Account actions
    document.getElementById('changePasswordBtn')?.addEventListener('click', showPasswordModal);
    document.getElementById('exportDataBtn')?.addEventListener('click', exportUserData);
    document.getElementById('deleteAccountBtn')?.addEventListener('click', confirmDeleteAccount);

    // Modal close
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('passwordModal').style.display = 'none';
    });

    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', changePassword);
    }
}

async function handlePictureUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
        auth.showNotification('Please select an image file', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        auth.showNotification('Image size should be less than 5MB', 'error');
        return;
    }

    // Show loading
    auth.showNotification('Uploading profile picture...', 'info');

    // Upload picture
    const imageData = await auth.uploadProfilePicture(file);
    if (imageData) {
        document.getElementById('profileImage').src = imageData;
        // Update navbar picture if exists
        const navPic = document.getElementById('navProfilePic');
        if (navPic) {
            navPic.src = imageData;
        }
    }
}

function savePersonalInfo(e) {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('inputName').value,
        email: document.getElementById('inputEmail').value,
        phone: document.getElementById('inputPhone').value
    };

    if (auth.updateProfile(userData)) {
        updateProfileStats();
    }
}

function saveFitnessGoals(e) {
    e.preventDefault();
    
    const fitnessGoals = {
        fitnessGoals: {
            targetWeight: document.getElementById('targetWeight').value,
            weeklyWorkouts: document.getElementById('workoutTarget').value,
            dailyCalories: document.getElementById('calorieTarget').value,
            currentWeight: document.getElementById('currentWeight').value
        }
    };

    if (auth.updateProfile(fitnessGoals)) {
        updateProfileStats();
    }
}

function showPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
}

function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
        auth.showNotification('Please fill all password fields', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        auth.showNotification('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        auth.showNotification('New password must be at least 6 characters', 'error');
        return;
    }

    // Check current password
    const user = auth.getCurrentUser();
    if (user.password !== currentPassword) {
        auth.showNotification('Current password is incorrect', 'error');
        return;
    }

    // Update password
    auth.updateProfile({ password: newPassword });
    document.getElementById('passwordModal').style.display = 'none';
    e.target.reset();
}

function exportUserData() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Create export data (exclude password)
    const exportData = { ...user };
    delete exportData.password;

    // Create download link
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_fitness_data_${user.name}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    auth.showNotification('Data exported successfully!', 'success');
}

function confirmDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        deleteAccount();
    }
}

function deleteAccount() {
    const user = auth.getCurrentUser();
    if (!user) return;

    // Remove user from storage
    let users = JSON.parse(localStorage.getItem('health_fitness_users')) || [];
    users = users.filter(u => u.id !== user.id);
    localStorage.setItem('health_fitness_users', JSON.stringify(users));

    // Clear session
    localStorage.removeItem('current_fitness_session');
    
    auth.showNotification('Account deleted successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}