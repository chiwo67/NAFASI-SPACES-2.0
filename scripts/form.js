const bookingForm = document.getElementById('booking-form');
const checkInInput = document.getElementById('check-in');
const checkOutInput = document.getElementById('check-out');
const bookingError = document.getElementById('booking-error');

function localDateString(date = new Date()) {
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return offsetDate.toISOString().slice(0, 10);
}

function showBookingError(message) {
    bookingError.textContent = message;
    bookingError.classList.remove('hidden');
}

function clearBookingError() {
    bookingError.textContent = '';
    bookingError.classList.add('hidden');
}

function validateDates() {
    checkOutInput.min = checkInInput.value || localDateString();
    const invalidRange = checkInInput.value && checkOutInput.value && checkOutInput.value <= checkInInput.value;
    checkOutInput.setCustomValidity(invalidRange ? 'Check-out date must be after check-in date.' : '');
    return !invalidRange;
}

const today = localDateString();
checkInInput.min = today;
checkOutInput.min = today;
checkInInput.addEventListener('change', validateDates);
checkOutInput.addEventListener('change', validateDates);

bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearBookingError();

    const session = getSession();

    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    if (!validateDates()) {
        showBookingError('Check-out date must be after the check-in date.');
        return;
    }

    const booking = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        notifications: document.getElementById('notifications').value,
        checkIn,
        checkOut,
        guests: document.getElementById('guests').value,
        reason: document.getElementById('reason').value,
        paymentMethod: document.getElementById('payment-method').value,
        location: document.getElementById('location').value.trim(),
        bookedBy: session ? session.email : null,
    };

    localStorage.setItem('nafasi_pending_booking', JSON.stringify(booking));
    window.location.href = 'checkout.html';
});
