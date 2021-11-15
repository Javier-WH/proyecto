async function registerStudent(student) {

    let res = await fetch("/preInscripcion", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: student
    });
    let response = await res.text();

    if (response == "OK") {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se ha registrado correctamente al estudiante',
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

    if (document.getElementById("id-tutor").value.length > 10) {

        pass = false;
    }

    if (document.getElementById("anno").selectedIndex == 0) {

        pass = false;
    }

    return pass;
}


document.getElementById("btn-atras").addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("/");
});


function encodeImageFileAsURL(element, callback) {
    let file = element.files[0];
    let reader = new FileReader();
    reader.onloadend = function() {

        callback(reader.result);

    }
    reader.readAsDataURL(file);
}

document.getElementById("btn-register").addEventListener("click", e => {
    e.preventDefault();

    if (document.getElementById("password").value === document.getElementById("password2").value) {

        if (checkMissingData()) {
            let image = document.getElementById("image-student");
            /////////////////////////////////////////////////////////////////////////////////////////
            let data = new FormData(document.getElementById("formulario"));
            if (image.value == '') {
                let jsonData = JSON.stringify(Object.fromEntries(data));
                registerStudent(jsonData);
            } else {

                encodeImageFileAsURL(image, base64 => {
                    data.append("photo", base64)
                    let jsonData = JSON.stringify(Object.fromEntries(data));
                    registerStudent(jsonData);
                });
            }
            //////////////////////////////////////////////////////////
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error',
                text: "Debe llenar todos los campos correctamente"
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


document.getElementById("image-student").addEventListener("change", () => {

    var oFReader = new FileReader();
    oFReader.readAsDataURL(document.getElementById("image-student").files[0]);

    oFReader.addEventListener("load", (e) => {
        document.getElementById("lgl-imageStudent").innerText = ""
        document.getElementById("lgl-imageStudent").style.backgroundImage = `url(${e.target.result})`;
    })

})