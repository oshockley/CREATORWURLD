// Cinematic Intro Animation
let introPlayed = false;

// Profile Gating System
function checkProfile() {
    const profile = localStorage.getItem('creatorProfile');
    return profile !== null;
}

function unlockGatedContent() {
    const gatedSections = document.querySelectorAll('.gated-section');
    gatedSections.forEach(section => {
        section.classList.add('unlocked');
    });
}

function initProfileGating() {
    const hasProfile = checkProfile();
    
    if (hasProfile) {
        // User has profile, unlock all gated content
        unlockGatedContent();
    } else {
        // User doesn't have profile, redirect GET STARTED button to onboarding
        const getStartedBtn = document.querySelector('.cta-get-started');
        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                window.location.href = 'onboarding.html';
            });
        }
    }
}

function initIntro() {
    const canvas = document.getElementById('topoCanvas');
    if (canvas) {
        canvas.style.display = 'none'; // Hide the wave animation
    }
    
    // Hide the globe logo after 2 seconds to show creator photos
    const introGlobe = document.getElementById('introGlobe');
    setTimeout(() => {
        if (introGlobe) {
            introGlobe.style.opacity = '0';
            introGlobe.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                introGlobe.style.display = 'none';
            }, 500);
        }
    }, 2000);
    
    // Animate creator connection points on the globe
    const connectionPoints = document.getElementById('connectionPoints');
    if (connectionPoints) {
        const pointPositions = [
            { top: '20%', left: '30%' },
            { top: '40%', left: '70%' },
            { top: '60%', left: '20%' },
            { top: '25%', left: '80%' },
            { top: '70%', left: '50%' },
            { top: '45%', left: '15%' },
            { top: '80%', left: '75%' },
            { top: '35%', left: '45%' }
        ];
        
        // Add connection points with staggered animation
        pointPositions.forEach((pos, index) => {
            setTimeout(() => {
                const point = document.createElement('div');
                point.className = 'connection-point';
                point.style.top = pos.top;
                point.style.left = pos.left;
                point.style.animationDelay = `${index * 0.15}s`;
                connectionPoints.appendChild(point);
                
                // Draw connection lines between nearby points
                if (index > 0 && index % 2 === 0) {
                    const prevIndex = index - 1;
                    const line = document.createElement('div');
                    line.className = 'connection-line';
                    
                    const x1 = parseFloat(pointPositions[prevIndex].left);
                    const y1 = parseFloat(pointPositions[prevIndex].top);
                    const x2 = parseFloat(pos.left);
                    const y2 = parseFloat(pos.top);
                    
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                    
                    line.style.width = `${length}%`;
                    line.style.left = pointPositions[prevIndex].left;
                    line.style.top = pointPositions[prevIndex].top;
                    line.style.transform = `rotate(${angle}deg)`;
                    line.style.animationDelay = `${index * 0.3 + 0.5}s`;
                    
                    connectionPoints.appendChild(line);
                }
            }, index * 600);
        });
    }
    
    // End intro after 8 seconds for smoother animation experience
    setTimeout(() => {
        const overlay = document.getElementById('introOverlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
                introPlayed = true;
                
                // After intro, scroll to top to show landing content
                window.scrollTo(0, 0);
            }, 1000);
        }
    }, 8000);
}

// Slideshow functionality
let currentSlide = 0;
let slideshowInterval;

function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    // Start auto-play
    slideshowInterval = setInterval(nextSlide, 4000);
    
    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideshowInterval);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            slideshowInterval = setInterval(nextSlide, 4000);
        });
    }
}

function updateSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlideshow();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlideshow();
    
    // Reset auto-play
    clearInterval(slideshowInterval);
    slideshowInterval = setInterval(nextSlide, 4000);
}

// Hamburger Menu Toggle
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const hiddenMenu = document.getElementById('hiddenMenu');
    
    if (menuToggle && hiddenMenu) {
        menuToggle.addEventListener('click', function() {
            hiddenMenu.classList.toggle('active');
            
            // Animate hamburger lines
            const lines = this.querySelectorAll('.menu-line');
            if (hiddenMenu.classList.contains('active')) {
                lines[0].style.transform = 'rotate(45deg) translateY(8px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        const menuLinks = hiddenMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                hiddenMenu.classList.remove('active');
                const lines = menuToggle.querySelectorAll('.menu-line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            });
        });
    }
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize profile gating first
    initProfileGating();
    
    // Initialize cinematic intro
    initIntro();
    
    // Initialize menu toggle
    initMenuToggle();
    
    const searchBtn = document.querySelector('.search-btn');
    const categoryPills = document.querySelectorAll('.pill');
    const searchInput = document.querySelector('.search-input .input-field');
    const locationInput = document.querySelector('.location-input .input-field');

    // Initialize slideshow after intro
    setTimeout(() => {
        initSlideshow();
    }, 1000);

    // Render creators on page load
    renderCreators();
    
    // Render blog posts on page load
    renderBlogPosts();
    
    // Render new sections
    renderAreaCreators();
    renderCollabBoard();
    renderUnderground();
    renderInbox();
    
    // Initialize Travis Scott style animations
    initScrollAnimations();
    initTiltEffect();
    initFluidLine();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize touch animations
    initTouchAnimations();

    // Smooth scroll function
    function smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Search button click handler - scroll to creators section (only if exists)
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchQuery = searchInput.value;
            const location = locationInput.value;
            
            // Store search parameters
            if (searchQuery || location) {
                sessionStorage.setItem('searchQuery', searchQuery);
                sessionStorage.setItem('searchLocation', location);
            }
            
            // Smooth scroll to creators section
            smoothScrollTo('creators');
        });
    }

    // Enter key handler for search (only if exists)
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && searchBtn) {
                searchBtn.click();
            }
        });
    }

    if (locationInput) {
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && searchBtn) {
                searchBtn.click();
            }
        });
    }

    // Category pill click handlers
    categoryPills.forEach(pill => {
        pill.addEventListener('click', function() {
            const category = this.textContent;
            console.log('Category selected:', category);
            
            // Toggle active state
            categoryPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            
            // Auto-fill search with category
            searchInput.value = category;
        });
    });

    // Add active state styling
    const style = document.createElement('style');
    style.textContent = `
        .pill.active {
            background-color: #ffffff;
            color: #000000;
        }
    `;
    document.head.appendChild(style);
});

// Sample creator data
const creators = [
    {
        id: 1,
        name: "HillBoyNeal",
        role: "YouTube Creator",
        platform: "YouTube",
        location: "Los Angeles, CA",
        distance: "2.3 miles away",
        image: "creatorimages/Gemini_Generated_Image_7joeuc7joeuc7joe.png",
        tags: ["Tech Reviews", "Vlogging", "Editing"]
    },
    {
        id: 2,
        name: "Kai Cenat",
        role: "Streamer",
        platform: "Twitch",
        location: "Los Angeles, CA",
        distance: "3.8 miles away",
        image: "creatorimages/cover-kai-cenat-2025-billboard-bb2-andrew-hetherington-8-1240.webp",
        tags: ["Gaming", "Comedy", "Streaming"]
    },
    {
        id: 3,
        name: "Speed",
        role: "Creator",
        platform: "YouTube",
        location: "Los Angeles, CA",
        distance: "1.5 miles away",
        image: "creatorimages/ishowspeed_hero.avif",
        tags: ["Music", "Vlogs", "Entertainment"]
    },
    {
        id: 4,
        name: "PlaqueBoyMax",
        role: "Content Creator",
        platform: "YouTube",
        location: "Los Angeles, CA",
        distance: "4.2 miles away",
        image: "creatorimages/1733752920071.jpeg",
        tags: ["Comedy", "Vlogs", "Lifestyle"]
    },
    {
        id: 5,
        name: "Quan",
        role: "Content Creator",
        platform: "YouTube",
        location: "Los Angeles, CA",
        distance: "2.7 miles away",
        image: "creatorimages/45d29d181befbe4c4fafb2683e2d4bc4.jpg",
        tags: ["Entertainment", "Comedy", "Vlogs"]
    },
    {
        id: 6,
        name: "DDG",
        role: "Streamer",
        platform: "Twitch",
        location: "Los Angeles, CA",
        distance: "3.1 miles away",
        image: "creatorimages/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL2FydGlzdHMvMDgvNjcvMTAvNjdmNDMzYWVhNWZiNWIzMTBhNTRiYzU5LmpwZw==.webp",
        tags: ["Gaming", "Comedy", "Streaming"]
    }
];

// Platform icons
const platformIcons = {
    "YouTube": "▶",
    "Music": "♪",
    "TikTok": "⊕",
    "Podcast": "🎙",
    "Instagram": "◉",
    "Multi-Platform": "⊞"
};

// Create creator card HTML
// Render all creator cards
function renderCreators() {
    const grid = document.getElementById('creatorsGrid');
    if (!grid) return;
    
    // Add active status to every 3rd creator
    const creatorsWithStatus = creators.map((creator, index) => ({
        ...creator,
        active: (index + 1) % 3 === 0
    }));
    
    grid.innerHTML = creatorsWithStatus.map(creator => createCreatorCard(creator)).join('');
    
    // Initialize scroll reveal for mobile
    initScrollReveal();
}

// Connect button handler
function connectWithCreator(name) {
    alert(`Connecting with ${name}...`);
    // Add your connection logic here
}

// Travis Scott / Jackboys Inspired Animations

// Scroll-triggered hero scaling and chromatic effect
function initScrollAnimations() {
    const hero = document.querySelector('.hero');
    const slideshow = document.querySelector('.glass-slideshow');
    const creatorsSection = document.querySelector('.creators-section');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                // Hero scale effect
                if (scrollY > 50 && scrollY < 800) {
                    hero.classList.add('scrolled');
                    if (slideshow) slideshow.classList.add('scrolled');
                } else {
                    hero.classList.remove('scrolled');
                    if (slideshow) slideshow.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// 3D Tilt hover effect for creator cards
function initTiltEffect() {
    const cards = document.querySelectorAll('.creator-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Fluid connection line animation
function initFluidLine() {
    const fluidLine = document.getElementById('fluidLine');
    const connectionPath = document.getElementById('connectionPath');
    
    if (!fluidLine || !connectionPath) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fluidLine.classList.add('active');
                
                // Create wavy path
                let pathData = 'M 50 0';
                for (let i = 0; i <= 800; i += 20) {
                    const x = 50 + Math.sin(i / 50) * 30;
                    pathData += ` L ${x} ${i}`;
                }
                
                connectionPath.setAttribute('d', pathData);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    const creatorsSection = document.querySelector('.creators-section');
    if (creatorsSection) {
        observer.observe(creatorsSection);
    }
}

// Blog Posts Data
const blogPosts = [
    {
        id: 1,
        category: 'Collaboration',
        date: 'Jan 10, 2026',
        title: '5 Tips for Successful Creator Collaborations',
        description: 'Learn how to build meaningful partnerships that elevate your content and grow your audience together.',
        image: 'latestfromtheblogphotos/67cb90d77a4a43b193168a4b_AMP_Tone_Group_Shot_ML_Sq.webp',
        link: '#'
    },
    {
        id: 2,
        category: 'Networking',
        date: 'Jan 8, 2026',
        title: 'How Local Networking Can Transform Your Content',
        description: 'Discover why connecting with creators in your city leads to better content and stronger creative bonds.',
        image: 'latestfromtheblogphotos/Gemini_Generated_Image_5p85ag5p85ag5p85.png',
        link: '#'
    },
    {
        id: 3,
        category: 'Success Stories',
        date: 'Jan 5, 2026',
        title: 'Cross-Platform Success Stories',
        description: 'Real stories from creators who found their perfect collab partners and achieved breakthrough growth.',
        image: 'latestfromtheblogphotos/Gemini_Generated_Image_my5z59my5z59my5z.png',
        link: '#'
    }
];

// Render Blog Posts
function renderBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    
    if (!blogGrid) return;
    
    blogGrid.innerHTML = blogPosts.map(post => `
        <div class="blog-card">
            <div class="blog-image-wrapper">
                <img src="${post.image}" alt="${post.title}" class="blog-image">
                <span class="blog-category">${post.category}</span>
            </div>
            <div class="blog-content">
                <div class="blog-date">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="14" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="4" y1="2" x2="4" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    ${post.date}
                </div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-description">${post.description}</p>
                <a href="${post.link}" class="read-more-btn">
                    Read More
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 3l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>
        </div>
    `).join('');
}

// Discovery Map Data & Functions
const areaCreatorsData = [
    {
        id: 1,
        name: 'HillBoyNeal',
        niche: 'Music Producer',
        avatar: 'creatorimages/hillboy.jpg',
        live: true,
        distance: '2.3 miles'
    },
    {
        id: 2,
        name: 'Kai Cenat',
        niche: 'Content Creator',
        avatar: 'creatorimages/kai.jpg',
        live: true,
        distance: '3.7 miles'
    },
    {
        id: 3,
        name: 'DDG',
        niche: 'Artist/Creator',
        avatar: 'creatorimages/ddg.jpg',
        live: false,
        distance: '5.1 miles'
    }
];

function renderAreaCreators() {
    const container = document.getElementById('areaCreators');
    if (!container) return;
    
    container.innerHTML = areaCreatorsData.map(creator => `
        <div class="area-creator-card">
            <div class="creator-card-header">
                <img src="${creator.avatar}" alt="${creator.name}" class="creator-avatar">
                <div class="creator-info">
                    <h4>${creator.name}</h4>
                    <p>${creator.niche} • ${creator.distance}</p>
                </div>
            </div>
            ${creator.live ? '<div class="live-indicator"><span class="live-dot"></span> Live Now</div>' : ''}
        </div>
    `).join('');
}

// Collab Board Data & Functions
const collabPosts = [
    {
        id: 1,
        creator: {
            name: 'HillBoyNeal',
            niche: 'Music Producer',
            avatar: 'creatorimages/hillboy.jpg'
        },
        title: 'Need Video Director for Music Video',
        description: 'Looking for a creative video director to bring my new single to life. Think Travis Scott meets Blade Runner vibes.',
        budget: 'paid',
        tags: ['Music Video', 'Director', 'Cinematography'],
        posted: '2 hours ago'
    },
    {
        id: 2,
        creator: {
            name: 'Kai Cenat',
            niche: 'Content Creator',
            avatar: 'creatorimages/kai.jpg'
        },
        title: 'Podcast Editor Needed',
        description: 'Looking for someone who can turn 3 hour streams into fire podcast clips. Fast turnaround essential.',
        budget: 'trade',
        tags: ['Editing', 'Podcast', 'Content'],
        posted: '5 hours ago'
    },
    {
        id: 3,
        creator: {
            name: 'PlaqueBoyMax',
            niche: 'Photographer',
            avatar: 'creatorimages/max.jpg'
        },
        title: 'Models for Fashion Shoot',
        description: 'Urban fashion shoot this weekend. Need 2-3 models comfortable with streetwear aesthetic. Portfolio building opportunity.',
        budget: 'exposure',
        tags: ['Fashion', 'Photography', 'Modeling'],
        posted: '1 day ago'
    }
];

function renderCollabBoard() {
    const container = document.getElementById('collabGrid');
    if (!container) return;
    
    container.innerHTML = collabPosts.map(post => `
        <div class="collab-card">
            <div class="collab-header">
                <div class="collab-creator">
                    <img src="${post.creator.avatar}" alt="${post.creator.name}">
                    <div class="collab-creator-info">
                        <h4>${post.creator.name}</h4>
                        <p>${post.creator.niche}</p>
                    </div>
                </div>
                <span class="budget-tag ${post.budget}">${post.budget}</span>
            </div>
            <h3 class="collab-title">${post.title}</h3>
            <p class="collab-description">${post.description}</p>
            <div class="collab-footer">
                <div class="collab-tags">
                    ${post.tags.map(tag => `<span class="collab-tag">${tag}</span>`).join('')}
                </div>
                <button class="apply-btn">Apply</button>
            </div>
        </div>
    `).join('');
}

// Underground Section Data & Functions
const undergroundStories = {
    featured: {
        title: 'Speed\'s Africa Tour: A Cultural Movement',
        category: 'Impact',
        excerpt: 'IShowSpeed\'s electrifying tour across Africa has touched millions, bringing joy, inspiration, and global attention to African communities while celebrating their vibrant culture.',
        image: 'undergroundimages/IShowSpeed-in-Africa-1024x533.png'
    },
    stories: [
        {
            title: 'The Rise of LA\'s New Wave',
            category: 'Creator Spotlight',
            excerpt: 'How a collective of young creators are reshaping the city\'s creative landscape with raw authenticity and collaborative energy.',
            image: 'undergroundimages/1616-GQ-CV01-01-KL-GQstyle.webp'
        },
        {
            title: 'The King of DanceHall',
            category: 'Music',
            excerpt: 'Vybz Kartel makes his triumphant return to Dancehall after years away, reclaiming his throne in the genre he helped define.',
            image: 'undergroundimages/8665853.jpeg'
        },
        {
            title: 'Studio Sessions: Building Your Space',
            category: 'Gear Review',
            excerpt: 'Essential equipment and design tips for creating a professional home studio on any budget.',
            image: 'undergroundimages/studio-setup.jpg'
        }
    ],
    events: [
        {
            title: 'Creator Meetup Downtown',
            date: 'Jan 20, 2026',
            location: 'Arts District, LA'
        },
        {
            title: 'Music Video Workshop',
            date: 'Jan 25, 2026',
            location: 'Studio City'
        },
        {
            title: 'Networking Night',
            date: 'Feb 1, 2026',
            location: 'Hollywood'
        }
    ]
};

function renderUnderground() {
    // Featured Story
    const featuredContainer = document.getElementById('featuredStory');
    if (featuredContainer) {
        featuredContainer.innerHTML = `
            <img src="${undergroundStories.featured.image}" alt="${undergroundStories.featured.title}" class="featured-story-image">
            <div class="featured-story-content">
                <span class="featured-category">${undergroundStories.featured.category}</span>
                <h3 class="featured-story-title">${undergroundStories.featured.title}</h3>
                <p class="featured-story-excerpt">${undergroundStories.featured.excerpt}</p>
            </div>
        `;
    }
    
    // Story Grid
    const storyContainer = document.getElementById('storyGrid');
    if (storyContainer) {
        storyContainer.innerHTML = undergroundStories.stories.map(story => `
            <div class="story-card">
                <img src="${story.image}" alt="${story.title}" class="story-card-image">
                <div class="story-card-content">
                    <p class="story-category">${story.category}</p>
                    <h4 class="story-title">${story.title}</h4>
                    <p class="story-excerpt">${story.excerpt}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Events
    const eventContainer = document.getElementById('eventList');
    if (eventContainer) {
        eventContainer.innerHTML = undergroundStories.events.map(event => `
            <div class="event-card">
                <p class="event-date">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="14" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                        <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    ${event.date}
                </p>
                <h4 class="event-title">${event.title}</h4>
                <p class="event-location">${event.location}</p>
            </div>
        `).join('');
    }
}

// Inbox Data & Functions
const conversations = [
    {
        id: 1,
        name: 'Kai Cenat',
        avatar: 'creatorimages/kai.jpg',
        preview: 'Yo, loved your last project. Down to collab?',
        active: true
    },
    {
        id: 2,
        name: 'DDG',
        avatar: 'creatorimages/ddg.jpg',
        preview: 'Studio session next week?',
        active: false
    },
    {
        id: 3,
        name: 'PlaqueBoyMax',
        avatar: 'creatorimages/max.jpg',
        preview: 'Thanks for the shoot yesterday! 🔥',
        active: false
    }
];

function renderInbox() {
    const container = document.getElementById('conversationList');
    if (!container) return;
    
    container.innerHTML = conversations.map(conv => `
        <div class="conversation-item ${conv.active ? 'active' : ''}" onclick="selectConversation(${conv.id})">
            <img src="${conv.avatar}" alt="${conv.name}" class="conversation-avatar">
            <div class="conversation-info">
                <h4 class="conversation-name">${conv.name}</h4>
                <p class="conversation-preview">${conv.preview}</p>
            </div>
        </div>
    `).join('');
}

function selectConversation(id) {
    const conv = conversations.find(c => c.id === id);
    const threadHeader = document.getElementById('threadHeader');
    const messageThread = document.getElementById('messageThread');
    
    if (threadHeader && conv) {
        threadHeader.innerHTML = `<h3>${conv.name}</h3>`;
    }
    
    if (messageThread) {
        messageThread.innerHTML = `
            <div class="message received">
                ${conv.preview}
            </div>
            <div class="message sent">
                That sounds dope! Let's set something up.
            </div>
        `;
    }
    
    // Update active state
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.conversation-item').classList.add('active');
}

// Mobile Navigation
function initMobileNav() {
    const navItems = document.querySelectorAll('.mobile-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Smooth scroll to section
            const href = this.getAttribute('href');
            const section = document.querySelector(href);
            
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href').substring(1);
            
            if (href === current || 
                (current === 'hero' && href === 'hero') ||
                (current === '' && href === 'hero')) {
                item.classList.add('active');
            }
        });
    });
}

// Touch Animations
function initTouchAnimations() {
    // Only run on touch devices
    if (!('ontouchstart' in window)) return;
    
    // Long-press for quick actions on creator cards
    const creatorCards = document.querySelectorAll('.creator-card');
    let longPressTimer;
    
    creatorCards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            // Start long-press timer
            longPressTimer = setTimeout(() => {
                card.classList.add('active');
                // Haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }, 500);
        });
        
        card.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });
        
        card.addEventListener('touchmove', function() {
            clearTimeout(longPressTimer);
        });
    });
    
    // Close overlay when tapping outside
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('.creator-card')) {
            creatorCards.forEach(card => card.classList.remove('active'));
        }
    });
    
    // Add liquid tap effect to interactive elements
    const tapElements = document.querySelectorAll('.creator-card, .blog-card, .collab-card, button, .pill');
    
    tapElements.forEach(element => {
        element.classList.add('liquid-tap');
        
        element.addEventListener('touchstart', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Viewport Height Fix for Mobile
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);
setVH();

// ========================================
// SIDE-DRAWER QUICK VIEW FUNCTIONALITY
// ========================================

const sideDrawer = document.getElementById('sideDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');

// Open drawer with creator data
function openQuickView(creator) {
    document.getElementById('drawerCreatorName').textContent = creator.name;
    document.getElementById('drawerCreatorRole').textContent = creator.role;
    document.getElementById('drawerPortfolioImage').src = creator.image;
    
    sideDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close drawer
function closeQuickView() {
    sideDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for drawer
if (drawerClose) {
    drawerClose.addEventListener('click', closeQuickView);
}

if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeQuickView);
}

// Update creator card click to open drawer
function createCreatorCard(creator) {
    return `
        <div class="creator-card ${creator.active ? 'has-pulse' : ''}" onclick="openQuickView(${JSON.stringify(creator).replace(/"/g, '&quot;')})">
            ${creator.active ? '<div class="pulse-indicator"></div>' : ''}
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
                <button class="connect-btn" onclick="event.stopPropagation(); connectWithCreator('${creator.name}')">Connect</button>
            </div>
        </div>
    `;
}

// ========================================
// VIBE FILTERS FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const vibeButtons = document.querySelectorAll('.vibe-btn');
    
    vibeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            vibeButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const vibe = this.textContent.trim();
            console.log(`Filtering by vibe: ${vibe}`);
            
            // Add your filter logic here
            // For now, just re-render creators
            renderCreators();
        });
    });
});

// Update creators data to include active status
const creatorsWithStatus = creators.map((creator, index) => ({
    ...creator,
    active: index % 3 === 0 // Mark every 3rd creator as active (for demo)
}));

// Re-render with updated data
function renderCreators() {
    const grid = document.getElementById('creatorsGrid');
    if (grid) {
        grid.innerHTML = creatorsWithStatus.map(creator => createCreatorCard(creator)).join('');
        
        // Initialize scroll-triggered color reveal for mobile
        initScrollReveal();
    }
}

// ========================================
// SCROLL-TRIGGERED COLOR REVEAL (MOBILE)
// ========================================

function initScrollReveal() {
    // Only apply on mobile/tablet (non-hover devices)
    if (!window.matchMedia('(hover: none)').matches) {
        return;
    }
    
    const creatorCards = document.querySelectorAll('.creator-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% of card is visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add revealed class to trigger color transition
                entry.target.classList.add('revealed');
                
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all creator cards
    creatorCards.forEach(card => {
        observer.observe(card);
    });
}

// Call on initial page load
document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initButtonNavigation();
});

// ========================================
// BUTTON NAVIGATION TO ONBOARDING
// ========================================

function initButtonNavigation() {
    // Get all buttons that should navigate to onboarding
    const getStartedBtn = document.querySelector('.cta-get-started');
    const postProjectBtn = document.querySelector('.post-project-btn');
    const pitchCollabBtn = document.getElementById('pitchCollabBtn');
    const connectBtns = document.querySelectorAll('.connect-btn');
    
    // Navigate to onboarding page
    function navigateToOnboarding(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'onboarding.html';
    }
    
    // Add event listeners
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', navigateToOnboarding);
    }
    
    if (postProjectBtn) {
        postProjectBtn.addEventListener('click', navigateToOnboarding);
    }
    
    if (pitchCollabBtn) {
        pitchCollabBtn.addEventListener('click', navigateToOnboarding);
    }
    
    // Connect buttons in creator cards
    connectBtns.forEach(btn => {
        btn.addEventListener('click', navigateToOnboarding);
    });
}
