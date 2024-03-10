import { getUsername, getMoney } from "./dataTrasaction.mjs";

import {
  initializeDataToLocalStorage,
  loadFileContent,
  isDataValid,
  importCSVUserData
} from "./file.mjs";

// handle form file upload untuk import data
const fileSelector = document.getElementById("file-select"); // must be appropriate
fileSelector.addEventListener("change", readFile, false);

/**
 * Module event handler untuk membaca file CSV pengelola keuangan
 */
function readFile() {
  // check if DOM File API is supported/not
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    console.log("PLEASE ENABLE/USE BROWSER WITH HTML5 SUPPORT");
    console.error("The File APIs are not fully supported in this browser.");
    return;
  }

  // check file
  if (!fileSelector.files) {
    console.error(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!fileSelector.files[0]) {
    console.warn("No file selected.");
  } else {
    /**
     * get file
     * @type {File}
     */
    let file = fileSelector.files[0];

    // baca isi file data & handle
    loadFileContent(file, (reader) => {
      // validate data
      if (isDataValid(reader.target.result, file.type)) {
        // save data to local storage
        (file.type === 'application/json') && initializeDataToLocalStorage(JSON.parse(reader.target.result));
        (file.type === 'text/csv') && initializeDataToLocalStorage(importCSVUserData(reader.target.result));
      } else {
        console.error("File type not supported!");
      }
    });
  }
}

// handle form buat akun baru
const formCreateUserSelector = document.getElementById("new-account-form");
formCreateUserSelector.addEventListener("submit", handleCreateNewAccount);

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
    income: [],
  };

  // validate if there's existing account/data
  if (getUsername() !== null && getMoney() !== null) {
    // TODO: ganti sweet alert
    if (
      confirm(
        "Terdapat data dari akun sebelumnya. Membuat akun baru akan menghapus semua data dari akun sebelumnya. Agar data akun sebelumnya tidak terhapus, pastikan backup /export data terlebih dahulu. Apakah akan membuat akun baru ? "
      )
    ) {
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
