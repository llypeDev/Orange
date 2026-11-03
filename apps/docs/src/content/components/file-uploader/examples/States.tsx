import { FileUploader, type FileUploaderItem } from '@orange/ui'

const arquivo = (nome: string, bytes: number, tipo: string) => {
  const file = new File([''], nome, { type: tipo })
  Object.defineProperty(file, 'size', { value: bytes })
  return file
}

const enviados: FileUploaderItem[] = [
  { id: '1', file: arquivo('balanco-2025.pdf', 2_400_000, 'application/pdf'), status: 'success' },
  {
    id: '2',
    file: arquivo('extrato-outubro.pdf', 860_000, 'application/pdf'),
    status: 'uploading',
    progress: 48,
  },
  {
    id: '3',
    file: arquivo('planilha-custos.numbers', 1_200_000, 'application/octet-stream'),
    status: 'error',
    error: 'Tipo de arquivo não aceito',
  },
]

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 32, width: '100%' }}>
      <FileUploader
        label="Documentos contábeis"
        description="PDF, até 5 MB cada."
        accept=".pdf"
        multiple
        defaultValue={enviados}
      />
      <FileUploader
        label="Nota fiscal"
        required
        error="Envie a nota fiscal para concluir o reembolso."
      />
      <FileUploader
        label="Anexos (bloqueado)"
        description="Disponível após aprovar o pedido."
        disabled
      />
    </div>
  )
}
