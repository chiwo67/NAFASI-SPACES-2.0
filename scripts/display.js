const welcomeMessage = document.getElementById('welcome-message');
const storedFirstName = localStorage.getItem('firstName');

if (welcomeMessage && storedFirstName) {
  try {
    const firstName = JSON.parse(storedFirstName).trim();

    if (firstName) {
      welcomeMessage.textContent = `WELCOME TO NAFASI, ${firstName.toUpperCase()}`;
    }
  } catch {
    throw new Error('Invalid first name in localStorage');
  }
}
