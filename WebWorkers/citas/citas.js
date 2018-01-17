var citas = ["De cada 10 programas de TV, cinco, son la mitad. (Perogrullo)",
              "Quien sacrifica libertad por seguridad, no merece ni una ni otra. (B. Franklin)",
              "Cuando las leyes matemáticas se refieren a la realidad no son ciertas, " +  
              "y cuando son ciertas, no se refieren a la realidad (A. Einstein)",
              "Defiende tu derecho a pensar, porque incluso pensar de manera errónea " + 
                                                    "es mejor que no pensar.- Hipatia",
               "Las matemáticas no mienten, lo que hay son muchos matemáticos mentirosos. " +
               "- H.D. Thoreau",
              "No hay enigmas. Si un problema puede plantearse, también puede resolverse." + 
              "- LUDWIG WITTGENSTEIN",
              "Todo saber tiene de ciencia lo que tiene de matemática.- POINCARÉ",
              "No hay rama de la matemática, por abstracta que sea, que no pueda aplicarse " + 
              "algún día a los fenómenos del mundo real. - NIKOLAY LOBACHEVSKY"];

function EscribirCita() {
    // Seleccionamos una cita al azar
    var indice = Math.floor(Math.random() * citas.length);
    // Utilizamos un objeto JavaScript para obtener la hora del sistema.
    var d = new Date().toDateString();
    postMessage(d + ": " + citas[indice]);
}

EscribirCita();
setInterval(EscribirCita, 3000);