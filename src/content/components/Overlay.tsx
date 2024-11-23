import { useRef } from 'preact/hooks'

type OverlayProps =
  | { open: false }
  | {
      open: true
      images: [string, string]
    }

export const Overlay = (props: OverlayProps) => {
  const images = useRef<[string, string] | undefined>()
  images.current = props.open ? props.images : images.current

  return <div>{images.current?.join(', ')}</div>
}
