
/*  Paquetes instalados: -g nodemon, express, express-handlebars, body-parser, mysql2
    Agregado al archivo "package.json" la línea --> "start": "nodemon index"
    
    Proyecto "Node_base"
    Desarrollo de Aplicaciones Informáticas - 5to Informática
    
    Docentes: Nicolás Facón, Martín Rivas, Federico Paul
    
    Revisión 1 - Año 2021
*/
//Cargo librerías instaladas y necesarias
const express = require('express'); //Para el manejo del servidor Web
const exphbs  = require('express-handlebars'); //Para el manejo de los HTML
const bodyParser = require('body-parser'); //Para el manejo de los strings JSON
const MySQL = require('./modulos/mysql'); //Añado el archivo mysql.js presente en la carpeta módulos

const session = require('express-session'); //Para usar variables de sesión

const app = express(); //Inicializo express para el manejo de las peticiones

app.use(express.static('public')); //Expongo al lado cliente la carpeta "public"

app.use(bodyParser.urlencoded({ extended: false })); //Inicializo el parser JSON
app.use(bodyParser.json());

app.engine('handlebars', exphbs({defaultLayout: 'main'})); //Inicializo Handlebars. Utilizo como base el layout "Main".
app.set('view engine', 'handlebars'); //Inicializo Handlebars

const Listen_Port = 3000; //Puerto por el que estoy ejecutando la página Web

const server=app.listen(Listen_Port, function() {
    console.log('Servidor NodeJS corriendo en http://localhost:' + Listen_Port + '/');
});

const io= require('socket.io')(server);

const sessionMiddleware=session({
    secret: 'sararasthastka',
    resave: true,
    saveUninitialized: false,
});

app.use(sessionMiddleware);

io.engine.use(sessionMiddleware);
/*
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
    A PARTIR DE ESTE PUNTO GENERAREMOS NUESTRO CÓDIGO (PARA RECIBIR PETICIONES, MANEJO DB, ETC.)
*/

app.get('/', function(req, res)
{
    //Petición GET con URL = "/", lease, página principal.
    console.log(req.query); //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('login', null); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});


app.get('/irAlogin', function(req, res)
{
    //Petición POST con URL = "/login"
    console.log("Soy un pedido POST", req.body); 
    //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método POST
    //res.render('home', { mensaje: "Hola mundo!", usuario: req.body.usuario}); //Renderizo página "home" enviando un objeto de 2 parámetros a Handlebars
    res.render('home', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});


app.post('/login', async function(req, res)
{
    console.log("Soy un pedido POST/login", req.body); 
    let vectorUsuario =  await MySQL.realizarQuery("SELECT * FROM Contactos")
    let respuesta = await MySQL.realizarQuery(`SELECT * FROM Contactos WHERE usuario = "${req.body.usuario}" AND contraseña = "${req.body.contraseña}"`)
    let idUsuario = await MySQL.realizarQuery(`SELECT idContacto FROM Contactos WHERE usuario = "${req.body.usuario}" AND contraseña = "${req.body.contraseña}"`)
    //Chequeo el largo del vector a ver si tiene datos
    req.session.usuario = idUsuario
    console.log(req.session.usuario)
    if (respuesta.length > 0) {
        //Armo un objeto para responder
        res.send({validar: true})    
    }
    else{
        res.send({validar:false})    
    }
});


app.post('/home', async function(req, res)
{
    //Petición POST con URL = "/login"
    console.log("Soy un pedido POST/home", req.body); 
    let chats = await MySQL.realizarQuery(`select Chats.idChat,nombre,idContacto from Chats inner join Contactos_Chats ON Chats.idChat = Contactos_Chats.idChat where idContacto = ${req.session.usuario[0].idContacto}`)
    res.render('home', {chats:chats}); //Renderizo página "login" sin pasar ningún objeto a Handlebars
});

app.get('/registro', function(req, res)
{
    //Petición GET con URL = "/login"
    console.log("Soy un pedido GET/registro", req.query); 
    //En req.query vamos a obtener el objeto con los parámetros enviados desde el frontend por método GET
    res.render('registro', null); //Renderizo página "home" sin pasar ningún objeto a Handlebars
});

app.post('/enviarRegistro', async function(req, res){
    console.log("Soy un pedido POST/enviarRegistro", req.body);
    await MySQL.realizarQuery(`INSERT INTO Contactos(usuario, contraseña) VALUES("${req.body.usuario}", "${req.body.contraseña}") `)
    console.log(await (MySQL.realizarQuery("SELECT * FROM Contactos")))
    res.render('home',null);
});


/*app.delete('/login', function(req, res) {
    //Petición DELETE con URL = "/login"
    console.log("Soy un pedido DELETE", req.body); //En req.body vamos a obtener el objeto con los parámetros enviados desde el frontend por método DELETE
    res.send(null);
});*/


io.on("connection", (socket) => {
    //Esta línea es para compatibilizar con lo que venimos escribiendo
    const req = socket.request;

    //Esto serìa el equivalente a un app.post, app.get...
    // SE CONECTA A LA SALA
    /* socket.on('incoming-message', data => {
        console.log("INCOMING MESSAGE:", data);
        console.log("SALA: ", req.session.salaNombre)
        io.to(req.session.salaNombre).emit("server-message", {mensaje:"MENSAJE DE SERVIDOR"}) 
    });
 */
    //
    socket.on('nombreSala', async (data) => {
        console.log("Se conecto a la sala:", data.salaNombre);
        if(req.session.salaNombre != ""){
            socket.leave(req.session.salaNombre)
        }
        socket.join(data.salaNombre)
        req.session.salaNombre = data.salaNombre
        io.to(data.salaNombre).emit("server-message", {mensaje:"te conectaste a..."}) //remplezar por dom, imnput del ftron
        req.session.save();

        let mensajes = await MySQL.realizarQuery(`SELECT mensaje, usuario, idChat, Mensajes.idContacto FROM Mensajes INNER JOIN Contactos ON Mensajes.idContacto = Contactos.idContacto WHERE Mensajes.idChat = ${req.session.salaNombre};`)
        for (let i = 0; i < mensajes.length; i++) {
            if (mensajes[i].idContacto == req.session.usuario[0].idContacto) {
                mensajes[i].idContacto = 1
            } else {
                mensajes[i].idContacto = 0
            }
        }
        console.log(mensajes)
        io.to(data.salaNombre).emit("mensajes", {mensajes:mensajes, idChat:req.session.salaNombre})
    });
   
    socket.on('nuevoMensaje', async data => {
        console.log("Mensaje del input: ", data.mensaje, "sala:", req.session.salaNombre);
        io.to(req.session.salaNombre).emit("server-message", { mensaje: data.mensaje });
        await MySQL.realizarQuery(`INSERT INTO Mensajes(idChat, idContacto, fecha, mensaje) VALUES(${req.session.salaNombre}, ${req.session.usuario[0].idContacto}, NOW(), "${data.mensaje}") `)

        let nombreP = await MySQL.realizarQuery(`SELECT usuario FROM Contactos WHERE idContacto = ${req.session.usuario[0].idContacto};`)

        io.to(req.session.salaNombre).emit("nuevo-mensaje", {mensaje: data.mensaje, nombreP:nombreP}) // aca lo que sucede es que mandamos el mensaje con el id al front :)

    });

    
});
//setInterval(() => io.emit("server-message", {mensaje:"MENSAJE DEL SERVIDOR"}), 2000);
