import { useState } from 'react'
import { DEFAULT_SELECTED_TAB, TAB_LABELS } from '../../constants'
import { throwNotReachable } from '../../../utils'
import { DiffImageTabDifference } from './DiffImageTabDifference'
import { DiffImageTabOverlay } from './DiffImageTabOverlay'
import { DiffImageTabSideBySide } from './DiffImageTabSideBySide'
import { TabBar } from './TabBar'

type ImageDiffTabsProps = {
  images: [string, string]
}

const TAB_BAR_OPTIONS = TAB_LABELS.map(([id, label]) => ({ id, label }))

export const ImageDiffTabs = ({ images }: ImageDiffTabsProps) => {
  const [selectedTab, setSelectedTab] = useState(DEFAULT_SELECTED_TAB)

  return (
    <>
      <TabBar
        options={TAB_BAR_OPTIONS}
        defaultTab={DEFAULT_SELECTED_TAB}
        onChange={(tabId) => {
          setSelectedTab(tabId)
        }}
      />
      {(() => {
        switch (selectedTab) {
          case 'tab-side-by-side':
            return <DiffImageTabSideBySide images={images} />
          case 'tab-difference':
            return <DiffImageTabDifference images={images} />
          case 'tab-overlay':
            return <DiffImageTabOverlay images={images} />
          default:
            return throwNotReachable(selectedTab)
        }
      })()}
    </>
  )
}
