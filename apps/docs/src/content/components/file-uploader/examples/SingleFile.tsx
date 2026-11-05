import { FileUploader } from '@orangesys/ui'

export default function SingleFile() {
  return (
    <FileUploader
      label="Contrato social"
      description="Um único arquivo PDF de até 10 MB. Enviar outro substitui o anterior."
      accept=".pdf"
      maxSize={10 * 1024 * 1024}
      required
      name="contrato"
    />
  )
}
