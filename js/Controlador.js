// Controlador.js

class Controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }

    verificarSesion() {
        this.vista.dibujarProductos(this.modelo.productos, this.controladorAgregar.bind(this));
        
        // Asociamos el listener de 'Vaciar' una vez al inicio.
        this.vista.asociarControladorVaciar(this.controladorVaciar.bind(this)); 
        
        this.actualizarPedidoVista(); 
    }


    controladorAgregar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id')); 
        
        if (typeof this.modelo.agregarProducto === 'function') {
            this.modelo.agregarProducto(idProducto);
            this.actualizarPedidoVista();
        } else {
            console.error("Método 'agregarProducto' no definido en el Modelo.");
        }
    }
    
    // NUEVO MANEJADOR: Botón '+' en el carrito
    controladorIncrementar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id')); 
        
        if (typeof this.modelo.agregarProducto === 'function') {
            // Reutilizamos agregarProducto, ya que incrementar es lo mismo que añadir
            this.modelo.agregarProducto(idProducto); 
            this.actualizarPedidoVista();
        } else {
            console.error("Método 'agregarProducto' no definido en el Modelo.");
        }
    }

    // MANEJADOR: Botón '-' en el carrito
    controladorEliminar(evento) {
        const idProducto = parseInt(evento.target.getAttribute('data-id'));
        if (typeof this.modelo.eliminarProducto === 'function') {
             this.modelo.eliminarProducto(idProducto);
             this.actualizarPedidoVista();
        } else {
             console.error("Método 'eliminarProducto' no definido en el Modelo.");
        }
    }
    
    // NUEVO MANEJADOR: Botón 'X' en el carrito
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

            // ⚠️ CORRECCIÓN CLAVE: Pasar los cuatro handlers a dibujarPedido
            this.vista.dibujarPedido(
                pedidoDetallado, 
                this.controladorEliminar.bind(this), // (-) Eliminar una unidad
                this.controladorIncrementar.bind(this), // (+) Añadir una unidad
                this.controladorEliminarTodas.bind(this) // (X) Eliminar TODAS
            );
            
            this.vista.actualizarTotal(total);
        } else {
             console.warn("Métodos de pedido (obtenerPedidoContado o calcularTotal) no definidos en el Modelo. No se puede actualizar el pedido.");
        }
    }
}