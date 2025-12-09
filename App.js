document.addEventListener('DOMContentLoaded', function() {
    const modelo = new PedidoModelo();
    const vista = new PedidoVista();
    const controlador = new PedidoControlador(modelo, vista);
    
    controlador.iniciar();
});