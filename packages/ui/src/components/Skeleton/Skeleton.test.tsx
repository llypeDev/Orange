import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { VisuallyHidden } from '../VisuallyHidden'
import { Skeleton, SkeletonText } from './Skeleton'

describe('Skeleton', () => {
  it('é decorativo e usa a variante text por padrão', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild!
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveClass('or-skeleton', 'or-skeleton--text', 'or-skeleton--animated')
  })

  it('aplica largura e altura (números em px, strings como estão)', () => {
    const { container } = render(<Skeleton variant="rect" width="50%" height={180} />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toHaveClass('or-skeleton--rect')
    expect(el.style.width).toBe('50%')
    expect(el.style.height).toBe('180px')
  })

  it('círculo usa a largura como altura quando height não é informada', () => {
    const { container } = render(<Skeleton variant="circle" width={48} />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('48px')
    expect(el.style.height).toBe('48px')
  })

  it('pode desligar a animação', () => {
    const { container } = render(<Skeleton animated={false} />)
    expect(container.firstElementChild).not.toHaveClass('or-skeleton--animated')
  })

  it('repassa ref, className e style', () => {
    let node: HTMLSpanElement | null = null
    const { container } = render(
      <Skeleton
        ref={(el) => {
          node = el
        }}
        className="extra"
        style={{ marginTop: 8 }}
      />,
    )
    expect(node).toBe(container.firstElementChild)
    expect(node!).toHaveClass('extra')
    expect(node!.style.marginTop).toBe('8px')
  })
})

describe('SkeletonText', () => {
  it('renderiza o número de linhas pedido com a última mais curta', () => {
    const { container } = render(<SkeletonText lines={4} lastLineWidth="40%" />)
    const root = container.firstElementChild!
    expect(root).toHaveAttribute('aria-hidden', 'true')
    const lines = root.querySelectorAll<HTMLElement>('.or-skeleton')
    expect(lines).toHaveLength(4)
    expect(lines[3].style.width).toBe('40%')
    expect(lines[0].style.width).toBe('')
  })

  it('uma única linha ocupa a largura toda', () => {
    const { container } = render(<SkeletonText lines={1} />)
    const lines = container.querySelectorAll<HTMLElement>('.or-skeleton')
    expect(lines).toHaveLength(1)
    expect(lines[0].style.width).toBe('')
  })
})

/** Simula as animações de troca (o jsdom não aplica CSS). */
function simulateLayerAnimation() {
  const real = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((el, pseudo) => {
    const style = real(el, pseudo)
    if (!(el as Element).matches?.('.or-skeleton-swap__layer')) return style
    return Object.assign(Object.create(style), {
      animationName: 'or-fade-out',
      animationDuration: '0.16s',
      transitionDuration: '0s',
    }) as CSSStyleDeclaration
  })
}

describe('loaded (troca com crossfade)', () => {
  it('carregando: contêiner aria-busy com placeholder oculto e sem o conteúdo', () => {
    const { container } = render(
      <Skeleton variant="circle" width={40} loaded={false}>
        <img src="/ana.jpg" alt="Ana Souza" />
      </Skeleton>,
    )
    const swap = container.firstElementChild!
    expect(swap).toHaveClass('or-skeleton-swap')
    expect(swap).toHaveAttribute('aria-busy', 'true')
    expect(swap.querySelector('.or-skeleton--circle')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('ao carregar, mostra o conteúdo e esmaece o placeholder até a animação terminar', () => {
    simulateLayerAnimation()
    const { container, rerender } = render(
      <Skeleton variant="rect" height={120} loaded={false}>
        <p>Receita de outubro: R$ 48.210,90</p>
      </Skeleton>,
    )
    rerender(
      <Skeleton variant="rect" height={120} loaded>
        <p>Receita de outubro: R$ 48.210,90</p>
      </Skeleton>,
    )
    const swap = container.firstElementChild!
    expect(swap).not.toHaveAttribute('aria-busy')
    expect(swap).toHaveAttribute('data-changed', 'true')
    expect(screen.getByText('Receita de outubro: R$ 48.210,90')).toBeInTheDocument()
    const [placeholder, content] = swap.querySelectorAll('.or-skeleton-swap__layer')
    expect(placeholder).toHaveAttribute('data-state', 'closed')
    expect(placeholder).toHaveAttribute('aria-hidden', 'true')
    expect(content).toHaveAttribute('data-state', 'open')
    fireEvent.animationEnd(placeholder)
    expect(swap.querySelector('.or-skeleton')).not.toBeInTheDocument()
  })

  it('conteúdo que já chega carregado não anima nem mostra placeholder', () => {
    const { container } = render(
      <SkeletonText lines={2} loaded>
        <p>Pedido entregue em 12/10.</p>
      </SkeletonText>,
    )
    const swap = container.firstElementChild!
    expect(swap).not.toHaveAttribute('data-changed')
    expect(swap.querySelector('.or-skeleton')).not.toBeInTheDocument()
    expect(screen.getByText('Pedido entregue em 12/10.')).toBeInTheDocument()
  })

  it('SkeletonText também troca e não tem violações de acessibilidade', async () => {
    const { container, rerender } = render(
      <SkeletonText lines={3} loaded={false}>
        <p>Resumo pronto.</p>
      </SkeletonText>,
    )
    expect(container.querySelectorAll('.or-skeleton')).toHaveLength(3)
    await expectNoA11yViolations(container)
    rerender(
      <SkeletonText lines={3} loaded>
        <p>Resumo pronto.</p>
      </SkeletonText>,
    )
    expect(screen.getByText('Resumo pronto.')).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })
})

describe('padrão de contêiner', () => {
  it('o contêiner fica aria-busy; o status fica fora dele; os skeletons ficam ocultos', async () => {
    const { container } = render(
      <div>
        <VisuallyHidden role="status">Carregando pedidos…</VisuallyHidden>
        <section aria-busy="true" aria-labelledby="t">
          <h2 id="t">Últimos pedidos</h2>
          <Skeleton variant="circle" />
          <SkeletonText lines={2} />
          <Skeleton variant="rect" />
        </section>
      </div>,
    )
    const region = screen.getByRole('region', { name: 'Últimos pedidos' })
    expect(region).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Carregando pedidos…')
    expect(region.contains(screen.getByRole('status'))).toBe(false)
    await expectNoA11yViolations(container)
  })
})
