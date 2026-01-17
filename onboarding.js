let currentStep = 1;
const totalSteps = 3;
let followedCreators = [];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
    const skillCountDisplay = document.getElementById('skillCount');

    // 1. Skills selection limit (2-4 skills)
    skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="skills"]:checked').length;
            skillCountDisplay.textContent = checkedCount;
            
            // Micro-interaction: pulse animation on counter
            skillCountDisplay.parentElement.style.animation = 'none';
            setTimeout(() => {
                skillCountDisplay.parentElement.style.animation = 'pulse 0.3s ease';
            }, 10);
            
            if (checkedCount >= 4) {
                skillCheckboxes.forEach(cb => { 
                    if (!cb.checked) {
                        cb.disabled = true;
                        cb.parentElement.style.opacity = '0.5';
                    }
                });
            } else {
                skillCheckboxes.forEach(cb => { 
                    cb.disabled = false;
                    cb.parentElement.style.opacity = '1';
                });
            }
        });
    });

    // 2. Follow button interactions
    document.querySelectorAll('.follow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const creatorId = this.dataset.creatorId;
            const btnText = this.querySelector('.btn-text');
            const btnCheck = this.querySelector('.btn-check');
            
            if (followedCreators.includes(creatorId)) {
                // Unfollow
                followedCreators = followedCreators.filter(id => id !== creatorId);
                btnText.style.display = 'inline';
                btnCheck.style.display = 'none';
                this.classList.remove('following');
            } else {
                // Follow
                followedCreators.push(creatorId);
                btnText.style.display = 'none';
                btnCheck.style.display = 'inline';
                this.classList.add('following');
                
                // Micro-interaction: success animation
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // 3. Input field animations
    document.querySelectorAll('.input-field').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // 4. Navigation Logic
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            // Micro-interaction: button press feedback
            nextBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                nextBtn.style.transform = 'scale(1)';
                goToStep(currentStep + 1);
            }, 100);
        }
    });

    prevBtn.addEventListener('click', () => {
        goToStep(currentStep - 1);
    });

    // 4. Validation
    function validateStep(step) {
        const formData = new FormData(form);
        
        if (step === 1) {
            const name = formData.get('creatorName');
            const role = formData.get('role');
            const location = formData.get('location');
            
            if (!name || name.trim().length < 2) {
                showError('Please enter your name (at least 2 characters)');
                return false;
            }
            if (!role) {
                showError('Please select your creative role');
                return false;
            }
            if (!location || location.trim().length < 3) {
                showError('Please enter your location');
                return false;
            }
        }
        
        if (step === 2) {
            const skills = formData.getAll('skills');
            if (skills.length < 2) {
                showError('Please select at least 2 skills');
                return false;
            }
            if (skills.length > 4) {
                showError('Please select no more than 4 skills');
                return false;
            }
        }
        
        return true;
    }

    // 5. Transition Function with animations
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;

        // Fade out current step
        const currentStepEl = document.querySelector('.form-step.active');
        currentStepEl.style.opacity = '0';
        currentStepEl.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            // Update Visibility
            document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
            const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
            nextStepEl.classList.add('active');
            
            // Fade in next step
            nextStepEl.style.opacity = '0';
            nextStepEl.style.transform = 'translateX(20px)';
            setTimeout(() => {
                nextStepEl.style.opacity = '1';
                nextStepEl.style.transform = 'translateX(0)';
            }, 50);

            // Update Progress UI
            document.querySelectorAll('.step').forEach(el => {
                const stepNum = parseInt(el.dataset.step);
                el.classList.toggle('active', stepNum === step);
                el.classList.toggle('completed', stepNum < step);
            });

            currentStep = step;

            // Progress Bar Fill with animation
            const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
            document.getElementById('progressFill').style.width = progressPercent + '%';

            // Button Toggles
            prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
            nextBtn.style.display = currentStep === totalSteps ? 'none' : 'flex';
            submitBtn.style.display = 'none'; // Hidden - use finishBtn instead
            
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 300);
    }

    function showError(msg) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    // 6. Final Submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('creatorName'),
            role: formData.get('role'),
            location: formData.get('location'),
            skills: formData.getAll('skills'),
            followedCreators: followedCreators,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('creatorProfile', JSON.stringify(data));
        
        // Success animation
        const finishBtn = document.getElementById('finishBtn');
        if (finishBtn) {
            finishBtn.innerHTML = '✓ Success!';
            finishBtn.style.background = '#00ff00';
        }
        
        // Navigate to main app after brief delay
        setTimeout(() => {
            window.location.href = 'creators.html';
        }, 800);
    });
});