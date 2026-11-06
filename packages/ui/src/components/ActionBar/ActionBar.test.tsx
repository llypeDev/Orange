import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { ConfirmDialog } from '../ConfirmDialog'
import { Dropdown, DropdownItem } from '../Dropdown'
import { IconButton } from '../IconButton'
import { Table, type TableColumn } from '../Table'
import { ActionBar } from './ActionBar'

interface Invoice {
  id: string
  number: string
  client: string
  total: string
}

const invoices: Invoice[] = [
  { id: 'f1', number: 'NF 1042', client: 'Padaria Aurora', total: 'R$ 1.280,00' },
  { id: 'f2', number: 'NF 1043', client: 'Studio Lume', total: 'R$ 640,00' },
  { id: 'f3', number: 'NF 1044', client: 'Café Tropeiro', total: 'R$ 2.115,50' },
]

const columns: TableColumn<Invoice>[] = [
  { key: 'number', header: 'Nota', rowHeader: true },
  { key: 'client', header: 'Cliente' },
  { key: 'total', header: 'Total', align: 'end' },
]

/** Integração real: Table selecionável + ActionBar controlada pela seleção. */
function Invoices({
  portal = false,
  confirmDelete = false,
  withFinalFocus = false,
}: {
  portal?: boolean
  confirmDelete?: boolean
  withFinalFocus?: boolean
}) {
  const [rows, setRows] = useState(invoices)
  const [selected, setSelected] = useState<string[]>([])
  const [confirming, setConfirming] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const remove = () => {
    setRows((current) => current.filter((row) => !selected.includes(row.id)))
    setSelected([])
  }
  return (
    <div style={{ position: 'relative' }}>
      <h2 ref={headingRef} tabIndex={-1}>
        Faturas de outubro
      </h2>
      <button type="button">Antes</button>
      <Table
        caption="Faturas"
        columns={columns}
        data={rows}
        selectable
        selectedRows={selected}
        onSelectedRowsChange={setSelected}
        getRowLabel={(row) => row.number}
      />
      <ActionBar
        open={selected.length > 0}
        count={selected.length}
        onDismiss={() => setSelected([])}
        portal={portal}
        finalFocus={withFinalFocus ? headingRef : undefined}
      >
        <Button onClick={() => setSelected([])}>Exportar</Button>
        <Button onClick={confirmDelete ? () => setConfirming(true) : remove}>Excluir</Button>
      </ActionBar>
      <button type="button">Depois</button>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        tone="danger"
        title={`Excluir ${selected.length} faturas?`}
        confirmLabel="Excluir faturas"
        onConfirm={remove}
      />
    </div>
  )
}

const rowCheckbox = (number: string) =>
  screen.getByRole('checkbox', { name: `Selecionar linha: ${number}` })

/** A região viva do ActionBar (a Table tem a sua própria `role="status"`). */
const liveRegion = () =>
  screen.getAllByRole('status').find((el) => el.classList.contains('or-action-bar__live'))!

describe('ActionBar', () => {
  it('fechada, não renderiza a barra — mas a região viva já está montada', () => {
    render(
      <ActionBar count={0}>
        <Button>Excluir</Button>
      </ActionBar>,
    )
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    const status = liveRegion()
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toBeEmptyDOMElement()
  })

  it('aberta: role="toolbar" com nome padrão, orientação e a contagem como descrição', () => {
    render(
      <ActionBar open count={3} onDismiss={() => {}} portal={false}>
        <Button>Exportar</Button>
      </ActionBar>,
    )
    const toolbar = screen.getByRole('toolbar', { name: 'Ações em lote' })
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal')
    expect(toolbar).toHaveAttribute('data-state', 'open')
    expect(toolbar).toHaveAccessibleDescription('3 selecionados')
    expect(within(toolbar).getByText('3 selecionados')).toBeInTheDocument()
  })

  it('pluraliza e formata a contagem no idioma do provider', () => {
    const { rerender } = render(<ActionBar open count={1} portal={false} />)
    const toolbar = () => screen.getByRole('toolbar')
    expect(toolbar()).toHaveTextContent('1 selecionado')
    expect(liveRegion()).toHaveTextContent('1 selecionado')
    rerender(<ActionBar open count={1234} portal={false} />)
    expect(toolbar()).toHaveTextContent('1.234 selecionados')
    rerender(<ActionBar open count={0} portal={false} />)
    expect(toolbar()).toHaveTextContent('0 selecionados')
    rerender(
      <OrangeProvider locale="en-US">
        <ActionBar open count={1} onDismiss={() => {}} portal={false} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('toolbar', { name: 'Bulk actions' })).toHaveTextContent('1 selected')
    expect(screen.getByRole('button', { name: 'Clear selection' })).toBeInTheDocument()
    rerender(
      <OrangeProvider locale="en-US">
        <ActionBar open count={1234} portal={false} />
      </OrangeProvider>,
    )
    expect(toolbar()).toHaveTextContent('1,234 selected')
    expect(liveRegion()).toHaveTextContent('1,234 selected')
  })

  it('label substitui o texto; aria-label, ref e ...rest chegam à raiz', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ActionBar
        ref={ref}
        open
        count={2}
        label="2 faturas selecionadas"
        aria-label="Ações das faturas"
        id="barra-faturas"
        className="extra"
        data-testid="barra"
        portal={false}
      />,
    )
    const toolbar = screen.getByRole('toolbar', { name: 'Ações das faturas' })
    expect(ref.current).toBe(toolbar)
    expect(toolbar).toHaveAttribute('id', 'barra-faturas')
    expect(toolbar).toHaveAttribute('data-testid', 'barra')
    expect(toolbar).toHaveClass('or-action-bar', 'extra')
    expect(toolbar).toHaveTextContent('2 faturas selecionadas')
    expect(toolbar).not.toHaveTextContent('2 selecionados')
    // Em texto, o label é o que se anuncia.
    expect(liveRegion()).toHaveTextContent('2 faturas selecionadas')
  })

  it('"Limpar seleção" só aparece com onDismiss e o chama no clique', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const { rerender } = render(<ActionBar open count={2} portal={false} />)
    expect(screen.queryByRole('button', { name: 'Limpar seleção' })).not.toBeInTheDocument()
    rerender(<ActionBar open count={2} onDismiss={onDismiss} portal={false} />)
    await user.click(screen.getByRole('button', { name: 'Limpar seleção' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('Escape com o foco na barra chama onDismiss e não propaga; fora dela, não', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    const documentListener = vi.fn()
    document.addEventListener('keydown', documentListener)
    render(
      <>
        <button type="button">Fora</button>
        <ActionBar open count={2} onDismiss={onDismiss} portal={false}>
          <Button>Exportar</Button>
        </ActionBar>
      </>,
    )
    screen.getByRole('button', { name: 'Fora' }).focus()
    await user.keyboard('{Escape}')
    expect(onDismiss).not.toHaveBeenCalled()

    documentListener.mockClear()
    screen.getByRole('button', { name: 'Exportar' }).focus()
    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(documentListener).not.toHaveBeenCalled()
    document.removeEventListener('keydown', documentListener)
  })

  it('marca as ações para o roving tabindex; a parada de Tab começa na primeira ação', () => {
    render(
      <ActionBar open count={2} onDismiss={() => {}} portal={false}>
        <Button>Exportar</Button>
        <IconButton icon="user" label="Atribuir responsável" />
        <Dropdown trigger={<Button>Mais ações</Button>}>
          <DropdownItem>Arquivar</DropdownItem>
        </Dropdown>
      </ActionBar>,
    )
    const clear = screen.getByRole('button', { name: 'Limpar seleção' })
    const exportar = screen.getByRole('button', { name: 'Exportar' })
    const assign = screen.getByRole('button', { name: 'Atribuir responsável' })
    const more = screen.getByRole('button', { name: 'Mais ações' })
    for (const item of [clear, exportar, assign, more])
      expect(item).toHaveAttribute('data-roving-item')
    expect(exportar).toHaveAttribute('tabindex', '0')
    for (const item of [clear, assign, more]) expect(item).toHaveAttribute('tabindex', '-1')
    // Buttons filhos diretos (e o gatilho do Dropdown) ficam ghost/sm como numa Toolbar.
    expect(exportar).toHaveClass('or-button--ghost', 'or-button--sm')
    expect(more).toHaveClass('or-button--ghost', 'or-button--sm')
  })

  it('botões dentro de fragmentos ou componentes próprios também entram nas setas', async () => {
    const user = userEvent.setup()
    function OrderActions() {
      return (
        <>
          <Button>Faturar</Button>
          <Button>Cancelar pedidos</Button>
        </>
      )
    }
    render(
      <>
        <button type="button">Antes</button>
        <ActionBar open count={2} onDismiss={() => {}}>
          <OrderActions />
        </ActionBar>
        <button type="button">Depois</button>
      </>,
    )
    const faturar = await screen.findByRole('button', { name: 'Faturar' })
    const cancelar = screen.getByRole('button', { name: 'Cancelar pedidos' })
    expect(faturar).toHaveAttribute('data-roving-item')
    expect(faturar).toHaveAttribute('tabindex', '0')
    expect(cancelar).toHaveAttribute('tabindex', '-1')
    // Em portal: entra pela primeira ação, as setas andam e o Tab sai para "Depois".
    screen.getByRole('button', { name: 'Antes' }).focus()
    await user.tab()
    expect(faturar).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(cancelar).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
  })

  it('em portal, outras paradas de Tab da barra (ex.: um campo) continuam alcançáveis', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Antes</button>
        <ActionBar open count={2}>
          <Button>Aplicar</Button>
          <input aria-label="Nova etiqueta" />
        </ActionBar>
        <button type="button">Depois</button>
      </>,
    )
    const aplicar = await screen.findByRole('button', { name: 'Aplicar' })
    const field = screen.getByRole('textbox', { name: 'Nova etiqueta' })
    screen.getByRole('button', { name: 'Antes' }).focus()
    await user.tab()
    expect(aplicar).toHaveFocus()
    await user.tab()
    expect(field).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Depois' })).toHaveFocus()
    await user.tab({ shift: true })
    expect(field).toHaveFocus()
    await user.tab({ shift: true })
    expect(aplicar).toHaveFocus()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Antes' })).toHaveFocus()
  })

  it('←/→ percorrem os itens (pulando desabilitados, com volta); Home/End vão às pontas', async () => {
    const user = userEvent.setup()
    render(
      <ActionBar open count={2} onDismiss={() => {}} portal={false}>
        <Button>Exportar</Button>
        <Button disabled>Mesclar</Button>
        <Button>Excluir</Button>
      </ActionBar>,
    )
    const clear = screen.getByRole('button', { name: 'Limpar seleção' })
    const exportar = screen.getByRole('button', { name: 'Exportar' })
    const excluir = screen.getByRole('button', { name: 'Excluir' })
    exportar.focus()
    await user.keyboard('{ArrowRight}')
    expect(excluir).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(clear).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(excluir).toHaveFocus()
    await user.keyboard('{Home}')
    expect(clear).toHaveFocus()
    await user.keyboard('{End}')
    expect(excluir).toHaveFocus()
    expect(excluir).toHaveAttribute('tabindex', '0')
    expect(exportar).toHaveAttribute('tabindex', '-1')
  })

  it('aparecer não rouba o foco de quem selecionou', async () => {
    const user = userEvent.setup()
    render(<Invoices />)
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    await user.click(rowCheckbox('NF 1042'))
    expect(screen.getByRole('toolbar', { name: 'Ações em lote' })).toBeInTheDocument()
    expect(rowCheckbox('NF 1042')).toHaveFocus()
  })

  it('anuncia a contagem quando ela muda — não a cada render — e limpa ao fechar', async () => {
    const user = userEvent.setup()
    render(<Invoices />)
    const status = liveRegion()
    await user.click(rowCheckbox('NF 1042'))
    expect(status).toHaveTextContent('1 selecionado')
    await user.click(rowCheckbox('NF 1043'))
    expect(status).toHaveTextContent('2 selecionados')
    await user.click(screen.getByRole('button', { name: 'Limpar seleção' }))
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    expect(status).toBeEmptyDOMElement()
  })

  it('renders sem mudança de contagem não tocam na região viva', () => {
    const { rerender } = render(
      <ActionBar open count={2} className="a" onDismiss={() => {}} portal={false} />,
    )
    const status = liveRegion()
    expect(status).toHaveTextContent('2 selecionados')
    const observer = new MutationObserver(() => {})
    observer.observe(status, { childList: true, subtree: true, characterData: true })
    rerender(<ActionBar open count={2} className="b" onDismiss={() => {}} portal={false} />)
    rerender(<ActionBar open count={2} className="c" onDismiss={() => {}} portal={false} />)
    expect(screen.getByRole('toolbar')).toHaveClass('c')
    // takeRecords: o MutationObserver entrega os registros de forma assíncrona.
    expect(observer.takeRecords()).toHaveLength(0)
    rerender(<ActionBar open count={3} className="c" onDismiss={() => {}} portal={false} />)
    expect(status).toHaveTextContent('3 selecionados')
    expect(observer.takeRecords().length).toBeGreaterThan(0)
    observer.disconnect()
  })

  it('ao fechar com o foco dentro, devolve o foco para onde ele estava (Limpar, Escape, ação)', async () => {
    const user = userEvent.setup()
    render(<Invoices />)
    await user.click(rowCheckbox('NF 1042'))
    await user.click(screen.getByRole('button', { name: 'Exportar' }))
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    expect(rowCheckbox('NF 1042')).toHaveFocus()

    await user.click(rowCheckbox('NF 1043'))
    await user.click(screen.getByRole('button', { name: 'Limpar seleção' }))
    expect(rowCheckbox('NF 1043')).toHaveFocus()

    await user.click(rowCheckbox('NF 1044'))
    screen.getByRole('button', { name: 'Exportar' }).focus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    expect(rowCheckbox('NF 1044')).toHaveFocus()
  })

  it('se a origem sumiu (linhas excluídas), o foco vai para o focável mais próximo antes do ActionBar', async () => {
    const user = userEvent.setup()
    render(<Invoices />)
    await user.click(rowCheckbox('NF 1042'))
    await user.click(rowCheckbox('NF 1043'))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(screen.queryByText('NF 1042')).not.toBeInTheDocument()
    expect(rowCheckbox('NF 1044')).toHaveFocus()
  })

  it('finalFocus define o destino do foco ao fechar', async () => {
    const user = userEvent.setup()
    render(<Invoices withFinalFocus />)
    await user.click(rowCheckbox('NF 1042'))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    expect(screen.getByRole('heading', { name: 'Faturas de outubro' })).toHaveFocus()
  })

  it('com diálogo de confirmação, o foco devolvido à barra que saiu é repassado para fora', async () => {
    const user = userEvent.setup()
    render(<Invoices confirmDelete />)
    await user.click(rowCheckbox('NF 1043'))
    await user.click(screen.getByRole('button', { name: 'Excluir' }))
    const dialog = await screen.findByRole('alertdialog', { name: 'Excluir 1 faturas?' })
    await user.click(within(dialog).getByRole('button', { name: 'Excluir faturas' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(screen.queryByText('NF 1043')).not.toBeInTheDocument()
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    expect(document.activeElement).not.toBe(document.body)
    expect(rowCheckbox('NF 1044')).toHaveFocus()
  })

  it('Escape num menu aberto da barra fecha só o menu', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <ActionBar open count={2} onDismiss={onDismiss} portal={false}>
        <Dropdown trigger={<IconButton icon="more-horizontal" label="Mais ações" />}>
          <DropdownItem>Arquivar</DropdownItem>
          <DropdownItem>Mover para pasta</DropdownItem>
        </Dropdown>
      </ActionBar>,
    )
    const more = screen.getByRole('button', { name: 'Mais ações' })
    more.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    expect(onDismiss).not.toHaveBeenCalled()
    expect(more).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('portal (padrão) renderiza no body; portal={false} renderiza no lugar', () => {
    const { container, rerender } = render(
      <ActionBar open count={2} placement="top">
        <Button>Exportar</Button>
      </ActionBar>,
    )
    const fixed = screen.getByRole('toolbar')
    expect(container).not.toContainElement(fixed)
    expect(fixed.parentElement).toHaveClass(
      'or-action-bar-region--fixed',
      'or-action-bar-region--top',
    )
    rerender(
      <ActionBar open count={2} portal={false}>
        <Button>Exportar</Button>
      </ActionBar>,
    )
    const inline = screen.getByRole('toolbar')
    expect(container).toContainElement(inline)
    expect(inline.parentElement).toHaveClass(
      'or-action-bar-region--inline',
      'or-action-bar-region--bottom',
    )
  })

  it('em portal, Tab trata a barra como se estivesse no lugar do ActionBar', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Antes</button>
        <ActionBar open count={2} onDismiss={() => {}}>
          <Button>Exportar</Button>
          <Button>Excluir</Button>
        </ActionBar>
        <button type="button">Depois</button>
      </>,
    )
    const before = screen.getByRole('button', { name: 'Antes' })
    const after = screen.getByRole('button', { name: 'Depois' })
    const exportar = await screen.findByRole('button', { name: 'Exportar' })
    before.focus()
    await user.tab()
    expect(exportar).toHaveFocus()
    await user.tab()
    expect(after).toHaveFocus()
    await user.tab({ shift: true })
    expect(exportar).toHaveFocus()
    await user.tab({ shift: true })
    expect(before).toHaveFocus()
  })

  it('sai sem animação no jsdom (usePresence) e reabre com data-state="open"', () => {
    const { rerender } = render(<ActionBar open count={1} portal={false} />)
    expect(screen.getByRole('toolbar')).toHaveAttribute('data-state', 'open')
    rerender(<ActionBar open={false} count={0} portal={false} />)
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
    rerender(<ActionBar open count={4} portal={false} />)
    expect(screen.getByRole('toolbar')).toHaveAttribute('data-state', 'open')
  })

  it('não tem violações de acessibilidade (inline e em portal)', async () => {
    const { container } = render(
      <ActionBar open count={3} onDismiss={() => {}} portal={false}>
        <Button>Exportar</Button>
        <Button>Excluir</Button>
        <Dropdown trigger={<IconButton icon="more-horizontal" label="Mais ações" />}>
          <DropdownItem>Arquivar</DropdownItem>
        </Dropdown>
      </ActionBar>,
    )
    await expectNoA11yViolations(container)
  })

  it('não tem violações de acessibilidade com a Table, em portal', async () => {
    const user = userEvent.setup()
    render(<Invoices portal />)
    await user.click(rowCheckbox('NF 1042'))
    expect(await screen.findByRole('toolbar')).toBeInTheDocument()
    await expectNoA11yViolations(document.body)
  })
})
