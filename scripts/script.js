const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === '' || password === '') {
        loginError.textContent = 'Please fill in both email and password.';
        return;
    }

    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
        loginError.textContent = 'Invalid email or password.';
        return;
    }

    setSession({ id: user.id, email: user.email, role: user.role, firstName: user.firstName });

    loginError.className = 'text-green-500 text-sm mt-2';
    loginError.textContent = 'You have successfully logged in!';

    window.location.href = user.role === 'admin' ? 'admin.html' : 'display.html';
});

