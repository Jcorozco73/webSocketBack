const socket = io()

const boton = document.getElementById("boton")
boton.addEventListener("click", () => sendProduct())

function sendProduct() {
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value
    }
    console.log("boton de agregar presionado");
    if (product.title === "" || product.description === "" || product.code === "" || product.price === "" || product.stock === "" || product.category === "") {

        console.log("No se agregó nada");
    } else {
        socket.emit("newProduct", product)
    }
}

socket.on("prodList", (realTimeProds) => {
    const prodsList = document.getElementById("listaproducts")
    prodsList.innerHTML = ""
    realTimeProds.forEach((prod) => {
        appendProduct(prod.title, prod.price, prod.id)
    });
})

function appendProduct(title, price, id) {
    const listaProductos = document.getElementById("listaproducts")
    const newProduct = document.createElement("div")
    newProduct.innerHTML =
        `<div id="${id}">
        <p>Producto: ${title}</p>
        <p>Precio: ${price}</p>
        <button id="eliminar" onClick="deleteProduct(${id})">Eliminar</button>
        </div>`

    listaProductos.appendChild(newProduct)
}

const botonDelete = document.getElementById("eliminar")
botonDelete.addEventListener("click", () => deleteProduct(e.id))

function deleteProduct(id) {
    socket.emit("deleteProd", id)
    const delProd = document.getElementById(id)
    delProd.remove()
    console.log("boton eliminar fue presionado");
}

socket.on("newProduct", (data) => {
    appendProduct(data.title, data.price, data.price)
})


socket.on("deleteProd", (data) => {
    deleteProduct(data.id)
})
