const welcomeMessage = document.getElementById('welcome-message');
const logoutButton = document.getElementById('logout-button');

function _readSessionFallback() {
  try {
    return JSON.parse(localStorage.getItem('nafasi_session'));
  } catch {
    return null;
  }
}

const session = (typeof getSession === 'function') ? getSession() : _readSessionFallback();

if (welcomeMessage && session && session.firstName) {
  const firstName = String(session.firstName).trim();
  if (firstName) welcomeMessage.textContent = `WELCOME TO NAFASI, ${firstName.toUpperCase()}`;
}

logoutButton?.addEventListener('click', () => {
  if (typeof clearSession === 'function') clearSession(); else localStorage.removeItem('nafasi_session');
  window.location.href = 'login.html';
});
