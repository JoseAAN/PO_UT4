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

        const vistaLogin = document.createElement('div');
        vistaLogin.id = 'login-view';
        vistaLogin.classList.add('login-panel'); 
        
        const cabeceraAdmin = document.createElement('h2');
        cabeceraAdmin.textContent = 'Acceso de Administración';
        vistaLogin.appendChild(cabeceraAdmin);
        
        const form = document.createElement('form');
        form.id = 'login-form';
        form.classList.add('login-form-content'); 
        
        const inputUser = document.createElement('input');
        inputUser.type = 'text'; inputUser.id = 'admin-user-input'; inputUser.placeholder = 'Usuario'; 
        inputUser.value = 'admin'; inputUser.required = true; 
        inputUser.classList.add('form-control', 'login-input'); 
        form.appendChild(inputUser);

        const inputPass = document.createElement('input');
        inputPass.type = 'password'; inputPass.id = 'admin-pass-input'; inputPass.placeholder = 'Contraseña'; 
        inputPass.value = '1234'; inputPass.required = true; 
        inputPass.classList.add('form-control', 'login-input');
        form.appendChild(inputPass);
        
        const btnSubmit = document.createElement('button');
        btnSubmit.type = 'submit'; btnSubmit.classList.add('btn', 'btn-primary');
        btnSubmit.textContent = 'Iniciar Sesión';
        btnSubmit.style.width = '100%'; 
        form.appendChild(btnSubmit);
        
        const errorMsg = document.createElement('p');
        errorMsg.id = 'login-error';
        errorMsg.classList.add('login-error-msg'); 
        form.appendChild(errorMsg);

        vistaLogin.appendChild(form);
        this.contenidoPrincipal.insertAdjacentElement('afterbegin', vistaLogin);
        
        form.addEventListener('submit', manejadorLogin);
    }
    
    ocultarLogin() {
        const vistaLogin = document.getElementById('login-view');
        if(vistaLogin) vistaLogin.remove(); 
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
            imagenMiniatura.classList.add('carrito-miniatura'); 
            articulo.appendChild(imagenMiniatura);
            
            const precioCarrito = (item.precio * item.cantidad).toFixed(2);
            const infoSpan = document.createElement('span');
            infoSpan.textContent = `${item.cantidad} x ${item.nombre} - ${precioCarrito}€`;
            infoSpan.style.flexGrow = '1'; 
            articulo.appendChild(infoSpan);
            
            const botonesDiv = document.createElement('div');
            botonesDiv.classList.add('carrito-botones-grupo'); 

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
        const contenidoCRUD = document.getElementById('crud-content');

        contenidoCRUD.innerHTML = ''; 

        const titleH3 = document.createElement('h3');
        titleH3.textContent = 'Crear/Editar Producto';
        contenidoCRUD.appendChild(titleH3);

        const form = document.createElement('form');
        form.id = 'crud-form';
        form.classList.add('crud-form-panel'); 
        
        const inputId = document.createElement('input');
        inputId.type = 'hidden'; inputId.id = 'producto-id'; inputId.value = '';
        form.appendChild(inputId);

        // Inputs
        form.appendChild(this.createLabelAndInput('Título:', 'producto-title', 'text', true, null, 'crud-input'));
        form.appendChild(this.createLabelAndInput('Precio:', 'producto-price', 'number', true, '0.01', 'crud-input'));
        form.appendChild(this.createLabelAndInput('Stock:', 'producto-stock', 'number', true, null, 'crud-input'));

        const btnGuardar = document.createElement('button');
        btnGuardar.type = 'submit'; btnGuardar.classList.add('btn', 'btn-primary');
        btnGuardar.id = 'btn-guardar'; btnGuardar.textContent = 'Crear';
        form.appendChild(btnGuardar);

        const btnCancelar = document.createElement('button');
        btnCancelar.type = 'reset'; btnCancelar.classList.add('btn', 'btn-warning');
        btnCancelar.id = 'btn-cancelar'; btnCancelar.textContent = 'Cancelar';
        form.appendChild(btnCancelar);

        contenidoCRUD.appendChild(form);
        
        const tituloListado = document.createElement('h4');
        tituloListado.textContent = 'Listado de Productos';
        contenidoCRUD.appendChild(tituloListado);
        
        const tabla = document.createElement('table');
        tabla.classList.add('crud-table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        const trCabecera = document.createElement('tr');
        ['ID', 'Título', 'Precio', 'Stock', 'Acciones'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            trCabecera.appendChild(th);
        });
        thead.appendChild(trCabecera);
        tabla.appendChild(thead);

        productos.forEach(p => {
            tbody.appendChild(this.dibujarFilaTabla(p));
        });
        tabla.appendChild(tbody);
        
        contenidoCRUD.appendChild(tabla);
        form.addEventListener('submit', manejadorGuardar);
        btnCancelar.addEventListener('click', () => this.limpiarFormularioAdmin());
        tabla.addEventListener('click', manejadorTablaAccion);
    }

    dibujarFilaTabla(producto) {
        const tr = document.createElement('tr');

        const crearCelda = (textContent, isDataCell = true) => {
            const td = document.createElement(isDataCell ? 'td' : 'th');
            td.textContent = textContent;
            tr.appendChild(td);
        };

        crearCelda(producto.id);
        crearCelda(producto.title || 'N/A');
        crearCelda(producto.price ? producto.price.toFixed(2) + '€' : 'N/A');
        crearCelda(producto.stock !== undefined ? producto.stock : 'N/A');

        const tdAcciones = document.createElement('td');
        tdAcciones.setAttribute('data-id', producto.id);
        
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('btn', 'btn-warning', 'btn-sm');
        btnEditar.textContent = 'Editar';
        btnEditar.setAttribute('data-id', producto.id);
        tdAcciones.appendChild(btnEditar);
        
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.setAttribute('data-id', producto.id);
        tdAcciones.appendChild(btnEliminar);
        
        tr.appendChild(tdAcciones);

        return tr;
    }
    

    createLabelAndInput(labelText, inputId, inputType, required, step, inputClass) {
        const container = document.createElement('div');
        
        const label = document.createElement('label');
        label.htmlFor = inputId;
        label.textContent = labelText;
        container.appendChild(label);
        
        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.required = required;
        if (inputClass) input.classList.add(inputClass);
        if (step) input.step = step;
        container.appendChild(input);
        
        container.appendChild(document.createElement('br'));
        return container;
    }

    //Formulario CRUD

    limpiarFormularioAdmin() {
        document.getElementById('crud-form').reset();
        document.getElementById('btn-guardar').textContent = 'Crear';
        document.getElementById('producto-id').value = '';
    }

    cargarFormulario(producto) {
        document.getElementById('producto-id').value = producto.id;
        document.getElementById('producto-title').value = producto.title;
        document.getElementById('producto-price').value = producto.price;
        document.getElementById('producto-stock').value = producto.stock !== undefined ? producto.stock : 0;
        document.getElementById('btn-guardar').textContent = 'Actualizar';
    }
}