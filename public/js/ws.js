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
    socket.emit("incoming-message", {mensaje:mensaje, user:user})
}