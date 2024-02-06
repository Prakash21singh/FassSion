let cost = document.querySelectorAll(".cost");
let arr = [0];
const total = cost.forEach((el) => arr.push(+el.textContent));

let totalAmount = arr.reduce((acc, el) => acc + el);
let totalShow = document.querySelector(".totalPrice");
let totalSpend = document.querySelector(".saved");
totalShow.textContent = totalAmount.toFixed(2);
totalSpend.textContent = totalAmount.toFixed(2);

const date = document.querySelector(".date");
const month = document.querySelector(".month");
const year = document.querySelector(".year");

let d = new Date().getDate();
let m = new Date().getMonth();
d < 10 ? (d = "0" + d) : d;
m < 10 ? (m = "0" + m) : m;

date.textContent = d;
month.textContent = m;
year.textContent = new Date().getFullYear();
