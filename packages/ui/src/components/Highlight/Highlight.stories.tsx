import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Highlight } from './Highlight'

const meta = {
  title: 'Componentes/Highlight',
  component: Highlight,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Destaca termos de busca dentro de um texto com `<mark>`. Ignora acentos e maiúsculas por padrão; os termos são tratados como texto literal (caracteres de regex são escapados).',
      },
    },
  },
  argTypes: {
    query: { control: 'text' },
    caseSensitive: { control: 'boolean' },
    accentSensitive: { control: 'boolean' },
    as: { control: 'select', options: ['span', 'p', 'div'] },
  },
  args: {
    query: 'sao paulo',
    children: 'Entregas para São Paulo e região metropolitana saem do centro de distribuição de Cajamar.',
  },
} satisfies Meta<typeof Highlight>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const MultipleTerms: Story = {
  args: {
    query: ['nota fiscal', 'xml'],
    children: 'Baixe a nota fiscal em PDF ou XML direto pelo painel de pedidos.',
  },
}

const contatos = ['Ana Souza', 'André Lima', 'Bianca Araújo', 'Caio Antunes', 'Júlia Andrade']

const fold = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

function SearchResultsDemo() {
  const [query, setQuery] = useState('an')
  const results = contatos.filter((nome) => fold(nome).includes(fold(query)))
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      <label style={{ display: 'grid', gap: 4 }}>
        Buscar contato
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {results.map((nome) => (
          <li key={nome}>
            <Highlight query={query}>{nome}</Highlight>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const SearchResults: Story = {
  render: () => <SearchResultsDemo />,
}
