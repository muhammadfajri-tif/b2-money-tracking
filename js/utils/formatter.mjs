const amountIncome = document.getElementById("amount-income");
const amountSpending = document.getElementById("amount-spending");
// Function to format input as Indonesian Rupiah (IDR)
function formatRupiah(amount) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(amount);
}

// Event listener for input value change
amountIncome.addEventListener("input", function () {
  // Remove non-numeric characters
  let amount = this.value.replace(/\D/g, "");

  // Format amount in Rupiah currency
  let formattedAmount = formatRupiah(amount);

  this.value = formattedAmount;
});

amountSpending.addEventListener("input", function () {
  // Remove non-numeric characters
  let amount = this.value.replace(/\D/g, "");

  // Format amount in Rupiah currency
  let formattedAmount = formatRupiah(amount);

  this.value = formattedAmount;
});
