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

function uniseSala(button){
    console.log("ID del boton: ", button.id);
    document.getElementById("chat-messages").innerHTML = '';
    socket.emit("nombreSala", {salaNombre: button.id})
}

socket.on("nuevo-mensaje", data => {
    console.log("Me llego del servidoe: ", data)
    const pantalla = document.getElementById("chat-messages");

    pantalla.innerHTML +=
    `<div class="message sent"><strong>${data.nombreP[0].usuario}</strong><p>${data.mensaje}</p></div>`;

    document.getElementById("message-input").value = "";
})

socket.on("mensajes", data => {
    render(data.mensajes)
    console.log(data.mensajes)
})

function render(mensajes, idChat){
    var html=""
    for(let i = 0; i<mensajes.length; i++){
        if(mensajes[i].idContacto != 1){
            html+= `<div class = "message received">
                    <strong>${mensajes[i].usuario}</strong>
                    <p>${mensajes[i].mensaje}</p>
                    </div>`
        }
        else{    
            html+= `<div class="message sent">
            <strong>${mensajes[i].usuario}</strong>
            <p>${mensajes[i].mensaje}</p>
            </div>`
        }
    }
    document.getElementById("chat-messages").innerHTML+=html
}