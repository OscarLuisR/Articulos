import Swal from 'sweetalert2';

export default {
    muestraAlerta(icono, titulo, texto) {
        Swal.fire({
            icon: icono,
            title: titulo,
            text: texto,
            allowOutsideClick: false
        });
    },

    muestraConfirmacion(icono, titulo) {
        return new Promise (function(resolve) {
            resolve(Swal.fire({
                title: titulo,
                icon: icono,
                showCancelButton: true,
                allowOutsideClick: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }));
        });
    }
};