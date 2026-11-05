import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { SortableList, type SortableListProps, type SortableReorderDetails } from './SortableList'

interface Task {
  id: string
  title: string
  disabled?: boolean
}

const tasks: Task[] = [
  { id: 'checkout', title: 'Revisar checkout' },
  { id: 'busca', title: 'Corrigir filtro de busca' },
  { id: 'deps', title: 'Atualizar dependências' },
  { id: 'api', title: 'Documentar API de pedidos' },
]
const [checkout, busca, deps, api] = tasks

type HarnessProps = Partial<SortableListProps<Task>> & {
  initial?: Task[]
  onReorderSpy?: (items: Task[], details: SortableReorderDetails<Task>) => void
}

/** Lista controlada que aplica `onReorder`, como numa aplicação real. */
function Harness({ initial = tasks, onReorderSpy, ...props }: HarnessProps) {
  const [items, setItems] = useState(initial)
  return (
    <SortableList
      label="Prioridades da sprint"
      items={items}
      onReorder={(next, details) => {
        setItems(next)
        onReorderSpy?.(next, details)
      }}
      renderItem={(task) => <span>{task.title}</span>}
      {...props}
    />
  )
}

const handle = (title: string) => screen.getByRole('button', { name: new RegExp(`^Reordenar ${title},`) })
const status = () => screen.getByRole('status')
const itemOf = (title: string) => handle(title).closest('li') as HTMLLIElement
const order = () =>
  screen.getAllByRole('listitem').map((li) => li.querySelector('.or-sortable__content')?.textContent)

/** jsdom não tem layout: cada item ocupa 48px, com 2px entre eles (topo = posição × 50). */
function mockLayout() {
  const indexOf = (el: HTMLElement) =>
    el.classList.contains('or-sortable__item')
      ? Array.from(el.parentElement?.querySelectorAll(':scope > .or-sortable__item') ?? []).indexOf(el)
      : -1
  vi.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockImplementation(function (this: HTMLElement) {
    return Math.max(0, indexOf(this)) * 50
  })
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
    return indexOf(this) >= 0 ? 48 : 0
  })
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    return indexOf(this) >= 0 ? 320 : 0
  })
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const index = this instanceof HTMLElement ? indexOf(this) : -1
    const top = 100 + Math.max(0, index) * 50
    const height = index >= 0 ? 48 : 200
    return { x: 0, y: top, top, left: 0, right: 320, bottom: top + height, width: 320, height, toJSON: () => ({}) } as DOMRect
  })
}

// jsdom não implementa PointerEvent: um MouseEvent com pointerId/pointerType basta.
const hadPointerEvent = 'PointerEvent' in window
beforeAll(() => {
  if (hadPointerEvent) return
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number
    pointerType: string
    isPrimary: boolean
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init)
      this.pointerId = init.pointerId ?? 1
      this.pointerType = init.pointerType ?? 'mouse'
      this.isPrimary = init.isPrimary ?? true
    }
  }
  ;(window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventPolyfill
})
afterAll(() => {
  if (!hadPointerEvent) delete (window as unknown as { PointerEvent?: unknown }).PointerEvent
})

describe('SortableList', () => {
  it('renderiza uma lista nomeada com uma alça acessível por item', () => {
    render(<Harness />)
    const list = screen.getByRole('list', { name: 'Prioridades da sprint' })
    expect(list.tagName).toBe('UL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
    const grip = handle('Corrigir filtro de busca')
    expect(grip).toHaveAccessibleName('Reordenar Corrigir filtro de busca, posição 2 de 4')
    expect(grip).toHaveAccessibleDescription(/Pressione Espaço ou Enter para levantar o item/)
    expect(grip.querySelector('svg')).toHaveAttribute('data-icon', 'grip')
  })

  describe('teclado', () => {
    it('levanta, move e solta mantendo o foco na alça do item movido', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      const grip = handle('Corrigir filtro de busca')
      grip.focus()

      await user.keyboard(' ')
      expect(itemOf('Corrigir filtro de busca')).toHaveAttribute('data-dragging')
      expect(screen.getByRole('list')).toHaveAttribute('data-active', 'keyboard')
      expect(status()).toHaveTextContent(
        'Corrigir filtro de busca levantado. Posição 2 de 4. Use as setas para mover, Espaço para soltar, Esc para cancelar.',
      )

      await user.keyboard('{ArrowDown}')
      expect(status()).toHaveTextContent('Corrigir filtro de busca movido para a posição 3 de 4.')
      expect(grip).toHaveFocus()
      expect(grip).toHaveAccessibleName('Reordenar Corrigir filtro de busca, posição 3 de 4')
      expect(onReorder).not.toHaveBeenCalled()

      await user.keyboard('{ArrowDown}{ArrowDown}')
      expect(status()).toHaveTextContent('posição 4 de 4')

      await user.keyboard(' ')
      expect(onReorder).toHaveBeenCalledTimes(1)
      expect(onReorder).toHaveBeenCalledWith([checkout, deps, api, busca], { from: 1, to: 3, item: busca })
      expect(order()).toEqual([
        'Revisar checkout',
        'Atualizar dependências',
        'Documentar API de pedidos',
        'Corrigir filtro de busca',
      ])
      expect(handle('Corrigir filtro de busca')).toHaveFocus()
      expect(itemOf('Corrigir filtro de busca')).not.toHaveAttribute('data-dragging')
      expect(status()).toHaveTextContent('Corrigir filtro de busca solto na posição 4 de 4.')
    })

    it('Enter levanta e solta; Home e End levam às pontas', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      handle('Atualizar dependências').focus()

      await user.keyboard('{Enter}{End}')
      expect(status()).toHaveTextContent('Atualizar dependências movido para a posição 4 de 4.')
      await user.keyboard('{Home}')
      expect(status()).toHaveTextContent('Atualizar dependências movido para a posição 1 de 4.')
      await user.keyboard('{Enter}')

      expect(onReorder).toHaveBeenCalledWith([deps, checkout, busca, api], { from: 2, to: 0, item: deps })
      expect(handle('Atualizar dependências')).toHaveFocus()
      expect(handle('Atualizar dependências')).toHaveAccessibleName('Reordenar Atualizar dependências, posição 1 de 4')
    })

    it('Escape cancela, restaura a posição original e não propaga', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      const onDocumentKeyDown = vi.fn()
      document.addEventListener('keydown', onDocumentKeyDown)
      render(<Harness onReorderSpy={onReorder} />)
      const grip = handle('Revisar checkout')
      grip.focus()

      await user.keyboard(' {ArrowDown}{ArrowDown}')
      expect(grip).toHaveAccessibleName('Reordenar Revisar checkout, posição 3 de 4')
      onDocumentKeyDown.mockClear()
      await user.keyboard('{Escape}')
      document.removeEventListener('keydown', onDocumentKeyDown)

      expect(onReorder).not.toHaveBeenCalled()
      expect(onDocumentKeyDown).not.toHaveBeenCalled()
      expect(status()).toHaveTextContent('Movimento cancelado. Revisar checkout voltou para a posição 1 de 4.')
      expect(grip).toHaveFocus()
      expect(grip).toHaveAccessibleName('Reordenar Revisar checkout, posição 1 de 4')
      expect(itemOf('Revisar checkout')).not.toHaveAttribute('data-dragging')
      expect(order()[0]).toBe('Revisar checkout')
    })

    it('sair da alça com Tab solta o item e deixa o foco onde o usuário o levou', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      handle('Revisar checkout').focus()

      await user.keyboard(' {ArrowDown}')
      await user.tab()

      expect(onReorder).toHaveBeenCalledWith([busca, checkout, deps, api], { from: 0, to: 1, item: checkout })
      expect(screen.getByRole('button', { name: 'Mover para baixo: Revisar checkout' })).toHaveFocus()
    })

    it('na orientação horizontal usa as setas para a esquerda e a direita', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness orientation="horizontal" onReorderSpy={onReorder} />)
      expect(screen.getByRole('list')).toHaveClass('or-sortable--horizontal')
      expect(screen.getByRole('button', { name: 'Mover para a direita: Revisar checkout' })).toBeEnabled()
      handle('Revisar checkout').focus()

      await user.keyboard(' {ArrowDown}')
      expect(status()).toHaveTextContent('levantado')
      await user.keyboard('{ArrowRight} ')
      expect(onReorder).toHaveBeenCalledWith([busca, checkout, deps, api], { from: 0, to: 1, item: checkout })
    })
  })

  describe('ponteiro', () => {
    it('arrasta com pointerdown/move/up, mostra o lugar de destino e reordena ao soltar', () => {
      mockLayout()
      const onReorder = vi.fn()
      const { container } = render(<Harness onReorderSpy={onReorder} />)
      const grip = handle('Revisar checkout')

      fireEvent.pointerDown(grip, { pointerId: 1, clientX: 20, clientY: 300 })
      expect(grip).toHaveFocus()
      // +80px: o centro (24 + 80) passa o centro do 2º item (74).
      fireEvent.pointerMove(grip, { pointerId: 1, clientX: 20, clientY: 380 })

      const list = screen.getByRole('list')
      const dragged = itemOf('Revisar checkout')
      expect(list).toHaveAttribute('data-active', 'pointer')
      expect(dragged).toHaveAttribute('data-dragging')
      expect(dragged.style.getPropertyValue('--_drag-y')).toBe('80px')
      expect(itemOf('Corrigir filtro de busca').style.getPropertyValue('--_shift-y')).toBe('-50px')
      expect(container.querySelector('.or-sortable__placeholder')).toHaveStyle({ transform: 'translate(0px, 50px)' })
      expect(status()).toHaveTextContent('Revisar checkout movido para a posição 2 de 4.')
      expect(grip).toHaveAccessibleName('Reordenar Revisar checkout, posição 2 de 4')

      // +130px: passa também o centro do 3º item (124).
      fireEvent.pointerMove(grip, { pointerId: 1, clientX: 20, clientY: 430 })
      expect(container.querySelector('.or-sortable__placeholder')).toHaveStyle({ transform: 'translate(0px, 100px)' })
      expect(onReorder).not.toHaveBeenCalled()

      fireEvent.pointerUp(grip, { pointerId: 1, clientX: 20, clientY: 430 })
      expect(onReorder).toHaveBeenCalledTimes(1)
      expect(onReorder).toHaveBeenCalledWith([busca, deps, checkout, api], { from: 0, to: 2, item: checkout })
      expect(order()).toEqual([
        'Corrigir filtro de busca',
        'Atualizar dependências',
        'Revisar checkout',
        'Documentar API de pedidos',
      ])
      expect(status()).toHaveTextContent('Revisar checkout solto na posição 3 de 4.')
      expect(list).not.toHaveAttribute('data-active')
      expect(container.querySelector('.or-sortable__placeholder')).toBeNull()
      expect(itemOf('Revisar checkout').style.getPropertyValue('--_drag-y')).toBe('')
      expect(handle('Revisar checkout')).toHaveFocus()
    })

    it('não arrasta em cliques simples (movimento abaixo do limiar)', () => {
      mockLayout()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      const grip = handle('Revisar checkout')

      fireEvent.pointerDown(grip, { pointerId: 1, clientX: 20, clientY: 300 })
      fireEvent.pointerMove(grip, { pointerId: 1, clientX: 22, clientY: 303 })
      expect(screen.getByRole('list')).not.toHaveAttribute('data-active')
      fireEvent.pointerUp(grip, { pointerId: 1, clientX: 22, clientY: 303 })

      expect(onReorder).not.toHaveBeenCalled()
      expect(status()).toBeEmptyDOMElement()
    })

    it('Escape durante o arraste cancela e devolve o item', () => {
      mockLayout()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      const grip = handle('Revisar checkout')

      fireEvent.pointerDown(grip, { pointerId: 1, clientX: 20, clientY: 300 })
      fireEvent.pointerMove(grip, { pointerId: 1, clientX: 20, clientY: 430 })
      fireEvent.keyDown(grip, { key: 'Escape' })
      fireEvent.pointerUp(grip, { pointerId: 1, clientX: 20, clientY: 430 })

      expect(onReorder).not.toHaveBeenCalled()
      expect(status()).toHaveTextContent('Movimento cancelado. Revisar checkout voltou para a posição 1 de 4.')
      expect(order()[0]).toBe('Revisar checkout')
      expect(screen.getByRole('list')).not.toHaveAttribute('data-active')
    })

    it('rola o contêiner sozinho quando o item arrastado chega perto da borda', () => {
      mockLayout()
      render(<Harness style={{ maxHeight: 200, overflowY: 'auto' }} />)
      const list = screen.getByRole('list')
      let scrollTop = 0
      Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 600 })
      Object.defineProperty(list, 'clientHeight', { configurable: true, value: 200 })
      Object.defineProperty(list, 'scrollTop', {
        configurable: true,
        get: () => scrollTop,
        set: (value: number) => {
          scrollTop = value
        },
      })
      const grip = handle('Revisar checkout')

      // A lista ocupa 100–300px na tela; 260px está na faixa de 48px junto à borda de baixo.
      fireEvent.pointerDown(grip, { pointerId: 1, clientX: 20, clientY: 120 })
      fireEvent.pointerMove(grip, { pointerId: 1, clientX: 20, clientY: 260 })

      expect(scrollTop).toBeGreaterThan(0)
      // O item acompanha a rolagem: deslocamento do ponteiro + quanto a lista rolou.
      expect(itemOf('Revisar checkout').style.getPropertyValue('--_drag-y')).toBe(`${140 + scrollTop}px`)
      fireEvent.pointerUp(grip, { pointerId: 1, clientX: 20, clientY: 260 })
      expect(screen.getByRole('list')).not.toHaveAttribute('data-active')
    })

    it('pointercancel cancela o arraste', () => {
      mockLayout()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      const grip = handle('Revisar checkout')

      fireEvent.pointerDown(grip, { pointerId: 1, clientX: 20, clientY: 300 })
      fireEvent.pointerMove(grip, { pointerId: 1, clientX: 20, clientY: 400 })
      fireEvent.pointerCancel(grip, { pointerId: 1 })

      expect(onReorder).not.toHaveBeenCalled()
      expect(status()).toHaveTextContent('Movimento cancelado')
    })

    it('anima os vizinhos (FLIP) e assenta o item solto com mola', async () => {
      mockLayout()
      const user = userEvent.setup()
      render(<Harness />)

      await user.click(screen.getByRole('button', { name: 'Mover para baixo: Revisar checkout' }))

      const moved = itemOf('Revisar checkout')
      expect(moved.style.transform).toBe('')
      expect(moved.style.transition).toBe('')
      // Ao soltar (teclado ou ponteiro), o item solto assenta com a mola (data-settling).
      handle('Revisar checkout').focus()
      await user.keyboard(' {ArrowUp} ')
      expect(itemOf('Revisar checkout')).toHaveAttribute('data-settling')
    })

    it('em movimento reduzido reordena na hora, sem FLIP nem mola', async () => {
      mockLayout()
      vi.spyOn(window, 'matchMedia').mockImplementation(
        (query: string) =>
          ({
            matches: query.includes('prefers-reduced-motion'),
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          }) as MediaQueryList,
      )
      const user = userEvent.setup()
      render(<Harness />)
      handle('Corrigir filtro de busca').focus()
      await user.keyboard(' {ArrowUp} ')
      expect(order()[0]).toBe('Corrigir filtro de busca')
      expect(itemOf('Corrigir filtro de busca')).not.toHaveAttribute('data-settling')
      expect(itemOf('Corrigir filtro de busca').style.transition).toBe('')
    })
  })

  describe('alternativa de clique único (WCAG 2.5.7)', () => {
    it('botões movem o item um passo e mantêm o foco no botão usado', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness onReorderSpy={onReorder} />)
      expect(screen.getByRole('button', { name: 'Mover para cima: Revisar checkout' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Mover para baixo: Documentar API de pedidos' })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'Mover para baixo: Revisar checkout' }))
      expect(onReorder).toHaveBeenCalledWith([busca, checkout, deps, api], { from: 0, to: 1, item: checkout })
      expect(screen.getByRole('button', { name: 'Mover para baixo: Revisar checkout' })).toHaveFocus()
      expect(status()).toHaveTextContent('Revisar checkout movido para a posição 2 de 4.')
      expect(handle('Revisar checkout')).toHaveAccessibleName('Reordenar Revisar checkout, posição 2 de 4')

      // No topo, "para cima" fica desabilitado: o foco passa para "para baixo".
      await user.click(screen.getByRole('button', { name: 'Mover para cima: Revisar checkout' }))
      expect(onReorder).toHaveBeenLastCalledWith([checkout, busca, deps, api], { from: 1, to: 0, item: checkout })
      expect(screen.getByRole('button', { name: 'Mover para cima: Revisar checkout' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Mover para baixo: Revisar checkout' })).toHaveFocus()
    })

    it('menu oferece topo, cima, baixo e fim', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness moveControls="menu" onReorderSpy={onReorder} />)
      expect(screen.queryByRole('button', { name: /^Mover para baixo/ })).not.toBeInTheDocument()

      const trigger = screen.getByRole('button', { name: 'Mover Documentar API de pedidos' })
      await user.click(trigger)
      const menu = await screen.findByRole('menu')
      expect(within(menu).getByRole('menuitem', { name: 'Mover para baixo' })).toHaveAttribute('aria-disabled', 'true')
      expect(within(menu).getByRole('menuitem', { name: 'Mover para o fim' })).toHaveAttribute('aria-disabled', 'true')

      await user.click(within(menu).getByRole('menuitem', { name: 'Mover para o topo' }))
      expect(onReorder).toHaveBeenCalledWith([api, checkout, busca, deps], { from: 3, to: 0, item: api })
      expect(order()[0]).toBe('Documentar API de pedidos')
      expect(screen.getByRole('button', { name: 'Mover Documentar API de pedidos' })).toHaveFocus()
      expect(status()).toHaveTextContent('Documentar API de pedidos movido para a posição 1 de 4.')
    })

    it('moveControls="none" não renderiza controles extras', () => {
      render(<Harness moveControls="none" />)
      expect(screen.getAllByRole('button')).toHaveLength(4)
    })
  })

  describe('itens desabilitados', () => {
    const withLocked = [checkout, busca, { ...deps, disabled: true }, api]

    it('item desabilitado não se move e os demais passam por ele sem tirá-lo do lugar', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(<Harness initial={withLocked} onReorderSpy={onReorder} />)

      const lockedHandle = handle('Atualizar dependências')
      expect(lockedHandle).toBeDisabled()
      expect(lockedHandle.querySelector('svg')).toHaveAttribute('data-icon', 'lock')
      expect(screen.getByRole('button', { name: 'Mover para cima: Atualizar dependências' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Mover para baixo: Atualizar dependências' })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'Mover para baixo: Corrigir filtro de busca' }))
      expect(onReorder).toHaveBeenLastCalledWith([checkout, api, withLocked[2], busca], {
        from: 1,
        to: 3,
        item: busca,
      })
      expect(order()[2]).toBe('Atualizar dependências')

      handle('Revisar checkout').focus()
      await user.keyboard(' {End}')
      expect(status()).toHaveTextContent('Revisar checkout movido para a posição 4 de 4.')
      await user.keyboard('{ArrowUp}')
      // Pula a posição 3, ocupada pelo item travado.
      expect(status()).toHaveTextContent('Revisar checkout movido para a posição 2 de 4.')
      await user.keyboard(' ')
      expect(order()).toEqual([
        'Documentar API de pedidos',
        'Revisar checkout',
        'Atualizar dependências',
        'Corrigir filtro de busca',
      ])
    })

    it('ignora o ponteiro em itens desabilitados', () => {
      mockLayout()
      const onReorder = vi.fn()
      render(<Harness initial={withLocked} onReorderSpy={onReorder} />)
      const lockedHandle = handle('Atualizar dependências')
      fireEvent.pointerDown(lockedHandle, { pointerId: 1, clientX: 20, clientY: 300 })
      fireEvent.pointerMove(lockedHandle, { pointerId: 1, clientX: 20, clientY: 200 })
      fireEvent.pointerUp(lockedHandle, { pointerId: 1, clientX: 20, clientY: 200 })
      expect(screen.getByRole('list')).not.toHaveAttribute('data-active')
      expect(onReorder).not.toHaveBeenCalled()
    })

    it('disabled na lista desabilita todas as alças e controles', () => {
      render(<Harness disabled />)
      for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
      expect(handle('Revisar checkout').querySelector('svg')).toHaveAttribute('data-icon', 'grip')
    })
  })

  describe('API', () => {
    it('funciona sem controle (defaultItems) e aceita itens de texto', async () => {
      const user = userEvent.setup()
      const onReorder = vi.fn()
      render(
        <SortableList
          label="Categorias do cardápio"
          defaultItems={['Bebidas', 'Lanches', 'Sobremesas']}
          onReorder={onReorder}
          renderItem={(category) => category}
        />,
      )
      await user.click(screen.getByRole('button', { name: 'Mover para cima: Sobremesas' }))
      expect(onReorder).toHaveBeenCalledWith(['Bebidas', 'Sobremesas', 'Lanches'], {
        from: 2,
        to: 1,
        item: 'Sobremesas',
      })
      expect(handle('Sobremesas')).toHaveAccessibleName('Reordenar Sobremesas, posição 2 de 3')
    })

    it('usa getKey/getItemLabel e passa o estado para renderItem', async () => {
      const user = userEvent.setup()
      const steps = [
        { code: 'triagem', nome: 'Triagem do pedido' },
        { code: 'separacao', nome: 'Separação no estoque' },
      ]
      const renderItem = vi.fn((step: (typeof steps)[number], state: { index: number; total: number }) => (
        <span>
          {state.index + 1}/{state.total} {step.nome}
        </span>
      ))
      render(
        <SortableList
          label="Etapas"
          items={steps}
          getKey={(step) => step.code}
          getItemLabel={(step) => step.nome}
          renderItem={renderItem}
        />,
      )
      expect(handle('Separação no estoque')).toBeInTheDocument()
      expect(renderItem).toHaveBeenCalledWith(steps[1], { index: 1, total: 2, isDragging: false, disabled: false })

      handle('Triagem do pedido').focus()
      await user.keyboard(' {ArrowDown}')
      expect(renderItem).toHaveBeenLastCalledWith(steps[1], { index: 0, total: 2, isDragging: false, disabled: false })
      expect(screen.getByText('2/2 Triagem do pedido')).toBeInTheDocument()
    })

    it('announcements substitui os textos anunciados', async () => {
      const user = userEvent.setup()
      render(
        <Harness
          announcements={{
            lifted: ({ label, position, total }) => `Pegou ${label} (${position}/${total})`,
            dropped: ({ label, position, initialPosition }) => `${label}: de ${initialPosition} para ${position}`,
          }}
        />,
      )
      handle('Revisar checkout').focus()
      await user.keyboard(' ')
      expect(status()).toHaveTextContent('Pegou Revisar checkout (1/4)')
      await user.keyboard('{ArrowDown}')
      expect(status()).toHaveTextContent('Revisar checkout movido para a posição 2 de 4.')
      await user.keyboard(' ')
      expect(status()).toHaveTextContent('Revisar checkout: de 1 para 2')
    })

    it('encerra o arraste se os itens mudarem por fora', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<SortableList label="Tarefas" items={tasks} renderItem={(task) => task.title} />)
      handle('Revisar checkout').focus()
      await user.keyboard(' ')
      expect(screen.getByRole('list')).toHaveAttribute('data-active', 'keyboard')
      act(() => {
        rerender(<SortableList label="Tarefas" items={tasks.slice(1)} renderItem={(task) => task.title} />)
      })
      expect(screen.getByRole('list')).not.toHaveAttribute('data-active')
    })
  })

  it('não possui violações de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <Harness initial={[checkout, { ...busca, disabled: true }, deps]} />
        <Harness label="Categorias" moveControls="menu" />
        <Harness label="Abas do painel" orientation="horizontal" />
      </div>,
    )
    await expectNoA11yViolations(container)

    screen.getAllByRole('button', { name: /^Reordenar Revisar checkout/ })[0].focus()
    await user.keyboard(' {ArrowDown}')
    await expectNoA11yViolations(container)
  })
})
