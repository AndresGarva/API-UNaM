/* eslint-disable indent */
import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'
import { JSON } from 'sequelize'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})

//Crear el endpoint ‘/usuarios/’, que devuelva el listado completo de usuarios

app.get('/usuarios/', async (req, res) =>{
    try {
        let allUsers = await Usuario.findAll()
        if (allUsers.length === 0) {
            res.status(404).json({'message': 'No se encontraron usuarios.'})
        } else {
            res.status(200).json(allUsers)
        }
        
    } catch (error) {
        res.status(204).json({'message': error})
        
    }
})

//Crear el endpoint ‘/usuarios/’ que permita obtener un usuario por su id.

app.get('/usuarios/:id', async (req, res) =>{
    try {
        let usuarioId = parseInt(req.params.id)
        let usuarioEncontrado = await Usuario.findByPk(usuarioId)
        if (!usuarioEncontrado) {
            res.status(404).json({'message': 'Usuario no encontrado.'})
        } else {
            res.status(200).json(usuarioEncontrado)
        }
        
    } catch (error) {
        res.status(204).json({'message': error})
        
    }
})

//Crear el endpoint ‘/usuarios/’ que permita guardar un nuevo usuario.

app.post('/usuarios', (req, res) => {
    try {
        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })

        req.on('end', async () => {
            try {
                // Intenta parsear el cuerpo como JSON
                const data = JSON.parse(bodyTemp)

                // Ahora `data` es un objeto JavaScript que contiene los datos JSON
                req.body = data

                // Continúa con el resto del código...
                const usuarioAGuardar = new Usuario(req.body)
                await usuarioAGuardar.save()
                res.status(201).json({'message': 'exitoso'})
            } catch (error) {
                // Si hay un error al parsear, devuelve un error de sintaxis JSON
                res.status(400).json({'message': 'Error de sintaxis JSON'})
            }
        })
    } catch (error) {
        // Si hay un error en general, devuelve un error del servidor
        res.status(500).json({'message': 'Error interno del servidor'})
    }
})


//Crear el endpoint ‘/usuarios/id’ que permita modificar algún atributo de un usuario.

app.patch('/usuarios/:id', async (req, res) => {
    let idUsuarioAEditar = parseInt(req.params.id)
    try {
        let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar)

        if (!usuarioAActualizar) {
            return res.status(204).json({'message':'Usuario no encontrado'})}

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
        
            await usuarioAActualizar.update(req.body)

            res.status(200).send('Usuario modificado')
        })
    
    } catch (error) {
        res.status(204).json({'message':'Usuario no encontrado'})
    }
})

//Crear el endpoint ‘/usuarios/id’ que permita borrar un usuario de los datos.

app.delete('/usuarios/:id', async (req, res) => {
    let idUsuarioABorrar = parseInt(req.params.id)
    try {
        let usuarioABorrar = await Usuario.findByPk(idUsuarioABorrar)

        if (!usuarioABorrar) {
            return res.status(204).json({'message':'Usuario no encontrado'})}

        await usuarioABorrar.destroy()

        res.status(200).send('Usuario borrado')
    } catch (error) {
        res.status(204).json({'message':'Usuario no encontrado'})
    }
})


app.get('/productos/', async (req, res) =>{
	try {
		let allProducts = await Producto.findAll()

		res.status(200).json(allProducts)

	} catch (error) {
		res.status(204).json({'message': error})
	}
})

app.get('/productos/:id', async (req, res) => {
    try {
        let productoId = parseInt(req.params.id)
        let productoEncontrado = await Producto.findByPk(productoId)
        if (!productoEncontrado) {
            res.status(404).json({'message': 'Producto no encontrado.'})
        } else {
            res.status(200).json(productoEncontrado)
        }
        
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
    
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
            //datos.productos.push(req.body)
            const productoAGuardar = new Producto(req.body)
            await productoAGuardar.save()
        })
    
        res.status(201).json({'message': 'success'})

    } catch (error) {
        res.status(204).json({'message': 'error'})
    }
})

app.patch('/productos/:id', async (req, res) => {
    let idProductoAEditar = parseInt(req.params.id)
    try {
        let productoAActualizar = await Producto.findByPk(idProductoAEditar)

        if (!productoAActualizar) {
            return res.status(204).json({'message':'Producto no encontrado'})}

        let bodyTemp = ''

        req.on('data', (chunk) => {
            bodyTemp += chunk.toString()
        })

        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data
        
            await productoAActualizar.update(req.body)

            res.status(200).send('Producto actualizado')
        })
    
    } catch (error) {
        res.status(204).json({'message':'Producto no encontrado'})
    }
})

app.delete('/productos/:id', async (req, res) => {
    let idProductoABorrar = parseInt(req.params.id)
    try {
        let productoABorrar = await Producto.findByPk(idProductoABorrar)
        if (!productoABorrar){
            return res.status(204).json({'message':'Producto no encontrado'})
        }

        await productoABorrar.destroy()
        res.status(200).json({message: 'Producto borrado'})

    } catch (error) {
        res.status(204).json({message: error})
    }
})

app.use((req, res) =>{
    res.status(404).send('<h1>404</h1>')
})

try {
    await db.authenticate()
    console.log('Connection has been established successfully.')
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

app.listen( exposedPort, () => {
    console.log('Servidor escuchando en http://localhost:' + exposedPort)
})

