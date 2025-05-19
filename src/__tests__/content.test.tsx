import { screen, within } from '@testing-library/dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { readFileSync } from 'fs'
import { join, resolve, sep } from 'path'
import { Content } from '../content/components/Content'

function setDocumentContent() {
  const contents = readFileSync(
    join(__dirname, './__fixtures__/entry.html'),
  ).toString()

  const imagesPath = resolve(__dirname, '__fixtures__/images/')
  document.body.innerHTML = contents.replace(
    / src="\.\/images\//g,
    ` src="file://${imagesPath}${sep}`,
  )
}

beforeEach(() => {
  setDocumentContent()
})

describe('toggle overlay', () => {
  it('should open diff overlay when image is clicked', async () => {
    render(<Content />)

    expect(screen.queryByText('Side by side')).not.toBeInTheDocument()

    const image = document.querySelector('img')!
    screen.debug(image)

    await userEvent.click(image)

    expect(screen.getByText('Side by side')).toBeInTheDocument()
    expect(screen.getByText('Difference')).toBeInTheDocument()
    expect(screen.getByText('Overlay')).toBeInTheDocument()

    await screen.findByText('Before: 400 x 896')
    screen.getByText('After: 400 x 896')
    screen.getByText('517 different pixels (0.14%)')
  })

  it('should close overlay on esc button press', async () => {
    render(<Content />)

    expect(screen.queryByText('Side by side')).not.toBeInTheDocument()

    const image = document.querySelector('img')!

    await userEvent.click(image)

    expect(screen.getByText('Side by side')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByText('Side by side')).not.toBeInTheDocument()
  })

  it('should close overlay on Close button click', async () => {
    render(<Content />)

    expect(screen.queryByText('Side by side')).not.toBeInTheDocument()

    const image = document.querySelector('img')!

    await userEvent.click(image)

    expect(screen.getByText('Side by side')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Close image diff' }),
    )

    expect(screen.queryByText('Side by side')).not.toBeInTheDocument()
  })
})
