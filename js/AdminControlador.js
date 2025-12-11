// js/AdminControlador.js 

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
        this.asociarHandlersAdmin();
    }
    
    iniciarCRUD() {
        document.getElementById('user-info').innerHTML = 
            `Bienvenido, ${this.modelo.usuarioLogeado}. 
             <button id="logout-btn" class="btn btn-danger btn-sm" style="margin-left: 10px;">Cerrar Sesión</button>`;
        
        // Dibuja el formulario (vacío inicialmente) y la tabla
        this.vista.dibujarAdminCRUD(
            this.modelo.productos, 
            this.manejadorGuardar.bind(this), // Handler del formulario (Crear/Actualizar)
            this.manejadorTablaAccion.bind(this) // Handler para botones Editar/Eliminar
        ); 
        
        // Asegura que el formulario esté en modo 'Crear' al inicio
        this.vista.limpiarFormularioAdmin(); 
        this.modoEdicion = false;
        this.idEditando = null;
    }
    
    // --- Handlers de Autenticación y Navegación ---

    asociarHandlersAdmin() {
        const navProductos = document.querySelector('#nav-productos');
        if (navProductos) {
            navProductos.addEventListener('click', (e) => {
                 e.preventDefault(); 
                 this.modelo.cerrarSesion(); // Cierra la sesión para evitar el bucle de redirección
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

    // --- Handlers del CRUD ---

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
        
        // Obtener datos del formulario
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
        
        // Limpiar y redibujar
        this.vista.limpiarFormularioAdmin();
        this.iniciarCRUD(); // Redibuja la tabla con los nuevos datos
        this.modoEdicion = false;
        this.idEditando = null;
    }

    manejadorEliminarAdmin(idProducto) {
        if (confirm(`¿Estás seguro de que quieres eliminar el producto ID ${idProducto}?`)) {
            this.modelo.eliminarProductoAdmin(idProducto);
            this.iniciarCRUD(); // Redibuja la tabla
        }
    }

    manejadorCargarEdicion(idProducto) {
        const producto = this.modelo.obtenerProductoPorId(idProducto);
        if (producto) {
            this.vista.cargarFormularioAdmin(producto);
            this.modoEdicion = true;
            this.idEditando = idProducto; // Almacenamos el ID que estamos editando
        }
    }
}