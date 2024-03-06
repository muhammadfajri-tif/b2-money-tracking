function formatNumber(val) {
  if (val < 1000) {
    return val;
  } else if (val < 1000000) {
    return Math.round(val / 1000) + " Ribu";
  } else if (val < 1000000000) {
    return Math.round(val / 1000000) + " Juta";
  } else {
    return Math.round(val / 1000000000) + " Miliar";
  }
}

var dailyOption = {
  chart: {
    type: "line",
    height: 350,
  },
  series: [
    {
      name: "Food",
      data: [50, 110, 155, 225, 280, 360, 400], // Sample daily spend data for food
    },
    {
      name: "Transportation",
      data: [30, 70, 105, 155, 200, 260, 285], // Sample daily spend data for transportation
    },
    {
      name: "Entertainment",
      data: [20, 45, 65, 95, 130, 170, 185], // Sample daily spend data for entertainment
    },
  ],
  xaxis: {
    categories: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"], // Days of the week
  },
  yaxis: {
    title: {
      text: "Amount (in Rupiah)",
    },
  },
  legend: {
    position: "top",
  },
  fill: {
    opacity: 1,
  },
  stroke: {
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#2ecc71", "#3498db", "#e74c3c"], // Green for Food, Blue for Transportation, Red for Entertainment
  grid: {
    borderColor: "#f1f1f1",
  },
};

var weeklyOption = {
  chart: {
    type: "bar",
    height: 350,
  },
  colors: ["#03C988", "#e7515a"], // Green for income, Red for outcome
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%", // Adjust the width of columns
      endingShape: "flat", // Columns with flat ending
    },
  },
  series: [
    {
      name: "Income",
      // income data for each week of ratusan ribu dynamic
      data: [125000, 530000, 325000, 124000, 750000],
    },
    {
      name: "Outcome",
      // outcome data for each week of ratusan ribu dynamic
      data: [100000, 450000, 300000, 100000, 600000],
    },
  ],
  xaxis: {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"], // Weeks of the month
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
  },
  legend: {
    position: "top",
  },
  fill: {
    opacity: 1,
  },
  dataLabels: {
    enabled: true,
    formatter: formatNumber,
    style: {
      fontSize: "8px",
    },
  },
};

var monthlyOption = {
  chart: {
    type: "bar",
    height: 350,
  },
  colors: ["#03C988", "#e7515a"], // Green for income, Red for outcome
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%", // Adjust the width of columns
      endingShape: "flat", // Columns with flat ending
    },
  },
  series: [
    {
      name: "Income",
      // income data for each month of ratusan ribu dynamic
      data: [1250000, 5300000, 3250000, 1240000, 7500000],
    },
    {
      name: "Outcome",
      // outcome data for each month of ratusan ribu dynamic
      data: [1000000, 4500000, 3000000, 1000000, 6000000],
    },
  ],
  xaxis: {
    categories: ["January", "February", "March", "April", "May"], // Months of the year
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
  },
  legend: {
    position: "top",
  },
  fill: {
    opacity: 1,
  },
  dataLabels: {
    enabled: true,
    formatter: formatNumber,
    style: {
      fontSize: "8px",
    },
  },
};

document.addEventListener("DOMContentLoaded", function (event) {
  var dailyChart = new ApexCharts(
    document.querySelector("#dailyChart"),
    dailyOption
  );
  var weeklyChart = new ApexCharts(
    document.querySelector("#weeklyChart"),
    weeklyOption
  );
  var monthlyChart = new ApexCharts(
    document.querySelector("#monthlyChart"),
    monthlyOption
  );
  weeklyChart.render();
  dailyChart.render();
  monthlyChart.render();
});
