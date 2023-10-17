const IP = "ws://localhost:3000";//aca esta el servidor
const socket = io(IP);

//ESTO ES UN LISTENER
socket.on("connect", () => {
    console.log("Me conecté a WS");
});//listener:función que esta esperando a escuchar algo

socket.on("server-message", data => {
    console.log("Me llego del servidor", data);
});

function funcionPrueba(){
    socket.emit("incoming-message", {mensaje:" prueba"})
}

function enviarMensajeGeneral(mensaje) {
    socket.emit('nuevoMensaje', {mensaje:mensaje})
}

socket.on("nuevo-mensaje", data => {
    console.log("Me llego del servidoe: ", data)
    const pantalla = document.getElementById("chat-messages");

    if(data.id == id_log){//esto sabe si es izq o der
        pantalla.innerHTML +=
        '<div class="message sent"><p>${data.data}</p></div>';
    } else{
        pantalla.innerHTML +=
        '<div class="message received"><p>${data.data}</p></div>';
    }
    document.getElementById("message-input").value = "";
})