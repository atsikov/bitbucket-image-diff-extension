import { useEffect, useRef } from 'preact/hooks'
import { ImageDiffData } from '../../diff/diff-canvas'
import { assertCanvasContext } from '../..//utils'
import { DiffImageTab, DiffImageWrapper, ImageCaption } from './DiffImageTab'

type DiffImageTabDifferenceProps = {
  imageDiffData: Extract<ImageDiffData, { diffImage: ImageData }>
}

export const DiffImageTabDifference = ({
  imageDiffData,
}: DiffImageTabDifferenceProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    canvas.width = imageDiffData.diffImage.width
    canvas.height = imageDiffData.diffImage.height

    const canvasContext = canvas.getContext('2d') ?? null
    assertCanvasContext(canvasContext)

    canvasContext.putImageData(imageDiffData.diffImage, 0, 0)
  }, [imageDiffData])

  return (
    <DiffImageTab data-diff-type="difference">
      <DiffImageWrapper data-img-type="before">
        <ImageCaption />
        <canvas ref={canvasRef} />
      </DiffImageWrapper>
    </DiffImageTab>
  )
}
