import { useEffect, useRef, useState } from 'preact/hooks'
import { ImageDiffData } from '../../diff/diff-canvas'
import { assertCanvasContext } from '../..//utils'
import {
  DiffImageTab,
  DiffImageWrapper,
  ImageCaption,
  OverlayAlphaSliderContainer,
} from './DiffImageTab'

type DiffImageTabDifferenceProps = {
  imageDiffData: Extract<ImageDiffData, { getDiffImageData: Function }>
}

export const DiffImageTabDifference = ({
  imageDiffData,
}: DiffImageTabDifferenceProps) => {
  const [amplificationFactor, setAmplificationFactor] = useState(120)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContextRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const diffImage = imageDiffData.getDiffImageData(amplificationFactor)
    canvas.width = diffImage.width
    canvas.height = diffImage.height

    const canvasContext =
      canvasContextRef.current ?? canvas.getContext('2d') ?? null
    canvasContextRef.current = canvasContext

    assertCanvasContext(canvasContext)

    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    canvasContext.putImageData(diffImage, 0, 0)
  }, [imageDiffData, amplificationFactor])

  return (
    <DiffImageTab data-diff-type="difference">
      <OverlayAlphaSliderContainer>
        <label for="difference-diff-amplify-slider">Amplification</label>
        <input
          type="range"
          id="difference-diff-amplify-slider"
          name="difference-diff-amplify-slider"
          min="120"
          max="255"
          step="1"
          value={amplificationFactor}
          onChange={(event) =>
            setAmplificationFactor(parseFloat(event.currentTarget.value))
          }
        />
      </OverlayAlphaSliderContainer>

      <DiffImageWrapper data-img-type="before">
        <ImageCaption />
        <canvas ref={canvasRef} />
      </DiffImageWrapper>
    </DiffImageTab>
  )
}
