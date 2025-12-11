// js/vista.js

class Vista {
    constructor() {
        // Elementos del DOM (Selección robusta para index.html y admin.html)
        this.vistaProductos = document.querySelector('#items');
        this.vistaPedido = document.querySelector('#pedido');
        this.vistaPrecioTotal = document.querySelector('#total');
        this.vistaVaciar = document.querySelector('#boton-vaciar');
        
        // Elementos para el ruteo
        this.mainContent = document.querySelector('.container'); 
        this.navPanel = document.querySelector('#nav-panel');
        this.navProductos = document.querySelector('#nav-productos');
        this.catalogoContainer = document.querySelector('.row'); // Contenedor del menú/carrito
        
        this.controlador = null; 
    }

    // --- Métodos de Ruteo y Layout (Para index.html) ---
    
    asociarNavHandlers(controladorNav) {
        if (this.navPanel) this.navPanel.addEventListener('click', controladorNav);
        if (this.navProductos) this.navProductos.addEventListener('click', controladorNav);
    }

    mostrarLogin(manejadorLogin) {
        if (!this.mainContent) return; 
        
        // 💥 CORRECCIÓN CRÍTICA: Eliminar cualquier vista de login previa para evitar duplicados.
        this.ocultarLogin(); 

        // Inyectamos el formulario de login
        this.mainContent.insertAdjacentHTML('afterbegin', `
            <div id="login-view" style="max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background: #fff;">
                <h2>Acceso de Administración</h2>
                <form id="login-form" style="display: flex; flex-direction: column;">
                    <input type="text" id="admin-user-input" placeholder="Usuario" value="admin" required class="form-control" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <input type="password" id="admin-pass-input" placeholder="Contraseña" value="1234" required class="form-control" style="width: 100%; padding: 8px; margin-bottom: 10px;">
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Iniciar Sesión</button>
                    <p id="login-error" style="color:red; text-align:center; margin-top: 10px;"></p>
                </form>
            </div>
        `);
        
        document.getElementById('login-form').addEventListener('submit', manejadorLogin);
    }
    
    ocultarLogin() {
        const loginView = document.getElementById('login-view');
        if(loginView) loginView.remove();
    }
    
    ocultarCatalogo() {
        if(this.catalogoContainer) this.catalogoContainer.style.display = 'none';
    }

    mostrarCatalogo(productos, controladorAgregar) {
        // Ocultamos la vista de login si existía
        this.ocultarLogin();
        
        // Mostramos las secciones de productos/carrito
        if (this.catalogoContainer) this.catalogoContainer.style.display = 'flex'; 

        // Repinta los productos en el catálogo
        this.dibujarProductos(productos, controladorAgregar);
    }

    // --- Métodos de Dibujo del Catálogo ---

    dibujarProductos(productos, controladorAgregar) {
        if (!this.vistaProductos || !productos) return;
        
        this.vistaProductos.innerHTML = ''; 

        productos.forEach(info => {
            const articulo = document.createElement('div');
            articulo.classList.add('card', 'col-sm-3', 'mb-3', 'text-center', 'p-2');

            const imagenArticulo = document.createElement('img');
            imagenArticulo.src = info.thumbnail || info.images[0] || 'placeholder.jpg';
            imagenArticulo.classList.add('card-img-top', 'mb-2');

            const nombreArticulo = document.createElement('h5');
            nombreArticulo.classList.add('card-title');
            nombreArticulo.textContent = info.title || 'Producto sin título';

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

    // --- Métodos de Dibujo del Carrito ---

    dibujarPedido(pedidoDetallado, controladorEliminar, controladorIncrementar, controladorEliminarTodas) {
        if (!this.vistaPedido) return;
        this.vistaPedido.textContent = ''; 
        
        pedidoDetallado.forEach(item => {
            const articulo = document.createElement('li');
            articulo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            const imagenMiniatura = document.createElement('img');
            imagenMiniatura.src = item.imagenUrl || 'placeholder.jpg';
            imagenMiniatura.style.width = '30px'; 
            imagenMiniatura.style.height = '30px';
            imagenMiniatura.style.objectFit = 'cover';
            imagenMiniatura.style.marginRight = '10px';
            imagenMiniatura.style.borderRadius = '5px';
            articulo.appendChild(imagenMiniatura);
            
            const precioPedido = (item.precio * item.cantidad).toFixed(2);
            const infoSpan = document.createElement('span');
            infoSpan.textContent = `${item.cantidad} x ${item.nombre} - ${precioPedido}€`;
            infoSpan.style.flexGrow = '1'; 
            articulo.appendChild(infoSpan);
            
            const botonesDiv = document.createElement('div');
            botonesDiv.style.display = 'flex';
            botonesDiv.style.gap = '5px'; 

            const botonIncrementar = document.createElement('button');
            botonIncrementar.classList.add('btn', 'btn-success', 'btn-sm');
            botonIncrementar.textContent = '+';
            botonIncrementar.setAttribute('data-id', item.id);
            botonIncrementar.addEventListener('click', controladorIncrementar); 

            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('btn', 'btn-warning', 'btn-sm'); 
            botonEliminar.textContent = '-';
            botonEliminar.setAttribute('data-id', item.id);
            botonEliminar.addEventListener('click', controladorEliminar);
            
            const botonEliminarTodas = document.createElement('button');
            botonEliminarTodas.classList.add('btn', 'btn-danger', 'btn-sm'); 
            botonEliminarTodas.textContent = 'X';
            botonEliminarTodas.setAttribute('data-id', item.id);
            botonEliminarTodas.addEventListener('click', controladorEliminarTodas);


            botonesDiv.appendChild(botonIncrementar);
            botonesDiv.appendChild(botonEliminar);
            botonesDiv.appendChild(botonEliminarTodas);

            articulo.appendChild(botonesDiv);

            this.vistaPedido.appendChild(articulo);
        });
    }

    actualizarTotal(total) {
        if (!this.vistaPrecioTotal) return;
        this.vistaPrecioTotal.textContent = total + '€';
    }

    asociarControladorVaciar(controladorVaciar) {
        if (this.vistaVaciar) this.vistaVaciar.addEventListener('click', controladorVaciar);
    }
    
    // --- Métodos de CRUD Admin (Para admin.html) ---

    dibujarAdminCRUD(productos, manejadorGuardar, manejadorTablaAccion) {
        const crudContent = document.getElementById('crud-content');
        if (!crudContent || !productos) return; 

        // 1. Dibuja el formulario de Agregar/Editar
        crudContent.innerHTML = `
            <h3>Crear/Editar Producto</h3>
            <form id="crud-form" style="margin-bottom: 30px; border: 1px solid #ccc; padding: 15px;">
                <input type="hidden" id="producto-id" value="">
                
                <label for="producto-title">Título:</label>
                <input type="text" id="producto-title" required style="width: 100%; margin-bottom: 10px; padding: 5px;"><br>
                
                <label for="producto-price">Precio:</label>
                <input type="number" id="producto-price" required step="0.01" style="width: 100%; margin-bottom: 10px; padding: 5px;"><br>
                
                <label for="producto-stock">Stock:</label>
                <input type="number" id="producto-stock" required style="width: 100%; margin-bottom: 10px; padding: 5px;"><br>
                
                <button type="submit" class="btn btn-primary" id="btn-guardar">Crear</button>
                <button type="reset" class="btn btn-warning" id="btn-cancelar">Cancelar</button>
            </form>
            <h4>Listado de Productos</h4>
        `;
        
        // 2. Asociar handler al formulario
        document.getElementById('crud-form').addEventListener('submit', manejadorGuardar);
        document.getElementById('btn-cancelar').addEventListener('click', () => this.limpiarFormularioAdmin());

        // 3. Dibuja la tabla
        let tablaHTML = '<table><thead><tr><th>ID</th><th>Título</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>';
        
        productos.forEach(p => {
            tablaHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.title || 'N/A'}</td>
                    <td>${p.price ? p.price.toFixed(2) + '€' : 'N/A'}</td>
                    <td>${p.stock !== undefined ? p.stock : 'N/A'}</td>
                    <td data-id="${p.id}">
                        <button class="btn btn-warning btn-sm" data-id="${p.id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-id="${p.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });
        
        tablaHTML += '</tbody></table>';
        crudContent.insertAdjacentHTML('beforeend', tablaHTML);
        
        // 4. Asociar handler a la tabla para Editar/Eliminar
        const tabla = crudContent.querySelector('table');
        if (tabla) {
             tabla.addEventListener('click', manejadorTablaAccion);
        }
    }
    
    limpiarFormularioAdmin() {
        document.getElementById('crud-form').reset();
        document.getElementById('btn-guardar').textContent = 'Crear';
        document.getElementById('producto-id').value = '';
    }

    cargarFormularioAdmin(producto) {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('producto-title').value = producto.title;
        document.getElementById('producto-price').value = producto.price;
        document.getElementById('producto-stock').value = producto.stock !== undefined ? producto.stock : 0;
        document.getElementById('btn-guardar').textContent = 'Actualizar';
    }
}