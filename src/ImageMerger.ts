export interface Layer {
  src: string;
  size?: number;
  x?: number;
  y?: number;
  opacity?: number;
}
export interface MergerOptions {
  slices?: number[];
  canvasSizes?: { width: number; height: number };
  format?: "jpg" | "jpeg" | "png";
}

class ImageMerger {
  private loadLayer(layer: Layer): Promise<{
    image: HTMLImageElement;
    size: number;
    x: number;
    y: number;
    opacity: number;
  }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () =>
        resolve({
          image,
          size: layer.size || 1,
          x: layer.x || 0,
          y: layer.y || 0,
          opacity: layer.opacity || 1,
        });
      image.onerror = (err) =>
        reject(
          new Error(`Failed to load image: ${(err as ErrorEvent).message}`)
        );
      image.src = layer.src;
    });
  }

  private mergeLayers(
    layers: Layer[],
    options: MergerOptions
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Promise.all(
          layers.map((layer) => this.loadLayer(layer))
        );
        // Get maximum width and height of all layers, to set canvas size
        const sizeHelper = (dim: "width" | "height") =>
          options.canvasSizes?.[dim] ??
          Math.max(...data.map((d) => d.image[dim] * d.size));

        const canvas = document.createElement("canvas");
        canvas.width = sizeHelper("width");
        canvas.height = sizeHelper("height");
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        let drawCounter = 0;
        data.forEach(({ image, size, x, y, opacity }) => {
          context.globalAlpha = opacity;
          context.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            x,
            y,
            image.width * size,
            image.height * size
          );
          drawCounter++;

          if (drawCounter === layers.length) {
            const format =
              options.format === "png" ? "image/png" : "image/jpeg";
            const base64 = canvas.toDataURL(format, 1.0);
            resolve(base64);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public merge(
    images: Layer[][],
    options: MergerOptions = {}
  ): Promise<string[]> {
    return new Promise(async (resolve) => {
      if (options.slices && options.slices.length > 0) {
        const leftover =
          images.length -
          options.slices.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          );
        if (leftover > 0) options.slices.push(leftover);

        let start = 0;
        let result: string[] = [];

        const promiseInSeries = async (slices: number[]) => {
          for (const s of slices) {
            const partOfImages = images.slice(start, start + s);
            start += s;
            const base64List = await Promise.all(
              partOfImages.map((layers) => this.mergeLayers(layers, options))
            );
            result = [...result, ...base64List];
          }
          if (result.length === images.length) resolve(result);
        };
        await promiseInSeries(options.slices);
      } else {
        const base64List = await Promise.all(
          images.map((layers) => this.mergeLayers(layers, options))
        );
        resolve(base64List);
      }
    });
  }
}

export default ImageMerger;
