import { ElementId, PR_CHANGED_IMAGE_SELECTOR } from '../constants'
import { queryById } from '../utils'
import { renderOverlay } from './overlay'

export function createOverlayContainer(parent: HTMLElement) {
  if (queryById(parent, ElementId.DiffOverlayContainer)) {
    return
  }

  const overlayContainer = parent.ownerDocument.createElement('div')
  overlayContainer.id = ElementId.DiffOverlayContainer
  overlayContainer.setAttribute('data-testid', 'image-diff-extension-container')
  overlayContainer.style.position = 'relative'
  overlayContainer.style.zIndex = '9999'
  overlayContainer.style.display = 'none'

  parent.appendChild(overlayContainer)

  let bodyOverflow: string | undefined

  async function openDiffOverlay(event: MouseEvent) {
    const body = parent.ownerDocument.body
    bodyOverflow = window.getComputedStyle(body).overflow

    const targetRow = event
      .composedPath()
      .find(
        (eventTarget) =>
          eventTarget instanceof HTMLElement &&
          eventTarget.getAttribute('data-testid') === 'file-content',
      ) as HTMLElement | undefined

    if (!targetRow) {
      return
    }

    const imagesUrls = Array.from(
      targetRow.querySelectorAll<HTMLImageElement>(
        '[data-testid="image-diff"] img',
      ),
    ).map((element) => element.src)

    if (imagesUrls.length !== 2) {
      return
    }

    body.style.overflow = 'hidden'

    overlayContainer.style.display = 'block'

    window.addEventListener('keydown', closeOverlayOnEsc)

    return renderOverlay(
      overlayContainer,
      imagesUrls[0],
      imagesUrls[1],
      closeDiffOverlay,
    )
  }

  function closeOverlayOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDiffOverlay()
    }
  }

  function closeDiffOverlay() {
    overlayContainer.style.display = 'none'
    overlayContainer.innerHTML = ''

    parent.ownerDocument.body.style.overflow = bodyOverflow ?? ''

    bodyOverflow = undefined

    window.removeEventListener('keydown', closeOverlayOnEsc)
  }

  let handledNodes = new Set<HTMLImageElement>()

  function onElementAdded() {
    parent
      .querySelectorAll<HTMLImageElement>(PR_CHANGED_IMAGE_SELECTOR)
      .forEach((element) => {
        if (!handledNodes.has(element)) {
          element.addEventListener('click', openDiffOverlay)
          element.style.cursor = 'pointer'

          handledNodes.add(element)
        }
      })
  }

  const observer = new MutationObserver(onElementAdded)
  observer.observe(parent, {
    subtree: true,
    childList: true,
    attributes: false,
    characterData: false,
  })
}

createOverlayContainer(document.body)
