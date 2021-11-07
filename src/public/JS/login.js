async function checkUser() {
    let res = await fetch("/checkUser", {
        method: "POST",
        headers: {
            'Accept': '*/*',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: document.getElementById("nick-name").value, password: document.getElementById("password").value })
    });
    let response = await res.text();
    if (response == "OK") {
        window.location.replace("/welcome");

    } else {
        Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: response,
        })

    }

};

function checkData() {

    if (document.getElementById("nick-name").value == "") {
        let error = document.getElementById("error-message");

        Swal.fire({
            icon: 'error',
            title: 'Debe ingresar un usuario',
            text: 'por favor llene todos los campos',
        })

        return false;
    } else if (document.getElementById("password").value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Debe ingresar una contraseña',
            text: 'por favor llene todos los campos',
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