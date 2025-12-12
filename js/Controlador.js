class Controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.controlador = this;
        this.vista.asociarNav(this.controladorNav.bind(this));
    }

    //Vistas

    verificarSesion() {
        this.vista.mostrarCatalogo(
            this.modelo.productos,
            this.controladorAgregar.bind(this)
        );
        this.vista.ocultarLogin();
        this.actualizarCarritoVista();
        this.vista.asociarControladorVaciar(this.controladorVaciar.bind(this));
    }


    //Navegación

    controladorNav(e) {
        e.preventDefault();
        const id = e.target.id;

        if (id === 'nav-panel') {
            if (this.modelo.usuarioLogeado) {
                window.location.href = 'admin.html';
            } else {
                this.vista.mostrarLogin(this.manejadorLogin.bind(this));
                this.vista.ocultarCatalogo();
            }
        } else if (id === 'nav-productos') {
            this.vista.mostrarCatalogo(
                this.modelo.productos,
                this.controladorAgregar.bind(this)
            );
            this.vista.ocultarLogin();
        }
    }

    //Autenticación

    manejadorLogin(e) {
        e.preventDefault();
        const usuario = document.getElementById('admin-user-input').value;
        const clave = document.getElementById('admin-pass-input').value;
        const errorMsg = document.getElementById('login-error');

        if (this.modelo.intentarLogin(usuario, clave)) {
            errorMsg.textContent = '';
            window.location.href = 'admin.html';
        } else {
            errorMsg.textContent = 'Usuario o contraseña incorrectos.';
        }
    }

    //Carrito

    controladorAgregar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        this.modelo.agregarProducto(idProducto);
        this.actualizarCarritoVista();
    }

    controladorIncrementar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        this.modelo.agregarProducto(idProducto);
        this.actualizarCarritoVista();
    }

    controladorEliminar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        this.modelo.eliminarProducto(idProducto);
        this.actualizarCarritoVista();
    }

    controladorEliminarTodas(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        this.modelo.eliminarTodasUnidades(idProducto);
        this.actualizarCarritoVista();
    }

    controladorVaciar() {
        this.modelo.vaciarCarrito();
        this.actualizarCarritoVista();
    }

    actualizarCarritoVista() {
        const carritoDetallado = this.modelo.obtenerCarritoContado();
        const total = this.modelo.calcularTotal();
        this.vista.dibujarCarrito(
            carritoDetallado,
            this.controladorEliminar.bind(this),
            this.controladorIncrementar.bind(this),
            this.controladorEliminarTodas.bind(this)
        );
        this.vista.actualizarTotal(total);
    }
}