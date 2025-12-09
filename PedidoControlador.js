class PedidoControlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }


    iniciar() {
        this.vista.dibujarProductos(this.modelo.productos, this.controladorAgregar.bind(this));
        this.vista.asociarControladorVaciar(this.controladorVaciar.bind(this));
        this.actualizarPedidoVista();
    }


    controladorAgregar(evento) {
        const idProducto = evento.target.getAttribute('data-id');

        this.modelo.agregarProducto(idProducto);
        this.actualizarPedidoVista();
    }

    controladorEliminar(evento) {
        const idProducto = evento.target.getAttribute('data-id');

        this.modelo.eliminarProducto(idProducto);

        this.actualizarPedidoVista();
    }

    controladorVaciar() {
        this.modelo.vaciarPedido();
        this.actualizarPedidoVista();
    }


    actualizarPedidoVista() {
        const pedidoDetallado = this.modelo.obtenerPedidoContado();
        const total = this.modelo.calcularTotal();

        this.vista.dibujarPedido(pedidoDetallado, this.controladorEliminar.bind(this));
        this.vista.actualizarTotal(total);
    }
}
