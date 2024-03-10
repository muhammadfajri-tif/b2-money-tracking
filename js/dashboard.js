import { getMoney } from "./utils/dataTrasaction.mjs";
const money = getMoney();
document.querySelector(".money-text").textContent = money;
