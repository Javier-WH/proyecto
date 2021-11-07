async function registerTeaacher(teacher) {

    let res = await fetch("/registro", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: teacher
    });
    let response = await res.text();

    if (response == "OK") {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se ha registrado correctamente el profesor',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(() => {
            window.location.replace("/");
        }, 1510);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: response
        })
    }


};

function checkMissingData() {
    let dataList = document.getElementsByClassName("input-data");
    let pass = true;
    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].value == "" && dataList[i].id != "aux-phone") {
            // dataList[i].classList.add("missing");
            pass = false;
        }
    }

    if (document.getElementById("id").value.length > 10) {
        Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: "La cedula es incorrecta"
        })
        pass = false;
    }

    return pass;
}




document.getElementById("btn-atras").addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("/");
});

document.getElementById("btn-register").addEventListener("click", e => {
    e.preventDefault();
    if (document.getElementById("password").value === document.getElementById("password2").value) {
        if (checkMissingData()) {
            let data = new FormData(document.getElementById("formulario"));
            let jsonData = JSON.stringify(Object.fromEntries(data));
            registerTeaacher(jsonData);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error',
                text: "Debe llenar todos los campos"
            })
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: "Las contraseñas son diferentes"
        })
    }
});