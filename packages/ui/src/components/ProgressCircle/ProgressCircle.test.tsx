import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { ProgressCircle } from './ProgressCircle'

describe('ProgressCircle', () => {
  it('determinado: role="progressbar" com valores e nome acessível', () => {
    render(<ProgressCircle value={30} label="Enviando foto" />)
    const bar = screen.getByRole('progressbar', { name: 'Enviando foto' })
    expect(bar).toHaveAttribute('aria-valuenow', '30')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuetext', '30%')
    expect(bar).toHaveClass(
      'or-progress-circle',
      'or-progress-circle--md',
      'or-progress-circle--accent',
    )
  })

  it('desenha o arco proporcional ao valor com terminação quadrada', () => {
    const { container } = render(<ProgressCircle value={25} label="Upload" />)
    const arc = container.querySelector('.or-progress-circle__arc')!
    const circumference = Number(arc.getAttribute('stroke-dasharray'))
    expect(arc).toHaveAttribute('stroke-linecap', 'square')
    expect(parseFloat((arc as SVGElement).style.strokeDashoffset)).toBeCloseTo(circumference * 0.75)
  })

  it('não desenha o arco em 0% (evita o quadrado da terminação)', () => {
    const { container } = render(<ProgressCircle value={0} label="Upload" />)
    expect(container.querySelector('.or-progress-circle__arc')).not.toBeInTheDocument()
    expect(container.querySelector('.or-progress-circle__track')).toBeInTheDocument()
  })

  it('mostra o valor central quando pedido (exceto no tamanho sm)', () => {
    const { rerender } = render(<ProgressCircle value={68} showValue size="lg" label="Perfil" />)
    expect(screen.getByText('68%')).toHaveAttribute('aria-hidden', 'true')
    rerender(<ProgressCircle value={68} showValue size="sm" label="Perfil" />)
    expect(screen.queryByText('68%')).not.toBeInTheDocument()
  })

  it('só mostra 100% quando o valor chega ao máximo', () => {
    const { rerender } = render(<ProgressCircle value={99.6} showValue label="Exportando" />)
    const bar = screen.getByRole('progressbar', { name: 'Exportando' })
    expect(bar).toHaveAttribute('aria-valuenow', '99.6')
    expect(bar).toHaveAttribute('aria-valuetext', '99%')
    expect(screen.getByText('99%')).toHaveAttribute('aria-hidden', 'true')
    rerender(<ProgressCircle value={45} max={45.2} showValue label="Exportando" />)
    expect(bar).toHaveAttribute('aria-valuetext', '99%')
    rerender(<ProgressCircle value={45.2} max={45.2} showValue label="Exportando" />)
    expect(bar).toHaveAttribute('aria-valuetext', '100%')
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('aceita formatação própria', () => {
    render(
      <ProgressCircle
        value={3}
        max={5}
        showValue
        formatValue={(v, { max }) => `${v}/${max}`}
        label="Etapas"
      />,
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3/5')
    expect(screen.getByText('3/5')).toBeInTheDocument()
  })

  it('indeterminado: sem aria-valuenow e com nome padrão', () => {
    render(<ProgressCircle />)
    const bar = screen.getByRole('progressbar', { name: 'Carregando…' })
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).not.toHaveAttribute('aria-valuetext')
    expect(bar).toHaveClass('or-progress-circle--indeterminate')
  })

  it('aria-labelledby tem prioridade sobre o rótulo padrão', () => {
    render(
      <>
        <span id="titulo">Sincronizando agenda</span>
        <ProgressCircle aria-labelledby="titulo" value={50} />
      </>,
    )
    const bar = screen.getByRole('progressbar', { name: 'Sincronizando agenda' })
    expect(bar).not.toHaveAttribute('aria-label')
  })

  it('aplica o tamanho em px e o tom', () => {
    render(<ProgressCircle value={10} size="lg" tone="success" label="Meta" />)
    const bar = screen.getByRole('progressbar')
    expect(bar.style.width).toBe('80px')
    expect(bar).toHaveClass('or-progress-circle--success')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ProgressCircle value={45} showValue label="Upload do contrato" />
        <ProgressCircle size="sm" label="Carregando comentários" />
        <ProgressCircle size="lg" value={100} tone="success" showValue label="Perfil completo" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
