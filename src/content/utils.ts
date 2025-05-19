export function assertCanvasContext(
  context: CanvasRenderingContext2D | null,
): asserts context {
  if (!context) {
    throw new Error('Failed to get canvas context')
  }
}
