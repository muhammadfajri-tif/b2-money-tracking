import { getMoney, getUsername } from "./utils/dataTrasaction.mjs";
import { initializeDataToLocalStorage } from "./utils/file.mjs";

const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

var username = getUsername();
username = username ? username : "User";
document.querySelector(".profile-info > h3").textContent = username;

const darkMode = document.querySelector(".dark-mode");

darkMode.addEventListener("click", () => {
  console.log("clicked");
  const titleTheme = document.querySelector(".title-theme");
  const iconTheme = document.querySelector(".icon-theme");

  titleTheme.textContent =
    titleTheme.textContent === "Light Theme" ? "Dark Theme" : "Light Theme";
  iconTheme.textContent = iconTheme.textContent.includes("wb_sunny")
    ? "nights_stay"
    : "wb_sunny";

  document.body.classList.toggle("dark-mode-variables");
  darkMode.querySelector("span:nth-child(1)").classList.toggle("active");
  darkMode.querySelector("span:nth-child(2)").classList.toggle("active");
});

/**
 * Function to check if user cookies are null and set cookies from dummy JSON data if they are.
 */
function checkAndSetCookies() {
  // Check if user cookies are null
  if (getUsername() === null && getMoney() === null) {
    // Set cookies from dummy JSON data
    fetch("../dummy.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        initializeDataToLocalStorage(jsonData);
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  } else {
    console.log("User cookies already exist.");
  }
}

checkAndSetCookies();

const modalAnchor = document.querySelector(".modal-nav a");

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

const divDate = document.querySelector(".right-section .date");
const date = new Date();
const dayName = days[date.getDay()];
const monthName = months[date.getMonth()];

date.toUTCString();
divDate.innerHTML = `${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`;

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

modalAnchor.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure want to log out?",
    icon: "question",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Thanks for coming", "", "success").then(() => {
        window.location.pathname = "../index.html";
      });
    } else if (result.isDenied) {
      Swal.fire("Enjoy the App", "", "info");
      e.preventDefault();
    }
  });
});
