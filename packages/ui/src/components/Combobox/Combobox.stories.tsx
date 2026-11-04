import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Combobox, type ComboboxOption } from './Combobox'

const cidades: ComboboxOption[] = [
  { value: 'bel', label: 'Belém', description: 'Pará' },
  { value: 'bh', label: 'Belo Horizonte', description: 'Minas Gerais' },
  { value: 'bsb', label: 'Brasília', description: 'Distrito Federal' },
  { value: 'cgr', label: 'Campo Grande', description: 'Mato Grosso do Sul' },
  { value: 'cwb', label: 'Curitiba', description: 'Paraná' },
  { value: 'fln', label: 'Florianópolis', description: 'Santa Catarina' },
  { value: 'for', label: 'Fortaleza', description: 'Ceará' },
  { value: 'gyn', label: 'Goiânia', description: 'Goiás' },
  { value: 'mao', label: 'Manaus', description: 'Amazonas' },
  { value: 'poa', label: 'Porto Alegre', description: 'Rio Grande do Sul' },
  { value: 'rec', label: 'Recife', description: 'Pernambuco' },
  { value: 'rio', label: 'Rio de Janeiro', description: 'Rio de Janeiro' },
  { value: 'ssa', label: 'Salvador', description: 'Bahia' },
  { value: 'sp', label: 'São Paulo', description: 'São Paulo' },
]

const meta = {
  title: 'Componentes/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto com lista de sugestões filtrada enquanto se digita (padrão WAI-ARIA "combobox com listbox"). A busca ignora acentos e o primeiro resultado é destacado; Enter escolhe.',
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onChange: { action: 'change' },
    onInputChange: { action: 'inputChange' },
  },
  args: {
    label: 'Cidade de entrega',
    placeholder: 'Digite para buscar',
    options: cidades,
    size: 'md',
  },
  decorators: [(Story) => <div style={{ maxWidth: 380, minHeight: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'fln', description: 'Usada para calcular o prazo.' },
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Combobox {...args} size="sm" label="Pequeno" />
      <Combobox {...args} size="md" label="Médio" />
      <Combobox {...args} size="lg" label="Grande" />
    </div>
  ),
}

export const DisabledOptions: Story = {
  args: {
    options: cidades.map((c) =>
      ['mao', 'bel'].includes(c.value)
        ? { ...c, description: 'Sem entrega no momento', disabled: true }
        : c,
    ),
  },
}

export const Async: Story = {
  render: function AsyncStory(args) {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState<ComboboxOption[]>([])
    useEffect(() => {
      if (!query.trim()) {
        setOptions([])
        return
      }
      setLoading(true)
      const timer = setTimeout(() => {
        const q = query.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
        setOptions(
          cidades.filter((c) =>
            c.label.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(q),
          ),
        )
        setLoading(false)
      }, 600)
      return () => clearTimeout(timer)
    }, [query])
    return (
      <Combobox
        {...args}
        options={options}
        loading={loading}
        filter={false}
        onInputChange={setQuery}
        emptyMessage={query ? undefined : 'Digite ao menos uma letra'}
      />
    )
  },
}

export const Invalid: Story = {
  args: { required: true, error: 'Escolha uma cidade da lista.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'sp' },
}
