import { styled } from '@linaria/react'
import { useState } from 'preact/hooks'
import { DiffImageTab, DiffImageWrapper } from './DiffImageTab'
import { ImageCaption } from './ImageCaption'

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

const ImageStack = styled.div`
  position: relative;
  display: inline-block;
  cursor: col-resize;
  width: 100%;
`

const BeforeImageWrapper = styled.div`
  position: relative;
`

const AfterImageWrapper = styled('div')<{ clipX: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  clip-path: ${({ clipX }) => `inset(0 ${100 - clipX}% 0 0)`};
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
          <BeforeImageWrapper>
            <DiffImageWrapper data-img-type="before">
              <ImageCaption>Before</ImageCaption>
              <img src={images[0]} />
            </DiffImageWrapper>
          </BeforeImageWrapper>

          <AfterImageWrapper clipX={sliderPosition}>
            <DiffImageWrapper data-img-type="after">
              <ImageCaption>After</ImageCaption>
              <img src={images[1]} />
            </DiffImageWrapper>
          </AfterImageWrapper>

          <SliderLine x={sliderPosition} />
        </ImageStack>
      </SliderContainer>
    </DiffImageTab>
  )
}
