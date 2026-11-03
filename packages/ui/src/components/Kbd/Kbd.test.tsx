import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Kbd } from './Kbd'

describe('Kbd', () => {
  it('renderiza uma tecla simples em <kbd>', () => {
    render(<Kbd>Esc</Kbd>)
    const key = screen.getByText('Esc')
    expect(key.tagName).toBe('KBD')
    expect(key).toHaveClass('or-kbd', 'or-kbd__key', 'or-kbd--md')
  })

  it('combinações usam <kbd> aninhados com separador "+"', () => {
    const { container } = render(<Kbd keys={['Ctrl', 'Shift', 'p']} size="sm" />)
    const root = container.firstElementChild!
    expect(root.tagName).toBe('KBD')
    expect(root).toHaveClass('or-kbd--combo', 'or-kbd--sm')
    const keys = root.querySelectorAll('kbd')
    expect(Array.from(keys).map((k) => k.textContent)).toEqual(['Ctrl', 'Shift', 'P'])
    expect(root).toHaveTextContent('Ctrl+Shift+P')
  })

  it('símbolos do macOS têm nome acessível', () => {
    const { container } = render(<Kbd keys={['Mod', 'Alt', 'K']} symbols separator="" />)
    const symbol = screen.getByTitle('Command')
    expect(symbol.querySelector('[aria-hidden="true"]')).toHaveTextContent('⌘')
    expect(symbol).toHaveTextContent('Command')
    expect(screen.getByTitle('Option')).toHaveTextContent('⌥')
    expect(container.querySelector('.or-kbd__separator')).toBeNull()
  })

  it('Mod vira Ctrl sem símbolos; setas e espaço são traduzidos', () => {
    const { rerender } = render(<Kbd keys={['Mod', 'Space']} />)
    expect(screen.getByText('Ctrl')).toBeInTheDocument()
    expect(screen.getByText('Espaço')).toBeInTheDocument()
    rerender(<Kbd keys={['ArrowUp']} />)
    expect(screen.getByTitle('Seta para cima')).toHaveTextContent('↑')
    rerender(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Kbd keys={['Shift', 'ArrowDown']} />
      </OrangeProvider>,
    )
    expect(screen.getByTitle('Down arrow')).toHaveTextContent('↓')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <p>
        Pressione <Kbd keys={['Ctrl', 'K']} /> para buscar, <Kbd keys={['Meta', 'Enter']} symbols /> para enviar ou{' '}
        <Kbd>Esc</Kbd> para fechar.
      </p>,
    )
    await expectNoA11yViolations(container)
  })
})
