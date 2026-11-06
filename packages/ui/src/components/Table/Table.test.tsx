import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Table, type TableColumn, type TableProps } from './Table'

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
