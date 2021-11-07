import { startLeftBar } from "./leftBarMenu.js";

async function getTeacherList(callback) {

    let res = await fetch("/getTeachers", {
        method: "POST"
    });

    let response = await res.json();
    try {
        callback(response);
    } catch (error) {
        ///Esto soluciona un maldito bug en la consola
    }
}

async function addTeacher(data, callback) {
    let res = await fetch("/addTeacher", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: data
    });

    let response = await res.text();
    callback(response);
}

async function removeTeacher(data, callback) {
    let res = await fetch("/removeTeacher", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: data
    });

    let response = await res.text();
    callback(response);
}

//oculta las opciones
function hideAllOptions() {
    document.getElementById("materias-added-list").innerHTML = ""
    document.getElementById("register-teacher-cedula").value = "";
    document.getElementById("teacherList").classList.add("invisible");
    document.getElementById("teacherList").innerHTML = "";
    document.getElementById("register-teacher").classList.add("invisible");
}
//carga los valores se la seccion carga de notas
async function getcargaNotasValue(callback) {

    let res = await fetch("/getCargaNotasValues", {
        method: "POST"
    });
    let response = await res.json();
    callback(response);

}

getcargaNotasValue(data => {

    for (let check of data) {
        if (check.subject == "lapso1") {
            if (check.value == 1) {
                document.getElementById("lapso1").classList.add("checked");
                document.getElementById("switch-1lapso").checked = true;
            } else {
                document.getElementById("lapso1").classList.remove("checked");
                document.getElementById("switch-1lapso").checked = false;
            }
        }
        if (check.subject == "lapso2") {
            if (check.value == 1) {
                document.getElementById("lapso2").classList.add("checked");
                document.getElementById("switch-2lapso").checked = true;
            } else {
                document.getElementById("lapso2").classList.remove("checked");
                document.getElementById("switch-2lapso").checked = false;
            }
        }
        if (check.subject == "lapso3") {
            if (check.value == 1) {
                document.getElementById("lapso3").classList.add("checked");
                document.getElementById("switch-3lapso").checked = true;
            } else {
                document.getElementById("lapso3").classList.remove("checked");
                document.getElementById("switch-3lapso").checked = false;
            }
        }
        if (check.subject == "allow_edit") {
            if (check.value == 1) {
                document.getElementById("allow_edit").classList.add("checked");
                document.getElementById("switch-edit-grade").checked = true;
            } else {
                document.getElementById("allow_edit").classList.remove("checked");
                document.getElementById("switch-edit-grade").checked = false;
            }
        }
    }

});

//almacena los daros cambiados en la seccion carga de notas

async function updateCargaNotas(data, callback) {
    let res = await fetch("/setCargaNotas", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: data
    });

    let response = await res.text();
    callback(response);
}

//

document.getElementById("switch-container-CargaNotas").addEventListener("click", e => {
    if (e.target.classList.contains("switch-label")) {
        e.target.classList.toggle("checked");

        let value = e.target.classList.contains("checked") ? 1 : 0;
        let subject = e.target.id;
        let data = JSON.stringify({ value, subject });

        updateCargaNotas(data, response => {
            if (response != "OK") {
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: 'Ha ocurrido un error desconocido, no se han realizado cambios',
                })
            }
        });
    }
})



////////////////////////////////////////fix
//opcion mostrar profesores
document.getElementById("show-teacher-list").addEventListener("click", () => {
    let table = document.getElementById("teacherList");
    let stringTable = "";


    if (table.classList.contains("invisible")) {
        hideAllOptions();
        getTeacherList((teacherList) => {

            if (teacherList.length == 1 && typeof(teacherList[0].cedula) == "undefined") {
                table.innerHTML = `<h3>No se han inscrito profesores</h3> `
                table.classList.remove("invisible");
            } else {
                stringTable = `<div class="table-container">
                                    <div class="table-horizontal-container">
                                        <table class="unfixed-table">
                                            <thead>
                                                <tr>
                                                    <th>Profesor</th>
                                                    <th>Cédula</th>
                                                    <th>Materias</th>
                                                    <th>Email</th>
                                                    <th>Telefono</th>
                                                    <th>Telefono secundario</th>
                                                    <th>Nick-Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>`;

                for (let i = 0; i < teacherList.length; i++) {
                    let materias = "";
                    let name = teacherList[i].name ? teacherList[i].name : "No se ha suministrado nombre";
                    let lastName = teacherList[i].lastName ? teacherList[i].lastName : "";
                    let cedula = teacherList[i].cedula;
                    let email = teacherList[i].email ? teacherList[i].email : "No se ha suministrado un Email";
                    let phone = teacherList[i].phone ? teacherList[i].phone : "No se han suministrado telefono";
                    let phone2 = teacherList[i].phone2 ? teacherList[i].phone2 : "No se han suministrado telefono";
                    let nickName = teacherList[i].nickName ? teacherList[i].nickName : "No se han suministrado un Nick-name";
                    let mat = JSON.parse(teacherList[i].materias);

                    materias += mat.primer.A.length != 0 ? `<p>(1er A) ${mat.primer.A}</p>`.replace(",", ", ") : "";
                    materias += mat.primer.B.length != 0 ? `<p>(1er B) ${mat.primer.B}</p>`.replace(",", ", ") : "";
                    materias += mat.primer.C.length != 0 ? `<p>(1er C) ${mat.primer.C}</p>`.replace(",", ", ") : "";

                    materias += mat.segundo.A.length != 0 ? `<p>(2do A) ${mat.segundo.A}</p>`.replace(",", ", ") : "";
                    materias += mat.segundo.B.length != 0 ? `<p>(2do B) ${mat.segundo.B}</p>`.replace(",", ", ") : "";
                    materias += mat.segundo.C.length != 0 ? `<p>(2do B) ${mat.segundo.C}</p>`.replace(",", ", ") : "";

                    materias += mat.Tercer.A.length != 0 ? `<p>(3er A) ${mat.Tercer.A}</p>`.replace(",", ", ") : "";
                    materias += mat.Tercer.B.length != 0 ? `<p>(3er B) ${mat.Tercer.B}</p>`.replace(",", ", ") : "";
                    materias += mat.Tercer.C.length != 0 ? `<p>(3er C) ${mat.Tercer.C}</p>`.replace(",", ", ") : "";

                    materias += mat.cuarto.A.length != 0 ? `<p>(4to A) ${mat.cuarto.A}</p>`.replace(",", ", ") : "";
                    materias += mat.cuarto.B.length != 0 ? `<p>(4to B) ${mat.cuarto.B}</p>`.replace(",", ", ") : "";
                    materias += mat.cuarto.C.length != 0 ? `<p>(4to C) ${mat.cuarto.C}</p>`.replace(",", ", ") : "";

                    materias += mat.quinto.A.length != 0 ? `<p>(5to A) ${mat.quinto.A}</p>`.replace(",", ", ") : "";
                    materias += mat.quinto.B.length != 0 ? `<p>(5to B) ${mat.quinto.B}</p>`.replace(",", ", ") : "";
                    materias += mat.quinto.C.length != 0 ? `<p>(5to C) ${mat.quinto.C}</p>`.replace(",", ", ") : "";

                    stringTable += ` <tr>
                                        <td>${name} ${lastName}</td>
                                        <td>${cedula}</td>
                                        <td><div class="materia-list-container">${materias}</div></td>
                                        <td>${email}</td>
                                        <td>${phone}</td>
                                        <td>${phone2}</td>
                                        <td>${nickName}</td>
                                     </tr>`
                }

                stringTable += ` </tbody></table></div> </div>`;
                table.innerHTML = stringTable;
                table.classList.remove("invisible");
            }

        });

    } else {
        table.classList.add("invisible");
        table.innerHTML = "";
    }
})

//opcion inscribir profesor

document.getElementById("show-register-teacher").addEventListener("click", () => {
    if (document.getElementById("register-teacher").classList.contains("invisible")) {
        hideAllOptions();
    }
    document.getElementById("register-teacher").classList.toggle("invisible");
})

// opcion despedir profesor


document.getElementById("show-remove-teacher").addEventListener("click", () => {
    hideAllOptions();
    Swal.fire({
        title: 'Escriba la cedula del profesor a despedir',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Despedir',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: (cedula) => {
            if (cedula != "") {

                Swal.fire({
                    title: `¿Está seguro que desea despedir al profesor`,
                    text: "Este proceso no se puede revertir",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, despide al profesor',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        removeTeacher(`{"cedula": "${cedula}"}`, response => {
                            if (response == "OK") {
                                Swal.fire(
                                    'Despedido',
                                    'El profesor fue despedido'
                                )
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'ERROR',
                                    text: response,
                                })
                            }

                        })

                    }
                })
            } else {
                Swal.fire(
                    'No ingresó ninguna cedula',
                    'no se realizó ninguna accion',
                    'question'
                )
            }
        }
    })
})

////////////////////////////////////////////////
//boton agregr materia
document.getElementById("btn-add-materia").addEventListener("click", () => {
    let matter = document.getElementById("materia").value;
    let grade = document.getElementById("anno").value;
    let seccion = document.getElementById("seccion").value;
    let anno = "";
    switch (grade) {
        case "1":
            anno = "1er año";
            break;
        case "2":
            anno = "2do año";
            break;
        case "3":
            anno = "3er año";
            break;
        case "4":
            anno = "4to año";
            break;
        case "5":
            anno = "5to año";
            break;
        default:
            break;
    }
    if (matter != "off" && grade != "off" && seccion != "off") {
        let list = document.getElementById("materias-added-list");
        list.innerHTML += `<span class="materia-item"> ${matter} de ${anno} ${seccion}</span> `;
        document.getElementById("materia").selectedIndex = 0;
        document.getElementById("anno").selectedIndex = 0;
        document.getElementById("seccion").selectedIndex = 0;

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Debes seleccionar todas las opciones',
            text: 'Para agregar una materia necesitas seleccionar el año, la sección y el nombre e la materia',
        })
    }
})

//elimina la materia seleccionada con click
document.getElementById("materias-added-list").addEventListener("click", e => {
    if (e.target.classList.contains("materia-item")) {
        e.target.remove();
    }
})

//////////////btn register teacher

document.getElementById("btn-register-teahcer").addEventListener("click", () => {
    let data = document.getElementsByClassName("materia-item");

    if (document.getElementById("register-teacher-cedula").value != '' && data.length > 0) {

        let materias = {
            cedula: document.getElementById("register-teacher-cedula").value,
            primer: {
                A: [],
                B: [],
                C: []
            },
            segundo: {
                A: [],
                B: [],
                C: []
            },
            Tercer: {
                A: [],
                B: [],
                C: []
            },
            cuarto: {
                A: [],
                B: [],
                C: []
            },
            quinto: {
                A: [],
                B: [],
                C: []
            }
        }
        for (let i = 0; i < data.length; i++) {
            let item = data[i].innerText.replace(' de ', '');
            item = item.replace(' año', '');

            if (item.includes('1er')) {
                item = item.replace('1er', '');
                if (item.includes(' A')) {
                    item = item.replace(' A', '');
                    materias.primer.A.push(item);
                }
                if (item.includes(' B')) {
                    item = item.replace(' B', '');
                    materias.primer.B.push(item);
                }
                if (item.includes(' C')) {
                    item = item.replace(' C', '');
                    materias.primer.B.push(item);
                }
                if (item.includes(' D')) {
                    item = item.replace(' D', '');
                    materias.primer.D.push(item);
                }
            }
            if (item.includes('2do')) {
                item = item.replace('2do', '');
                if (item.includes(' A')) {
                    item = item.replace(' A', '');
                    materias.segundo.A.push(item);
                }
                if (item.includes(' B')) {
                    item = item.replace(' B', '');
                    materias.segundo.B.push(item);
                }
                if (item.includes(' C')) {
                    item = item.replace(' C', '');
                    materias.segundo.B.push(item);
                }
                if (item.includes(' D')) {
                    item = item.replace(' D', '');
                    materias.segundo.D.push(item);
                }
            }
            if (item.includes('3er')) {
                item = item.replace('3er', '');
                if (item.includes(' A')) {
                    item = item.replace(' A', '');
                    materias.Tercer.A.push(item);
                }
                if (item.includes(' B')) {
                    item = item.replace(' B', '');
                    materias.Tercer.B.push(item);
                }
                if (item.includes(' C')) {
                    item = item.replace(' C', '');
                    materias.Tercer.B.push(item);
                }
                if (item.includes(' D')) {
                    item = item.replace(' D', '');
                    materias.Tercer.D.push(item);
                }
            }
            if (item.includes('4to')) {
                item = item.replace('4to', '');
                if (item.includes(' A')) {
                    item = item.replace(' A', '');
                    materias.cuarto.A.push(item);
                }
                if (item.includes(' B')) {
                    item = item.replace(' B', '');
                    materias.cuarto.B.push(item);
                }
                if (item.includes(' C')) {
                    item = item.replace(' C', '');
                    materias.cuarto.B.push(item);
                }
                if (item.includes(' D')) {
                    item = item.replace(' D', '');
                    materias.cuarto.D.push(item);
                }
            }
            if (item.includes('5to')) {
                item = item.replace('5to', '');
                if (item.includes(' A')) {
                    item = item.replace(' A', '');
                    materias.quinto.A.push(item);
                }
                if (item.includes(' B')) {
                    item = item.replace(' B', '');
                    materias.quinto.B.push(item);
                }
                if (item.includes(' C')) {
                    item = item.replace(' C', '');
                    materias.quinto.B.push(item);
                }
                if (item.includes(' D')) {
                    item = item.replace(' D', '');
                    materias.quinto.D.push(item);
                }
            }
        }

        addTeacher(JSON.stringify(materias), response => {
            if (response == "OK") {

                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Se ha registrdo correctamente al profesor',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response,
                })
            }
        })
        document.getElementById("register-teacher-cedula").value = "";
        document.getElementById("materias-added-list").innerHTML = ""
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes indicar una cedula y escoger al menos una materia'
        })
    }

})


document.getElementById("show-print-teacherList").addEventListener("click", () => {
    let list = document.getElementById("teahcer-list-nomina");

    getTeacherList(response => {
        list.innerHTML = "";
        let text = ""
        for (let i = 0; i < response.length; i++) {
            text += `<p class="nomina-teacher">${response[i].name} ${response[i].lastName}, ${response[i].cedula}</p>`
        }
        list.innerHTML = text;


        let ventimp = window.open(' ', 'popimpr');
        ventimp.document.write(document.getElementById("nomina").innerHTML);
        ventimp.document.close();
        setTimeout(() => {
            ventimp.print();
            ventimp.close();
        }, 100);
    })
})











startLeftBar();
getTeacherList();