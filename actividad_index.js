/* eslint-disable indent */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

import express from 'express'
const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
	res.status(200).send(html)
})

//1- Crear el endpoint ‘/usuarios/’, que devuelva el listado completo de usuarios

app.get('/usuarios/', (req, res) => {
	try {
		let allUsers = datos.usuarios
		res.status(200).json(allUsers)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

//2- Crear el endpoint ‘/usuarios/id’ que devuelva los datos de un usuario en particular consignado por su número de id

app.get('/usuarios/:id', (req, res) => {
	try {
		let usuariosId = parseInt(req.params.id)
		let user = datos.usuarios.find(user => user.id === usuariosId)
		res.status(200).json(user)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

//3- Crear el endpoint ‘/usuarios/’ que permita guardar un nuevo usuario.

app.post('/usuarios/', (req, res) => {
	try {
		let newUser = req.body
		datos.usuarios.push(newUser)
		res.status(201).json(newUser)

        

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

//4- Crear el endpoint ‘/usuarios/id’ que permita modificar algún atributo de un usuario.

app.put('/usuarios/:id', (req, res) => {
    try {
        let usuariosId = parseInt(req.params.id)
        let user = datos.usuarios.find(user => user.id === usuariosId)
        user.nombre = req.body.nombre
        res.status(200).json(user)

    } catch (error) {
        res.status(204).json({'message': error})
    }
})

//5- Crear el endpoint ‘/usuarios/id’ que permita borrar un usuario de los datos.

app.delete('/usuarios/:id', (req, res) => {
    try {
        let usuariosId = parseInt(req.params.id)
        let user = datos.usuarios.find(user => user.id === usuariosId)
        datos.usuarios = datos.usuarios.filter(user => user.id!== usuariosId)
        res.status(200).json(user)

    } catch (error) {
        res.status(204).json({'message': error})
    }
})

//Mostrar todos los productos 
app.get('/productos/', (req, res) =>{
	try {
		let allProducts = datos.productos

		res.status(200).json(allProducts)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

//Buscar producto por id
app.get('/productos/:id', (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

		res.status(200).json(productoEncontrado)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

//Guardar un nuevo producto
app.post('/productos', (req, res) => {
	try {
		let bodyTemp = ''

		req.on('data', (chunk) => {
			bodyTemp += chunk.toString()
		})
    
		req.on('end', () => {
			const data = JSON.parse(bodyTemp)
			req.body = data
			datos.productos.push(req.body)
		})
    
		res.status(201).json({'message': 'success'})

	} catch (error) {
		res.status(204).json({'message': 'error'})
	}
})

//Editar producto
app.patch('/productos/:id', (req, res) => {
	let idProductoAEditar = parseInt(req.params.id)
	let productoAActualizar = datos.productos.find((producto) => producto.id === idProductoAEditar)

	if (!productoAActualizar) {
		res.status(204).json({'message':'Producto no encontrado'})
	}

	let bodyTemp = ''

	req.on('data', (chunk) => {
		bodyTemp += chunk.toString()
	})

	req.on('end', () => {
		const data = JSON.parse(bodyTemp)
		req.body = data
        
		if(data.nombre){
			productoAActualizar.nombre = data.nombre
		}
        
		if (data.tipo){
			productoAActualizar.tipo = data.tipo
		}

		if (data.precio){
			productoAActualizar.precio = data.precio
		}

		res.status(200).send('Producto actualizado')
	})
})

//Borrar producto
app.delete('/productos/:id', (req, res) => {
	let idProductoABorrar = parseInt(req.params.id)
	let productoABorrar = datos.productos.find((producto) => producto.id === idProductoABorrar)

	if (!productoABorrar){
		res.status(204).json({'message':'Producto no encontrado'})
	}

	let indiceProductoABorrar = datos.productos.indexOf(productoABorrar)
	try {
		datos.productos.splice(indiceProductoABorrar, 1)
		res.status(200).json({'message': 'success'})

	} catch (error) {
		res.status(204).json({'message': 'error'})
	}
})

//6- Crear el endpoint que permita obtener el precio de un producto que se indica por id.

app.get('/productos/precio/:id', (req, res) =>{
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)
        if (productoEncontrado) {
            res.status(200).json({'precio': productoEncontrado.precio})
        } else {
            res.status(204).json({'message': 'Producto no encontrado'})
        }
    } catch (error) {
        res.status(204).json({'message': error})
    }   
})

//7- Crear el endpoint que permita obtener el nombre de un producto que se indica por id.

app.get('/productos/nombre/:id', (req, res) =>{
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)
        if (productoEncontrado) {
            res.status(200).json({'nombre': productoEncontrado.nombre})
        } else {
            res.status(204).json({'message': 'Producto no encontrado'})
        }
    } catch (error) {
        res.status(204).json({'message': error})
    }   
})

//8- Crear el endpoint que permita obtener el teléfono de un usuario que se indica por id.

app.get('/usuarios/telefono/:id', (req, res) =>{
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)
        if (usuarioEncontrado) {
            res.status(200).json({'telefono': usuarioEncontrado.telefono})
        } else {
            res.status(204).json({'message': 'Usuario no encontrado'})
        }
    } catch (error) {
        res.status(204).json({'message': error})
    }   
})

//9- Crear el endpoint que permita obtener el nombre de un usuario que se indica por id

app.get('/usuarios/nombre/:id', (req, res) =>{
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = datos.usuarios.find((usuario) => usuario.id === usuarioId)
        if (usuarioEncontrado) {
            res.status(200).json({'nombre': usuarioEncontrado.nombre})
        } else {
            res.status(204).json({'message': 'Usuario no encontrado'})
        }
    } catch (error) {
        res.status(204).json({'message': error})
    }   
})  

//10- Crear el endpoint que permita obtener el total del stock actual de productos, la sumatoria de los precios individuales.

app.get('/productos/stock', (req, res) => {
    try {
      let totalStock = 0
      let totalPrice = 0
  
      datos.productos.forEach((producto) => {
        totalStock += producto.stock
        totalPrice += producto.precio * producto.stock // Multiplica el precio por el stock
      })
  
      res.status(200).json({
        'stock': totalStock,
        'totalPrice': totalPrice
      })
    } catch (error) {
      res.status(204).json({'message': error})
    }
  })



app.use((req, res) => {
	res.status(404).send('<h1>404</h1>')
})

app.listen( exposedPort, () => {
	console.log('Servidor escuchando en http://localhost:' + exposedPort)
})