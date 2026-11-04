import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { RadioGroup } from '../RadioGroup'
import { TextField } from '../TextField'
import { ErrorSummary } from './ErrorSummary'

const errors = [
  { id: 'nome', message: 'Informe seu nome completo.' },
  { id: 'email', message: 'Informe um e-mail válido.' },
]

function Form({ autoFocus }: { autoFocus?: boolean }) {
  return (
    <form>
      <ErrorSummary errors={errors} autoFocus={autoFocus} />
      <TextField id="nome" label="Nome" error="Informe seu nome completo." />
      <TextField id="email" label="E-mail" error="Informe um e-mail válido." />
    </form>
  )
}

describe('ErrorSummary', () => {
  it('renderiza título padrão e links para os campos', () => {
    render(<Form />)
    const region = screen.getByRole('region', { name: 'Corrija os seguintes erros' })
    expect(region).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('heading', { level: 2, name: 'Corrija os seguintes erros' })).toBeInTheDocument()
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '#nome')
    expect(links[1]).toHaveTextContent('Informe um e-mail válido.')
  })

  it('recebe o foco ao aparecer (autoFocus padrão)', () => {
    render(<Form />)
    expect(screen.getByRole('region')).toHaveFocus()
  })

  it('sem autoFocus não move o foco e usa role="alert"', () => {
    render(<Form autoFocus={false} />)
    expect(screen.getByRole('alert')).not.toHaveFocus()
  })

  it('foca quando a lista deixa de ser vazia e some quando fica vazia', () => {
    const { rerender, container } = render(<ErrorSummary errors={[]} />)
    expect(container).toBeEmptyDOMElement()
    rerender(<ErrorSummary errors={[{ id: 'x', message: 'Erro' }]} />)
    expect(screen.getByRole('region')).toHaveFocus()
    rerender(<ErrorSummary errors={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('clicar no link foca o campo correspondente', async () => {
    const user = userEvent.setup()
    const onItemClick = vi.fn()
    render(
      <form>
        <ErrorSummary errors={errors} onItemClick={onItemClick} />
        <TextField id="nome" label="Nome" />
        <TextField id="email" label="E-mail" />
      </form>,
    )
    await user.click(screen.getByRole('link', { name: 'Informe um e-mail válido.' }))
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveFocus()
    expect(onItemClick).toHaveBeenCalledWith(errors[1], expect.anything())
  })

  it('Enter no link (teclado) também foca o campo', async () => {
    const user = userEvent.setup()
    render(<Form />)
    await user.tab()
    expect(screen.getByRole('link', { name: 'Informe seu nome completo.' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveFocus()
  })

  it('link para um grupo foca a opção marcada ou a primeira', async () => {
    const user = userEvent.setup()
    render(
      <form>
        <ErrorSummary errors={[{ id: 'plano', message: 'Escolha um plano.' }]} />
        <RadioGroup
          id="plano"
          label="Plano"
          options={[
            { value: 'a', label: 'Mensal' },
            { value: 'b', label: 'Anual' },
          ]}
        />
      </form>,
    )
    await user.click(screen.getByRole('link'))
    expect(screen.getByRole('radio', { name: 'Mensal' })).toHaveFocus()
  })

  it('aceita título, descrição, nível de título e idioma', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <ErrorSummary errors={errors} headingLevel={3} description="Check the fields below." autoFocus={false} />
        <ErrorSummary errors={errors} title="Não foi possível enviar" autoFocus={false} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Please fix the following errors' })).toBeInTheDocument()
    expect(screen.getByText('Check the fields below.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Não foi possível enviar' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(<Form />)
    await expectNoA11yViolations(container)
  })

  it('motion: entra com data-state="open" e numera os itens para a entrada escalonada', () => {
    render(<Form />)
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('data-state', 'open')
    const items = region.querySelectorAll('li')
    expect(items[1].style.getPropertyValue('--_i')).toBe('1')
  })
})
