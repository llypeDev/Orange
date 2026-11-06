import { DateTimePicker, Text, useLocale } from '@orangesys/ui'
import { useState } from 'react'

const QUINZE_MINUTOS = 15 * 60 * 1000
// Próximo horário de 15 em 15 minutos a partir de agora.
const agora = new Date(Math.ceil(Date.now() / QUINZE_MINUTOS) * QUINZE_MINUTOS)
const limite = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 30, 23, 45)

export default function Publication() {
  const { locale } = useLocale()
  const [publicacao, setPublicacao] = useState<Date | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <DateTimePicker
        label="Agendar publicação"
        description="Nos próximos 30 dias, de 15 em 15 minutos."
        min={agora}
        max={limite}
        step={900}
        defaultTime="09:00"
        value={publicacao}
        onChange={setPublicacao}
      />
      <Text size="sm" tone="muted" aria-live="polite">
        {publicacao
          ? `“Novidades do app de pedidos” vai ao ar em ${publicacao.toLocaleString(locale, {
              dateStyle: 'full',
              timeStyle: 'short',
            })}.`
          : 'Escolha quando o artigo vai ao ar.'}
      </Text>
    </div>
  )
}
