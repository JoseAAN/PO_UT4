// js/controlador.js

class Controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.vista.controlador = this; 
        
        this.vista.asociarNavHandlers(this.controladorNav.bind(this));
    }

    // --- Ruteo y Vistas (Ejecutado en index.html) ---

    verificarSesion() {
        // 1. Siempre muestra el catálogo por defecto
        this.vista.mostrarCatalogo(
            this.modelo.productos, 
            this.controladorAgregar.bind(this)
        );
        
        // 2. Si hay sesión, simplemente ocultamos cualquier remanente del Login.
        this.vista.ocultarLogin();
        
        // 3. Inicialización de elementos de carrito
        this.actualizarPedidoVista(); 
        this.vista.asociarControladorVaciar(this.controladorVaciar.bind(this));
    }


    // --- Manejador de Navegación ---

    controladorNav(e) {
        e.preventDefault();
        const id = e.target.id;

        if (id === 'nav-panel') {
            if (this.modelo.usuarioLogeado) {
                // Va directo al panel si está logueado
                window.location.href = 'admin.html';
            } else {
                // 💥 CORRECCIÓN CRÍTICA: Mostrar formulario de Login y ocultar el catálogo
                this.vista.mostrarLogin(this.manejadorLogin.bind(this));
                this.vista.ocultarCatalogo();
            }
        } else if (id === 'nav-productos') {
            // Volver al catálogo, ocultando el formulario de login si estaba visible
            this.vista.mostrarCatalogo(
                this.modelo.productos, 
                this.controladorAgregar.bind(this)
            );
            this.vista.ocultarLogin();
        }
    }

    // --- Manejadores de Autenticación (Login) ---

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

    // --- Manejadores de Carrito (CRUD del Pedido) ---

    controladorAgregar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id')); 
        if (typeof this.modelo.agregarProducto === 'function') {
            this.modelo.agregarProducto(idProducto);
            this.actualizarPedidoVista();
        } else {
            console.error("Método 'agregarProducto' no definido en el Modelo.");
        }
    }
    
    controladorIncrementar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id')); 
        if (typeof this.modelo.agregarProducto === 'function') {
            this.modelo.agregarProducto(idProducto); 
            this.actualizarPedidoVista();
        } else {
            console.error("Método 'agregarProducto' no definido en el Modelo.");
        }
    }

    controladorEliminar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        if (typeof this.modelo.eliminarProducto === 'function') {
             this.modelo.eliminarProducto(idProducto);
             this.actualizarPedidoVista();
        } else {
             console.error("Método 'eliminarProducto' no definido en el Modelo.");
        }
    }
    
    controladorEliminarTodas(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        if (typeof this.modelo.eliminarTodasUnidades === 'function') {
            this.modelo.eliminarTodasUnidades(idProducto);
            this.actualizarPedidoVista();
        } else {
            console.error("Método 'eliminarTodasUnidades' no definido en el Modelo.");
        }
    }

    controladorVaciar() {
        if (typeof this.modelo.vaciarPedido === 'function') {
            this.modelo.vaciarPedido();
            this.actualizarPedidoVista();
        } else {
            console.error("Método 'vaciarPedido' no definido en el Modelo.");
        }
    }

    actualizarPedidoVista() {
        if (typeof this.modelo.obtenerPedidoContado === 'function' && typeof this.modelo.calcularTotal === 'function') {
            const pedidoDetallado = this.modelo.obtenerPedidoContado();
            const total = this.modelo.calcularTotal();

            this.vista.dibujarPedido(
                pedidoDetallado, 
                this.controladorEliminar.bind(this),
                this.controladorIncrementar.bind(this),
                this.controladorEliminarTodas.bind(this)
            );
            
            this.vista.actualizarTotal(total);
        } else {
             console.warn("Métodos de pedido no definidos en el Modelo. No se puede actualizar el pedido.");
        }
    }
}