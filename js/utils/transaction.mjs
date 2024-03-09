import { parseFormData, addNewIncome } from "./dataTrasaction.mjs";
// handle form tambah pendapatan
const formAddIncomeSelector = document.getElementById("add-income-form");
formAddIncomeSelector.addEventListener("submit", handleAddIncomeFrom);

// handle form tambah pengeluaran
const formAddSpendingSelector = document.getElementById("add-spending-form");
formAddSpendingSelector.addEventListener("submit", handleAddSpendingForm);

/**
 * Module event handler untuk menangani data pemasukan baru
 *
 * @param {Event} event - event on submit
 */
function handleAddIncomeFrom(event) {
  event.preventDefault();

  const form = new FormData(formAddIncomeSelector);
  let amount = form.get("amount-income");
  amount = amount.replace(/\D/g, "");
  form.set("amount-income", amount);

  const parseData = parseFormData(form, "income");
  console.log("income", parseData);

  addNewIncome(parseData, "income");
}

/**
 * Module event handler untuk menangani data pengeluaran baru
 *
 * @param {Event} event - event on submit
 */
function handleAddSpendingForm(event) {
  event.preventDefault();

  const form = new FormData(formAddSpendingSelector);

  let amount = form.get("amount-spending");
  amount = amount.replace(/\D/g, "");
  form.set("amount-spending", amount);

  const parseData = parseFormData(form, "spending");
  console.log("spending", parseData);

  addNewIncome(parseData, "spending");
}
