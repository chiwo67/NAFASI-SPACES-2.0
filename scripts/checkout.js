const checkoutForm = document.getElementById('checkout-form');
const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
const paymentOptionLabels = document.querySelectorAll('.payment-option');
const mpesaFields = document.getElementById('mpesa-fields');
const cardFields = document.getElementById('card-fields');
const bankFields = document.getElementById('bank-fields');
const checkoutError = document.getElementById('checkout-error');
const confirmation = document.getElementById('confirmation');
const confirmationMessage = document.getElementById('confirmation-message');

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
  const checkIn = getStoredValue('checkIn');
  const checkOut = getStoredValue('checkOut');
  const guests = getStoredValue('guests') || 1;
  const location = getStoredValue('location');

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

paymentOptions.forEach((option) => {
  option.addEventListener('change', () => showPaymentFields(option.value));
});