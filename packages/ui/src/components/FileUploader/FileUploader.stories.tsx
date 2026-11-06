import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useRef, useState } from 'react'
import { FileUploader, type FileUploaderItem } from './FileUploader'

const meta = {
  title: 'Componentes/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Envio de arquivos com área de arrastar e soltar, botão nativo que aciona um `<input type="file">` acessível, validação de `accept`, `maxSize` e `maxFiles`, lista com progresso/status e anúncios em região live.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'change' },
    onFilesAdded: { action: 'filesAdded' },
  },
  args: {
    label: 'Anexos',
    description: 'PDF, PNG ou JPG, até 5 MB cada.',
    accept: '.pdf,image/png,image/jpeg',
    maxSize: 5 * 1024 * 1024,
    multiple: true,
  },
} satisfies Meta<typeof FileUploader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleFile: Story = {
  args: {
    label: 'Contrato assinado',
    description: 'Apenas PDF, até 10 MB.',
    multiple: false,
    accept: '.pdf',
    maxSize: 10 * 1024 * 1024,
  },
}

export const MaxFiles: Story = {
  args: { label: 'Fotos do imóvel', description: 'Até 3 imagens.', accept: 'image/*', maxFiles: 3 },
}

const sample = (name: string, size: number, type: string) => {
  const file = new File(['x'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

export const UploadStates: Story = {
  args: {
    defaultValue: [
      {
        id: 'a',
        file: sample('relatorio-q3.pdf', 1_800_000, 'application/pdf'),
        status: 'uploading',
        progress: 64,
      },
      { id: 'b', file: sample('logo-orange.png', 240_000, 'image/png'), status: 'success' },
      {
        id: 'c',
        file: sample('apresentacao.key', 12_000_000, 'application/octet-stream'),
        status: 'error',
        error: 'Tipo de arquivo não aceito',
      },
    ],
  },
}

export const SimulatedUpload: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploaderItem[]>([])
    const timers = useRef<number[]>([])
    useEffect(() => () => timers.current.forEach(clearInterval), [])
    const start = (added: FileUploaderItem[]) => {
      added.forEach((item) => {
        const timer = window.setInterval(() => {
          setItems((list) =>
            list.map((i) => {
              if (i.id !== item.id) return i
              const progress = Math.min(100, (i.progress ?? 0) + 20)
              if (progress === 100) clearInterval(timer)
              return { ...i, progress, status: progress === 100 ? 'success' : 'uploading' }
            }),
          )
        }, 400)
        timers.current.push(timer)
      })
    }
    return <FileUploader {...args} value={items} onChange={setItems} onFilesAdded={start} />
  },
}

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <FileUploader {...args} label="Obrigatório" required />
      <FileUploader {...args} label="Com erro" error="Envie ao menos um comprovante" />
      <FileUploader {...args} label="Desabilitado" disabled />
    </div>
  ),
}
