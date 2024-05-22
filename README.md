# image-merger-by-steps

Merging a series of images all at one time on low-end devices can be painful. Here is the solution. A TypeScript module to load and merge images on the canvas with control over the merging steps.

## Features

- Customizable Steps: Define the steps and configurations for merging.
- Supports Various Formats: Merge images in different formats such as JPEG and PNG
- Supports For Image Customization: Setting the position, size, and opacity for each layer image.

## Options

### Merger Options:

| Key         |              Type               |                                                                                                                                                                                                                   Description |
| ----------- | :-----------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| slices      |            number[]             | An array of numbers defining the slices. For example, [2, 1] will process the first two images together in one step, and then the next image in a separate step. If there were more images, they would be processed together. |
| canvasSizes | {width: number, height: number} |                                                                                                                                                                                               Object defining the canvas size |
| format      |             string              |                                                                                                                                                             Output format of the merged image (options: 'jpg', 'jpeg', 'png') |

### Layer Options

| Key     |  Type  |                                            Description |
| ------- | :----: | -----------------------------------------------------: |
| x       | number | set the horizontal position of the image on the canvas |
| y       | number |   set the vertical position of the image on the canvas |
| size    | number |                             set the scale of the image |
| opacity | number |        Number to set the opacity of the image (0 to 1) |

## Installation

You can install the package via npm:

```bash
npm install image-merger-by-steps

```

## Usage

Here is an example of how to use image-merger-by-steps(checkout `/example` folder):

```javascript
// example.js
import ImageMerger from "image-merger-by-steps";

// Make sure the code below is running in a browser environment,
// because the ImageMerger class uses the HTMLCanvasElement
const imageMerger = new ImageMerger();

const layers1 = [
  { src: "image1.png", x: 0, y: 0, size: 1, opacity: 1 }, // Here goes the LayerOptions
  { src: "image2.png", x: 0, y: 1000, size: 1, opacity: 1 },
  { src: "image3.png", x: 0, y: 0, size: 1, opacity: 1 },
];
const layers2 = [
  { src: "image4.png", x: 0, y: 0, size: 1, opacity: 1 },
  { src: "image5.png", x: 0, y: 1000, size: 1, opacity: 1 },
  { src: "image6.png", x: 0, y: 0, size: 1, opacity: 1 },
];
const images = [layers1, layers2, layers1, layers2, layers1]; // Array of layers for each image

imageMerger
  .merge(images, {
    format: "png", // Here goes the MergerOptions
    slices: [2, 2, 1],
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
```

```typescript
// example.ts
import ImageMerger, { Layer } from "image-merger-by-steps";

// Make sure the code below is running in a browser environment,
// because the ImageMerger class uses the HTMLCanvasElement
const imageMerger = new ImageMerger();
const layers1: Layer[] = [
  { src: "image1.png", x: 0, y: 0, size: 1, opacity: 1 }, // Here goes the LayerOptions
  { src: "image2.png", x: 0, y: 1000, size: 1, opacity: 1 },
  { src: "image3.png", x: 0, y: 0, size: 1, opacity: 1 },
];
const layers2: Layer[] = [
  { src: "image4.png", x: 0, y: 0, size: 1, opacity: 1 },
  { src: "image5.png", x: 0, y: 1000, size: 1, opacity: 1 },
  { src: "image6.png", x: 0, y: 0, size: 1, opacity: 1 },
];
const images: Layer[][] = [layers1, layers2, layers1, layers2, layers1]; // Array of layers for each image

imageMerger
  .merge(images, {
    format: "png", // Here goes the MergerOptions
    slices: [2, 2, 1],
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
```
<img src="https://github.com/HCY71/image-merger-by-steps/blob/main/example/image1.png" width="250">
- image1.png
<img src="https://github.com/HCY71/image-merger-by-steps/blob/main/example/image2.png" width="250">
- image3.png
<img src="https://github.com/HCY71/image-merger-by-steps/blob/main/example/image3.png" width="250">
- image3.png
<hr>
<img src="https://github.com/HCY71/image-merger-by-steps/blob/main/example/result.png" width="250">
- result.png


## Contact

For any questions or feedback, please open an issue on GitHub or contact my email
