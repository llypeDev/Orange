import { useState } from 'react'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { getFocusableElements } from '../../utils'
import { Carousel, CarouselSlide, type CarouselProps } from './Carousel'

const titles = ['Frete grátis', 'Coleção de inverno', 'Cupom de boas-vindas', 'Troca fácil', 'Retire na loja']

function Demo(props: Partial<CarouselProps>) {
  return (
    <Carousel label="Destaques da loja" {...props}>
      {titles.map((title) => (
        <CarouselSlide key={title}>
          <h3>{title}</h3>
          <a href={`#${title}`}>Ver {title.toLowerCase()}</a>
        </CarouselSlide>
      ))}
    </Carousel>
  )
}

// Slides inativos ficam aria-hidden (sem nome acessível calculado): busca por posição.
const allSlides = () => screen.getAllByRole('group', { hidden: true })
const slide = (n: number) => allSlides()[n - 1]
const activeSlides = () => allSlides().filter((el) => el.getAttribute('data-state') === 'active')
const region = () => screen.getByRole('region', { name: 'Destaques da loja' })
const nextButton = () => screen.getByRole('button', { name: 'Próximo slide' })
const prevButton = () => screen.getByRole('button', { name: 'Slide anterior' })

function mockReducedMotion(reduce: boolean) {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    ...original(query),
    matches: reduce && query.includes('prefers-reduced-motion'),
  })) as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Carousel', () => {
  it('segue o padrão APG: região "carousel" nomeada e slides "slide" numerados', () => {
    render(<Demo />)
    const root = region()
    expect(root.tagName).toBe('SECTION')
    expect(root).toHaveAttribute('aria-roledescription', 'carousel')

    const slides = screen.getAllByRole('group', { hidden: true })
    expect(slides).toHaveLength(5)
    slides.forEach((el, i) => {
      expect(el).toHaveAttribute('aria-roledescription', 'slide')
      expect(el).toHaveAttribute('aria-label', `${i + 1} de 5`)
    })
    // Só o slide atual fica exposto aos leitores de tela.
    expect(screen.getAllByRole('group')).toEqual([screen.getByRole('group', { name: '1 de 5' })])
  })

  it('slides inativos são inertes, escondidos e fora da ordem do Tab', () => {
    render(<Demo />)
    expect(slide(1)).not.toHaveAttribute('inert')
    expect(slide(1)).toHaveAttribute('data-state', 'active')
    for (const n of [2, 3, 4, 5]) {
      expect(slide(n)).toHaveAttribute('inert')
      expect(slide(n)).toHaveAttribute('aria-hidden', 'true')
    }
    const focusables = getFocusableElements(region())
    expect(focusables.map((el) => el.textContent)).toContain('Ver frete grátis')
    expect(focusables.map((el) => el.textContent)).not.toContain('Ver coleção de inverno')
  })

  it('próximo/anterior com nome, aria-controls no trilho e foco preservado', async () => {
    const user = userEvent.setup()
    const onIndexChange = vi.fn()
    const { container } = render(<Demo onIndexChange={onIndexChange} />)
    const track = container.querySelector('.or-carousel__track') as HTMLElement
    expect(nextButton()).toHaveAttribute('aria-controls', track.id)
    expect(prevButton()).toHaveAttribute('aria-controls', track.id)

    await user.click(nextButton())
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    expect(activeSlides()).toEqual([slide(2)])
    expect(slide(1)).toHaveAttribute('inert')
    expect(nextButton()).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(activeSlides()).toEqual([slide(3)])

    await user.click(prevButton())
    expect(activeSlides()).toEqual([slide(2)])
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
  })

  it('sem loop: as pontas ficam aria-disabled (focáveis) e não navegam', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    expect(prevButton()).toHaveAttribute('aria-disabled', 'true')
    expect(prevButton()).not.toBeDisabled()
    await user.click(prevButton())
    expect(activeSlides()).toEqual([slide(1)])

    for (let i = 0; i < 4; i++) await user.click(nextButton())
    expect(activeSlides()).toEqual([slide(5)])
    expect(nextButton()).toHaveAttribute('aria-disabled', 'true')
    await user.click(nextButton())
    expect(activeSlides()).toEqual([slide(5)])
    expect(prevButton()).not.toHaveAttribute('aria-disabled')
  })

  it('com loop: anterior no primeiro vai ao último e próximo no último volta ao primeiro', async () => {
    const user = userEvent.setup()
    render(<Demo loop />)
    expect(prevButton()).not.toHaveAttribute('aria-disabled')
    await user.click(prevButton())
    expect(activeSlides()).toEqual([slide(5)])
    await user.click(nextButton())
    expect(activeSlides()).toEqual([slide(1)])
  })

  it('seletor em abas (APG): uma parada de Tab, setas com volta, Home/End e clique', async () => {
    const user = userEvent.setup()
    render(<Demo />)
    const tablist = screen.getByRole('tablist', { name: 'Escolher slide' })
    const tabs = within(tablist).getAllByRole('tab')
    expect(tabs.map((tab) => tab.getAttribute('aria-label'))).toEqual([
      'Slide 1',
      'Slide 2',
      'Slide 3',
      'Slide 4',
      'Slide 5',
    ])
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[0]).toHaveAttribute('aria-controls', slide(1).id)
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1, -1])

    tabs[0].focus()
    await user.keyboard('{ArrowRight}')
    expect(tabs[1]).toHaveFocus()
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(activeSlides()).toEqual([slide(2)])

    await user.keyboard('{End}')
    expect(tabs[4]).toHaveFocus()
    expect(activeSlides()).toEqual([slide(5)])

    await user.keyboard('{ArrowRight}')
    expect(tabs[0]).toHaveFocus()
    expect(activeSlides()).toEqual([slide(1)])

    await user.keyboard('{ArrowLeft}')
    expect(tabs[4]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(tabs[0]).toHaveFocus()
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1, -1])

    await user.click(tabs[2])
    expect(activeSlides()).toEqual([slide(3)])
    expect(tabs[2]).toHaveAttribute('tabindex', '0')
  })

  it('não controlado (defaultIndex) e controlado (index + onIndexChange)', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Demo defaultIndex={3} />)
    expect(activeSlides()).toEqual([slide(4)])
    unmount()

    const onIndexChange = vi.fn()
    const { rerender } = render(<Demo index={1} onIndexChange={onIndexChange} />)
    expect(activeSlides()).toEqual([slide(2)])
    await user.click(nextButton())
    expect(onIndexChange).toHaveBeenCalledWith(2)
    // O pai ainda não atualizou: a posição continua a controlada.
    expect(activeSlides()).toEqual([slide(2)])
    rerender(<Demo index={4} onIndexChange={onIndexChange} />)
    expect(activeSlides()).toEqual([slide(5)])
  })

  it('funciona controlado por estado do pai', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [index, setIndex] = useState(0)
      return (
        <>
          <p>Posição {index}</p>
          <Demo index={index} onIndexChange={setIndex} />
        </>
      )
    }
    render(<Controlled />)
    await user.click(nextButton())
    expect(screen.getByText('Posição 1')).toBeInTheDocument()
    expect(activeSlides()).toEqual([slide(2)])
  })

  it('slidesPerView: várias posições visíveis, uma aba por posição e variáveis de layout', () => {
    render(<Demo slidesPerView={2.5} gap={6} />)
    const root = region()
    expect(root.style.getPropertyValue('--_per-view')).toBe('2.5')
    expect(root.style.getPropertyValue('--_gap')).toBe('var(--or-space-6)')
    // 5 slides, 2 inteiros por vista → posições 0..3.
    expect(screen.getAllByRole('tab')).toHaveLength(4)
    expect(activeSlides()).toEqual([slide(1), slide(2)])
    expect(slide(3)).toHaveAttribute('inert')
  })

  it('slidesPerView responsivo usa o breakpoint que corresponde', () => {
    const original = window.matchMedia
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query === '(min-width: 640px)' || query === '(min-width: 768px)',
    })) as typeof window.matchMedia
    render(<Demo slidesPerView={{ base: 1.2, md: 3, lg: 4 }} />)
    expect(region().style.getPropertyValue('--_per-view')).toBe('3')
    expect(activeSlides()).toHaveLength(3)
    window.matchMedia = original
  })

  it('sem posições para navegar, não renderiza controles', () => {
    render(<Demo slidesPerView={5} autoplay />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('tablist')).toBeNull()
  })

  it('picker="counter" mostra "01 / 05" e picker="none" só as setas', () => {
    const { container, rerender } = render(<Demo picker="counter" />)
    expect(screen.queryByRole('tablist')).toBeNull()
    expect(container.querySelector('.or-carousel__counter')).toHaveTextContent('01/05')
    rerender(<Demo picker="none" />)
    expect(container.querySelector('.or-carousel__counter')).toBeNull()
    expect(nextButton()).toBeInTheDocument()
  })

  it('controls="top" e "bottom" mantêm os controles antes dos slides no DOM', () => {
    const { container, rerender } = render(<Demo controls="top" />)
    const root = region()
    expect(root).toHaveClass('or-carousel--controls-top')
    expect(root.firstElementChild).toHaveClass('or-carousel__controls')
    rerender(<Demo />)
    expect(container.querySelector('.or-carousel')).toHaveClass('or-carousel--controls-bottom')
    expect(root.firstElementChild).toHaveClass('or-carousel__controls')
  })

  it('aceita rótulos próprios por slide e aria-labelledby', () => {
    render(
      <Carousel label="Novidades">
        <CarouselSlide label="Frete grátis">A</CarouselSlide>
        <CarouselSlide aria-labelledby="titulo-b">
          <h3 id="titulo-b">Coleção de inverno</h3>
        </CarouselSlide>
      </Carousel>,
    )
    expect(screen.getByRole('group', { name: 'Frete grátis' })).toBeInTheDocument()
    const second = allSlides()[1]
    expect(second).toHaveAttribute('aria-labelledby', 'titulo-b')
    expect(second).not.toHaveAttribute('aria-label')
  })

  it('traduz os textos internos', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Demo autoplay />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Pause rotation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Choose slide' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '1 of 5' })).toBeInTheDocument()
  })

  describe('região ao vivo', () => {
    it('é "polite" sem rotação automática', () => {
      const { container } = render(<Demo />)
      const track = container.querySelector('.or-carousel__track')
      expect(track).toHaveAttribute('aria-live', 'polite')
      expect(track).toHaveAttribute('aria-atomic', 'false')
    })

    it('é "off" enquanto gira e vira "polite" quando o usuário navega', async () => {
      const user = userEvent.setup()
      const { container } = render(<Demo autoplay />)
      const track = container.querySelector('.or-carousel__track')
      expect(track).toHaveAttribute('aria-live', 'off')
      await user.click(nextButton())
      expect(track).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('rotação automática', () => {
    it('o primeiro controle é o botão de pausa; avança a cada intervalo e volta ao início', () => {
      vi.useFakeTimers()
      render(<Demo autoplay={{ interval: 3000 }} />)
      const focusables = getFocusableElements(region())
      expect(focusables[0]).toHaveAccessibleName('Pausar rotação')
      expect(region()).toHaveAttribute('data-autoplay', 'playing')

      act(() => vi.advanceTimersByTime(2999))
      expect(activeSlides()).toEqual([slide(1)])
      act(() => vi.advanceTimersByTime(1))
      expect(activeSlides()).toEqual([slide(2)])

      // Do último volta para o primeiro, mesmo sem loop.
      // Cada avanço agenda o próximo depois do commit do React: um intervalo por act.
      for (let i = 0; i < 3; i++) act(() => vi.advanceTimersByTime(3000))
      expect(activeSlides()).toEqual([slide(5)])
      act(() => vi.advanceTimersByTime(3000))
      expect(activeSlides()).toEqual([slide(1)])
    })

    it('mostra a barra de progresso enquanto gira', () => {
      vi.useFakeTimers()
      const { container } = render(<Demo autoplay={{ interval: 4000 }} />)
      const progress = container.querySelector('.or-carousel__progress') as HTMLElement
      expect(progress).toHaveAttribute('aria-hidden', 'true')
      expect(progress.style.getPropertyValue('--_interval')).toBe('4000ms')
    })

    it('pausar e iniciar pelo botão (o rótulo troca, sem aria-pressed)', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const { container } = render(<Demo autoplay />)
      const button = screen.getByRole('button', { name: 'Pausar rotação' })
      expect(button).not.toHaveAttribute('aria-pressed')

      await user.click(button)
      expect(button).toHaveAccessibleName('Iniciar rotação')
      expect(region()).toHaveAttribute('data-autoplay', 'stopped')
      expect(container.querySelector('.or-carousel__progress')).toBeNull()
      act(() => vi.advanceTimersByTime(10000))
      expect(activeSlides()).toEqual([slide(1)])

      // Iniciar explicitamente vence hover e foco (o mouse ainda está em cima).
      await user.click(button)
      expect(button).toHaveAccessibleName('Pausar rotação')
      act(() => vi.advanceTimersByTime(5000))
      expect(activeSlides()).toEqual([slide(2)])
    })

    it('pausa no hover e retoma ao sair, preservando o tempo restante', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<Demo autoplay />)
      act(() => vi.advanceTimersByTime(3000))
      await user.hover(slide(1))
      expect(region()).toHaveAttribute('data-paused')
      act(() => vi.advanceTimersByTime(10000))
      expect(activeSlides()).toEqual([slide(1)])

      await user.unhover(region())
      expect(region()).not.toHaveAttribute('data-paused')
      // Faltavam ~2s quando pausou.
      act(() => vi.advanceTimersByTime(2100))
      expect(activeSlides()).toEqual([slide(2)])
    })

    it('para quando o foco do teclado entra no carrossel e só volta pelo botão', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(
        <>
          <button type="button">Antes</button>
          <Demo autoplay />
        </>,
      )
      screen.getByRole('button', { name: 'Antes' }).focus()
      await user.tab()
      const rotation = screen.getByRole('button', { name: 'Iniciar rotação' })
      expect(rotation).toHaveFocus()
      expect(region()).toHaveAttribute('data-autoplay', 'stopped')

      act(() => vi.advanceTimersByTime(10000))
      expect(activeSlides()).toEqual([slide(1)])

      // Sair com o foco não retoma sozinho.
      await user.tab({ shift: true })
      act(() => vi.advanceTimersByTime(10000))
      expect(activeSlides()).toEqual([slide(1)])

      // O usuário pede de novo: gira mesmo com o foco dentro.
      rotation.focus()
      await user.keyboard('{Enter}')
      expect(rotation).toHaveAccessibleName('Pausar rotação')
      act(() => vi.advanceTimersByTime(5000))
      expect(activeSlides()).toEqual([slide(2)])
    })

    it('foco por clique dentro do carrossel só pausa (retoma quando o foco sai)', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(
        <>
          <button type="button">Fora</button>
          <Demo autoplay />
        </>,
      )
      const link = screen.getByRole('link', { name: 'Ver frete grátis' })
      fireEvent.pointerDown(link)
      act(() => link.focus())
      fireEvent.click(link)
      expect(region()).toHaveAttribute('data-autoplay', 'playing')
      expect(region()).toHaveAttribute('data-paused')
      act(() => vi.advanceTimersByTime(10000))
      expect(activeSlides()).toEqual([slide(1)])

      act(() => screen.getByRole('button', { name: 'Fora' }).focus())
      expect(region()).not.toHaveAttribute('data-paused')
      act(() => vi.advanceTimersByTime(5000))
      expect(activeSlides()).toEqual([slide(2)])
    })

    it('navegar manualmente encerra a rotação', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<Demo autoplay />)
      await user.click(screen.getAllByRole('tab')[3])
      expect(screen.getByRole('button', { name: 'Iniciar rotação' })).toBeInTheDocument()
      await user.unhover(region())
      act(() => vi.advanceTimersByTime(20000))
      expect(activeSlides()).toEqual([slide(4)])
    })

    it('com movimento reduzido nunca começa sozinha', () => {
      vi.useFakeTimers()
      const restore = mockReducedMotion(true)
      const { container } = render(<Demo autoplay />)
      expect(screen.getByRole('button', { name: 'Iniciar rotação' })).toBeInTheDocument()
      expect(container.querySelector('.or-carousel__track')).toHaveAttribute('aria-live', 'polite')
      expect(container.querySelector('.or-carousel__progress')).toBeNull()
      act(() => vi.advanceTimersByTime(20000))
      expect(activeSlides()).toEqual([slide(1)])
      restore()
    })

    it('pausa enquanto a aba do navegador está oculta', () => {
      vi.useFakeTimers()
      render(<Demo autoplay />)
      const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden')
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'))
      })
      act(() => vi.advanceTimersByTime(10000))
      expect(activeSlides()).toEqual([slide(1)])
      visibility.mockReturnValue('visible')
      act(() => {
        document.dispatchEvent(new Event('visibilitychange'))
      })
      act(() => vi.advanceTimersByTime(5000))
      expect(activeSlides()).toEqual([slide(2)])
    })
  })

  it('sincroniza o índice com o swipe (scroll-snap) e encerra a rotação', () => {
    const { container } = render(<Demo autoplay />)
    const track = container.querySelector('.or-carousel__track') as HTMLElement
    const slides = Array.from(track.children) as HTMLElement[]
    // Layout simulado: slides de 300px + 16px de espaço num trilho de 300px.
    Object.defineProperty(track, 'clientWidth', { configurable: true, value: 300 })
    Object.defineProperty(track, 'scrollWidth', { configurable: true, value: 5 * 300 + 4 * 16 })
    slides.forEach((el, i) => {
      Object.defineProperty(el, 'offsetLeft', { configurable: true, value: i * 316 })
      Object.defineProperty(el, 'offsetWidth', { configurable: true, value: 300 })
    })
    track.scrollLeft = 2 * 316
    fireEvent.scroll(track)
    fireEvent(track, new Event('scrollend'))
    expect(activeSlides()).toEqual([slide(3)])
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('button', { name: 'Iniciar rotação' })).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Demo autoplay />
        <Carousel label="Produtos em oferta" slidesPerView={2.5} picker="counter">
          {titles.map((title) => (
            <CarouselSlide key={title}>
              <a href={`#p-${title}`}>{title}</a>
            </CarouselSlide>
          ))}
        </Carousel>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
