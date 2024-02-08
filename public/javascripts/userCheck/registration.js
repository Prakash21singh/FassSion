const form = document.querySelector("form");
const firstname = document.querySelector("#Firstname");
const lastname = document.querySelector("#Lastname");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const msg = document.querySelector(".message");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      firstname: firstname.value,
      lastname: lastname.value,
    }),
  })
    .then((res) => {
      if (res.ok) {
        window.location.href = "/login";
      } else {
        res.json().then((res) => {
          msg.textContent = res.message;
        });
      }
    })
    .catch((err) => {
      console.log("Error", err);
    });
});
