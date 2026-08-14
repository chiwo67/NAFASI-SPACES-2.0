const bookingForm = document.querySelector('#FORM form');

bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const session = getSession();

    const booking = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        notifications: document.getElementById('notifications').value,
        checkIn: document.getElementById('check-in').value,
        checkOut: document.getElementById('check-out').value,
        guests: document.getElementById('guests').value,
        reason: document.getElementById('reason').value,
        paymentMethod: document.getElementById('payment-method').value,
        location: document.getElementById('location').value.trim(),
        bookedBy: session ? session.email : null,
    };

    addBooking(booking);

    window.location.href = 'display.html';
});
