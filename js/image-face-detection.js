const imageUpload = document.getElementById("imageUpload");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(init);

function init() {
  let imageObj, image, canvas;
  imageUpload.addEventListener("change", async () => {
    const container = document.createElement("div");
    container.style.position = "relative";
    document.body.append(container);
    //check if its not the first image uploaded delete the other one
    if (imageObj) {
      image.remove();
      canvas.remove();
    }
    //catch the image uploaded and show it on the screen
    image = await faceapi.bufferToImage(imageUpload.files[0]);
    imageObj = document.createElement("img");
    imageObj.style.height = 400;
    imageObj.style.width = 400;
    container.append(image);
    //detect faces on latest uploaded image and draw them on our canvas
    canvas = faceapi.createCanvasFromMedia(imageObj);
    container.append(canvas);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    resizedDetections.forEach((detection, index) => {
      const box = detection.detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: `Face ${index + 1}`,
      });
      drawBox.draw(canvas);
    });
  });
}
