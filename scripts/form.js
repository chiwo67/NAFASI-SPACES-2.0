const bookingForm = document.getElementById("booking-form");
const nameInput =
  localStorage.getItem(JSON.parse("firstName")) ||
  document.getElementById("name");
const emailInput =
  document.getElementById("email") || localStorage.getItem(JSON.parse("email"));
const checkInInput = document.getElementById("check-in");
const checkOutInput = document.getElementById("check-out");
const roomTypeSelect = document.getElementById("room-type");
const guestsInput = document.getElementById("guests");
const paymentMethodSelect = document.getElementById("payment-method");
const locationInput = document.getElementById("location");
const formError = document.getElementById("form-error");

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  storedCheckIn = localStorage.setItem("checkIn");
  storedCheckOut = localStorage.setItem("checkOut");
  function validateForm() {
  if (
    !nameInput.value ||
    !emailInput.value ||
    !checkInInput.value ||
    !checkOutInput.value ||
    !roomTypeSelect.value ||
    !guestsInput.value ||
    !paymentMethodSelect.value ||
    !locationInput.value
  ) {
    displayError("Please fill in all required fields.");
    return;
  }
  if (checkInInput.value > checkOutInput.value) {
    displayError("Check-in date cannot be later than check-out date.");
    return;
  }
  if (guestsInput.value < 1) {
    displayError("Number of guests must be at least 1.");
    return;
  }
  if (guestsInput.value > 10) {
    displayError("Number of guests cannot exceed 10.");
    return;
  }
  if (nameInput.value !== localStorage.getItem("firstName")) {
    displayError("Name does not match stored information.");
    return;
  }
  if (emailInput.value !== localStorage.getItem("email")) {
    displayError("Email does not match stored information.");
    return;
  }if(checkboxInput.checked === false){
    displayError("Please agree to the terms and conditions.");
    return;
  }if(check-inInput.value === checkOutInput.value){
    displayError("Check-in and check-out dates cannot be the same.");
    return;
  }if(checkInInput.value === "" || checkOutInput.value === ""){
    displayError("Please select both check-in and check-out dates.");
    return;
  }if (checkInInput.value === storedCheckIn && checkOutInput.value === storedCheckOut) {
    displayError("You have already booked for these dates.");
    return;
  }else{
    window.location.href = "templates/checkout.html";
  }

}
});

function displayError(message) {
  formError.textContent = message;
}
