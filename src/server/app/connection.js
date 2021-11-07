const colors = require('colors');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.BD_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

connection.connect(err => {
    if (err) {
        console.log("Error al conectarse con la base de Datos".bgRed);
    } else {
        console.log("La conexion con la base de datos fue existosa".green);
    }
})

module.exports = connection;