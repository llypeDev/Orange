import { Field, Highlight } from '@orange/ui'
import { useState } from 'react'

const cidades = ['São Paulo', 'São José dos Campos', 'Santos', 'Ribeirão Preto', 'Campinas', 'Sorocaba', 'Jundiaí']

const semAcento = (texto: string) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export default function SearchList() {
  const [busca, setBusca] = useState('sao')
  const resultados = cidades.filter((cidade) => semAcento(cidade).includes(semAcento(busca.trim())))

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Field label="Cidade de entrega" controlId="busca-cidade">
        <input
          id="busca-cidade"
          className="or-control"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </Field>
      <ul aria-label="Cidades encontradas" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {resultados.map((cidade) => (
          <li key={cidade} style={{ padding: '6px 0', borderBottom: '1px solid var(--or-color-border)' }}>
            <Highlight query={busca}>{cidade}</Highlight>
          </li>
        ))}
      </ul>
    </div>
  )
}
