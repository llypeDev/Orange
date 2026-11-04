import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { ExpandableText } from './ExpandableText'

const review =
  'Comprei para o escritório e a equipe se adaptou rápido. A bateria dura o dia inteiro, o teclado é silencioso e a tela tem ótimo brilho mesmo perto da janela. O único ponto negativo é o carregador, que esquenta bastante depois de algumas horas de uso contínuo.'

function mockOverflow(overflowing: boolean) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(overflowing ? 200 : 60)
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(60)
}

describe('ExpandableText', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('não mostra o botão quando o texto cabe nas linhas', () => {
    mockOverflow(false)
    render(<ExpandableText>Texto curto.</ExpandableText>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Texto curto.')).toHaveClass('or-expandable-text__content')
    // sem transbordar, a área não vira grade animada
    expect(screen.getByText('Texto curto.').parentElement).not.toHaveAttribute('data-state')
  })

  it('mostra "Mostrar mais" ligado ao conteúdo quando transborda', () => {
    mockOverflow(true)
    render(<ExpandableText lines={2}>{review}</ExpandableText>)
    const button = screen.getByRole('button', { name: 'Mostrar mais' })
    const content = screen.getByText(review)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', content.id)
    expect(content.parentElement!.style.getPropertyValue('--_lines')).toBe('2')
    expect(content.parentElement).toHaveAttribute('data-state', 'closed')
    expect(content).toHaveAttribute('data-clamped', 'true')
    expect(content).not.toHaveAttribute('data-expanded')
  })

  it('expande e recolhe com mouse e teclado, mantendo o texto completo no DOM', async () => {
    mockOverflow(true)
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<ExpandableText onExpandedChange={onExpandedChange}>{review}</ExpandableText>)
    expect(screen.getByText(review)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Mostrar mais' }))
    const button = screen.getByRole('button', { name: 'Mostrar menos' })
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(review)).toHaveAttribute('data-expanded', 'true')
    // expandido: sem line-clamp e com a linha da grade em 1fr (data-state="open")
    expect(screen.getByText(review)).not.toHaveAttribute('data-clamped')
    expect(screen.getByText(review).parentElement).toHaveAttribute('data-state', 'open')
    expect(onExpandedChange).toHaveBeenLastCalledWith(true)
    button.focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: 'Mostrar mais' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Mostrar menos' })).toBeInTheDocument()
  })

  it('funciona controlado', async () => {
    mockOverflow(true)
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    const { rerender } = render(
      <ExpandableText expanded={false} onExpandedChange={onExpandedChange}>
        {review}
      </ExpandableText>,
    )
    await user.click(screen.getByRole('button'))
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
    rerender(
      <ExpandableText expanded onExpandedChange={onExpandedChange}>
        {review}
      </ExpandableText>,
    )
    expect(screen.getByRole('button', { name: 'Mostrar menos' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('usa rótulos personalizados e o locale do provider', () => {
    mockOverflow(true)
    const { unmount } = render(
      <ExpandableText showMoreLabel="Ler avaliação completa" as="p">
        {review}
      </ExpandableText>,
    )
    expect(screen.getByRole('button', { name: 'Ler avaliação completa' })).toBeInTheDocument()
    expect(screen.getByText(review).tagName).toBe('P')
    unmount()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <ExpandableText>{review}</ExpandableText>
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    mockOverflow(true)
    const { container } = render(
      <div>
        <ExpandableText>{review}</ExpandableText>
        <ExpandableText defaultExpanded>{review}</ExpandableText>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
