class PedidoVista {
    constructor() {
        this.vistaProductos = document.querySelector('#items');
        this.vistaPedido = document.querySelector('#pedido');
        this.vistaPrecioTotal = document.querySelector('#total');
        this.vistaVaciar = document.querySelector('#boton-vaciar');
    }

    dibujarProductos(productos, controladorAgregar) {
        this.vistaProductos.textContent = '';

        // const saltoLinea = document.createElement('br')


        productos.forEach(info => {
            const articulo = document.createElement('div');
            articulo.classList.add('card', 'col-sm-3', 'mb-3', 'text-center', 'p-2');

            const imagenArticulo = document.createElement('img');
            imagenArticulo.src = info.imagen;
            imagenArticulo.classList.add('card-img-top', 'mb-2');
            articulo.appendChild(imagenArticulo);

            const nombreArticulo = document.createElement('h5');
            nombreArticulo.classList.add('card-title');
            nombreArticulo.textContent = info.nombre;

            const precioArticulo = document.createElement('p');
            precioArticulo.textContent = info.precio.toFixed(2) + '€';

            const agregarArticulo = document.createElement('button');
            agregarArticulo.classList.add('btn', 'btn-primary');
            agregarArticulo.textContent = 'Añadir';
            agregarArticulo.setAttribute('data-id', info.id);

            agregarArticulo.addEventListener('click', controladorAgregar);

            articulo.appendChild(imagenArticulo);
            articulo.appendChild(nombreArticulo);
            articulo.appendChild(precioArticulo);
            articulo.appendChild(agregarArticulo);
            this.vistaProductos.appendChild(articulo);

        });
    }

    dibujarPedido(pedidoDetallado, controladorEliminar) {
        this.vistaPedido.textContent = '';

        pedidoDetallado.forEach(item => {
            const articulo = document.createElement('li');
            articulo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            const precioPedido = (item.precio * item.cantidad).toFixed(2);
            articulo.textContent = `${item.cantidad} x ${item.nombre} - ${precioPedido}€`;

            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.setAttribute('data-id', item.id);
            botonEliminar.addEventListener('click', controladorEliminar);
            articulo.appendChild(botonEliminar);

            this.vistaPedido.appendChild(articulo);
        });
    }

    actualizarTotal(total) {
        this.vistaPrecioTotal.textContent = total + '€';
    }

    asociarControladorVaciar(controladorVaciar) {
        this.vistaVaciar.addEventListener('click', controladorVaciar);
    }
}