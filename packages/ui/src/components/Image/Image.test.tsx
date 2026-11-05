import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Image } from './Image'

const frameOf = (img: HTMLElement) => img.closest('.or-image') as HTMLElement

describe('Image', () => {
  it('renderiza uma <img> com alt, lazy e decoding async por padrão', () => {
    render(<Image src="/tenis.jpg" alt="Tênis de corrida laranja" />)
    const img = screen.getByRole('img', { name: 'Tênis de corrida laranja' })
    expect(img).toHaveAttribute('src', '/tenis.jpg')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
    expect(frameOf(img)).toHaveAttribute('data-state', 'loading')
  })

  it('permite trocar loading/decoding e repassa srcSet, sizes e atributos à <img>', () => {
    render(
      <Image
        src="/capa.jpg"
        srcSet="/capa-640.jpg 640w, /capa-1280.jpg 1280w"
        sizes="(min-width: 768px) 50vw, 100vw"
        alt="Capa do relatório"
        loading="eager"
        fetchPriority="high"
        data-testid="capa"
      />,
    )
    const img = screen.getByTestId('capa')
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img).toHaveAttribute('srcset', '/capa-640.jpg 640w, /capa-1280.jpg 1280w')
    expect(img).toHaveAttribute('sizes', '(min-width: 768px) 50vw, 100vw')
  })

  it('alt="" torna a imagem decorativa (fora da árvore de acessibilidade)', () => {
    const { container } = render(<Image src="/textura.svg" alt="" />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it('reserva a proporção com aspect-ratio (ratio nomeado, numérico ou via width/height)', () => {
    const { rerender, container } = render(<Image src="/a.jpg" alt="Vitrine" ratio="16/9" />)
    const frame = () => container.querySelector('.or-image') as HTMLElement
    expect(frame().style.aspectRatio).toBe('16/9')
    expect(frame()).not.toHaveClass('or-image--auto')

    rerender(<Image src="/a.jpg" alt="Vitrine" ratio={1.5} />)
    expect(frame().style.aspectRatio).toBe('1.5')

    rerender(<Image src="/a.jpg" alt="Vitrine" width={1200} height={800} />)
    expect(frame().style.aspectRatio).toBe('1200 / 800')

    rerender(<Image src="/a.jpg" alt="Vitrine" />)
    expect(frame()).toHaveClass('or-image--auto')
  })

  it('aplica fit, position e bordered', () => {
    render(<Image src="/logo.svg" alt="Logotipo da loja" fit="contain" position="top" bordered />)
    const img = screen.getByRole('img')
    expect(frameOf(img)).toHaveClass('or-image--contain', 'or-image--bordered')
    expect(img.style.objectPosition).toBe('top')
  })

  it('mostra o skeleton até carregar e passa para data-state="loaded"', () => {
    const onLoad = vi.fn()
    const { container } = render(<Image src="/a.jpg" alt="Vitrine" ratio="4/3" onLoad={onLoad} />)
    const img = screen.getByRole('img')
    expect(container.querySelector('.or-skeleton')).toHaveAttribute('aria-hidden', 'true')
    fireEvent.load(img)
    expect(frameOf(img)).toHaveAttribute('data-state', 'loaded')
    expect(container.querySelector('.or-skeleton')).toBeNull()
    expect(onLoad).toHaveBeenCalledTimes(1)
  })

  it('em erro tenta o fallbackSrc uma vez e depois mostra o substituto acessível', () => {
    const onError = vi.fn()
    render(<Image src="/quebrada.jpg" fallbackSrc="/reserva.jpg" alt="Mochila impermeável" onError={onError} />)
    const img = screen.getByRole('img', { name: 'Mochila impermeável' })

    fireEvent.error(img)
    expect(img).toHaveAttribute('src', '/reserva.jpg')
    expect(frameOf(img)).toHaveAttribute('data-state', 'loading')

    fireEvent.error(img)
    expect(frameOf(img)).toHaveAttribute('data-state', 'error')
    expect(img).toHaveAttribute('hidden')
    expect(screen.queryByRole('img', { name: 'Mochila impermeável' })).toBeNull()
    expect(screen.getByText('Imagem indisponível: Mochila impermeável')).toHaveClass('or-visually-hidden')
    expect(onError).toHaveBeenCalledTimes(2)
  })

  it('o fallbackSrc que carrega encerra no estado loaded', () => {
    render(<Image src="/quebrada.jpg" fallbackSrc="/reserva.jpg" alt="Mochila impermeável" />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    fireEvent.load(img)
    expect(frameOf(img)).toHaveAttribute('data-state', 'loaded')
    expect(img).toHaveAttribute('src', '/reserva.jpg')
  })

  it('aceita um fallback próprio e esconde o substituto padrão de imagens decorativas', () => {
    const { rerender, container } = render(
      <Image src="/x.jpg" alt="Mapa da loja" fallback={<span>Mapa indisponível no momento</span>} />,
    )
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByText('Mapa indisponível no momento')).toBeInTheDocument()

    rerender(<Image src="/y.jpg" alt="" />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    const fallback = container.querySelector('.or-image__fallback')
    expect(fallback).toHaveAttribute('aria-hidden', 'true')
    expect(fallback).not.toHaveTextContent(/indisponível/)
  })

  it('volta a carregar quando o src muda', () => {
    const { rerender } = render(<Image src="/a.jpg" alt="Produto" />)
    fireEvent.error(screen.getByRole('img'))
    rerender(<Image src="/b.jpg" alt="Produto" />)
    const img = screen.getByRole('img', { name: 'Produto' })
    expect(img).toHaveAttribute('src', '/b.jpg')
    expect(frameOf(img)).toHaveAttribute('data-state', 'loading')
  })

  it('com caption usa <figure> e <figcaption>; className e style vão para o contêiner', () => {
    render(
      <Image
        src="/loja.jpg"
        alt="Fachada da loja no centro"
        caption="Nossa nova loja, inaugurada em março."
        className="vitrine"
        style={{ maxWidth: 320 }}
      />,
    )
    const figure = screen.getByRole('figure')
    expect(figure.tagName).toBe('FIGURE')
    expect(figure).toHaveClass('or-image-figure', 'vitrine')
    expect(figure.style.maxWidth).toBe('320px')
    expect(figure.querySelector('figcaption')).toHaveTextContent('Nossa nova loja, inaugurada em março.')
    expect(figure).toContainElement(screen.getByRole('img', { name: 'Fachada da loja no centro' }))
  })

  it('encaminha a ref para a <img>', () => {
    const ref = createRef<HTMLImageElement>()
    render(<Image ref={ref} src="/a.jpg" alt="Produto" />)
    expect(ref.current).toBeInstanceOf(HTMLImageElement)
  })

  it('traduz o texto do substituto', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Image src="/x.jpg" alt="Orange backpack" />
      </OrangeProvider>,
    )
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByText('Image unavailable: Orange backpack')).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade (carregada, com erro, decorativa e com legenda)', async () => {
    const { container } = render(
      <div>
        <Image src="/a.jpg" alt="Tênis de corrida" ratio="1/1" bordered />
        <Image src="/b.jpg" alt="Mochila impermeável" ratio="4/3" data-testid="erro" />
        <Image src="/c.jpg" alt="" ratio="21/9" />
        <Image src="/d.jpg" alt="Equipe no escritório" caption="Equipe de produto, 2026." />
      </div>,
    )
    fireEvent.load(screen.getByRole('img', { name: 'Tênis de corrida' }))
    fireEvent.error(screen.getByTestId('erro'))
    await expectNoA11yViolations(container)
  })
})
