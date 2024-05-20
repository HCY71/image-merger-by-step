export class GenerateImage {

    constructor () {

        // this.base_url = process.env.BASE_URL
        this.canvasWidth = 2160
        this.canvasHeight = 2160

    }

    loadLayer(layer) {

        return new Promise((resolve, reject) => {

            let image = new Image()
            image.addEventListener("load", () => resolve({ image, size: layer.size || 1, x: layer.x || 0, y: layer.y || 0 }))
            image.addEventListener("error", (err) => reject(err))
            image.src = layer.src
            image.crossOrigin = 'Anonymous'

        })

    }

    mergeLayers(layers) {

        return new Promise(async (resolve) => {

            const canvas = document.createElement('canvas')
            canvas.width = this.canvasWidth
            canvas.height = this.canvasHeight

            const context = canvas.getContext('2d')
            const data = await Promise.all(layers.map(layer => this.loadLayer(layer)))

            let drawCounter = 0
            data.map(layer => {

                const size = layer.size
                const x = layer.x
                const y = layer.y

                context.drawImage(layer.image, 0, 0, layer.image.width, layer.image.height, x, y, layer.image.width * size, layer.image.height * size)
                drawCounter++

                if (drawCounter === layers.length) {

                    const base64 = canvas.toDataURL('image/jpeg', 1.0)
                    resolve(base64)

                }

            })

        })

    }

    generateImages(images, slices) {

        return new Promise(async (resolve) => {

            if (slices && slices?.length > 0) {

                const leftover = images.length - slices.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                if (leftover > 0) slices.push(leftover)

                let start = 0
                let result = []


                const testPromiseInSeries = async (slices) => {
                    for (const s of slices) {
                        const partOfImages = images.slice(start, start + s)
                        start += s
                        const base64List = await Promise.all(partOfImages.map(layers => this.mergeLayers(layers)))
                        console.log(result)
                        result = [ ...result, ...base64List ]
                    }
                    if (result.length === images.length) resolve(result)
                }
                await testPromiseInSeries(slices)

                // slices.map(async (s) => {
                //     console.log('start')
                //     const partOfImages = images.slice(start, start + s)
                //     start += s
                //     const base64List = await Promise.all(partOfImages.map(layers => this.mergeLayers(layers)))

                //     console.log('result')
                //     console.log(result)
                //     result = [ ...result, ...base64List ]


                //     if (result.length === images.length) resolve(result)

                // })

            }
            // Run all at the same time
            else {

                const base64List = await Promise.all(images.map(layers => this.mergeLayers(layers)))
                resolve(base64List)

            }

        })

    }

}
