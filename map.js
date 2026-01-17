// Enhanced Map Discovery System for CREATORWURLD
// Features: Clustered pins, filters, preview cards, heatmap, "Near Me"

// Mock creator data with locations
const creators = [
    { id: 1, name: 'Travis Scott', role: 'producer', lat: 34.0522, lng: -118.2437, distance: 0.8, projects: 127, rating: 4.9, avatar: 'creatorimages/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png', work: 'creatorimages/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png', online: true, available: true },
    { id: 2, name: 'Kai Cenat', role: 'videographer', lat: 34.0612, lng: -118.2520, distance: 1.2, projects: 89, rating: 4.8, avatar: 'creatorimages/cover-kai-cenat-2025-billboard-bb2-andrew-hetherington-8-1240.webp', work: 'creatorimages/cover-kai-cenat-2025-billboard-bb2-andrew-hetherington-8-1240.webp', online: true, available: false },
    { id: 3, name: 'Speed', role: 'videographer', lat: 34.0700, lng: -118.2600, distance: 1.5, projects: 156, rating: 4.7, avatar: 'creatorimages/ishowspeed_hero.avif', work: 'creatorimages/ishowspeed_hero.avif', online: false, available: true },
    { id: 4, name: 'DDG', role: 'producer', lat: 34.0450, lng: -118.2350, distance: 2.1, projects: 203, rating: 4.9, avatar: 'images/ddg-portrait.webp', work: 'images/ddg-portrait.webp', online: true, available: true },
    { id: 5, name: 'Josh Partee', role: 'photographer', lat: 34.0800, lng: -118.2700, distance: 2.3, projects: 94, rating: 4.6, avatar: 'creatorimages/Bruin-JoshPartee-6206.jpg', work: 'creatorimages/Bruin-JoshPartee-6206.jpg', online: false, available: false },
    { id: 6, name: 'Sarah Chen', role: 'editor', lat: 34.0550, lng: -118.2480, distance: 1.0, projects: 112, rating: 4.8, avatar: 'creatorimages/Gemini_Generated_Image_7joeuc7joeuc7joe.png', work: 'creatorimages/Gemini_Generated_Image_7joeuc7joeuc7joe.png', online: true, available: true },
    { id: 7, name: 'Marcus Lee', role: 'videographer', lat: 34.0630, lng: -118.2560, distance: 1.3, projects: 78, rating: 4.5, avatar: 'creatorimages/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL2FydGlzdHMvMDgvNjcvMTAvNjdmNDMzYWVhNWZiNWIzMTBhNTRiYzU5LmpwZw==.webp', work: 'creatorimages/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL2FydGlzdHMvMDgvNjcvMTAvNjdmNDMzYWVhNWZiNWIzMTBhNTRiYzU5LmpwZw==.webp', online: true, available: false },
    { id: 8, name: 'Emma Williams', role: 'photographer', lat: 34.0580, lng: -118.2450, distance: 0.9, projects: 145, rating: 4.9, avatar: 'images/21b9WfpG4PdmyKEkhch6dZhUoDg0hsvx4F4sL4oO-nA=.jpg', work: 'images/21b9WfpG4PdmyKEkhch6dZhUoDg0hsvx4F4sL4oO-nA=.jpg', online: false, available: true },
    { id: 9, name: 'Alex Rodriguez', role: 'editor', lat: 34.0720, lng: -118.2620, distance: 1.7, projects: 91, rating: 4.7, avatar: 'images/440fd791b3249426abec2e05ef0b1b39_1753080563_1082_square_l.webp', work: 'images/440fd791b3249426abec2e05ef0b1b39_1753080563_1082_square_l.webp', online: true, available: true },
    { id: 10, name: 'Jordan Smith', role: 'producer', lat: 34.0490, lng: -118.2390, distance: 1.9, projects: 134, rating: 4.8, avatar: 'creatorimages/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png', work: 'creatorimages/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png', online: false, available: false }
];

// Map state
let mapState = {
    zoom: 13,
    center: { lat: 34.0522, lng: -118.2437 }, // LA
    activeFilter: 'all',
    distanceRadius: 10,
    onlineOnly: false,
    availableOnly: false,
    heatmapVisible: false,
    userLocation: null
};

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setupFilters();
    setupControls();
    populateNearbyList();
    requestUserLocation();
});

// Initialize map canvas
function initMap() {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw base map
    drawBaseMap(ctx, canvas.width, canvas.height);
    
    // Create markers
    createMarkers();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawBaseMap(ctx, canvas.width, canvas.height);
        updateMarkerPositions();
    });
}

// Draw base map (grid pattern)
function drawBaseMap(ctx, width, height) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

// Create marker elements
function createMarkers() {
    const markersContainer = document.getElementById('mapMarkers');
    markersContainer.innerHTML = '';
    
    const filteredCreators = getFilteredCreators();
    const clusters = clusterCreators(filteredCreators, mapState.zoom);
    
    clusters.forEach(cluster => {
        if (cluster.count > 1) {
            createClusterMarker(cluster, markersContainer);
        } else {
            createSingleMarker(cluster.creators[0], markersContainer);
        }
    });
}

// Cluster creators based on proximity and zoom level
function clusterCreators(creators, zoom) {
    const clusterDistance = 0.01 * (15 - zoom); // Adjust clustering based on zoom
    const clusters = [];
    const processed = new Set();
    
    creators.forEach((creator, index) => {
        if (processed.has(index)) return;
        
        const cluster = {
            center: { lat: creator.lat, lng: creator.lng },
            creators: [creator],
            count: 1
        };
        
        // Find nearby creators to cluster
        creators.forEach((other, otherIndex) => {
            if (index === otherIndex || processed.has(otherIndex)) return;
            
            const distance = getDistance(creator.lat, creator.lng, other.lat, other.lng);
            if (distance < clusterDistance) {
                cluster.creators.push(other);
                cluster.count++;
                cluster.center.lat = (cluster.center.lat * (cluster.count - 1) + other.lat) / cluster.count;
                cluster.center.lng = (cluster.center.lng * (cluster.count - 1) + other.lng) / cluster.count;
                processed.add(otherIndex);
            }
        });
        
        processed.add(index);
        clusters.push(cluster);
    });
    
    return clusters;
}

// Calculate distance between two points (simplified)
function getDistance(lat1, lng1, lat2, lng2) {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));
}

// Create cluster marker
function createClusterMarker(cluster, container) {
    const pos = latLngToPixel(cluster.center.lat, cluster.center.lng);
    
    const marker = document.createElement('div');
    marker.className = 'map-cluster';
    marker.style.left = pos.x + 'px';
    marker.style.top = pos.y + 'px';
    marker.innerHTML = `<span>${cluster.count}</span>`;
    
    // Click to zoom in
    marker.addEventListener('click', () => {
        showClusterPopup(cluster, pos);
    });
    
    container.appendChild(marker);
}

// Create single creator marker
function createSingleMarker(creator, container) {
    const pos = latLngToPixel(creator.lat, creator.lng);
    
    const marker = document.createElement('div');
    marker.className = 'map-marker';
    marker.style.left = pos.x + 'px';
    marker.style.top = pos.y + 'px';
    marker.dataset.creatorId = creator.id;
    
    if (creator.online) {
        marker.classList.add('online');
    }
    
    // Hover to show preview
    marker.addEventListener('mouseenter', (e) => {
        showCreatorPreview(creator, pos);
    });
    
    marker.addEventListener('mouseleave', () => {
        hideCreatorPreview();
    });
    
    // Click to navigate to profile
    marker.addEventListener('click', () => {
        window.location.href = `creators.html?id=${creator.id}`;
    });
    
    container.appendChild(marker);
}

// Convert lat/lng to pixel position
function latLngToPixel(lat, lng) {
    const canvas = document.getElementById('mapCanvas');
    const bounds = {
        north: mapState.center.lat + 0.05 / mapState.zoom,
        south: mapState.center.lat - 0.05 / mapState.zoom,
        east: mapState.center.lng + 0.05 / mapState.zoom,
        west: mapState.center.lng - 0.05 / mapState.zoom
    };
    
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * canvas.width;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * canvas.height;
    
    return { x, y };
}

// Show creator preview card
function showCreatorPreview(creator, pos) {
    const preview = document.getElementById('creatorPreview');
    const canvas = document.getElementById('mapCanvas');
    
    document.getElementById('previewAvatar').src = creator.avatar;
    document.getElementById('previewName').textContent = creator.name;
    document.getElementById('previewRole').textContent = creator.role.charAt(0).toUpperCase() + creator.role.slice(1);
    document.getElementById('previewDistance').textContent = creator.distance + ' MI';
    document.getElementById('previewProjects').textContent = creator.projects;
    document.getElementById('previewRating').textContent = '⭐ ' + creator.rating;
    document.getElementById('previewWorkImg').src = creator.work;
    
    const status = document.getElementById('previewStatus');
    if (creator.online) {
        status.className = 'preview-status online';
        status.textContent = 'Online';
    } else {
        status.className = 'preview-status';
        status.textContent = 'Offline';
    }
    
    // Position preview card
    preview.style.display = 'block';
    preview.style.left = Math.min(pos.x + 20, canvas.width - 320) + 'px';
    preview.style.top = Math.max(pos.y - 100, 20) + 'px';
    
    // Animate in
    setTimeout(() => preview.classList.add('visible'), 10);
}

function hideCreatorPreview() {
    const preview = document.getElementById('creatorPreview');
    preview.classList.remove('visible');
    setTimeout(() => preview.style.display = 'none', 300);
}

// Show cluster popup
function showClusterPopup(cluster, pos) {
    const popup = document.getElementById('clusterPopup');
    const canvas = document.getElementById('mapCanvas');
    
    document.getElementById('clusterCount').textContent = cluster.count;
    
    popup.style.display = 'block';
    popup.style.left = (pos.x - 100) + 'px';
    popup.style.top = (pos.y - 80) + 'px';
    
    document.getElementById('clusterZoomBtn').onclick = () => {
        mapState.zoom = Math.min(mapState.zoom + 2, 18);
        mapState.center = cluster.center;
        createMarkers();
        popup.style.display = 'none';
    };
}

// Setup filters
function setupFilters() {
    // Role filters
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mapState.activeFilter = btn.dataset.filter;
            createMarkers();
            populateNearbyList();
        });
    });
    
    // Distance slider
    const distanceSlider = document.getElementById('distanceSlider');
    const distanceValue = document.getElementById('distanceValue');
    distanceSlider.addEventListener('input', (e) => {
        mapState.distanceRadius = e.target.value;
        distanceValue.textContent = e.target.value;
        createMarkers();
        populateNearbyList();
    });
    
    // Availability checkboxes
    document.getElementById('onlineOnly').addEventListener('change', (e) => {
        mapState.onlineOnly = e.target.checked;
        createMarkers();
        populateNearbyList();
    });
    
    document.getElementById('availableOnly').addEventListener('change', (e) => {
        mapState.availableOnly = e.target.checked;
        createMarkers();
        populateNearbyList();
    });
}

// Setup map controls
function setupControls() {
    // Near Me button
    document.getElementById('nearMeBtn').addEventListener('click', () => {
        if (mapState.userLocation) {
            mapState.center = mapState.userLocation;
            createMarkers();
        } else {
            requestUserLocation();
        }
    });
    
    // Heatmap toggle
    document.getElementById('heatmapToggle').addEventListener('click', () => {
        mapState.heatmapVisible = !mapState.heatmapVisible;
        document.getElementById('heatmapCanvas').style.display = mapState.heatmapVisible ? 'block' : 'none';
        if (mapState.heatmapVisible) {
            drawHeatmap();
        }
    });
    
    // Zoom controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        mapState.zoom = Math.min(mapState.zoom + 1, 18);
        createMarkers();
    });
    
    document.getElementById('zoomOut').addEventListener('click', () => {
        mapState.zoom = Math.max(mapState.zoom - 1, 10);
        createMarkers();
    });
    
    // Mobile filter toggle
    document.getElementById('mobileFilterToggle').addEventListener('click', () => {
        document.querySelector('.filter-sidebar').classList.toggle('mobile-visible');
    });
    
    document.getElementById('filterClose').addEventListener('click', () => {
        document.querySelector('.filter-sidebar').classList.remove('mobile-visible');
    });
}

// Draw heatmap
function drawHeatmap() {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const filteredCreators = getFilteredCreators();
    
    filteredCreators.forEach(creator => {
        const pos = latLngToPixel(creator.lat, creator.lng);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 100);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(pos.x - 100, pos.y - 100, 200, 200);
    });
}

// Get filtered creators
function getFilteredCreators() {
    return creators.filter(creator => {
        if (mapState.activeFilter !== 'all' && creator.role !== mapState.activeFilter) return false;
        if (mapState.onlineOnly && !creator.online) return false;
        if (mapState.availableOnly && !creator.available) return false;
        if (creator.distance > mapState.distanceRadius) return false;
        return true;
    });
}

// Populate nearby creators list
function populateNearbyList() {
    const container = document.getElementById('areaCreators');
    const filteredCreators = getFilteredCreators().sort((a, b) => a.distance - b.distance).slice(0, 5);
    
    container.innerHTML = filteredCreators.map(creator => `
        <div class="area-creator-item" onclick="window.location.href='creators.html?id=${creator.id}'">
            <img src="${creator.avatar}" alt="${creator.name}">
            <div class="area-creator-info">
                <h4>${creator.name}</h4>
                <p>${creator.role.charAt(0).toUpperCase() + creator.role.slice(1)}</p>
                <span class="area-distance">${creator.distance} MI</span>
            </div>
            ${creator.online ? '<div class="online-dot-small"></div>' : ''}
        </div>
    `).join('');
    
    // Update filter counts
    document.getElementById('countAll').textContent = creators.length;
    document.getElementById('countVideo').textContent = creators.filter(c => c.role === 'videographer').length;
    document.getElementById('countProducer').textContent = creators.filter(c => c.role === 'producer').length;
    document.getElementById('countEditor').textContent = creators.filter(c => c.role === 'editor').length;
    document.getElementById('countPhoto').textContent = creators.filter(c => c.role === 'photographer').length;
}

// Request user location
function requestUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                mapState.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                mapState.center = mapState.userLocation;
                createMarkers();
            },
            (error) => {
                console.log('Location access denied:', error);
            }
        );
    }
}

// Update marker positions (on zoom/pan)
function updateMarkerPositions() {
    createMarkers();
}

// Connect button in preview
document.getElementById('previewConnect').addEventListener('click', (e) => {
    e.stopPropagation();
    const creatorName = document.getElementById('previewName').textContent;
    alert(`Connecting with ${creatorName}...`);
    // In production, this would open a message dialog or navigate to profile
});
