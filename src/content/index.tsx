import { render } from 'preact'
import { Content } from './components/Content'

const root = document.createElement('div')
document.body.appendChild(root)

render(<Content />, root)
