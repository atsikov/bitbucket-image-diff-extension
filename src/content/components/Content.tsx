import { styled } from '@linaria/react'
import {
  MutableRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/hooks'
import { ElementId, PR_CHANGED_IMAGE_SELECTOR } from '../constants'
import { Overlay } from './Overlay'

const ExtensionContainer = styled.div`
  position: relative;
  z-index: 9999;
`

const getImagesContainer = (
  extensionContainerRef: MutableRef<HTMLElement | null>,
) => extensionContainerRef.current?.ownerDocument.body

export const Content = () => {
  const [overlayImages, setOverlayImages] = useState<[string, string] | null>(
    null,
  )

  const containerRef = useRef<HTMLDivElement | null>(null)
  const bodyOverflowStyles = useRef<
    | {
        overflow: string
        overflowX: string
        overflowY: string
      }
    | undefined
  >()

  const openDiffOverlay = useCallback((event: MouseEvent) => {
    const imagesContainer = getImagesContainer(containerRef)
    if (!imagesContainer) {
      return
    }

    const body = imagesContainer.ownerDocument.body
    bodyOverflowStyles.current = {
      overflow: body.style.overflow,
      overflowX: body.style.overflowX,
      overflowY: body.style.overflowY,
    }

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

    imagesContainer.style.overflow = 'hidden'

    setOverlayImages(imagesUrls as [string, string])
  }, [])

  const closeDiffOverlay = useCallback(() => {
    const imagesContainer = getImagesContainer(containerRef)
    if (!imagesContainer) {
      return
    }

    const body = imagesContainer.ownerDocument.body
    body.style.overflow = bodyOverflowStyles.current?.overflow ?? ''
    body.style.overflowX = bodyOverflowStyles.current?.overflow ?? ''
    body.style.overflowY = bodyOverflowStyles.current?.overflow ?? ''

    bodyOverflowStyles.current = undefined

    setOverlayImages(null)
  }, [])

  useLayoutEffect(() => {
    const imagesContainer = getImagesContainer(containerRef)
    if (!imagesContainer) {
      return
    }

    const onElementAdded = () => {
      imagesContainer
        .querySelectorAll<HTMLImageElement>(PR_CHANGED_IMAGE_SELECTOR)
        .forEach((element) => {
          if (element.getAttribute('data-image-diff-listener') !== 'true') {
            element.addEventListener('click', openDiffOverlay)
            element.style.cursor = 'pointer'

            element.setAttribute('data-image-diff-listener', 'true')
          }
        })
    }

    onElementAdded()

    const observer = new MutationObserver(onElementAdded)
    observer.observe(imagesContainer, {
      subtree: true,
      childList: true,
      attributes: false,
      characterData: false,
    })

    return () => {
      observer.disconnect()

      imagesContainer
        .querySelectorAll<HTMLImageElement>('[data-image-diff-listener="true"]')
        .forEach((element) =>
          element.removeEventListener('click', openDiffOverlay),
        )
    }
  }, [])

  useEffect(() => {
    if (!overlayImages) {
      return
    }

    const closeOverlayOnEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDiffOverlay()
      }
    }

    window.addEventListener('keydown', closeOverlayOnEsc)

    return () => {
      window.removeEventListener('keydown', closeOverlayOnEsc)
    }
  }, [overlayImages])

  return (
    <ExtensionContainer
      ref={containerRef}
      id={ElementId.DiffOverlayContainer}
      data-testid="image-diff-extension-container"
    >
      {overlayImages ? (
        <Overlay images={overlayImages} open />
      ) : (
        <Overlay open={false} />
      )}
    </ExtensionContainer>
  )
}
