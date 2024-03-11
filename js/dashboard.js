import {
  getLastIncome,
  getLastSpending,
  getMoney,
  getTodayIncome,
  getTodaySpending,
} from "./utils/dataTrasaction.mjs";

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const money = formatCurrency(getMoney());
document.querySelector(".money-text").textContent = money;

const income = formatCurrency(getTodayIncome());
document.querySelector(".income-text").textContent = income;

const spending = formatCurrency(getTodaySpending());
document.querySelector(".spending-text").textContent = spending;

const last_income = formatCurrency(getLastIncome()["amount"]);
document.querySelector(".last-income").textContent = last_income;

const last_spending = formatCurrency(getLastSpending()["amount"]);
document.querySelector(".last-spending").textContent = last_spending;

const last_income_date = getLastIncome()["category"];
document.querySelector(".last-income-date").textContent =
  capitalizeFirstLetter(last_income_date);

const last_spending_date = getLastSpending()["category"];
document.querySelector(".last-spending-date").textContent =
  capitalizeFirstLetter(last_spending_date);

document.querySelector(".add-reminder").addEventListener("click", function () {
  // navigate to add reminder page
  window.location.href = "manage.html";
});
