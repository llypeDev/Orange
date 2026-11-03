import { Eyebrow, Heading, Icon, iconNames, Text } from '@orange/ui'
import { themes, typography } from '@orange/tokens'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Fundamentos/Tokens',
  parameters: { layout: 'padded', a11y: { test: 'todo' } },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const swatch = (name: string) => (
  <div key={name} style={{ border: '1px solid var(--or-color-border)' }}>
    <div style={{ height: 56, background: `var(--or-color-${name})`, borderBottom: '1px solid var(--or-color-border)' }} />
    <div style={{ padding: '8px 10px' }}>
      <Text size="xs" font="mono">
        --or-color-{name}
      </Text>
    </div>
  </div>
)

export const Cores: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Eyebrow marker>Cores semânticas</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
        {Object.keys(themes.dark).map(swatch)}
      </div>
    </div>
  ),
}

export const Tipografia: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Heading level={1} size="display">
        Display 86
      </Heading>
      <Heading level={2} size="5xl">
        Heading 5xl
      </Heading>
      <Heading level={3} size="3xl">
        Heading 3xl
      </Heading>
      <Heading level={4} size="xl">
        Heading xl
      </Heading>
      {(Object.keys(typography.fontSize) as (keyof typeof typography.fontSize)[])
        .filter((k) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(k))
        .map((k) => (
          <Text key={k} size={k as 'xs'}>
            Texto {k} — O design system open source, acessível e customizável.
          </Text>
        ))}
    </div>
  ),
}

export const Icones: Story = {
  name: 'Ícones',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 1, background: 'var(--or-color-border)', border: '1px solid var(--or-color-border)' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ background: 'var(--or-color-bg)', padding: 16, display: 'grid', justifyItems: 'center', gap: 10 }}>
          <Icon name={name} size="lg" />
          <Text size="2xs" tone="subtle" font="mono">
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
}
