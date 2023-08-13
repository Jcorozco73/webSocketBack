const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser');



const PORT = 8080

app.set('view engine', 'hbs')
app.engine("handlebars", handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }));

//rutas
app.get('/', (req, res) => {
    const productos = obtenerProductos()
    res.render('home', { productos });
  });

  app.get('/realtimeproducts', (req, res) => {
    const productos = obtenerProductos();
    res.render('realTimeProducts', { productos });
  });

  app.post('/agregarProducto', (req, res) => {
    const producto = {
      nombre: req.body.nombre,
      precio: req.body.precio
    };
         // Agregar el producto a la lista de productos
         agregarProducto(producto);

         // Emitir el evento a todos los clientes conectados
         io.emit('productoAgregado', producto);
    
         // Redireccionar al endpoint '/realtimeproducts'
         res.redirect('/realtimeproducts');
       });

  io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    
    socket.on('agregarProducto', (producto) => {
    
      agregarProducto(producto);
     
      io.emit('productoAgregado', producto);
    });

   
    socket.on('eliminarProducto', (productoId) => {
      
      eliminarProducto(productoId);
      
      io.emit('productoEliminado', productoId);
    });

    // Manejar la desconexión de un cliente
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado');
    });
  });

  const productos = [];

  function obtenerProductos() {
    return productos;
  }

  function agregarProducto(producto) {
    productos.push(producto);
  }

  function eliminarProducto(productoId) {
    const index = productos.findIndex(producto => producto.id === productoId);
    if (index !== -1) {
      productos.splice(index, 1);
    }
  }
  function agregarProducto(producto) {
    producto.id = generarIdUnico();
    productos.push(producto);
  }

  function generarIdUnico() {
    return Date.now().toString() + Math.random().toString(36);
  }
http.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
})