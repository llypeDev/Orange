import { Button, Drawer, Field, Stack } from '@orangesys/ui'
import { useState } from 'react'

const statusOpcoes = ['Pendente', 'Pago', 'Enviado', 'Cancelado']

export default function Filters() {
  const [selecionados, setSelecionados] = useState<string[]>(['Pendente'])
  const [aplicados, setAplicados] = useState<string[]>(['Pendente'])

  const alternar = (status: string) =>
    setSelecionados((atual) =>
      atual.includes(status) ? atual.filter((s) => s !== status) : [...atual, status],
    )

  return (
    <Stack gap={4} direction="horizontal" align="center" wrap>
      <Drawer
        title="Filtrar pedidos"
        description="Os filtros valem para a lista e para a exportação."
        onOpenChange={(aberto) => aberto && setSelecionados(aplicados)}
        trigger={<Button variant="outline">Filtros ({aplicados.length})</Button>}
        footer={({ close }) => (
          <>
            <Button variant="ghost" onClick={() => setSelecionados([])}>
              Limpar
            </Button>
            <Button
              onClick={() => {
                setAplicados(selecionados)
                close()
              }}
            >
              Aplicar filtros
            </Button>
          </>
        )}
      >
        <Stack gap={6}>
          <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            <legend style={{ fontWeight: 600, marginBottom: 8 }}>Status</legend>
            {statusOpcoes.map((status) => (
              <label key={status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  style={{ accentColor: 'var(--or-color-accent)' }}
                  checked={selecionados.includes(status)}
                  onChange={() => alternar(status)}
                />
                {status}
              </label>
            ))}
          </fieldset>
          <Field label="Período" controlId="filtro-periodo">
            <select id="filtro-periodo" className="or-control" defaultValue="30">
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
            </select>
          </Field>
        </Stack>
      </Drawer>
      <span>
        {aplicados.length ? `Mostrando: ${aplicados.join(', ')}` : 'Mostrando todos os pedidos'}
      </span>
    </Stack>
  )
}
