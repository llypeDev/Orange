import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Table, type TableColumn } from './Table'

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
