import ImageMerger from "./ImageMerger";

// Make sure the code below is running in a browser environment,
// because the ImageMerger class uses the HTMLCanvasElement
const imageMerger = new ImageMerger();
const layers = [
  { src: "image1.png", x: 0, y: 0, size: 1, opacity: 1 },
  { src: "image2.png", x: 0, y: 1000, size: 1, opacity: 1 },
  { src: "image3.png", x: 0, y: 0, size: 1, opacity: 1 },
];
const images = [layers]; // Array of layers for each image

imageMerger
  .merge(images, {
    format: "png",
  })
  .then((base64Images) => {
    // Put base64 into img -src- attribute
    base64Images.forEach((base64) => {
      const img = document.createElement("img");
      img.src = base64;
      const exampleElement = document.getElementById("example");
      if (exampleElement) exampleElement.appendChild(img);
    });
  });
