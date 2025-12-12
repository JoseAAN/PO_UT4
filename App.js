document.addEventListener('DOMContentLoaded', async () => {

    const modelo = new Modelo();
    const vista = new Vista();

        await modelo.cargarProductos(); 
        
        const controlador = new Controlador(modelo, vista);
        controlador.verificarSesion(); 

});