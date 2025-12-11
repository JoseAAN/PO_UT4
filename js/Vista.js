// Vista.js

class Vista {
    constructor() {
        this.vistaProductos = document.querySelector('#items');
        this.vistaPedido = document.querySelector('#pedido');
        this.vistaPrecioTotal = document.querySelector('#total');
        this.vistaVaciar = document.querySelector('#boton-vaciar');
    }

    dibujarProductos(productos, controladorAgregar) {
        this.vistaProductos.textContent = '';

        productos.forEach(info => {
            const articulo = document.createElement('div');
            articulo.classList.add('card', 'col-sm-3', 'mb-3', 'text-center', 'p-2');

            const imagenArticulo = document.createElement('img');
            imagenArticulo.src = info.thumbnail || info.images[0] || 'placeholder.jpg';
            imagenArticulo.classList.add('card-img-top', 'mb-2');

            const nombreArticulo = document.createElement('h5');
            nombreArticulo.classList.add('card-title');
            nombreArticulo.textContent = info.title;

            const precioArticulo = document.createElement('p');
            precioArticulo.textContent = info.price ? info.price.toFixed(2) + '€' : 'N/A';

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

    // EL MÉTODO dibujarPedido AHORA RECIBE CUATRO ARGUMENTOS
    dibujarPedido(pedidoDetallado, controladorEliminar, controladorIncrementar, controladorEliminarTodas) {
        this.vistaPedido.textContent = ''; 

        pedidoDetallado.forEach(item => {
            const articulo = document.createElement('li');
            articulo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            // --- 1. IMAGEN ---
            const imagenMiniatura = document.createElement('img');
            imagenMiniatura.src = item.imagenUrl || 'placeholder.jpg';
            imagenMiniatura.style.width = '30px'; 
            imagenMiniatura.style.height = '30px';
            imagenMiniatura.style.objectFit = 'cover';
            imagenMiniatura.style.marginRight = '10px';
            imagenMiniatura.style.borderRadius = '5px';
            articulo.appendChild(imagenMiniatura);
            
            // --- 2. INFO DE TEXTO ---
            const precioPedido = (item.precio * item.cantidad).toFixed(2);
            const infoSpan = document.createElement('span');
            infoSpan.textContent = `${item.cantidad} x ${item.nombre} - ${precioPedido}€`;
            infoSpan.style.flexGrow = '1'; 
            articulo.appendChild(infoSpan);
            
            // --- 3. BOTONES DE CONTROL ---
            const botonesDiv = document.createElement('div');
            botonesDiv.style.display = 'flex';
            botonesDiv.style.gap = '5px'; 

            // Botón de Incrementar (+)
            const botonIncrementar = document.createElement('button');
            botonIncrementar.classList.add('btn', 'btn-success', 'btn-sm');
            botonIncrementar.textContent = '+';
            botonIncrementar.setAttribute('data-id', item.id);
            botonIncrementar.addEventListener('click', controladorIncrementar); 

            // Botón de Eliminar UNA unidad (-)
            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('btn', 'btn-warning', 'btn-sm'); 
            botonEliminar.textContent = '-';
            botonEliminar.setAttribute('data-id', item.id);
            botonEliminar.addEventListener('click', controladorEliminar);
            
            // Botón de Eliminar TODAS las unidades (X)
            const botonEliminarTodas = document.createElement('button');
            botonEliminarTodas.classList.add('btn', 'btn-danger', 'btn-sm'); 
            botonEliminarTodas.textContent = 'X';
            botonEliminarTodas.setAttribute('data-id', item.id);
            botonEliminarTodas.addEventListener('click', controladorEliminarTodas);


            // Añadir al DOM
            botonesDiv.appendChild(botonIncrementar);
            botonesDiv.appendChild(botonEliminar);
            botonesDiv.appendChild(botonEliminarTodas);

            articulo.appendChild(botonesDiv);

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