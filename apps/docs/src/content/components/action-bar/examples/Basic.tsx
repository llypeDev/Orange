import { ActionBar, Button, CheckboxGroup, Icon } from '@orangesys/ui'
import { useState } from 'react'

const initialFiles = [
  { value: 'proposta', label: 'Proposta comercial.pdf' },
  { value: 'cronograma', label: 'Cronograma de entregas.xlsx' },
  { value: 'briefing', label: 'Briefing da campanha de verão.docx' },
  { value: 'logos', label: 'Logos aprovados.zip' },
]

export default function Basic() {
  const [files, setFiles] = useState(initialFiles)
  const [selected, setSelected] = useState<string[]>(['proposta', 'cronograma'])

  const remove = () => {
    setFiles((current) => current.filter((file) => !selected.includes(file.value)))
    setSelected([])
  }

  return (
    // portal={false}: a barra se prende a este contêiner posicionado, não à janela.
    // O padding embaixo reserva o espaço dela.
    <div style={{ position: 'relative', width: '100%', minHeight: 240, paddingBottom: 128 }}>
      <CheckboxGroup
        label="Arquivos do projeto"
        value={selected}
        onChange={setSelected}
        options={files}
      />
      {files.length === 0 && (
        <Button variant="outline" size="sm" onClick={() => setFiles(initialFiles)}>
          Restaurar arquivos
        </Button>
      )}
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        onDismiss={() => setSelected([])}
        portal={false}
      >
        <Button startIcon={<Icon name="download" />}>Baixar</Button>
        <Button startIcon={<Icon name="trash" />} onClick={remove}>
          Excluir
        </Button>
      </ActionBar>
    </div>
  )
}
