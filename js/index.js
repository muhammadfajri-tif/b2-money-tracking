const sideMenu = document.querySelector("aside");
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

Orders.forEach((order) => {
  const tr = document.createElement("tr");
  const trContent = `
        <td>${order.productName}</td>
        <td>${order.productNumber}</td>
        <td>${order.paymentStatus}</td>
        <td class="${
          order.status === "Declined"
            ? "danger"
            : order.status === "Pending"
            ? "warning"
            : "primary"
        }">${order.status}</td>
        <td class="primary">Details</td>
    `;
  tr.innerHTML = trContent;
  document.querySelector("table tbody").appendChild(tr);
});

// handle form buat akun baru
function toggleFormCreateUse() {
  const createAccount = document.querySelector(".create-account");
  createAccount.classList.toggle("active");
}
