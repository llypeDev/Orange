import { useEffect, useRef, useState } from 'react'
import { SaveStatus, Stack, Switch, TextArea, type SaveStatusState } from '@orangesys/ui'

export default function Autosave() {
  const [descricao, setDescricao] = useState(
    'Tênis de corrida com amortecimento responsivo e cabedal respirável.',
  )
  const [status, setStatus] = useState<SaveStatusState>('saved')
  const [salvoEm, setSalvoEm] = useState(() => new Date(Date.now() - 2 * 60_000))
  const [simularFalha, setSimularFalha] = useState(false)
  const falhaRef = useRef(simularFalha)
  falhaRef.current = simularFalha
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Em um app real: chame a API aqui (ex.: PATCH /produtos/123).
  const salvar = () => {
    setStatus('saving')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      if (falhaRef.current) {
        setStatus('error')
      } else {
        setSalvoEm(new Date())
        setStatus('saved')
      }
    }, 900)
  }

  // Salva 1s depois da última tecla.
  const editar = (valor: string) => {
    setDescricao(valor)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(salvar, 1000)
  }

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 520 }}>
      <TextArea
        label="Descrição do produto"
        rows={4}
        value={descricao}
        onChange={(event) => editar(event.target.value)}
      />
      <Stack
        gap={3} direction="horizontal" align="center" justify="between" wrap
      >
        <Switch
          size="sm"
          label="Simular falha de conexão"
          checked={simularFalha}
          onCheckedChange={setSimularFalha}
        />
        <SaveStatus status={status} savedAt={salvoEm} onRetry={salvar} />
      </Stack>
    </Stack>
  )
}
