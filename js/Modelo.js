class Modelo {
    constructor() {
        this.productos = [];
        this.carrito = [];
        this.usuarioLogeado = this.obtenerEstadoSesion();
    }

    obtenerEstadoSesion() {
        return sessionStorage.getItem('usuarioLogeado') || null;
    }

    intentarLogin(usuario, clave) {
        if (USUARIOS_DUMMY[usuario] === clave) {
            this.usuarioLogeado = usuario;
            sessionStorage.setItem('usuarioLogeado', usuario);
            return true;
        }
        return false;
    }

    cerrarSesion() {
        this.usuarioLogeado = null;
        sessionStorage.removeItem('usuarioLogeado');
    }

    async cargarProductos() {
        const URL_API = 'https://dummyjson.com/products';

        const respuesta = await fetch(URL_API);
        const datos = await respuesta.json();
        this.productos = datos.products;
        return this.productos;

    }


    crearProducto(nuevoProducto) {
        const ultimoId = this.productos.reduce((max, p) => p.id > max ? p.id : max, 0);
        nuevoProducto.id = ultimoId + 1;
        this.productos.unshift(nuevoProducto);
    }

    actualizarProducto(productoActualizado) {
        const index = this.productos.findIndex(p => p.id === productoActualizado.id);
        if (index !== -1) {
            const productoOriginal = this.productos[index];

            this.productos[index] = {
                ...productoOriginal,
                ...productoActualizado
            };
        }
    }

    eliminarProductoAdmin(idProducto) {
        this.productos = this.productos.filter(p => p.id !== parseInt(idProducto));
    }

    obtenerProductoPorId(idProducto) {
        return this.productos.find(p => p.id === parseInt(idProducto));
    }


    agregarProducto(idProducto) {
        this.carrito.push(idProducto);
    }
    vaciarCarrito() {
        this.carrito = [];
    }
    eliminarProducto(idProducto) {
        const index = this.carrito.findIndex(id => id === idProducto);
        if (index !== -1) {
            this.carrito.splice(index, 1);
        }
    }
    eliminarTodasUnidades(idProducto) {
        this.carrito = this.carrito.filter(id => id !== idProducto);
    }
    calcularTotal() {
        let total = 0;
        this.carrito.forEach(idCarrito => {
            const producto = this.productos.find(p => p.id === idCarrito);
            if (producto) {
                total += producto.price;
            }
        });
        return total.toFixed(2);
    }
    obtenerCarritoContado() {
        const carritoDetallado = [];
        this.carrito.forEach(idCarrito => {
            const productoContado = carritoDetallado.find(item => item.id === idCarrito);
            if (productoContado) {
                productoContado.cantidad++;
            } else {
                const productoBase = this.productos.find(p => p.id === idCarrito);
                if (productoBase) {
                    carritoDetallado.push({
                        id: productoBase.id,
                        nombre: productoBase.title,
                        precio: productoBase.price,
                        cantidad: 1,
                        imagenUrl: productoBase.thumbnail
                    });
                }
            }
        });
        return carritoDetallado;
    }
}