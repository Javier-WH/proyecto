const color = require('colors');
//server modules
const express = require('express');
const app = express();


//modules
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

//enviroment variables
dotenv.config({ path: path.join(__dirname, "../env/.env") });

//sessions
const mysqlSession = require("express-mysql-session");
const optSession = {
    hots: process.env.DB_HOST,
    port: process.env.BD_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.BD_SESSION
};
const sessionStore = new mysqlSession(optSession);
app.use(session({
    key: "user_cookie",
    secret: "Batalla",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    endConnectionOnClose: true
}));

//static files
app.use(express.static(path.join(__dirname, "../../public")));

//midleware


app.use(express.json({ limit: "10MB" }));


//routes
app.use(require(path.join(__dirname, "routes.js")));


//get serverIP
const os = require('os');
const ip = os.networkInterfaces().Ethernet[1].address;



app.listen(process.env.PORT, process.env.ADDRESS || ip, error => {
    console.clear();
    if (error) {
        console.log("No se ha podido iniciar el servidor".red);
    } else {
        console.log(`El servidor se ha iniciado correctamente el la direccion -> ${process.env.ADDRESS == "0.0.0.0"? ip: process.env.ADDRESS}:${process.env.PORT}`.green)
    }
});