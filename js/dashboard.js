import {
  getIncomeList,
  getLastIncome,
  getLastSpending,
  getMoney,
  getSpendingList,
  getTodayIncome,
  getTodaySpending,
  parseDate,
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

const money = formatCurrency(getTotalMoney());
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

document.querySelector(".add-reminder").addEventListener("click", function() {
  // navigate to add reminder page
  window.location.href = "manage.html";
});

function getTotalMoney() {
  let total = parseInt(getMoney());
  const totalSpending = getSpendingList().map(data => Object.assign(data, { type: "spending" }));
  const totalIncome = getIncomeList().map(data => Object.assign(data, { type: "income" }));

  // merge & sort by date
  const transactions = totalIncome.concat(totalSpending).sort((a, b) => parseDate(a.date) - parseDate(b.date));

  // calculate each transactions
  transactions.forEach(data => {
    if (data.type === "income") total += parseInt(data.amount);
    if (data.type === "spending") total -= parseInt(data.amount);
  })

  return total;
}
