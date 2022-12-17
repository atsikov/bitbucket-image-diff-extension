import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'fs'
import { join, resolve, sep } from 'path'
import { TAB_CONTAINER_IDS } from '../content/constants'
import { createOverlayContainer } from '../content/overlay/content'
import { queryById } from '../content/utils'

function setDocumentContent() {
  const contents = readFileSync(
    join(__dirname, './__fixtures__/entry.html'),
  ).toString()

  const imagesPath = resolve(__dirname, '__fixtures__/images/')
  document.body.innerHTML = contents.replace(
    / src="\.\/images\//g,
    ` src="file:///${imagesPath}${sep}`,
  )
}

beforeEach(() => {
  setDocumentContent()
})

describe('toggle overlay', () => {
  it('should open diff overlay when image is clicked', async () => {
    createOverlayContainer(document.body)

    const container = screen.getByTestId('image-diff-extension-container')
    expect(screen.queryByText('Side by side')).toBeNull()
    expect(container.style.display).toBe('none')

    const image = document.querySelector('img')!

    await userEvent.click(image)

    expect(container.style.display).toBe('block')

    expect(screen.getByText('Side by side')).not.toBeNull()
    expect(screen.getByText('Difference')).not.toBeNull()
    expect(screen.getByText('Overlay')).not.toBeNull()

    await screen.findByText('Before: 400 x 896')
    screen.getByText('After: 400 x 896')
    screen.getByText('517 different pixels (0.14%)')
  })

  it('should toggle overlay tabs', async () => {
    createOverlayContainer(document.body)

    const container = screen.getByTestId('image-diff-extension-container')
    expect(screen.queryByText('Side by side')).toBeNull()
    expect(container.style.display).toBe('none')

    const image = document.querySelector('img')!

    await userEvent.click(image)

    expect(container.style.display).toBe('block')

    expect(screen.getByText('Side by side')).not.toBeNull()
    expect(screen.getByText('Difference')).not.toBeNull()
    expect(screen.getByText('Overlay')).not.toBeNull()

    await userEvent.click(screen.getByText('Side by side'))

    expect(
      queryById(document, TAB_CONTAINER_IDS.sideBySide)?.classList.contains(
        'hidden',
      ),
    ).toBe(false)
    expect(
      queryById(document, TAB_CONTAINER_IDS.difference)?.classList.contains(
        'hidden',
      ),
    ).toBe(true)
    expect(
      queryById(document, TAB_CONTAINER_IDS.overlay)?.classList.contains(
        'hidden',
      ),
    ).toBe(true)

    await userEvent.click(screen.getByText('Difference'))

    expect(
      queryById(document, TAB_CONTAINER_IDS.sideBySide)?.classList.contains(
        'hidden',
      ),
    ).toBe(true)
    expect(
      queryById(document, TAB_CONTAINER_IDS.difference)?.classList.contains(
        'hidden',
      ),
    ).toBe(false)
    expect(
      queryById(document, TAB_CONTAINER_IDS.overlay)?.classList.contains(
        'hidden',
      ),
    ).toBe(true)

    await userEvent.click(screen.getByText('Overlay'))

    expect(
      queryById(document, TAB_CONTAINER_IDS.sideBySide)?.classList.contains(
        'hidden',
      ),
    ).toBe(true)
    expect(
      queryById(document, TAB_CONTAINER_IDS.difference)?.classList.contains(
        'hidden',
      ),
    ).toBe(true)
    expect(
      queryById(document, TAB_CONTAINER_IDS.overlay)?.classList.contains(
        'hidden',
      ),
    ).toBe(false)
  })

  it('should close overlay on esc button press', async () => {
    createOverlayContainer(document.body)

    const container = screen.getByTestId('image-diff-extension-container')
    expect(screen.queryByText('Side by side')).toBeNull()
    expect(container.style.display).toBe('none')

    const image = document.querySelector('img')!

    await userEvent.click(image)

    expect(container.style.display).toBe('block')
    expect(screen.getByText('Side by side')).not.toBeNull()

    await userEvent.keyboard('{Escape}')

    expect(container.style.display).toBe('none')
    expect(screen.queryByText('Side by side')).toBeNull()
  })
})
