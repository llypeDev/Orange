import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { CopyButton } from './CopyButton'

describe('CopyButton', () => {
  it('somente ícone: usa t("copyToClipboard") como nome', () => {
    render(<CopyButton value="pnpm add @orange/ui" />)
    const button = screen.getByRole('button', { name: 'Copiar para a área de transferência' })
    expect(button).toHaveClass('or-button--icon-only', 'or-button--ghost')
  })

  it('copia o valor, chama onCopy, troca o ícone e anuncia "Copiado!"', async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    render(<CopyButton value="pnpm add @orange/ui" onCopy={onCopy} />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toBeEmptyDOMElement()
    const button = screen.getByRole('button')
    await user.click(button)
    expect(await navigator.clipboard.readText()).toBe('pnpm add @orange/ui')
    expect(onCopy).toHaveBeenCalledWith('pnpm add @orange/ui')
    await waitFor(() => expect(status).toHaveTextContent('Copiado!'))
    expect(button).toHaveAttribute('data-copied')
  })

  it('com rótulo: mostra o texto e troca para o rótulo de confirmação', async () => {
    const user = userEvent.setup()
    render(
      <CopyButton value="https://orange.dev/convite/8F2K" copiedLabel="Link copiado">
        Copiar link
      </CopyButton>,
    )
    const button = screen.getByRole('button', { name: 'Copiar link' })
    expect(button).toHaveClass('or-button--outline')
    await user.click(button)
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Link copiado'))
    expect(screen.getByRole('button', { name: 'Link copiado' })).toBe(button)
  })

  it('volta ao estado inicial depois do timeout', async () => {
    const user = userEvent.setup()
    render(<CopyButton value="ORANGE10" timeout={50} />)
    const button = screen.getByRole('button')
    await user.click(button)
    await waitFor(() => expect(button).toHaveAttribute('data-copied'))
    await waitFor(() => expect(button).not.toHaveAttribute('data-copied'))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('funciona pelo teclado e em inglês', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <CopyButton value="ORANGE10" />
      </OrangeProvider>,
    )
    const button = screen.getByRole('button', { name: 'Copy to clipboard' })
    button.focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied!'))
    expect(await navigator.clipboard.readText()).toBe('ORANGE10')
  })

  it('não copia quando onClick chama preventDefault', async () => {
    const user = userEvent.setup()
    const onCopy = vi.fn()
    render(<CopyButton value="segredo" onClick={(e) => e.preventDefault()} onCopy={onCopy} />)
    await user.click(screen.getByRole('button'))
    expect(onCopy).not.toHaveBeenCalled()
  })

  it('não possui violações de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <CopyButton value="pnpm add @orange/ui" />
        <CopyButton value="https://orange.dev" variant="primary">
          Copiar link
        </CopyButton>
      </div>,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getByRole('button', { name: 'Copiar link' }))
    await expectNoA11yViolations(container)
  })
})
