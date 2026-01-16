# CREATORWURLD Audio Implementation Guide

## Overview
This document outlines the sound effect system for the CREATORWURLD digital awakening experience.

## Sound Effect Placeholders

The following sound effects are referenced in `mission.js` with placeholder function calls:

### Entry Overlay Sounds

1. **system-boot** 
   - Trigger: On page load, when entry animation starts
   - Description: Deep, resonant system initialization sound
   - Recommended: Low frequency hum with digital chirps
   - Duration: 2-3 seconds

2. **digital-chirp**
   - Trigger: Each time a boot message appears (4 times)
   - Description: Quick, high-pitched digital beep
   - Recommended: Short blip sound (0.1-0.2 seconds)
   - Example: Terminal typing sound

3. **keystroke**
   - Trigger: Each character typed in typewriter effect
   - Description: Mechanical keyboard click
   - Recommended: Subtle click sound
   - Duration: 0.05 seconds

4. **profile-load**
   - Trigger: When profile photo begins to assemble (2.5s after start)
   - Description: Data loading sound with ascending pitch
   - Recommended: Whoosh + digital scan
   - Duration: 1-2 seconds

5. **status-update**
   - Trigger: When profile status changes to "PROFILE LOADED"
   - Description: Confirmation beep
   - Recommended: Two-tone beep (low-high)
   - Duration: 0.3 seconds

6. **system-ready**
   - Trigger: Final transition before showing mission dashboard
   - Description: Triumphant system ready sound
   - Recommended: Ascending tone sequence
   - Duration: 1-2 seconds

## Implementation Example

### Option 1: Using Web Audio API (Recommended)

```javascript
// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const sounds = {};

// Preload sounds
async function loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    sounds[name] = audioBuffer;
}

// Play sound
function playSound(soundName) {
    if (!sounds[soundName]) return;
    
    const source = audioContext.createBufferSource();
    source.buffer = sounds[soundName];
    source.connect(audioContext.destination);
    source.start(0);
}

// Preload all sounds on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadSound('system-boot', 'sounds/system-boot.mp3');
    await loadSound('digital-chirp', 'sounds/digital-chirp.mp3');
    await loadSound('keystroke', 'sounds/keystroke.mp3');
    await loadSound('profile-load', 'sounds/profile-load.mp3');
    await loadSound('status-update', 'sounds/status-update.mp3');
    await loadSound('system-ready', 'sounds/system-ready.mp3');
});
```

### Option 2: Simple HTML5 Audio

```javascript
const audioCache = {};

function preloadSounds() {
    const soundList = [
        'system-boot',
        'digital-chirp',
        'keystroke',
        'profile-load',
        'status-update',
        'system-ready'
    ];
    
    soundList.forEach(name => {
        audioCache[name] = new Audio(`sounds/${name}.mp3`);
        audioCache[name].preload = 'auto';
    });
}

function playSound(soundName) {
    if (audioCache[soundName]) {
        audioCache[soundName].currentTime = 0;
        audioCache[soundName].play().catch(e => console.log('Audio play failed:', e));
    }
}

// Call on page load
preloadSounds();
```

## Folder Structure

```
creatorworld/
├── sounds/
│   ├── system-boot.mp3
│   ├── digital-chirp.mp3
│   ├── keystroke.mp3
│   ├── profile-load.mp3
│   ├── status-update.mp3
│   └── system-ready.mp3
├── mission.js
└── mission.html
```

## Free Sound Resources

### Recommended Sources:
1. **Freesound.org** - Free sound effects library
2. **Zapsplat.com** - UI and digital sounds
3. **Mixkit.co** - Free sound effects
4. **Sonniss.com** - Game audio GDC bundles

### Search Terms:
- "UI beep"
- "system boot"
- "digital chirp"
- "keyboard click"
- "scan sound"
- "confirmation beep"
- "tech startup sound"

## Volume Recommendations

```javascript
// Suggested volume levels (0.0 to 1.0)
const volumes = {
    'system-boot': 0.3,
    'digital-chirp': 0.2,
    'keystroke': 0.1,
    'profile-load': 0.4,
    'status-update': 0.3,
    'system-ready': 0.5
};

function playSound(soundName) {
    if (audioCache[soundName]) {
        audioCache[soundName].volume = volumes[soundName] || 0.5;
        audioCache[soundName].currentTime = 0;
        audioCache[soundName].play().catch(e => console.log('Audio play failed:', e));
    }
}
```

## User Preferences

Consider adding a mute toggle:

```javascript
let audioEnabled = localStorage.getItem('audioEnabled') !== 'false';

function toggleAudio() {
    audioEnabled = !audioEnabled;
    localStorage.setItem('audioEnabled', audioEnabled);
}

function playSound(soundName) {
    if (!audioEnabled) return;
    // ... rest of playSound logic
}
```

## Browser Compatibility Notes

- Most browsers require user interaction before playing audio
- Consider adding a "Click to enable sound" prompt on first visit
- Safari iOS has special audio restrictions
- Always include error handling for audio playback

## Next Steps

1. Source or create audio files
2. Add files to `sounds/` directory
3. Uncomment `playSound()` calls in `mission.js`
4. Implement one of the audio systems above
5. Test across browsers
6. Add volume controls (optional)
7. Add mute toggle (optional)
