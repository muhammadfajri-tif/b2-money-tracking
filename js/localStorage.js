import { loadFileContent, isDataValid, initializeDataToLocalStorage, exportUserDataToJSON } from './utils/file.mjs';
import { getUsername, getMoney, getIncomeList, getSpendingList, addNewIncome, parseDate, parseFormData, getOutcomeList } from './utils/dataTrasaction.mjs'

// handle form file upload untuk import data
const fileSelector = document.getElementById('file-select'); // must be appropriate
fileSelector.addEventListener('change', readFile, false);

/**
 * Module event handler untuk membaca file CSV pengelola keuangan
 */
function readFile() {
  // check if DOM File API is supported/not
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    console.log('PLEASE ENABLE/USE BROWSER WITH HTML5 SUPPORT');
    console.error('The File APIs are not fully supported in this browser.');
    return;
  }

  // check file
  if (!fileSelector.files) {
    console.error(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!fileSelector.files[0]) {
    console.warn('No file selected.');
  } else {
    // get file
    let file = fileSelector.files[0];

    // baca isi file data & handle
    loadFileContent(file, reader => {
      // validate data
      if (isDataValid(reader.target.result, file.type)) {
        // save data to local storage
        initializeDataToLocalStorage(JSON.parse(reader.target.result));
        console.log("loaded ", reader.target.result);
      } else {
        console.error("File type not supported!");
      }

    });
  }
}
// handle form tambah pendapatan
const formAddIncomeSelector = document.getElementById('add-income-form');
formAddIncomeSelector.addEventListener('submit', handleAddIncomeFrom);


/**
 * Module event handler untuk menangani data pemasukan baru 
 *
 * @param {Event} event - event on submit
 */
function handleAddIncomeFrom(event) {
  event.preventDefault();

  const form = new FormData(formAddIncomeSelector);

  const parseData = parseFormData(form, 'income');
  console.log("income", parseData);

  addNewIncome(parseData, "income");
}

// handle form tambah pengeluaran
const formAddSpendingSelector = document.getElementById('add-spending-form');
formAddSpendingSelector.addEventListener('submit', handleAddSpendingForm);

/**
 * Module event handler untuk menangani data pengeluaran baru
 *
 * @param {Event} event - event on submit
 */
function handleAddSpendingForm(event) {
  event.preventDefault();

  const form = new FormData(formAddSpendingSelector);

  const parseData = parseFormData(form, 'spending');
  console.log("spending", parseData);

  addNewIncome(parseData, 'spending');
}

// handle form buat akun baru
const formCreateUserSelector = document.getElementById("new-account-form");
formCreateUserSelector.addEventListener('submit', handleCreateNewAccount);

/**
 * Module event handler untuk menangani akun/user baru
 *
 * @param {Event} event
 */
function handleCreateNewAccount(event) {
  event.preventDefault();

  const form = new FormData(formCreateUserSelector);
  console.log("create new account", form);

  // parse form data
  const name = form.get("new-account-name");
  const money = parseInt(form.get("new-account-money"));

  const newAccount = {
    name,
    money,
    spending: [],
    income: []
  };

  // validate if there's existing account/data
  if (getUsername() !== null && getMoney() !== null) {
    // TODO: ganti sweet alert
    if (confirm("Terdapat data dari akun sebelumnya. Membuat akun baru akan menghapus semua data dari akun sebelumnya. Agar data akun sebelumnya tidak terhapus, pastikan backup /export data terlebih dahulu. Apakah akan membuat akun baru ? ")) {
      initializeDataToLocalStorage(newAccount);
      alert("user baru berhasil dibuat");
    } else {
      alert("user baru gagal dibuat");
    }
  } else {
    // no existing account/data
    initializeDataToLocalStorage(newAccount);
    alert("user baru berhasil dibuat");
  }
}

// handle backup/export account
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

  // create downloadable file
  const metadataFile = exportUserDataToJSON(account);
  const fileName = `backup-${account.name}_money-tracking-by-b2.json`;

  // manipulate DOM to enable download file
  backupAccountButton.setAttribute('href', metadataFile.url);
  backupAccountButton.setAttribute('download', fileName);
}

// handle backup/export income
const exportIncomeUserButton = document.getElementById("export-income-json-button");
exportIncomeUserButton.addEventListener('click', handleExportIncome);

/**
 * Module event handler untuk menangani button export pendapatan user.
 */
function handleExportIncome() {
  // get data
  const data = getIncomeList();

  // create downloadable file
  const metadataFile = exportUserDataToJSON(data);
  const fileName = `${getUsername()}_income-data_money-tracking-by-b2.json`;

  // manipulate DOM to enable download file
  exportIncomeUserButton.setAttribute('href', metadataFile.url);
  exportIncomeUserButton.setAttribute('download', fileName);
}

// handle backup/export spending
const exportSpendingUserButton = document.getElementById("export-spending-json-button");
exportSpendingUserButton.addEventListener('click', handleExportSpending);

/**
 * Module event handler untuk menangani button export pengeluaran user.
 */
function handleExportSpending() {
  // get data
  const data = getSpendingList();

  // create downloadable file
  const metadataFile = exportUserDataToJSON(data);
  const fileName = `${getUsername()}_spending-data_money-tracking-by-b2.json`;

  // manipulate DOM to enable download file
  exportSpendingUserButton.setAttribute('href', metadataFile.url);
  exportSpendingUserButton.setAttribute('download', fileName);
}


// TODO
// - export income as csv
// - export spending as csv
