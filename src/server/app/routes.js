const path = require('path');
const express = require('express')
const router = express.Router();
const controler = require("./controler.js");
const session = require('express-session');
const { isValidImage } = require('./auxFuntions.js');


// controler.insertAdmin("admin", "123456"); 

//ruta de pruebas





///////////////
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/login.html"));
});


router.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/admin.html"));
})

router.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/registro.html"));
});

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
router.get("/preInscripcion", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/html/preInscripcion.html"));
})

router.post("/preInscripcion", (req, res) => {
    // console.log(req.body)
    if (!isValidImage(req.body.photo)) {
        res.send("El formato de la imagen no es valido, solo se admiten jpg, png, bmp y jpeg")
    } else {
        controler.validTutor(req.body, response => {
            if (response) {
                controler.registerStudent(req.body, response => {
                    res.send(response)
                })
            } else {
                res.send("La cedula del tutor ya esta registrada para un tutor diferente")
            }
        })
    }
})

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

module.exports = router;