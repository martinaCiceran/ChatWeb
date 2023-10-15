async function putJSON(data) {
  //putJSON() es solo el nombre de esta funcion que lo pueden cambiar    

  try {
    const response = await fetch("/login", {
      method: "POST", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    const result = await response.json();
    console.log("Success:", result);

    if (result.validar == false) {
      alert("Los datos son incorrectos")
    } else {
      //Envio el formularia desde dom para cambiar de pagina
      //Podria usar tambien un changeScreen()
      document.getElementById("formlogin").submit()
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function postMensaje(data) {
    try {
      const response = await fetch("/enviarMensaje", {
      method: "POST", // or 'POST'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    //En result obtengo la respuesta
    
  } catch (error) {
    console.error("Error:", error);
  }
}

//Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
function login() {
  //Leo los datos del input
  let usuario = document.getElementById("usuarioId").value
  let contraseña = document.getElementById("contraseñaId").value

  //Creo un objeto de forma instantanea
  let data = {
    usuario: usuario,
    contraseña: contraseña
  }

  //data es el objeto que le paso al back
  putJSON(data)
}


function enviarMensaje() {
  let mensaje  = document.getElementById("message-input").value
  let sala = document.getElementById("sala").innerHTML
  let data = {mensaje: mensaje,
    sala: sala
  }
  console.log("mensaje:",mensaje ,"sala: ", sala)
  //mando el mensaje al seridor socket 
  enviarMensajeGeneral("mensaje (sala: "+sala+"): "+mensaje)
   //mando el mensaje en un post para que se guarde en la base de datos
   postMensaje(data)
  

  
  }

function uniseSala(button){

  console.log("ID del boton: ", button.id)
  document.getElementById("sala").innerHTML = button.id
  socket.emit("nombreSala", {salaNombre: button.id})
}

