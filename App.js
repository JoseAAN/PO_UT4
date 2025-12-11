// js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Instanciamos el Modelo y la Vista
    const modelo = new Modelo();
    const vista = new Vista();

    // 2. Esperamos a que el Modelo cargue los productos de la API.
    // ESTE PASO AHORA ES ASÍNCRONO Y NECESITA ESPERAR.
    await modelo.cargarProductos(); 

    // 3. Instanciamos y arrancamos el Controlador.
    // Se garantiza que modelo.productos ya está lleno.
    const controlador = new Controlador(modelo, vista);
    
    // Inicia el ruteo de la aplicación (Login o CRUD)
    controlador.verificarSesion(); 
});