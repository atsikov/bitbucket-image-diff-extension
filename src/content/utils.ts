export const queryById = <T extends Element>(
  container: Document | HTMLElement,
  id: string,
) => container.querySelector<T>(`#${id}`)

export function assertCanvasContext(
  context: CanvasRenderingContext2D | null,
): asserts context {
  if (!context) {
    throw new Error('Failed to get canvas context')
  }
}
