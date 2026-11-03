import { TableOfContents } from '@orange/ui'
import { useCallback, useState } from 'react'

export default function ThisPage() {
  // Coleta os <h2> do <main> desta documentação e acompanha a rolagem da janela.
  const [main, setMain] = useState<HTMLElement | null>(null)
  const wrapperRef = useCallback((el: HTMLDivElement | null) => setMain(el?.closest('main') ?? null), [])
  return (
    <div ref={wrapperRef} style={{ width: 240 }}>
      <TableOfContents container={main} headingSelector="h2[id]" title="Seções desta página" />
    </div>
  )
}
