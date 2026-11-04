import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { LoadingOverlay } from './LoadingOverlay'

const rows = [
  ['Sudeste', 'R$ 1.284.300', '+12%'],
  ['Sul', 'R$ 642.900', '+4%'],
  ['Nordeste', 'R$ 518.200', '+18%'],
  ['Centro-Oeste', 'R$ 301.750', '−3%'],
]

function SalesTable() {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
      <caption style={{ textAlign: 'left', fontWeight: 700, padding: '12px 16px' }}>
        Vendas por região — outubro
      </caption>
      <thead>
        <tr>
          {['Região', 'Receita', 'Variação'].map((h) => (
            <th
              key={h}
              scope="col"
              style={{
                textAlign: 'left',
                padding: '8px 16px',
                borderTop: '1px solid var(--or-color-border)',
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((cell) => (
              <td
                key={cell}
                style={{ padding: '8px 16px', borderTop: '1px solid var(--or-color-border)' }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const meta = {
  title: 'Componentes/LoadingOverlay',
  component: LoadingOverlay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Cobre um contêiner enquanto ele é atualizado: fundo `--or-color-overlay`, spinner e mensagem. O conteúdo coberto recebe `inert` e `aria-busy`; a mensagem é anunciada numa região `role="status"` sempre montada.',
      },
    },
  },
  argTypes: {
    visible: { control: 'boolean' },
    message: { control: 'text' },
    spinnerSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    visible: true,
    message: 'Atualizando relatório…',
    spinnerSize: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 560, border: '1px solid var(--or-color-border)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoadingOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <LoadingOverlay {...args}>
      <SalesTable />
    </LoadingOverlay>
  ),
}

export const DefaultMessage: Story = {
  args: { message: undefined },
  render: Default.render,
}

export const Toggle: Story = {
  args: { visible: false },
  render: function ToggleStory(args) {
    const [loading, setLoading] = useState(false)
    const refresh = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 2000)
    }
    return (
      <LoadingOverlay {...args} visible={loading}>
        <SalesTable />
        <div style={{ padding: 16 }}>
          <Button variant="outline" size="sm" onClick={refresh}>
            Atualizar dados
          </Button>
        </div>
      </LoadingOverlay>
    )
  },
}
