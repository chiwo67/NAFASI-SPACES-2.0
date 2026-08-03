const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const createAccountError = document.getElementById('create-account-error');
const createAccountForm = document.getElementById('create-account-form');

createAccountForm.addEventListener('submit', function(event) {
  event.preventDefault();
  createAccountError.textContent = '';
  
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;


  if (firstName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
    createAccountError.textContent = 'Please fill in all fields.';
    return;
  }

  if (password !== confirmPassword) {
    createAccountError.textContent = 'Passwords do not match.';
    return;
  }

  createAccountError.textContent = 'Account created successfully!';
});