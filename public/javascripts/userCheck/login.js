let form = document.querySelector("#form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  let message = document.querySelector(".message");

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (res.ok) {
        window.location.href = "/";
      } else {
        throw new Error("Login Failed");
      }
    })
    .catch((err) => {
      console.log(err);
      message.textContent = "Login faild please check your credentials";
    });
});
