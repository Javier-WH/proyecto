const path = require('path');
const express = require('express')
const router = express.Router();
const controler = require("./controler.js");
const session = require('express-session');
const { response } = require('express');


// controler.insertAdmin("admin", "123456");


router.get("/", (req, res) => {
    console.log(`${req.ip} ha visitado la pagina`.yellow);
    res.sendFile(path.join(__dirname, "../../public/html/login.html"));
});


router.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/admin.html"));
})

router.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/registro.html"));
});


router.post("/admin", (req, res) => {
    controler.validateAdmin(req.body, (response, results) => {
        if (response == "OK") {
            req.session.userData = results[0];
        }
        res.send(response);
    })
})


router.post("/checkUser", (req, res) => {
    controler.validateUser(req.body, (response, results) => {
        if (response == "OK") {
            req.session.userData = results[0];
            console.log(`El profesor ${results[0].name} ${results[0].lastName} se ha conectado desde la dirección ${req.ip}`.yellow);
            res.send("OK");
        } else {
            res.send(response);
        }
    })
});

router.all("*", (req, res, next) => {
    if (req.session.userData) {
        next();
    } else {
        req.session.destroy();
        res.redirect("/");
        console.log(`${req.ip} ha intentado entrar sin iniciar seccion, expulsando y destruyendo secciones`.red);
    }
})

////////////////////////////
//aca abjao las rutas que necesitan seccion iniciada
////////////////////////////

router.post("/setCargaNotas", (req, res) => {
    let { value, subject } = req.body;

    controler.updateCargaNotas(subject, value, response => res.send(response));
})

router.post("/getCargaNotasValues", (req, res) => {
    controler.getCargaNotas((results) => {
        res.send(results);
    })
})


router.get("/config", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/config.html"));
})

router.post("/getTeachers", (req, res) => {

    controler.getTeacherList((message, results) => {
        if (results) {
            res.send(results);
        } else {
            res.send('[["No hay profesores registrados"]]')
        }
    });

})

router.post("/registro", (req, res) => {
    controler.nickNameExist(req.body, (exist) => {
        if (!exist) {
            controler.idExist(req.body, (idexist) => {
                if (!idexist) {
                    controler.registerTeacher(req.body, (response) => {
                        res.send(response);
                    });
                } else {
                    res.send("La cedula ya está registrada");
                    console.log("No se ha podido registrar el profesor porque la cedula ya existe".red);
                }
            })
        } else {
            res.send("El usuario ya existe");
            console.log("No se ha podido registrar el profesor porque el usuario ya existe".red);
        }
    })
});

router.post("/addTeacher", (req, res) => {
    controler.registerMateriasAndTeacher(req.body, response => {
        res.send(response);
    })

})

router.post("/removeTeacher", (req, res) => {

    controler.removeTeacher(req.body.cedula, response => res.send(response));
})

router.get("/welcome", (req, res) => {
    res.send("Hola, como estas?, yo estoy bien");
});


router.get("/logout", (req, res) => {
    try {
        req.session.destroy();
        res.send("OK");
    } catch (error) {
        res.send("Error al intentar cerrar la sessión")
    }
})


router.all("*", (req, res) => {

    req.session.destroy();
    res.redirect('/');
    console.log(`${req.ip} ha intentado entrar a una ruta que no existe, expulsando y destruyendo secciones`.red);
})

module.exports = router;