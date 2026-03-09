const signiBtn = document.getElementById("signin");

signiBtn.addEventListener("click", function () {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    window.location.href = "./home.html";
  } else {
    alert("Your username or password is not valid. Please try again");
  }
});