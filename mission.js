// Mission System & App Shell Logic
// Mock Data
const mockCreators = [
    {
        id: 1,
        name: "Travis Scott",
        niche: "Music",
        distance: "0.8 MI",
        image: "images/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png",
        status: "online"
    },
    {
        id: 2,
        name: "Kai Cenat",
        niche: "Streaming",
        distance: "1.2 MI",
        image: "images/cover-kai-cenat-2025-billboard-bb2-andrew-hetherington-8-1240.webp",
        status: "online"
    },
    {
        id: 3,
        name: "Speed",
        niche: "Gaming",
        distance: "1.5 MI",
        image: "creatorimages/ishowspeed_hero.avif",
        status: "offline"
    },
    {
        id: 4,
        name: "DDG",
        niche: "Music & Video",
        distance: "2.1 MI",
        image: "images/ddg-portrait.webp",
        status: "online"
    },
    {
        id: 5,
        name: "Josh Partee",
        niche: "Photography",
        distance: "2.3 MI",
        image: "creatorimages/Bruin-JoshPartee-6206.jpg",
        status: "offline"
    }
];

const mockPosts = [
    {
        id: 1,
        author: "Travis Scott",
        avatar: "images/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png",
        content: "Just dropped new beats. Who wants to collab on visuals? 🎵🔥",
        timestamp: "2h ago",
        likes: 847
    },
    {
        id: 2,
        author: "Kai Cenat",
        avatar: "images/cover-kai-cenat-2025-billboard-bb2-andrew-hetherington-8-1240.webp",
        content: "Looking for editors who can keep up with 12hr streams. Let's build something crazy.",
        timestamp: "5h ago",
        likes: 1203
    },
    {
        id: 3,
        author: "DDG",
        avatar: "images/ddg-portrait.webp",
        content: "Need a motion designer for my next music video. Budget ready. DM me.",
        timestamp: "1d ago",
        likes: 592
    }
];

// State Management
let missionState = {
    tasksCompleted: [],
    isUnlocked: false,
    currentTab: 'discover'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Start entry animation
    startEntryAnimation();
    
    // Load saved state
    const savedState = localStorage.getItem('missionState');
    if (savedState) {
        missionState = JSON.parse(savedState);
        if (missionState.isUnlocked) {
            // Skip straight to app
            showAppShell();
        }
    }
    
    // Setup event listeners
    setupMissionListeners();
    setupNavigationListeners();
    
    // Populate mock data
    populateCreators();
    populateFeed();
});

function startEntryAnimation() {
    const overlay = document.getElementById('entryOverlay');
    const entryText = document.getElementById('entryText');
    const bootMessages = document.getElementById('bootMessages');
    const profileReveal = document.getElementById('profileReveal');
    const profilePhoto = document.getElementById('profilePhoto');
    const profileStatus = document.getElementById('profileStatus');
    
    // Placeholder for sound effects
    // playSound('system-boot'); // Uncomment when audio is ready
    
    // Create data particles
    createDataParticles();
    
    // Boot messages sequence
    const messages = [
        '> INITIALIZING CREATORWURLD SYSTEM...',
        '> LOADING USER PROTOCOLS...',
        '> ESTABLISHING NETWORK CONNECTION...',
        '> RETRIEVING CREATOR PROFILE...'
    ];
    
    messages.forEach((msg, index) => {
        setTimeout(() => {
            const msgEl = document.createElement('div');
            msgEl.className = 'boot-message';
            msgEl.textContent = msg;
            msgEl.style.animationDelay = '0s';
            bootMessages.appendChild(msgEl);
            // playSound('digital-chirp'); // Uncomment when audio is ready
        }, 200 * index);
    });
    
    // Typewriter effect for main text
    setTimeout(() => {
        const text = 'WELCOME TO THE WURLD';
        let charIndex = 0;
        
        const typeInterval = setInterval(() => {
            if (charIndex < text.length) {
                entryText.textContent += text[charIndex];
                // playSound('keystroke'); // Uncomment when audio is ready
                charIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }, 1000);
    
    // Load and display profile photo if exists
    setTimeout(() => {
        const profileData = localStorage.getItem('creatorProfile');
        if (profileData) {
            try {
                const data = JSON.parse(profileData);
                if (data.profileImageData) {
                    profilePhoto.src = data.profileImageData;
                    // Copy image to chromatic layers
                    const chromaticLayers = document.querySelectorAll('.chromatic-layer');
                    chromaticLayers.forEach(layer => {
                        layer.style.backgroundImage = `url(${data.profileImageData})`;
                    });
                }
            } catch (e) {
                console.log('No profile image found');
            }
        }
        // playSound('profile-load'); // Uncomment when audio is ready
    }, 2500);
    
    // Update profile status
    setTimeout(() => {
        profileStatus.textContent = 'PROFILE LOADED';
        // playSound('status-update'); // Uncomment when audio is ready
    }, 5000);
    
    setTimeout(() => {
        profileStatus.textContent = 'SYSTEM READY';
    }, 6000);
    
    // Fade out and transition to mission dashboard
    setTimeout(() => {
        overlay.classList.add('fade-out');
        // playSound('system-ready'); // Uncomment when audio is ready
        setTimeout(() => {
            overlay.style.display = 'none';
            showMissionDashboard();
        }, 1200);
    }, 7500);
}

// Create floating data particles
function createDataParticles() {
    const container = document.getElementById('dataParticles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (5 + Math.random() * 5) + 's';
        container.appendChild(particle);
    }
}

// Placeholder function for sound effects
function playSound(soundName) {
    // Implementation will be added when audio files are ready
    // Example: new Audio(`sounds/${soundName}.mp3`).play();
    console.log(`[SOUND] Playing: ${soundName}`);
}

function showMissionDashboard() {
    const missionContainer = document.getElementById('missionContainer');
    missionContainer.style.display = 'flex';
    setTimeout(() => {
        missionContainer.style.opacity = '1';
    }, 50);
    
    // Update UI based on saved progress
    missionState.tasksCompleted.forEach(taskNum => {
        completeTask(taskNum, true);
    });
    updateProgress();
}

function setupMissionListeners() {
    const skipBtn = document.getElementById('skipBtn');
    const enterBtn = document.getElementById('enterWurldBtn');
    
    // Task complete button handlers
    document.querySelectorAll('.task-complete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const taskNum = parseInt(this.dataset.task);
            if (!missionState.tasksCompleted.includes(taskNum)) {
                completeTask(taskNum);
                addSystemMessage(`Task ${taskNum} completed successfully`);
            }
        });
    });
    
    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            // Complete all tasks instantly
            [1, 2, 3].forEach(taskNum => {
                if (!missionState.tasksCompleted.includes(taskNum)) {
                    completeTask(taskNum, true);
                }
            });
            setTimeout(checkMissionComplete, 500);
        });
    }
    
    // Enter WURLD button
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            missionState.isUnlocked = true;
            saveMissionState();
            showAppShell();
        });
    }
}

function completeTask(taskNum, skipAnimation = false) {
    if (missionState.tasksCompleted.includes(taskNum)) return;
    
    missionState.tasksCompleted.push(taskNum);
    saveMissionState();
    
    const taskItem = document.querySelector(`.task-item[data-task-id="${taskNum}"]`);
    const checkbox = document.getElementById(`task${taskNum}`);
    const statusElement = document.getElementById(`status${taskNum}`);
    const btn = taskItem.querySelector('.task-complete-btn');
    
    // Add completed class
    taskItem.classList.add('completed');
    checkbox.checked = true;
    checkbox.parentElement.querySelector('.checkbox-custom').classList.add('checked');
    statusElement.textContent = 'COMPLETE';
    statusElement.style.color = '#00ff88';
    btn.style.display = 'none';
    
    // Update progress
    updateProgress();
    
    // Check if all complete
    if (!skipAnimation) {
        setTimeout(checkMissionComplete, 800);
    }
}

function updateProgress() {
    const completed = missionState.tasksCompleted.length;
    const total = 3;
    const percentage = (completed / total) * 100;
    
    // Update progress bar
    const progressBar = document.getElementById('progressBarFill');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    // Update count
    const progressCount = document.getElementById('progressCount');
    if (progressCount) {
        progressCount.textContent = `${completed}/${total} COMPLETE`;
    }
    
    // Update status text
    const statusText = document.getElementById('statusText');
    if (statusText && completed === total) {
        statusText.textContent = 'INITIALIZATION COMPLETE';
    }
}

function checkMissionComplete() {
    if (missionState.tasksCompleted.length === 3) {
        showMissionComplete();
    }
}

function showMissionComplete() {
    addSystemMessage('All tasks completed! Access granted.');
    
    setTimeout(() => {
        const unlockOverlay = document.getElementById('unlockOverlay');
        if (unlockOverlay) {
            unlockOverlay.style.display = 'flex';
            setTimeout(() => {
                unlockOverlay.style.opacity = '1';
            }, 50);
        }
    }, 1000);
}

function addSystemMessage(message) {
    const messagesContainer = document.getElementById('systemMessages');
    if (!messagesContainer) return;
    
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.innerHTML = `
        <span class="message-timestamp">[${time}]</span>
        <span class="message-text">${message}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showAppShell() {
    // Save completion and redirect to creators page
    localStorage.setItem('missionCompleted', 'true');
    window.location.href = 'creators.html';
}

function setupNavigationListeners() {
    // Navigation handled by mission buttons
}

function saveMissionState() {
    localStorage.setItem('missionState', JSON.stringify(missionState));
}

function switchTab(tabName) {
    missionState.currentTab = tabName;
    saveMissionState();
    
    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.app-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function populateCreators() {
    const grid = document.getElementById('creatorsGrid');
    
    mockCreators.forEach(creator => {
        const card = document.createElement('div');
        card.className = 'creator-card';
        card.innerHTML = `
            <div class="creator-image">
                <img src="${creator.image}" alt="${creator.name}">
                <span class="creator-status ${creator.status}"></span>
            </div>
            <div class="creator-info">
                <h3 class="creator-name">${creator.name}</h3>
                <p class="creator-niche">${creator.niche}</p>
                <p class="creator-distance">${creator.distance}</p>
            </div>
            <button class="connect-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                CONNECT
            </button>
        `;
        grid.appendChild(card);
    });
}

function populateFeed() {
    const feed = document.getElementById('feedContainer');
    
    mockPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'feed-post';
        postCard.innerHTML = `
            <div class="post-header">
                <img src="${post.avatar}" alt="${post.author}" class="post-avatar">
                <div class="post-author-info">
                    <h4 class="post-author">${post.author}</h4>
                    <span class="post-time">${post.timestamp}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button class="post-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${post.likes}</span>
                </button>
                <button class="post-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    REPLY
                </button>
            </div>
        `;
        feed.appendChild(postCard);
    });
}

function saveMissionState() {
    localStorage.setItem('missionState', JSON.stringify(missionState));
}

// Reset function for testing
window.resetMission = function() {
    localStorage.removeItem('missionState');
    location.reload();
};
