// ===== Contact Page Functionality =====
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const consultationForm = document.getElementById('legalConsultationForm');
    const successMessage = document.getElementById('successMessage');
    const newRequestBtn = document.getElementById('newRequest');
    const phoneInput = document.getElementById('phone');
    
    // Form validation and submission
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateConsultationForm()) {
                // Show loading state
                const submitBtn = consultationForm.querySelector('button[type="submit"]');
                const originalContent = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Simulate form submission (in real implementation, this would be an AJAX call)
                setTimeout(() => {
                    // Hide form, show success message
                    consultationForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Send form data (in real implementation)
                    const formData = new FormData(consultationForm);
                    const formObject = Object.fromEntries(formData);
                    console.log('Form submitted:', formObject);
                    
                    // You would typically send this to your backend here
                    // sendFormData(formObject);
                    
                    // Reset button
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    
                    // Track form submission
                    trackFormSubmission(formObject);
                }, 1500);
            }
        });
    }
    
    // New request button
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', function() {
            successMessage.style.display = 'none';
            consultationForm.style.display = 'block';
            consultationForm.reset();
            
            // Scroll to form
            consultationForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Phone number formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            formatPhoneNumber(this);
        });
        
        phoneInput.addEventListener('blur', function(e) {
            validatePhoneNumber(this);
        });
    }
    
    // Urgency level styling
    const urgencySelect = document.getElementById('urgency');
    if (urgencySelect) {
        urgencySelect.addEventListener('change', function() {
            updateUrgencyStyling(this);
        });
        
        // Initial styling
        updateUrgencyStyling(urgencySelect);
    }
    
    // Legal issue selection effects
    const legalIssueSelect = document.getElementById('legalIssue');
    if (legalIssueSelect) {
        legalIssueSelect.addEventListener('change', function() {
            updateLegalIssueEffects(this);
        });
    }
    
    // Contact method selection effects
    const contactMethodRadios = document.querySelectorAll('input[name="contactMethod"]');
    contactMethodRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateContactMethodEffects(this.value);
        });
    });
    
    // FAQ accordion enhancements
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add animation to accordion items
            const accordionItem = this.closest('.accordion-item');
            accordionItem.classList.add('active');
            
            // Close other items after delay
            setTimeout(() => {
                document.querySelectorAll('.accordion-item').forEach(item => {
                    if (item !== accordionItem && item.classList.contains('active')) {
                        item.classList.remove('active');
                    }
                });
            }, 300);
        });
    });
    
    // Emergency phone click tracking
    const emergencyLinks = document.querySelectorAll('.emergency-phone, .phone-link.emergency');
    emergencyLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEmergencyCall(this.href);
        });
    });
    
    // Social media link tracking
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList[1]; // linkedin, twitter, etc.
            trackSocialClick(platform, this.href);
            
            // In real implementation, you would allow the link to proceed
            // For demo, we'll just log it
            console.log(`Social media click: ${platform}`);
            
            // Show a message that this would redirect in real site
            showNotification(`In a real website, this would link to our ${platform} page.`, 'info');
        });
    });
    
    // Quick contact bar scroll effect
    window.addEventListener('scroll', function() {
        const quickContactBar = document.querySelector('.quick-contact-bar');
        if (quickContactBar) {
            if (window.scrollY > 100) {
                quickContactBar.style.position = 'fixed';
                quickContactBar.style.top = '0';
                quickContactBar.style.left = '0';
                quickContactBar.style.right = '0';
                quickContactBar.style.zIndex = '1000';
                quickContactBar.style.borderRadius = '0';
                quickContactBar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            } else {
                quickContactBar.style.position = 'relative';
                quickContactBar.style.borderRadius = '10px 10px 0 0';
                quickContactBar.style.boxShadow = '0 10px 30px rgba(139, 0, 0, 0.2)';
            }
        }
    });
    
    // Form validation functions
    function validateConsultationForm() {
        let isValid = true;
        const requiredFields = consultationForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                markFieldInvalid(field);
                isValid = false;
            } else {
                markFieldValid(field);
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            markFieldInvalid(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone number
        if (phoneInput.value && !isValidPhoneNumber(phoneInput.value)) {
            markFieldInvalid(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }
    
    function markFieldInvalid(field, message = 'This field is required') {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function markFieldValid(field) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        
        // Remove error message if exists
        const existingError = field.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhoneNumber(phone) {
        // Nigerian phone number validation (allowing various formats)
        const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
        const cleanedPhone = phone.replace(/\D/g, '');
        return phoneRegex.test(cleanedPhone);
    }
    
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.startsWith('0')) {
            value = '+234' + value.substring(1);
        } else if (value.startsWith('234')) {
            value = '+' + value;
        } else if (value.length > 0 && !value.startsWith('+')) {
            value = '+234' + value;
        }
        
        // Format with spaces for readability
        if (value.length > 4) {
            value = value.replace(/(\+\d{3})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
        }
        
        input.value = value;
    }
    
    function validatePhoneNumber(input) {
        const value = input.value.replace(/\D/g, '');
        
        if (value.length < 10) {
            markFieldInvalid(input, 'Please enter a valid phone number');
            return false;
        }
        
        markFieldValid(input);
        return true;
    }
    
    function updateUrgencyStyling(select) {
        const value = select.value;
        select.className = 'form-control'; // Reset classes
        
        if (value === 'urgent') {
            select.classList.add('urgency-urgent');
        } else if (value === 'emergency') {
            select.classList.add('urgency-emergency');
        }
    }
    
    function updateLegalIssueEffects(select) {
        const formSections = document.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.transition = 'all 0.3s ease';
        });
        
        // You could add specific effects based on legal issue
        const selectedValue = select.value;
        console.log(`Legal issue selected: ${selectedValue}`);
    }
    
    function updateContactMethodEffects(method) {
        const contactOptions = document.querySelectorAll('.form-check');
        contactOptions.forEach(option => {
            option.classList.remove('selected-method');
        });
        
        const selectedOption = document.querySelector(`input[value="${method}"]`).closest('.form-check');
        if (selectedOption) {
            selectedOption.classList.add('selected-method');
        }
    }
    
    function trackFormSubmission(formData) {
        // In real implementation, send to analytics
        console.log('Form tracked:', {
            event: 'consultation_request',
            data: {
                legal_issue: formData.legalIssue,
                urgency: formData.urgency,
                contact_method: formData.contactMethod,
                timestamp: new Date().toISOString()
            }
        });
        
        // Show success notification
        showNotification('Your consultation request has been submitted successfully!', 'success');
    }
    
    function trackEmergencyCall(phoneNumber) {
        console.log('Emergency call tracked:', phoneNumber);
        // In real implementation, send to analytics
    }
    
    function trackSocialClick(platform, url) {
        console.log(`Social media click tracked: ${platform}`, url);
        // In real implementation, send to analytics
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 30px;
                    right: 30px;
                    background-color: white;
                    color: #333;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 9999;
                    transform: translateX(150%);
                    transition: transform 0.5s ease;
                    border-left: 4px solid #8B0000;
                }
                .notification-success {
                    border-left-color: #28a745;
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }
                .notification-content i {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }
                .notification-success .notification-content i {
                    color: #28a745;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    margin-left: 15px;
                    font-size: 1rem;
                    transition: color 0.3s ease;
                }
                .notification-close:hover {
                    color: #333;
                }
                .notification.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode && notification.classList.contains('show')) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
    }
    
    // Add CSS for urgency levels
    const urgencyStyles = document.createElement('style');
    urgencyStyles.textContent = `
        .urgency-urgent {
            border-color: #ffc107 !important;
            background-color: rgba(255, 193, 7, 0.05) !important;
        }
        .urgency-emergency {
            border-color: #dc3545 !important;
            background-color: rgba(220, 53, 69, 0.05) !important;
            color: #dc3545 !important;
            font-weight: 600;
        }
        .selected-method {
            border-color: #8B0000 !important;
            background-color: rgba(139, 0, 0, 0.05) !important;
        }
        .is-invalid {
            border-color: #dc3545 !important;
        }
        .is-valid {
            border-color: #28a745 !important;
        }
        .invalid-feedback {
            display: block;
            width: 100%;
            margin-top: 0.25rem;
            font-size: 0.875em;
            color: #dc3545;
        }
        .accordion-item.active {
            box-shadow: 0 5px 15px rgba(139, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(urgencyStyles);
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Utility functions for form submission
function sendFormData(formData) {
    // This would be your actual form submission logic
    // Example using fetch API:
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateConsultationForm: function() {
            // Form validation logic
        },
        formatPhoneNumber: function(input) {
            // Phone formatting logic
        }
    };
}