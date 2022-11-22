function register_validation(e) {
  e.preventDefault();
  const form = document.getElementsByTagName("form")[0];
  const password = document.getElementById("password").value.trim();
  const confirm_password = document.getElementById("confirm_password").value.trim();
  const compare_result = (password == confirm_password);
  if (!compare_result) {
    if (document.getElementById("message") != null) {
      form.removeChild(document.getElementById("message"))
    }
    const message = document.createElement("p")
    message.setAttribute(
      "style",
      "color:red"
    )
    message.id = "message"
    message.textContent = "Message: passwords do not match"
    form.insertBefore(message, form.children[0]);
    return false;
  }
  else {
    if (document.getElementById("message") != null) {
      form.removeChild(document.getElementById("message"))
    }
    const message = document.createElement("p")
    message.setAttribute(
      "style",
      "color:green"
    )
    message.id = "message";
    message.textContent = "Message: Working on functionality, please be patient.";
    form.insertBefore(message, form.children[0]);
    return true;
  }
}

var form = document.getElementById('register-form');
form.addEventListener('submit', function (e) {
  let validationResult = register_validation(e)
  if (validationResult) {
    form.setAttribute("action", "/register");
    form.setAttribute("method", "post");
    form.submit()
  }
})