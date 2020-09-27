let ancho = canvas.width;
let alto = canvas.height;
let imagenCargada = null;

let imageData = ctx.createImageData(canvas.width, canvas.height);

//En esta variable voy a guardar la imagen original cargada para poder restablecer antes de aplicar algún filtro
let imagenOriginalData = null;

let selectImage = document.querySelector("#openImage");

document.querySelector("#getImage").addEventListener("click", function () {
    document.querySelector("#openImage").click();
})

selectImage.onchange = e => {
    let file = e.target.files[0];
    if (checkExtensionImagen(file)) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let image = new Image();
            image.src = content;

            image.onload = function () {
                let imageAspectRatio = (1.0 * this.height) / this.width;
                let imageScaledWidth = ancho;
                let imageScaledHeight = alto * imageAspectRatio;

                canvas.width = imageScaledWidth;
                canvas.height = imageScaledHeight;

                //Guardo los datos de la imagen cargada
                ctx.drawImage(image, 0, 0, imageScaledWidth, imageScaledHeight);

                imageData = ctx.getImageData(0, 0, imageScaledWidth, imageScaledHeight);

                ctx.putImageData(imageData, 0, 0);

                imagenOriginalData = ctx.getImageData(0, 0, imageScaledWidth, imageScaledHeight); //Guardo en otra variable la imagen original para poder restaurar luego de aplicar cambios
            }
        }
    }
    else {
        alert("Las extensiones aceptadas son: .png .jpg .jpeg");
    }
    selectImage.value = null;
}

function checkExtensionImagen(file) {
    let aceptarImagen = false;
    let tipo = file.type;

    if (tipo == "image/png" || tipo == "image/jpg" || tipo == "image/jpeg") {
        aceptarImagen = true;
    } else {
        aceptarImagen = false;
    }
    return aceptarImagen;
}

function restaurarImagenOriginal() {
    for (let i = 0; i < imagenOriginalData.data.length; i++) {
        imageData.data[i] = imagenOriginalData.data[i];
    }
    ctx.putImageData(imageData, 0, 0);
}

document.querySelector("#descarga").addEventListener("click", function () {
    let filename = prompt("Guardar como", ""),
        link = document.createElement('a');

    if (filename == null) { //Si se cancela no envío nada
        return false;
    }
    else if (filename == "") { //Si no se completa con un nombre la descar, se asigna Sin titulo
        link.download = "Sin titulo";
        link.href = canvas.toDataURL("image/png");
    }
    else { //Si pone un nombre en el input y tambien lo acepta, se descarga la imagen con dicho
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
    }
    link.click();
});

//Funcion para poner el Lienzo de nuevo en blanco
document.querySelector("#blanco").addEventListener("click", function () {
    for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = 255;
    }
    canvas.width = ancho;
    canvas.height = alto;
    ctx.putImageData(imageData, 0, 0);
});