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

export function getUsername() {
  return window.localStorage.getItem("name");
}

export function getMoney() {
  return window.localStorage.getItem("money");
}

export function getSpendingList() {
  return JSON.parse(window.localStorage.getItem("spending"));
}

export function getIncomeList() {
  return JSON.parse(window.localStorage.getItem("income"));
}


// TODO: Set new data
// TODO: sort transaction (income/spending) based on date
// TODO: export to file (csv/json)
