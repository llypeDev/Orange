import { MultiSelect } from '@orange/ui'

const habilidades = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'css', label: 'CSS' },
  { value: 'a11y', label: 'Acessibilidade', description: 'WCAG, WAI-ARIA e leitores de tela' },
  { value: 'testes', label: 'Testes automatizados' },
  { value: 'figma', label: 'Figma' },
  { value: 'sql', label: 'SQL' },
  { value: 'go', label: 'Go', description: 'Sem vagas no momento', disabled: true },
]

export default function Basic() {
  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      <MultiSelect
        label="Habilidades"
        description="Usadas para recomendar vagas."
        placeholder="Buscar habilidades"
        options={habilidades}
        defaultValue={['react', 'a11y']}
        name="habilidades"
      />
    </div>
  )
}
