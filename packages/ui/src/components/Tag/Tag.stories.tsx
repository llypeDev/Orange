import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Tag } from './Tag'

const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

const meta = {
  title: 'Componentes/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Rótulo estático para categorizar ou indicar status, com marcador quadrado colorido. Com `onRemove`, ganha um botão de remover com rótulo acessível.',
      },
    },
  },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    variant: { control: 'inline-radio', options: ['outline', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  args: {
    children: 'Em análise',
    tone: 'warning',
    variant: 'outline',
    size: 'md',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['outline', 'solid'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tones.map((tone) => (
            <Tag key={tone} {...args} tone={tone} variant={variant}>
              {tone}
            </Tag>
          ))}
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Tag {...args} size="sm" />
      <Tag {...args} size="md" />
      <Tag {...args} size="lg" />
    </div>
  ),
}

export const WithIcon: Story = {
  args: { icon: <Icon name="clock" />, children: 'Agendado', tone: 'info' },
}

export const Removable: Story = {
  render: (args) => {
    const [tags, setTags] = useState(['São Paulo', 'Belo Horizonte', 'Curitiba'])
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {tags.map((tag) => (
          <Tag key={tag} {...args} tone="neutral" onRemove={() => setTags((list) => list.filter((t) => t !== tag))}>
            {tag}
          </Tag>
        ))}
      </div>
    )
  },
}
