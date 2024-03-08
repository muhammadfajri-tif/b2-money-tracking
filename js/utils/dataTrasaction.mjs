/**
 * @typedef {Object} Transaction transaksi pengeluaran/pemasukan uang
 * @property {Date} date - tanggal transaksi dibuat
 * @property {number} amount - jumlah uang yang masuk/keluar saat transaksi
 * @property {String} category - kategori jenis transaksi
 * @property {String} desc - deskripsi transaksi
 */

/**
 * @typedef {Object} TransactionSummary rekap transaksi bulanan/tahunan/harian
 * @property {String} name - identifier untuk transaksi. Misalnya week10
 * @property {number} spending - total pengeluaran
 * @property {number} income - total pendapatan
 */

/**
 * @typedef {Object} UserFinancialData - rekap data keuangan pengguna
 * @property {String} name - Nama pengguna
 * @property {number} money - Uang yang pertama kali dimiliki
 * @property {Transaction[]} spending - List pengeluaran keuangan
 * @property {Transaction[]} income - List pemasukan keuangan
 */


/**
 * Getter untuk mendapatkan username 
 *
 * @returns {string} - nama pengguna
 */
export function getUsername() {
  return window.localStorage.getItem("name");
}

/**
 * Getter untuk mendapatkan jumlah Uang
 *
 * @returns {number} - jumlah uang yang dimiliki pengguna
 */
export function getMoney() {
  return window.localStorage.getItem("money");
}

/**
 * Getter untuk mendapatkan list pengeluaran pengguna.
 *
 * @returns {Transaction[]} - Daftar transaksi pengeluaran
 */
export function getSpendingList() {
  return JSON.parse(window.localStorage.getItem("spending"));
}

/**
 * Getter untuk mendapatkan list pendapatan pengguna.
 *
 * @returns {Transaction[]} - Daftar transaksi pendapatan
 */
export function getIncomeList() {
  return JSON.parse(window.localStorage.getItem("income"));
}

/**
 * Module untuk menambah data pendapatan/pengeluaran transaksi
 *
 * @param {Transaction} newTransaction - data transaksi dari form
 * @param {'spending'|'income'} typeTransaction - Tipe transaksi. Nilai yang valid adalah 'spending' atau 'income'
 */
export function addNewIncome(newTransaction, typeTransaction) {
  // validate type transaction
  if (typeTransaction !== 'spending' && typeTransaction !== 'income') {
    console.error('`typeTransaction` tidak valid. Opsi hanya tersedia spending atau income');
    return;
  }

  // load existing data
  const existingTransaction =
    ((typeTransaction === 'spending') && (getSpendingList() || [])) ||
    ((typeTransaction === 'income') && (getIncomeList() || []));

  // append new data to existing data
  existingTransaction.push(newTransaction);

  // sort by date
  existingTransaction.sort((a, b) => parseDate(a.date) - parseDate(b.date));
  console.log(`[SORTED] current ${typeTransaction}`, existingTransaction);

  // save to the local storage
  (typeTransaction === 'income') && window.localStorage.setItem("income", JSON.stringify(existingTransaction));
  (typeTransaction === 'spending') && window.localStorage.setItem("spending", JSON.stringify(existingTransaction));
}

/**
 * Module untuk mengubah tanggal (hh/bb/tttt) dari bentuk string ke Date.
 *
 * @param {String} date_str - tanggal berbentuk string. Biasanya digunakan untuk `Transaction.date`
 * @returns {Date} tanggal yang sudah diformat ke bentuk Date
 */
export function parseDate(date_str) {
  const [day, month, year] = date_str.split("/");
  return new Date(year, month - 1, day);
}

/**
 * Module untuk me-format data dari form ke bentuk object javascript.
 *
 * @param {FormData} form - Form data
 * @param {'spending'|'income'} typeTransaction - Tipe transaksi antara pengeluaran atau pendapatan
 * @returns {Transaction} Data transaksi data
 */
export function parseFormData(form, typeTransaction) {
  // validate type transaction
  if (typeTransaction !== 'spending' && typeTransaction !== 'income') {
    console.error('`typeTransaction` tidak valid. Opsi hanya tersedia spending atau income');
    return;
  }

  const parseData = {};
  // convert form date to type date with dd/mm/yyyy format
  parseData["date"] = new Date(form.get(`date-${typeTransaction}`)).toLocaleDateString('en-GB');
  parseData["amount"] = parseInt(form.get(`amount-${typeTransaction}`));
  parseData["category"] = form.get(`category-${typeTransaction}`);
  parseData["desc"] = form.get(`desc-${typeTransaction}`);

  return parseData;
}

/**
 * Module untuk mendapatkan jumlah pekan.
 *
 * @param {Date} date - tanggal pertama kali transaksi
 * @returns {number} total jumlah pekan
 */
export function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((date - oneJan) / (7 * 24 * 60 * 60 * 1000));
}

/**
 * Module untuk mendapatkan jumlah pemasukan dan pengeluaran per pekan.
 *
 * @param {{spending: Transaction[], income: Transaction[]}} data - daftar pendapatan/pengeluaran pengguna
 * @param {TransactionSummary} weekly_sums - object penampung rekap
 * @param {'spending'|'income'} transactionType - Tipe transaksi. Opsi valid hanya spending / income.
 * @returns {TransactionSummary} rekap data pendapatan dan pengeluaran mingguan
 */
export function getWeeklyTransaction(data, weekly_sums, transactionType) {
  for (const transaction of data[transactionType]) {
    const date = parseDate(transaction["date"]);
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    const weekKey = `${year}-Week${weekNumber}`;
    if (!(weekKey in weekly_sums)) {
      weekly_sums[weekKey] = { spending: 0, income: 0 };

    }
    weekly_sums[weekKey][transactionType] += transaction["amount"];
  }
  return weekly_sums;
}

/**
 * Module untuk mendapatkan total hasil rekap transaksi pengeluaran dan pemasukan per minggu 
 *
 * @returns {TransactionSummary} total hasil rekap mingguan
 */
export function getWeeklyMoney() {
  const spending = getSpendingList();
  const income = getIncomeList();
  const data = {
    spending,
    income,
  };

  const weekly_sums = {};
  getWeeklyTransaction(data, weekly_sums, "spending");
  getWeeklyTransaction(data, weekly_sums, "income");

  const result = Object.keys(weekly_sums).map(key => ({
    name: key.split("-")[1],
    spending: weekly_sums[key].spending,
    income: weekly_sums[key].income,
  }));
  return result;
}

