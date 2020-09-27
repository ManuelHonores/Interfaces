let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let opcion; //Pincel o goma de borrar

let ejecutarAccion = false; //Flag para saber si esta dibujando o no

let x; //Coordenada X
let y; //Coordenada Y

let tamanioHerramienta = 1;

//Tomo el valor de la paleta de colores

let color = document.querySelector("#color");
let colorElegido;

color.addEventListener("change", function () {
    colorElegido = color.value;
});

/**
 * Seleccion de herramienta (lapiz o goma)
 */
let pincel = document.getElementById("pincel");
pincel.addEventListener("click", function () {
    opcion = pincel.value;
});

let goma = document.getElementById("goma");
goma.addEventListener("click", function () {
    opcion = goma.value;
});

// Tamaño de herramienta

document.querySelector("#tamanio").addEventListener("change", function () {
    tamanioHerramienta = tamanio.options[tamanio.selectedIndex].value;
})

/* Funciones para utilizar la herramienta */

//Dejo seteado a que funcion va a llamar cada evento de mouse

document.addEventListener("mousedown", comenzarDibujo);
document.addEventListener("mousemove", dibujando);
document.addEventListener("mouseup", pararDibujo);

function comenzarDibujo(e) {
    if (opcion == "pincel" || opcion == "goma") {
        ejecutarAccion = true;
        obtenerCoordenadas(e); //Obetengo las coordenadas iniciales (cuando hago click)
    }
}

function dibujando(e) {
    if (ejecutarAccion) {
        ctx.beginPath();
        ctx.lineWidth = tamanioHerramienta; //Debe llegar tamaño de pincel
        ctx.lineCap = 'round'; //Con esto hago que dibuje de forma redondeada

        if (opcion == "goma") {
            ctx.strokeStyle = "white";
        } else {
            ctx.strokeStyle = colorElegido; //Se puede implementar una paleta de colores y mandar la opcion aca
        }

        ctx.moveTo(x, y); //Coordenadas iniciales
        obtenerCoordenadas(e); //Cargo nuevas coordenadas de donde me estoy moviendo
        ctx.lineTo(x, y); //Nuevas coordenadas a donde tiene que dibujar
        ctx.stroke();
    }
}

function pararDibujo() {
    ejecutarAccion = false;
}

function obtenerCoordenadas(e) {
    x = e.clientX - canvas.offsetLeft; //Ubico las coordenadas x e y dentro del canvas
    y = e.clientY - canvas.offsetTop;
}