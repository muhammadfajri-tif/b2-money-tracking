import {
  getIncomeDataWithCategory,
  getWeeklyMoney,
  getSpendingDataWithCategory,
  getIncomeList,
  getOutcomeList,
} from "./utils/dataTrasaction.mjs";

document.getElementById("filterDay").addEventListener("click", () => {
  updateDashboardChart("1D");
});
document.getElementById("filterWeek").addEventListener("click", () => {
  updateDashboardChart("1W");
});
document.getElementById("filterMonth").addEventListener("click", () => {
  updateDashboardChart("1M");
});
document.getElementById("filterYear").addEventListener("click", () => {
  updateDashboardChart("1Y");
});
document.getElementById("filterAll").addEventListener("click", () => {
  updateDashboardChart("ALL");
});
const filterButtons = document.querySelectorAll(".filter-item");
filterButtons.forEach((button) => {
  // if click active button then remove active class
  button.addEventListener("click", () => {
    // if click active button then remove active class
    if (button.classList.contains("active")) {
      button.classList.remove("active");
    } else {
      // remove active class from all buttons
      filterButtons.forEach((button) => {
        button.classList.remove("active");
      });
      // add active class to the clicked button
      button.classList.add("active");
    }
  });
});

var colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#00D9E9",
  "#FF66C3",
];

const weeklySums = getWeeklyMoney();
const incomeData = weeklySums.map((week) => week.income);
const outcomeData = weeklySums.map((week) => week.spending);

function updateQuarterChart(sourceChart, destChartIDToUpdate) {
  var series = [];
  var seriesIndex = 0;
  var colors = [];
  if (sourceChart.w.globals.selectedDataPoints[0]) {
    var selectedPoints = sourceChart.w.globals.selectedDataPoints;
    for (var i = 0; i < selectedPoints[seriesIndex].length; i++) {
      var selectedIndex = selectedPoints[seriesIndex][i];
      var yearSeries = sourceChart.w.config.series[seriesIndex];
      series.push({
        name: yearSeries.data[selectedIndex].x,
        data: yearSeries.data[selectedIndex].quarters,
      });
      colors.push(yearSeries.data[selectedIndex].color);
    }
    if (series.length === 0)
      series = [
        {
          data: [],
        },
      ];
    return ApexCharts.exec(destChartIDToUpdate, "updateOptions", {
      series: series,
      colors: colors,
      fill: {
        colors: colors,
      },
    });
  }
}

function shuffleArray() {
  var array = [
    {
      y: 400,
      quarters: [
        {
          x: "Q1",
          y: 120,
        },
        {
          x: "Q2",
          y: 90,
        },
        {
          x: "Q3",
          y: 100,
        },
        {
          x: "Q4",
          y: 90,
        },
      ],
    },
    {
      y: 430,
      quarters: [
        {
          x: "Q1",
          y: 120,
        },
        {
          x: "Q2",
          y: 110,
        },
        {
          x: "Q3",
          y: 90,
        },
        {
          x: "Q4",
          y: 110,
        },
      ],
    },
    {
      y: 448,
      quarters: [
        {
          x: "Q1",
          y: 70,
        },
        {
          x: "Q2",
          y: 100,
        },
        {
          x: "Q3",
          y: 140,
        },
        {
          x: "Q4",
          y: 138,
        },
      ],
    },
    {
      y: 470,
      quarters: [
        {
          x: "Q1",
          y: 150,
        },
        {
          x: "Q2",
          y: 60,
        },
        {
          x: "Q3",
          y: 190,
        },
        {
          x: "Q4",
          y: 70,
        },
      ],
    },
    {
      y: 540,
      quarters: [
        {
          x: "Q1",
          y: 120,
        },
        {
          x: "Q2",
          y: 120,
        },
        {
          x: "Q3",
          y: 130,
        },
        {
          x: "Q4",
          y: 170,
        },
      ],
    },
    {
      y: 580,
      quarters: [
        {
          x: "Q1",
          y: 170,
        },
        {
          x: "Q2",
          y: 130,
        },
        {
          x: "Q3",
          y: 120,
        },
        {
          x: "Q4",
          y: 160,
        },
      ],
    },
  ];

  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function makeData() {
  var dataSet = shuffleArray();

  var dataYearSeries = [
    {
      x: "2011",
      y: dataSet[0].y,
      color: colors[0],
      quarters: dataSet[0].quarters,
    },
    {
      x: "2012",
      y: dataSet[1].y,
      color: colors[1],
      quarters: dataSet[1].quarters,
    },
    {
      x: "2013",
      y: dataSet[2].y,
      color: colors[2],
      quarters: dataSet[2].quarters,
    },
    {
      x: "2014",
      y: dataSet[3].y,
      color: colors[3],
      quarters: dataSet[3].quarters,
    },
    {
      x: "2015",
      y: dataSet[4].y,
      color: colors[4],
      quarters: dataSet[4].quarters,
    },
    {
      x: "2016",
      y: dataSet[5].y,
      color: colors[5],
      quarters: dataSet[5].quarters,
    },
  ];

  return dataYearSeries;
}

// Function to convert date strings to Date objects
function parseDate(dateString) {
  const [day, month, year] = dateString.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

// Function to group income/outcome data by date
function groupDataByDate(data) {
  const groupedData = {};
  data.forEach((entry) => {
    const date = parseDate(entry.date);
    const key = date.toISOString().split("T")[0]; // Group by date without time
    if (!groupedData[key]) {
      groupedData[key] = { date, total: 0 };
    }
    groupedData[key].total += entry.amount;
  });
  return groupedData;
}

// Function to generate series data for the chart
function generateSeriesData(groupedData) {
  const seriesData = [];
  Object.keys(groupedData).forEach((key) => {
    seriesData.push({ x: groupedData[key].date, y: groupedData[key].total });
  });
  // Sort series data by date
  seriesData.sort((a, b) => a.x - b.x);
  return seriesData;
}

// Generate grouped income and outcome data
const groupedIncome = groupDataByDate(getIncomeList());
const groupedOutcome = groupDataByDate(getOutcomeList());

// Generate series data for income and outcome
const incomeSeries = generateSeriesData(groupedIncome);
const outcomeSeries = generateSeriesData(groupedOutcome);

// Initial data for the chart
const dashboardChartData = {
  income: incomeSeries,
  outcome: outcomeSeries,
};

console.log(dashboardChartData);

// Function to render the chart
function renderChart(data) {
  dashboardChart.updateOptions({
    series: [
      {
        name: "Income",
        data: data.income,
      },
      {
        name: "Outcome",
        data: data.outcome,
      },
    ],
  });
}

function updateDashboardChart(interval) {
  let newData;
  switch (interval) {
    case "1D":
      // Get data for 1 day
      newData = generateChartDataForInterval("1D");
      break;
    case "1W":
      // Get data for 1 week
      newData = generateChartDataForInterval("1W");
      break;
    case "1M":
      // Get data for 1 month
      newData = generateChartDataForInterval("1M");
      break;
    case "1Y":
      // Get data for 1 year
      newData = generateChartDataForInterval("1Y");
      break;
    case "ALL":
      // Get all data
      newData = dashboardChartData;
      break;
    default:
      // Default to all data
      newData = dashboardChartData;
      break;
  }
  // Update series data for the dashboardChart
  renderChart(newData);
}

// Function to generate chart data for a specific time interval
function generateChartDataForInterval(interval) {
  // Logic to generate data for the specified interval
  // Replace this with your actual implementation
  let startDate, endDate;
  switch (interval) {
    case "1D":
      // Get data for 1 day
      startDate = new Date();
      endDate = new Date();
      break;
    case "1W":
      // Get data for 1 week
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
      break;
    case "1M":
      // Get data for 1 month
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date();
      break;
    case "1Y":
      // Get data for 1 year
      // from 1 of January to 31 of December of the current year
      startDate = new Date(new Date().getFullYear(), 0, 1);
      endDate = new Date(new Date().getFullYear(), 11, 31);
      break;
    default:
      // Default to all data
      return dashboardChartData;
  }

  // Filter income and outcome data for the specified interval
  const filteredIncome = incomeSeries.filter(
    (entry) => entry.x >= startDate && entry.x <= endDate
  );

  const filteredOutcome = outcomeSeries.filter(
    (entry) => entry.x >= startDate && entry.x <= endDate
  );
  return { income: filteredIncome, outcome: filteredOutcome };
}

// Example usage:
// Assume you have HTML buttons for each interval, and onclick events call updateDashboardChart function with the respective interval
// For example:

const dashboardChartOptions = {
  id: "dashboardChart",
  series: [
    {
      name: "Income",
      data: getIncomeList().map((income) => ({
        x: parseDate(income.date),
        y: income.amount,
      })),
    },
    {
      name: "Outcome",
      data: getOutcomeList().map((outcome) => ({
        x: parseDate(outcome.date),
        y: outcome.amount,
      })),
    },
  ],
  chart: {
    type: "area",
    stacked: false,
    height: 350,
    zoom: {
      type: "x",
      enabled: true,
      autoScaleYaxis: true,
    },
    toolbar: {
      autoSelected: "zoom",
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    position: "top",
    style: {
      fontSize: "14px",
      fontFamily: "Poppins, sans-serif",
      fontWeight: "500",
    },
  },
  markers: {
    size: 0,
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0,
      stops: [0, 90, 100],
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return "Rp" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
    },
  },
  xaxis: {
    type: "datetime",
  },
};

var dailyOptions = {
  series: [
    {
      name: "Income",
      data: [44000, 55000, 41000, 64000, 22000, 43000, 21000],
    },
    {
      name: "Outcome",
      data: [53000, 32000, 33000, 52000, 13000, 44000, 32000],
    },
  ],
  chart: {
    type: "bar",
    height: 600,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      horizontal: true,
      dataLabels: {
        position: "top",
      },
    },
  },
  colors: ["#00ab55", "#805dca"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    curve: "smooth",
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  grid: {
    borderColor: "#e0e6ed",
  },
  legend: {
    position: "top",
  },
  xaxis: {
    categories: [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    labels: {
      formatter: function (val) {
        return "Rp" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
      style: {
        colors: "#78909c",
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      formatter: function (val) {
        if (typeof val !== "string") {
          return "Rp" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else {
          return val;
        }
      },
      style: {
        colors: "#78909c",
      },
    },
  },
};

var weeklyOptions = {
  colors: ["#00ab55", "#805dca"],
  chart: {
    height: 350,
    type: "bar",
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return "Rp" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#304758"],
    },
  },
  xaxis: {
    tickPlacement: "on",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val) {
        return "Rp" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
    },
  },
  legend: {
    horizontalAlign: "center",
    position: "top",
  },

  grid: {
    borderColor: "#e0e6ed",
  },
};
weeklyOptions.series = [
  {
    name: "Income",
    data: incomeData,
  },
  {
    name: "Outcome",
    data: outcomeData,
  },
];
weeklyOptions.xaxis.categories = weeklySums.map((week) => week.name);

const monthlyOptions = {
  series: [
    {
      name: "Income",
      data: [
        16800, 16800, 15500, 17800, 15500, 17000, 19000, 16000, 15000, 17000,
        14000, 17000,
      ],
    },
    {
      name: "Outcome",
      data: [
        11200, 11200, 10300, 11800, 10300, 11300, 13300, 11300, 10300, 11300,
        9300, 11300,
      ],
    },
  ],
  chart: {
    type: "area",
    height: 300,
  },
  colors: ["#00ab55", "#805dca"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [2, 2],
    curve: "smooth",
  },
  xaxis: {
    axisBorder: {
      color: "#191e3a",
    },
  },
  yaxis: {
    opposite: false,
    labels: {
      formatter: function (val) {
        return "Rp" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
    },
  },
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  legend: {
    position: "top",
  },
  grid: {
    borderColor: "#e0e6ed",
  },
};

const incomeDataWithCategory = getIncomeDataWithCategory();
const outcomeDataWithCategory = getSpendingDataWithCategory();

const incomeOptions = {
  series: incomeDataWithCategory.map((data) => data.amount),
  labels: incomeDataWithCategory.map((data) => data.category),
  chart: {
    type: "pie",
    width: "740px",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  title: {
    text: "Your Outcome Category",
    align: "left",
    margin: 20,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      fontFamily: "Poppins, sans-serif",
      color: "#263238",
    },
  },
  legend: {
    position: "right",
    fontSize: "14px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "500",
    offsetY: 100,
    itemMargin: {
      horizontal: 7,
      vertical: 7,
    },
  },
  colors: [
    "#4361ee",
    "#805dca",
    "#e2a03f",
    "#f77f00",
    "#f55236",
    "#4caf50",
    "#03a9f4",
    "#ffeb3b",
    "#9c27b0",
    "#ff5722",
    "#8bc34a",
    "#00bcd4",
    "#ffc107",
    "#2196f3",
    "#ff9800",
    "#cddc39",
    "#3f51b5",
    "#009688",
    "#ff4081",
    "#ffeb3b",
  ],
  stroke: {
    width: 2,
    colors: ["#ffffff"],
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (value) {
        return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

const outcomeOptions = {
  series: outcomeDataWithCategory.map((data) => data.amount),
  labels: outcomeDataWithCategory.map((data) => data.category),
  chart: {
    type: "pie",
    width: "600px",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  title: {
    text: "Your Income Category",
    align: "left",
    margin: 20,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "20px",
      fontWeight: "bold",
      fontFamily: "Poppins, sans-serif",
      color: "#263238",
    },
  },
  legend: {
    position: "right",
    fontSize: "14px",
    fontFamily: "Roboto, sans-serif",
    fontWeight: "500",
    offsetY: 100,
    itemMargin: {
      horizontal: 7,
      vertical: 7,
    },
  },
  colors: [
    "#8bc34a",
    "#00bcd4",
    "#ffc107",
    "#2196f3",
    "#ff9800",
    "#cddc39",
    "#3f51b5",
    "#009688",
    "#ff4081",
    "#ffeb3b",
  ],
  stroke: {
    width: 2,
    colors: ["#ffffff"],
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: function (value) {
        return "Rp " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
};

var yearlyOptions = {
  chart: {
    id: "barYear",
    height: 400,
    width: "100%",
    type: "bar",
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: true,
      endingShape: "arrow",
      barHeight: "75%",
      dataLabels: {
        position: "bottom",
      },
    },
  },
  dataLabels: {
    enabled: true,
    textAnchor: "start",
    style: {
      colors: ["#fff"],
    },
    formatter: function (val, opt) {
      return opt.w.globals.labels[opt.dataPointIndex];
    },
    offsetX: 0,
    dropShadow: {
      enabled: true,
    },
  },
  colors: colors,
  series: [
    {
      data: makeData(),
    },
  ],
  states: {
    normal: {
      filter: {
        type: "desaturate",
      },
    },
    active: {
      allowMultipleDataPointsSelection: true,
      filter: {
        type: "darken",
        value: 1,
      },
    },
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (val, opts) {
          return opts.w.globals.labels[opts.dataPointIndex];
        },
      },
    },
  },
  title: {
    text: "Yearly Spend",
    offsetX: 15,
  },
  subtitle: {
    text: "(Click on bar to see details)",
    offsetX: 15,
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
};

var quartersOptions = {
  chart: {
    id: "barQuarter",
    height: 400,
    width: "100%",
    type: "bar",
    stacked: true,
  },
  plotOptions: {
    bar: {
      columnWidth: "50%",
      horizontal: false,
    },
  },
  series: [
    {
      data: [],
    },
  ],
  legend: {
    show: false,
  },
  grid: {
    yaxis: {
      lines: {
        show: false,
      },
    },
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  title: {
    text: "Quarterly Results",
    offsetX: 10,
  },
  tooltip: {
    x: {
      formatter: function (val, opts) {
        return opts.w.globals.seriesNames[opts.seriesIndex];
      },
    },
    y: {
      title: {
        formatter: function (val, opts) {
          return opts.w.globals.labels[opts.dataPointIndex];
        },
      },
    },
  },
};

var dailyChart = new ApexCharts(
  document.querySelector("#dailyChart"),
  dailyOptions
);
var weeklyChart = new ApexCharts(
  document.querySelector("#weeklyChart"),
  weeklyOptions
);
var monthlyChart = new ApexCharts(
  document.querySelector("#monthlyChart"),
  monthlyOptions
);
var incomeChart = new ApexCharts(
  document.querySelector("#incomeChart"),
  incomeOptions
);
var outcomeChart = new ApexCharts(
  document.querySelector("#outcomeChart"),
  outcomeOptions
);
var yearlyChart = new ApexCharts(
  document.querySelector("#yearlyChart"),
  yearlyOptions
);
var quartersChart = new ApexCharts(
  document.querySelector("#quartersChart"),
  quartersOptions
);
var dashboardChart = new ApexCharts(
  document.querySelector("#dashboardChart"),
  dashboardChartOptions
);

weeklyChart.render();
dailyChart.render();
monthlyChart.render();
incomeChart.render();
outcomeChart.render();
yearlyChart.render();
quartersChart.render();
dashboardChart.render();

yearlyChart.addEventListener("dataPointSelection", function (e, chart, opts) {
  var quartersChartEl = document.querySelector("#quartersChart");
  var yearlyChartEl = document.querySelector("#yearlyChart");
  if (opts.selectedDataPoints[0].length === 1) {
    if (quartersChartEl.classList.contains("active")) {
      updateQuarterChart(chart, "barQuarter");
    } else {
      yearlyChartEl.classList.add("quartersChart-activated");
      quartersChartEl.classList.add("active");
      updateQuarterChart(chart, "barQuarter");
    }
  } else {
    updateQuarterChart(chart, "barQuarter");
  }
  if (opts.selectedDataPoints[0].length === 0) {
    yearlyChartEl.classList.remove("quartersChart-activated");
    quartersChartEl.classList.remove("active");
  }
});

yearlyChart.addEventListener("updated", function (chart) {
  updateQuarterChart(chart, "barQuarter");
});
