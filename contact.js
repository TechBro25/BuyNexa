// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCountElement = document.getElementById('charCount');
    
    // Character counter for message field
    if (messageTextarea && charCountElement) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 1000;
            
            charCountElement.textContent = currentLength;
            
            // Change color based on character count
            if (currentLength > maxLength * 0.9) {
                charCountElement.style.color = 'var(--error-color)';
            } else if (currentLength > maxLength * 0.8) {
                charCountElement.style.color = 'var(--warning-color)';
            } else {
                charCountElement.style.color = 'var(--text-light)';
            }
            
            // Prevent exceeding max length
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCountElement.textContent = maxLength;
            }
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitFormWithLoading(this, function() {
                    // Collect form data
                    const formData = new FormData(contactForm);
                    const contactData = {
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        email: formData.get('email'),
                        subject: formData.get('subject'),
                        message: formData.get('message'),
                        newsletter: formData.get('newsletter') === 'on'
                    };
                    
                    // Generate random ticket ID
                    const ticketId = '#' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    document.getElementById('ticketId').textContent = ticketId;
                    
                    // Store in localStorage for demo purposes
                    localStorage.setItem('contactSubmission', JSON.stringify({
                        ...contactData,
                        ticketId: ticketId,
                        timestamp: new Date().toISOString()
                    }));
                    
                    // Show success modal
                    showModal('successModal');
                    
                    // Reset form
                    contactForm.reset();
                    if (charCountElement) {
                        charCountElement.textContent = '0';
                        charCountElement.style.color = 'var(--text-light)';
                    }
                });
            }
        });
    }
    
    // Close modal button
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideModal('successModal');
        });
    }
    
    // Subject change handling
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const messageField = document.getElementById('message');
            if (messageField && messageField.value === '') {
                // Pre-fill message based on subject
                const templates = {
                    'order': 'Hello, I have a question about my order...',
                    'shipping': 'Hello, I need help with shipping information...',
                    'return': 'Hello, I would like to return or exchange an item...',
                    'product': 'Hello, I have a question about a product...',
                    'billing': 'Hello, I have a billing question...',
                    'technical': 'Hello, I\'m experiencing a technical issue...'
                };
                
                if (templates[this.value]) {
                    messageField.value = templates[this.value];
                    messageField.focus();
                    messageField.setSelectionRange(messageField.value.length, messageField.value.length);
                    
                    // Update character count
                    if (charCountElement) {
                        charCountElement.textContent = messageField.value.length;
                    }
                }
            }
        });
    }
    
    // Live chat simulation
    const liveChatTrigger = document.querySelector('.contact-method:last-child');
    if (liveChatTrigger) {
        liveChatTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            showLiveChatModal();
        });
    }
    
    function showLiveChatModal() {
        // Create live chat modal
        const chatModal = document.createElement('div');
        chatModal.className = 'modal';
        chatModal.id = 'liveChatModal';
        chatModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-comments"></i> Live Chat</h2>
                </div>
                <div class="modal-body">
                    <div style="background: var(--secondary-color); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <p><strong>Support Agent:</strong> Hello! How can I help you today?</p>
                    </div>
                    <p style="color: var(--text-secondary); font-style: italic;">
                        This is a demo. In a real application, this would connect you to a live support agent.
                    </p>
                </div>
                <div class="modal-footer">
                    <button onclick="hideModal('liveChatModal')" class="btn-primary">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatModal);
        showModal('liveChatModal');
        
        // Remove modal after closing
        setTimeout(() => {
            const modalToRemove = document.getElementById('liveChatModal');
            if (modalToRemove) {
                modalToRemove.addEventListener('transitionend', function() {
                    document.body.removeChild(modalToRemove);
                });
            }
        }, 100);
    }
    
    // Social media link tracking (demo)
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.className.split(' ').find(cls => 
                ['facebook', 'twitter', 'instagram', 'linkedin'].includes(cls)
            );
            
            // Show a demo message
            alert(`Demo: This would open our ${platform} page.`);
        });
    });
    
    // Enhanced form validation for contact form
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                showError(this, this.parentNode.querySelector('.error-message'), 
                    'Please enter a valid email address');
            } else {
                clearError(this, this.parentNode.querySelector('.error-message'));
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function clearError(field, errorElement) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
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