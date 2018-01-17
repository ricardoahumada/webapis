// Asignamos la función a ejecutar
onmessage = mensajeVuelta;

function mensajeVuelta(event) {
	console.log('mensajeVuelta',event);
    // El objeto event transporta la información 
    // en su propiedad data
    if (event.data == "Datos") {
    	setTimeout(function() {
        	postMessage("Datos de vuelta");
    	}, 5000);
    }
    else {
        // Error intencionado
        1/x;
    }
}