import { getUsername } from "./utils/dataTrasaction.mjs";

const username = getUsername();
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
