export interface Layer {
  src: string;
  size?: number;
  x?: number;
  y?: number;
}

class ImageMerger {
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number = 2160, canvasHeight: number = 2160) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  private loadLayer(
    layer: Layer
  ): Promise<{ image: HTMLImageElement; size: number; x: number; y: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () =>
        resolve({
          image,
          size: layer.size || 1,
          x: layer.x || 0,
          y: layer.y || 0,
        });
      image.onerror = (err) =>
        reject(
          new Error(`Failed to load image: ${(err as ErrorEvent).message}`)
        );
      image.src = layer.src;
    });
  }

  private async mergeLayers(layers: Layer[]): Promise<string> {
    const canvas = document.createElement("canvas");
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    const data = await Promise.all(
      layers.map((layer) => this.loadLayer(layer))
    );
    data.forEach(({ image, size, x, y }) => {
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
    });

    return canvas.toDataURL("image/jpeg", 1.0);
  }

  public async merge(
    images: Layer[][],
    slices: number[] = []
  ): Promise<string[]> {
    if (slices.length > 0) {
      const leftover =
        images.length -
        slices.reduce((acc, currentValue) => acc + currentValue, 0);
      if (leftover > 0) slices.push(leftover);

      const results: string[] = [];
      let start = 0;

      for (const slice of slices) {
        const partOfImages = images.slice(start, start + slice);
        start += slice;
        const base64List = await Promise.all(
          partOfImages.map((layers) => this.mergeLayers(layers))
        );
        results.push(...base64List);
      }

      return results;
    } else {
      return await Promise.all(
        images.map((layers) => this.mergeLayers(layers))
      );
    }
  }
}

export default ImageMerger;
