type DiffImageTabDifferenceProps = {
  images: [string, string]
}

export const DiffImageTabDifference = ({
  images,
}: DiffImageTabDifferenceProps) => {
  return <div>{images.join(',')}</div>
}
