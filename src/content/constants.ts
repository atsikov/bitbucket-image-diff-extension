import { TabContainerId, TabId } from './types'

export const PR_CHANGED_IMAGE_SELECTOR =
  '[data-testid="file-content"] [data-testid="image-diff"] img'

export const DEFAULT_SELECTED_TAB: TabId = 'tab-side-by-side'

export const TABS_RADIO_GROUP_NAME = 'diff-tabs-group'

export const TAB_LABELS: [TabId, string][] = [
  ['tab-side-by-side', 'Side by side'],
  ['tab-difference', 'Difference'],
  ['tab-overlay', 'Overlay'],
]

type TabContainerIdKey = 'sideBySide' | 'difference' | 'overlay'

export const TAB_CONTAINER_IDS: Record<TabContainerIdKey, TabContainerId> = {
  sideBySide: 'diff-side-by-side',
  difference: 'diff-difference',
  overlay: 'diff-overlay',
}

export const TAB_CONTAINERS_BY_TAB: Record<TabId, TabContainerId> = {
  'tab-side-by-side': 'diff-side-by-side',
  'tab-difference': 'diff-difference',
  'tab-overlay': 'diff-overlay',
}

export enum ElementId {
  DiffOverlayContainer = 'image-diff-extension-container',
  Tabs = 'image-diff-tabs',
  OverlayOpacityInput = 'overlay-opacity-input',
  DifferenceImageCanvas = 'diff-difference-image-canvas',
  ImageBefore = 'image-before',
  ImageAfter = 'image-after',
  ImageDiffStats = 'image-diff-stats',
  ImageDiffStatsBefore = 'image-diff-stats-before',
  ImageDiffStatsAfter = 'image-diff-stats-after',
  ImageDiffStatsRatio = 'image-diff-stats-ratio',
}
