import { styled } from '@linaria/react'
import { useEffect, useRef, useState } from 'react'
import { DEFAULT_SELECTED_TAB, TAB_LABELS } from '../../constants'
import { calculateImageDiff, ImageDiffData } from '../../diff/diff-canvas'
import { DiffImageTabDifference } from './DiffImageTabDifference'
import { DiffImageTabOverlay } from './DiffImageTabOverlay'
import { DiffImageTabSlider } from './DiffImageTabSlider'
import { TabBar } from './TabBar'
import { DiffImageTab, DiffImageWrapper, ImageCaption } from './DiffImageTab'
import { DiffImageStats } from './DiffImageStats'

const TabContainer = styled('div')<{ visible: boolean }>`
  width: 100%;
  display: ${({ visible }) => (visible ? 'auto' : 'none')};
`

type ImageDiffTabsProps = {
  images: [string, string]
}

const TAB_BAR_OPTIONS = TAB_LABELS.map(([id, label]) => ({ id, label }))

export const DiffImageTabs = ({ images }: ImageDiffTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(DEFAULT_SELECTED_TAB)

  const imageBeforeRef = useRef<HTMLImageElement | null>(null)
  const imageAfterRef = useRef<HTMLImageElement | null>(null)

  const [imageDiffData, setImageDiffData] = useState<
    ImageDiffData | undefined
  >()

  useEffect(() => {
    async function prepareImageDiffData() {
      if (!imageBeforeRef.current || !imageAfterRef.current) {
        return
      }

      setImageDiffData(undefined)
      setImageDiffData(
        await calculateImageDiff(imageBeforeRef.current, imageAfterRef.current),
      )
    }

    prepareImageDiffData()
  }, [images])

  return (
    <>
      <TabBar
        options={TAB_BAR_OPTIONS}
        defaultTab={DEFAULT_SELECTED_TAB}
        disabledTabs={
          imageDiffData?.getDiffImageData
            ? []
            : ['tab-difference', 'tab-overlay', 'tab-slider']
        }
        onChange={(tabId) => {
          setSelectedTab(tabId)
        }}
      />

      <TabContainer visible={selectedTab === 'tab-side-by-side'}>
        <DiffImageTab data-diff-type="side-by-side">
          <DiffImageWrapper data-img-type="before">
            <ImageCaption>Before</ImageCaption>
            <img src={images[0]} ref={imageBeforeRef} />
          </DiffImageWrapper>
          <DiffImageWrapper data-img-type="after">
            <ImageCaption>After</ImageCaption>
            <img src={images[1]} ref={imageAfterRef} />
          </DiffImageWrapper>
        </DiffImageTab>
      </TabContainer>

      <TabContainer visible={selectedTab === 'tab-difference'}>
        {imageDiffData?.getDiffImageData ? (
          <DiffImageTabDifference imageDiffData={imageDiffData} />
        ) : null}
      </TabContainer>

      <TabContainer visible={selectedTab === 'tab-overlay'}>
        <DiffImageTabOverlay images={images} />
      </TabContainer>

      <TabContainer visible={selectedTab === 'tab-slider'}>
        <DiffImageTabSlider images={images} />
      </TabContainer>

      {imageDiffData && <DiffImageStats imageDiffData={imageDiffData} />}
    </>
  )
}
