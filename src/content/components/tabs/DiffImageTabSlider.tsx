import { styled } from '@linaria/react'
import { useState } from 'preact/hooks'
import {
  DiffImageTab,
  DiffImageWrapper,
  ImageCaption,
  ImageStack,
  ImageStackAfterImageWrapper,
  ImageStackBeforeImageWrapper,
} from './DiffImageTab'

type DiffImageTabSliderProps = {
  images: [string, string]
}

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const SliderLine = styled('div')<{ x: number }>`
  position: absolute;
  left: ${({ x }) => `${x}%`};
  top: 0;
  height: 100%;
  width: 2px;
  opacity: 0.5;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  z-index: 10;
`

export const DiffImageTabSlider = ({ images }: DiffImageTabSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50)

  const handleMouseMove = (event: MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = event.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  return (
    <DiffImageTab data-diff-type="slider">
      <SliderContainer>
        <ImageStack onMouseMove={handleMouseMove}>
          <ImageStackBeforeImageWrapper>
            <DiffImageWrapper data-img-type="before">
              <ImageCaption>Before</ImageCaption>
              <img src={images[0]} />
            </DiffImageWrapper>
          </ImageStackBeforeImageWrapper>

          <ImageStackAfterImageWrapper clipX={sliderPosition}>
            <DiffImageWrapper data-img-type="after">
              <ImageCaption>After</ImageCaption>
              <img src={images[1]} />
            </DiffImageWrapper>
          </ImageStackAfterImageWrapper>

          <SliderLine x={sliderPosition} />
        </ImageStack>
      </SliderContainer>
    </DiffImageTab>
  )
}
