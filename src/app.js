const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const handlebars = require('express-handlebars')
const io = require('socket.io')(http)
const contenedorImportado = require('./contenedor')
const cont1 = contenedorImportado.Contenedor
const contenedor = new cont1('./src/products.json')
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))


app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.join(__dirname, 'views'))


// Endpoints
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get("/home", async (req, res) => {
    let productsList = await contenedor.getAll()
    res.render("home", {
        title: "Home",
        productsList
    })
})

// INICIO DE CONFIGURACION REALTIMEPRODUCTS

app.get("/realtimeproducts", async (req, res) => {

    let realTimeProds = await contenedor.getAll()

    // Configuración de sockets

    io.on("connection", async (socket) => {
        console.log("usuario conectado");

        socket.emit("prodList", realTimeProds)

        socket.on("newProduct", async (product) => {
            await contenedor.save(product)
            io.emit("newProduct", { title: product.title, price: product.price, id: product.id })
        })

        socket.on("deleteProd", async (id) => {
            await contenedor.deleteById(id)
            io.emit("deleteProd", { id: id })
        })
    })


    // RENDERIZADO
    res.render("realTimeProducts", {
        title: "Real Time Products",
        realTimeProds
    })
})

// FIN DE CONFIGURACION DE REALTIMEPRODUCTS





http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})