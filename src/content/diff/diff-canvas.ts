import { assertCanvasContext } from '../utils'

type Rgba = [number, number, number, number]

function waitForImagesToLoad(...images: HTMLImageElement[]): Promise<void> {
  return new Promise((resolve) => {
    const isLoaded = images.map((image) => image.complete)

    const tryResolve = () => {
      if (isLoaded.every(Boolean)) {
        resolve()
      }
    }

    images.forEach((image, index) => {
      image.addEventListener('load', () => {
        isLoaded[index] = true
        tryResolve()
      })
    })

    tryResolve()
  })
}

function createCanvasFromImage(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext('2d')
  assertCanvasContext(context)

  context.drawImage(image, 0, 0)

  return canvas
}

function getImageDataPixels(imageData: ImageData) {
  return imageData.data.reduce<Rgba[]>((pixels, channel, index) => {
    if (index % 4 === 0) {
      pixels.push([channel, 0, 0, 0])
    } else {
      pixels[pixels.length - 1][index % 4] = channel
    }

    return pixels
  }, [])
}

function getNormalisedPixelChannelDiff(value: number, factor = 120): number {
  const diff = Math.abs(value)
  const normalized = diff / 255
  return factor + (255 - factor) * normalized * normalized
}

function toGrayscale([r, g, b, a]: Rgba): Rgba {
  const grayscale = 0.299 * r + 0.587 * g + 0.114 * b
  return [grayscale, grayscale, grayscale, a]
}

export type ImageDiffData =
  | {
      getDiffImageData: null
      sizeBefore: { width: number; height: number }
      sizeAfter: { width: number; height: number }
    }
  | {
      getDiffImageData: (factor?: number) => ImageData
      numDifferentPixels: number
      differentPixelsRatio: number
      sizeBefore: { width: number; height: number }
      sizeAfter: { width: number; height: number }
    }

export async function calculateImageDiff(
  imageBefore: HTMLImageElement,
  imageAfter: HTMLImageElement,
): Promise<ImageDiffData> {
  await waitForImagesToLoad(imageBefore, imageAfter)

  const sizeBefore = {
    width: imageBefore.naturalWidth,
    height: imageBefore.naturalHeight,
  }
  const sizeAfter = {
    width: imageAfter.naturalWidth,
    height: imageAfter.naturalHeight,
  }

  // Only support diffing for images of the same sizes for now
  if (
    sizeBefore.width !== sizeAfter.width ||
    sizeBefore.height !== sizeAfter.height
  ) {
    return {
      getDiffImageData: null,
      sizeBefore,
      sizeAfter,
    }
  }

  const width = imageBefore.naturalWidth
  const height = imageBefore.naturalHeight

  const offscreenCanvasBefore = createCanvasFromImage(imageBefore)
  const offscreenCanvasAfter = createCanvasFromImage(imageAfter)

  const offscreenCanvasBeforeContext = offscreenCanvasBefore.getContext('2d')
  assertCanvasContext(offscreenCanvasBeforeContext)

  const offscreenCanvasAfterContext = offscreenCanvasAfter.getContext('2d')
  assertCanvasContext(offscreenCanvasAfterContext)

  const imageDataBefore = offscreenCanvasBeforeContext.getImageData(
    0,
    0,
    width,
    height,
  )

  const imageDataAfter = offscreenCanvasAfterContext.getImageData(
    0,
    0,
    width,
    height,
  )

  const imageBeforePixels = getImageDataPixels(imageDataBefore)
  const imageAfterPixels = getImageDataPixels(imageDataAfter)

  const imageDiffPixels = imageBeforePixels.map<Rgba | undefined>(
    (pixelBefore, index) => {
      const pixelAfter = imageAfterPixels[index]
      if (pixelBefore.join(',') === pixelAfter.join(',')) {
        return undefined
      }

      const pixelBeforeGrayscaled = toGrayscale(pixelBefore)
      const pixelAfterGrayscaled = toGrayscale(pixelAfter)

      return [
        pixelBeforeGrayscaled[0] - pixelAfterGrayscaled[0],
        pixelBeforeGrayscaled[1] - pixelAfterGrayscaled[1],
        pixelBeforeGrayscaled[2] - pixelAfterGrayscaled[2],
        255 - Math.abs(pixelBeforeGrayscaled[3] - pixelAfterGrayscaled[3]),
      ]
    },
  )

  const numDifferentPixels = imageDiffPixels.filter(
    (pixel) => pixel === undefined,
  ).length

  const differentPixelsRatio = numDifferentPixels / imageBeforePixels.length

  return {
    numDifferentPixels,
    differentPixelsRatio,
    sizeBefore,
    sizeAfter,
    getDiffImageData(factor = 120) {
      const imageDiffDataArray = imageDiffPixels.reduce(
        (acc, pixel, index) => {
          const [r, g, b, a] = pixel
            ? toGrayscale([
                getNormalisedPixelChannelDiff(pixel[0], factor),
                getNormalisedPixelChannelDiff(pixel[1], factor),
                getNormalisedPixelChannelDiff(pixel[2], factor),
                pixel[3], // No need to apply normalisation to alpha
              ])
            : [0, 0, 0, 255]

          acc[index * 4] = r
          acc[index * 4 + 1] = g
          acc[index * 4 + 2] = b
          acc[index * 4 + 3] = a
          return acc
        },
        new Uint8ClampedArray(imageDiffPixels.length * 4),
      )

      return new ImageData(imageDiffDataArray, width, height)
    },
  }
}
