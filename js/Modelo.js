// js/modelo.js

// Importamos el usuario dummy y los datos de respaldo
// Asumimos que datosdummy.js se carga ANTES en el HTML.

class Modelo {
    constructor() {
        // Estado del Catálogo y Pedido
        this.productos = []; 
        this.pedido = []; // ARRAY que almacena los IDs de los productos en el carrito.
        
        // Estado de Sesión
        this.usuarioLogeado = this._obtenerEstadoSesion();
    }

    _obtenerEstadoSesion() {
        return sessionStorage.getItem('usuarioLogeado') || null;
    }

    // --- Lógica de Autenticación (Login) ---

    intentarLogin(usuario, clave) {
        // Usamos la constante global de usuarios definida en datosDummy.js
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
            console.log("Cargando productos desde dummyjson.com...");
            const URL_API = 'https://dummyjson.com/products';

            const respuesta = await fetch(URL_API);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const datos = await respuesta.json();

            this.productos = datos.products;
            
            console.log(`Productos cargados: ${this.productos.length}`);
            
            return this.productos; 
            
        } catch (error) {
            console.error("Error al obtener los productos de la API. Usando datos de respaldo.", error);
            this.productos = PRODUCTOS_DUMMY_RESPALDO;
            return this.productos;
        }
    }

    // =======================================================
    // --- Lógica de Carrito (CRUD del Pedido) ---
    // =======================================================

    agregarProducto(idProducto) {
        // Incrementa la cantidad (usado por el botón 'Añadir' y el botón '+')
        this.pedido.push(idProducto);
        console.log(`Producto ID ${idProducto} añadido al carrito.`);
    }

    vaciarPedido() {
        this.pedido = [];
    }

    // Método para ELIMINAR UNA UNIDAD (usado por el botón '-')
    eliminarProducto(idProducto) {
        // Usamos findIndex para encontrar el primer índice del producto con ese ID
        const index = this.pedido.findIndex(id => id === idProducto);
        
        if (index !== -1) {
            // Elimina SÓLO una unidad de ese producto
            this.pedido.splice(index, 1);
        }
    }
    
    // NUEVO MÉTODO: Quita todas las unidades de un producto (usado por el botón 'X')
    eliminarTodasUnidades(idProducto) {
        // Filtra el array 'pedido', manteniendo solo los IDs que NO coincidan con idProducto
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
                        imagenUrl: productoBase.thumbnail // <-- INCLUIDA LA IMAGEN PARA LA VISTA
                    });
                }
            }
        });

        return pedidoDetallado;
    }
}