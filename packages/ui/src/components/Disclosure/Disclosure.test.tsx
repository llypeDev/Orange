import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Disclosure, type DisclosureProps } from './Disclosure'

function Advanced(props: Partial<DisclosureProps>) {
  return (
    <>
      <Disclosure label="Opções avançadas" {...props}>
        <p>Defina a região do servidor e a política de backup.</p>
        <a href="#regioes">Ver regiões disponíveis</a>
      </Disclosure>
      <button type="button">Criar projeto</button>
    </>
  )
}

const trigger = () => screen.getByRole('button', { name: 'Opções avançadas' })
const contentOf = (button: HTMLElement) =>
  document.getElementById(button.getAttribute('aria-controls')!)!

describe('Disclosure', () => {
  it('renderiza um <button> com aria-expanded e aria-controls apontando para o conteúdo', () => {
    render(<Advanced />)
    const button = trigger()
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    const content = contentOf(button)
    expect(content).toHaveAttribute('role', 'group')
    expect(content).toHaveAttribute('aria-labelledby', button.id)
    expect(content).toHaveAttribute('hidden')
    expect(content).toHaveAttribute('inert')
    expect(screen.queryByRole('group', { name: 'Opções avançadas' })).toBeNull()
  })

  it('abre e fecha com o mouse; não controlado chama onOpenChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Advanced onOpenChange={onOpenChange} />)
    await user.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    const group = screen.getByRole('group', { name: 'Opções avançadas' })
    expect(group).toBeVisible()
    expect(group).not.toHaveAttribute('inert')
    expect(group).toHaveTextContent('Defina a região do servidor')
    await user.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(contentOf(trigger())).not.toBeVisible()
  })

  it('teclado: Enter e Espaço alternam; Tab pula o conteúdo fechado', async () => {
    const user = userEvent.setup()
    render(<Advanced />)
    await user.tab()
    expect(trigger()).toHaveFocus()
    await user.tab()
    // fechado: o link de dentro não recebe foco
    expect(screen.getByRole('button', { name: 'Criar projeto' })).toHaveFocus()

    await user.tab({ shift: true })
    await user.keyboard('{Enter}')
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Ver regiões disponíveis' })).toHaveFocus()

    await user.tab({ shift: true })
    await user.keyboard(' ')
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(trigger()).toHaveFocus()
  })

  it('defaultOpen começa aberto', () => {
    render(<Advanced defaultOpen />)
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    const content = contentOf(trigger())
    expect(content).toBeVisible()
    expect(content).toHaveAttribute('data-state', 'open')
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <p data-testid="state">{open ? 'aberto' : 'fechado'}</p>
          <button type="button" onClick={() => setOpen(false)}>
            Recolher tudo
          </button>
          <Disclosure label="Ver detalhes do pedido" open={open} onOpenChange={setOpen}>
            3 itens · Frete grátis
          </Disclosure>
        </>
      )
    }
    render(<Controlled />)
    const button = screen.getByRole('button', { name: 'Ver detalhes do pedido' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('button', { name: 'Recolher tudo' }))
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByTestId('state')).toHaveTextContent('fechado')
    await user.click(button)
    expect(screen.getByTestId('state')).toHaveTextContent('aberto')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('controlado sem onOpenChange não muda sozinho', async () => {
    const user = userEvent.setup()
    render(<Advanced open={false} />)
    await user.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('headingLevel envolve o botão em um heading; sem ele, não há heading', () => {
    const { rerender } = render(<Advanced />)
    expect(screen.queryByRole('heading')).toBeNull()
    rerender(<Advanced headingLevel={4} />)
    const heading = screen.getByRole('heading', { level: 4, name: 'Opções avançadas' })
    expect(heading).toContainElement(trigger())
  })

  it('disabled desabilita o botão nativamente', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Advanced disabled onOpenChange={onOpenChange} />)
    expect(trigger()).toBeDisabled()
    await user.click(trigger())
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('variantes e tamanhos; ref e atributos vão para a raiz', () => {
    const ref = createRef<HTMLDivElement>()
    const { container, rerender } = render(
      <Disclosure ref={ref} label="Por que pedimos isso?" data-testid="raiz" id="ajuda-setor">
        Usamos o setor para sugerir modelos.
      </Disclosure>,
    )
    const root = screen.getByTestId('raiz')
    expect(ref.current).toBe(root)
    expect(root).toBe(container.firstChild)
    expect(root).toHaveAttribute('id', 'ajuda-setor')
    expect(root).toHaveClass('or-disclosure', 'or-disclosure--inline', 'or-disclosure--md')
    expect(root).toHaveAttribute('data-state', 'closed')
    rerender(
      <Disclosure
        ref={ref}
        label="Por que pedimos isso?"
        data-testid="raiz"
        variant="outline"
        size="sm"
        defaultOpen
      >
        Usamos o setor para sugerir modelos.
      </Disclosure>,
    )
    expect(root).toHaveClass('or-disclosure--outline', 'or-disclosure--sm')
  })

  it('motion: abre com um quadro em 0fr e fecha com hidden só depois da transição (inerte durante a saída)', async () => {
    render(<Advanced />)
    const button = trigger()
    const content = contentOf(button)
    fireEvent.click(button)
    expect(content).not.toHaveAttribute('hidden')
    expect(content).not.toHaveAttribute('inert')
    // um quadro em 0fr antes de expandir, para a transição acontecer
    expect(content).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(content).toHaveAttribute('data-state', 'open'))

    // simula a transição de altura do CSS (o jsdom não tem)
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      animationName: 'none',
      animationDuration: '0s',
      transitionDuration: '0.25s',
    } as CSSStyleDeclaration)
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(content).toHaveAttribute('data-state', 'closed')
    // durante a saída: ainda visível na tela, mas fora do foco e da árvore de acessibilidade
    expect(content).not.toHaveAttribute('hidden')
    expect(content).toHaveAttribute('inert')
    act(() => {
      content.dispatchEvent(new Event('transitionrun'))
      content.dispatchEvent(new Event('transitionend'))
    })
    expect(content).toHaveAttribute('hidden')
    expect(content).toHaveAttribute('inert')
  })

  it('o chevron é decorativo', () => {
    render(<Advanced />)
    const icon = trigger().querySelector('svg')!
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('data-icon', 'chevron-down')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Disclosure label="Por que pedimos isso?" size="sm">
          Usamos o setor de atuação para sugerir modelos de relatório.
        </Disclosure>
        <Disclosure label="Opções avançadas" defaultOpen>
          <label>
            Região do servidor <input defaultValue="São Paulo" />
          </label>
        </Disclosure>
        <Disclosure label="Ver detalhes do pedido" variant="outline" headingLevel={3} defaultOpen>
          3 itens · Frete grátis · Total de R$ 489,90
        </Disclosure>
        <Disclosure label="Histórico de alterações" variant="outline" disabled>
          Nenhuma alteração.
        </Disclosure>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
