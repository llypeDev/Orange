import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Splitter, SplitterHandle, SplitterPanel, type SplitterProps } from './Splitter'

// jsdom não tem PointerEvent: um MouseEvent com pointerId/pointerType basta para o React.
class TestPointerEvent extends MouseEvent {
  pointerId: number
  pointerType: string
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init)
    this.pointerId = init.pointerId ?? 1
    this.pointerType = init.pointerType ?? 'mouse'
  }
}

const originalPointerEvent = window.PointerEvent
beforeAll(() => {
  window.PointerEvent = TestPointerEvent as unknown as typeof PointerEvent
})
afterAll(() => {
  window.PointerEvent = originalPointerEvent
})
beforeEach(() => {
  localStorage.clear()
})

const rect = (width: number, height: number) =>
  ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width,
    height,
    right: width,
    bottom: height,
    toJSON: () => ({}),
  }) as DOMRect

const tracksOf = (element: HTMLElement) => element.style.getPropertyValue('--_tracks')

function ListDetail(props: Partial<SplitterProps>) {
  return (
    <Splitter label="Pedidos" defaultSizes={[30, 70]} {...props}>
      <SplitterPanel id="lista" label="Lista de pedidos" minSize={20} maxSize={60}>
        Pedidos de hoje
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel label="Detalhe do pedido" minSize={30}>
        Pedido #4821
      </SplitterPanel>
    </Splitter>
  )
}

function EditorConsole(props: Partial<SplitterProps>) {
  return (
    <Splitter label="Editor" orientation="vertical" defaultSizes={[70, 30]} {...props}>
      <SplitterPanel label="Editor e prévia" minSize={30}>
        Descrição do produto
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel id="console" label="Console de logs" collapsible minSize={15}>
        Rascunho salvo
      </SplitterPanel>
    </Splitter>
  )
}

function ThreePanels(props: Partial<SplitterProps>) {
  return (
    <Splitter label="Catálogo" defaultSizes={[20, 50, 30]} {...props}>
      <SplitterPanel id="filtros" label="Filtros" collapsible minSize={15} maxSize={30}>
        Categorias
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel id="resultados" label="Resultados" minSize={30}>
        48 produtos
      </SplitterPanel>
      <SplitterHandle />
      <SplitterPanel id="detalhes" label="Detalhes do produto" minSize={20} maxSize={40}>
        Café especial 250 g
      </SplitterPanel>
    </Splitter>
  )
}

describe('Splitter', () => {
  it('renderiza o separador com os atributos do padrão Window Splitter', () => {
    render(<ListDetail />)
    const group = screen.getByRole('group', { name: 'Pedidos' })
    expect(group).toHaveClass('or-splitter', 'or-splitter--horizontal')
    expect(tracksOf(group)).toBe('minmax(0, 30fr) var(--or-border-thin) minmax(0, 70fr)')

    const handle = screen.getByRole('separator', { name: 'Redimensionar Lista de pedidos' })
    expect(handle).toHaveAttribute('tabindex', '0')
    // Painéis lado a lado → o separador em si é vertical.
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    expect(handle).toHaveAttribute('aria-valuenow', '30')
    expect(handle).toHaveAttribute('aria-valuemin', '20')
    expect(handle).toHaveAttribute('aria-valuemax', '60')
    expect(handle).toHaveAttribute('aria-valuetext', '30%')
    expect(handle).toHaveAttribute('aria-controls', 'lista')
    expect(document.getElementById('lista')).toHaveTextContent('Pedidos de hoje')
    expect(handle.querySelector('.or-splitter__grip svg')).toHaveAttribute('data-icon', 'grip')
  })

  it('no layout vertical o separador é horizontal e controla o painel gerado', () => {
    render(<EditorConsole />)
    const handle = screen.getByRole('separator', { name: 'Redimensionar Editor e prévia' })
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal')
    const controls = handle.getAttribute('aria-controls')!
    expect(document.getElementById(controls)).toHaveTextContent('Descrição do produto')
    expect(screen.getByRole('group')).toHaveClass('or-splitter--vertical')
  })

  it('usa o idioma do OrangeProvider no nome do separador', () => {
    render(
      <OrangeProvider locale="en-US">
        <ListDetail />
      </OrangeProvider>,
    )
    expect(screen.getByRole('separator', { name: 'Resize Lista de pedidos' })).toBeInTheDocument()
  })

  it('redimensiona com as setas (passo de 2%) e com Shift + seta (10%)', async () => {
    const user = userEvent.setup()
    const onResizeEnd = vi.fn()
    render(<ListDetail onResizeEnd={onResizeEnd} />)
    const handle = screen.getByRole('separator')
    await user.tab()
    expect(handle).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(handle).toHaveAttribute('aria-valuenow', '32')
    expect(onResizeEnd).toHaveBeenLastCalledWith([32, 68])
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(handle).toHaveAttribute('aria-valuenow', '28')
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}')
    expect(handle).toHaveAttribute('aria-valuenow', '38')
    expect(tracksOf(screen.getByRole('group'))).toBe(
      'minmax(0, 38fr) var(--or-border-thin) minmax(0, 62fr)',
    )
    // Setas da outra orientação não fazem nada.
    await user.keyboard('{ArrowDown}{ArrowUp}')
    expect(handle).toHaveAttribute('aria-valuenow', '38')
    // As setas não animam a grade.
    expect(screen.getByRole('group')).not.toHaveAttribute('data-animate')
  })

  it('aceita passos personalizados e usa ↑/↓ no layout vertical', async () => {
    const user = userEvent.setup()
    render(<EditorConsole step={5} shiftStep={20} />)
    const handle = screen.getByRole('separator')
    handle.focus()
    await user.keyboard('{ArrowDown}')
    expect(handle).toHaveAttribute('aria-valuenow', '75')
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}')
    expect(handle).toHaveAttribute('aria-valuenow', '55')
    await user.keyboard('{ArrowLeft}')
    expect(handle).toHaveAttribute('aria-valuenow', '55')
  })

  it('Home e End levam ao mínimo e ao máximo e animam o salto', async () => {
    const user = userEvent.setup()
    render(<ListDetail />)
    const group = screen.getByRole('group')
    const handle = screen.getByRole('separator')
    handle.focus()
    await user.keyboard('{End}')
    expect(handle).toHaveAttribute('aria-valuenow', '60')
    expect(group).toHaveAttribute('data-animate')
    await user.keyboard('{Home}')
    expect(handle).toHaveAttribute('aria-valuenow', '20')
    await user.keyboard('{ArrowRight}')
    expect(handle).toHaveAttribute('aria-valuenow', '22')
    expect(group).not.toHaveAttribute('data-animate')
  })

  it('respeita mínimo e máximo dos dois vizinhos', async () => {
    const user = userEvent.setup()
    render(
      <Splitter defaultSizes={[50, 50]}>
        <SplitterPanel label="Lista" minSize={10} maxSize={90} />
        <SplitterHandle />
        <SplitterPanel label="Detalhe" minSize={35} maxSize={70} />
      </Splitter>,
    )
    const handle = screen.getByRole('separator')
    // O máximo da lista é limitado pelo mínimo do detalhe (100 − 35); o mínimo, pelo máximo dele (100 − 70).
    expect(handle).toHaveAttribute('aria-valuemin', '30')
    expect(handle).toHaveAttribute('aria-valuemax', '65')
    handle.focus()
    await user.keyboard('{End}')
    expect(handle).toHaveAttribute('aria-valuenow', '65')
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}')
    expect(handle).toHaveAttribute('aria-valuenow', '65')
    await user.keyboard('{Home}')
    expect(handle).toHaveAttribute('aria-valuenow', '30')
    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    expect(handle).toHaveAttribute('aria-valuenow', '30')
  })

  it('Enter recolhe o painel primário recolhível e restaura o tamanho anterior', async () => {
    const user = userEvent.setup()
    const onResizeEnd = vi.fn()
    render(
      <Splitter defaultSizes={[25, 75]} onResizeEnd={onResizeEnd}>
        <SplitterPanel id="filtros" label="Filtros" collapsible minSize={15}>
          Categorias
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel label="Resultados" minSize={40}>
          Produtos
        </SplitterPanel>
      </Splitter>,
    )
    const group = document.querySelector<HTMLElement>('.or-splitter')!
    const handle = screen.getByRole('separator', { name: 'Redimensionar Filtros' })
    const panel = document.getElementById('filtros')!
    // Recolhível: o separador alcança 0 (recolhido).
    expect(handle).toHaveAttribute('aria-valuemin', '0')
    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(handle).toHaveAttribute('aria-valuenow', '27')

    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-valuenow', '0')
    expect(handle).toHaveAttribute('aria-valuetext', 'Painel Filtros recolhido')
    expect(handle).toHaveAttribute('data-collapsed')
    expect(handle).toHaveAttribute('data-edge', 'start')
    expect(panel).toHaveAttribute('data-collapsed')
    expect(panel).toHaveAttribute('data-hidden')
    expect(group).toHaveAttribute('data-animate')
    expect(onResizeEnd).toHaveBeenLastCalledWith([0, 100])

    // Setas não reabrem "para menos" nem empurram o painel recolhido.
    await user.keyboard('{ArrowLeft}{Home}')
    expect(handle).toHaveAttribute('aria-valuenow', '0')

    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-valuenow', '27')
    expect(handle).toHaveAttribute('aria-valuetext', '27%')
    expect(panel).not.toHaveAttribute('data-collapsed')
    expect(onResizeEnd).toHaveBeenLastCalledWith([27, 73])
  })

  it('Enter recolhe o painel secundário quando só ele é recolhível (console embaixo)', async () => {
    const user = userEvent.setup()
    render(<EditorConsole />)
    const handle = screen.getByRole('separator')
    handle.focus()
    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-valuenow', '100')
    expect(handle).toHaveAttribute('aria-valuetext', 'Painel Console de logs recolhido')
    expect(document.getElementById('console')).toHaveAttribute('data-collapsed')
    expect(handle).toHaveAttribute('data-edge', 'end')
    await user.keyboard('{ArrowDown}{End}')
    expect(handle).toHaveAttribute('aria-valuenow', '100')
    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-valuenow', '70')
  })

  it('Enter não faz nada sem painel recolhível', async () => {
    const user = userEvent.setup()
    const onSizesChange = vi.fn()
    render(<ListDetail onSizesChange={onSizesChange} />)
    screen.getByRole('separator').focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '30')
    expect(onSizesChange).not.toHaveBeenCalled()
  })

  it('defaultCollapsed começa recolhido e Enter abre no tamanho padrão', async () => {
    const user = userEvent.setup()
    render(
      <Splitter defaultSizes={[25, 75]}>
        <SplitterPanel label="Filtros" collapsible defaultCollapsed minSize={15} />
        <SplitterHandle />
        <SplitterPanel label="Resultados" />
      </Splitter>,
    )
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-valuenow', '0')
    handle.focus()
    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-valuenow', '25')
  })

  it('arrasta com Pointer Events, captura o ponteiro e calcula pelo retângulo do contêiner', () => {
    const onSizesChange = vi.fn()
    const onResizeEnd = vi.fn()
    render(<ListDetail onSizesChange={onSizesChange} onResizeEnd={onResizeEnd} />)
    const group = screen.getByRole('group')
    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue(rect(1000, 400))
    const handle = screen.getByRole('separator')
    const setPointerCapture = vi.fn()
    const releasePointerCapture = vi.fn()
    Object.assign(handle, {
      setPointerCapture,
      releasePointerCapture,
      hasPointerCapture: () => true,
    })

    fireEvent.pointerDown(handle, { clientX: 300, pointerId: 7, button: 0 })
    expect(setPointerCapture).toHaveBeenCalledWith(7)
    expect(group).toHaveAttribute('data-dragging')
    expect(handle).toHaveAttribute('data-dragging')
    expect(document.body.style.cursor).toBe('col-resize')
    expect(document.body.style.userSelect).toBe('none')

    fireEvent.pointerMove(handle, { clientX: 400, pointerId: 7 })
    expect(handle).toHaveAttribute('aria-valuenow', '40')
    expect(onSizesChange).toHaveBeenLastCalledWith([40, 60])
    // O arraste não anima a grade.
    expect(group).not.toHaveAttribute('data-animate')
    // Outro ponteiro (segundo dedo) é ignorado.
    fireEvent.pointerMove(handle, { clientX: 100, pointerId: 9 })
    expect(handle).toHaveAttribute('aria-valuenow', '40')
    // Além do máximo: limita em 60.
    fireEvent.pointerMove(handle, { clientX: 950, pointerId: 7 })
    expect(handle).toHaveAttribute('aria-valuenow', '60')
    expect(onResizeEnd).not.toHaveBeenCalled()

    fireEvent.pointerUp(handle, { clientX: 950, pointerId: 7 })
    expect(releasePointerCapture).toHaveBeenCalledWith(7)
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
    expect(onResizeEnd).toHaveBeenCalledWith([60, 40])
    expect(group).not.toHaveAttribute('data-dragging')
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
  })

  it('arrastar abaixo do mínimo recolhe um painel recolhível; Enter volta ao tamanho de antes', async () => {
    const user = userEvent.setup()
    render(<EditorConsole />)
    const group = screen.getByRole('group')
    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue(rect(800, 500))
    const handle = screen.getByRole('separator')

    fireEvent.pointerDown(handle, { clientY: 350, button: 0 })
    expect(document.body.style.cursor).toBe('row-resize')
    fireEvent.pointerMove(handle, { clientY: 300 })
    expect(handle).toHaveAttribute('aria-valuenow', '60')
    fireEvent.pointerMove(handle, { clientY: 490 })
    expect(handle).toHaveAttribute('aria-valuenow', '100')
    expect(document.getElementById('console')).toHaveAttribute('data-collapsed')
    fireEvent.pointerUp(handle, { clientY: 490 })

    handle.focus()
    await user.keyboard('{Enter}')
    expect(handle).toHaveAttribute('aria-valuenow', '70')
  })

  it('pointercancel encerra o arraste e um clique sem movimento não dispara onResizeEnd', () => {
    const onResizeEnd = vi.fn()
    render(<ListDetail onResizeEnd={onResizeEnd} />)
    const group = screen.getByRole('group')
    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue(rect(1000, 400))
    const handle = screen.getByRole('separator')
    fireEvent.pointerDown(handle, { clientX: 300, button: 0, pointerType: 'touch' })
    fireEvent.pointerCancel(handle)
    expect(group).not.toHaveAttribute('data-dragging')
    fireEvent.pointerDown(handle, { clientX: 300, button: 0 })
    fireEvent.pointerUp(handle)
    expect(onResizeEnd).not.toHaveBeenCalled()
    // Botão direito não inicia arraste.
    fireEvent.pointerDown(handle, { clientX: 300, button: 2 })
    expect(group).not.toHaveAttribute('data-dragging')
  })

  it('clique duplo volta aos tamanhos padrão', async () => {
    const user = userEvent.setup()
    const onResizeEnd = vi.fn()
    render(<ListDetail onResizeEnd={onResizeEnd} />)
    const handle = screen.getByRole('separator')
    handle.focus()
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}')
    expect(handle).toHaveAttribute('aria-valuenow', '40')
    fireEvent.doubleClick(handle)
    expect(handle).toHaveAttribute('aria-valuenow', '30')
    expect(screen.getByRole('group')).toHaveAttribute('data-animate')
    expect(onResizeEnd).toHaveBeenLastCalledWith([30, 70])
  })

  it('funciona não controlado (defaultSizes) e controlado (sizes + onSizesChange)', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [sizes, setSizes] = useState([40, 60])
      return (
        <>
          <ListDetail sizes={sizes} onSizesChange={setSizes} />
          <output data-testid="sizes">{sizes.join('/')}</output>
          <button type="button" onClick={() => setSizes([25, 75])}>
            Compactar lista
          </button>
        </>
      )
    }
    render(<Controlled />)
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-valuenow', '40')
    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByTestId('sizes')).toHaveTextContent('42/58')
    await user.click(screen.getByRole('button', { name: 'Compactar lista' }))
    expect(handle).toHaveAttribute('aria-valuenow', '25')
  })

  it('controlado sem atualizar o estado mantém os tamanhos', async () => {
    const user = userEvent.setup()
    const onSizesChange = vi.fn()
    render(<ListDetail sizes={[40, 60]} onSizesChange={onSizesChange} />)
    const handle = screen.getByRole('separator')
    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(onSizesChange).toHaveBeenCalledWith([42, 58])
    expect(handle).toHaveAttribute('aria-valuenow', '40')
  })

  it('storageKey restaura os tamanhos salvos e salva ao fim do redimensionamento', async () => {
    const user = userEvent.setup()
    localStorage.setItem('or-splitter:pedidos', JSON.stringify({ sizes: [45, 55] }))
    render(<ListDetail storageKey="pedidos" />)
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-valuenow', '45')
    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(JSON.parse(localStorage.getItem('or-splitter:pedidos')!)).toMatchObject({
      sizes: [47, 53],
    })
  })

  it('storageKey restaura o painel recolhido e o tamanho para reabrir', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      'or-splitter:catalogo',
      JSON.stringify({ sizes: [0, 60, 40], expanded: [26, 60, 40] }),
    )
    render(<ThreePanels storageKey="catalogo" />)
    const [filters] = screen.getAllByRole('separator')
    expect(filters).toHaveAttribute('aria-valuenow', '0')
    filters.focus()
    await user.keyboard('{Enter}')
    expect(filters).toHaveAttribute('aria-valuenow', '26')
  })

  it('ignora dados salvos inválidos', () => {
    localStorage.setItem('or-splitter:a', '{não é json')
    localStorage.setItem('or-splitter:b', JSON.stringify({ sizes: [10, 20, 70] }))
    render(
      <>
        <ListDetail storageKey="a" label="A" />
        <ListDetail storageKey="b" label="B" />
      </>,
    )
    for (const handle of screen.getAllByRole('separator')) {
      expect(handle).toHaveAttribute('aria-valuenow', '30')
    }
  })

  it('continua funcionando quando o localStorage lança erro', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Acesso negado', 'SecurityError')
    })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Cota excedida', 'QuotaExceededError')
    })
    const onResizeEnd = vi.fn()
    render(<ListDetail storageKey="pedidos" onResizeEnd={onResizeEnd} />)
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-valuenow', '30')
    handle.focus()
    await user.keyboard('{ArrowRight}')
    expect(setItem).toHaveBeenCalled()
    expect(handle).toHaveAttribute('aria-valuenow', '32')
    expect(onResizeEnd).toHaveBeenCalledWith([32, 68])
  })

  it('três painéis: cada separador mexe só nos seus vizinhos', async () => {
    const user = userEvent.setup()
    render(<ThreePanels />)
    const group = screen.getByRole('group', { name: 'Catálogo' })
    const [first, second] = screen.getAllByRole('separator')
    expect(first).toHaveAccessibleName('Redimensionar Filtros')
    expect(first).toHaveAttribute('aria-controls', 'filtros')
    expect(second).toHaveAccessibleName('Redimensionar Resultados')
    expect(second).toHaveAttribute('aria-controls', 'resultados')
    expect(second).toHaveAttribute('aria-valuenow', '50')
    expect(second).toHaveAttribute('aria-valuemin', '40')
    expect(second).toHaveAttribute('aria-valuemax', '60')

    first.focus()
    await user.keyboard('{ArrowRight}')
    expect(tracksOf(group)).toBe(
      'minmax(0, 22fr) var(--or-border-thin) minmax(0, 48fr) var(--or-border-thin) minmax(0, 30fr)',
    )
    expect(second).toHaveAttribute('aria-valuenow', '48')

    second.focus()
    await user.keyboard('{End}')
    expect(tracksOf(group)).toBe(
      'minmax(0, 22fr) var(--or-border-thin) minmax(0, 58fr) var(--or-border-thin) minmax(0, 20fr)',
    )
    await user.keyboard('{Home}')
    expect(second).toHaveAttribute('aria-valuenow', '38')

    first.focus()
    await user.keyboard('{Enter}')
    expect(tracksOf(group)).toBe(
      'minmax(0, 0fr) var(--or-border-thin) minmax(0, 60fr) var(--or-border-thin) minmax(0, 40fr)',
    )
    expect(first).toHaveAttribute('aria-valuetext', 'Painel Filtros recolhido')
    await user.keyboard('{Enter}')
    expect(first).toHaveAttribute('aria-valuenow', '22')
    expect(second).toHaveAttribute('aria-valuenow', '38')
  })

  it('três painéis: arrastar o segundo separador usa o tamanho útil do contêiner', () => {
    render(<ThreePanels />)
    const group = screen.getByRole('group')
    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue(rect(1000, 400))
    const [, second] = screen.getAllByRole('separator')
    fireEvent.pointerDown(second, { clientX: 700, button: 0 })
    fireEvent.pointerMove(second, { clientX: 650 })
    fireEvent.pointerUp(second, { clientX: 650 })
    expect(tracksOf(group)).toBe(
      'minmax(0, 20fr) var(--or-border-thin) minmax(0, 45fr) var(--or-border-thin) minmax(0, 35fr)',
    )
  })

  it('marca stackBelow para o empilhamento por CSS', () => {
    render(<ListDetail stackBelow="sm" />)
    expect(screen.getByRole('group')).toHaveAttribute('data-stack-below', 'sm')
  })

  it('painel que rola sem nada focável vira região focável; com foco interno, não', () => {
    // jsdom não faz layout: simula um painel com conteúdo maior que a área visível.
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400)
    const client = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(200)
    try {
      render(
        <Splitter>
          <SplitterPanel label="Chamados">
            <p>Troca de tamanho — tênis de corrida</p>
          </SplitterPanel>
          <SplitterHandle />
          <SplitterPanel label="Detalhe">
            <button type="button">Responder</button>
          </SplitterPanel>
        </Splitter>,
      )
      const region = screen.getByRole('region', { name: 'Chamados' })
      expect(region).toHaveAttribute('tabindex', '0')
      // O painel com um botão já é alcançável pelo teclado: continua um div comum.
      expect(screen.queryByRole('region', { name: 'Detalhe' })).not.toBeInTheDocument()
    } finally {
      scroll.mockRestore()
      client.mockRestore()
    }
  })

  it('exige SplitterPanel e SplitterHandle como filhos diretos do Splitter', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<SplitterPanel />)).toThrow(/filho direto de <Splitter>/)
    expect(() => render(<SplitterHandle />)).toThrow(/filho direto de <Splitter>/)
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ListDetail />
        <EditorConsole />
        <ThreePanels defaultSizes={[0, 60, 40]} />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
