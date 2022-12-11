var chat_sockets = io("/chat", { transports: ["websocket"] });

function expandTextarea(id) {
  document.getElementById(id).addEventListener('keyup', function () {
    this.style.overflow = 'hidden';
    this.style.height = 0;
    this.style.height = this.scrollHeight + 'px';
  }, false);
}


function sendMessage(message) {
  
    fetch("/chat/0", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    })
      .then(() => {
        document.querySelector("#message").value = "";
      })
      .catch((error) => console.log(error));

  }


function fetchMessage() {
  let message = ""
  document.querySelector("#message").addEventListener("keydown", (event) => {
    console.log(event);
    message = event.target.value
    if (event.keyCode === 13) {
      sendMessage(message)
    }
    
  });
  document.querySelector("#messageSend").addEventListener("click", (event) => {
    console.log(event);
    sendMessage(message)
    
  });

  const messages = document.querySelector("#messages");
  chat_sockets.on("chat:0", ({ sender, message, timestamp }) => {

    const template = document.querySelector("message");
    console.log({ sender, message, timestamp });

    const div = document.createElement("div");
    const span = document.createElement("span");
    span.innerText = sender;


    const content = document.createElement("p");
    content.innerText = message;

    div.appendChild(span);
    div.appendChild(content);

    messages.appendChild(div);
  });
}

fetchMessage()
expandTextarea('message');
