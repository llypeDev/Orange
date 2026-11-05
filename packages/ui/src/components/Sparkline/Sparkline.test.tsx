import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Stat } from '../Stat'
import { Sparkline } from './Sparkline'

const week = [182, 176, 195, 201, 188, 214, 215]
const label = 'Vendas subiram 18% em 7 dias'

describe('Sparkline', () => {
  it('é uma imagem em linha com o resumo em palavras como nome', () => {
    render(<Sparkline data={week} label={label} />)
    const img = screen.getByRole('img', { name: label })
    expect(img.tagName).toBe('SPAN')
    expect(img.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('não é interativa: sem foco, eixos, legenda nem botões', async () => {
    const user = userEvent.setup()
    const { container } = render(<Sparkline data={week} label={label} />)
    expect(screen.getByRole('img')).not.toHaveAttribute('tabindex')
    await user.tab()
    expect(document.body).toHaveFocus()
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('list')).toBeNull()
    expect(container.querySelector('text')).toBeNull()
  })

  it('desenha um ponto por valor, do primeiro ao último, no tamanho pedido', () => {
    const { container } = render(<Sparkline data={week} label={label} width={120} height={32} />)
    const svg = container.querySelector('svg')!
    expect(svg).toHaveAttribute('width', '120')
    expect(svg).toHaveAttribute('height', '32')
    const d = container.querySelector('.or-sparkline__line')!.getAttribute('d')!
    expect(d.match(/[ML]/g)).toHaveLength(week.length)
    const ys = [...d.matchAll(/[ML][\d.]+ ([\d.]+)/g)].map((m) => Number(m[1]))
    // Maior valor no topo (y menor), menor valor embaixo.
    expect(Math.min(...ys)).toBe(ys[week.indexOf(Math.max(...week))])
    expect(Math.max(...ys)).toBe(ys[week.indexOf(Math.min(...week))])
  })

  it('ponto final (padrão) no acento; marcas de mínimo e máximo opcionais', () => {
    const { container, rerender } = render(<Sparkline data={week} label={label} />)
    expect(container.querySelector('.or-sparkline__dot--end')).toBeInTheDocument()
    expect(container.querySelector('.or-sparkline__dot--min')).toBeNull()

    rerender(<Sparkline data={week} label={label} showEndPoint={false} showMinMax />)
    expect(container.querySelector('.or-sparkline__dot--end')).toBeNull()
    const min = container.querySelector('.or-sparkline__dot--min')!
    const max = container.querySelector('.or-sparkline__dot--max')!
    expect(Number(min.getAttribute('cy'))).toBeGreaterThan(Number(max.getAttribute('cy')))
    expect(Number(min.getAttribute('cx'))).toBeLessThan(Number(max.getAttribute('cx')))
  })

  it('cor e área opcionais', () => {
    const { container } = render(<Sparkline data={week} label={label} color="var(--or-color-viz-2)" area />)
    expect(screen.getByRole('img').getAttribute('style')).toContain('--_color: var(--or-color-viz-2)')
    expect(container.querySelector('.or-sparkline__area')).toBeInTheDocument()
  })

  it('valores iguais ou um só ponto não quebram o desenho', () => {
    const { container, rerender } = render(<Sparkline data={[5, 5, 5]} label="Estável" />)
    expect(container.querySelector('.or-sparkline__line')!.getAttribute('d')).not.toContain('NaN')
    rerender(<Sparkline data={[5]} label="Um dia" />)
    expect(container.querySelector('.or-sparkline__line')).toBeNull()
    expect(container.querySelector('.or-sparkline__dot--end')).toBeInTheDocument()
  })

  describe('movimento', () => {
    const original = window.matchMedia
    afterEach(() => {
      window.matchMedia = original
    })

    it('a linha se desenha uma vez ao entrar na tela (pathLength=1)', () => {
      const { container } = render(<Sparkline data={week} label={label} />)
      expect(screen.getByRole('img')).toHaveAttribute('data-motion', 'pending')
      expect(container.querySelector('.or-sparkline__line')).toHaveAttribute('pathLength', '1')
    })

    it('movimento reduzido: desenhada direto', () => {
      window.matchMedia = ((q: string) => ({ ...original(q), matches: q.includes('reduce') })) as typeof window.matchMedia
      render(<Sparkline data={week} label={label} />)
      expect(screen.getByRole('img')).toHaveAttribute('data-motion', 'static')
    })
  })

  it('não possui violações de acessibilidade, inclusive dentro de um Stat', async () => {
    const { container } = render(
      <div>
        <Sparkline data={week} label={label} showMinMax />
        <Stat
          label="Vendas da semana"
          value="R$ 215 mil"
          delta="18%"
          trend="increase"
          help={<Sparkline data={week} label={label} />}
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
