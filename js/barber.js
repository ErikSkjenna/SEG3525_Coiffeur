const COMPANY_NAME = "Studio Élégance Homme";

const bookingForm = document.getElementById("bookingForm");
const clientName = document.getElementById("clientName");
const clientEmail = document.getElementById("clientEmail");
const serviceSelect = document.getElementById("serviceSelect");
const stylistSelect = document.getElementById("stylistSelect");
const dateSelect = document.getElementById("dateSelect");
const timeSelect = document.getElementById("timeSelect");

const summaryName = document.getElementById("summaryName");
const summaryService = document.getElementById("summaryService");
const summaryPrice = document.getElementById("summaryPrice");
const summaryDuration = document.getElementById("summaryDuration");
const summaryStylist = document.getElementById("summaryStylist");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const confirmationMessage = document.getElementById("confirmationMessage");

const calendarDays = document.getElementById("calendarDays");
const calendarMonthLabel = document.getElementById("calendarMonthLabel");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const priceHairReveal = document.getElementById("priceHairReveal");
const hairField = document.getElementById("hairField");

const serviceButtons = document.querySelectorAll(".choose-service");
const stylistButtons = document.querySelectorAll(".choose-stylist");
const serviceCards = document.querySelectorAll(".service-card");
const stylistCards = document.querySelectorAll(".stylist-card");

const HAIR_COUNT = 1000;
let priceAlreadyRevealed = false;

const today = new Date();
today.setHours(0, 0, 0, 0);

const currentYear = today.getFullYear();
let currentCalendarDate = new Date(today.getFullYear(), today.getMonth(), 1);

const monthNames = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const dayNames = [
  "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function formatDateForDisplay(date) {
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthName = monthNames[date.getMonth()].toLowerCase();
  const year = date.getFullYear();

  return `${dayName} ${day} ${monthName} ${year}`;
}

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  calendarMonthLabel.textContent = `${monthNames[month]} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingWeekday = firstDayOfMonth.getDay();
  const numberOfDays = lastDayOfMonth.getDate();

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth();

  prevMonth.disabled = isCurrentMonth;

  const isDecemberOfCurrentYear =
    year === currentYear &&
    month === 11;

  nextMonth.disabled = isDecemberOfCurrentYear;

  for (let i = 0; i < startingWeekday; i++) {
    const emptyCell = document.createElement("button");
    emptyCell.type = "button";
    emptyCell.classList.add("calendar-day", "empty");
    calendarDays.appendChild(emptyCell);
  }

  for (let day = 1; day <= numberOfDays; day++) {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    const isBeforeToday = date < today;
    const isOutsideCurrentYear = date.getFullYear() !== currentYear;

    const dayButton = document.createElement("button");
    dayButton.type = "button";
    dayButton.classList.add("calendar-day");
    dayButton.textContent = day;

    if (isBeforeToday || isOutsideCurrentYear) {
      dayButton.classList.add("unavailable");
      dayButton.disabled = true;
    }

    if (dateSelect.value === formatDateForDisplay(date)) {
      dayButton.classList.add("selected");
    }

    if (!isBeforeToday && !isOutsideCurrentYear) {
      dayButton.addEventListener("click", () => {
        dateSelect.value = formatDateForDisplay(date);

        document.querySelectorAll(".calendar-day").forEach((button) => {
          button.classList.remove("selected");
        });

        dayButton.classList.add("selected");
        updateSummary();
      });
    }

    calendarDays.appendChild(dayButton);
  }
}

function allOptionsSelected() {
  return (
    clientName.value.trim() !== "" &&
    clientEmail.value.trim() !== "" &&
    serviceSelect.value !== "" &&
    stylistSelect.value !== "" &&
    dateSelect.value !== "" &&
    timeSelect.value !== ""
  );
}

function generateHairPatch() {
  hairField.innerHTML = "";

  const hairColors = [
    "#2b1a12",
    "#3b2418",
    "#4a2f23",
    "#5c3a2a",
    "#6f4a35"
  ];

  for (let i = 0; i < HAIR_COUNT; i++) {
    const hair = document.createElement("span");
    hair.classList.add("hair-strand");

    const left = Math.random() * 100;
    const height = 45 + Math.random() * 115;
    const width = 1 + Math.random() * 2.3;
    const delay = Math.random() * 1.8;
    const duration = 1.2 + Math.random() * 2.3;
    const rotation = -18 + Math.random() * 36;
    const opacity = 0.55 + Math.random() * 0.45;
    const color = hairColors[Math.floor(Math.random() * hairColors.length)];

    hair.style.left = `${left}%`;
    hair.style.height = `${height}px`;
    hair.style.width = `${width}px`;
    hair.style.backgroundColor = color;
    hair.style.opacity = opacity;
    hair.style.animationDelay = `${delay}s`;
    hair.style.animationDuration = `${duration}s`;
    hair.style.transform = `rotate(${rotation}deg)`;

    hairField.appendChild(hair);
  }
}

function coverPriceWithHair() {
  priceHairReveal.classList.remove("shaving");
  priceHairReveal.classList.remove("revealed");
  generateHairPatch();
  priceAlreadyRevealed = false;
}

function playShaveAnimation() {
  priceHairReveal.classList.remove("shaving");
  priceHairReveal.classList.remove("revealed");

  void priceHairReveal.offsetWidth;

  priceHairReveal.classList.add("shaving");

  setTimeout(() => {
    priceHairReveal.classList.add("revealed");
    priceAlreadyRevealed = true;
  }, 900);
}

function revealPriceOnlyWhenComplete() {
  if (allOptionsSelected() && !priceAlreadyRevealed) {
    playShaveAnimation();
  }

  if (!allOptionsSelected()) {
    coverPriceWithHair();
  }
}

function updateSummary() {
  const selectedServiceOption = serviceSelect.options[serviceSelect.selectedIndex];

  const service = serviceSelect.value;
  const price = selectedServiceOption?.dataset?.price || "";
  const duration = selectedServiceOption?.dataset?.duration || "";

  summaryName.textContent = clientName.value || "Non indiqué";
  summaryService.textContent = service || "Non choisi";
  summaryPrice.textContent = price ? `${price} $` : "Non choisi";
  summaryDuration.textContent = duration || "Non choisie";
  summaryStylist.textContent = stylistSelect.value || "Non choisie";
  summaryDate.textContent = dateSelect.value || "Non choisie";
  summaryTime.textContent = timeSelect.value || "Non choisie";

  confirmationMessage.classList.remove("show");

  revealPriceOnlyWhenComplete();
}

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");
    const selectedService = card.dataset.service;

    serviceSelect.value = selectedService;

    serviceCards.forEach((serviceCard) => {
      serviceCard.classList.remove("selected-box");
    });

    card.classList.add("selected-box");
    updateSummary();
    scrollToSection("coiffeuses");
  });
});

stylistButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".stylist-card");
    const selectedStylist = card.dataset.stylist;

    stylistSelect.value = selectedStylist;

    stylistCards.forEach((stylistCard) => {
      stylistCard.classList.remove("selected-box");
    });

    card.classList.add("selected-box");
    updateSummary();
    scrollToSection("reservation");
  });
});

prevMonth.addEventListener("click", () => {
  const previousMonth = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth() - 1,
    1
  );

  const firstAllowedMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  if (previousMonth >= firstAllowedMonth) {
    currentCalendarDate = previousMonth;
    renderCalendar();
  }
});

nextMonth.addEventListener("click", () => {
  const nextMonthDate = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth() + 1,
    1
  );

  if (nextMonthDate.getFullYear() === currentYear) {
    currentCalendarDate = nextMonthDate;
    renderCalendar();
  }
});

clientName.addEventListener("input", updateSummary);
clientEmail.addEventListener("input", updateSummary);
serviceSelect.addEventListener("change", updateSummary);
stylistSelect.addEventListener("change", updateSummary);
timeSelect.addEventListener("change", updateSummary);

document.querySelectorAll(".btn-version").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = button.href;
    }, 350);
  });
});

bookingForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!allOptionsSelected()) {
    confirmationMessage.textContent =
      "Veuillez remplir toutes les informations avant de confirmer le rendez-vous.";

    confirmationMessage.classList.add("show");
    confirmationMessage.classList.remove("alert-success");
    confirmationMessage.classList.add("alert-warning");

    return;
  }

  const selectedServiceOption = serviceSelect.options[serviceSelect.selectedIndex];

  const bookingDetails = {
    name: clientName.value.trim(),
    email: clientEmail.value.trim(),
    service: serviceSelect.value,
    price: selectedServiceOption?.dataset?.price,
    duration: selectedServiceOption?.dataset?.duration,
    stylist: stylistSelect.value,
    date: dateSelect.value,
    time: timeSelect.value,
    companyName: COMPANY_NAME
  };

  try {
    const response = await fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingDetails)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errorMessage || result.message || "Erreur inconnue du serveur.");
    }

    if (!priceAlreadyRevealed) {
      playShaveAnimation();
    }

    confirmationMessage.classList.remove("alert-warning");
    confirmationMessage.classList.add("alert-success");

    confirmationMessage.textContent =
      `Merci ${bookingDetails.name} ! Votre rendez-vous pour ${bookingDetails.service} avec ${bookingDetails.stylist} est confirmé le ${bookingDetails.date} à ${bookingDetails.time}. Un courriel de confirmation a été envoyé.`;

    setTimeout(() => {
      confirmationMessage.classList.add("show");
    }, 700);
  } catch (error) {
    confirmationMessage.textContent =
      `La réservation est prête, mais le courriel n’a pas pu être envoyé. Erreur : ${error.message}`;

    confirmationMessage.classList.add("show");
    confirmationMessage.classList.remove("alert-success");
    confirmationMessage.classList.add("alert-warning");
  }
});

renderCalendar();
generateHairPatch();
updateSummary();