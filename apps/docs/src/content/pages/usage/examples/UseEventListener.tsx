import { useEventListener } from '@orangesys/ui'
import { useState } from 'react'

export default function Janela() {
  const [largura, setLargura] = useState(() => window.innerWidth)
  const [rolagem, setRolagem] = useState(() => Math.round(window.scrollY))

  useEventListener('resize', () => setLargura(window.innerWidth))
  useEventListener('scroll', () => setRolagem(Math.round(window.scrollY)), undefined, {
    passive: true,
  })

  return (
    <dl className="guide-kv">
      <dt>window.innerWidth</dt>
      <dd>{largura}px</dd>
      <dt>window.scrollY</dt>
      <dd>{rolagem}px</dd>
    </dl>
  )
}
