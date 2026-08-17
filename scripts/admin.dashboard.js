const adminSession = requireAdmin();

if (adminSession?.role === 'admin') {
  const listingForm = document.getElementById('listing-form');
  const listingIdInput = document.getElementById('listing-id');
  const formTitle = document.getElementById('listing-form-title');
  const cancelEditButton = document.getElementById('cancel-edit');
  const listingsBody = document.getElementById('listings-body');
  const bookingsBody = document.getElementById('bookings-body');
  const dashboardMessage = document.getElementById('dashboard-message');

  document.getElementById('admin-name').textContent = adminSession.firstName || 'Admin';
  document.getElementById('logout-button').addEventListener('click', () => {
    clearSession();
    window.location.href = 'login.html';
  });

  listingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(listingForm));
    const listing = {
      title: data.title.trim(),
      category: data.category,
      location: data.location.trim(),
      price: Number(data.price),
      image: data.image.trim(),
      description: data.description.trim(),
    };

    if (!listing.title || !listing.location || !listing.description || !Number.isFinite(listing.price) || listing.price < 0) {
      showMessage('Complete all required listing details with a valid price.', true);
      return;
    }

    if (listingIdInput.value) {
      updateListing(listingIdInput.value, listing);
      showMessage('Listing updated.');
    } else {
      addListing(listing);
      showMessage('Listing added.');
    }
    resetListingForm();
    renderDashboard();
  });

  cancelEditButton.addEventListener('click', resetListingForm);

  listingsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const listing = getListings().find((item) => item.id === button.dataset.id);
    if (!listing) return;

    if (button.dataset.action === 'edit') {
      listingIdInput.value = listing.id;
      listingForm.elements.title.value = listing.title || '';
      listingForm.elements.category.value = listing.category || 'Workspace';
      listingForm.elements.location.value = listing.location || '';
      listingForm.elements.price.value = listing.price ?? '';
      listingForm.elements.image.value = listing.image || '';
      listingForm.elements.description.value = listing.description || '';
      formTitle.textContent = 'Edit listing';
      cancelEditButton.hidden = false;
      listingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (button.dataset.action === 'delete' && confirm(`Delete “${listing.title}”?`)) {
      deleteListing(listing.id);
      showMessage('Listing deleted.');
      renderDashboard();
    }
  });

  bookingsBody.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-booking-id]');
    if (!button || !confirm('Delete this booking?')) return;
    deleteBooking(button.dataset.bookingId);
    showMessage('Booking deleted.');
    renderDashboard();
  });

  function renderDashboard() {
    const listings = getListings();
    const bookings = getBookings();
    document.getElementById('listing-count').textContent = listings.length;
    document.getElementById('booking-count').textContent = bookings.length;
    document.getElementById('user-count').textContent = getUsers().length;

    listingsBody.replaceChildren(...listings.map(createListingRow));
    bookingsBody.replaceChildren(...bookings.map(createBookingRow));
    document.getElementById('empty-listings').hidden = listings.length > 0;
    document.getElementById('empty-bookings').hidden = bookings.length > 0;
  }

  function createListingRow(listing) {
    const row = document.createElement('tr');
    row.className = 'border-t border-slate-200';
    row.innerHTML = `<td class="px-4 py-3 font-semibold"></td><td class="px-4 py-3"></td><td class="px-4 py-3"></td><td class="px-4 py-3 text-right"></td><td class="px-4 py-3 text-right"><button type="button" data-action="edit" data-id="${listing.id}" class="mr-2 font-semibold text-amber-700 hover:underline">Edit</button><button type="button" data-action="delete" data-id="${listing.id}" class="font-semibold text-red-700 hover:underline">Delete</button></td>`;
    const cells = row.querySelectorAll('td');
    cells[0].textContent = listing.title;
    cells[1].textContent = listing.category;
    cells[2].textContent = listing.location;
    cells[3].textContent = formatCurrency(listing.price);
    return row;
  }

  function createBookingRow(booking) {
    const row = document.createElement('tr');
    row.className = 'border-t border-slate-200';
    row.innerHTML = `<td class="px-4 py-3"></td><td class="px-4 py-3"></td><td class="px-4 py-3"></td><td class="px-4 py-3"></td><td class="px-4 py-3 text-right"><button type="button" data-booking-id="${booking.id}" class="font-semibold text-red-700 hover:underline">Delete</button></td>`;
    const cells = row.querySelectorAll('td');
    cells[0].textContent = booking.name || booking.bookedBy || 'Guest';
    cells[1].textContent = booking.location || 'Not specified';
    cells[2].textContent = `${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)}`;
    cells[3].textContent = booking.paymentMethod || 'Not specified';
    return row;
  }

  function resetListingForm() {
    listingForm.reset();
    listingIdInput.value = '';
    formTitle.textContent = 'Add a listing';
    cancelEditButton.hidden = true;
  }

  function showMessage(message, isError = false) {
    dashboardMessage.textContent = message;
    dashboardMessage.className = `mb-4 rounded-lg p-3 font-semibold ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`;
    dashboardMessage.hidden = false;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  function formatDate(value) {
    if (!value) return 'Not selected';
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? 'Not selected' : date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  renderDashboard();
}
