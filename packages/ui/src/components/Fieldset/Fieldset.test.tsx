import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { TextField } from '../TextField'
import { Fieldset } from './Fieldset'


/** jsdom não tem AnimationEvent: dispara um animationend com o nome informado. */
function endAnimation(element: Element, animationName: string) {
  const event = new Event('animationend', { bubbles: true })
  Object.defineProperty(event, 'animationName', { value: animationName })
  act(() => {
    element.dispatchEvent(event)
  })
}

describe('Fieldset', () => {
  it('renderiza um grupo nomeado pela legenda', () => {
    render(
      <Fieldset legend="Endereço de entrega">
        <TextField label="CEP" />
        <TextField label="Número" />
      </Fieldset>,
    )
    const group = screen.getByRole('group', { name: 'Endereço de entrega' })
    expect(group.tagName).toBe('FIELDSET')
    expect(group).toHaveClass('or-fieldset', 'or-fieldset--section', 'or-fieldset--gap-md')
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
  })

  it('liga descrição e erro ao grupo por aria-describedby', () => {
    render(
      <Fieldset legend="Contato" description="Informe ao menos um meio de contato." error="Preencha e-mail ou telefone.">
        <TextField label="E-mail" />
      </Fieldset>,
    )
    const group = screen.getByRole('group', { name: 'Contato' })
    expect(group).toHaveAccessibleDescription('Informe ao menos um meio de contato. Preencha e-mail ou telefone.')
    expect(group).toHaveAttribute('data-invalid')
  })

  it('disabled desabilita nativamente todos os controles internos', async () => {
    const user = userEvent.setup()
    render(
      <Fieldset legend="Faturamento" disabled>
        <TextField label="Razão social" />
        <button type="button">Buscar CNPJ</button>
      </Fieldset>,
    )
    expect(screen.getByRole('group')).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Razão social' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Buscar CNPJ' })).toBeDisabled()
    await user.tab()
    expect(document.body).toHaveFocus()
  })

  it('aceita legenda oculta, espaçamento e ref', () => {
    const ref = { current: null as HTMLFieldSetElement | null }
    render(
      <Fieldset ref={ref} legend="Filtros" hideLegend gap="lg">
        <TextField label="Busca" />
      </Fieldset>,
    )
    expect(ref.current).toBe(screen.getByRole('group', { name: 'Filtros' }))
    expect(ref.current).toHaveClass('or-fieldset--gap-lg')
    expect(screen.getByText('Filtros')).toHaveClass('or-visually-hidden')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <form>
        <Fieldset legend="Dados pessoais" description="Como aparecem no documento.">
          <TextField label="Nome" required />
          <TextField label="Sobrenome" />
        </Fieldset>
        <Fieldset legend="Endereço" error="Endereço incompleto." disabled>
          <TextField label="Rua" />
        </Fieldset>
      </form>,
    )
    await expectNoA11yViolations(container)
  })

  it('motion: seção não treme (a barra de erro anima no CSS)', () => {
    const { rerender, container } = render(
      <Fieldset legend="Contato">
        <TextField label="E-mail" />
      </Fieldset>,
    )
    rerender(
      <Fieldset legend="Contato" error="Preencha um contato.">
        <TextField label="E-mail" />
      </Fieldset>,
    )
    const content = container.querySelector('.or-fieldset__content')!
    expect(content).not.toHaveClass('or-forms-shake')
    endAnimation(content, 'or-forms-bar-in')
    expect(screen.getByRole('group')).toHaveAttribute('data-invalid')
  })
})
