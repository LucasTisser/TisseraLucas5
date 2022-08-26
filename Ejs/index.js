const express = require('express')
const {Router} = express
const app = express()
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const productos = Router()
const listaProductos = [
{
    "title":"Shampoo",
    "price":"5USD",
    "id":"1"
},
{
    "title":"Acondicionador",
    "price":"7USD",
    "id":"2"
},
{
    "title":"Jabon",
    "price":"2USD",
    "id":"3"
}]
productos.get('/', (req,res)=>{
    res.send(listaProductos)
})
productos.get('/:id', (req,res)=>{
    // Toma un producto segun su id
    const id = req.params.id
    const productoBuscado = listaProductos.filter(producto=>producto.id === id)
    if(listaProductos.length < id){
        res.status(400).send('No se ha encontrado un producto con dicho ID')
    } else {
        res.send(productoBuscado)
    }
})
productos.post('/', (req, res,next) => {
    const {title ,price} = req.body
    if(!title || !price){
        res.status(400).send({error:"Producto no encontrado"})
    }
    next()
},(req, res) => {
    const {title ,price, id} = req.body
    listaProductos.push({title,price,id})
    res.send('producto guardado con exito')} 
)
productos.put('/:id',(req,res)=>{
    const {title,price} = req.body;
    const productoId = listaProductos.filter(producto=>producto.id === Number(req.params.id))
    if (productoId >= 0 ){
        listaProductos[productoId] = {title,price}
        listaProductos[productoId].id = Number(req.params.id)
        res.send(listaProductos[productoId])
    } else {
        res.status(404).send({error:"Producto no encontrado"})
    }
})
productos.delete('/:id',(req, res) => {
    // Elimina un producto segun su id
    const id = req.params.id
    // filtrar los datos para identificar el objeto a eliminar y eliminarlo
    const productoBorrado = listaProductos.filter((elemento) => elemento.id !== id);
    console.log(productoBorrado)
    if (productoBorrado.length == listaProductos.length) {
      res.status(404).send({error:"Producto no encontrado"})
    } else {
    // guardar el nuevo array con el nuevo objeto agregado
    listaProductos.splice(productoBorrado, 1)
    console.log(listaProductos)
    res.send("Elemento eliminado")
  }
})
app.use('/api/productos',productos)
const PORT = 3000
app.listen(PORT,()=> {
    console.log('Server on '+ PORT)
})