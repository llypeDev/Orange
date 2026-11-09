import { isValidElement, type ReactElement, type ReactNode } from 'react'
import { Icon } from '../../icons'
import { useLocale } from '../../providers'
import { Button } from '../Button'
import { Dropdown, DropdownCheckboxItem, type DropdownPlacement } from '../Dropdown'
import type { TableColumn } from './Table'

export interface TableColumnsMenuProps<T> {
  /** As mesmas colunas da `Table`. Colunas com `hideable: false` não entram no menu. */
  columns: TableColumn<T>[]
  /** `key` das colunas ocultas (o mesmo valor passado à `Table` em `hiddenColumns`). */
  hiddenColumns: string[]
  /** Chamado com a nova lista quando a pessoa mostra ou oculta uma coluna. */
  onHiddenColumnsChange: (hidden: string[]) => void
  /** Texto do botão. Padrão: "Colunas", no idioma do provider. */
  label?: ReactNode
  /** Botão que abre o menu, no lugar do padrão (contorno, pequeno, com ícone). */
  trigger?: ReactElement
  /** Posição do menu em relação ao botão. Padrão: `bottom-end`. */
  placement?: DropdownPlacement
  /** Itens a mais no fim do menu: um `DropdownSeparator` e "Restaurar padrão", por exemplo. */
  children?: ReactNode
}

/** Texto de um cabeçalho de coluna (pode ser um nó React). */
function headerText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(headerText).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return headerText(node.props.children)
  return ''
}

/**
 * Menu "Colunas" de uma `Table`: um item marcável por coluna, para a pessoa escolher o que quer
 * ver. O estado fica com a aplicação (`hiddenColumns`), que o passa também à tabela — assim dá
 * para guardar a escolha. Coloque o menu perto da tabela, na barra de ações acima dela.
 */
export function TableColumnsMenu<T>({
  columns,
  hiddenColumns,
  onHiddenColumnsChange,
  label,
  trigger,
  placement = 'bottom-end',
  children,
}: TableColumnsMenuProps<T>) {
  const { t } = useLocale()
  const hidden = new Set(hiddenColumns)
  const options = columns.filter((column) => column.hideable !== false)

  const toggle = (key: string, visible: boolean) => {
    const next = new Set(hidden)
    if (visible) next.delete(key)
    else next.add(key)
    // Na ordem das colunas, para o valor não depender da ordem dos cliques.
    onHiddenColumnsChange(columns.map((column) => column.key).filter((k) => next.has(k)))
  }

  return (
    <Dropdown
      placement={placement}
      trigger={
        trigger ?? (
          <Button variant="outline" size="sm" startIcon={<Icon name="sliders" />}>
            {label ?? t('tableColumns')}
          </Button>
        )
      }
    >
      {options.map((column) => (
        <DropdownCheckboxItem
          key={column.key}
          checked={!hidden.has(column.key)}
          onCheckedChange={(visible) => toggle(column.key, visible)}
        >
          {headerText(column.header) || column.key}
        </DropdownCheckboxItem>
      ))}
      {children}
    </Dropdown>
  )
}
