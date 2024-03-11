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
