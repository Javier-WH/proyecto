export function startLeftBar() {

    //listeners

    document.getElementById("left-information").addEventListener("click", () => {
        Swal.fire({
            title: 'Proyecto Control de Notas version alfa 1.1',
            text: 'Creado por: Francisco Javier Rodríguez Hernández',
            imageUrl: './IMG/creditos.png',
            imageWidth: 400,
            imageHeight: 250,
            imageAlt: 'Custom image',
        })
    })

    document.getElementById("logout").addEventListener("click", logout)


}

async function logout() {
    let res = await fetch("/logout");
    let response = await res.text();
    if (response == "OK") {
        Swal.fire({
            title: '¿Desea cerrar la sección?',
            showCancelButton: true,
            confirmButtonText: 'Cerrar sección',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.replace("/");
            }
        })


    } else {
        Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: response,
        })
    }
}