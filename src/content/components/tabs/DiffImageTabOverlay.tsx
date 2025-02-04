type DiffImageTabOverlayProps = {
  images: [string, string]
}

export const DiffImageTabOverlay = ({ images }: DiffImageTabOverlayProps) => {
  return <div>{images.join(',')}</div>
}
