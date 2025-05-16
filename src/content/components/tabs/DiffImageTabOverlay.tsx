import { styled } from '@linaria/react'
import { DiffImageTab, DiffImageWrapper } from './DiffImageTab'
import { useState } from 'preact/hooks'

type DiffImageTabOverlayProps = {
  images: [string, string]
}

const OverlayAlphaSliderContainer = styled.div`
  background: rgb(255, 235, 230);
  width: 100%;
  margin-bottom: -16px;
  padding-top: 18px;
  text-align: center;
  position: relative;
  z-index: 1;
`

const ImagesStack = styled.div`
  display: flex;
  width: 100%;

  & [data-img-type='after'] {
    position: absolute;
    background-color: transparent;
    color: rgb(191, 38, 0);
    width: 100%;
    padding: 16px 0;

    img {
      opacity: ${({ overlayOpacity }) => overlayOpacity};
    }
  }
`

export const DiffImageTabOverlay = ({ images }: DiffImageTabOverlayProps) => {
  const [overlayOpacity, setOverlayOpacity] = useState(0.5)

  return (
    <DiffImageTab data-diff-type="overlay">
      <OverlayAlphaSliderContainer>
        <input
          type="range"
          id="overlay-diff-alpha-slider"
          name="overlay-diff-alpha-slider"
          min="0"
          max="1"
          step="0.01"
          value={overlayOpacity}
          onChange={(event) =>
            setOverlayOpacity(parseFloat(event.currentTarget.value))
          }
        />
        <label for="overlay-diff-alpha-slider">Overlay opacity</label>
      </OverlayAlphaSliderContainer>
      <ImagesStack overlayOpacity={overlayOpacity}>
        <DiffImageWrapper data-img-type="before">
          <img src={images[0]} />
        </DiffImageWrapper>
        <DiffImageWrapper data-img-type="after">
          <img src={images[1]} />
        </DiffImageWrapper>
      </ImagesStack>
    </DiffImageTab>
  )
}
