const checkoutForm = document.getElementById('checkout-form');
const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
const paymentOptionLabels = document.querySelectorAll('.payment-option');
const mpesaFields = document.getElementById('mpesa-fields');
const cardFields = document.getElementById('card-fields');
const bankFields = document.getElementById('bank-fields');
const checkoutError = document.getElementById('checkout-error');
const confirmation = document.getElementById('confirmation');
const confirmationMessage = document.getElementById('confirmation-message');
let pendingBooking = getPendingBooking();

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearError();

  const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const validationMessage = validatePayment(selectedMethod);
  if (validationMessage) {
    showError(validationMessage);
    return;
  }

  const paymentLabels = { mpesa: 'M-Pesa', card: 'card', bank: 'bank transfer' };
  if (pendingBooking) {
    addBooking({ ...pendingBooking, paymentMethod: selectedMethod });
    localStorage.removeItem('nafasi_pending_booking');
    pendingBooking = null;
  }
  checkoutForm.classList.add('hidden');
  confirmationMessage.textContent = `Your ${paymentLabels[selectedMethod]} payment request has been received. We will confirm your reservation shortly.`;
  confirmation.classList.remove('hidden');
  confirmation.focus();
});

function showError(message) {
  checkoutError.textContent = message;
  checkoutError.classList.remove('hidden');
}

function clearError() {
  checkoutError.textContent = '';
  checkoutError.classList.add('hidden');
}

function updateBookingSummary() {
  const checkIn = pendingBooking?.checkIn || getStoredValue('checkIn');
  const checkOut = pendingBooking?.checkOut || getStoredValue('checkOut');
  const guests = pendingBooking?.guests || getStoredValue('guests') || 1;
  const location = pendingBooking?.location || getStoredValue('location');

  document.getElementById('check-in').textContent = formatDate(checkIn);
  document.getElementById('check-out').textContent = formatDate(checkOut);
  document.getElementById('guests').textContent = `${guests} ${Number(guests) === 1 ? 'guest' : 'guests'}`;

  if (location) {
    document.getElementById('space-name').textContent = location;
  }
}

function validatePayment(method) {
  if (method === 'mpesa') {
    const phone = document.getElementById('phone').value.replace(/[\s-]/g, '');
    if (!/^(?:\+254|254|0)7\d{8}$/.test(phone)) {
      return 'Enter a valid Kenyan M-Pesa number, for example 0712 345 678.';
    }
  }

  if (method === 'card') {
    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    if (!cardName || !isValidCardNumber(cardNumber)) return 'Enter a valid cardholder name and card number.';
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) return 'Enter the card expiry date as MM/YY.';
    if (!/^\d{3,4}$/.test(cvv)) return 'Enter a valid 3 or 4 digit CVV.';
  }

  return '';
}

function isValidCardNumber(value) {
  const digits = value.replace(/[\s-]/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function formatDate(value) {
  if (!value) return 'Not selected';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Not selected';
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getPendingBooking() {
  try {
    return JSON.parse(localStorage.getItem('nafasi_pending_booking'));
  } catch {
    return null;
  }
}

paymentOptions.forEach((option) => {
  option.addEventListener('change', () => showPaymentFields(option.value));
});


function getStoredValue(key) {
  const value = localStorage.getItem(key);

  if (!value) return '';

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function showPaymentFields(method) {
  mpesaFields.classList.toggle('hidden', method !== 'mpesa');
  cardFields.classList.toggle('hidden', method !== 'card');
  bankFields.classList.toggle('hidden', method !== 'bank');

  paymentOptionLabels.forEach((label) => {
    const isSelected = label.querySelector('input').value === method;
    label.classList.toggle('border-2', isSelected);
    label.classList.toggle('border-[#b7925f]', isSelected);
    label.classList.toggle('bg-[#fff9f0]', isSelected);
    label.classList.toggle('border', !isSelected);
    label.classList.toggle('border-slate-200', !isSelected);
  });
}

const savedPaymentMethod = pendingBooking?.paymentMethod;
const savedPaymentOption = Array.from(paymentOptions).find((option) => option.value === savedPaymentMethod);
if (savedPaymentOption) savedPaymentOption.checked = true;

updateBookingSummary();
showPaymentFields(document.querySelector('input[name="paymentMethod"]:checked').value);
