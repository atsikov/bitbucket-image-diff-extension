import '@testing-library/jest-dom'

import { ImageData } from 'canvas'

// @ts-expect-error
global.ImageData = ImageData
