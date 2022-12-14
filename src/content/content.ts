import { ElementId, PR_CHANGED_IMAGE_SELECTOR } from './constants'
import { renderOverlay } from './overlay'

export function createOverlayContainer(parent: HTMLElement) {
  if (parent.querySelector(`#${ElementId.DiffOverlayContainer}`)) {
    return
  }

  const overlayContainer = parent.ownerDocument.createElement('div')
  overlayContainer.id = ElementId.DiffOverlayContainer
  overlayContainer.setAttribute('data-testid', 'image-diff-extension-container')
  overlayContainer.style.display = 'none'

  parent.appendChild(overlayContainer)

  function openDiffOverlay(event: MouseEvent) {
    const targetRow = event
      .composedPath()
      .find(
        (eventTarget) =>
          eventTarget instanceof HTMLElement &&
          eventTarget.getAttribute('data-testid') === 'image-diff',
      ) as HTMLElement | undefined

    if (!targetRow) {
      return
    }

    const imagesUrls = Array.from(
      targetRow.querySelectorAll<HTMLImageElement>('img'),
    ).map((element) => element.src)

    overlayContainer.style.display = 'block'

    renderOverlay(overlayContainer, imagesUrls[0], imagesUrls[1])

    window.addEventListener('keypress', closeOverlayOnEsc)
  }

  function closeOverlayOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDiffOverlay()
    }
  }

  function closeDiffOverlay() {
    overlayContainer.style.display = 'none'
    overlayContainer.innerHTML = ''

    window.removeEventListener('keypress', closeOverlayOnEsc)
  }

  parent
    .querySelectorAll<HTMLImageElement>(PR_CHANGED_IMAGE_SELECTOR)
    .forEach((element) => {
      element.addEventListener('click', openDiffOverlay)
    })

  renderOverlay(overlayContainer, '.', '.')
}

createOverlayContainer(document.body)

/*
let imageBeforeLoaded = false
let imageAfterLoaded = false

imageBefore?.addEventListener('load', () => {
  imageBeforeLoaded = true

  prepareDiffCanvas()
})

imageAfter?.addEventListener('load', () => {
  imageAfterLoaded = true

  prepareDiffCanvas()
})

function createCanvas(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Cannot retrieve canvas context')
  }

  context.drawImage(image, 0, 0)

  return canvas
}

function prepareDiffCanvas() {
  if (!imageBeforeLoaded || !imageAfterLoaded) {
    return
  }

  const offscreenCanvasBefore = createCanvas(imageBefore)
  const offscreenCanvasAfter = createCanvas(imageAfter)

  const differenceCanvas = document.querySelector<HTMLCanvasElement>(
    'canvas#diff-difference-image',
  )

  const imageDataBefore = offscreenCanvasBefore
    .getContext('2d')
    .getImageData(
      0,
      0,
      offscreenCanvasBefore.width,
      offscreenCanvasBefore.height,
    )

  const imageDataAfter = offscreenCanvasAfter
    .getContext('2d')
    .getImageData(0, 0, offscreenCanvasAfter.width, offscreenCanvasAfter.height)

  const imageBeforePixels = imageDataBefore.data.reduce<number[][]>(
    (pixels, channel, index) => {
      if (index % 4 === 0) {
        pixels.push([channel])
      } else {
        pixels[pixels.length - 1].push(channel)
      }

      return pixels
    },
    [],
  )

  const imageAfterPixels = imageDataAfter.data.reduce<number[][]>(
    (pixels, channel, index) => {
      if (index % 4 === 0) {
        pixels.push([channel])
      } else {
        pixels[pixels.length - 1].push(channel)
      }

      return pixels
    },
    [],
  )

  const imageDiffPixels = imageBeforePixels.map((pixel, index) => {
    if (pixel.join(',') === imageAfterPixels[index].join(',')) {
      return pixel
    }

    return [255, 0, 0, 255]
  })

  const imageDiffDataArray = imageDiffPixels.reduce((acc, pixel, index) => {
    acc[index * 4] = pixel[0]
    acc[index * 4 + 1] = pixel[1]
    acc[index * 4 + 2] = pixel[2]
    acc[index * 4 + 3] = pixel[3]
    return acc
  }, new Uint8ClampedArray(imageDiffPixels.length * 4))

  const offscreenDiffCanvas = document.createElement('canvas')
  offscreenDiffCanvas.width = offscreenCanvasBefore.width
  offscreenDiffCanvas.height = offscreenCanvasBefore.height

  const diffImageData = new ImageData(
    imageDiffDataArray,
    offscreenCanvasBefore.width,
    offscreenCanvasBefore.height,
  )
  offscreenDiffCanvas.getContext('2d').putImageData(diffImageData, 0, 0)

  differenceCanvas.width = offscreenDiffCanvas.width
  differenceCanvas.height = offscreenDiffCanvas.height

  differenceCanvas
    .getContext('2d')
    .drawImage(
      offscreenDiffCanvas,
      0,
      0,
      offscreenDiffCanvas.width,
      offscreenDiffCanvas.height,
    )
}

const overlayOpacityInput = document.querySelector<HTMLInputElement>(
  'input[name="overlay-opacity"]',
)
overlayOpacityInput.addEventListener('input', (event) => {
  const root = document.documentElement
  root.style.setProperty(
    '--diff-overlay-opacity',
    (event.currentTarget as HTMLInputElement).value,
  )
})
*/
