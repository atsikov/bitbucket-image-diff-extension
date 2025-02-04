type DiffImageTabSideBySideProps = {
  images: [string, string]
}

export const DiffImageTabSideBySide = ({
  images,
}: DiffImageTabSideBySideProps) => {
  return <div>{images.join(',')}</div>
}
