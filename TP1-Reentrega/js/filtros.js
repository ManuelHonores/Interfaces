let r,g,b,a;

/* Funciones para obtener los r,g,b,a de la imagen */

function getPixel(x,y,pix) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + pix];
}

/* Filtros comunes */

function escalaGrises() {
    for(let i=0; i<canvas.width; i++) {
        for(let j=0; j<canvas.height; j++) {
            let red = getPixel(i,j,0);
            let green = getPixel(i,j,1);
            let blue = getPixel(i,j,2);

            let prom = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);

            red = green = blue = prom;

            setPixel(imageData,i,j,red,green,blue,255);
        }
    }
    ctx.putImageData(imageData,0,0);
}

function negativo() {
    for(let i=0; i<canvas.width; i++) {
        for(let j=0; j<canvas.height; j++) {
            let red = 255 - getPixel(i,j,0);
            let green = 255 - getPixel(i,j,1);
            let blue = 255 - getPixel(i,j,2);

            setPixel(imageData,i,j,red,green,blue,255);
        }
    }
    ctx.putImageData(imageData,0,0);
}

function binarizacion() {
    for(let i=0; i<canvas.width; i++) {
        for(let j=0; j<canvas.height; j++) {
            let red = getPixel(i,j,0);
            let green = getPixel(i,j,1);
            let blue = getPixel(i,j,2);

            let prom = Math.floor((getPixel(i,j,0) + getPixel(i,j,1) + getPixel(i,j,2)) / 3);
            
            let grey = (0.3 * red) + (0.59 * green) + (0.11 * blue);

            if(grey >= prom) {
                red = green = blue = 255;
            } else {
                red = green = blue = 0;
            }
            setPixel(imageData,i,j,red,green,blue,255);
        }
    }
    ctx.putImageData(imageData,0,0);
}

function sepia() {
    for(let i=0; i<canvas.width; i++) {
        for(let j=0; j<canvas.height; j++) {
            let red = getPixel(i,j,0);
            let green = getPixel(i,j,1);
            let blue = getPixel(i,j,2);

            let r = 255 - red;
            let g = 255 - green;
            let b = 255 - blue;

            setPixel(imageData, i, j, r, g, b, 255);
 
            r = ( red * .393 ) + ( green *.769 ) + ( blue * .189 );
            g = ( red * .349 ) + ( green *.686 ) + ( blue * .168 );
            b = ( red * .272 ) + ( green *.534 ) + ( blue * .131 );

            setPixel(imageData, i, j, r, g, b, 255);
        }
    }
    ctx.putImageData(imageData,0,0);
}

/* Filtros especiales */


let kernels = {
    sobel1: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    sobel2: [-1, -2, -1, 0, 0, 0, 1, 2, 1],
    sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
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

function setPixel(imageData, x, y, r, g, b, a) {
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

function getPixel(x,y,pix) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + pix];
}

document.querySelector("#filtros").addEventListener("change", function () {
    let filtro = document.querySelector("#filtros").value;
    switch (filtro) {

        case "original": {
            restaurarImagenOriginal();
            break;
        }
        case "sepia": {
            restaurarImagenOriginal();
            sepia();
            break;
        }
        case "negativo": {
            restaurarImagenOriginal();
            negativo();
            break;
        }
        case "binarizacion": {
            restaurarImagenOriginal();
            binarizacion();
            break;
        }
        case "grises": {
            restaurarImagenOriginal();
            escalaGrises();
            break;
        }
        case "nitido": {
            restaurarImagenOriginal();
            convolucion(kernels.sharpen);
            break;
        }
        case "bordes": {
            restaurarImagenOriginal();
            convolucion(kernels.edge);
            break;
        }
        case "sobel": {
            restaurarImagenOriginal();
            convolucion(kernels.sobel1);
            convolucion(kernels.sobel2);
            break;
        }
        default: {
            break;
        }
    }
});
