"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ImageMerger {
    constructor(canvasWidth = 2160, canvasHeight = 2160) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    loadLayer(layer) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = () => resolve({
                image,
                size: layer.size || 1,
                x: layer.x || 0,
                y: layer.y || 0,
            });
            image.onerror = (err) => reject(new Error(`Failed to load image: ${err.message}`));
            image.src = layer.src;
        });
    }
    mergeLayers(layers) {
        return __awaiter(this, void 0, void 0, function* () {
            const canvas = document.createElement("canvas");
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            const context = canvas.getContext("2d");
            if (!context) {
                throw new Error("Failed to get canvas context");
            }
            const data = yield Promise.all(layers.map((layer) => this.loadLayer(layer)));
            data.forEach(({ image, size, x, y }) => {
                context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width * size, image.height * size);
            });
            return canvas.toDataURL("image/jpeg", 1.0);
        });
    }
    merge(images_1) {
        return __awaiter(this, arguments, void 0, function* (images, slices = []) {
            if (slices.length > 0) {
                const leftover = images.length -
                    slices.reduce((acc, currentValue) => acc + currentValue, 0);
                if (leftover > 0)
                    slices.push(leftover);
                const results = [];
                let start = 0;
                for (const slice of slices) {
                    const partOfImages = images.slice(start, start + slice);
                    start += slice;
                    const base64List = yield Promise.all(partOfImages.map((layers) => this.mergeLayers(layers)));
                    results.push(...base64List);
                }
                return results;
            }
            else {
                return yield Promise.all(images.map((layers) => this.mergeLayers(layers)));
            }
        });
    }
}
exports.default = ImageMerger;
