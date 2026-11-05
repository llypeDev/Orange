import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Icon } from '../../icons'
import { Button } from '../Button'
import { Form, FormActions } from '../Form'
import { Listbox, ListboxGroup, ListboxOption, type ListboxItemGroup, type ListboxSingleProps } from './Listbox'

const planos = (
  <>
    <ListboxOption value="gratuito" description="1 usuário, 3 projetos e 1 GB de armazenamento.">
      Gratuito
    </ListboxOption>
    <ListboxOption value="essencial" description="Até 5 usuários, projetos ilimitados e 50 GB.">
      Essencial
    </ListboxOption>
    <ListboxOption value="profissional" description="Até 25 usuários, relatórios avançados e 500 GB.">
      Profissional
    </ListboxOption>
    <ListboxOption value="empresarial" description="Usuários ilimitados, SSO e suporte dedicado.">
      Empresarial
    </ListboxOption>
  </>
)

const categorias: ListboxItemGroup[] = [
  {
    label: 'Alimentos',
    options: [
      { value: 'hortifruti', label: 'Hortifrúti' },
      { value: 'padaria', label: 'Padaria' },
      { value: 'laticinios', label: 'Laticínios' },
      { value: 'congelados', label: 'Congelados' },
    ],
  },
  {
    label: 'Bebidas',
    options: [
      { value: 'cafes', label: 'Cafés e chás' },
      { value: 'sucos', label: 'Sucos' },
      { value: 'vinhos', label: 'Vinhos', disabled: true, description: 'Indisponível para entrega nesta região' },
    ],
  },
  {
    label: 'Casa',
    options: [
      { value: 'limpeza', label: 'Limpeza' },
      { value: 'utilidades', label: 'Utilidades domésticas' },
    ],
  },
]

const meta = {
  title: 'Componentes/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista de opções sempre visível (padrão Listbox do WAI-ARIA APG), com seleção única ou múltipla. O foco fica no contêiner e a opção ativa é indicada por `aria-activedescendant`. Use para painéis de filtro, escolha de plano e listas mestre; para listas suspensas, use `Select`, `Combobox` ou `MultiSelect`.',
      },
    },
  },
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['single', 'multiple'] },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    selectionFollowsFocus: { control: 'boolean' },
    maxHeight: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { action: 'change' },
  },
  args: {
    label: 'Plano',
    description: 'Você pode trocar de plano a qualquer momento.',
    children: planos,
  },
  decorators: [(Story) => <div style={{ maxWidth: 440 }}>{Story()}</div>],
  // ListboxProps é uma união (single | multiple); os args seguem o modo padrão (single).
} satisfies Meta<ListboxSingleProps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'essencial' },
}

export const SelectionFollowsFocus: Story = {
  args: {
    selectionFollowsFocus: true,
    defaultValue: 'gratuito',
    description: 'As setas já selecionam o plano.',
  },
}

export const Multiple: Story = {
  render: () => (
    <Listbox
      label="Categorias"
      description="Shift+↓ estende a seleção; Ctrl/Cmd+A seleciona todas."
      selectionMode="multiple"
      defaultValue={['padaria', 'cafes']}
      options={categorias}
      maxHeight={360}
    />
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Listbox label="Armazém de origem" defaultValue="cajamar">
      <ListboxOption value="cajamar" icon={<Icon name="layers" size="sm" />} description="Cajamar, SP · 12 docas">
        CD Cajamar
      </ListboxOption>
      <ListboxOption value="extrema" icon={<Icon name="layers" size="sm" />} description="Extrema, MG · 8 docas">
        CD Extrema
      </ListboxOption>
      <ListboxOption
        value="recife"
        icon={<Icon name="alert-triangle" size="sm" />}
        description="Em manutenção até 18/11"
        disabled
      >
        CD Recife
      </ListboxOption>
      <ListboxOption value="canoas" icon={<Icon name="layers" size="sm" />} description="Canoas, RS · 6 docas">
        CD Canoas
      </ListboxOption>
    </Listbox>
  ),
}

export const Groups: Story = {
  render: () => (
    <Listbox label="Fuso horário" defaultValue="sao-paulo" maxHeight={280}>
      <ListboxGroup label="Brasil">
        <ListboxOption value="sao-paulo">Brasília (UTC−3)</ListboxOption>
        <ListboxOption value="manaus">Amazonas (UTC−4)</ListboxOption>
        <ListboxOption value="rio-branco">Acre (UTC−5)</ListboxOption>
        <ListboxOption value="noronha">Fernando de Noronha (UTC−2)</ListboxOption>
      </ListboxGroup>
      <ListboxGroup label="América do Sul">
        <ListboxOption value="buenos-aires">Buenos Aires (UTC−3)</ListboxOption>
        <ListboxOption value="santiago">Santiago (UTC−4)</ListboxOption>
        <ListboxOption value="lima">Lima (UTC−5)</ListboxOption>
      </ListboxGroup>
    </Listbox>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Listbox label="Tamanho" orientation="horizontal" defaultValue="m">
      <ListboxOption value="p">P</ListboxOption>
      <ListboxOption value="m">M</ListboxOption>
      <ListboxOption value="g">G</ListboxOption>
      <ListboxOption value="gg" disabled>
        GG
      </ListboxOption>
    </Listbox>
  ),
}

export const Invalid: Story = {
  args: { required: true, error: 'Escolha um plano para continuar.' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'profissional' },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['hortifruti'])
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Listbox
          label="Categorias no filtro"
          selectionMode="multiple"
          value={value}
          onChange={setValue}
          options={categorias.slice(0, 2)}
        />
        <p style={{ margin: 0 }}>
          {value.length === 0 ? 'Nenhuma categoria' : `${value.length} selecionada(s): ${value.join(', ')}`}
        </p>
        <div>
          <Button size="sm" variant="outline" onClick={() => setValue([])}>
            Limpar filtro
          </Button>
        </div>
      </div>
    )
  },
}

export const InForm: Story = {
  render: () => {
    const [sent, setSent] = useState<string>()
    return (
      <Form
        aria-label="Assinatura"
        validate={(values) => ({ plano: values.plano ? undefined : 'Escolha um plano.' })}
        onSubmit={(values) => setSent(JSON.stringify(values))}
      >
        {({ errors }) => (
          <>
            <Listbox label="Plano" name="plano" required error={errors.plano}>
              {planos}
            </Listbox>
            <FormActions>
              <Button type="submit">Continuar</Button>
            </FormActions>
            {sent && <pre style={{ margin: 0 }}>{sent}</pre>}
          </>
        )}
      </Form>
    )
  },
}
