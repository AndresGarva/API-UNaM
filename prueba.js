/* eslint-disable indent */
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
// eslint-disable-next-line no-unused-vars
const datos = require('./datos.json')

import express from 'express'
import db from './db/connection.js'
import Producto from './models/producto.js'
import Usuario from './models/usuario.js'
import { JSON } from 'sequelize'

const html = '<h1>Bienvenido a la API</h1><p>Los comandos disponibles son:</p><ul><li>GET: /productos/</li><li>GET: /productos/id</li>    <li>POST: /productos/</li>    <li>DELETE: /productos/id</li>    <li>PUT: /productos/id</li>    <li>PATCH: /productos/id</li>    <li>GET: /usuarios/</li>    <li>GET: /usuarios/id</li>    <li>POST: /usuarios/</li>    <li>DELETE: /usuarios/id</li>    <li>PUT: /usuarios/id</li>    <li>PATCH: /usuarios/id</li></ul>'

const app = express()
app.use(express.json())

const exposedPort = 1234

app.get('/', (req, res) => {
    res.status(200).send(html)
})


//1- Crear el endpoint ‘/usuarios/’, que devuelva el listado completo de usuarios

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

//2- Crear el endpoint ‘/usuarios/’ que permita obtener un usuario por su id.

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

//3- Crear el endpoint ‘/usuarios/’ que permita guardar un nuevo usuario.

//4- Crear el endpoint ‘/usuarios/id’ que permita modificar algún atributo de un usuario.

app.patch('/usuarios/:id', async (req, res) =>{
    let idUsuarioAEditar = parseInt(req.params.id)
    try {
        let usuarioAActualizar = await Usuario.findByPk(idUsuarioAEditar)
        if (!usuarioAActualizar) {
            res.status(204).json({'message': 'Usuario no encontrado.'})
        let bodyTemp = ''

        req.on('data', (chunk) =>{
            bodyTemp += chunk.toString()
        })
        req.on('end', async () => {
            const data = JSON.parse(bodyTemp)
            req.body = data

            await usuarioAActualizar.update(req.body)

            res.status(200).send('Usuario actualizado')
            console.log(req.body)
        })
    }   
    } catch (error) {
        res.status(204).json({'message':'Usuario no encontrado'})
    }
})


app.get('/productos/', async (req, res) => {
    try {
        //let allProducts = datos.productos
        let allProducts =   await Producto.findAll()

        res.status(200).json(allProducts)

    } catch (error) {
        res.status(204).json({'message': error})
    }
})

app.use((req, res) => {
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