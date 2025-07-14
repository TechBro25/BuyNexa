// Returns page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const returnForm = document.getElementById('returnForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('returnImages');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    const detailsTextarea = document.getElementById('returnDetails');
    const detailsCharCount = document.getElementById('detailsCharCount');
    
    let uploadedFiles = [];
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Character counter for return details
    if (detailsTextarea && detailsCharCount) {
        detailsTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 500;
            
            detailsCharCount.textContent = currentLength;
            
            if (currentLength > maxLength * 0.9) {
                detailsCharCount.style.color = 'var(--error-color)';
            } else if (currentLength > maxLength * 0.8) {
                detailsCharCount.style.color = 'var(--warning-color)';
            } else {
                detailsCharCount.style.color = 'var(--text-light)';
            }
            
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                detailsCharCount.textContent = maxLength;
            }
        });
    }
    
    // File upload functionality
    if (fileUploadArea && fileInput) {
        // Drag and drop events
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFileSelection(files);
        });
        
        // File input change
        fileInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            handleFileSelection(files);
        });
    }
    
    function handleFileSelection(files) {
        files.forEach(file => {
            if (uploadedFiles.length >= maxFiles) {
                alert(`Maximum ${maxFiles} files allowed.`);
                return;
            }
            
            if (file.size > maxFileSize) {
                alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                alert(`File "${file.name}" is not an image.`);
                return;
            }
            
            uploadedFiles.push(file);
            displayUploadedFile(file);
        });
        
        // Clear the input
        fileInput.value = '';
    }
    
    function displayUploadedFile(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            fileElement.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <div class="file-name">${file.name}</div>
                <button type="button" class="remove-file" onclick="removeFile('${file.name}')">×</button>
            `;
        };
        reader.readAsDataURL(file);
        
        uploadedFilesContainer.appendChild(fileElement);
    }
    
    // Remove file function (global scope for onclick)
    window.removeFile = function(fileName) {
        uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
        
        // Remove from display
        const fileElements = uploadedFilesContainer.querySelectorAll('.uploaded-file');
        fileElements.forEach(element => {
            const fileNameElement = element.querySelector('.file-name');
            if (fileNameElement && fileNameElement.textContent === fileName) {
                element.remove();
            }
        });
    };
    
    // Form submission
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitFormWithLoading(this, function() {
                    // Collect form data
                    const formData = new FormData(returnForm);
                    const returnData = {
                        orderId: formData.get('orderId'),
                        orderEmail: formData.get('orderEmail'),
                        productName: formData.get('productName'),
                        quantity: formData.get('quantity'),
                        returnType: formData.get('returnType'),
                        returnReason: formData.get('returnReason'),
                        returnDetails: formData.get('returnDetails'),
                        contactName: formData.get('contactName'),
                        contactPhone: formData.get('contactPhone'),
                        uploadedFiles: uploadedFiles.map(file => file.name)
                    };
                    
                    // Generate return ID
                    const returnId = '#RET-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    document.getElementById('returnId').textContent = returnId;
                    
                    // Store in localStorage for demo purposes
                    localStorage.setItem('returnRequest', JSON.stringify({
                        ...returnData,
                        returnId: returnId,
                        timestamp: new Date().toISOString(),
                        status: 'pending'
                    }));
                    
                    // Show success modal
                    showModal('successModal');
                    
                    // Reset form and files
                    returnForm.reset();
                    uploadedFiles = [];
                    uploadedFilesContainer.innerHTML = '';
                    if (detailsCharCount) {
                        detailsCharCount.textContent = '0';
                        detailsCharCount.style.color = 'var(--text-light)';
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
    
    // Return type change handling
    const returnTypeSelect = document.getElementById('returnType');
    if (returnTypeSelect) {
        returnTypeSelect.addEventListener('change', function() {
            const returnReason = document.getElementById('returnReason');
            
            // Show relevant return reasons based on type
            if (returnReason) {
                const allOptions = returnReason.querySelectorAll('option');
                allOptions.forEach(option => {
                    option.style.display = 'block';
                });
                
                // Hide less relevant options for certain return types
                if (this.value === 'exchange') {
                    // For exchanges, hide "changed mind" type reasons
                    const changeMindOption = returnReason.querySelector('option[value="changed-mind"]');
                    if (changeMindOption) {
                        changeMindOption.style.display = 'none';
                    }
                }
            }
        });
    }
    
    // Order ID validation
    const orderIdInput = document.getElementById('orderId');
    if (orderIdInput) {
        orderIdInput.addEventListener('input', function() {
            // Auto-format order ID
            let value = this.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
            if (value.length > 3 && !value.startsWith('ORD-')) {
                value = 'ORD-' + value;
            }
            this.value = value;
        });
        
        orderIdInput.addEventListener('blur', function() {
            // Validate order ID format
            const orderIdPattern = /^ORD-[A-Z0-9]{6,}$/;
            if (this.value && !orderIdPattern.test(this.value)) {
                const errorElement = this.parentNode.querySelector('.error-message');
                showError(this, errorElement, 'Order ID should be in format: ORD-XXXXXX');
            } else {
                const errorElement = this.parentNode.querySelector('.error-message');
                clearError(this, errorElement);
            }
        });
    }
    
    // Policy card hover effects
    document.querySelectorAll('.policy-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth scroll to return form
    const returnRequestButton = document.createElement('button');
    returnRequestButton.innerHTML = '<i class="fas fa-arrow-down"></i> Request Return';
    returnRequestButton.className = 'btn-primary';
    returnRequestButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50px;
        padding: 15px 25px;
        box-shadow: var(--shadow-lg);
    `;
    
    returnRequestButton.addEventListener('click', function() {
        document.querySelector('.return-form-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(returnRequestButton);
    
    // Hide button when in form section
    window.addEventListener('scroll', function() {
        const formSection = document.querySelector('.return-form-section');
        const rect = formSection.getBoundingClientRect();
        
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            returnRequestButton.style.opacity = '0';
            returnRequestButton.style.pointerEvents = 'none';
        } else {
            returnRequestButton.style.opacity = '1';
            returnRequestButton.style.pointerEvents = 'auto';
        }
    });
    
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
        }// Returns page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    const returnForm = document.getElementById('returnForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('returnImages');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    const detailsTextarea = document.getElementById('returnDetails');
    const detailsCharCount = document.getElementById('detailsCharCount');
    
    let uploadedFiles = [];
    const maxFiles = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    // Character counter for return details
    if (detailsTextarea && detailsCharCount) {
        detailsTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 500;
            
            detailsCharCount.textContent = currentLength;
            
            if (currentLength > maxLength * 0.9) {
                detailsCharCount.style.color = 'var(--error-color)';
            } else if (currentLength > maxLength * 0.8) {
                detailsCharCount.style.color = 'var(--warning-color)';
            } else {
                detailsCharCount.style.color = 'var(--text-light)';
            }
            
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                detailsCharCount.textContent = maxLength;
            }
        });
    }
    
    // File upload functionality
    if (fileUploadArea && fileInput) {
        // Drag and drop events
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files);
            handleFileSelection(files);
        });
        
        // File input change
        fileInput.addEventListener('change', function() {
            const files = Array.from(this.files);
            handleFileSelection(files);
        });
    }
    
    function handleFileSelection(files) {
        files.forEach(file => {
            if (uploadedFiles.length >= maxFiles) {
                alert(`Maximum ${maxFiles} files allowed.`);
                return;
            }
            
            if (file.size > maxFileSize) {
                alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                alert(`File "${file.name}" is not an image.`);
                return;
            }
            
            uploadedFiles.push(file);
            displayUploadedFile(file);
        });
        
        // Clear the input
        fileInput.value = '';
    }
    
    function displayUploadedFile(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        
        // Create image preview
        const reader = new FileReader();
        reader.onload = function(e) {
            fileElement.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <div class="file-name">${file.name}</div>
                <button type="button" class="remove-file" onclick="removeFile('${file.name}')">×</button>
            `;
        };
        reader.readAsDataURL(file);
        
        uploadedFilesContainer.appendChild(fileElement);
    }
    
    // Remove file function (global scope for onclick)
    window.removeFile = function(fileName) {
        uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
        
        // Remove from display
        const fileElements = uploadedFilesContainer.querySelectorAll('.uploaded-file');
        fileElements.forEach(element => {
            const fileNameElement = element.querySelector('.file-name');
            if (fileNameElement && fileNameElement.textContent === fileName) {
                element.remove();
            }
        });
    };
    
    // Form submission
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitFormWithLoading(this, function() {
                    // Collect form data
                    const formData = new FormData(returnForm);
                    const returnData = {
                        orderId: formData.get('orderId'),
                        orderEmail: formData.get('orderEmail'),
                        productName: formData.get('productName'),
                        quantity: formData.get('quantity'),
                        returnType: formData.get('returnType'),
                        returnReason: formData.get('returnReason'),
                        returnDetails: formData.get('returnDetails'),
                        contactName: formData.get('contactName'),
                        contactPhone: formData.get('contactPhone'),
                        uploadedFiles: uploadedFiles.map(file => file.name)
                    };
                    
                    // Generate return ID
                    const returnId = '#RET-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                    document.getElementById('returnId').textContent = returnId;
                    
                    // Store in localStorage for demo purposes
                    localStorage.setItem('returnRequest', JSON.stringify({
                        ...returnData,
                        returnId: returnId,
                        timestamp: new Date().toISOString(),
                        status: 'pending'
                    }));
                    
                    // Show success modal
                    showModal('successModal');
                    
                    // Reset form and files
                    returnForm.reset();
                    uploadedFiles = [];
                    uploadedFilesContainer.innerHTML = '';
                    if (detailsCharCount) {
                        detailsCharCount.textContent = '0';
                        detailsCharCount.style.color = 'var(--text-light)';
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
    
    // Return type change handling
    const returnTypeSelect = document.getElementById('returnType');
    if (returnTypeSelect) {
        returnTypeSelect.addEventListener('change', function() {
            const returnReason = document.getElementById('returnReason');
            
            // Show relevant return reasons based on type
            if (returnReason) {
                const allOptions = returnReason.querySelectorAll('option');
                allOptions.forEach(option => {
                    option.style.display = 'block';
                });
                
                // Hide less relevant options for certain return types
                if (this.value === 'exchange') {
                    // For exchanges, hide "changed mind" type reasons
                    const changeMindOption = returnReason.querySelector('option[value="changed-mind"]');
                    if (changeMindOption) {
                        changeMindOption.style.display = 'none';
                    }
                }
            }
        });
    }
    
    // Order ID validation
    const orderIdInput = document.getElementById('orderId');
    if (orderIdInput) {
        orderIdInput.addEventListener('input', function() {
            // Auto-format order ID
            let value = this.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '');
            if (value.length > 3 && !value.startsWith('ORD-')) {
                value = 'ORD-' + value;
            }
            this.value = value;
        });
        
        orderIdInput.addEventListener('blur', function() {
            // Validate order ID format
            const orderIdPattern = /^ORD-[A-Z0-9]{6,}$/;
            if (this.value && !orderIdPattern.test(this.value)) {
                const errorElement = this.parentNode.querySelector('.error-message');
                showError(this, errorElement, 'Order ID should be in format: ORD-XXXXXX');
            } else {
                const errorElement = this.parentNode.querySelector('.error-message');
                clearError(this, errorElement);
            }
        });
    }
    
    // Policy card hover effects
    document.querySelectorAll('.policy-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth scroll to return form
    const returnRequestButton = document.createElement('button');
    returnRequestButton.innerHTML = '<i class="fas fa-arrow-down"></i> Request Return';
    returnRequestButton.className = 'btn-primary';
    returnRequestButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50px;
        padding: 15px 25px;
        box-shadow: var(--shadow-lg);
    `;
    
    returnRequestButton.addEventListener('click', function() {
        document.querySelector('.return-form-section').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(returnRequestButton);
    
    // Hide button when in form section
    window.addEventListener('scroll', function() {
        const formSection = document.querySelector('.return-form-section');
        const rect = formSection.getBoundingClientRect();
        
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            returnRequestButton.style.opacity = '0';
            returnRequestButton.style.pointerEvents = 'none';
        } else {
            returnRequestButton.style.opacity = '1';
            returnRequestButton.style.pointerEvents = 'auto';
        }
    });
    
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