window.onload = function () {
    if (Worker == "undefined") {
        document.getElementById("MensajeDelWorker").innerHTML = "Web Workers no disponibles";
    }
    else {
        var worker = new Worker("tarea.js");
        // Esto establece el parámetro que se pasa al worker
        worker.postMessage("Datos");
        // Cuando el proceso termina se pasa por este método
        worker.onmessage = function (event) {
            var message = "Mensaje del Worker: " + event.data;
            // Actualiza la interfaz de usuario
            document.getElementById("MensajeDelWorker").innerHTML = message;
            
        }
        worker.onerror = function (error) {
            document.getElementById("MensajeDelWorker").innerHTML =
				"Hubo un error en el fichero " + error.filename +
				" Línea nº " + error.lineno +
				": " + error.message;
        };
    }
}
