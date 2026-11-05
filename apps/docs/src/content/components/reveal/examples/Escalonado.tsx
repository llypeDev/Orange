import { Icon, Reveal } from '@orangesys/ui'

const recursos = [
  { icone: 'layers', titulo: 'Tokens', texto: 'Cor, tipo, espaço e movimento.' },
  { icone: 'grid', titulo: 'Fundamentos', texto: 'Grid, ícones e tipografia.' },
  { icone: 'code', titulo: 'Componentes', texto: 'React acessível e testado.' },
  { icone: 'accessibility', titulo: 'Acessibilidade', texto: 'WCAG 2.2 AA por padrão.' },
] as const

export default function Escalonado() {
  return (
    // stagger: cada filho direto entra --or-stagger (80ms) depois do anterior
    <Reveal
      as="ul"
      stagger
      className="guide-reveal-grid guide-reveal-grid--flush guide-reveal-list"
    >
      {recursos.map((r) => (
        <li key={r.titulo} className="guide-reveal-card">
          <Icon name={r.icone} />
          <strong>{r.titulo}</strong>
          <span>{r.texto}</span>
        </li>
      ))}
    </Reveal>
  )
}
