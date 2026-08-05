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
    displayMessage('Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    displayMessage('Passwords do not match.');
    return;
  }

  displayMessage('Account created successfully!');
  localStorage.setItem('firstName', JSON.stringify(firstName));
  localStorage.setItem('lastName', JSON.stringify(lastName));
  localStorage.setItem('email', JSON.stringify(email));
  localStorage.setItem('password', JSON.stringify(password));

  if (password === confirmPassword) {
    displayMessage('Account created successfully!');
    window.location.href = 'login.html';
    return true;    
  }
  if (password !== confirmPassword) {
    displayMessage('Passwords do not match.');
    return false;
  }
  if (firstName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
    displayMessage('Please fill in all fields.');
    return false;
  }
  if (checkbox.checked === false) {
    displayMessage('Please agree to the terms and conditions.');
    return false;
  }if (password.length < 8) {
    displayMessage('Password must be at least 8 characters long.');
    return false;
  }if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    displayMessage('Please enter a valid email address.');
    return false;
  }if (firstName.length < 2 || lastName.length < 2) {
    displayMessage('First and last name must be at least 2 characters long.');
    return false;
  }
  
});

function displayMessage(message) {
    createAccountError.textContent = message;
}