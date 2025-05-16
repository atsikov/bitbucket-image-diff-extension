import { styled } from '@linaria/react'
import { useRef, useState } from 'preact/hooks'
import { DiffImageTabs } from './tabs/DiffImageTabs'

const OverlayBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.25s ease-out;
  opacity: ${(props) => (props['data-open'] ? 1 : 0)};
  visibility: ${(props) => (props['data-hasContent'] ? 'visible' : 'hidden')};
`

const OverlayContainer = styled.div`
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

type OverlayProps =
  | { open: false }
  | {
      open: true
      images: [string, string]
    }

export const Overlay = (props: OverlayProps) => {
  const images = useRef<[string, string] | undefined>()
  images.current = props.open ? props.images : images.current

  const [showContent, setShowContent] = useState(props.open)
  const hasOverlay = showContent || props.open

  return (
    <OverlayBackdrop
      onTransitionStart={(event: TransitionEvent) => {
        if (props.open && event.propertyName === 'opacity') {
          setShowContent(true)
        }
      }}
      onTransitionEnd={(event: TransitionEvent) => {
        if (!props.open && event.propertyName === 'opacity') {
          setShowContent(false)
        }
      }}
      data-open={props.open}
      data-hasContent={showContent}
      aria-hidden={!props.open}
    >
      {hasOverlay && images.current && (
        <OverlayContainer>
          <DiffImageTabs images={images.current} />
        </OverlayContainer>
      )}
    </OverlayBackdrop>
  )
}
