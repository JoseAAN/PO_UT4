class Vista {
    constructor() {
        this.vistaProductos = document.querySelector('#items');
        this.vistaCarrito = document.querySelector('#carrito');
        this.vistaPrecioTotal = document.querySelector('#total');
        this.vistaVaciar = document.querySelector('#boton-vaciar');
        
        this.contenidoPrincipal = document.querySelector('.container'); 
        this.navPanel = document.querySelector('#nav-panel');
        this.navProductos = document.querySelector('#nav-productos');
        this.catalogoContenedor = document.querySelector('.row'); 
        this.controlador = null; 
    }
    
    asociarNav(controladorNav) {
        this.navPanel.addEventListener('click', controladorNav);
        this.navProductos.addEventListener('click', controladorNav);
    }

    mostrarLogin(manejadorLogin) {
        this.ocultarLogin(); 

        //formulario de Login
        const loginView = document.createElement('div');
        loginView.id = 'login-view';
        loginView.style.cssText = 'max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background: #fff;';
        
        const titleH2 = document.createElement('h2');
        titleH2.textContent = 'Acceso de Administración';
        loginView.appendChild(titleH2);
        
        const form = document.createElement('form');
        form.id = 'login-form';
        form.style.cssText = 'display: flex; flex-direction: column;';
        
        const inputUser = document.createElement('input');
        inputUser.type = 'text'; inputUser.id = 'admin-user-input'; inputUser.placeholder = 'Usuario'; 
        inputUser.value = 'admin'; inputUser.required = true; 
        inputUser.classList.add('form-control');
        inputUser.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px;';
        form.appendChild(inputUser);

        const inputPass = document.createElement('input');
        inputPass.type = 'password'; inputPass.id = 'admin-pass-input'; inputPass.placeholder = 'Contraseña'; 
        inputPass.value = '1234'; inputPass.required = true; 
        inputPass.classList.add('form-control');
        inputPass.style.cssText = 'width: 100%; padding: 8px; margin-bottom: 10px;';
        form.appendChild(inputPass);
        
        const btnSubmit = document.createElement('button');
        btnSubmit.type = 'submit'; btnSubmit.classList.add('btn', 'btn-primary');
        btnSubmit.textContent = 'Iniciar Sesión'; btnSubmit.style.width = '100%';
        form.appendChild(btnSubmit);
        
        const errorMsg = document.createElement('p');
        errorMsg.id = 'login-error';
        errorMsg.style.cssText = 'color:red; text-align:center; margin-top: 10px;';
        form.appendChild(errorMsg);

        loginView.appendChild(form);
        this.contenidoPrincipal.insertAdjacentElement('afterbegin', loginView);
        
        form.addEventListener('submit', manejadorLogin);
    }
    
    ocultarLogin() {
        const loginView = document.getElementById('login-view');
        if(loginView) loginView.remove(); 
    }
    
    ocultarCatalogo() {
        this.catalogoContenedor.style.display = 'none';
    }

    mostrarCatalogo(productos, controladorAgregar) {
        this.ocultarLogin();
        this.catalogoContenedor.style.display = 'flex'; 
        this.dibujarProductos(productos, controladorAgregar);
    }

    //Catálogo

    dibujarProductos(productos, controladorAgregar) {
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

    //Carrito

    dibujarCarrito(carritoDetallado, controladorEliminar, controladorIncrementar, controladorEliminarTodas) {
        this.vistaCarrito.textContent = ''; 
        
        carritoDetallado.forEach(item => {
            const articulo = document.createElement('li');
            articulo.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

            const imagenMiniatura = document.createElement('img');
            imagenMiniatura.src = item.imagenUrl || 'placeholder.jpg';
            imagenMiniatura.style.cssText = 'width: 30px; height: 30px; object-fit: cover; margin-right: 10px; border-radius: 5px;';
            articulo.appendChild(imagenMiniatura);
            
            const precioCarrito = (item.precio * item.cantidad).toFixed(2);
            const infoSpan = document.createElement('span');
            infoSpan.textContent = `${item.cantidad} x ${item.nombre} - ${precioCarrito}€`;
            infoSpan.style.flexGrow = '1'; 
            articulo.appendChild(infoSpan);
            
            const botonesDiv = document.createElement('div');
            botonesDiv.style.cssText = 'display: flex; gap: 5px;'; 

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

            this.vistaCarrito.appendChild(articulo);
        });
    }

    actualizarTotal(total) {
        this.vistaPrecioTotal.textContent = total + '€';
    }

    asociarControladorVaciar(controladorVaciar) {
        this.vistaVaciar.addEventListener('click', controladorVaciar);
    }
    
    //CRUD

    dibujarAdminCRUD(productos, manejadorGuardar, manejadorTablaAccion) {
        const crudContent = document.getElementById('crud-content');

        crudContent.innerHTML = ''; 
        const titleH3 = document.createElement('h3');
        titleH3.textContent = 'Crear/Editar Producto';
        crudContent.appendChild(titleH3);

        const form = document.createElement('form');
        form.id = 'crud-form';
        form.style.cssText = 'margin-bottom: 30px; border: 1px solid #ccc; padding: 15px;';
        
        const inputId = document.createElement('input');
        inputId.type = 'hidden'; inputId.id = 'producto-id'; inputId.value = '';
        form.appendChild(inputId);

        form.appendChild(this._createLabelAndInput('Título:', 'producto-title', 'text', true));
        form.appendChild(this._createLabelAndInput('Precio:', 'producto-price', 'number', true, '0.01'));
        form.appendChild(this._createLabelAndInput('Stock:', 'producto-stock', 'number', true));

        const btnGuardar = document.createElement('button');
        btnGuardar.type = 'submit'; btnGuardar.classList.add('btn', 'btn-primary');
        btnGuardar.id = 'btn-guardar'; btnGuardar.textContent = 'Crear';
        form.appendChild(btnGuardar);

        const btnCancelar = document.createElement('button');
        btnCancelar.type = 'reset'; btnCancelar.classList.add('btn', 'btn-warning');
        btnCancelar.id = 'btn-cancelar'; btnCancelar.textContent = 'Cancelar';
        form.appendChild(btnCancelar);

        crudContent.appendChild(form);
        
        const listTitleH4 = document.createElement('h4');
        listTitleH4.textContent = 'Listado de Productos';
        crudContent.appendChild(listTitleH4);
        
        const tabla = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Cabecera tabla
        const trHeader = document.createElement('tr');
        ['ID', 'Título', 'Precio', 'Stock', 'Acciones'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trHeader.appendChild(th);
        });
        thead.appendChild(trHeader);
        tabla.appendChild(thead);

        // Filas tabla
        productos.forEach(p => {
            tbody.appendChild(this._dibujarFilaTabla(p));
        });
        tabla.appendChild(tbody);
        
        crudContent.appendChild(tabla);
        
        // 5. Asociar Handlers
        form.addEventListener('submit', manejadorGuardar);
        btnCancelar.addEventListener('click', () => this.limpiarFormularioAdmin());

        tabla.addEventListener('click', manejadorTablaAccion);
    }

    /**
     * Auxiliar para dibujar cada fila de la tabla CRUD.
     */
    _dibujarFilaTabla(producto) {
        const tr = document.createElement('tr');

        // Función auxiliar para crear y añadir una celda <td>
        const crearCelda = (textContent, isDataCell = true) => {
            const td = document.createElement(isDataCell ? 'td' : 'th');
            td.textContent = textContent;
            tr.appendChild(td);
        };

        crearCelda(producto.id);
        crearCelda(producto.title || 'N/A');
        crearCelda(producto.price ? producto.price.toFixed(2) + '€' : 'N/A');
        crearCelda(producto.stock !== undefined ? producto.stock : 'N/A');

        // Celda de Acciones (Botones)
        const tdAcciones = document.createElement('td');
        tdAcciones.setAttribute('data-id', producto.id);
        
        // Botón Editar
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-warning', 'btn-sm');
        btnEditar.textContent = 'Editar';
        btnEditar.setAttribute('data-id', producto.id);
        tdAcciones.appendChild(btnEditar);
        
        // Botón Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.setAttribute('data-id', producto.id);
        tdAcciones.appendChild(btnEliminar);
        
        tr.appendChild(tdAcciones);

        return tr;
    }
    
    // --- Método auxiliar para construir Label e Input (Permanece igual) ---
    _createLabelAndInput(labelText, inputId, inputType, required, step) {
        const container = document.createElement('div');
        
        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = labelText;
        container.appendChild(label);
        
        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.required = required;
        input.style.cssText = 'width: 100%; margin-bottom: 10px; padding: 5px;';
        if (step) input.step = step;
        container.appendChild(input);
        
        container.appendChild(document.createElement('br'));
        return container;
    }

    // --- Métodos de Formulario CRUD (Limpiar/Cargar) ---

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