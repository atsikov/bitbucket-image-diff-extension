import { styled } from '@linaria/react'
import { ImageDiffData } from 'src/content/diff/diff-canvas'

const DiffImageStatsContainer = styled.div`
  background-color: rgb(244, 245, 247);
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 8px;
`

type DiffImageStatsProps = {
  imageDiffData: ImageDiffData
}

export const DiffImageStats = ({ imageDiffData }: DiffImageStatsProps) => {
  return (
    <DiffImageStatsContainer>
      <div>
        Before: {imageDiffData.sizeBefore.width} x{' '}
        {imageDiffData.sizeBefore.height}
      </div>
      <div>
        After: {imageDiffData.sizeAfter.width} x{' '}
        {imageDiffData.sizeAfter.height}
      </div>
      <div>
        {imageDiffData.diffImage
          ? `${imageDiffData.numDifferentPixels} different pixels (${(
              imageDiffData.differentPixelsRatio * 100
            ).toFixed(2)}%)`
          : 'Image size changed, diff is not available'}
      </div>
    </DiffImageStatsContainer>
  )
}
