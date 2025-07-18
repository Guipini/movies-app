document.addEventListener("DOMContentLoaded", () => {
  // Initialize all form validations and interactions
  initializeDeleteConfirmations();
  initializeRegistrationValidation();
  initializeLoginValidation();
  initializeMovieFormValidation();
  initializeFlashMessages();
});

// Enhanced delete confirmations with modal
function initializeDeleteConfirmations() {
  const deleteButtons = document.querySelectorAll('.delete-movie-btn');
  const modal = document.getElementById('deleteModal');
  const modalMessage = modal?.querySelector('.modal-message');
  const movieNameSpan = modal?.querySelector('.movie-name');
  const cancelBtn = modal?.querySelector('.btn-cancel');
  const confirmBtn = modal?.querySelector('.btn-confirm-delete');
  const closeBtn = modal?.querySelector('.modal-close');
  const backdrop = modal?.querySelector('.modal-backdrop');
  
  let currentForm = null;

  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      const movieName = button.dataset.movieName;
      const form = button.closest('form');
      
      if (modal && movieName && form) {
        currentForm = form;
        
        // Update modal content
        if (modalMessage) {
          modalMessage.textContent = 'Are you sure you want to permanently delete this movie?';
        }
        if (movieNameSpan) {
          movieNameSpan.textContent = movieName;
        }
        
        // Show modal
        showDeleteModal();
      }
    });
  });

  // Modal event handlers
  if (cancelBtn) {
    cancelBtn.addEventListener('click', hideDeleteModal);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', hideDeleteModal);
  }
  
  if (backdrop) {
    backdrop.addEventListener('click', hideDeleteModal);
  }
  
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (currentForm) {
        currentForm.submit();
      }
      hideDeleteModal();
    });
  }
  
  // ESC key to close modal
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.classList.contains('modal-hidden')) {
      hideDeleteModal();
    }
  });

  function showDeleteModal() {
    if (modal) {
      modal.classList.remove('modal-hidden');
      modal.classList.add('modal-show');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function hideDeleteModal() {
    if (modal) {
      modal.classList.add('modal-hidden');
      modal.classList.remove('modal-show');
      document.body.style.overflow = ''; // Restore scrolling
      currentForm = null;
    }
  }
}

// Registration form validation
function initializeRegistrationValidation() {
  const registrationForm = document.querySelector('form[action="/auth/register"]');
  if (!registrationForm) return;

  const usernameField = registrationForm.querySelector('#username');
  const emailField = registrationForm.querySelector('#email');
  const passwordField = registrationForm.querySelector('#password');
  const confirmPasswordField = registrationForm.querySelector('#confirmPassword');

  // Real-time validation
  if (usernameField) {
    usernameField.addEventListener('input', () => validateUsername(usernameField));
    usernameField.addEventListener('blur', () => validateUsername(usernameField));
  }

  if (emailField) {
    emailField.addEventListener('input', () => validateEmail(emailField));
    emailField.addEventListener('blur', () => validateEmail(emailField));
  }

  if (passwordField) {
    passwordField.addEventListener('input', () => {
      validatePassword(passwordField);
      if (confirmPasswordField && confirmPasswordField.value) {
        validatePasswordMatch(passwordField, confirmPasswordField);
      }
    });
  }

  if (confirmPasswordField) {
    confirmPasswordField.addEventListener('input', () => 
      validatePasswordMatch(passwordField, confirmPasswordField)
    );
  }

  // Form submission validation
  registrationForm.addEventListener('submit', (event) => {
    let isValid = true;

    if (usernameField && !validateUsername(usernameField)) isValid = false;
    if (emailField && !validateEmail(emailField)) isValid = false;
    if (passwordField && !validatePassword(passwordField)) isValid = false;
    if (confirmPasswordField && !validatePasswordMatch(passwordField, confirmPasswordField)) isValid = false;

    if (!isValid) {
      event.preventDefault();
      showAlert('Please fix the validation errors before submitting.', 'error');
    }
  });
}

// Login form validation
function initializeLoginValidation() {
  const loginForm = document.querySelector('form[action="/auth/login"]');
  if (!loginForm) return;

  const usernameField = loginForm.querySelector('#username');
  const passwordField = loginForm.querySelector('#password');

  loginForm.addEventListener('submit', (event) => {
    let isValid = true;

    if (!usernameField || usernameField.value.trim() === '') {
      showFieldError(usernameField, 'Username or email is required');
      isValid = false;
    } else {
      clearFieldError(usernameField);
    }

    if (!passwordField || passwordField.value === '') {
      showFieldError(passwordField, 'Password is required');
      isValid = false;
    } else {
      clearFieldError(passwordField);
    }

    if (!isValid) {
      event.preventDefault();
      showAlert('Please fill in all required fields.', 'error');
    }
  });
}

// Movie form validation
function initializeMovieFormValidation() {
  const movieForms = document.querySelectorAll('form[action*="/movies"]');
  
  movieForms.forEach(form => {
    const nameField = form.querySelector('#name');
    const descriptionField = form.querySelector('#description');
    const yearField = form.querySelector('#year');
    const ratingField = form.querySelector('#rating');
    const genreCheckboxes = form.querySelectorAll('input[name="genres"]');

    // Real-time validation
    if (nameField) {
      nameField.addEventListener('input', () => validateMovieName(nameField));
    }

    if (descriptionField) {
      descriptionField.addEventListener('input', () => validateMovieDescription(descriptionField));
    }

    if (yearField) {
      yearField.addEventListener('input', () => validateMovieYear(yearField));
    }

    if (ratingField) {
      ratingField.addEventListener('input', () => validateMovieRating(ratingField));
    }

    // Genre selection enhancement
    if (genreCheckboxes.length > 0) {
      initializeGenreSelection(genreCheckboxes);
    }

    // Form submission validation
    form.addEventListener('submit', (event) => {
      let isValid = true;

      if (nameField && !validateMovieName(nameField)) isValid = false;
      if (descriptionField && !validateMovieDescription(descriptionField)) isValid = false;
      if (yearField && !validateMovieYear(yearField)) isValid = false;
      if (ratingField && !validateMovieRating(ratingField)) isValid = false;

      if (!isValid) {
        event.preventDefault();
        showAlert('Please fix the validation errors before submitting.', 'error');
      }
    });
  });
}

// Validation functions
function validateUsername(field) {
  const value = field.value.trim();
  const isValid = value.length >= 3 && value.length <= 20 && /^[a-zA-Z0-9]+$/.test(value);
  
  if (!isValid) {
    showFieldError(field, 'Username must be 3-20 characters and contain only letters and numbers');
  } else {
    clearFieldError(field);
    field.classList.add('valid');
  }
  
  return isValid;
}

function validateEmail(field) {
  const value = field.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailPattern.test(value);
  
  if (!isValid) {
    showFieldError(field, 'Please enter a valid email address');
  } else {
    clearFieldError(field);
    field.classList.add('valid');
  }
  
  return isValid;
}

function validatePassword(field) {
  const value = field.value;
  const hasMinLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  
  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber;
  
  if (!isValid) {
    let message = 'Password must have: ';
    const requirements = [];
    if (!hasMinLength) requirements.push('8+ characters');
    if (!hasUppercase) requirements.push('uppercase letter');
    if (!hasLowercase) requirements.push('lowercase letter');
    if (!hasNumber) requirements.push('number');
    message += requirements.join(', ');
    
    showFieldError(field, message);
  } else {
    clearFieldError(field);
    field.classList.add('valid');
  }
  
  return isValid;
}

function validatePasswordMatch(passwordField, confirmField) {
  const isValid = passwordField.value === confirmField.value;
  
  if (!isValid) {
    showFieldError(confirmField, 'Passwords do not match');
  } else {
    clearFieldError(confirmField);
  }
  
  return isValid;
}

function validateMovieName(field) {
  const value = field.value.trim();
  const isValid = value.length > 0;
  
  if (!isValid) {
    showFieldError(field, 'Movie name is required');
  } else {
    clearFieldError(field);
  }
  
  return isValid;
}

function validateMovieDescription(field) {
  const value = field.value.trim();
  const isValid = value.length > 0;
  
  if (!isValid) {
    showFieldError(field, 'Description is required');
  } else {
    clearFieldError(field);
  }
  
  return isValid;
}

function validateMovieYear(field) {
  const value = parseInt(field.value);
  const currentYear = new Date().getFullYear();
  const isValid = !isNaN(value) && value >= 1900 && value <= 2030;
  
  if (!isValid) {
    showFieldError(field, 'Year must be between 1900 and 2030');
  } else {
    clearFieldError(field);
  }
  
  return isValid;
}

function validateMovieRating(field) {
  const value = parseFloat(field.value);
  const isValid = !isNaN(value) && value >= 0 && value <= 10;
  
  if (!isValid) {
    showFieldError(field, 'Rating must be between 0 and 10');
  } else {
    clearFieldError(field);
  }
  
  return isValid;
}

// Utility functions for error display
function showFieldError(field, message) {
  clearFieldError(field);
  
  field.classList.add('error');
  
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  
  field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
  if (!field) return;
  
  field.classList.remove('error', 'valid');
  
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existingAlerts = document.querySelectorAll('.js-alert');
  existingAlerts.forEach(alert => alert.remove());
  
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type} js-alert`;
  alertElement.textContent = message;
  
  const form = document.querySelector('form');
  if (form) {
    form.insertAdjacentElement('beforebegin', alertElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      alertElement.remove();
    }, 5000);
  }
}

// Flash message auto-dismiss functionality
function initializeFlashMessages() {
  const flashMessages = document.querySelectorAll('.flash-message');
  
  flashMessages.forEach(message => {
    // Add auto-dismiss class for animation
    message.classList.add('auto-dismiss');
    
    // Add click to dismiss functionality
    message.style.cursor = 'pointer';
    message.title = 'Click to dismiss';
    
    message.addEventListener('click', () => {
      message.style.animation = 'fadeOut 0.3s ease-in forwards';
      setTimeout(() => {
        message.remove();
      }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => {
          message.remove();
        }, 300);
      }
    }, 5000);
  });
}

// Genre selection enhancement
function initializeGenreSelection(genreCheckboxes) {
  genreCheckboxes.forEach(checkbox => {
    const parentDiv = checkbox.closest('.genre-checkbox');
    
    // Add click handler to the entire div for better UX
    if (parentDiv) {
      parentDiv.addEventListener('click', (e) => {
        // Only trigger if clicking on the div itself, not the checkbox or label
        if (e.target === parentDiv) {
          checkbox.checked = !checkbox.checked;
          updateGenreSelection();
        }
      });
    }
    
    // Update selection when checkbox changes
    checkbox.addEventListener('change', updateGenreSelection);
  });
  
  // Initial update
  updateGenreSelection();
  
  function updateGenreSelection() {
    const checkedCount = document.querySelectorAll('input[name="genres"]:checked').length;
    const genreSelection = document.querySelector('.genre-selection');
    
    // Visual feedback for selection count
    if (genreSelection) {
      const countDisplay = genreSelection.querySelector('.genre-count') || createGenreCountDisplay();
      countDisplay.textContent = checkedCount === 0 ? 'No genres selected' : 
                                 checkedCount === 1 ? '1 genre selected' : 
                                 `${checkedCount} genres selected`;
    }
  }
  
  function createGenreCountDisplay() {
    const genreSelection = document.querySelector('.genre-selection');
    const countDisplay = document.createElement('div');
    countDisplay.className = 'genre-count';
    countDisplay.style.cssText = `
      grid-column: 1 / -1;
      text-align: center;
      font-size: 0.875rem;
      color: #6c757d;
      font-weight: 500;
      padding: 0.5rem;
      border-top: 1px solid #e9ecef;
      margin-top: 0.5rem;
      order: 999;
    `;
    genreSelection.appendChild(countDisplay);
    return countDisplay;
  }
}
