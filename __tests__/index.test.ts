import { readFileSync } from 'fs'
import { join } from 'path'

function setDocumentContent(fixturePath: string) {
  const contents = readFileSync(join(__dirname, fixturePath)).toString()

  document.body.innerHTML = contents
}

beforeEach(() => {
  setDocumentContent('./__fixtures__/entry.html')
})

it('should find images', () => {
  expect(
    document.querySelectorAll(
      '[data-testid="file-content"] [data-testid="image-diff"] img',
    ),
  ).toHaveLength(2)
})
