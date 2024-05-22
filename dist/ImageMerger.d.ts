export interface Layer {
    src: string;
    size?: number;
    x?: number;
    y?: number;
    opacity?: number;
}
export interface MergerOptions {
    slices?: number[];
    canvasSizes?: {
        width: number;
        height: number;
    };
    format?: "jpg" | "jpeg" | "png";
}
declare class ImageMerger {
    private loadLayer;
    private mergeLayers;
    merge(images: Layer[][], options?: MergerOptions): Promise<string[]>;
}
export default ImageMerger;
