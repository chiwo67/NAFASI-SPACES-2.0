const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  if (emailInput.value === '' || passwordInput.value === '') {
    loginError.textContent = 'Please fill in both email and password.';
  }else {
    loginError.textContent = 'You have successfully logged in!';
  }
  return false;

  const storedEmail = JSON.parse(localStorage.getItem('email'));
  const storedPassword = JSON.parse(localStorage.getItem('password'));

  if (emailInput.value === storedEmail && passwordInput.value === storedPassword) {
    loginError.textContent = 'You have successfully logged in!';
    return true; 
    window.location.href = 'home.html';
  }else{
    loginError.textContent = 'Invalid email or password.';
  }
});