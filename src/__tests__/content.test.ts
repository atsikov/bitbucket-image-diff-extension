import { fireEvent, screen } from '@testing-library/dom'
import { readFileSync } from 'fs'
import { join } from 'path'
import { createOverlayContainer } from '../content/content'

function setDocumentContent(fixturePath: string) {
  const contents = readFileSync(join(__dirname, fixturePath)).toString()

  document.body.innerHTML = contents
}

beforeEach(() => {
  setDocumentContent('./__fixtures__/entry.html')
})

it('should open diff overlay when image is clicked', () => {
  createOverlayContainer(document.body)

  const container = screen.getByTestId('image-diff-extension-container')
  expect(screen.queryByText('Side by side')).toBeNull()
  expect(container.style.display).toBe('none')

  const image = document.querySelector('img')!

  fireEvent.click(image)

  expect(container.style.display).toBe('block')
  expect(screen.getByText('Side by side')).not.toBeNull()

  fireEvent.keyPress(window, { key: 'Escape' })

  expect(container.style.display).toBe('none')
  expect(screen.queryByText('Side by side')).toBeNull()
})
