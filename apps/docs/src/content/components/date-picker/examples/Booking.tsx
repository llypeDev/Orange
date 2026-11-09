import { DatePicker, Stack, Text } from '@orangesys/ui'
import { useState } from 'react'

const DIA = 24 * 60 * 60 * 1000
const hoje = new Date()

export default function Booking() {
  const [entrada, setEntrada] = useState<Date | null>(null)
  const [saida, setSaida] = useState<Date | null>(null)
  const noites = entrada && saida ? Math.round((saida.getTime() - entrada.getTime()) / DIA) : 0

  return (
    <Stack gap={4}>
      <Stack gap={4} direction="horizontal" wrap>
        <DatePicker
          label="Check-in"
          value={entrada}
          min={hoje}
          onChange={(data) => {
            setEntrada(data)
            if (data && saida && saida <= data) setSaida(null)
          }}
        />
        <DatePicker
          label="Check-out"
          value={saida}
          min={entrada ? new Date(entrada.getTime() + DIA) : hoje}
          disabled={!entrada}
          onChange={setSaida}
        />
      </Stack>
      <Text size="sm" tone="muted" aria-live="polite">
        {noites > 0
          ? `${noites} ${noites === 1 ? 'noite' : 'noites'} de hospedagem`
          : 'Escolha as datas da estadia.'}
      </Text>
    </Stack>
  )
}
