// js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Instanciamos el Modelo y la Vista
    const modelo = new Modelo();
    const vista = new Vista();

    try {
        // 2. Esperamos la carga de productos de la API.
        await modelo.cargarProductos(); 
        
        // 3. Instanciamos y arrancamos el Controlador SOLO si la carga fue exitosa.
        const controlador = new Controlador(modelo, vista);
        controlador.verificarSesion(); 

    } catch (error) {
        console.error("Error FATAL al inicializar la aplicación. La carga de productos falló:", error);
        // Podrías mostrar un mensaje de error en la UI aquí si lo deseas
    }
});