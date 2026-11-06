import { Stepper } from '@orangesys/ui'

export default function WithError() {
  return (
    <Stepper
      aria-label="Verificação de identidade"
      step={1}
      steps={[
        { label: 'Dados pessoais', description: 'Nome e data de nascimento' },
        { label: 'Documento', description: 'Foto ilegível — envie novamente', status: 'error' },
        { label: 'Selfie', description: 'Foto do rosto' },
        { label: 'Análise', description: 'Até 2 dias úteis' },
      ]}
    />
  )
}
