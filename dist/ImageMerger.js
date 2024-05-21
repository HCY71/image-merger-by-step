var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ImageMerger {
    loadLayer(layer) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = () => resolve({
                image,
                size: layer.size || 1,
                x: layer.x || 0,
                y: layer.y || 0,
                opacity: layer.opacity || 1,
            });
            image.onerror = (err) => reject(new Error(`Failed to load image: ${err.message}`));
            image.src = layer.src;
        });
    }
    mergeLayers(layers, options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield Promise.all(layers.map((layer) => this.loadLayer(layer)));
                // Get maximum width and height of all layers, to set canvas size
                const sizeHelper = (dim) => {
                    var _a, _b;
                    return (_b = (_a = options.canvasSizes) === null || _a === void 0 ? void 0 : _a[dim]) !== null && _b !== void 0 ? _b : Math.max(...data.map((d) => d.image[dim] * d.size));
                };
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
                    context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width * size, image.height * size);
                    drawCounter++;
                    if (drawCounter === layers.length) {
                        const format = options.format === "png" ? "image/png" : "image/jpeg";
                        const base64 = canvas.toDataURL(format, 1.0);
                        resolve(base64);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    merge(images, options = {}) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (options.slices && options.slices.length > 0) {
                const leftover = images.length -
                    options.slices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                if (leftover > 0)
                    options.slices.push(leftover);
                let start = 0;
                let result = [];
                const promiseInSeries = (slices) => __awaiter(this, void 0, void 0, function* () {
                    for (const s of slices) {
                        const partOfImages = images.slice(start, start + s);
                        start += s;
                        const base64List = yield Promise.all(partOfImages.map((layers) => this.mergeLayers(layers, options)));
                        result = [...result, ...base64List];
                    }
                    if (result.length === images.length)
                        resolve(result);
                });
                yield promiseInSeries(options.slices);
            }
            else {
                const base64List = yield Promise.all(images.map((layers) => this.mergeLayers(layers, options)));
                resolve(base64List);
            }
        }));
    }
}
export default ImageMerger;
