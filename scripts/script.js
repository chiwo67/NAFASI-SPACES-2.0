const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === '' || password === '') {
    loginError.textContent = 'Please fill in both email and password.';
    return;
  }

  const storedEmail = JSON.parse(localStorage.getItem('email'));
  const storedPassword = JSON.parse(localStorage.getItem('password'));

  if (email === storedEmail && password === storedPassword) {
    sessionStorage.setItem('nafasiLoggedIn', 'true');
    loginError.textContent = 'You have successfully logged in!';
    loginError.className = 'text-green-500 text-sm mt-2';
    window.location.href = 'display.html';
  } else {
    loginError.textContent = 'Invalid email or password.';
  }
});
