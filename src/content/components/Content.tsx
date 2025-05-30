import { styled } from '@linaria/react'
import {
  MutableRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'preact/hooks'
import {
  ElementId,
  PR_CHANGED_IMAGE_SELECTOR,
  PR_FILE_CONTENT_SELECTOR,
} from '../constants'
import { Overlay } from './Overlay'

const ExtensionContainer = styled.div`
  position: relative;
  z-index: 9999;
`
const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--inactive-tab-color);
  background-color: #f4f5f7;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow:
    0 0 1px 0 rgba(24, 94, 224, 0.15),
    0 6px 12px 0 rgba(24, 94, 224, 0.15);

  &:hover {
    color: var(--active-tab-color);
    background-color: var(--secondary-color);
  }

  &:focus {
    outline: 2px solid var(--active-tab-color);
  }
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
    if (bodyOverflowStyles.current) {
      // Overlay is already opened
      return
    }

    const imagesContainer = getImagesContainer(containerRef)
    if (!imagesContainer) {
      return
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

    const body = imagesContainer.ownerDocument.body
    bodyOverflowStyles.current = {
      overflow: body.style.overflow,
      overflowX: body.style.overflowX,
      overflowY: body.style.overflowY,
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
      const fileContentRows =
        imagesContainer.querySelectorAll<HTMLImageElement>(
          PR_FILE_CONTENT_SELECTOR,
        )
      fileContentRows.forEach((row) => {
        const images = row.querySelectorAll<HTMLImageElement>(
          PR_CHANGED_IMAGE_SELECTOR,
        )
        if (images.length !== 2) {
          return
        }

        images.forEach((image) => {
          if (image.getAttribute('data-image-diff-listener') !== 'true') {
            image.addEventListener('click', openDiffOverlay)
            image.style.cursor = 'pointer'

            image.setAttribute('data-image-diff-listener', 'true')
          }
        })
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
        <>
          <Overlay images={overlayImages} open />
          <CloseButton
            onClick={closeDiffOverlay}
            aria-label="Close image diff"
            title="Close image diff"
          >
            ✕
          </CloseButton>
        </>
      ) : (
        <Overlay open={false} />
      )}
    </ExtensionContainer>
  )
}
