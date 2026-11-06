import { FileUploader, type FileUploaderItem } from '@orangesys/ui'
import { useEffect, useRef, useState } from 'react'

export default function UploadProgress() {
  const [arquivos, setArquivos] = useState<FileUploaderItem[]>([])
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearInterval), [])

  // Simula o envio: troque pelo seu upload (fetch, S3, etc.) atualizando status e progresso.
  const enviar = (novos: FileUploaderItem[]) => {
    novos.forEach((item) => {
      const timer = window.setInterval(() => {
        setArquivos((lista) =>
          lista.map((atual) => {
            if (atual.id !== item.id) return atual
            const progress = Math.min(
              100,
              (atual.progress ?? 0) + 15 + Math.round(Math.random() * 15),
            )
            if (progress === 100) clearInterval(timer)
            const falhou = progress === 100 && atual.file.name.toLowerCase().includes('erro')
            return falhou
              ? { ...atual, progress, status: 'error', error: 'O servidor recusou o arquivo' }
              : { ...atual, progress, status: progress === 100 ? 'success' : 'uploading' }
          }),
        )
      }, 350)
      timers.current.push(timer)
    })
  }

  return (
    <FileUploader
      label="Fotos do imóvel"
      description="Até 6 imagens. Os arquivos são enviados assim que adicionados."
      accept="image/*"
      multiple
      maxFiles={6}
      value={arquivos}
      onChange={setArquivos}
      onFilesAdded={enviar}
    />
  )
}
