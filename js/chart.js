import { getWeeklyMoney } from "./utils/dataTrasaction.mjs";

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

const weeklySums = getWeeklyMoney();

console.log(weeklySums);

// Extract income and outcome data from the weekly sums
const incomeData = weeklySums.map((week) => week.income); // Extracts the sum for each week
const outcomeData = weeklySums.map((week) => week.spending); // Extracts the sum for each week
console.log(incomeData);
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
  xaxis: {},
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

// Update the series data in your chart options
weeklyOption.series = [
  {
    name: "Income",
    data: incomeData,
  },
  {
    name: "Outcome",
    data: outcomeData,
  },
];

// Update the x-axis categories if needed (assuming weeks are available in weeklySums)
weeklyOption.xaxis.categories = weeklySums.map((week) => week.name);

// Now, you can use weeklyOption to initialize your chart

// Extract income and outcome data from the weekly sums
// const incomeData = weeklySums.map((week) => week.sum); // Extracts the sum for each week
// const outcomeData = weeklySums.map

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
