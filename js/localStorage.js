import { exportUserData } from './utils/file.mjs';
import { getUsername, getMoney, getIncomeList, getSpendingList } from './utils/dataTrasaction.mjs'

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
    spending: getSpendingList(),
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
  const data = getSpendingList();

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
  const data = getSpendingList();

  // create downloadable file
  const metadataFile = exportUserData(data, 'csv');
  const fileName = `${getUsername()}_spending-data_money-tracking-by-b2.${metadataFile.ext}`;

  // manipulate DOM to enable download file
  exportSpendingUserCSVButton.setAttribute('href', metadataFile.url);
  exportSpendingUserCSVButton.setAttribute('download', fileName);
}
