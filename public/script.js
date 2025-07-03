
document.addEventListener('DOMContentLoaded', function() {
    var form = document.querySelector('form');
    var errorMsg = document.getElementById('form-error');
    
    function showError(input, message) {
        var field = input.parentElement;
        field.classList.add('error');
        field.querySelector('.error-message').textContent = message;
    }
    
    function clearError(input) {
        var field = input.parentElement;
        field.classList.remove('error');
        field.querySelector('.error-message').textContent = '';
    }
    
    function showSuccess(message) {
        errorMsg.textContent = message;
        errorMsg.style.color = 'green';
        form.reset();
        
        setTimeout(function() {
            errorMsg.textContent = '';
        }, 3000);
    }
    
    function showFormError(message) {
        errorMsg.textContent = message;
        errorMsg.style.color = 'red';
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var isValid = true;
        
        var firstName = document.getElementById('first-name');
        var lastName = document.getElementById('last-name');
        var email = document.getElementById('email');
        var message = document.getElementById('message');
        
        
        [firstName, lastName, email, message].forEach(clearError);
        
        
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required');
            isValid = false;
        } else if (firstName.value.length < 2) {
            showError(firstName, 'Must be at least 2 characters');
            isValid = false;
        }
        
        
        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required');
            isValid = false;
        } else if (lastName.value.length < 2) {
            showError(lastName, 'Must be at least 2 characters');
            isValid = false;
        }
        
        
        if (email.value.trim() === '') {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!email.value.includes('@') || !email.value.includes('.')) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        
        if (message.value.trim() === '') {
            showError(message, 'Message is required');
            isValid = false;
        } else if (message.value.length < 10) {
            showError(message, 'Message too short (min 10 chars)');
            isValid = false;
        }
        
        
        if (isValid) {
            
            const formData = new FormData(form);
            
            
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccess(data.message || 'Thank you! Your message has been sent.');
                } else {
                    showFormError(data.message || 'Something went wrong. Please try again.');
                }
                console.log('Server response:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
                showFormError('Failed to send message. Please try again.');
            });
        } else {
            showFormError('Please fix the errors below.');
        }
    });
});