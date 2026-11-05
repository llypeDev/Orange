import { ExpandableText } from '@orangesys/ui'

const notas = [
  {
    versao: 'v3.2.0',
    texto:
      'Adicionamos o componente TreeView com seleção múltipla, busca por digitação e expansão controlada. O Combobox agora anuncia a quantidade de resultados e a documentação ganhou exemplos em inglês para todos os componentes de formulário.',
  },
  { versao: 'v3.1.1', texto: 'Correção no foco do Modal ao fechar com Escape.' },
]

export default function CustomLabels() {
  return (
    <ul style={{ display: 'grid', gap: 16, margin: 0, padding: 0, listStyle: 'none', maxWidth: 440 }}>
      {notas.map((nota) => (
        <li key={nota.versao}>
          <strong style={{ display: 'block', marginBottom: 4 }}>{nota.versao}</strong>
          <ExpandableText
            lines={2}
            showMoreLabel={`Ler notas da ${nota.versao}`}
            showLessLabel={`Recolher notas da ${nota.versao}`}
          >
            {nota.texto}
          </ExpandableText>
        </li>
      ))}
    </ul>
  )
}
