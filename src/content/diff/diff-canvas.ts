import { assertCanvasContext } from '../utils'

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
  return imageData.data.reduce<number[][]>((pixels, channel, index) => {
    if (index % 4 === 0) {
      pixels.push([channel])
    } else {
      pixels[pixels.length - 1].push(channel)
    }

    return pixels
  }, [])
}

export async function createDiffCanvasAndStats(
  imageBefore: HTMLImageElement,
  imageAfter: HTMLImageElement,
): Promise<
  | {
      canvas: null
      sizeBefore: { width: number; height: number }
      sizeAfter: { width: number; height: number }
    }
  | {
      canvas: HTMLCanvasElement
      numDifferentPixels: number
      differentPixelsRatio: number
      sizeBefore: { width: number; height: number }
      sizeAfter: { width: number; height: number }
    }
> {
  await waitForImagesToLoad(imageBefore, imageAfter)

  const sizeBefore = {
    width: imageBefore.naturalWidth,
    height: imageBefore.naturalHeight,
  }
  const sizeAfter = {
    width: imageAfter.naturalWidth,
    height: imageAfter.naturalHeight,
  }

  // Only support diffing for images of the same sizes
  if (
    sizeBefore.width !== sizeAfter.width ||
    sizeBefore.height !== sizeAfter.height
  ) {
    return {
      canvas: null,
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

  const imageDiffPixels = imageBeforePixels.map((pixelBefore, index) => {
    if (pixelBefore.join(',') === imageAfterPixels[index].join(',')) {
      return pixelBefore
    }

    return undefined
  })

  const numDifferentPixels = imageDiffPixels.filter(
    (pixel) => pixel === undefined,
  ).length
  const differentPixelsRatio = numDifferentPixels / imageBeforePixels.length

  const imageDiffDataArray = imageDiffPixels.reduce((acc, pixel, index) => {
    const diffPixel = pixel ?? [255, 0, 0, 255]

    acc[index * 4] = diffPixel[0]
    acc[index * 4 + 1] = diffPixel[1]
    acc[index * 4 + 2] = diffPixel[2]
    acc[index * 4 + 3] = diffPixel[3]
    return acc
  }, new Uint8ClampedArray(imageDiffPixels.length * 4))

  const offscreenDiffCanvas = document.createElement('canvas')
  offscreenDiffCanvas.width = width
  offscreenDiffCanvas.height = height

  const offscreenDiffCanvasContext = offscreenDiffCanvas.getContext('2d')
  assertCanvasContext(offscreenDiffCanvasContext)

  const diffImageData = new ImageData(imageDiffDataArray, width, height)
  offscreenDiffCanvasContext.putImageData(diffImageData, 0, 0)

  return {
    canvas: offscreenDiffCanvas,
    numDifferentPixels,
    differentPixelsRatio,
    sizeBefore,
    sizeAfter,
  }
}
