import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Search } from './Search'

describe('Search', () => {
  it('renderiza um formulário de busca com rótulo oculto', () => {
    render(<Search label="Buscar produtos" />)
    const form = screen.getByRole('search', { name: 'Buscar produtos' })
    const input = screen.getByRole('searchbox', { name: 'Buscar produtos' })
    expect(form.tagName).toBe('FORM')
    expect(input).toHaveAttribute('type', 'search')
    expect(input).toHaveAttribute('placeholder', 'Buscar…')
    expect(screen.getByText('Buscar produtos').closest('.or-field__label-row')).toHaveClass(
      'or-visually-hidden',
    )
  })

  it('pode mostrar o rótulo', () => {
    render(<Search label="Buscar pedidos" hideLabel={false} description="Número ou cliente" />)
    expect(screen.getByText('Buscar pedidos').closest('.or-field__label-row')).not.toHaveClass(
      'or-visually-hidden',
    )
    expect(screen.getByRole('searchbox')).toHaveAccessibleDescription('Número ou cliente')
  })

  it('chama onSearch no Enter', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<Search label="Buscar" onSearch={onSearch} />)
    await user.type(screen.getByRole('searchbox'), 'notebook{Enter}')
    expect(onSearch).toHaveBeenCalledWith('notebook')
  })

  it('limpa pelo botão e devolve o foco ao campo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(<Search label="Buscar" defaultValue="cadeira" onChange={onChange} onClear={onClear} />)
    const input = screen.getByRole('searchbox')
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
    expect(onChange).toHaveBeenLastCalledWith('')
    expect(onClear).toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Limpar' })).not.toBeInTheDocument()
  })

  it('Escape limpa o texto e, vazio, deixa o evento propagar', async () => {
    const user = userEvent.setup()
    const outer = vi.fn()
    render(
      <div onKeyDown={(e) => e.key === 'Escape' && outer()}>
        <Search label="Buscar" defaultValue="mesa" />
      </div>,
    )
    const input = screen.getByRole('searchbox')
    input.focus()
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('')
    expect(outer).not.toHaveBeenCalled()
    await user.keyboard('{Escape}')
    expect(outer).toHaveBeenCalledTimes(1)
  })

  it('aplica debounce no onChange e envia na hora ao pressionar Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onSearch = vi.fn()
    render(<Search label="Buscar" debounce={300} onChange={onChange} onSearch={onSearch} />)
    const input = screen.getByRole('searchbox')
    await user.type(input, 'lam')
    expect(onChange).not.toHaveBeenCalled()
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('lam'))
    expect(onChange).toHaveBeenCalledTimes(1)
    await user.type(input, 'pada{Enter}')
    expect(onChange).toHaveBeenLastCalledWith('lampada')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onSearch).toHaveBeenCalledWith('lampada')
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [q, setQ] = useState('sofá')
      return (
        <>
          <Search label="Buscar" value={q} onChange={setQ} />
          <button type="button" onClick={() => setQ('poltrona')}>
            Sugestão
          </button>
          <p data-testid="q">{q}</p>
        </>
      )
    }
    render(<Controlled />)
    const input = screen.getByRole('searchbox')
    expect(input).toHaveValue('sofá')
    await user.type(input, 's')
    expect(screen.getByTestId('q')).toHaveTextContent('sofás')
    await user.click(screen.getByRole('button', { name: 'Sugestão' }))
    expect(input).toHaveValue('poltrona')
  })

  it('aplica tamanho e desabilitado', () => {
    render(<Search label="Buscar" size="lg" disabled defaultValue="x" />)
    const input = screen.getByRole('searchbox')
    expect(input).toBeDisabled()
    expect(input.closest('.or-control-frame')).toHaveClass('or-control-frame--lg')
    expect(screen.queryByRole('button', { name: 'Limpar' })).not.toBeInTheDocument()
  })

  it('movimento: o botão limpar só anima quando aparece depois da montagem', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Search label="Com texto" defaultValue="mesa" />
        <Search label="Vazio" />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Limpar' })).not.toHaveAttribute('data-state')
    await user.type(screen.getByRole('searchbox', { name: 'Vazio' }), 'a')
    const buttons = screen.getAllByRole('button', { name: 'Limpar' })
    expect(buttons[1]).toHaveAttribute('data-state', 'open')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Search label="Buscar na documentação" defaultValue="botão" />
        <Search label="Buscar clientes" hideLabel={false} loading />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
