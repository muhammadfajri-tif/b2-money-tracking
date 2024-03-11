import {
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

const money = formatCurrency(getMoney());
document.querySelector(".money-text").textContent = money;

const income = formatCurrency(getTodayIncome());
document.querySelector(".income-text").textContent = income;

const spending = formatCurrency(getTodaySpending());
document.querySelector(".spending-text").textContent = spending;
