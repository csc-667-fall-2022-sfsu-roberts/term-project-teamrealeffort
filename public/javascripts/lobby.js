var socket = io("/chat",{ transports: ["websocket"] });
function expandTextarea(id) {
    document.getElementById(id).addEventListener('keyup', function () {
        this.style.overflow = 'hidden';
        this.style.height = 0;
        this.style.height = this.scrollHeight + 'px';
    }, false);

}

function sendMessage() {
    

    var form = document.getElementById('chat-box-form');
    

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = document.getElementById('chat-box');
        if (input.value) {
            socket.emit('chat-message', input.value);
            input.value = '';
        }
        
    });

    socket.on('chat-message', function (msg) {
        console.log(msg)
    });
    
}
sendMessage()
expandTextarea('chat-box');
