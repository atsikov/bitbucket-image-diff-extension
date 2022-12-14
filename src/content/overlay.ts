import diffStyles from '../styles/image-diff.pcss'
import tabsStyles from '../styles/tabs.pcss'

import {
  DEFAULT_SELECTED_TAB,
  ElementId,
  TAB_CONTAINERS_BY_TAB,
  TAB_LABELS,
  TABS_RADIO_GROUP_NAME,
  TAB_CONTAINER_IDS,
} from './constants'
import { TabContainerId } from './types'

const TAB_CONTAINER_CLASSNAMES: Record<TabContainerId, string> = {
  'diff-difference': diffStyles['diff-difference'],
  'diff-overlay': diffStyles['diff-overlay'],
  'diff-side-by-side': '',
}

const CLASSNAMES_IMAGE_CONTAINER_BEFORE = `${diffStyles['diff-item-container']} ${diffStyles['diff-item-before']}`
const CLASSNAMES_IMAGE_CONTAINER_AFTER = `${diffStyles['diff-item-container']} ${diffStyles['diff-item-after']}`

function createTabs(container: HTMLElement) {
  const tabsContainer = container.querySelector(`#${ElementId.Tabs}`)
  if (!tabsContainer) {
    throw new Error('Cannot find container to inject tab bar')
  }

  for (const [tabId, tabLabel] of TAB_LABELS) {
    const tabInputElement = container.ownerDocument.createElement('input')
    tabInputElement.type = 'radio'
    tabInputElement.id = tabId
    tabInputElement.name = TABS_RADIO_GROUP_NAME
    tabInputElement.checked = tabId === DEFAULT_SELECTED_TAB

    tabInputElement.addEventListener('click', () => {
      Object.values(TAB_CONTAINER_IDS).forEach((id) => {
        container
          .querySelector(`#${id}`)
          ?.classList.toggle(
            diffStyles.hidden,
            TAB_CONTAINERS_BY_TAB[tabId] !== id,
          )
      })
    })

    const tabLabelElement = container.ownerDocument.createElement('label')
    tabLabelElement.className = tabsStyles.tab
    tabLabelElement.setAttribute('for', tabId)
    tabLabelElement.innerHTML = tabLabel

    tabsContainer.append(tabInputElement, tabLabelElement)
  }

  const selectedTabBackElement = container.ownerDocument.createElement('span')
  selectedTabBackElement.className = tabsStyles.glider
  tabsContainer.appendChild(selectedTabBackElement)
}

function getDiffPanelClassNames(containerId: TabContainerId) {
  return [
    diffStyles['diff-panel'],
    TAB_CONTAINER_CLASSNAMES[containerId],
    containerId !== TAB_CONTAINERS_BY_TAB[DEFAULT_SELECTED_TAB] &&
      diffStyles.hidden,
  ]
    .filter(Boolean)
    .join(' ')
}

export function renderOverlay(
  container: HTMLElement,
  imageBeforeUrl: string,
  imageAfterUrl: string,
) {
  container.innerHTML = `<div class="${diffStyles['diff-backdrop']}">
    <div class="${diffStyles['diff-container']}">
      <div class="${tabsStyles['image-diff-tabs']}" id="${ElementId.Tabs}">
      </div>

      <div class="${getDiffPanelClassNames('diff-side-by-side')}" id="${
    TAB_CONTAINER_IDS.sideBySide
  }">
        <div class="${CLASSNAMES_IMAGE_CONTAINER_BEFORE}">
          <div>BEFORE</div>
          <img class="${
            diffStyles['diff-item-image']
          }" src="${imageBeforeUrl}" />
        </div>
        <div class="${CLASSNAMES_IMAGE_CONTAINER_AFTER}">
          <div>AFTER</div>
          <img class="${
            diffStyles['diff-item-image']
          }" src="${imageAfterUrl}" />
        </div>
      </div>

      <div class="${getDiffPanelClassNames('diff-difference')}" id="${
    TAB_CONTAINER_IDS.difference
  }">
        <div class="${CLASSNAMES_IMAGE_CONTAINER_BEFORE}">
          <canvas id="${ElementId.DifferenceImageCanvas}" class="${
    diffStyles['diff-item-image']
  }" />
        </div>
      </div>

      <div class="${getDiffPanelClassNames('diff-overlay')}" id="${
    TAB_CONTAINER_IDS.overlay
  }">
        <div class="${CLASSNAMES_IMAGE_CONTAINER_BEFORE}">
          <img class="${
            diffStyles['diff-item-image']
          }" src="${imageBeforeUrl}" />
        </div>
        <div class="${CLASSNAMES_IMAGE_CONTAINER_AFTER}">
          <div>
            <input
              type="range"
              id="${ElementId.OverlayOpacityInput}"
              name="${ElementId.OverlayOpacityInput}"
              min="0"
              max="1"
              value="0.5"
              step="0.01"
            />
            <label for="${
              ElementId.OverlayOpacityInput
            }">Overlay opacity</label>
          </div>
          <img class="${
            diffStyles['diff-item-image']
          }" src="${imageAfterUrl}" />
        </div>
      </div>
    </div>
  </div>`

  createTabs(container)
}
