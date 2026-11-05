import { ColorField } from '@orangesys/ui'

const etiquetas = [
  { value: '#f58549', label: 'Laranja' },
  { value: '#e8c15a', label: 'Âmbar' },
  { value: '#7fb236', label: 'Verde' },
  { value: '#4a66d4', label: 'Azul' },
  { value: '#ef6a5a', label: 'Vermelho' },
  { value: '#75757f', label: 'Grafite' },
]

export default function Swatches() {
  return (
    <ColorField
      label="Cor da etiqueta"
      description="Escolha uma cor sugerida ou digite um hexadecimal."
      swatches={etiquetas}
      defaultValue="#7fb236"
    />
  )
}
