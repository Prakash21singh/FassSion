console.log("To ho gya?");

const iAmount = +document.querySelector(".famount").textContent;
console.log(iAmount);
const delivery = document.querySelector(".delivery").textContent;

const deliverPrice = +delivery;
// delivery.textContent = discountPrice;

const gst = document.querySelector(".gst");

const gstPrice = +(iAmount * 0.18).toFixed(2);

gst.textContent = gstPrice;
const totalAmount = document.querySelector(".totalPrice");

const total = iAmount + deliverPrice + gstPrice;

totalAmount.textContent = total.toFixed(2);
