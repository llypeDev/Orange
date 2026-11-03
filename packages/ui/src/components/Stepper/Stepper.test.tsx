import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Stepper, type StepperStep } from './Stepper'

const steps: StepperStep[] = [
  { label: 'Carrinho', description: '3 itens' },
  { label: 'Entrega', description: 'Endereço e frete' },
  { label: 'Pagamento', description: 'Cartão ou Pix' },
  { label: 'Revisão' },
]

describe('Stepper', () => {
  it('renderiza uma lista ordenada com estados calculados a partir de activeStep', () => {
    render(<Stepper steps={steps} activeStep={2} aria-label="Etapas do checkout" />)
    const list = screen.getByRole('list', { name: 'Etapas do checkout' })
    expect(list.tagName).toBe('OL')
    const items = within(list).getAllByRole('listitem')
    expect(items.map((li) => li.getAttribute('data-status'))).toEqual(['complete', 'complete', 'current', 'upcoming'])
    expect(items[2]).toHaveAttribute('aria-current', 'step')
    expect(items[0]).not.toHaveAttribute('aria-current')
  })

  it('anuncia o estado com texto oculto', () => {
    render(<Stepper steps={steps} activeStep={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[0]).toHaveTextContent('Carrinho (concluído)')
    expect(items[1]).toHaveTextContent('Entrega (atual)')
    expect(items[2]).toHaveTextContent('Pagamento')
    expect(items[2]).not.toHaveTextContent('atual')
  })

  it('mostra número, check na concluída e alerta na etapa com erro (decorativos)', () => {
    render(
      <Stepper
        steps={[{ label: 'Dados' }, { label: 'Documentos', status: 'error' }, { label: 'Envio' }]}
        activeStep={2}
      />,
    )
    const items = screen.getAllByRole('listitem')
    const markers = items.map((li) => li.querySelector('.or-stepper__marker')!)
    markers.forEach((m) => expect(m).toHaveAttribute('aria-hidden', 'true'))
    expect(markers[0].querySelector('[data-icon="check"]')).toBeInTheDocument()
    expect(markers[1].querySelector('[data-icon="alert-triangle"]')).toBeInTheDocument()
    expect(markers[2]).toHaveTextContent('3')
    expect(items[1]).toHaveAttribute('data-status', 'error')
    expect(items[1]).toHaveTextContent('Documentos (com erro)')
  })

  it('sem onStepClick, nenhuma etapa é interativa', () => {
    render(<Stepper steps={steps} activeStep={2} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('com onStepClick, só etapas concluídas viram botões (mouse e teclado)', async () => {
    const user = userEvent.setup()
    const onStepClick = vi.fn()
    render(<Stepper steps={steps} activeStep={2} onStepClick={onStepClick} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveAccessibleName('Carrinho (concluído) 3 itens')
    await user.click(screen.getByRole('button', { name: /Entrega/ }))
    expect(onStepClick).toHaveBeenCalledWith(1)
    expect(buttons[1]).toHaveFocus()
    await user.tab({ shift: true })
    expect(buttons[0]).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onStepClick).toHaveBeenLastCalledWith(0)
  })

  it('vertical mostra o conteúdo da etapa atual', () => {
    render(
      <Stepper
        orientation="vertical"
        activeStep={1}
        steps={[
          { label: 'Criar conta', content: 'Formulário de conta' },
          { label: 'Convidar equipe', content: 'Formulário de convites' },
        ]}
      />,
    )
    expect(screen.getByRole('list')).toHaveClass('or-stepper--vertical')
    expect(screen.getByText('Formulário de convites')).toBeInTheDocument()
    expect(screen.queryByText('Formulário de conta')).not.toBeInTheDocument()
  })

  it('traduz os textos de estado', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Stepper steps={steps} activeStep={1} />
      </OrangeProvider>,
    )
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Carrinho (completed)')
    expect(screen.getAllByRole('listitem')[1]).toHaveTextContent('Entrega (current)')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Stepper steps={steps} activeStep={2} onStepClick={() => {}} aria-label="Checkout" />
        <Stepper
          orientation="vertical"
          steps={[...steps.slice(0, 2), { label: 'Pagamento', status: 'error' }]}
          activeStep={2}
          aria-label="Cadastro"
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
