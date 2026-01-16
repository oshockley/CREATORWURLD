# Quick Reference: Animation Timing & Customization

## Easy Customization Points

### Adjust Overall Speed
In [mission.js](mission.js#L103), change the final timeout:
```javascript
// Current: 7.5 seconds total
setTimeout(() => { /* fade out */ }, 7500);

// Faster: 5 seconds
setTimeout(() => { /* fade out */ }, 5000);

// Slower: 10 seconds
setTimeout(() => { /* fade out */ }, 10000);
```

### Change Typewriter Speed
In [mission.js](mission.js#L127):
```javascript
// Current: 100ms per character
}, 100);

// Faster: 50ms
}, 50);

// Slower: 200ms
}, 200);
```

### Modify Particle Count
In [mission.js](mission.js#L175):
```javascript
// Current: 30 particles
const particleCount = 30;

// More particles: 50
const particleCount = 50;

// Fewer particles: 15
const particleCount = 15;
```

### Adjust Scanline Speed
In [styles.css](styles.css#L6348):
```css
/* Current: 3 seconds */
animation: scanlineMove 3s linear infinite;

/* Faster: 1.5 seconds */
animation: scanlineMove 1.5s linear infinite;

/* Slower: 5 seconds */
animation: scanlineMove 5s linear infinite;
```

### Change Profile Frame Color
In [mission.html](mission.html#L29-L35):
```html
<!-- Current: Green (#00ff9d) and Cyan (#00ffff) -->
<circle stroke="#00ff9d" />
<circle stroke="#00ffff" />

<!-- Blue theme -->
<circle stroke="#0080ff" />
<circle stroke="#00ffff" />

<!-- Purple theme -->
<circle stroke="#ff00ff" />
<circle stroke="#8000ff" />
```

### Modify Grid Opacity
In [styles.css](styles.css#L6405):
```css
/* Current: 0.1 opacity */
background: rgba(0, 255, 255, 0.1);

/* More visible: 0.2 */
background: rgba(0, 255, 255, 0.2);

/* Subtle: 0.05 */
background: rgba(0, 255, 255, 0.05);
```

## Animation Delay Reference

| Element | Start Time | Duration | Total Wait |
|---------|-----------|----------|------------|
| Scanlines | 0s | 3s | Continuous |
| Particles | 0s | 5-10s | Continuous |
| Grid | 0.5s | 2s | 2.5s |
| Boot Messages | 0-0.8s | 0.3s each | 0.8s |
| Entry Text | 1s | ~2s | 3s |
| Profile Reveal | 2.5s | 1s | 3.5s |
| Border Drawing | 2.8s | 2s | 4.8s |
| Photo Fade | 4.5s | 1s | 5.5s |
| Scanning Line | 5.5s | 2s | Continuous |
| Final Fade | 7.5s | 1.2s | 8.7s |

## Color Palette

```css
/* Primary Colors */
--cyan: #00ffff;
--green: #00ff9d;
--white: #ffffff;
--black: #000000;

/* Accent Colors */
--magenta: #ff00ff;
--cyan-glow: rgba(0, 255, 255, 0.8);
--green-glow: rgba(0, 255, 157, 0.8);

/* Backgrounds */
--glass-bg: rgba(255, 255, 255, 0.02);
--glass-border: rgba(0, 255, 255, 0.15);
```

## Font Sizes

```css
/* Entry Text */
entry-text: clamp(2rem, 8vw, 5rem);

/* Boot Messages */
boot-messages: 0.9rem;

/* Profile Status */
profile-status: 1rem;

/* Mobile Entry Text */
@media (max-width: 768px): clamp(1.5rem, 10vw, 3rem);
```

## Common Modifications

### Disable Scanlines
In [mission.html](mission.html#L12-L15), remove:
```html
<div class="scanline-container">...</div>
```

### Disable Particles
In [mission.js](mission.js#L114), comment out:
```javascript
// createDataParticles();
```

### Skip Profile Reveal
In [mission.html](mission.html#L31-L48), remove:
```html
<div class="profile-reveal-container">...</div>
```

### Change Welcome Text
In [mission.js](mission.js#L121):
```javascript
// Current
const text = 'WELCOME TO THE WURLD';

// Custom
const text = 'CREATOR MODE ACTIVATED';
const text = 'SYSTEM ONLINE';
```

### Adjust Glassmorphism Blur
In [styles.css](styles.css), find `backdrop-filter`:
```css
/* Current: 10px blur */
backdrop-filter: blur(10px);

/* Stronger: 20px */
backdrop-filter: blur(20px);

/* Subtle: 5px */
backdrop-filter: blur(5px);
```

## Pro Tips

1. **Test timing**: Adjust all timeouts proportionally to maintain flow
2. **Mobile testing**: Animations may run slower on mobile devices
3. **Reduce motion**: Consider `prefers-reduced-motion` for accessibility
4. **Performance**: More particles = more CPU usage
5. **Sound sync**: Align sound effects with animation milestones

## Debug Mode

Add to [mission.js](mission.js) to see timing:
```javascript
console.log('[0s] Entry animation started');
console.log('[1s] Typewriter started');
console.log('[2.5s] Profile reveal started');
console.log('[7.5s] Transitioning to dashboard');
```

## Troubleshooting

**Profile photo not showing?**
- Check localStorage: `localStorage.getItem('creatorProfile')`
- Verify image was uploaded in onboarding
- Check browser console for errors

**Animations not running?**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser compatibility
- Verify CSS file loaded completely

**Timing feels off?**
- Adjust all timeouts proportionally
- Test on different devices
- Consider reducing particle count

**Particles not visible?**
- Increase particle size in CSS
- Change particle color
- Increase particle count
