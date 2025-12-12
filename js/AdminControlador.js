document.addEventListener('DOMContentLoaded', async () => {
    const modelo = new Modelo();
    const vista = new Vista();

    await modelo.cargarProductos();

    const adminControlador = new AdminControlador(modelo, vista);
    adminControlador.verificarAcceso();
});


class AdminControlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.controlador = this;
        this.modoEdicion = false;
        this.idEditando = null;
    }

    verificarAcceso() {
        if (!this.modelo.usuarioLogeado) {
            window.location.href = 'index.html';
            return;
        }

        this.iniciarCRUD();
        this.asociarManejadorAdmin();
    }

    iniciarCRUD() {
        document.getElementById('user-info').innerHTML =
            `Bienvenido, ${this.modelo.usuarioLogeado}. 
             <button id="logout-btn" class="btn btn-danger btn-sm" style="margin-left: 10px;">Cerrar Sesión</button>`;

        this.vista.dibujarAdminCRUD(
            this.modelo.productos,
            this.manejadorGuardar.bind(this), 
            this.manejadorTablaAccion.bind(this) 
        );

        this.vista.limpiarFormularioAdmin();
        this.modoEdicion = false;
        this.idEditando = null;
    }

    //Autenticación y Navegación

    asociarManejadorAdmin() {
        const navProductos = document.querySelector('#nav-productos');
        if (navProductos) {
            navProductos.addEventListener('click', (e) => {
                e.preventDefault();
                this.modelo.cerrarSesion(); 
                window.location.href = 'index.html';
            });
        }

        document.getElementById('user-info').addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                this.manejadorLogout();
            }
        });
    }

    manejadorLogout() {
        this.modelo.cerrarSesion();
        window.location.href = 'index.html';
    }


    manejadorTablaAccion(e) {
        const boton = e.target;
        const idProducto = boton.getAttribute('data-id');

        if (boton.textContent === 'Eliminar') {
            this.manejadorEliminarAdmin(idProducto);
        } else if (boton.textContent === 'Editar') {
            this.manejadorCargarEdicion(idProducto);
        }
    }

    manejadorGuardar(e) {
        e.preventDefault();
        const formulario = e.target;

        const datos = {
            title: formulario.querySelector('#producto-title').value,
            price: parseFloat(formulario.querySelector('#producto-price').value),
            stock: parseInt(formulario.querySelector('#producto-stock').value) || 0,
            thumbnail: 'https://cdn.dummyjson.com/product-images/placeholder.jpg'
        };

        if (this.modoEdicion) {
            datos.id = parseInt(this.idEditando);
            this.modelo.actualizarProducto(datos);
        } else {
            this.modelo.crearProducto(datos);
        }

        this.vista.limpiarFormularioAdmin();
        this.iniciarCRUD(); 
        this.modoEdicion = false;
        this.idEditando = null;
    }

    manejadorEliminarAdmin(idProducto) {
            this.modelo.eliminarProductoAdmin(idProducto);
            this.iniciarCRUD(); 
    }

    manejadorCargarEdicion(idProducto) {
        const producto = this.modelo.obtenerProductoPorId(idProducto);
        if (producto) {
            this.vista.cargarFormulario(producto);
            this.modoEdicion = true;
            this.idEditando = idProducto;
        }
    }
}