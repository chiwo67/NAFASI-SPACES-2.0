const bookingForm = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const checkInInput = document.getElementById("check-in");
const checkOutInput = document.getElementById("check-out");
const roomTypeSelect = document.getElementById("reason");
const guestsInput = document.getElementById("guests");
const paymentMethodSelect = document.getElementById("payment-method");
const locationInput = document.getElementById("location");
const checkboxInput = document.getElementById("checkbox");
const formError = document.getElementById("form-error");

function getStoredValue(key) {
  const value = localStorage.getItem(key);
  try {
    return value ? JSON.parse(value) : "";
  } catch {
    return value || "";
  }
}

const storedName = getStoredValue("firstName");
const storedEmail = getStoredValue("email");
let storedCheckIn = localStorage.getItem("checkIn");
let storedCheckOut = localStorage.getItem("checkOut");

nameInput.value = storedName;
emailInput.value = storedEmail;

const today = new Date().toISOString().split("T")[0];
checkInInput.min = today;
checkOutInput.min = today;

checkInInput.addEventListener("change", function () {
  checkOutInput.min = checkInInput.value || today;
  if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
    checkOutInput.value = "";
  }
});

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formError.textContent = "";
  validateForm();
});

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

  if (checkInInput.value === checkOutInput.value) {
    displayError("Check-in and check-out dates cannot be the same.");
    return;
  }

  if (guestsInput.value < 1) {
    displayError("Number of guests must be at least 1.");
    return;
  }

  if (guestsInput.value > 30) {
    displayError("Number of guests cannot exceed 30.");
    return;
  }

  if (!checkboxInput.checked) {
    displayError("Please agree to the terms and conditions.");
    return;
  }if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
    displayError("Please enter a valid email address.");
    return;
  }

  if (
    checkInInput.value === storedCheckIn &&
    checkOutInput.value === storedCheckOut
  ) {
    displayError("You have already booked for these dates.");
    return;
  }

  localStorage.setItem("checkIn", checkInInput.value);
  localStorage.setItem("checkOut", checkOutInput.value);
  localStorage.setItem("guests", guestsInput.value);
  localStorage.setItem("location", locationInput.value.trim());
  window.location.href = "checkout.html";
}

function displayError(message) {
  formError.textContent = message;
}
