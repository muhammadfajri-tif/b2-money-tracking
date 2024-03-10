import { exportUserData } from './utils/file.mjs';
import { getUsername, getMoney, getIncomeList, getOutcomeList, updateTransaction, deleteTransaction } from './utils/dataTrasaction.mjs'

// event handler for income transaction
const incomeTableElement = document.querySelector("#user-income-transaction-table > tbody");
renderNewTableRow(incomeTableElement, 'income');

// event handler for spending transaction
const spendingTableElement = document.querySelector("#user-spending-transaction-table > tbody");
renderNewTableRow(spendingTableElement, 'spending');


/**
 * Module untuk membuat record data baru dalam tabel
 *
 * @param {Element} table - tabel element HTML
 * @param {'income'|'spending'} transactionType - tipe traksaksi. Nilai yang valid hanya 'income' atau 'spending'
 */
function renderNewTableRow(table, transactionType) {
  /**
   * get existing data from local storage
   *
   * @type {import('./utils/file.mjs').Transaction[]}
   */
  const transactionData =
    ((transactionType === 'income') && getIncomeList()) ||
    ((transactionType === 'spending') && getOutcomeList());

  table.innerHTML = ""; // reset current element; prevent appending stale data

  // create new row/record each element/data
  transactionData.forEach((element, idx) => {
    const newRecord = table.insertRow(); // append to last element

    // col nomor
    let colNo = newRecord.insertCell(0);
    colNo.innerText = idx + 1;

    // field date
    let colDate = newRecord.insertCell(1);
    colDate.innerText = element.date;

    // field amount
    let colAmount = newRecord.insertCell(2);
    colAmount.innerText = parseInt(element.amount);

    // field category
    let colCategory = newRecord.insertCell(3);
    colCategory.innerText = element.category;

    // field description
    let colDesc = newRecord.insertCell(4);
    colDesc.innerText = element.desc;

    // col action button
    let colAction = newRecord.insertCell(5);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add(`edit-${transactionType}-${idx}`);
    editButton.addEventListener('click', () => {
      promptUpdateData(idx, transactionData, transactionType);
      renderNewTableRow(table, transactionType);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.classList.add(`delete-${transactionType}-${idx}`);
    deleteButton.addEventListener('click', () => {
      deleteTransaction(idx, transactionData, transactionType);
      renderNewTableRow(table, transactionType);
    });

    // attach button to col element
    colAction.append(editButton);
    colAction.append(deleteButton);
  });
}

/**
 * TODO: Ganti dengan modal form yang lebih user interaktif
 * Module untuk prompt update data.
 *
 * @param {number} id - Index transaksi pendapatan/pengeluaran
 * @param {import('./utils/dataTrasaction.mjs').Transaction[]} existingTransaction - Data transaksi yang disimpan di local storage
 * @param {'spending'|'income'} transactionType - Tipe/jenis transaksi. Nilai valid hanya 'spending' atau 'income'
 */
function promptUpdateData(id, existingTransaction, transactionType) {

  // set default data from existing data, prevent from null
  const date = prompt("Ubah tanggal:", existingTransaction[id].date) || existingTransaction[id].date;
  const amount = parseInt(prompt("Ubah jumlah uang:", existingTransaction[id].amount)) || parseInt(existingTransaction[id].amount);
  const category = prompt("Ubah kategori:", existingTransaction[id].category) || parseInt(existingTransaction[id].category);
  const desc = prompt("Ubah desc:", existingTransaction[id].desc) || parseInt(existingTransaction[id].desc);
  const newData = {
    date,
    amount,
    category,
    desc
  }

  // confirmation, if click ok then data will be updated
  confirm(`Apakah anda yakin akan mengubah data menjadi 
    ${newData.date}, ${newData.amount}, ${newData.category}, ${newData.desc}?`) &&
    updateTransaction(id, newData, existingTransaction, transactionType);
}

// NOTE: handle backup/export account
const backupAccountButton = document.getElementById("backup-account-button");
backupAccountButton.addEventListener('click', handleBackupAccount);

/**
 * Module event handler untuk menangani button backup data user.
 */
function handleBackupAccount() {
  // construct object to export
  const account = {
    name: getUsername(),
    money: getMoney(),
    spending: getOutcomeList(),
    income: getIncomeList(),
  }

  const fileType = prompt("Pilih format data yang akan di download: [json/csv] (default: json)", 'json').toString();
  if (fileType === 'json' || fileType === 'csv') {
    // create downloadable file
    const metadataFile =
      ((fileType === 'json') && exportUserData(account, 'json')) ||
      ((fileType === 'csv') && exportUserData(account, 'csv'));
    const fileName = `backup-${account.name}_money-tracking-by-b2.${metadataFile.ext}`;

    // manipulate DOM to enable download file
    backupAccountButton.setAttribute('href', metadataFile.url);
    backupAccountButton.setAttribute('download', fileName);
  } else {
    console.error("[ERR] file type not supported.");
    return;
  }

}

// NOTE: handle backup/export income
const exportIncomeUserButton = document.getElementById("export-income-json-button");
exportIncomeUserButton.addEventListener('click', handleExportIncome);

/**
 * Module event handler untuk menangani button export pendapatan user.
 */
function handleExportIncome() {
  // get data
  const data = getIncomeList();

  // create downloadable file
  const metadataFile = exportUserData(data, 'json');
  const fileName = `${getUsername()}_income-data_money-tracking-by-b2.${metadataFile.ext}`;

  // manipulate DOM to enable download file
  exportIncomeUserButton.setAttribute('href', metadataFile.url);
  exportIncomeUserButton.setAttribute('download', fileName);
}

// NOTE: handle backup/export spending
const exportSpendingUserButton = document.getElementById("export-spending-json-button");
exportSpendingUserButton.addEventListener('click', handleExportSpending);

/**
 * Module event handler untuk menangani button export pengeluaran user.
 */
function handleExportSpending() {
  // get data
  const data = getOutcomeList();

  // create downloadable file
  const metadataFile = exportUserData(data, 'json');
  const fileName = `${getUsername()}_spending-data_money-tracking-by-b2.${metadataFile.ext}`;

  // manipulate DOM to enable download file
  exportSpendingUserButton.setAttribute('href', metadataFile.url);
  exportSpendingUserButton.setAttribute('download', fileName);
}

// NOTE: handle export csv income
const exportIncomeUserCSVButton = document.getElementById("export-income-csv-button");
exportIncomeUserCSVButton.addEventListener('click', handleExportIncomeCSV);

/**
 * Module event handler untuk menangani button export pengeluaran user dalam bentuk CSV.
 */
function handleExportIncomeCSV() {
  const data = getIncomeList();

  // create downloadable file
  const metadataFile = exportUserData(data, 'csv');
  const fileName = `${getUsername()}_income-data_money-tracking-by-b2.${metadataFile.ext}`;

  // manipulate DOM to enable download file
  exportIncomeUserCSVButton.setAttribute('href', metadataFile.url);
  exportIncomeUserCSVButton.setAttribute('download', fileName);
}

// NOTE: handle export csv spending
const exportSpendingUserCSVButton = document.getElementById("export-spending-csv-button");
exportSpendingUserCSVButton.addEventListener('click', handleExportSpendingCSV);

/**
 * Module event handler untuk menangani button export pengeluaran user dalam bentuk CSV.
 */
function handleExportSpendingCSV() {
  const data = getOutcomeList();

  // create downloadable file
  const metadataFile = exportUserData(data, 'csv');
  const fileName = `${getUsername()}_spending-data_money-tracking-by-b2.${metadataFile.ext}`;

  // manipulate DOM to enable download file
  exportSpendingUserCSVButton.setAttribute('href', metadataFile.url);
  exportSpendingUserCSVButton.setAttribute('download', fileName);
}
