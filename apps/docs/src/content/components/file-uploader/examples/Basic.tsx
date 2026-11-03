import { FileUploader } from '@orange/ui'

export default function Basic() {
  return (
    <FileUploader
      label="Comprovantes de despesa"
      description="PDF, PNG ou JPG, até 5 MB cada."
      accept=".pdf,image/png,image/jpeg"
      maxSize={5 * 1024 * 1024}
      multiple
    />
  )
}
