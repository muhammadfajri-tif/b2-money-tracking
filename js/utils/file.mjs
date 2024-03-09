/**
 * @typedef {Object} Transaction transaksi pengeluaran/pemasukan uang
 * @property {Date} date - tanggal transaksi dibuat
 * @property {number} amount - jumlah uang yang masuk/keluar saat transaksi
 * @property {String} category - kategori jenis transaksi
 * @property {String} desc - deskripsi transaksi
 */

/**
 * @typedef {Object} UserFinancialData - rekap data keuangan pengguna
 * @property {String} name - Nama pengguna
 * @property {number} money - Uang yang pertama kali dimiliki
 * @property {Transaction[]} spending - List pengeluaran keuangan
 * @property {Transaction[]} income - List pemasukan keuangan
 */

/**
 * @typedef {Object} BackupAccountBlob - Informasi/metadata file backup akun user.
 * @property {String} url - URL file
 * @property {UserFinancialData} data - data akun pengguna
 * @property {String} type - tipe/format data dalam file
 * @property {String} charset - character encoding
 */

/**
 * Callback function untuk me-handle file yang di load.
 *
 * @callback fileOnloadCallback
 * @param {Event} reader - file reader event
 */

/**
 * Modul untuk memuat isi data dari suatu file
 *
 * @param {File} file - File yang di di load dari element HTML
 * @param {fileOnloadCallback} onloadCallback - Callback function yang akan me-handle file saat di load.
 */
export function loadFileContent(file, onloadCallback) {
  const reader = new FileReader(); // declare file reader
  reader.onload = onloadCallback;
  reader.readAsText(file); // attach/read file to file reader as a text
}

/**
 * Function untuk melakukan validasi data yang di load dari file. File yang valid hanya json dan csv.
 *
 * @param {String} rawData - data/isi file dalam bentuk string
 * @param {String} fileType - tipe file dibaca. Misalnya 'application/json' atau 'text/csv'
 * @returns {boolean} status validasi data
 */
export function isDataValid(rawData, fileType) {
  // validate json file
  if (fileType === 'application/json') {
    // convert to JSON/object
    const parsedData = JSON.parse(rawData);
    // validate each property in object
    return ('name' in parsedData && 'money' in parsedData && 'income' in parsedData && 'spending' in parsedData) ? true : false;
  } else {
    return false;
  }
}

/**
 * Module untuk menginisalisasi penyimpanan data keuangan ke local storage browser.
 *
 * @param {UserFinancialData} data - data keuangan user dalam bentuk object/JSON
 */
export function initializeDataToLocalStorage(data) {
  // clear current data if available
  if (window.localStorage.getItem("name") !== data.name || window.localStorage.length !== 0) window.localStorage.clear();

  window.localStorage.setItem("name", data.name);
  window.localStorage.setItem("money", data.money);
  window.localStorage.setItem("spending", JSON.stringify(data.spending));
  window.localStorage.setItem("income", JSON.stringify(data.income));
}

/**
 * Module untuk melakan export/backup akun user ke dalam bentuk json file.
 *
 * @returns {[TODO:type]} [TODO:description]
 */
/**
 * Module untuk melakan export/backup akun user ke dalam bentuk json file.
 *
 * @param {UserFinancialData} account - data keuangan user
 * @returns {BackupAccountBlob} - Metadata file backup akun user
 */
export function exportUserDataToJSON(accountData) {
  // create file information
  const type = 'application/json';
  const charset = 'utf-8';

  // construct new blob file
  const blob = new Blob([JSON.stringify(accountData)], { type: `${type};charset=${charset},` });
  const url = URL.createObjectURL(blob);


  return {
    url,
    data: accountData,
    type,
    charset
  }
}

function csvJSON(data) {
  const lines = data.split("\n");
  const result = {
    name: "",
    money: 0,
    spending: [],
    income: []
  };
  const headers = lines[0].split(",");

  // loop csv total number of lines
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;

    const currentline = lines[i].split(",");

    // for spending/income
    const trasaction = {
      date: "",
      amount: 0,
      category: "",
      desc: ""
    };

    // loop for record each line
    for (let j = 0; j < headers.length; j++) {
      if (headers[j] === "name") result.name = currentline[j];
      if (headers[j] === "money") result.money = currentline[j];

      if (headers[j].includes("date")) trasaction.date = currentline[j];
      if (headers[j].includes("amount")) trasaction.amount = currentline[j];
      if (headers[j].includes("category")) trasaction.category = currentline[j];
      if (headers[j].includes("desc")) trasaction.desc = currentline[j];

      console.log("here", headers[j].split("_")[2]);

      if (j > 1) (headers[j].split("_")[2] === headers[j + 1].split("_")[0] || j === headers.length - 1) &&
        result[headers[j].split("_")[0]].push(trasaction);
    }
  }

  return result;
}
