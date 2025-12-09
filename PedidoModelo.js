class PedidoModelo {
    constructor() {
        this.productos = this.cartListar();
        this.pedido = [];
    }

    cartListar() {
        if (!sessionStorage.getItem('productos')) {
            const carta = [
                { id: 1, nombre: 'Menú Hamburguesa', precio: 9.50, imagen: 'imagenes/menu_hamburgesa_pollo.jpg' },
                { id: 2, nombre: 'Menú Pollo para 2', precio: 20.00, imagen: 'imagenes/menu_pollo_2.png'  },
                { id: 3, nombre: 'Menú 8 Alitas picantes', precio: 12.50, imagen: 'imagenes/menu_alitas_picantes.jpg'  },
                { id: 4, nombre: 'Aros de cebolla', precio: 4.50, imagen: 'imagenes/aros_cebolla.jpg'  }
            ];
            sessionStorage.setItem('productos', JSON.stringify(carta));
            return carta;
        } else {
            return JSON.parse(sessionStorage.getItem('productos'));
        }
    }


    agregarProducto(idProducto) {
        this.pedido.push(parseInt(idProducto));
    }

    vaciarPedido() {
        this.pedido = [];
    }

    eliminarProducto(idProducto) {
        this.pedido = this.pedido.filter(id => id != parseInt(idProducto));
    }


    calcularTotal() {
        let total = 0;

        this.pedido.forEach(idPedido => {
            const producto = this.productos.find(p => p.id === idPedido);
            if (producto) {
                total += producto.precio;
            }
        });

        return total;
    }

    obtenerPedidoContado() {
        const pedidoDetallado = [];

        this.pedido.forEach(idPedido => {
            const productoContado = pedidoDetallado.find(item => item.id === idPedido);

            if (productoContado) {
                productoContado.cantidad++;
            } else {
                const productoBase = this.productos.find(p => p.id === idPedido);
                if (productoBase) {
                    pedidoDetallado.push({
                        id: productoBase.id,
                        nombre: productoBase.nombre,
                        precio: productoBase.precio,
                        cantidad: 1
                    });
                }
            }
        });

        return pedidoDetallado;
    }
}