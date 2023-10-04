/* eslint-disable indent */

import { createRequire } from 'node:module'
import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'

const require = createRequire(import.meta.url)
const datos = require('./datos.json')

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
	res.status(200).send(html)
})

app.get('/productos/', async (req, res) =>{
	try {
		let allProducts = await Producto.findAll()

		res.status(200).json(allProducts)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})



app.get('/productos/:id', (req, res) => {
	try {
		let productoId = parseInt(req.params.id)
		let productoEncontrado = datos.productos.find((producto) => producto.id === productoId)

		res.status(200).json(productoEncontrado)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

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

app.get('/usuarios/', async (req, res) =>{
    try {
        let allUsers = await Usuario.findAll()
        if (allUsers.length === 0) {
            res.status(404).json({'message': 'No se encontraron usuarios.'})
        } else {
            res.status(200).json(allUsers)
        }
        console.log(allUsers)
    } catch (error) {
        res.status(204).json({'message': error})
        console.log(error)
    }
})


app.use((req, res) => {
	res.status(404).send('<h1>404</h1>')
})

try {
	await db.authenticate()
	console.log('Conexion con la DDBB establecida')
	
} catch (error) {
	console.log('Error de conexion db')
}

app.listen( exposedPort, () => {
	console.log('Servidor escuchando en http://localhost:' + exposedPort)
})