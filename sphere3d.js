// 3D Floating Sphere with Creator Photos + Neural Wave Connections
// Using Three.js with Simplex Noise for wave distortion

class PhotoSphere {
    constructor(canvasId, imageUrls) {
        this.canvas = document.getElementById(canvasId);
        this.imageUrls = imageUrls;
        this.mouse = { x: 0, y: 0 };
        this.mouseWorldPos = new THREE.Vector3();
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.raycaster = new THREE.Raycaster();
        this.hoveredObject = null;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 10, 30); // Fog for depth
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 15;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true, // Transparent background
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Create sphere
        this.createPhotoSphere();
        
        // Create neural connections
        this.createNeuralWeb();
        
        // Event listeners
        this.addEventListeners();
        
        // Start animation
        this.animate();
    }
    
    createPhotoSphere() {
        this.photoGroup = new THREE.Group();
        this.photoMeshes = [];
        
        const radius = 8;
        const photoCount = this.imageUrls.length;
        
        // Use Fibonacci sphere algorithm for even distribution
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        
        this.imageUrls.forEach((url, i) => {
            // Load texture
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(url);
            
            // Create plane geometry for photo
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position on sphere using Fibonacci sphere
            const y = 1 - (i / (photoCount - 1)) * 2; // y goes from 1 to -1
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            
            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            mesh.position.set(x * radius, y * radius, z * radius);
            
            // Make plane face outward from center
            mesh.lookAt(0, 0, 0);
            mesh.rotateY(Math.PI);
            
            // Store original position and scale for effects
            mesh.userData.originalPosition = mesh.position.clone();
            mesh.userData.originalScale = mesh.scale.clone();
            mesh.userData.isHovered = false;
            mesh.userData.velocity = new THREE.Vector3();
            
            this.photoMeshes.push(mesh);
            this.photoGroup.add(mesh);
        });
        
        this.scene.add(this.photoGroup);
    }
     and proximity repulsion
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Calculate target rotation based on mouse position
            this.targetRotation.y = this.mouse.x * 0.3;
            this.targetRotation.x = this.mouse.y * 0.3;
            
            // Calculate mouse position in 3D world space
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const distance = 15;
            this.mouseWorldPos = this.raycaster.ray.origin.clone()
                .add(this.raycaster.ray.direction.multiplyScalar(distance))ength; j++) {
                const photo1 = this.photoMeshes[i];
                const photo2 = this.photoMeshes[j];
                
                const distance = photo1.position.distanceTo(photo2.position);
                
                if (distance < maxDistance) {
                    // Create line geometry
                    const points = [
                        photo1.position.clone(),
                        photo2.position.clone()
                    ];
                    
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    
                    // Create glowing material with bloom effect
                    const material = new THREE.LineBasicMaterial({
                        color: 0x00ffff,
                        transparent: true,
                        opacity: 0.15,
                        blending: THREE.AdditiveBlending
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    line.userData.photo1 = photo1;
                    line.userData.photo2 = photo2;
                    line.userData.baseOpacity = 0.15;
                    
                    this.connectionLines.push(line);
                    this.photoGroup.add(line);
                }
            }
        }
    }
    
    // Simplex-like noise function (pseudo-random wave)
    noise3D(x, y, z) {
        return Math.sin(x * 1.5 + this.time) * 
               Math.cos(y * 1.5 + this.time * 0.8) * 
               Math.sin(z * 1.5 + this.time * 0.6);
    }
    
    addEventListeners() {
        // Mouse move for sphere tilt
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            // Calculate target rotation based on mouse position
            this.targetRotation.y = this.mouse.x * 0.3;
            this.targetRotation.x = this.mouse.y * 0.3;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Touch support for mobile
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
                
                this.targetRotation.y = this.mouse.x * 0.3;
                this.targetRotation.x = this.mouse.y * 0.3;
            }
        });
    }
    
    checkHover() {
        // Update raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Check intersections
        const intersects = this.raycaster.intersectObjects(this.photoMeshes);
        
        // Reset previous hover
        if (this.hoveredObject && (intersects.length === 0 || intersects[0].object !== this.hoveredObject)) {
            this.hoveredObject.userData.isHovered = false;
            this.hoveredObject = null;
        }
        
        // Set new hover
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object !== this.hoveredObject) {
                this.hoveredObject = object;
                this.hoveredObject.userData.isHovered = true;
            }
        this.time += 0.01; // Time for wave animation
        
        // Smooth rotation interpolation (lerp)
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        
        // Apply rotation to group
        this.photoGroup.rotation.y = this.currentRotation.y;
        this.photoGroup.rotation.x = this.currentRotation.x;
        
        // Add constant slow rotation
        this.photoGroup.rotation.y += 0.001;
        
        // Check for hover
        this.checkHover();
        
        // Update photos with wave distortion and mouse repulsion
        this.photoMeshes.forEach(mesh => {
            // Get world position
            const worldPos = new THREE.Vector3();
            mesh.getWorldPosition(worldPos);
            
            // Apply 3D wave distortion (undulation)
            const noise = this.noise3D(
                mesh.userData.originalPosition.x,
                mesh.userData.originalPosition.y,
                mesh.userData.originalPosition.z
            );
            const waveOffset = noise * 0.2;
            
            // Mouse proximity repulsion
            const distToMouse = worldPos.distanceTo(this.mouseWorldPos);
            const repulsionRadius = 8;
            let repulsion = new THREE.Vector3();
            
            if (distToMouse < repulsionRadius) {
                const repulsionForce = (1 - distToMouse / repulsionRadius) * 0.5;
                repulsion = worldPos.clone()
                    .sub(this.mouseWorldPos)
                    .normalize()
                    .multiplyScalar(repulsionForce);
                
                mesh.userData.velocity.add(repulsion);
            }
            
            // Apply velocity and damping
            mesh.userData.velocity.multiplyScalar(0.92); // Damping
            const newPos = mesh.userData.originalPosition.clone()
                .add(mesh.userData.velocity)
                .add(mesh.userData.originalPosition.clone().normalize().multiplyScalar(waveOffset));
            
            mesh.position.lerp(newPos, 0.1);
            
            // Hover scale and opacity
            const targetScale = mesh.userData.isHovered ? 1.3 : 1;
            const targetOpacity = mesh.userData.isHovered ? 1 : 0.9;
            
            mesh.scale.lerp(
                mesh.userData.originalScale.clone().multiplyScalar(targetScale),
                0.1
            );
            
            mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;
        });
        
        // Update connection lines
        this.connectionLines.forEach(line => {
            const photo1 = line.userData.photo1;
            const photo2 = line.userData.photo2;
            
            // Update line positions to follow photos
            const positions = line.geometry.attributes.position.array;
            positions[0] = photo1.position.x;
            positions[1] = photo1.position.y;
            positions[2] = photo1.position.z;
            positions[3] = photo2.position.x;
            positions[4] = photo2.position.y;
            positions[5] = photo2.position.z;
            line.geometry.attributes.position.needsUpdate = true;
            
            // Animate opacity based on wave
            const midPoint = new THREE.Vector3()
                .addVectors(photo1.position, photo2.position)
                .multiplyScalar(0.5);
            const noise = this.noise3D(midPoint.x, midPoint.y, midPoint.z);
            const pulseOpacity = line.userData.baseOpacity + (noise * 0.05);
            
            // Distance-based opacity (fade with distance from camera)
            const distFromCamera = midPoint.distanceTo(this.camera.position);
            const depthFade = Math.max(0, 1 - (distFromCamera - 10) / 20);
            
            line.material.opacity = pulseOpacity * depthFade
            mesh.scale.lerp(
                mesh.userData.originalScale.clone().multiplyScalar(targetScale),
                0.1
            );
            
            mesh.material.opacity += (targetOpacity - mesh.material.opacity) * 0.1;
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for intro animation to complete
    setTimeout(() => {
        const canvas = document.getElementById('sphereCanvas');
        if (canvas) {
            // Array of creator photo URLs
            const creatorPhotos = [
                'images/02-Travis-Scott-cr-THIBAUT-GREVET-billboard-1548.png',
                'images/21b9WfpG4PdmyKEkhch6dZhUoDg0hsvx4F4sL4oO-nA=.jpg',
                'images/440fd791b3249426abec2e05ef0b1b39_1753080563_1082_square_l.webp',
                'images/cover-kai-cenat-2025-billboard-bb2-andrew-hetherington-8-1240.webp',
                'images/ddg-portrait.webp',
                'creatorimages/Bruin-JoshPartee-6206.jpg',
                'creatorimages/ishowspeed_hero.avif',
                'creatorimages/1733752920071.jpeg',
                'creatorimages/45d29d181befbe4c4fafb2683e2d4bc4.jpg',
                'creatorimages/Brucedropemoff-Merch-4-928x1024.jpeg',
                'creatorimages/Gemini_Generated_Image_7joeuc7joeuc7joe.png',
                'creatorimages/aHR0cDovL2ltYWdlLmloZWFydC5jb20vaW1hZ2VzL2FydGlzdHMvMDgvNjcvMTAvNjdmNDMzYWVhNWZiNWIzMTBhNTRiYzU5LmpwZw==.webp'
            ];
            
            new PhotoSphere('sphereCanvas', creatorPhotos);
        }
    }, 8500); // Start after intro animation
});
