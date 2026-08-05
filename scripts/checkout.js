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