// Sample creator data
const creators = [
    {
        id: 1,
        name: "BruceDropEmOff",
        role: "YouTube Creator",
        platform: "YouTube",
        location: "Los Angeles, CA",
        distance: "2.3 miles away",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=300&fit=crop",
        tags: ["Tech Reviews", "Vlogging", "Editing"]
    },
    {
        id: 2,
        name: "Maya Chen",
        role: "Music Producer",
        platform: "Music",
        location: "Los Angeles, CA",
        distance: "3.8 miles away",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=300&fit=crop",
        tags: ["Hip-Hop", "Production", "Mixing"]
    },
    {
        id: 3,
        name: "Jordan Blake",
        role: "Videographer",
        platform: "TikTok",
        location: "Los Angeles, CA",
        distance: "1.5 miles away",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=500&h=300&fit=crop",
        tags: ["Cinematic", "Short-Form", "Color Grading"]
    },
    {
        id: 4,
        name: "Sarah Martinez",
        role: "Podcast Host",
        platform: "Podcast",
        location: "Los Angeles, CA",
        distance: "4.2 miles away",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&h=300&fit=crop",
        tags: ["Interviews", "Storytelling", "Editing"]
    },
    {
        id: 5,
        name: "David Kim",
        role: "Photographer",
        platform: "Instagram",
        location: "Los Angeles, CA",
        distance: "2.7 miles away",
        image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=500&h=300&fit=crop",
        tags: ["Portrait", "Street", "Editorial"]
    },
    {
        id: 6,
        name: "Emily Taylor",
        role: "Content Creator",
        platform: "Multi-Platform",
        location: "Los Angeles, CA",
        distance: "3.1 miles away",
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=300&fit=crop",
        tags: ["Lifestyle", "Fashion", "Travel"]
    }
];

// Platform icons (using emoji or simple text for now)
const platformIcons = {
    "YouTube": "▶",
    "Music": "♪",
    "TikTok": "⊕",
    "Podcast": "🎙",
    "Instagram": "◉",
    "Multi-Platform": "⊞"
};

// Create creator card HTML
function createCreatorCard(creator) {
    return `
        <div class="creator-card">
            <div class="card-image-wrapper">
                <img src="${creator.image}" alt="${creator.name}" class="card-image">
                <div class="platform-badge">
                    <span class="platform-icon">${platformIcons[creator.platform]}</span>
                    ${creator.platform}
                </div>
            </div>
            <div class="card-content">
                <h3 class="creator-name">${creator.name}</h3>
                <p class="creator-role">${creator.role}</p>
                <div class="creator-location">
                    <svg class="location-icon-small" width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 1c-3.866 0-7 3.134-7 7 0 5.25 7 11 7 11s7-5.75 7-11c0-3.866-3.134-7-7-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>${creator.location} · ${creator.distance}</span>
                </div>
                <div class="creator-tags">
                    ${creator.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="connect-btn" onclick="connectWithCreator('${creator.name}')">Connect</button>
            </div>
        </div>
    `;
}

// Render all creator cards
function renderCreators() {
    const grid = document.getElementById('creatorsGrid');
    if (grid) {
        grid.innerHTML = creators.map(creator => createCreatorCard(creator)).join('');
    }
}

// Connect button handler
function connectWithCreator(name) {
    alert(`Connecting with ${name}...`);
    // Add your connection logic here
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderCreators();
    
    // Add smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
