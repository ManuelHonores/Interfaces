let imageData = ctx.createImageData(canvas.width, canvas.height);

let selectImage = document.querySelector("#openImage");

document.querySelector("#getImage").addEventListener("click", function () {
    document.querySelector("#openImage").click();
})

selectImage.onchange = e => {
    let file = e.target.files[0];
    //if (checkImagen(file)) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = readerEvent => {
            let content = readerEvent.target.result;
            let image = new Image();
            image.src = content;

            image.onload = function () {
                //let arregloCanvas = adaptCanvasTo(this);
                //Adapto la imágen al canvas
                // canvas.width = arregloCanvas[0];
                // canvas.height = arregloCanvas[1];

                imageData = ctx.createImageData(canvas.width,canvas.height);

                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                // se resetea el canvas con la imagen.
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                ctx.putImageData(imageData, 0, 0);

                //contenerImagenOriginal();
            }
        }
    //}
    // else {
    //     alert("Sólo se aceptan extensiones .jpeg .jpg .png");
    // }
    selectImage.value = null;
}