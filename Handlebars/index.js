const express = require('express')
const {engine} = require('express-handlebars')
const {Router} = express
const app = express()

app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views','./views')

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
const productos = Router()
const listaProductos = [
{
    title:'Shampoo',
    price:'5USD',
    thumbnails:"https://www.pngall.com/wp-content/uploads/4/Shampoo-PNG-Image-HD.png",
    id:'1'
},
{
    title:'Acondicionador',
    price:'7USD',
    thumbnails:"https://sevilla.abc.es/estilo/bulevarsur//wp-content/uploads/sites/14/2021/09/Garnier-Acondicionador-Fructis-NutriRizos-768x1024.png",
    id:'2'
},
{
    title:'Jabon',
    price:'2USD',
    thumbnails:"https://www.nicepng.com/png/full/417-4172056_jabon-png-imagenes-de-javon-de-bao.png",
    id:'3'
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




app.get('/productos',(req,res)=>{
    // render recibe la vista que se renderiza, y los datos que se renderizan en esa vista
    res.render('productos',{listaProductos:listaProductos,listExists:true})

})



app.use('/api/productos',productos)
const PORT = process.env.PORT || 8080
app.listen(PORT,()=> {
    console.log('Server on '+ PORT)
})