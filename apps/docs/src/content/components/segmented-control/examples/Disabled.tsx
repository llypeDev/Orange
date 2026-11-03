import { SegmentedControl } from '@orange/ui'

export default function Disabled() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <SegmentedControl
        label="Prioridade do chamado"
        defaultValue="normal"
        options={[
          { value: 'low', label: 'Baixa' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'Alta' },
          // Disponível apenas no plano Empresa.
          { value: 'urgent', label: 'Urgente', disabled: true },
        ]}
      />
      <SegmentedControl
        label="Formato do arquivo"
        disabled
        defaultValue="csv"
        options={[
          { value: 'csv', label: 'CSV' },
          { value: 'xlsx', label: 'XLSX' },
          { value: 'pdf', label: 'PDF' },
        ]}
      />
    </div>
  )
}
