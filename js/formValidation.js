import { translations } from './translations.js';

export function validateInput(input, currentLanguage) {
  // Get the form group and error message element
  const formGroup = input.closest('.form-group');
  const errorMessage = formGroup.querySelector('.error-message');
  let isValid = true;

  // Check if the field is empty
  if (input.validity.valueMissing) {
    formGroup.classList.add('error');
    // Show the error message corresponding to the field and current language
    errorMessage.textContent = translations[currentLanguage][`${input.id}-error`];
    isValid = false;
  }
  // Check if it's an email and if it's valid
  else if (input.type === 'email' && !input.validity.valid) {
    formGroup.classList.add('error');
    // Show the error message for invalid email
    errorMessage.textContent = translations[currentLanguage]['email-error'];
    isValid = false;
  }
  // If everything is okay, remove the error class
  else {
    formGroup.classList.remove('error');
  }

  return isValid;
}

// I use this function to validate the entire form before submitting
export function validateForm(form, currentLanguage) {
  let isValid = true;
  // Get all inputs and textareas from the form
  const inputs = form.querySelectorAll('input, textarea');

  // Validate each field individually
  inputs.forEach(input => {
    if (!validateInput(input, currentLanguage)) {
      isValid = false;
    }
  });

  return isValid;
}

// I use this function to clear form errors
export function clearFormErrors(form) {
  const formGroups = form.querySelectorAll('.form-group');
  formGroups.forEach(group => {
    group.classList.remove('error');
    const errorMessage = group.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = '';
    }
  });
}

// I use this function to completely reset the form
export function resetForm(form) {
  form.reset();
  clearFormErrors(form);
}

// Here I add specific validations for each field type
function validateName(name) {
  // For example, I can check that the name has at least 2 characters
  return name.length >= 2;
}

function validateEmail(email) {
  // I use a regular expression to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateMessage(message) {
  // I check that the message has at least 10 characters
  return message.length >= 10;
}

// I can use this function for more specific validations if I need them
export function validateField(field, value, currentLanguage) {
  switch (field) {
    case 'name':
      return validateName(value) ? '' : translations[currentLanguage]['name-error'];
    case 'email':
      return validateEmail(value) ? '' : translations[currentLanguage]['email-error'];
    case 'message':
      return validateMessage(value) ? '' : translations[currentLanguage]['message-error'];
    default:
      return '';
  }
}