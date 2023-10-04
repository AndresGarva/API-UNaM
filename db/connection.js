/* eslint-disable indent */
import { Sequelize } from 'sequelize'

// Creamos instancia del objeto Sequelize

const db = new Sequelize(
    'yvksglvw', // DB Name
    'yvksglvw', // User Name
    'sj3ZgcBl_youdnP9YFcyY_oYeibZl0d1', // Password
    {
        host: 'silly.db.elephantsql.com',
        dialect: 'postgres',
        logging: true 
    }
)

export default db