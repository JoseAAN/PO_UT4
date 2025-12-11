// js/modelo.js

// Importamos el usuario dummy y los datos de respaldo
// Asumimos que datosdummy.js se carga ANTES en el HTML.

class Modelo {
    constructor() {
        this.productos = []; 
        this.pedido = []; 
        this.usuarioLogeado = this._obtenerEstadoSesion();
    }

    _obtenerEstadoSesion() {
        return sessionStorage.getItem('usuarioLogeado') || null;
    }

    // --- Lógica de Autenticación (Login) ---

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

    // --- Carga Asíncrona de Productos ---

    async cargarProductos() {
        try {
            console.log("DEBUG: Iniciando carga de productos desde dummyjson.com...");
            const URL_API = 'https://dummyjson.com/products';

            const respuesta = await fetch(URL_API);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            this.productos = datos.products;
            
            console.log(`DEBUG: Productos cargados con éxito. Total: ${this.productos.length}`);
            
            return this.productos; 
            
        } catch (error) {
            console.error("ERROR CRÍTICO: Falló la obtención de datos de la API. Usando datos de respaldo.", error);
            // Usamos datos de respaldo si la solicitud falla
            this.productos = PRODUCTOS_DUMMY_RESPALDO;
            return this.productos;
        }
    }

    // ... (El resto de los métodos del carrito permanecen iguales) ...
    agregarProducto(idProducto) {
        this.pedido.push(idProducto);
    }
    vaciarPedido() {
        this.pedido = [];
    }
    eliminarProducto(idProducto) {
        const index = this.pedido.findIndex(id => id === idProducto);
        if (index !== -1) {
            this.pedido.splice(index, 1);
        }
    }
    eliminarTodasUnidades(idProducto) {
        this.pedido = this.pedido.filter(id => id !== idProducto);
    }
    calcularTotal() {
        let total = 0;
        this.pedido.forEach(idPedido => {
            const producto = this.productos.find(p => p.id === idPedido);
            if (producto) {
                total += producto.price;
            }
        });
        return total.toFixed(2); 
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
                        nombre: productoBase.title, 
                        precio: productoBase.price, 
                        cantidad: 1,
                        imagenUrl: productoBase.thumbnail 
                    });
                }
            }
        });
        return pedidoDetallado;
    }
}