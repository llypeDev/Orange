import { BackToTop } from '@orangesys/ui'
import { useRef } from 'react'

const sections = ['Introdução', 'Instalação', 'Configuração', 'Temas', 'Componentes', 'Publicação']

export default function WithLabel() {
  const articleRef = useRef<HTMLElement>(null)
  return (
    <article
      ref={articleRef}
      tabIndex={0}
      aria-label="Guia de instalação"
      style={{ width: '100%', height: 300, overflow: 'auto', border: '1px solid var(--or-color-border)', padding: '0 20px 16px' }}
    >
      {sections.map((title) => (
        <section key={title}>
          <h4 style={{ margin: '20px 0 8px' }}>{title}</h4>
          <p style={{ margin: 0, color: 'var(--or-color-text-muted)', fontSize: 14 }}>
            Siga os passos desta seção antes de avançar. Cada etapa depende da configuração anterior e leva poucos minutos.
          </p>
        </section>
      ))}
      <BackToTop scrollContainer={articleRef} focusTarget={articleRef} position="sticky" threshold={120} showLabel />
    </article>
  )
}
