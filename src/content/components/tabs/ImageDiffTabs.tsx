import { DEFAULT_SELECTED_TAB, TAB_LABELS } from '../../constants'
import { TabBar } from './TabBar'

type ImageDiffTabsProps = {
  images: [string, string]
}

const TAB_BAR_OPTIONS = TAB_LABELS.map(([id, label]) => ({ id, label }))

export const ImageDiffTabs = ({ images }: ImageDiffTabsProps) => {
  return (
    <>
      <TabBar
        options={TAB_BAR_OPTIONS}
        defaultTab={DEFAULT_SELECTED_TAB}
        onChange={(tabId) => {
          console.log(tabId)
        }}
      />
      <div>{images.join(',')}</div>
    </>
  )
}
