import { fireEvent, screen } from '@testing-library/dom'
import { TAB_CONTAINER_IDS } from '../content/constants'
import { renderOverlay } from '../content/overlay'

it('should toggle diff tabs', () => {
  renderOverlay(
    document.body,
    './__fixtures__/image-before.png',
    './__fixtures__/image-before.png',
  )

  expect(screen.getByText('Side by side')).not.toBeNull()
  expect(screen.getByText('Difference')).not.toBeNull()
  expect(screen.getByText('Overlay')).not.toBeNull()

  fireEvent.click(screen.getByText('Side by side'))

  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.sideBySide}`)
      ?.classList.contains('hidden'),
  ).toBe(false)
  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.difference}`)
      ?.classList.contains('hidden'),
  ).toBe(true)
  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.overlay}`)
      ?.classList.contains('hidden'),
  ).toBe(true)

  fireEvent.click(screen.getByText('Difference'))

  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.sideBySide}`)
      ?.classList.contains('hidden'),
  ).toBe(true)
  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.difference}`)
      ?.classList.contains('hidden'),
  ).toBe(false)
  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.overlay}`)
      ?.classList.contains('hidden'),
  ).toBe(true)

  fireEvent.click(screen.getByText('Overlay'))

  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.sideBySide}`)
      ?.classList.contains('hidden'),
  ).toBe(true)
  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.difference}`)
      ?.classList.contains('hidden'),
  ).toBe(true)
  expect(
    document
      .querySelector(`#${TAB_CONTAINER_IDS.overlay}`)
      ?.classList.contains('hidden'),
  ).toBe(false)
})
