import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { ColorField } from './ColorField'

const swatches = [
  { value: '#f58549', label: 'Laranja Orange' },
  { value: '#0f0f12', label: 'Carbono' },
  { value: '#7fb236', label: 'Verde' },
]

const getPicker = (container: HTMLElement) => container.querySelector('input[type="color"]') as HTMLInputElement

describe('ColorField', () => {
  it('renderiza o campo hexadecimal rotulado e o seletor nativo', () => {
    const { container } = render(<ColorField label="Cor da marca" defaultValue="#F58549" />)
    const text = screen.getByRole('textbox', { name: 'Cor da marca' })
    expect(text).toHaveValue('#f58549')
    expect(text).toHaveAttribute('placeholder', '#rrggbb')
    const picker = getPicker(container)
    expect(picker).toHaveAccessibleName('Cor da marca Seletor de cor')
    expect(picker).toHaveValue('#f58549')
  })

  it('digitar um hexadecimal válido sincroniza o seletor e emite onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const { container } = render(<ColorField label="Cor" onChange={onChange} />)
    const text = screen.getByRole('textbox', { name: 'Cor' })
    await user.type(text, '#4A66D4')
    expect(onChange).toHaveBeenLastCalledWith('#4a66d4')
    expect(getPicker(container)).toHaveValue('#4a66d4')
  })

  it('aceita formatos curtos e sem # e normaliza ao sair do campo', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorField label="Cor" onChange={onChange} />)
    const text = screen.getByRole('textbox', { name: 'Cor' })
    await user.type(text, 'F80')
    expect(onChange).toHaveBeenLastCalledWith('#ff8800')
    await user.tab()
    expect(text).toHaveValue('#ff8800')
  })

  it('mostra erro de formato ao sair com valor inválido', async () => {
    const user = userEvent.setup()
    render(<ColorField label="Cor" defaultValue="#000000" />)
    const text = screen.getByRole('textbox', { name: 'Cor' })
    await user.clear(text)
    await user.type(text, '#12zz')
    expect(text).not.toHaveAttribute('aria-invalid')
    await user.tab()
    expect(text).toHaveAttribute('aria-invalid', 'true')
    expect(text).toHaveAccessibleDescription('Use uma cor hexadecimal no formato #rrggbb')
    await user.clear(text)
    await user.type(text, '#123456')
    expect(text).not.toHaveAttribute('aria-invalid')
  })

  it('o seletor nativo atualiza o campo de texto', () => {
    const onChange = vi.fn()
    const { container } = render(<ColorField label="Cor" onChange={onChange} />)
    fireEvent.input(getPicker(container), { target: { value: '#e8c15a' } })
    expect(screen.getByRole('textbox', { name: 'Cor' })).toHaveValue('#e8c15a')
    expect(onChange).toHaveBeenLastCalledWith('#e8c15a')
  })

  it('paleta é um radiogroup com nomes acessíveis e navegação por setas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ColorField label="Cor da etiqueta" swatches={swatches} defaultValue="#0f0f12" onChange={onChange} />)
    const group = screen.getByRole('radiogroup', { name: 'Cor da etiqueta Cores sugeridas' })
    expect(group).toBeInTheDocument()
    const carbon = screen.getByRole('radio', { name: 'Carbono' })
    expect(carbon).toHaveAttribute('aria-checked', 'true')
    expect(carbon).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: 'Laranja Orange' })).toHaveAttribute('tabindex', '-1')

    await user.click(screen.getByRole('radio', { name: 'Verde' }))
    expect(onChange).toHaveBeenLastCalledWith('#7fb236')
    expect(screen.getByRole('textbox', { name: 'Cor da etiqueta' })).toHaveValue('#7fb236')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Laranja Orange' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Laranja Orange' })).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{End}')
    expect(screen.getByRole('radio', { name: 'Verde' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenLastCalledWith('#0f0f12')
  })

  it('sem valor correspondente, a primeira cor da paleta recebe o tab', () => {
    render(<ColorField label="Cor" swatches={['#f58549', '#7fb236']} defaultValue="#123456" />)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAccessibleName('#f58549')
    expect(radios[0]).toHaveAttribute('tabindex', '0')
    expect(radios[1]).toHaveAttribute('tabindex', '-1')
    expect(radios.every((r) => r.getAttribute('aria-checked') === 'false')).toBe(true)
  })

  it('controlado: segue o value', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [color, setColor] = useState('#f58549')
      return (
        <>
          <ColorField label="Cor" value={color} onChange={setColor} />
          <button type="button" onClick={() => setColor('#4a66d4')}>
            Azul
          </button>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Azul' }))
    expect(screen.getByRole('textbox', { name: 'Cor' })).toHaveValue('#4a66d4')
  })

  it('desabilitado bloqueia todos os controles', () => {
    const { container } = render(<ColorField label="Cor" disabled swatches={swatches} />)
    expect(screen.getByRole('textbox', { name: 'Cor' })).toBeDisabled()
    expect(getPicker(container)).toBeDisabled()
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled())
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ColorField label="Cor primária" description="Usada em botões e links" defaultValue="#f58549" swatches={swatches} />
        <ColorField label="Cor secundária" error="Escolha uma cor com mais contraste" size="sm" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
