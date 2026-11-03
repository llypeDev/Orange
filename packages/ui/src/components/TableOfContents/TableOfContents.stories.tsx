import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import { TableOfContents } from './TableOfContents'

const sections = [
  { id: 'sb-instalacao', label: 'Instalação', level: 2 },
  { id: 'sb-npm', label: 'Com npm', level: 3 },
  { id: 'sb-pnpm', label: 'Com pnpm', level: 3 },
  { id: 'sb-configuracao', label: 'Configuração', level: 2 },
  { id: 'sb-temas', label: 'Temas', level: 2 },
  { id: 'sb-publicacao', label: 'Publicação', level: 2 },
]

const meta = {
  title: 'Componentes/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Índice "Nesta página": `<nav>` rotulada com links para as seções. Destaca a seção visível (IntersectionObserver) com `aria-current="location"`. Recebe `items` ou coleta os títulos de um `container`.',
      },
    },
  },
  args: {
    items: sections,
  },
} satisfies Meta<typeof TableOfContents>

export default meta
type Story = StoryObj<typeof meta>

function Layout(args: Story['args']) {
  const panelRef = useRef<HTMLDivElement>(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32 }}>
      <div ref={panelRef} style={{ height: 360, overflow: 'auto', paddingRight: 16 }}>
        {sections.map((s) => {
          const Tag = s.level === 3 ? 'h3' : 'h2'
          return (
            <section key={s.id}>
              <Tag id={s.id}>{s.label}</Tag>
              <p style={{ minHeight: 160 }}>Conteúdo da seção {s.label}.</p>
            </section>
          )
        })}
      </div>
      <TableOfContents {...args} root={panelRef} rootMargin="0px 0px -70% 0px" />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <Layout {...args} />,
}

export const WithoutTitle: Story = {
  args: { title: null },
  render: (args) => <Layout {...args} />,
}
