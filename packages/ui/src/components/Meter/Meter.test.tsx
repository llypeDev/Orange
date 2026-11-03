import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Meter } from './Meter'

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement

describe('Meter', () => {
  it('expõe role="meter" com valores, rótulo associado e valor formatado', () => {
    render(<Meter label="Armazenamento" value={42} />)
    const meter = screen.getByRole('meter', { name: 'Armazenamento' })
    expect(meter).toHaveAttribute('aria-valuenow', '42')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '100')
    expect(meter).toHaveAttribute('aria-valuetext', '42%')
    expect(screen.getByText('42%')).toHaveAttribute('aria-hidden', 'true')
  })

  it('sem faixas usa o tom accent', () => {
    const { container } = render(<Meter aria-label="Cota" value={42} />)
    expect(root(container)).toHaveClass('or-meter--accent')
    expect(root(container)).not.toHaveAttribute('data-level')
  })

  it('valores baixos ótimos (uso de disco): verde, amarelo e vermelho conforme low/high', () => {
    const props = { label: 'Disco', low: 70, high: 90, optimum: 0 }
    const { container, rerender } = render(<Meter {...props} value={40} />)
    expect(root(container)).toHaveClass('or-meter--success')
    expect(root(container)).toHaveAttribute('data-level', 'optimum')
    rerender(<Meter {...props} value={80} />)
    expect(root(container)).toHaveClass('or-meter--warning')
    expect(root(container)).toHaveAttribute('data-level', 'suboptimum')
    rerender(<Meter {...props} value={95} />)
    expect(root(container)).toHaveClass('or-meter--danger')
    expect(root(container)).toHaveAttribute('data-level', 'critical')
  })

  it('valores altos ótimos (bateria)', () => {
    const props = { label: 'Bateria', low: 20, high: 50, optimum: 100 }
    const { container, rerender } = render(<Meter {...props} value={80} />)
    expect(root(container)).toHaveClass('or-meter--success')
    rerender(<Meter {...props} value={35} />)
    expect(root(container)).toHaveClass('or-meter--warning')
    rerender(<Meter {...props} value={10} />)
    expect(root(container)).toHaveClass('or-meter--danger')
  })

  it('ótimo no meio: extremos são subótimos', () => {
    const props = { label: 'Umidade', low: 40, high: 60, optimum: 50 }
    const { container, rerender } = render(<Meter {...props} value={50} />)
    expect(root(container)).toHaveClass('or-meter--success')
    rerender(<Meter {...props} value={20} />)
    expect(root(container)).toHaveClass('or-meter--warning')
    rerender(<Meter {...props} value={90} />)
    expect(root(container)).toHaveClass('or-meter--warning')
  })

  it('tone força a cor', () => {
    const { container } = render(
      <Meter label="Disco" value={95} low={70} high={90} optimum={0} tone="info" />,
    )
    expect(root(container)).toHaveClass('or-meter--info')
  })

  it('formata o valor e limita à escala', () => {
    render(
      <Meter
        label="Armazenamento"
        value={140}
        max={128}
        formatValue={(v, { max }) => `${v} GB de ${max} GB`}
      />,
    )
    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '128')
    expect(meter).toHaveAttribute('aria-valuetext', '128 GB de 128 GB')
  })

  it('mostra marcas nos limites e permite escondê-las', () => {
    const { container, rerender } = render(
      <Meter label="Disco" value={10} low={70} high={90} optimum={0} />,
    )
    const marks = container.querySelectorAll<HTMLElement>('.or-meter__threshold')
    expect(marks).toHaveLength(2)
    expect(marks[0].style.left).toBe('70%')
    rerender(
      <Meter label="Disco" value={10} low={70} high={90} optimum={0} showThresholds={false} />,
    )
    expect(container.querySelectorAll('.or-meter__threshold')).toHaveLength(0)
  })

  it('associa a descrição', () => {
    render(<Meter label="Cota de API" value={9100} max={10000} description="Renova em 3 dias" />)
    expect(screen.getByRole('meter')).toHaveAccessibleDescription('Renova em 3 dias')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Meter
          label="Armazenamento"
          value={92}
          max={128}
          low={90}
          high={115}
          optimum={0}
          description="Plano Pro"
        />
        <Meter aria-label="Força da senha" value={3} max={4} showValue={false} size="sm" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
