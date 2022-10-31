function register_validation(e) {
    e.preventDefault();
    const form = document.getElementsByTagName("form")[0]
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value
    const compare_result = password == confirm_password
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
        message.textContent = "Message: confirm password not match"
        form.insertBefore(message,form.children[0])
        return false
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
        message.id = "message"
        message.textContent = "Message: Working on it, Please be patience"
        form.insertBefore(message,form.children[0])
        return true
    }

}