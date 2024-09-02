import { translations } from './translations.js';

export function validateInput(input, currentLanguage) {
  const formGroup = input.closest('.form-group');
  const errorMessage = formGroup.querySelector('.error-message');
  let isValid = true;

  if (input.validity.valueMissing) {
    formGroup.classList.add('error');
    errorMessage.textContent = translations[currentLanguage][`${input.id}-error`];
    isValid = false;
  } else if (input.type === 'email' && !input.validity.valid) {
    formGroup.classList.add('error');
    errorMessage.textContent = translations[currentLanguage]['email-error'];
    isValid = false;
  } else {
    formGroup.classList.remove('error');
  }

  return isValid;
}