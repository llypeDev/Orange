import { Button, Combobox, Stack, type ComboboxOption } from '@orangesys/ui'
import { useState } from 'react'

const fusos: ComboboxOption[] = [
  { value: 'America/Noronha', label: 'Fernando de Noronha', description: 'UTC−02:00' },
  { value: 'America/Sao_Paulo', label: 'Brasília', description: 'UTC−03:00' },
  { value: 'America/Manaus', label: 'Amazonas', description: 'UTC−04:00' },
  { value: 'America/Rio_Branco', label: 'Acre', description: 'UTC−05:00' },
  { value: 'Europe/Lisbon', label: 'Lisboa', description: 'UTC+00:00' },
  { value: 'America/New_York', label: 'Nova York', description: 'UTC−05:00', disabled: true },
]

export default function Controlled() {
  const [fuso, setFuso] = useState<string | null>('America/Sao_Paulo')

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 380 }}>
      <Combobox
        label="Fuso horário"
        options={fusos}
        value={fuso}
        onChange={(value) => setFuso(value)}
      />
      <p style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        Valor salvo: <code>{fuso ?? 'nenhum'}</code>
      </p>
      <div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setFuso(Intl.DateTimeFormat().resolvedOptions().timeZone)}
        >
          Usar fuso do navegador
        </Button>
      </div>
    </Stack>
  )
}
