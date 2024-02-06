console.log("hello check this out");
let cartBtn = document.querySelector(".cart");
let popup = document.querySelector(".popup");

cartBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  popup.classList.remove("hidePop");
  setTimeout(() => {
    popup.classList.add("hidePop");
  }, 1000);
});
