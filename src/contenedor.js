const fs = require('fs').promises

class Contenedor {
    constructor(rutaArchivo) {
        this.rutaArchivo = rutaArchivo
    }

    async getAllProducts() {
        try {
            const rawProducts = await fs.readFile(this.rutaArchivo, 'utf-8')
            return rawProducts ? JSON.parse(rawProducts) : []
        } catch (error) {
            return ["error", error]
        }
    }

    async saveProducts(array) {
        try {
            await fs.writeFile(this.rutaArchivo, JSON.stringify(array))
        } catch (error) {
            console.log(`Hubo un error al guardar archivos: ${error}`);
        }
    }

    async save(newProduct) {
        try {
            let products = await this.getAllProducts()
            let lastID = products.length > 0 ? products[products.length - 1].id : 0
            let newID = lastID + 1
            while (products.find((o) => o.id === newID)) {
                newID = newID + 1
            }
            let newObject = { id: newID, ...newProduct }
            products.push(newObject)
            await this.saveProducts(products)
        } catch (error) {
            console.log(`error al guardar los productos: ${error}`);
        }
        finally {
            console.log("Producto agregado con exito");
        }
    }

    async getById(id) {
        let products = await this.getAllProducts()
        return (products.find((o) => o.id === id) || null);

    }

    async getAll() {
        let products = await this.getAllProducts()
        return (products);
    }

    async deleteById(id) {
        try {
            let products = await this.getAllProducts()
            let newProducts = products.filter((o) => o.id !== id)
            await this.saveProducts(newProducts)
        } catch (error) {
            console.log(`Error al eliminar: ${error}`);
        }
        finally { console.log("Producto eliminado"); }

    }

    async deleteAll() {
        try {
            let emptyArray = []
            await this.saveProducts(emptyArray)
        } catch (error) {
            console.log(`Error al eliminar todo: ${error}`);
        }
        finally { console.log("Todos los productos han sido eliminados"); }
    }

}

// const contenedor = new Contenedor('./src/products.json')
// module.exports = contenedor;

module.exports = {
    Contenedor: Contenedor
}