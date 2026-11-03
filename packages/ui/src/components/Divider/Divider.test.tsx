import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renderiza um <hr> horizontal com papel de separador', () => {
    render(<Divider />)
    const separator = screen.getByRole('separator')
    expect(separator.tagName).toBe('HR')
    expect(separator).toHaveClass('or-divider', 'or-divider--horizontal', 'or-divider--default', 'or-divider--spacing-4')
  })

  it('na vertical usa role="separator" com aria-orientation', () => {
    render(<Divider orientation="vertical" />)
    const separator = screen.getByRole('separator')
    expect(separator.tagName).toBe('DIV')
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    expect(separator).toHaveClass('or-divider--vertical')
  })

  it('aplica tom, espessura e espaçamento', () => {
    render(<Divider tone="accent" thickness="thick" spacing={8} />)
    expect(screen.getByRole('separator')).toHaveClass('or-divider--accent', 'or-divider--thick', 'or-divider--spacing-8')
  })

  it('com rótulo, o separador é nomeado pelo texto do rótulo', () => {
    render(<Divider label="ou" labelPosition="start" />)
    const separator = screen.getByRole('separator', { name: 'ou' })
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    expect(separator).toHaveClass('or-divider--labelled', 'or-divider--label-start')
  })

  it('decorativo fica oculto para tecnologias assistivas', () => {
    const { container } = render(
      <>
        <Divider decorative />
        <Divider decorative orientation="vertical" />
      </>,
    )
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    container.querySelectorAll('.or-divider').forEach((el) => expect(el).toHaveAttribute('aria-hidden', 'true'))
  })

  it('decorativo com rótulo mantém o texto legível, sem papel de separador', () => {
    render(<Divider decorative label="Hoje" />)
    expect(screen.queryByRole('separator')).not.toBeInTheDocument()
    expect(screen.getByText('Hoje')).toBeVisible()
  })

  it('ignora o rótulo na vertical e repassa ref e atributos', () => {
    const ref = createRef<HTMLElement>()
    render(<Divider ref={ref} orientation="vertical" label="x" data-testid="div" />)
    expect(ref.current).toBe(screen.getByTestId('div'))
    expect(screen.queryByText('x')).not.toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <p>Conta</p>
        <Divider />
        <Divider label="ou continue com" />
        <div style={{ display: 'flex' }}>
          <span>Editar</span>
          <Divider orientation="vertical" />
          <span>Excluir</span>
        </div>
        <Divider decorative tone="accent" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
