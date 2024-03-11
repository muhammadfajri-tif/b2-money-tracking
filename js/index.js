const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const headerDate = document.querySelector("header .date");
const date = new Date();
const dayName = days[date.getDay()];
const monthName = months[date.getMonth()];

const asideAnchor = document.querySelectorAll("aside a");
const modalAnchor = document.querySelectorAll(".modal-nav a");

const numbers = document.querySelectorAll(".progresss #number");
let count = 0;

const darkMode = document.querySelector(".dark-mode");

date.toUTCString();
headerDate.innerHTML = `${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`;

//MODAL
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

setInterval(() => {
  if (count == 65) {
    clearInterval();
  } else {
    count++;
    numbers.forEach((number) => {
      number.innerHTML = count + "%";
    });
  }
}, 25);

function removeClassActiveAside() {
  asideAnchor.forEach((anchor) => {
    anchor.classList.remove("active");
  });
}
function removeClassActiveModal() {
  modalAnchor.forEach((anchor) => {
    anchor.classList.remove("active");
  });
}

asideAnchor.forEach((anchor) => {
  const anchorPath = anchor.getAttribute("href");

  if (window.location.pathname == anchorPath) {
    anchor.addEventListener("click", (event) => event.preventDefault());
  } else {
    anchor.addEventListener("click", () => {
      //menghapus class active pada tag lain jika ada
      removeClassActiveAside();
      //melakukan toggle class active
      anchor.classList.toggle("active");
    });
  }
});

modalAnchor.forEach((anchor) => {
  const anchorPath = anchor.getAttribute("href");

  if (window.location.pathname == anchorPath) {
    anchor.addEventListener("click", (event) => event.preventDefault());
  } else {
    anchor.addEventListener("click", () => {
      //menghapus class active pada tag lain jika ada
      removeClassActiveModal();
      //melakukan toggle class active
      anchor.classList.toggle("active");
    });
  }
});

menuBtn.addEventListener("click", () => {
  sideMenu.classList.remove("hidden");
  overlay.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sideMenu.classList.add("hidden");
  overlay.classList.remove("active");
});

window.addEventListener("resize", function () {
  // Jika lebar halaman lebih besar dari 768px, pastikan navbar ditampilkan
  if (window.innerWidth > 768) {
    overlay.classList.remove("active");
    sideMenu.classList.remove("hidden");
  } else if (!sideMenu.classList.contains("hidden")) {
    overlay.classList.add("active");
  }
});

darkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});

const prefersDarkMode = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

// If user prefers dark mode, set it by default
if (prefersDarkMode) {
  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
}
