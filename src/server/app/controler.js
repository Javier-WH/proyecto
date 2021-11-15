const colors = require("colors");
const connection = require("./connection.js");
const bcryptjs = require("bcryptjs");


function validateUser({ name, password }, callBack) {

    connection.query({
        sql: "SELECT * FROM teachers WHERE nickName = ?",
        values: [name],
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta".bgRed)
        }
        if (results.length) {
            if (bcryptjs.compareSync(password, results[0].password)) {
                callBack("OK", results);
            } else {
                callBack("Contraseña incorrecta", null);
            }
        } else {
            callBack("Usuario invalido", null);
        }
    })
};

function nickNameExist({ nickName }, callBack) {
    connection.query({
        sql: "SELECT * FROM teachers WHERE nickName = ?",
        values: [nickName],
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta del nick-name".bgRed)
        }
        if (results.length) {
            callBack(true);
        } else {
            callBack(false);
        }
    })
}

function idExist({ id }, callBack) {
    connection.query({
        sql: "SELECT * FROM teachers WHERE cedula = ?",
        values: [id],
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta del id".bgRed)
        }
        if (results.length) {

            callBack(true);

        } else {
            callBack(false);
        }
    })
}


async function registerTeacher({ names, lastName, id, nickName, password, email, phone, auxPhone }, callback) {
    password = await bcryptjs.hash(password, 8);

    connection.query("INSERT INTO teachers SET ?", {
        name: names,
        lastName: lastName,
        cedula: id,
        nickName: nickName,
        password: password,
        email: email,
        phone: phone,
        phone2: auxPhone
    }, (error, results, fields) => {

        if (error) {
            console.log("Error al registrar profesor".bgRed);
            if (error.code == "ER_NO_REFERENCED_ROW_2") {
                callback("La cedula no está registrada en el sistema");
            } else {
                callback("ERROR");
            }
        } else {
            console.log(`Se ha registrado correctamente el profesor ${names} ${lastName}`.bgGreen);
            callback("OK");
        }
    });
};

async function insertAdmin(name, password) {
    password = await bcryptjs.hash(password, 8);

    connection.query("INSERT INTO administrators SET ?", {
        admin: name,
        password: password,

    }, (error, results, fields) => {

        if (error) {
            console.log("Error al registrar administrador".bgRed);

        } else {
            console.log(`Se ha registrado correctamente al administrador`.bgGreen);

        }
    });
};

function validateAdmin({ name, password }, callBack) {
    connection.query({
        sql: "SELECT * FROM administrators WHERE admin = ?",
        values: [name],
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta de administrador".bgRed)
        }
        if (results.length) {
            if (bcryptjs.compareSync(password, results[0].password)) {
                callBack("OK", results);
            } else {
                callBack("Acceso Denegado", null);
            }
        } else {
            callBack("Acceso Denegado", null);
        }
    })
};


function getTeacherList(callback) {

    connection.query({
        sql: "SELECT name, lastName, materias_teachers.cedula, materias, email, phone, phone2, nickName FROM materias_teachers LEFT JOIN teachers ON materias_teachers.cedula = teachers.cedula",
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta".bgRed)
        }
        if (results.length) {
            callback(null, results);

        } else {
            callback("No hay profesores registrados", null);
        }
    })

};

function registerMateriasAndTeacher(data, callback) {
    let cedula = data.cedula;
    delete data.cedula;
    materias = JSON.stringify(data);
    connection.query("INSERT INTO materias_teachers SET ?", {
        cedula: cedula,
        materias: materias,

    }, (error, results, fields) => {

        if (error) {
            console.log("Error al registrar materias y profesor".bgRed);
            if (error.code == "ER_DUP_ENTRY") {
                callback("Ya se ha inscrito a ese profesor")
            } else {
                callback("ERROR");
            }
        } else {
            console.log(`Se ha registrado correctamente las materias y el profesor`.bgGreen);
            callback("OK");
        }
    });
}

function removeTeacher(cedula, callback) {
    let sql = `DELETE FROM materias_teachers WHERE cedula = '${cedula}'`;
    connection.query(sql, function(error, result) {
        if (error) {
            callback("No se pudo eliminar el profesor")
        } else {
            // console.log("Number of records deleted: " + result.affectedRows);
            if (result.affectedRows == 0) {
                callback("La cedula no pertenece a ningun profesor inscrito")
            } else {
                callback("OK")
            }
        }
    });

}

function getCargaNotas(callBack) {
    connection.query({
        sql: "SELECT * FROM carganotas",
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta del nick-name".bgRed)
        }
        if (results.length) {
            callBack(JSON.stringify(results));
        } else {
            callBack("No existen datos");
        }
    })
}

function updateCargaNotas(subject, value, callBack) {

    connection.query({
        sql: `UPDATE carganotas SET value = ${value} WHERE subject = "${subject}"`,
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al actualizar los datos de la tabla carganotas ".bgRed);
            callBack("ERROR");
        } else {
            callBack("OK");
        }
    })

}






//preinscribe al estudiante
async function registerStudent({ studenName, studentLastName, tutorName, tutorLastName, idStuden, idTutor, password, email, phone, auxPhone, photo, anno, gender }, callback) {
    password = await bcryptjs.hash(password, 8);

    connection.query("INSERT INTO preinscription SET ?", {
        studentName: studenName,
        studentLastName: studentLastName,
        studentCedula: idStuden,
        parentName: tutorName,
        parentLastName: tutorLastName,
        parentCedula: idTutor,
        email: email,
        phone: phone,
        phone2: auxPhone,
        password: password,
        gender: gender,
        year: anno,
        photo: photo

    }, (error, results, fields) => {

        if (error) {

            console.log("Error al registrar estudiante".bgRed);
            // console.log(error.code)
            if (error.code = "ER_DUP_ENTRY") {
                callback("La cedúla del estudiante ya está registrada");
            } else {
                callback("ERROR");
            }

        } else {
            console.log(`Se ha registrado correctamente el estudiante`.bgGreen);
            callback("OK");
        }
    });
};


function validTutor({ idTutor, tutorName, tutorLastName }, callback) {

    connection.query({
        sql: "SELECT * FROM preinscription WHERE parentCedula = ?",
        values: [idTutor],
        timeout: 40000
    }, (error, results, fields) => {
        if (error) {
            console.log("Error al realizar la consulta del tutor".bgRed)
        }
        if (results.length) {
            if (results[0].parentName != tutorName || results[0].parentLastName != tutorLastName) {
                callback(false)
            } else {
                callback(true)
            }

        } else {
            callback(true);
        }
    })

}



module.exports = {
    registerTeacher,
    validateUser,
    nickNameExist,
    idExist,
    insertAdmin,
    validateAdmin,
    getTeacherList,
    registerMateriasAndTeacher,
    removeTeacher,
    getCargaNotas,
    updateCargaNotas,
    registerStudent,
    validTutor
};