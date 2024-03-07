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
export function getWeeklyMoney() {
  const spending = getSpendingList();
  const income = getIncomeList();
  const data = {
    spending: spending,
    income: income,
  };
  const weekly_sums = {};

  function parseDate(date_str) {
    const [day, month, year] = date_str.split("/");
    return new Date(year, month - 1, day);
  }

  function getWeekNumber(date) {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const difference = date - oneJan;
    const week = Math.ceil(difference / (7 * 24 * 60 * 60 * 1000));
    return week;
  }

  for (const transaction of data["spending"]) {
    const date = parseDate(transaction["date"]);
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    const weekKey = `${year}-Week${weekNumber}`;
    if (!(weekKey in weekly_sums)) {
      weekly_sums[weekKey] = { spending: 0, income: 0 };
    }
    weekly_sums[weekKey].spending += transaction["amount"];
  }

  for (const transaction of data["income"]) {
    const date = parseDate(transaction["date"]);
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    const weekKey = `${year}-Week${weekNumber}`;
    if (!(weekKey in weekly_sums)) {
      weekly_sums[weekKey] = { spending: 0, income: 0 };
    }
    weekly_sums[weekKey].income += transaction["amount"];
  }

  const result = Object.keys(weekly_sums).map((key) => ({
    name: key.split("-")[1],
    spending: weekly_sums[key].spending,
    income: weekly_sums[key].income,
  }));
  return result;
}

// TODO: Set new data
// TODO: sort transaction (income/spending) based on date
// TODO: export to file (csv/json)
