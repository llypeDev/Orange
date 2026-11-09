import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { DropdownItem, DropdownSeparator } from '../Dropdown'
import { Table, type TableColumn, type TableProps } from './Table'
import { TableColumnsMenu } from './TableColumnsMenu'

interface Invoice {
  id: string
  customer: string
  amount: number
  status: string
}

const data: Invoice[] = [
  { id: 'inv-1', customer: 'Padaria Aurora', amount: 1200, status: 'Pago' },
  { id: 'inv-2', customer: 'Clínica Bem Viver', amount: 350, status: 'Pendente' },
  { id: 'inv-3', customer: 'Atelier Norte', amount: 9800, status: 'Atrasado' },
]

const columns: TableColumn<Invoice>[] = [
  { key: 'customer', header: 'Cliente', rowHeader: true, sortable: true },
  { key: 'amount', header: 'Valor', sortable: true, align: 'end', render: (r) => `R$ ${r.amount}` },
  { key: 'status', header: 'Status' },
]

// jsdom não tem PointerEvent: um MouseEvent com pointerType basta para o React.
class TestPointerEvent extends MouseEvent {
  pointerType: string
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init)
    this.pointerType = init.pointerType ?? 'mouse'
  }
}

const bodyRows = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')
const firstCells = () => bodyRows().map((row) => within(row).getAllByRole('rowheader')[0].textContent)

describe('Table', () => {
  it('renderiza a tabela com legenda, cabeçalhos de coluna e de linha', () => {
    render(<Table caption="Faturas de outubro" columns={columns} data={data} />)
    const table = screen.getByRole('table', { name: 'Faturas de outubro' })
    expect(table).toHaveClass('or-table', 'or-table--normal')
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getByRole('columnheader', { name: 'Status' })).toHaveAttribute('scope', 'col')
    expect(screen.getByRole('rowheader', { name: 'Padaria Aurora' })).toHaveAttribute('scope', 'row')
    expect(screen.getByRole('cell', { name: 'R$ 9800' })).toHaveClass('or-table__cell--end')
  })

  it('aplica aria-sort e ordena ao clicar no cabeçalho, anunciando a mudança', async () => {
    const user = userEvent.setup()
    render(<Table caption="Faturas" columns={columns} data={data} />)
    const customerHeader = screen.getByRole('columnheader', { name: 'Cliente' })
    expect(customerHeader).toHaveAttribute('aria-sort', 'none')
    expect(screen.getByRole('columnheader', { name: 'Status' })).not.toHaveAttribute('aria-sort')

    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(customerHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(firstCells()).toEqual(['Atelier Norte', 'Clínica Bem Viver', 'Padaria Aurora'])
    expect(screen.getByRole('status')).toHaveTextContent('Cliente, ordenado de forma crescente')

    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(customerHeader).toHaveAttribute('aria-sort', 'descending')
    expect(firstCells()).toEqual(['Padaria Aurora', 'Clínica Bem Viver', 'Atelier Norte'])
    expect(screen.getByRole('status')).toHaveTextContent('Cliente, ordenado de forma decrescente')
  })

  it('ordena números pelo valor e funciona pelo teclado', async () => {
    const user = userEvent.setup()
    render(<Table caption="Faturas" columns={columns} data={data} />)
    screen.getByRole('button', { name: 'Valor' }).focus()
    await user.keyboard('{Enter}')
    expect(firstCells()).toEqual(['Clínica Bem Viver', 'Padaria Aurora', 'Atelier Norte'])
    await user.keyboard(' ')
    expect(firstCells()).toEqual(['Atelier Norte', 'Padaria Aurora', 'Clínica Bem Viver'])
    expect(screen.getByRole('columnheader', { name: 'Valor' })).toHaveAttribute('aria-sort', 'descending')
  })

  it('suporta ordenação controlada e manual', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <Table
        caption="Faturas"
        columns={columns}
        data={data}
        sort={{ key: 'amount', direction: 'descending' }}
        onSortChange={onSortChange}
        manualSort
      />,
    )
    // manualSort: mantém a ordem recebida
    expect(firstCells()).toEqual(['Padaria Aurora', 'Clínica Bem Viver', 'Atelier Norte'])
    expect(screen.getByRole('columnheader', { name: 'Valor' })).toHaveAttribute('aria-sort', 'descending')
    await user.click(screen.getByRole('button', { name: 'Valor' }))
    expect(onSortChange).toHaveBeenCalledWith({ key: 'amount', direction: 'ascending' })
    expect(screen.getByRole('columnheader', { name: 'Valor' })).toHaveAttribute('aria-sort', 'descending')
  })

  it('seleciona linhas e todas as linhas, com estado indeterminado', async () => {
    const user = userEvent.setup()
    const onSelectedRowsChange = vi.fn()
    render(<Table caption="Faturas" columns={columns} data={data} selectable onSelectedRowsChange={onSelectedRowsChange} />)
    const selectAll = screen.getByRole('checkbox', { name: 'Selecionar todos' }) as HTMLInputElement
    const rowCheckbox = screen.getByRole('checkbox', { name: 'Selecionar linha Clínica Bem Viver' })

    await user.click(rowCheckbox)
    expect(rowCheckbox).toBeChecked()
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(['inv-2'])
    expect(selectAll.indeterminate).toBe(true)
    expect(rowCheckbox.closest('tr')).toHaveAttribute('data-selected')

    await user.click(selectAll)
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(['inv-2', 'inv-1', 'inv-3'])
    expect(selectAll).toBeChecked()
    expect(selectAll.indeterminate).toBe(false)

    selectAll.focus()
    await user.keyboard(' ')
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith([])
  })

  it('usa getRowLabel no rótulo do checkbox e respeita seleção controlada', () => {
    render(
      <Table
        caption="Faturas"
        columns={columns}
        data={data}
        selectable
        selectedRows={['inv-3']}
        getRowLabel={(r) => r.customer}
      />,
    )
    expect(screen.getByRole('checkbox', { name: 'Selecionar linha: Atelier Norte' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Selecionar linha: Padaria Aurora' })).not.toBeChecked()
  })

  it('mostra o estado vazio', () => {
    const { rerender } = render(<Table caption="Faturas" columns={columns} data={[]} />)
    expect(screen.getByRole('cell', { name: 'Nenhum resultado encontrado' })).toHaveAttribute('colspan', '3')
    rerender(<Table caption="Faturas" columns={columns} data={[]} emptyState="Nenhuma fatura emitida" selectable />)
    expect(screen.getByRole('cell', { name: 'Nenhuma fatura emitida' })).toHaveAttribute('colspan', '4')
    expect(screen.getByRole('checkbox', { name: 'Selecionar todos' })).toBeDisabled()
  })

  it('linha clicável: clique na linha e Enter no botão da célula principal', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<Table caption="Faturas" columns={columns} data={data} onRowClick={onRowClick} selectable />)

    await user.click(screen.getByRole('cell', { name: 'Pago' }))
    expect(onRowClick).toHaveBeenCalledTimes(1)
    expect(onRowClick.mock.calls[0][0]).toEqual(data[0])

    // clicar no checkbox não aciona a linha
    await user.click(screen.getAllByRole('checkbox')[1])
    expect(onRowClick).toHaveBeenCalledTimes(1)

    const action = screen.getByRole('button', { name: 'Atelier Norte' })
    action.focus()
    await user.keyboard('{Enter}')
    expect(onRowClick).toHaveBeenCalledTimes(2)
    expect(onRowClick.mock.calls[1][0]).toEqual(data[2])
    // a semântica da linha é preservada
    expect(action.closest('tr')).not.toHaveAttribute('role')
  })

  it('com maxHeight cria uma região rolável focável e rotulada', () => {
    render(<Table caption="Faturas" hideCaption columns={columns} data={data} maxHeight={240} density="compact" striped />)
    const region = screen.getByRole('region', { name: 'Faturas' })
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveStyle({ maxHeight: '240px' })
    expect(screen.getByRole('table')).toHaveClass('or-table--sticky', 'or-table--compact', 'or-table--striped')
    expect(screen.getByText('Faturas', { selector: 'caption' })).toHaveClass('or-visually-hidden')
  })

  it('cabeçalho fixo: publica a altura do thead para o scroll-padding-top (foco nunca fica sob ele)', () => {
    // Captura os ResizeObservers para simular a troca de altura do cabeçalho (densidade, fonte).
    const observers: { targets: Element[]; callback: () => void }[] = []
    vi.stubGlobal(
      'ResizeObserver',
      class {
        targets: Element[] = []
        constructor(callback: () => void) {
          observers.push({ targets: this.targets, callback })
        }
        observe(target: Element) {
          this.targets.push(target)
        }
        unobserve() {}
        disconnect() {}
      },
    )
    let headHeight = 53
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.tagName === 'THEAD' ? headHeight : 0
    })
    try {
      const { container, rerender } = render(
        <Table caption="Faturas" columns={columns} data={data} maxHeight={240} />,
      )
      const region = screen.getByRole('region', { name: 'Faturas' })
      expect(region.style.getPropertyValue('--_head-height')).toBe('53px')

      headHeight = 41
      const thead = screen.getAllByRole('rowgroup')[0]
      act(() => observers.filter((o) => o.targets.includes(thead)).forEach((o) => o.callback()))
      expect(region.style.getPropertyValue('--_head-height')).toBe('41px')

      // Sem maxHeight o cabeçalho não é fixo: nada a reservar.
      rerender(<Table caption="Faturas" columns={columns} data={data} />)
      const plain = container.querySelector('.or-table-container') as HTMLElement
      expect(plain.style.getPropertyValue('--_head-height')).toBe('')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('sem maxHeight, só vira região focável quando rola na horizontal', () => {
    const { container, unmount } = render(<Table caption="Faturas" columns={columns} data={data} />)
    expect(container.querySelector('.or-table-container')).not.toHaveAttribute('tabindex')
    unmount()
    // Tabela mais larga que o contêiner (ex.: celular): o teclado precisa alcançar a rolagem.
    const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(600)
    const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(280)
    render(<Table caption="Faturas" columns={columns} data={data} />)
    const region = screen.getByRole('region', { name: 'Faturas' })
    expect(region).toHaveAttribute('tabindex', '0')
    scrollWidth.mockRestore()
    clientWidth.mockRestore()
  })

  it('usa as mensagens do idioma configurado', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Table caption="Invoices" columns={columns} data={data} selectable />
      </OrangeProvider>,
    )
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(screen.getByRole('status')).toHaveTextContent('Cliente, sorted ascending')
  })

  it('motion: o ícone de ordenação expõe a direção para a rotação da seta', async () => {
    const user = userEvent.setup()
    const { container } = render(<Table caption="Faturas" columns={columns} data={data} />)
    const icon = () => container.querySelector('th[aria-sort] .or-table__sort-icon')!
    expect(icon()).not.toHaveAttribute('data-direction')
    expect(icon().querySelectorAll('svg')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(icon()).toHaveAttribute('data-direction', 'ascending')
    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(icon()).toHaveAttribute('data-direction', 'descending')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Table
          caption="Faturas"
          columns={columns}
          data={data}
          selectable
          defaultSelectedRows={['inv-1']}
          defaultSort={{ key: 'customer', direction: 'ascending' }}
          onRowClick={() => {}}
          maxHeight={300}
        />
        <Table caption="Vazia" columns={columns} data={[]} />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})

const renderDetail = (invoice: Invoice) => <p>Detalhes da fatura {invoice.id}</p>

function ExpandableTable(props: Partial<TableProps<Invoice>>) {
  return <Table caption="Faturas" columns={columns} data={data} renderExpanded={renderDetail} {...props} />
}

/** Célula de detalhe apontada pelo aria-controls do botão de expandir. */
const detailOf = (button: HTMLElement) => document.getElementById(button.getAttribute('aria-controls') ?? '')
const expandButtons = () => screen.getAllByRole('button', { name: /^(Expandir|Recolher) linha/ })

describe('Table — linhas expansíveis', () => {
  it('adiciona a coluna "Detalhes" e um botão de disclosure no início de cada linha', () => {
    render(<ExpandableTable />)
    const header = screen.getByRole('columnheader', { name: 'Detalhes' })
    expect(header).toHaveAttribute('scope', 'col')
    expect(screen.getAllByRole('columnheader')[0]).toBe(header)
    expect(screen.getByRole('table')).toHaveClass('or-table--expandable')

    const button = screen.getByRole('button', { name: 'Expandir linha Padaria Aurora' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // fechado, o painel não existe no DOM — e o botão não aponta para um id inexistente
    expect(button).not.toHaveAttribute('aria-controls')
    expect(button.closest('td')).toBe(button.closest('tr')!.firstElementChild)
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(expandButtons()).toHaveLength(3)
    expect(bodyRows()).toHaveLength(3)
    expect(screen.queryByText(/Detalhes da fatura/)).not.toBeInTheDocument()
  })

  it('abre e fecha pelo clique: aria-expanded, aria-controls e a linha de detalhe logo abaixo', async () => {
    const user = userEvent.setup()
    const onExpandedRowsChange = vi.fn()
    render(<ExpandableTable onExpandedRowsChange={onExpandedRowsChange} />)
    const button = screen.getByRole('button', { name: 'Expandir linha Clínica Bem Viver' })

    await user.click(button)
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith(['inv-2'])
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAccessibleName('Recolher linha Clínica Bem Viver')
    expect(button.closest('tr')).toHaveAttribute('data-expanded')
    const cell = detailOf(button)!
    expect(cell.tagName).toBe('TD')
    expect(cell).toHaveAttribute('colspan', '4')
    expect(cell).toHaveTextContent('Detalhes da fatura inv-2')
    const detailRow = cell.closest('tr')!
    expect(detailRow).toHaveClass('or-table__detail-row')
    expect(detailRow.children).toHaveLength(1)
    expect(button.closest('tr')!.nextElementSibling).toBe(detailRow)

    await user.click(button)
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith([])
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAccessibleName('Expandir linha Clínica Bem Viver')
    expect(button).not.toHaveAttribute('aria-controls')
    expect(button.closest('tr')).not.toHaveAttribute('data-expanded')
    expect(detailRow).not.toBeInTheDocument()
  })

  it('funciona pelo teclado: Enter e Espaço no botão nativo', async () => {
    const user = userEvent.setup()
    render(<ExpandableTable />)
    const button = screen.getByRole('button', { name: 'Expandir linha Atelier Norte' })
    button.focus()
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Detalhes da fatura inv-3')).toBeInTheDocument()
    expect(button).toHaveFocus()
    await user.keyboard(' ')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Detalhes da fatura inv-3')).not.toBeInTheDocument()
  })

  it('não controlado (defaultExpandedRows) e controlado (expandedRows)', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<ExpandableTable defaultExpandedRows={['inv-3']} />)
    expect(screen.getByRole('button', { name: 'Recolher linha Atelier Norte' })).toHaveAttribute('aria-expanded', 'true')
    // aberta na montagem: aparece aberta, sem animar a entrada
    expect(screen.getByText('Detalhes da fatura inv-3').closest('.or-table__detail-panel')).toHaveAttribute(
      'data-state',
      'open',
    )
    unmount()

    const onExpandedRowsChange = vi.fn()
    const { rerender } = render(
      <ExpandableTable expandedRows={['inv-1']} onExpandedRowsChange={onExpandedRowsChange} />,
    )
    await user.click(screen.getByRole('button', { name: 'Expandir linha Atelier Norte' }))
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith(['inv-1', 'inv-3'])
    // controlado: só muda quando o pai atualiza
    expect(screen.getByRole('button', { name: 'Expandir linha Atelier Norte' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Detalhes da fatura inv-3')).not.toBeInTheDocument()

    rerender(<ExpandableTable expandedRows={['inv-3']} onExpandedRowsChange={onExpandedRowsChange} />)
    expect(screen.getByRole('button', { name: 'Recolher linha Atelier Norte' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Expandir linha Padaria Aurora' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Detalhes da fatura inv-3')).toBeInTheDocument()
    expect(screen.queryByText('Detalhes da fatura inv-1')).not.toBeInTheDocument()
  })

  it('rótulo do botão segue a lógica do checkbox: getRowLabel, cabeçalho de linha ou posição', () => {
    const { unmount } = render(<ExpandableTable getRowLabel={(r) => r.customer} defaultExpandedRows={['inv-2']} />)
    expect(screen.getByRole('button', { name: 'Expandir linha: Atelier Norte' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Recolher linha: Clínica Bem Viver' })).toBeInTheDocument()
    unmount()
    render(<ExpandableTable columns={columns.map((c) => ({ ...c, rowHeader: false }))} />)
    expect(screen.getByRole('button', { name: 'Expandir linha 1' })).toBeInTheDocument()
  })

  it('isRowExpandable: linhas sem detalhe não têm botão nem painel', () => {
    render(<ExpandableTable isRowExpandable={(r) => r.status !== 'Pago'} defaultExpandedRows={['inv-1', 'inv-2']} />)
    expect(expandButtons()).toHaveLength(2)
    expect(screen.queryByRole('button', { name: /linha Padaria Aurora/ })).not.toBeInTheDocument()
    // a célula da coluna continua lá, vazia, para manter as colunas alinhadas
    const paidRow = screen.getByRole('rowheader', { name: 'Padaria Aurora' }).closest('tr')!
    expect(paidRow.children).toHaveLength(4)
    expect(paidRow.firstElementChild).toBeEmptyDOMElement()
    expect(paidRow).not.toHaveAttribute('data-expanded')
    expect(screen.queryByText('Detalhes da fatura inv-1')).not.toBeInTheDocument()
    expect(screen.getByText('Detalhes da fatura inv-2')).toBeInTheDocument()
  })

  it('com seleção: botão de expandir antes do checkbox, estados independentes', async () => {
    const user = userEvent.setup()
    const onSelectedRowsChange = vi.fn()
    const onExpandedRowsChange = vi.fn()
    render(
      <ExpandableTable
        selectable
        onSelectedRowsChange={onSelectedRowsChange}
        onExpandedRowsChange={onExpandedRowsChange}
      />,
    )
    const headers = screen.getAllByRole('columnheader')
    expect(headers[0]).toHaveAccessibleName('Detalhes')
    expect(within(headers[1]).getByRole('checkbox', { name: 'Selecionar todos' })).toBeInTheDocument()

    const expand = screen.getByRole('button', { name: 'Expandir linha Padaria Aurora' })
    expand.focus()
    await user.keyboard('{Enter}')
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith(['inv-1'])
    expect(onSelectedRowsChange).not.toHaveBeenCalled()
    expect(detailOf(expand)).toHaveAttribute('colspan', '5')

    // Tab: do botão de expandir para o checkbox da mesma linha
    await user.tab()
    const checkbox = screen.getByRole('checkbox', { name: 'Selecionar linha Padaria Aurora' })
    expect(checkbox).toHaveFocus()
    await user.keyboard(' ')
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(['inv-1'])
    expect(onExpandedRowsChange).toHaveBeenCalledTimes(1)
    expect(expand.closest('tr')).toHaveAttribute('data-selected')

    // "Selecionar todos" conta só as linhas de dados (não as de detalhe)
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar todos' }))
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(['inv-1', 'inv-2', 'inv-3'])
  })

  it('com onRowClick: o botão de expandir e o painel não acionam a linha', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()
    render(<ExpandableTable onRowClick={onRowClick} />)
    const expand = screen.getByRole('button', { name: 'Expandir linha Padaria Aurora' })
    await user.click(expand)
    expect(expand).toHaveAttribute('aria-expanded', 'true')
    expect(onRowClick).not.toHaveBeenCalled()

    await user.click(screen.getByText('Detalhes da fatura inv-1'))
    expect(onRowClick).not.toHaveBeenCalled()

    await user.click(screen.getByRole('cell', { name: 'Pago' }))
    expect(onRowClick).toHaveBeenCalledTimes(1)
    expect(onRowClick.mock.calls[0][0]).toEqual(data[0])
    expect(expand).toHaveAttribute('aria-expanded', 'true')
  })

  it('a ordenação mantém o estado expandido: o painel acompanha a linha pelo id', async () => {
    const user = userEvent.setup()
    const onExpandedRowsChange = vi.fn()
    render(<ExpandableTable defaultExpandedRows={['inv-1']} onExpandedRowsChange={onExpandedRowsChange} />)
    expect(bodyRows()[1]).toHaveTextContent('Detalhes da fatura inv-1')

    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    const rows = bodyRows()
    expect(rows).toHaveLength(4)
    expect(within(rows[0]).getByRole('rowheader')).toHaveTextContent('Atelier Norte')
    expect(within(rows[1]).getByRole('rowheader')).toHaveTextContent('Clínica Bem Viver')
    expect(within(rows[2]).getByRole('rowheader')).toHaveTextContent('Padaria Aurora')
    expect(rows[3]).toHaveTextContent('Detalhes da fatura inv-1')
    const button = screen.getByRole('button', { name: 'Recolher linha Padaria Aurora' })
    expect(detailOf(button)!.closest('tr')).toBe(rows[3])
    expect(onExpandedRowsChange).not.toHaveBeenCalled()
  })

  it('usa as mensagens do idioma configurado', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <ExpandableTable />
      </OrangeProvider>,
    )
    expect(screen.getByRole('columnheader', { name: 'Details' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Expand row Padaria Aurora' }))
    expect(screen.getByRole('button', { name: 'Collapse row Padaria Aurora' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('linha de detalhe fica fora das listras/hover e convive com densidade e cabeçalho fixo', () => {
    render(<ExpandableTable striped density="compact" maxHeight={240} defaultExpandedRows={['inv-1']} />)
    expect(screen.getByRole('table')).toHaveClass(
      'or-table--expandable',
      'or-table--striped',
      'or-table--compact',
      'or-table--sticky',
    )
    const detailRow = screen.getByText('Detalhes da fatura inv-1').closest('tr')!
    expect(detailRow).toHaveClass('or-table__detail-row')
    expect(detailRow).not.toHaveClass('or-table__row')
    expect(screen.getByRole('region', { name: 'Faturas' })).toHaveAttribute('tabindex', '0')
  })

  it('rolagem horizontal: publica a largura visível para o painel acompanhar a área visível', () => {
    const scrollWidth = vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(600)
    const clientWidth = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(280)
    const { unmount } = render(<ExpandableTable defaultExpandedRows={['inv-1']} />)
    const region = screen.getByRole('region', { name: 'Faturas' })
    expect(region.style.getPropertyValue('--_detail-width')).toBe('280px')
    unmount()
    // sem linhas expansíveis, nada é publicado
    render(<Table caption="Faturas" columns={columns} data={data} />)
    expect(screen.getByRole('region', { name: 'Faturas' }).style.getPropertyValue('--_detail-width')).toBe('')
    scrollWidth.mockRestore()
    clientWidth.mockRestore()
  })

  it('motion: abre com um quadro em 0fr e, ao fechar, fica montada e inerte até o fim da transição', async () => {
    render(<ExpandableTable />)
    const button = screen.getByRole('button', { name: 'Expandir linha Padaria Aurora' })
    fireEvent.click(button)
    const detailRow = detailOf(button)!.closest('tr')!
    const panel = detailRow.querySelector('.or-table__detail-panel')!
    expect(detailRow).not.toHaveAttribute('inert')
    // um quadro em 0fr antes de expandir, para a transição acontecer
    expect(panel).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(panel).toHaveAttribute('data-state', 'open'))

    // simula a transição de altura do CSS (o jsdom não tem)
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      animationName: 'none',
      animationDuration: '0s',
      transitionDuration: '0.25s',
    } as CSSStyleDeclaration)
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(panel).toHaveAttribute('data-state', 'closed')
    // durante a saída: ainda na tela, mas fora do foco e da árvore de acessibilidade
    expect(detailRow).toBeInTheDocument()
    expect(detailRow).toHaveAttribute('inert')
    act(() => {
      panel.dispatchEvent(new Event('transitionrun'))
      panel.dispatchEvent(new Event('transitionend'))
    })
    expect(detailRow).not.toBeInTheDocument()
  })

  it('o chevron gira pelo CSS a partir de aria-expanded', async () => {
    const user = userEvent.setup()
    render(<ExpandableTable />)
    const button = screen.getByRole('button', { name: 'Expandir linha Padaria Aurora' })
    expect(button.querySelector('svg')).toHaveClass('or-table__expand-icon')
    expect(button.querySelector('svg')).toHaveAttribute('data-icon', 'chevron-down')
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ExpandableTable
          selectable
          defaultSelectedRows={['inv-2']}
          onRowClick={() => {}}
          maxHeight={300}
          defaultExpandedRows={['inv-2', 'inv-3']}
          isRowExpandable={(r) => r.status !== 'Pago'}
        />
        <ExpandableTable
          caption="Faturas sem cabeçalho de linha"
          columns={columns.map((c) => ({ ...c, rowHeader: false }))}
          getRowLabel={(r) => r.customer}
          defaultExpandedRows={['inv-1']}
          striped
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})

// ---------------------------------------------------------------------------
// Dados grandes: filtros, colunas ocultas, virtualização, colunas fixas e redimensionáveis
// ---------------------------------------------------------------------------

const statusOptions = [
  { value: 'Pago', label: 'Pago' },
  { value: 'Pendente', label: 'Pendente' },
  { value: 'Atrasado', label: 'Atrasado' },
]

const filterColumns: TableColumn<Invoice>[] = [
  { key: 'customer', header: 'Cliente', rowHeader: true, sortable: true, filter: 'text' },
  { key: 'amount', header: 'Valor', align: 'end', render: (r) => `R$ ${r.amount}` },
  { key: 'status', header: 'Status', filter: 'select', filterOptions: statusOptions },
]

describe('Table — filtros por coluna', () => {
  it('mostra um campo por coluna com filter, rotulado, numa linha de <td> dentro do cabeçalho', () => {
    render(<Table caption="Faturas" columns={filterColumns} data={data} selectable />)
    const text = screen.getByRole('searchbox', { name: 'Filtrar por Cliente' })
    const select = screen.getByRole('combobox', { name: 'Filtrar por Status' })
    expect(text.closest('tr')).toHaveClass('or-table__filter-row')
    expect(text.closest('thead')).not.toBeNull()
    // Os filtros não são cabeçalhos: as colunas continuam com 4 (seleção + 3).
    expect(screen.getAllByRole('columnheader')).toHaveLength(4)
    expect(text.closest('td')).toHaveClass('or-table__filter')
    expect(within(select).getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Todos',
      'Pago',
      'Pendente',
      'Atrasado',
    ])
    expect(screen.getByRole('table')).toHaveClass('or-table--filters')
    // A coluna sem filter tem a célula vazia.
    expect(text.closest('tr')!.children).toHaveLength(4)
  })

  it('filtro de texto: contém, sem diferenciar acentos nem maiúsculas, e anuncia a contagem', async () => {
    const user = userEvent.setup()
    render(<Table caption="Faturas" columns={filterColumns} data={data} />)
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' }), 'CLINICA')
    expect(firstCells()).toEqual(['Clínica Bem Viver'])
    expect(screen.getByRole('status')).toHaveTextContent('1 resultado disponível')

    await user.clear(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' }))
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' }), 'r')
    expect(firstCells()).toEqual(['Padaria Aurora', 'Clínica Bem Viver', 'Atelier Norte'])
    expect(screen.getByRole('status')).toHaveTextContent('3 resultados disponíveis')
  })

  it('filtro select: valor exato; os filtros se combinam e a ordenação continua valendo', async () => {
    const user = userEvent.setup()
    const more = [...data, { id: 'inv-4', customer: 'Bistrô Aurora', amount: 80, status: 'Pago' }]
    render(<Table caption="Faturas" columns={filterColumns} data={more} />)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por Status' }), 'Pago')
    expect(firstCells()).toEqual(['Padaria Aurora', 'Bistrô Aurora'])
    await user.click(screen.getByRole('button', { name: 'Cliente' }))
    expect(firstCells()).toEqual(['Bistrô Aurora', 'Padaria Aurora'])
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' }), 'pad')
    expect(firstCells()).toEqual(['Padaria Aurora'])
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por Status' }), '')
    expect(firstCells()).toEqual(['Padaria Aurora'])
  })

  it('filterValue informa o texto de colunas com render', async () => {
    const user = userEvent.setup()
    const cols: TableColumn<Invoice>[] = [
      { key: 'customer', header: 'Cliente', rowHeader: true },
      {
        key: 'amount',
        header: 'Valor',
        filter: 'text',
        render: (r) => `R$ ${r.amount}`,
        filterValue: (r) => `R$ ${r.amount}`,
      },
    ]
    render(<Table caption="Faturas" columns={cols} data={data} />)
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Valor' }), 'r$ 98')
    expect(firstCells()).toEqual(['Atelier Norte'])
  })

  it('sem resultado: diz isso e oferece "Limpar filtros", que devolve as linhas', async () => {
    const user = userEvent.setup()
    const onFiltersChange = vi.fn()
    render(
      <Table
        caption="Faturas"
        columns={filterColumns}
        data={data}
        emptyState="Nenhuma fatura emitida"
        onFiltersChange={onFiltersChange}
      />,
    )
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' }), 'zz')
    expect(onFiltersChange).toHaveBeenLastCalledWith({ customer: 'zz' })
    // O estado vazio da aplicação é para "não há dados"; aqui os dados existem, só não casam.
    expect(screen.queryByText('Nenhuma fatura emitida')).not.toBeInTheDocument()
    expect(screen.getByRole('cell', { name: /Nenhum resultado encontrado/ })).toHaveAttribute('colspan', '3')
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum resultado encontrado')

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(onFiltersChange).toHaveBeenLastCalledWith({})
    expect(firstCells()).toHaveLength(3)
    expect(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' })).toHaveValue('')
    expect(screen.getByRole('status')).toHaveTextContent('3 resultados disponíveis')
  })

  it('controlado e manual: mostra o valor recebido, avisa a mudança e não filtra data', async () => {
    const user = userEvent.setup()
    const onFiltersChange = vi.fn()
    render(
      <Table
        caption="Faturas"
        columns={filterColumns}
        data={data}
        filters={{ customer: 'aurora' }}
        onFiltersChange={onFiltersChange}
        manualFilter
      />,
    )
    expect(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' })).toHaveValue('aurora')
    // manualFilter: quem filtra é o servidor; a tabela mostra o que recebeu.
    expect(firstCells()).toHaveLength(3)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por Status' }), 'Pendente')
    expect(onFiltersChange).toHaveBeenLastCalledWith({ customer: 'aurora', status: 'Pendente' })
  })

  it('defaultFilters filtra desde o início, sem anunciar', () => {
    render(<Table caption="Faturas" columns={filterColumns} data={data} defaultFilters={{ status: 'Atrasado' }} />)
    expect(firstCells()).toEqual(['Atelier Norte'])
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('"Selecionar todos" vale para as linhas filtradas e preserva a seleção das escondidas', async () => {
    const user = userEvent.setup()
    const onSelectedRowsChange = vi.fn()
    render(
      <Table
        caption="Faturas"
        columns={filterColumns}
        data={data}
        selectable
        defaultSelectedRows={['inv-3']}
        onSelectedRowsChange={onSelectedRowsChange}
      />,
    )
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Cliente' }), 'a aurora')
    const selectAll = screen.getByRole('checkbox', { name: 'Selecionar todos' }) as HTMLInputElement
    // A linha selecionada ficou de fora do filtro: nada marcado entre as visíveis.
    expect(selectAll).not.toBeChecked()
    expect(selectAll.indeterminate).toBe(false)
    await user.click(selectAll)
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(['inv-3', 'inv-1'])
    expect(selectAll).toBeChecked()
    await user.click(selectAll)
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(['inv-3'])
  })

  it('o filtro de uma coluna oculta não esconde linhas', () => {
    render(
      <Table
        caption="Faturas"
        columns={filterColumns}
        data={data}
        defaultFilters={{ status: 'Pago' }}
        hiddenColumns={['status']}
      />,
    )
    expect(screen.queryByRole('combobox', { name: 'Filtrar por Status' })).not.toBeInTheDocument()
    expect(firstCells()).toHaveLength(3)
  })

  it('com cabeçalho fixo, publica a altura da primeira linha para os filtros grudarem sob ela', () => {
    const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.tagName === 'THEAD' ? 90 : this.tagName === 'TR' ? 41 : 0
    })
    render(<Table caption="Faturas" columns={filterColumns} data={data} maxHeight={240} />)
    const region = screen.getByRole('region', { name: 'Faturas' })
    expect(region.style.getPropertyValue('--_head-height')).toBe('90px')
    expect(region.style.getPropertyValue('--_head-row-height')).toBe('41px')
    height.mockRestore()
  })
})

describe('Table — colunas ocultas e TableColumnsMenu', () => {
  function WithMenu({ initial = [] as string[], onChange = (_: string[]) => {} }) {
    const [hidden, setHidden] = useState(initial)
    const cols = columns.map((c) => (c.key === 'customer' ? { ...c, hideable: false } : c))
    return (
      <>
        <TableColumnsMenu
          columns={cols}
          hiddenColumns={hidden}
          onHiddenColumnsChange={(next) => {
            setHidden(next)
            onChange(next)
          }}
        />
        <Table caption="Faturas" columns={cols} data={data} hiddenColumns={hidden} />
      </>
    )
  }

  it('hiddenColumns tira a coluna do cabeçalho e das linhas', () => {
    render(<Table caption="Faturas" columns={columns} data={data} hiddenColumns={['amount']} />)
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Cliente', 'Status'])
    expect(screen.queryByRole('cell', { name: 'R$ 1200' })).not.toBeInTheDocument()
    expect(within(bodyRows()[0]).getAllByRole('cell')).toHaveLength(1)
  })

  it('menu: um item marcável por coluna ocultável; marcar e desmarcar muda a tabela', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<WithMenu initial={['status']} onChange={onChange} />)
    const trigger = screen.getByRole('button', { name: 'Colunas' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await user.click(trigger)
    const items = screen.getAllByRole('menuitemcheckbox')
    // "Cliente" tem hideable: false e não entra no menu.
    expect(items.map((item) => item.textContent)).toEqual(['Valor', 'Status'])
    expect(screen.getByRole('menuitemcheckbox', { name: 'Valor' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Status' })).toHaveAttribute('aria-checked', 'false')

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Valor' }))
    // A lista segue a ordem das colunas, não a dos cliques.
    expect(onChange).toHaveBeenLastCalledWith(['amount', 'status'])
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Cliente'])

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Status' }))
    expect(onChange).toHaveBeenLastCalledWith(['amount'])
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Cliente', 'Status'])
  })

  it('menu pelo teclado: abre, percorre e alterna com Espaço sem fechar', async () => {
    const user = userEvent.setup()
    render(<WithMenu />)
    screen.getByRole('button', { name: 'Colunas' }).focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('menuitemcheckbox', { name: 'Valor' })).toHaveFocus())
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Status' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('menuitemcheckbox', { name: 'Status' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Cliente', 'Valor'])
  })

  it('children entram no fim do menu (ex.: "Restaurar padrão")', async () => {
    const user = userEvent.setup()
    const onRestore = vi.fn()
    render(
      <TableColumnsMenu columns={columns} hiddenColumns={['status']} onHiddenColumnsChange={() => {}}>
        <DropdownSeparator />
        <DropdownItem onSelect={onRestore}>Restaurar padrão</DropdownItem>
      </TableColumnsMenu>,
    )
    await user.click(screen.getByRole('button', { name: 'Colunas' }))
    const menu = screen.getByRole('menu')
    expect(menu.querySelectorAll('[role^="menuitem"]')).toHaveLength(4)
    expect(Array.from(menu.querySelectorAll('[role^="menuitem"]')).at(-1)).toHaveTextContent('Restaurar padrão')
    await user.click(screen.getByRole('menuitem', { name: 'Restaurar padrão' }))
    expect(onRestore).toHaveBeenCalledTimes(1)
  })

  it('aceita rótulo, gatilho próprio e cabeçalhos que são nós React', async () => {
    const user = userEvent.setup()
    const cols: TableColumn<Invoice>[] = [
      { key: 'customer', header: <strong>Cliente</strong> },
      { key: 'status', header: 'Status' },
    ]
    const { rerender } = render(
      <TableColumnsMenu columns={cols} hiddenColumns={[]} onHiddenColumnsChange={() => {}} label="Exibir" />,
    )
    await user.click(screen.getByRole('button', { name: 'Exibir' }))
    expect(screen.getByRole('menuitemcheckbox', { name: 'Cliente' })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    rerender(
      <TableColumnsMenu
        columns={cols}
        hiddenColumns={[]}
        onHiddenColumnsChange={() => {}}
        trigger={<button type="button">Escolher colunas</button>}
      />,
    )
    expect(screen.getByRole('button', { name: 'Escolher colunas' })).toHaveAttribute('aria-haspopup', 'menu')
  })
})

describe('Table — virtualização', () => {
  interface Item {
    id: string
    name: string
  }
  const many: Item[] = Array.from({ length: 1000 }, (_, index) => ({ id: `i${index}`, name: `Item ${index}` }))
  const itemColumns: TableColumn<Item>[] = [{ key: 'name', header: 'Nome', rowHeader: true, sortable: true }]

  /** Layout simulado: linhas de 40px, área visível de 200px e o <tbody> 50px abaixo do topo. */
  function mockLayout({ rowHeight = 40, viewport = 200, bodyTop = 50 } = {}) {
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('or-table-container') ? viewport : 0
    })
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if (this.tagName === 'TBODY') {
        const container = this.closest('.or-table-container') as HTMLElement
        return new DOMRect(0, bodyTop - container.scrollTop, 600, 0)
      }
      if (this.classList.contains('or-table__row')) return new DOMRect(0, 0, 600, rowHeight)
      return new DOMRect(0, 0, 0, 0)
    })
  }

  const scrollTo = (top: number) => {
    const region = screen.getByRole('region')
    region.scrollTop = top
    fireEvent.scroll(region)
  }
  const dataRows = () => Array.from(document.querySelectorAll<HTMLElement>('tbody .or-table__row'))
  const spacerHeights = () =>
    Array.from(document.querySelectorAll<HTMLElement>('tbody .or-table__spacer > td')).map((td) => td.style.height)

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('só as linhas à vista (mais a margem) vão para o DOM; o resto vira espaçador', () => {
    mockLayout()
    render(<Table caption="Itens" columns={itemColumns} data={many} maxHeight={200} virtualized />)
    // 200px / 40px = 5 linhas, menos os 50px acima do corpo, mais 8 de margem.
    expect(dataRows()).toHaveLength(12)
    expect(dataRows()[0]).toHaveTextContent('Item 0')
    expect(spacerHeights()).toEqual([`${(1000 - 12) * 40}px`])
    expect(document.querySelector('.or-table__spacer')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('table')).toHaveClass('or-table--virtual')
  })

  it('informa o total e a posição real das linhas ao leitor de tela', () => {
    mockLayout()
    const { rerender } = render(
      <Table caption="Itens" columns={itemColumns} data={many} maxHeight={200} virtualized />,
    )
    const table = screen.getByRole('table')
    // 1000 linhas + a do cabeçalho.
    expect(table).toHaveAttribute('aria-rowcount', '1001')
    expect(table.querySelector('thead tr')).toHaveAttribute('aria-rowindex', '1')
    expect(dataRows()[0]).toHaveAttribute('aria-rowindex', '2')

    // Com filtros, o cabeçalho tem duas linhas.
    rerender(
      <Table
        caption="Itens"
        columns={[{ ...itemColumns[0], filter: 'text' }]}
        data={many}
        maxHeight={200}
        virtualized
      />,
    )
    expect(table).toHaveAttribute('aria-rowcount', '1002')
    expect(table.querySelector('.or-table__filter-row')).toHaveAttribute('aria-rowindex', '2')
    expect(dataRows()[0]).toHaveAttribute('aria-rowindex', '3')
  })

  it('ao rolar, a janela acompanha e os espaçadores mantêm a altura total', () => {
    mockLayout()
    render(<Table caption="Itens" columns={itemColumns} data={many} maxHeight={200} virtualized />)
    scrollTo(4050) // 4000px dentro do corpo: a linha 100 no topo da área visível
    const rows = dataRows()
    expect(rows[0]).toHaveTextContent('Item 92')
    expect(rows[0]).toHaveAttribute('aria-rowindex', '94')
    expect(rows.at(-1)).toHaveTextContent('Item 112')
    expect(spacerHeights()).toEqual([`${92 * 40}px`, `${(1000 - 113) * 40}px`])

    scrollTo(1000 * 40) // fim
    expect(dataRows().at(-1)).toHaveTextContent('Item 999')
    expect(spacerHeights()).toHaveLength(1)
  })

  it('overscan e rowHeight ajustam a janela (rowHeight vale até a tabela medir a linha)', () => {
    // Sem layout (jsdom puro): vale a estimativa.
    render(
      <Table caption="Itens" columns={itemColumns} data={many} maxHeight={300} virtualized rowHeight={30} overscan={2} />,
    )
    // 300px / 30px = 10 linhas + 2 de margem.
    expect(dataRows()).toHaveLength(12)
    expect(spacerHeights()).toEqual([`${(1000 - 12) * 30}px`])
  })

  it('a linha com o foco continua no DOM depois de sair da janela', async () => {
    mockLayout()
    render(<Table caption="Itens" columns={itemColumns} data={many} maxHeight={200} virtualized selectable />)
    const checkbox = screen.getByRole('checkbox', { name: 'Selecionar linha Item 3' })
    act(() => checkbox.focus())
    scrollTo(20050)
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveFocus()
    const rows = dataRows()
    expect(rows[0]).toHaveTextContent('Item 3')
    expect(rows[1]).toHaveTextContent('Item 492')
    // Espaçadores: antes da linha focada, entre ela e a janela, e depois da janela.
    expect(spacerHeights()).toEqual([`${3 * 40}px`, `${(492 - 4) * 40}px`, `${(1000 - 513) * 40}px`])

    // Quando o foco sai da tabela, a linha deixa de ser mantida.
    act(() => checkbox.blur())
    expect(dataRows()[0]).toHaveTextContent('Item 492')
  })

  it('listras seguem a posição real da linha, não a ordem no DOM', () => {
    mockLayout()
    render(<Table caption="Itens" columns={itemColumns} data={many} maxHeight={200} virtualized striped />)
    scrollTo(4050 + 40)
    const rows = dataRows()
    expect(rows[0]).toHaveTextContent('Item 93')
    expect(rows[0]).toHaveClass('or-table__row--alt')
    expect(rows[1]).not.toHaveClass('or-table__row--alt')
  })

  it('filtrar e ordenar valem para todas as linhas, não só para as renderizadas', async () => {
    mockLayout()
    const user = userEvent.setup()
    render(
      <Table
        caption="Itens"
        columns={[{ ...itemColumns[0], filter: 'text' }]}
        data={many}
        maxHeight={200}
        virtualized
        selectable
      />,
    )
    await user.type(screen.getByRole('searchbox', { name: 'Filtrar por Nome' }), '99')
    // 99, 199, …, 899 e 990–999: 19 linhas.
    expect(screen.getByRole('status')).toHaveTextContent('19 resultados disponíveis')
    expect(screen.getByRole('table')).toHaveAttribute('aria-rowcount', '21')
    await user.click(screen.getByRole('button', { name: 'Nome' }))
    await user.click(screen.getByRole('button', { name: 'Nome' }))
    expect(dataRows()[0]).toHaveTextContent('Item 999')
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar todos' }))
    expect(screen.getByRole('checkbox', { name: 'Selecionar todos' })).toBeChecked()
  })

  it('sem maxHeight ou com renderExpanded, avisa em desenvolvimento e renderiza tudo', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const few = many.slice(0, 30)
    const { unmount } = render(<Table caption="Itens" columns={itemColumns} data={few} virtualized />)
    expect(dataRows()).toHaveLength(30)
    expect(screen.getByRole('table')).not.toHaveAttribute('aria-rowcount')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`virtualized` precisa de `maxHeight`'))
    unmount()
    render(
      <Table
        caption="Itens"
        columns={itemColumns}
        data={few}
        virtualized
        maxHeight={200}
        renderExpanded={(item) => item.name}
      />,
    )
    expect(dataRows()).toHaveLength(30)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('não se combina com `renderExpanded`'))
  })
})

describe('Table — colunas fixas', () => {
  const pinnedColumns: TableColumn<Invoice>[] = [
    { key: 'status', header: 'Status', pinned: 'end' },
    { key: 'amount', header: 'Valor', align: 'end' },
    { key: 'customer', header: 'Cliente', rowHeader: true, pinned: 'start' },
    { key: 'id', header: 'Código', pinned: 'start' },
  ]

  /** Toda célula de cabeçalho mede 100px (a de seleção, 40px). */
  function mockWidths() {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      const col = (this as HTMLElement).dataset?.col
      return new DOMRect(0, 0, col === '__select' ? 40 : col ? 100 : 0, 0)
    })
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('leva as colunas fixas para as bordas, na ordem dada', () => {
    render(<Table caption="Faturas" columns={pinnedColumns} data={data} />)
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Cliente',
      'Código',
      'Valor',
      'Status',
    ])
    expect(screen.getByRole('table')).toHaveClass('or-table--pinned')
    const cells = Array.from(bodyRows()[0].children)
    expect(cells.map((cell) => cell.classList.contains('or-table__cell--pinned'))).toEqual([true, true, false, true])
    // A última fixa do início e a primeira do fim marcam o limite com uma borda.
    expect(cells[1]).toHaveClass('or-table__cell--pinned-edge-start')
    expect(cells[0]).not.toHaveClass('or-table__cell--pinned-edge-start')
    expect(cells[3]).toHaveClass('or-table__cell--pinned-edge-end')
  })

  it('cada célula fixa fica à distância da soma das larguras das fixas antes dela', () => {
    mockWidths()
    render(<Table caption="Faturas" columns={pinnedColumns} data={data} selectable />)
    const head = screen.getAllByRole('columnheader')
    // seleção (40px) → Cliente → Código; Status no fim.
    expect(head[0]).toHaveClass('or-table__select', 'or-table__cell--pinned')
    expect(head[0].style.insetInlineStart).toBe('0')
    expect(head[1].style.insetInlineStart).toBe('40px')
    expect(head[2].style.insetInlineStart).toBe('140px')
    expect(head[3].style.insetInlineStart).toBe('')
    expect(head[4].style.insetInlineEnd).toBe('0')
    const cells = Array.from(bodyRows()[0].children) as HTMLElement[]
    expect(cells[0].style.insetInlineStart).toBe('0')
    expect(cells[1].style.insetInlineStart).toBe('40px')
    expect(cells[2].style.insetInlineStart).toBe('140px')
    expect(cells[4].style.insetInlineEnd).toBe('0')
  })

  it('publica a largura das faixas fixas para o foco nunca parar sob elas', () => {
    mockWidths()
    const { rerender } = render(<Table caption="Faturas" columns={pinnedColumns} data={data} selectable />)
    const container = screen.getByRole('table').parentElement!
    expect(container).toHaveClass('or-table-container--pinned')
    // início: seleção (40) + Cliente (100) + Código (100); fim: Status (100).
    expect(container.style.getPropertyValue('--_pin-start')).toBe('240px')
    expect(container.style.getPropertyValue('--_pin-end')).toBe('100px')
    rerender(<Table caption="Faturas" columns={columns} data={data} selectable />)
    expect(container).not.toHaveClass('or-table-container--pinned')
    expect(container.style.getPropertyValue('--_pin-start')).toBe('')
  })

  it('só com colunas fixas no fim, a seleção não fixa', () => {
    render(
      <Table
        caption="Faturas"
        columns={pinnedColumns.map((c) => (c.pinned === 'start' ? { ...c, pinned: undefined } : c))}
        data={data}
        selectable
      />,
    )
    expect(screen.getAllByRole('columnheader')[0]).not.toHaveClass('or-table__cell--pinned')
  })

  it('filtros e colunas ocultas acompanham: a célula do filtro também fixa', () => {
    mockWidths()
    render(
      <Table
        caption="Faturas"
        columns={pinnedColumns.map((c) => (c.key === 'id' ? { ...c, filter: 'text' as const } : c))}
        data={data}
        hiddenColumns={['customer']}
      />,
    )
    const filterCell = screen.getByRole('searchbox', { name: 'Filtrar por Código' }).closest('td')!
    expect(filterCell).toHaveClass('or-table__cell--pinned', 'or-table__cell--pinned-edge-start')
    // Com "Cliente" oculta, "Código" é a primeira fixa.
    expect(filterCell.style.insetInlineStart).toBe('0')
  })
})

describe('Table — colunas redimensionáveis', () => {
  const resizableColumns: TableColumn<Invoice>[] = [
    { key: 'customer', header: 'Cliente', rowHeader: true, resizable: true },
    { key: 'amount', header: 'Valor', align: 'end', resizable: true, minWidth: 100, maxWidth: 300 },
    { key: 'status', header: 'Status' },
  ]

  /** Toda célula de cabeçalho mede 120px. */
  function mockWidths() {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return new DOMRect(0, 0, (this as HTMLElement).dataset?.col ? 120 : 0, 0)
    })
  }

  const originalPointerEvent = window.PointerEvent
  beforeAll(() => {
    window.PointerEvent = TestPointerEvent as unknown as typeof PointerEvent
  })
  afterAll(() => {
    window.PointerEvent = originalPointerEvent
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('cada coluna redimensionável tem um separador focável com valor, mínimo e máximo', () => {
    mockWidths()
    render(<Table caption="Faturas" columns={resizableColumns} data={data} />)
    const separators = screen.getAllByRole('separator')
    expect(separators).toHaveLength(2)
    const customer = screen.getByRole('separator', { name: 'Redimensionar coluna Cliente' })
    expect(customer).toHaveAttribute('tabindex', '0')
    expect(customer).toHaveAttribute('aria-orientation', 'vertical')
    expect(customer).toHaveAttribute('aria-valuenow', '120')
    expect(customer).toHaveAttribute('aria-valuemin', '80')
    expect(customer).toHaveAttribute('aria-valuemax', '640')
    const amount = screen.getByRole('separator', { name: 'Redimensionar coluna Valor' })
    expect(amount).toHaveAttribute('aria-valuemin', '100')
    expect(amount).toHaveAttribute('aria-valuemax', '300')
    expect(screen.getByRole('table')).toHaveClass('or-table--resizable')
    expect(screen.getByRole('table')).not.toHaveClass('or-table--fixed')
    // Metade da área de arrasto fica no começo da coluna seguinte, só para o ponteiro.
    const grabs = document.querySelectorAll('.or-table__resize-grab')
    expect(grabs).toHaveLength(2)
    expect(grabs[0]).toHaveAttribute('aria-hidden', 'true')
    expect(grabs[0].closest('th')).toHaveTextContent('Valor')
    // O nome da coluna vem só do rótulo: o separador (com rótulo próprio) fica de fora.
    expect(screen.getByRole('columnheader', { name: 'Cliente' })).toContainElement(customer)
    expect(screen.getByRole('rowheader', { name: 'Padaria Aurora' })).toBeInTheDocument()
  })

  it('teclado: setas (Shift para passos maiores), Home e End, dentro dos limites', async () => {
    mockWidths()
    const user = userEvent.setup()
    const onColumnWidthsChange = vi.fn()
    render(
      <Table caption="Faturas" columns={resizableColumns} data={data} onColumnWidthsChange={onColumnWidthsChange} />,
    )
    const separator = screen.getByRole('separator', { name: 'Redimensionar coluna Valor' })
    separator.focus()
    await user.keyboard('{ArrowRight}')
    // O primeiro redimensionamento registra a largura de todas as colunas à vista.
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 120, amount: 136, status: 120 })
    expect(separator).toHaveAttribute('aria-valuenow', '136')
    const table = screen.getByRole('table')
    expect(table).toHaveClass('or-table--fixed')
    expect(table.style.width).toBe('calc(376px + var(--_util-width, 0px))')
    expect(screen.getByRole('columnheader', { name: 'Valor' }).style.width).toBe('136px')

    await user.keyboard('{Shift>}{ArrowLeft}{/Shift}')
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 120, amount: 100, status: 120 })
    await user.keyboard('{End}')
    expect(separator).toHaveAttribute('aria-valuenow', '300')
    await user.keyboard('{ArrowRight}')
    expect(separator).toHaveAttribute('aria-valuenow', '300')
    await user.keyboard('{Home}')
    expect(separator).toHaveAttribute('aria-valuenow', '100')
    expect(separator).toHaveFocus()
  })

  it('ponteiro: arrastar o separador muda a largura; soltar encerra', () => {
    mockWidths()
    const onColumnWidthsChange = vi.fn()
    render(
      <Table caption="Faturas" columns={resizableColumns} data={data} onColumnWidthsChange={onColumnWidthsChange} />,
    )
    const separator = screen.getByRole('separator', { name: 'Redimensionar coluna Cliente' })
    const container = separator.closest('.or-table-container')!
    fireEvent.pointerDown(separator, { button: 0, clientX: 200 })
    expect(container).toHaveAttribute('data-resizing')
    expect(separator).toHaveAttribute('data-active')
    fireEvent.pointerMove(window, { clientX: 260 })
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 180, amount: 120, status: 120 })
    fireEvent.pointerMove(window, { clientX: 20 })
    // Não passa do mínimo.
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 80, amount: 120, status: 120 })
    fireEvent.pointerUp(window)
    expect(container).not.toHaveAttribute('data-resizing')
    const calls = onColumnWidthsChange.mock.calls.length
    fireEvent.pointerMove(window, { clientX: 400 })
    expect(onColumnWidthsChange).toHaveBeenCalledTimes(calls)
  })

  it('ponteiro: a metade do lado da coluna seguinte redimensiona a anterior; outro botão não', () => {
    mockWidths()
    const onColumnWidthsChange = vi.fn()
    render(
      <Table caption="Faturas" columns={resizableColumns} data={data} onColumnWidthsChange={onColumnWidthsChange} />,
    )
    const grab = document.querySelector('.or-table__resize-grab')!
    fireEvent.pointerDown(grab, { button: 2, pointerType: 'mouse', clientX: 200 })
    fireEvent.pointerMove(window, { clientX: 240 })
    expect(onColumnWidthsChange).not.toHaveBeenCalled()
    fireEvent.pointerDown(grab, { button: 0, pointerType: 'mouse', clientX: 200 })
    fireEvent.pointerMove(window, { clientX: 240 })
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 160, amount: 120, status: 120 })
    fireEvent.pointerUp(window)
  })

  it('clique duplo ou Enter no separador ajusta a coluna ao conteúdo (alternativa ao arraste)', async () => {
    // Cabeçalhos medem 120px; o rótulo, 60px; o conteúdo das células do corpo, 210px.
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if ((this as HTMLElement).dataset?.col) return new DOMRect(0, 0, 120, 0)
      return new DOMRect(0, 0, this.tagName === 'SPAN' && this.id ? 60 : 0, 0)
    })
    const measuring: boolean[] = []
    const createRange = document.createRange.bind(document)
    vi.spyOn(document, 'createRange').mockImplementation(() => {
      const range = createRange()
      range.getBoundingClientRect = () => {
        // A medição acontece com as células numa linha só.
        measuring.push(screen.getByRole('table').hasAttribute('data-measuring'))
        return new DOMRect(0, 0, 210, 0)
      }
      return range
    })
    const user = userEvent.setup()
    const onColumnWidthsChange = vi.fn()
    render(
      <Table
        caption="Faturas"
        columns={resizableColumns}
        data={data}
        onColumnWidthsChange={onColumnWidthsChange}
      />,
    )
    // Respiro e borda das células (o jsdom não carrega o CSS do componente).
    for (const cell of Array.from(screen.getByRole('table').querySelectorAll<HTMLElement>('th, td'))) {
      cell.style.padding = '0 16px'
      cell.style.borderRight = '1px solid'
    }
    const separator = screen.getByRole('separator', { name: 'Redimensionar coluna Cliente' })
    fireEvent.doubleClick(separator)
    // 210px de conteúdo + 32px de respiro + 1px de borda.
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 243, amount: 120, status: 120 })
    expect(measuring.length).toBeGreaterThan(0)
    expect(measuring.every(Boolean)).toBe(true)
    expect(screen.getByRole('table')).not.toHaveAttribute('data-measuring')

    // Pelo teclado (Enter) e respeitando o máximo da coluna (300).
    screen.getByRole('separator', { name: 'Redimensionar coluna Valor' }).focus()
    await user.keyboard('{Enter}')
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 243, amount: 243, status: 120 })

    // A metade do lado da coluna seguinte também aceita o clique duplo.
    onColumnWidthsChange.mockClear()
    fireEvent.doubleClick(document.querySelector('.or-table__resize-grab')!)
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 243, amount: 243, status: 120 })
  })

  it('controlado (columnWidths) e inicial (defaultColumnWidths)', async () => {
    mockWidths()
    const user = userEvent.setup()
    const onColumnWidthsChange = vi.fn()
    const { rerender } = render(
      <Table
        caption="Faturas"
        columns={resizableColumns}
        data={data}
        columnWidths={{ customer: 200, amount: 150, status: 90 }}
        onColumnWidthsChange={onColumnWidthsChange}
      />,
    )
    const table = screen.getByRole('table')
    expect(table).toHaveClass('or-table--fixed')
    expect(table.style.width).toBe('calc(440px + var(--_util-width, 0px))')
    screen.getByRole('separator', { name: 'Redimensionar coluna Cliente' }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ customer: 184, amount: 150, status: 90 })
    // Controlado: sem a aplicação atualizar a prop, a largura não muda.
    expect(screen.getByRole('columnheader', { name: 'Cliente' }).style.width).toBe('200px')

    rerender(
      <Table caption="Faturas" columns={resizableColumns} data={data} defaultColumnWidths={{ customer: 200 }} key="2" />,
    )
    // Só uma coluna registrada: a largura vale, mas o layout ainda é o automático.
    expect(screen.getByRole('columnheader', { name: 'Cliente' }).style.width).toBe('200px')
    expect(screen.getByRole('table')).not.toHaveClass('or-table--fixed')
  })

  it('a última coluna redimensionável ganha respiro para a área de arrasto', () => {
    render(
      <Table
        caption="Faturas"
        columns={[resizableColumns[0], { ...resizableColumns[2], resizable: true }]}
        data={data}
      />,
    )
    expect(screen.getByRole('columnheader', { name: 'Status' })).toHaveClass('or-table__cell--resize-end')
    expect(screen.getByRole('columnheader', { name: 'Cliente' })).not.toHaveClass('or-table__cell--resize-end')
    expect(within(bodyRows()[0]).getByRole('cell', { name: 'Pago' })).toHaveClass('or-table__cell--resize-end')
  })
})

describe('Table — dados grandes: idioma e acessibilidade', () => {
  it('usa as mensagens do idioma configurado', async () => {
    const user = userEvent.setup()
    const cols = filterColumns.map((c) => ({ ...c, resizable: true }))
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <TableColumnsMenu columns={cols} hiddenColumns={[]} onHiddenColumnsChange={() => {}} />
        <Table caption="Invoices" columns={cols} data={data} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Columns' })).toBeInTheDocument()
    expect(screen.getByRole('separator', { name: 'Resize column Cliente' })).toBeInTheDocument()
    expect(within(screen.getByRole('combobox', { name: 'Filter by Status' })).getAllByRole('option')[0]).toHaveTextContent(
      'All',
    )
    await user.type(screen.getByRole('searchbox', { name: 'Filter by Cliente' }), 'zz')
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('No results found')
  })

  it('não possui violações de acessibilidade', async () => {
    const cols: TableColumn<Invoice>[] = [
      { key: 'customer', header: 'Cliente', rowHeader: true, sortable: true, filter: 'text', pinned: 'start', resizable: true },
      { key: 'amount', header: 'Valor', align: 'end', sortable: true, resizable: true },
      { key: 'status', header: 'Status', filter: 'select', filterOptions: statusOptions, pinned: 'end' },
    ]
    const { container } = render(
      <div>
        <TableColumnsMenu columns={cols} hiddenColumns={['amount']} onHiddenColumnsChange={() => {}} />
        <Table
          caption="Faturas"
          columns={cols}
          data={data}
          selectable
          striped
          maxHeight={300}
          virtualized
          defaultFilters={{ status: 'Pago' }}
          defaultColumnWidths={{ customer: 200, amount: 120, status: 140 }}
        />
        <Table
          caption="Faturas sem resultado"
          columns={cols}
          data={data}
          defaultFilters={{ customer: 'zz' }}
          hiddenColumns={['amount']}
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
