import { Icon, useDebouncedValue } from '@orange/ui'
import { useMemo, useState } from 'react'

const cidades = [
  'Aracaju',
  'Belém',
  'Belo Horizonte',
  'Boa Vista',
  'Brasília',
  'Campo Grande',
  'Cuiabá',
  'Curitiba',
  'Florianópolis',
  'Fortaleza',
  'Goiânia',
  'João Pessoa',
  'Macapá',
  'Maceió',
  'Manaus',
  'Natal',
  'Palmas',
  'Porto Alegre',
  'Porto Velho',
  'Recife',
  'Rio Branco',
  'Rio de Janeiro',
  'Salvador',
  'São Luís',
  'São Paulo',
  'Teresina',
  'Vitória',
]

const sem = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function BuscaDeCidades() {
  const [busca, setBusca] = useState('')
  const buscaAtrasada = useDebouncedValue(busca, 400)
  const resultado = useMemo(
    () => cidades.filter((c) => sem(c).includes(sem(buscaAtrasada))),
    [buscaAtrasada],
  )
  return (
    <div className="guide-stack" style={{ maxWidth: '24rem' }}>
      <label htmlFor="busca-cidade" className="guide-label">
        Capital
      </label>
      <div className="guide-icons__search">
        <Icon name="search" size="sm" />
        <input
          id="busca-cidade"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite para filtrar…"
        />
      </div>
      <p className="guide-live">
        digitado: <strong>“{busca}”</strong> · aplicado após 400ms:{' '}
        <strong>“{buscaAtrasada}”</strong>
      </p>
      <p className="guide-live" role="status">
        {resultado.length} {resultado.length === 1 ? 'capital' : 'capitais'}:{' '}
        {resultado.slice(0, 6).join(', ')}
        {resultado.length > 6 ? '…' : ''}
      </p>
    </div>
  )
}
