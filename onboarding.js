let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const profileImageInput = document.getElementById('profileImage');
    const previewImage = document.getElementById('previewImage');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
    const skillCountDisplay = document.getElementById('skillCount');

    // 1. Skills selection limit
    skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="skills"]:checked').length;
            skillCountDisplay.textContent = checkedCount;
            
            if (checkedCount >= 5) {
                skillCheckboxes.forEach(cb => { if (!cb.checked) cb.disabled = true; });
            } else {
                skillCheckboxes.forEach(cb => { cb.disabled = false; });
            }
        });
    });

    // 2. Image Preview
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    previewImage.src = event.target.result;
                    previewImage.style.display = 'block';
                    previewPlaceholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. Navigation Logic
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            goToStep(currentStep + 1);
        }
    });

    prevBtn.addEventListener('click', () => {
        goToStep(currentStep - 1);
    });

    // 4. Validation
    function validateStep(step) {
        const formData = new FormData(form);
        
        if (step === 1) {
            const platform = formData.get('platform');
            const niche = formData.get('niche');
            if (!platform || !niche) {
                showError('Please select both a platform and a niche');
                return false;
            }
        }
        if (step === 2) {
            const skills = formData.getAll('skills');
            if (skills.length === 0) {
                showError('Please select at least one skill');
                return false;
            }
        }
        return true;
    }

    // 5. Transition Function
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;

        // Update Visibility
        document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

        // Update Progress UI
        document.querySelectorAll('.step').forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            el.classList.toggle('active', stepNum === step);
            el.classList.toggle('completed', stepNum < step);
        });

        currentStep = step;

        // Progress Bar Fill
        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';

        // Button Toggles
        prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
        nextBtn.style.display = currentStep === totalSteps ? 'none' : 'flex';
        submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
    }

    function showError(msg) {
        alert(msg); // Replace with your custom errorDiv logic if preferred
    }

    // 6. Final Submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.skills = formData.getAll('skills');
        
        // Save profile image if uploaded
        const imageFile = profileImageInput.files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                data.profileImageData = event.target.result;
                console.log('Saving Data with Profile Image:', data);
                localStorage.setItem('creatorProfile', JSON.stringify(data));
                window.location.href = 'mission.html';
            };
            reader.readAsDataURL(imageFile);
        } else {
            console.log('Saving Data:', data);
            localStorage.setItem('creatorProfile', JSON.stringify(data));
            window.location.href = 'mission.html';
        }
    });
});