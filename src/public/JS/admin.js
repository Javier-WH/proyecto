Swal.fire({
    icon: 'warning',
    title: 'Esta sección es EXCLUSIVA para adminstradores',
    showDenyButton: true,
    confirmButtonText: ' SI, soy Administrador',
    denyButtonText: `NO, no soy Administrador`,
}).then((result) => {

    if (result.isDenied) {
        window.location.replace("/");
    }
})



async function checkUser() {
    let res = await fetch("/admin", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: document.getElementById("nick-name").value, password: document.getElementById("password").value })
    });
    let response = await res.text();
    if (response == "OK") {
        window.location.replace("/config");


    } else {
        Swal.fire({
            icon: 'error',
            title: response,
        })
    }

};

function checkData() {

    if (document.getElementById("nick-name").value == "") {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'Debe ingresar un usuario',
        })
        return false;
    } else if (document.getElementById("password").value == "") {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: 'Debe ingresar una contraseña',
        })
        return false;
    }

    return true;
};



document.getElementById("btn-login").addEventListener("click", () => {

    if (checkData()) {
        checkUser()
    }
});

document.getElementById("nick-name").addEventListener("keypress", e => {
    if (e.key == "Enter") {
        if (checkData()) {
            checkUser()
        }
    }
});

document.getElementById("password").addEventListener("keypress", e => {
    if (e.key == "Enter") {
        if (checkData()) {
            checkUser()
        }
    }
});