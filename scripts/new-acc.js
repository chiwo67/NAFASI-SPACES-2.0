const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const createAccountError = document.getElementById('create-account-error');
const createAccountForm = document.getElementById('create-account-form');
const termsCheckbox = document.getElementById('terms');

createAccountForm.addEventListener('submit', function (event) {
    event.preventDefault();
    createAccountError.className = 'text-red-500 text-center';
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

    if (!termsCheckbox.checked) {
        displayMessage('Please agree to the terms and conditions.');
        return;
    }

    if (findUserByEmail(email)) {
        displayMessage('An account with that email already exists.');
        return;
    }

    addUser({ firstName, lastName, email, password, role: 'user' });

    createAccountError.className = 'text-green-500 text-center';
    displayMessage('Account created successfully!');

    window.location.href = 'login.html';
});

function displayMessage(message) {
    createAccountError.textContent = message;
}
