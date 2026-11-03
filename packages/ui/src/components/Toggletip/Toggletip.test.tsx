import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Toggletip } from './Toggletip'

const content = 'Visitantes que concluíram uma compra, divididos pelo total de visitantes.'

describe('Toggletip', () => {
  it('é um botão com rótulo acessível e região aria-live vazia', () => {
    render(<Toggletip label="Sobre a taxa de conversão" content={content} />)
    const button = screen.getByRole('button', { name: 'Sobre a taxa de conversão' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    const region = screen.getByRole('status')
    expect(region).toHaveAttribute('aria-live', 'polite')
    expect(region).toBeEmptyDOMElement()
  })

  it('usa "Mais informações" como rótulo padrão (traduzível)', () => {
    const { unmount } = render(<Toggletip content={content} />)
    expect(screen.getByRole('button', { name: 'Mais informações' })).toBeInTheDocument()
    unmount()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Toggletip content={content} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'More information' })).toBeInTheDocument()
  })

  it('clique abre a bolha dentro da região viva e alterna ao clicar de novo', async () => {
    const user = userEvent.setup()
    render(<Toggletip label="Sobre a taxa" content={content} />)
    const button = screen.getByRole('button', { name: 'Sobre a taxa' })
    await user.click(button)
    expect(screen.getByRole('status')).toHaveTextContent(content)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveFocus()

    await user.click(button)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('abre pelo teclado e fecha com Escape mantendo o foco', async () => {
    const user = userEvent.setup()
    render(<Toggletip label="Sobre a taxa" content={content} />)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent(content)
    await user.keyboard('{Escape}')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('button', { name: 'Sobre a taxa' })).toHaveFocus()

    await user.keyboard(' ')
    expect(screen.getByRole('status')).toHaveTextContent(content)
  })

  it('fecha com clique fora e quando o foco vai para outro controle', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Toggletip label="Sobre a taxa" content={content} />
        <Button>Exportar</Button>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Sobre a taxa' }))
    await user.click(document.body)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()

    await user.click(screen.getByRole('button', { name: 'Sobre a taxa' }))
    await user.tab()
    await waitFor(() => expect(screen.getByRole('status')).toBeEmptyDOMElement())
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Toggletip label="Sobre a taxa" content={content} open={false} onOpenChange={onOpenChange} />)
    await user.click(screen.getByRole('button', { name: 'Sobre a taxa' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('não possui violações de acessibilidade aberto', async () => {
    const user = userEvent.setup()
    render(<Toggletip label="Sobre a taxa de conversão" content={content} />)
    await user.click(screen.getByRole('button'))
    await expectNoA11yViolations(document.body)
  })
})
