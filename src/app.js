import express from 'express';
import __dirname from '../src/utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routes/view.router.js';
import { Server } from 'socket.io';
import ProductManager from './product.manager.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';

//INICIALIZAMOS EXPRESS
const app = express(); //TRAEMOS EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = app.listen(8080, () => console.log("Server activado")); //levantamos el servido


const socketServer = new Server(httpServer); //creamos un servidor con websocket 
app.engine('handlebars', handlebars.engine()); //agregamos handlebars a express
app.set('views', __dirname + '/views'); //seteamos las views
app.set('view engine', 'handlebars'); //seteamos las vistas con handlebars
app.use(express.static(__dirname + '/public')); //usamos la carpeta estatica para el servidor
app.use('/', viewRouter); //usamos la ruta de  viewRouter
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);



//on = escuchar / recibir 
//emit = hablar / enviar



socketServer.on('connection', socket => {
    console.log("Tenemos un cliente conectado");

    socket.on('message', data => {
        console.log(data);
    })

    //realTimeProducts
    socket.emit('updateProducts' , "Lista de todos los productos")

    socket.on('products' , ()=>{
        console.log("llegaron los productos");
        socket.emit('productList' , "Todos los productos");
    })

}) //hacemos que el socket escuche cuando el cliente  se conecte y mande un mensaje de que se conecto
