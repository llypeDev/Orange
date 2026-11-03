import { Paginator } from '@orange/ui'

export default function FirstLast() {
  return (
    <Paginator
      totalPages={50}
      defaultPage={25}
      siblingCount={2}
      boundaryCount={1}
      showFirstLast
      aria-label="Paginação do catálogo"
    />
  )
}
