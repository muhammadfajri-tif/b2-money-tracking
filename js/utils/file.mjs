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
 * @property {String} ext - File extension
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
  } else if (fileType === 'text/csv') {
    // validate by header
    return (rawData.indexOf('name') && rawData.indexOf('money') && rawData.indexOf('type')) ? true : false;
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
 * Module untuk mengimport akun user dalam bentuk CSV
 *
 * @param {String} accountData - isi file CSV
 * @returns {UserFinancialData} Data keuangan user
 */
export function importCSVUserData(accountData) {
  const data = {
    name: "",
    money: "",
    spending: [],
    income: []
  }

  const records = accountData.split("\n");
  const headers = records[0].split(",");
  records.pop(); // delete empty new line

  // loop csv total number of lines
  records.forEach((record, id) => {
    let currentRecord = record.split(","); // 0: name, 1: money, 2: type, 3: date, 4: amount, 5: category, 6: desc
    // get name & amount money in the first record
    if (id === 1) {
      data.name = currentRecord[0].replace(/"/g, "");
      data.money = parseInt(currentRecord[1]);
    }

    // skip header
    if (id > 0) {
      let transaction = {};
      // fill transaction data
      for (let i = 3; i < headers.length; i++) {
        headers[i] = headers[i].replace(/"/g, "");
        if (i === 4) {
          transaction[headers[i]] = parseInt(currentRecord[i]);
        } else {
          currentRecord[i] = currentRecord[i].replace(/"/g, "");
          transaction[headers[i]] = currentRecord[i];
        }
      }

      // push to spesific property
      currentRecord[2] = currentRecord[2].replace(/\"/g, "");
      if (currentRecord[2] === ("spending")) data.spending.push(transaction);
      if (currentRecord[2] === ("income")) data.income.push(transaction);
    }
  });
  return data;
}

/**
 * Module untuk melakan export/backup akun user ke dalam bentuk json file.
 *
 * @param {UserFinancialData} accountData - data keuangan user
 * @param {'json'|'csv'} formatType 
 * @returns {BackupAccountBlob} - Metadata file backup akun user
 */
export function exportUserData(accountData, formatType) {
  // create file information
  const type =
    ((formatType === 'json') && 'application/json') ||
    ((formatType === 'csv') && 'text/csv');
  const charset = 'utf-8';

  // construct new blob file
  const content =
    ((formatType === 'json') && JSON.stringify(accountData)) ||
    ((formatType === 'csv') && Array.isArray(accountData) ? jsonToCSV(accountData) : convertAccountDataToCSV(accountData));
  const blob = new Blob([content], { type: `${type};charset=${charset},` });
  const url = URL.createObjectURL(blob);


  return {
    url,
    data: accountData,
    type,
    charset,
    ext: (formatType === 'csv' && 'csv') || (formatType === 'json' && 'json')
  }
}

/**
 * Module untuk melakukan konversi akun user beserta datanya dalam bentuk JSON ke CSV.
 *
 * @param {UserFinancialData} data - Data transaksi dan informasi akun user
 * @returns {String} Data yang telah di format menjadi CSV dalam bentuk string.
 */
export function convertAccountDataToCSV(data) {
  // construct header data
  let header = [];
  // get each field name 
  for (let key in data)
    (Array.isArray(data[key])) ? header.push("type", Object.keys(data[key][0])) : header.push(key);
  // remove duplicate
  header = header.flat().filter((item, id) => header.flat().indexOf(item) === id);
  // convert to string, remove parenthesis/brackets
  header = JSON.stringify(header).replace(/[\[\]']+/g, '');

  // construct actual data
  let csv = `${header}\n`;

  // insert spending data
  data.spending.forEach((transaction, id) => {
    csv += `${id === 0 ? '"' + data.name + '"' : ""},${id === 0 ? data.money : ""},"spending","${transaction.date}",${transaction.amount},"${transaction.category}","${transaction.desc || ""}"\n`;
  });

  // insert income data
  data.income.forEach(transaction => {
    csv += `,,"income","${transaction.date}",${transaction.amount},"${transaction.category}","${transaction.desc || ""}"\n`;
  });

  return csv;
}

/**
 * Module untuk melakukan konversi tipe data JSON ke CSV.
 *
 * @param {Transaction[]} data - Data transaksi pengeluaran/pemasukan.
 * @returns {String} Data yang telah di format menjadi CSV dalam bentuk string.
 */
export function jsonToCSV(data) {
  const replacer = (_key, value) => value === null ? '' : value;
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','),
    ...data.map(row => header.map(field => JSON.stringify(row[field], replacer)).join(','))
  ].join('\n');

  return csv;
}

/**
 * Module untuk melakukan konversi tipe data CSV ke JSON.
 *
 * @param {Transaction[]} data - Data transaksi pengeluaran/pemasukan dalam bentuk CSV.
 * @returns {String} Data yang telah di format menjadi JSON dalam bentuk string.
 */
export function csvToJSON(data) {
  const records = data.split("\n");
  const headers = records[0].split(",");
  const result = [];

  // loop csv total number of lines
  records.forEach((record, id) => {
    if (id > 0) {
      let transaction = {};
      let currentRecord = record.split(",");

      for (let i = 0; i < headers.length; i++)
        transaction[headers[i]] = currentRecord[i];

      result.push(transaction);
    }
  });

  return JSON.stringify(result);
}

