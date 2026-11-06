import { Disclosure, Select, Stack } from '@orangesys/ui'

const setores = [
  { value: 'varejo', label: 'Varejo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'industria', label: 'Indústria' },
  { value: 'educacao', label: 'Educação' },
]

export default function WhyWeAsk() {
  return (
    <Stack gap={2} style={{ width: '100%', maxWidth: 360 }}>
      <Select
        label="Setor de atuação"
        placeholder="Selecione o setor"
        options={setores}
        name="setor"
      />
      <Disclosure label="Por que pedimos isso?" size="sm">
        Usamos o setor para sugerir modelos de relatório e integrações que outras empresas parecidas
        com a sua já usam. Essa informação não é compartilhada com terceiros.
      </Disclosure>
    </Stack>
  )
}
