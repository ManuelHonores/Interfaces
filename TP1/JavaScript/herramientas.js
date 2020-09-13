let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let imageData = ctx.createImageData(canvas.width, canvas.height);
let alto = canvas.height;
let ancho = canvas.width;

let canvasData = imageData;

let selectImage = document.querySelector("#openImage");

let herramienta = "pincel";
let tamPincel = 1;
let pintando = false;
let puntos = [];

let r = 0;
let g = 0;
let b = 0;

let imagenOriginal = [];

/* Pintar y borrar */

//Seleccion de herramienta

let seleccionHerramienta = document.querySelector("#herramienta").addEventListener("change", function () {
    let acciones = document.getElementsByName("accion");
    for (let i = 0; i < acciones.length; i++) {
        if (acciones[i].checked) {
            herramienta = acciones[i].value;
        }
    }
});

document.querySelector("#pincel").addEventListener("change", function () {
    tamPincel = pincel.options[pincel.selectedIndex].value;
});

let a = document.getElementById("pincel");
a.addEventListener("click", function () {
    let e = document.getElementById("pincel");
    let result = e.options[e.selectedIndex].value;

});

//Calcular recta que para por dos puntos

canvas.addEventListener("mousedown", function () {
    pintando = true;
});

canvas.addEventListener("mousemove", function (e) {
    if (pintando) {
        if (herramienta == "pincel") {
            r = 0;
            g = 0;
            b = 0;
        } else {
            r = 255;
            g = 255;
            b = 255;
        }


        let x = e.pageX - this.offsetLeft;
        let y = e.pageY - this.offsetTop;

        //Si tengo mas de un par de puntos (x,y) dibujo una linea
        if (puntos.length > 0) {
            //Conseguir los valores de X e Y de dos puntos que pasan por una recta
            let ultimoX = puntos[puntos.length - 1][0];
            let ultimoY = puntos[puntos.length - 1][1];

            lineaPorDosPuntos(x, ultimoX, y, ultimoY);

        }

        puntos.push([x, y]);
        pintar(x, y, tamPincel, r, g, b);
        ctx.putImageData(imageData, 0, 0);
    }
});

canvas.addEventListener("mouseup", function () {
    pintando = false;
    puntos = [];
});

canvas.onmouseleave = (function () {
    pintando = false;
    puntos = [];
});

function calcularX(y, y1, y2, x1, x2) {
    return Math.floor((((y - y1) / (y2 - y1)) * (x2 - x1)) + x1);
}

function calcularY(x, y1, y2, x1, x2) {
    return Math.floor((((x - x1) / (x2 - x1)) * (y2 - y1)) + y1);
}

function pintar(x, y, tamPincel, r, g, b) {
    if (tamPincel > 1) {
        let tamanio = tamPincel - 1;
        //Hago dos bucles for donde primero seteo el pixel en el ejeX y luego en el ejeY
        for (let ejeX = x - tamanio; ejeX <= x + tamanio; ejeX++) {
            for (let ejeY = y - tamanio; ejeY <= y + tamanio; ejeY++) {
                setPixel(imageData, ejeX, ejeY, r, g, b, 255);
            }
        }
    } else {
        //El if se setea que esté dentro del canvas para evitar error cuando el mouse sale de esas medidas
        if ((x < canvas.width && x >= 0) && (y < canvas.height && y >= 0)) {
            setPixel(imageData, x, y, r, g, b, 255);
        }
    }
}

function lineaPorDosPuntos(x1, x2, y1, y2) {
    if (x1 < x2) {
        for (let i = x1; i < x2; i++) {
            pintar(i, calcularY(i, y1, y2, x1, x2), tamPincel, r, g, b);
        }
    } else {
        for (let i = x1; i > x2; i--) {
            pintar(i, calcularY(i, y1, y2, x1, x2), tamPincel, r, g, b);
        }
    }
    if (y1 < y2) {
        for (let i = y1; i < y2; i++) {
            pintar(calcularX(i, y1, y2, x1, x2), i, tamPincel, r, g, b);
        }
    } else {
        for (let i = y1; i > y2; i--) {
            pintar(calcularX(i, y1, y2, x1, x2), i, tamPincel, r, g, b);
        }
    }
}

function setPixel(imageData, x, y, r, g, b, a) {
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

/* Fin de funciones para pintar y borrar */

//Guardo la imagen original para cuando aplico un filtro y lo cambio, pueda volver al original antes
//Y no seguir aplicando filtros sobre filtros

function contenerImagenOriginal() {
    imagenOriginal = [];
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            imagenOriginal[imagenOriginal.length] = pRed(i, j);
            imagenOriginal[imagenOriginal.length] = pGreen(i, j);
            imagenOriginal[imagenOriginal.length] = pBlue(i, j);
            imagenOriginal[imagenOriginal.length] = pAlpha(i, j);
        }
    }
}

//Voy a utilizar esta funcion para reestablecer la imagen original cuando cambio de filtros

function setearImagenOriginal() {
    let pos = 0;
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            setPixel(imageData, i, j, imagenOriginal[pos], imagenOriginal[pos + 1], imagenOriginal[pos + 2], imagenOriginal[pos + 3]);
            pos += 4;
        }
    }
    ctx.putImageData(imageData, 0, 0)
}

function pRed(x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index];
}

function pGreen(x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 1];
}

function pBlue(x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 2];
}

function pAlpha(x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 3];
}

/* Filtros */

function sepia() {
    for (let i = 0; i < canvas.width - 1; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let promedio = Math.floor((pRed(i, j) + pGreen(i, j) + pBlue(i, j)) / 3);
            let red = Math.min(promedio + 40, 255);
            let green = Math.min(promedio + 15, 255);
            let blue = Math.min(promedio, 255);
            setPixel(imageData, i, j, red, green, blue, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

function negativo() {
    for (let i = 0; i < canvas.width - 1; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let red = 255 - pRed(i, j)
            let green = 255 - pGreen(i, j)
            let blue = 255 - pBlue(i, j)
            setPixel(imageData, i, j, red, green, blue, 255)
        }
    }
    ctx.putImageData(imageData, 0, 0)
}

function brillo() {
    let factorBrillo = 15;
    for (let i = 0; i < canvas.width - 1; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let red = pRed(i, j) + (255 * (factorBrillo / 100));
            let green = pGreen(i, j) + (255 * (factorBrillo / 100));
            let blue = pBlue(i, j) + (255 * (factorBrillo / 100));
            setPixel(imageData, i, j, red, green, blue, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function escalaGrises() {
    for (let i = 0; i < canvas.width - 1; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let promedio = Math.floor((pRed(i, j) + pGreen(i, j) + pBlue(i, j)) / 3);
            let red = promedio;
            let green = promedio;
            let blue = promedio;
            setPixel(imageData, i, j, red, green, blue, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function binarizacion() {
    let umbral = 50
    for (let i = 0; i < canvas.width - 1; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let promedio = Math.floor((pRed(i, j) + pGreen(i, j) + pBlue(i, j)) / 3);
            if (promedio > umbral) {
                setPixel(imageData, i, j, 255, 255, 255, 255);
            } else {
                setPixel(imageData, i, j, 0, 0, 0, 255);
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

let kernels = {
    sobel1: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    sobel2: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
    sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    blur: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
    edge: [1, 1, 1, 1, -7, 1, 1, 1, 1],
};

/* Funcion que va a recibir una matriz kernel y le va a aplicar la convolucion */

function convolucion(kernel) {

    let size = Math.sqrt(kernel.length);
    let half = Math.floor(size / 2);

    let width = canvas.width;
    let height = canvas.height;

    let inputData = ctx.getImageData(0, 0, width, height).data;

    let outputData = imageData.data;

    let pixelsAbove;

    let weight;
    let neighborY;
    let neighborX;

    let inputIndex;
    let outputIndex;

    for (let i = 0; i < height; ++i) {
        pixelsAbove = i * width;
        for (let j = 0; j < width; ++j) {
            r = 0;
            g = 0;
            b = 0;
            a = 0;

            for (let kernelY = 0; kernelY < size; ++kernelY) {
                for (let kernelX = 0; kernelX < size; ++kernelX) {
                    weight = kernel[kernelY * size + kernelX];
                    neighborY = Math.min(
                        height - 1,
                        Math.max(0, i + kernelY - half)
                    );
                    neighborX = Math.min(
                        width - 1,
                        Math.max(0, j + kernelX - half)
                    );
                    inputIndex = (neighborY * width + neighborX) * 4;
                    r += inputData[inputIndex] * weight;
                    g += inputData[inputIndex + 1] * weight;
                    b += inputData[inputIndex + 2] * weight;
                    a += inputData[inputIndex + 3] * weight;
                }
            }
            outputIndex = (pixelsAbove + j) * 4;
            outputData[outputIndex] = r;
            outputData[outputIndex + 1] = g;
            outputData[outputIndex + 2] = b;
            outputData[outputIndex + 3] = kernel.normalized ? a : 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

//RGB TO HSL
function saturacion() {
    for (let i = 0; i < canvas.width - 1; i++) {
        for (let j = 0; j < canvas.height; j++) {
            let red = pRed(i, j);
            let green = pGreen(i, j);
            let blue = pBlue(i, j);
            let r = red / 255;
            let g = green / 255;
            let b = blue / 255;

            let cmax = Math.max(r, g, b);
            let cmin = Math.min(r, g, b);
            let delta = (cmax - cmin);
            let hue = calcularHue(delta, cmax, r, g, b);
            let light = calcularLight(cmax, cmin);
            let sat = calcularSat(light, delta) + 0.2;
            let c = calcularC(sat, light);
            let x = obtenerX(hue, c);
            let m = light - (c / 2);
            let arrayNewRGB = calcularNewRGB(hue, c, x);
            let r1 = arrayNewRGB[0];
            let g1 = arrayNewRGB[1];
            let b1 = arrayNewRGB[2];
            let newRed = (r1 + m) * 255;
            let newGreen = (g1 + m) * 255;
            let newBlue = (b1 + m) * 255;
            setPixel(imageData, i, j, newRed, newGreen, newBlue, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

/* Funciones para calculos de filtro de saturacion */

function calcularNewRGB(hue, c, x) {
    if (hue >= 0 && hue < 60) {
        return [c, x, 0]
    } else if (hue >= 60 && hue < 120) {
        return [x, c, 0]
    } else if (hue >= 120 && hue < 180) {
        return [0, c, x]
    } else if (hue >= 180 && hue < 240) {
        return [0, x, c]
    } else if (hue >= 240 && hue < 300) {
        return [x, 0, c]
    } else {
        return [c, 0, x]
    }
}

function obtenerX(hue, c) {
    let aux = ((hue / 60) % 2) - 1
    if (aux < 0) {
        aux = aux * -1
    }
    return c * (1 - aux)
}

function calcularC(sat, light) {
    let aux = 2 * light - 1
    if (aux < 0) {
        aux = aux * -1
    }
    return (1 - aux) * sat
}

function calcularHue(delta, cmax, r, g, b) {
    if (delta == 0) {
        return 0
    } else if (cmax == r) {
        return Math.floor(60 * (((g - b) / delta) % 6))
    } else if (cmax == g) {
        return Math.floor(60 * (((b - r) / delta) + 2))
    } else {
        return Math.floor(60 * (((r - g) / delta) + 4))
    }
}

function calcularLight(cmax, cmin) {
    return (cmax + cmin) / 2
}

function calcularSat(light, delta) {
    if (delta == 0) {
        return 0
    } else {
        let aux = (2 * light) - 1
        if (aux < 0) {
            aux = aux * -1
        }
        return delta / (1 - ((2 * light) - 1))
    }
}

/* Fin calculos saturacion */

document.querySelector("#filtros").addEventListener("change", function () {
    let filtro = document.querySelector("#filtros").value;
    switch (filtro) {

        case "original": {
            setearImagenOriginal();
            break;
        }
        case "sepia": {
            setearImagenOriginal();
            sepia();
            break;
        }
        case "negativo": {
            setearImagenOriginal();
            negativo();
            break;
        }
        case "brillo": {
            setearImagenOriginal();
            brillo();
            break;
        }
        case "binarizacion": {
            setearImagenOriginal();
            binarizacion();
            break;
        }
        case "grises": {
            setearImagenOriginal();
            escalaGrises();
            break;
        }
        case "nitido": {
            setearImagenOriginal();
            convolucion(kernels.sharpen);
            break;
        }
        case "bordes": {
            setearImagenOriginal();
            convolucion(kernels.edge);
            break;
        }
        case "blur": {
            setearImagenOriginal();
            convolucion(kernels.blur);
            break;
        }
        case "sobel": {
            setearImagenOriginal();
            convolucion(kernels.sobel1);
            convolucion(kernels.sobel2);
            break;
        }
        case "saturacion": {
            setearImagenOriginal();
            saturacion();
            break;
        }
        default: {
            break;
        }
    }
});

/* Carga de Imagen */

document.querySelector("#getImage").addEventListener("click", function () {
    document.querySelector("#openImage").click();
})

selectImage.onchange = e => {
    let file = e.target.files[0];
    if (checkImagen(file)) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let image = new Image();
            image.src = content;

            image.onload = function () {
                let arregloCanvas = adaptCanvasTo(this);
                //Adapto la imágen al canvas
                canvas.width = arregloCanvas[0];
                canvas.height = arregloCanvas[1];

                //imageData = ctx.createImageData(canvas.width,canvas.height);

                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                // se resetea el canvas con la imagen.
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                ctx.putImageData(imageData, 0, 0);

                contenerImagenOriginal();
            }
        }
    }
    else {
        alert("Sólo se aceptan extensiones .jpeg .jpg .png");
    }
    selectImage.value = null;
}

function checkImagen(image) {
    let isImg = true;
    let imgType = image['type'];
    if (imgType == 'image/jpeg' || imgType == 'image/jpg' || imgType == 'image/png') {
        isImg = true;
    } else {
        isImg = false;
    }
    return isImg;
}

function adaptCanvasTo(picture) {
    let arr = [];
    let imageAspectRatio;
    let imageScaledWidth;
    let imageScaledHeight;
    if (picture.width > picture.height) {
        imageAspectRatio = (1.0 * picture.height) / picture.width;
        imageScaledWidth = ancho;
        imageScaledHeight = alto * imageAspectRatio;
    } else {
        imageAspectRatio = (1.0 * picture.width) / picture.height;
        imageScaledWidth = ancho * imageAspectRatio;
        imageScaledHeight = alto;
    }
    arr.push(imageScaledWidth);
    arr.push(imageScaledHeight);
    canvas.width = imageScaledWidth;
    canvas.height = imageScaledHeight;
    return arr;
}

/* Limpiar lienzo */

document.getElementById("lienzoBlanco").addEventListener("click", function () {
    imagenOriginal = [];
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            setPixel(imageData, i, j, 255, 255, 255, 255);
        }
    }
    ctx.putImageData(imageData, 0, 0);
});

/* Descargar imagen */

let downloadImage = document.querySelector("#download");
downloadImage.addEventListener("click", function(){
    downloadImage.href = canvas.toDataURL();
    downloadImage.download = "Proyecto.png";
});
