
import { loadFileContent, isDataValid, initializeDataToLocalStorage } from './utils/file.mjs';
import { getUsername, getMoney, getIncomeList, getSpendingList, addNewIncome, parseDate, parseFormData } from './utils/dataTrasaction.mjs'

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


// TODO
// - Form create new user (not by import)
// - export income as json/csv
// - export spending as json/csv
