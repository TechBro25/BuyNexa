// Shipping page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const shippingForm = document.getElementById('shippingForm');
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitFormWithLoading(this, function() {
                    // Collect form data
                    const formData = new FormData(shippingForm);
                    const shippingData = {
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        phone: formData.get('phone'),
                        address: formData.get('address'),
                        address2: formData.get('address2'),
                        city: formData.get('city'),
                        state: formData.get('state'),
                        postalCode: formData.get('postalCode'),
                        shipping: formData.get('shipping')
                    };
                    
                    // Store in localStorage for demo purposes
                    localStorage.setItem('shippingInfo', JSON.stringify(shippingData));
                    
                    // Show success modal
                    showModal('successModal');
                    
                    // Auto-redirect after 3 seconds
                    setTimeout(() => {
                        hideModal('successModal');
                        // In a real app, this would redirect to payment page
                        alert('Redirecting to payment page...');
                    }, 3000);
                });
            }
        });
    }
    
    // Shipping option selection effects
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            // Add visual feedback when shipping option changes
            const label = this.nextElementSibling;
            if (label) {
                // Animate the selection
                label.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    label.style.transform = 'scale(1)';
                }, 200);
            }
            
            // Update estimated delivery based on selection
            updateEstimatedDelivery(this.value);
        });
    });
    
    function updateEstimatedDelivery(shippingType) {
        const today = new Date();
        let deliveryDate;
        
        switch(shippingType) {
            case 'standard':
                deliveryDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
                break;
            case 'express':
                deliveryDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
                break;
            case 'overnight':
                deliveryDate = new Date(today.getTime() + (1 * 24 * 60 * 60 * 1000));
                break;
            default:
                deliveryDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
        }
        
        // Show estimated delivery in a subtle notification
        showDeliveryEstimate(deliveryDate);
    }
    
    function showDeliveryEstimate(date) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        // Create or update delivery estimate element
        let estimateElement = document.getElementById('deliveryEstimate');
        if (!estimateElement) {
            estimateElement = document.createElement('div');
            estimateElement.id = 'deliveryEstimate';
            estimateElement.style.cssText = `
                position: fixed;
                top: 90px;
                right: 20px;
                background: var(--accent-color);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                font-size: 0.9rem;
                font-weight: 500;
                z-index: 1000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(estimateElement);
        }
        
        estimateElement.innerHTML = `<i class="fas fa-calendar-check"></i> Estimated delivery: ${formattedDate}`;
        
        // Slide in
        setTimeout(() => {
            estimateElement.style.transform = 'translateX(0)';
        }, 100);
        
        // Slide out after 4 seconds
        setTimeout(() => {
            estimateElement.style.transform = 'translateX(100%)';
        }, 4000);
    }
    
    // Auto-fill state based on postal code (simplified demo)
    const postalCodeInput = document.getElementById('postalCode');
    const stateSelect = document.getElementById('state');
    
    if (postalCodeInput && stateSelect) {
        postalCodeInput.addEventListener('blur', function() {
            const zip = this.value.substring(0, 5);
            const stateGuess = guessStateFromZip(zip);
            if (stateGuess && stateSelect.value === '') {
                stateSelect.value = stateGuess;
                // Add visual feedback
                stateSelect.style.background = 'rgba(16, 185, 129, 0.1)';
                setTimeout(() => {
                    stateSelect.style.background = '';
                }, 1000);
            }
        });
    }
    
    function guessStateFromZip(zip) {
        // Simplified state guessing based on ZIP code ranges
        const zipRanges = {
            'CA': [90000, 96699],
            'NY': [10000, 14999],
            'TX': [75000, 79999],
            'FL': [32000, 34999],
            'AL': [35000, 36999]
        };
        
        const zipNum = parseInt(zip);
        for (const [state, range] of Object.entries(zipRanges)) {
            if (zipNum >= range[0] && zipNum <= range[1]) {
                return state;
            }
        }
        return null;
    }
    
    // Progress bar animation
    function animateProgressStep(stepNumber) {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            if (index < stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Initialize with step 1 active
    animateProgressStep(1);
});
// Simple No-Zoom JavaScript - Add this to your existing JS

// Prevent zoom with keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Prevent Ctrl + Plus/Minus (zoom in/out)
    if (e.ctrlKey && (e.keyCode === 107 || e.keyCode === 187 || e.keyCode === 109 || e.keyCode === 189)) {
        e.preventDefault();
        return false;
    }
    
    // Prevent Ctrl + 0 (reset zoom)
    if (e.ctrlKey && e.keyCode === 48) {
        e.preventDefault();
        return false;
    }
});

// Prevent zoom with mouse wheel + Ctrl
document.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        return false;
    }
}, { passive: false });

// Prevent pinch zoom on mobile devices
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });