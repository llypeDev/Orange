import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '../Button'
import { Stepper, type StepperStep } from './Stepper'

const steps: StepperStep[] = [
  { label: 'Carrinho', description: '3 itens' },
  { label: 'Entrega', description: 'Endereço e frete' },
  { label: 'Pagamento', description: 'Cartão ou Pix' },
  { label: 'Revisão', description: 'Confirme o pedido' },
]

const meta = {
  title: 'Componentes/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mostra o progresso em fluxos de várias etapas. `<ol>` com estados `complete`/`current`/`upcoming`/`error`, `aria-current="step"` e texto oculto com o estado. Etapas concluídas podem ser clicáveis com `onStepClick`.',
      },
    },
  },
  argTypes: {
    step: { control: { type: 'number', min: 0, max: 4 } },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    onStepClick: { action: 'stepClick' },
  },
  args: {
    steps,
    step: 2,
    orientation: 'horizontal',
    'aria-label': 'Etapas do checkout',
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}

export const WithError: Story = {
  args: {
    steps: [steps[0], steps[1], { ...steps[2], status: 'error', description: 'Cartão recusado' }, steps[3]],
  },
}

export const Interactive: Story = {
  render: (args) => {
    const [active, setActive] = useState(1)
    return (
      <div style={{ display: 'grid', gap: 24 }}>
        <Stepper {...args} step={active} onStepClick={setActive} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" disabled={active === 0} onClick={() => setActive((v) => v - 1)}>
            Voltar
          </Button>
          <Button disabled={active === steps.length} onClick={() => setActive((v) => v + 1)}>
            Continuar
          </Button>
        </div>
      </div>
    )
  },
}
