import {
  DiffImageTab,
  DiffImageWrapper,
  ImageCaption,
  ImageStack,
  ImageStackAfterImageWrapper,
  ImageStackBeforeImageWrapper,
  OverlayAlphaSliderContainer,
} from './DiffImageTab'
import { useState } from 'preact/hooks'

type DiffImageTabOverlayProps = {
  images: [string, string]
}

export const DiffImageTabOverlay = ({ images }: DiffImageTabOverlayProps) => {
  const [overlayOpacity, setOverlayOpacity] = useState(0.5)

  return (
    <DiffImageTab data-diff-type="overlay">
      <OverlayAlphaSliderContainer>
        <label for="overlay-diff-alpha-slider">Overlay opacity</label>
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
      </OverlayAlphaSliderContainer>

      <ImageStack>
        <ImageStackBeforeImageWrapper>
          <DiffImageWrapper data-img-type="before">
            <ImageCaption />
            <img src={images[0]} />
          </DiffImageWrapper>
        </ImageStackBeforeImageWrapper>

        <ImageStackAfterImageWrapper overlayOpacity={overlayOpacity}>
          <DiffImageWrapper data-img-type="after">
            <ImageCaption />
            <img src={images[1]} />
          </DiffImageWrapper>
        </ImageStackAfterImageWrapper>
      </ImageStack>
    </DiffImageTab>
  )
}
