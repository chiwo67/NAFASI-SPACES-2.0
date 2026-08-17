const bookingForm = document.querySelector('#FORM form');

bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const session = getSession();

    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;

    if (new Date(checkOut) <= new Date(checkIn)) {
        alert('Check-out date must be after the check-in date.');
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
