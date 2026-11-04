import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { TreeView, type TreeViewItem, type TreeViewProps } from './TreeView'

const items: TreeViewItem[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'card', label: 'Card.tsx' },
        ],
      },
      { id: 'hooks', label: 'hooks', children: [{ id: 'use-id', label: 'useId.ts' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'docs', label: 'docs', children: [{ id: 'guia', label: 'Guia de início.md' }] },
  { id: 'readme', label: 'README.md' },
  { id: 'licenca', label: 'LICENSE', disabled: true },
]

function renderTree(props: Partial<TreeViewProps> = {}) {
  return render(<TreeView aria-label="Arquivos do projeto" items={items} {...props} />)
}

const item = (name: string) => screen.getByRole('treeitem', { name })

describe('TreeView', () => {
  it('renderiza a árvore com papéis e atributos ARIA', () => {
    renderTree({ defaultExpanded: ['src'] })
    const tree = screen.getByRole('tree', { name: 'Arquivos do projeto' })
    expect(tree).not.toHaveAttribute('aria-multiselectable')
    const src = item('src')
    expect(src).toHaveAttribute('aria-expanded', 'true')
    expect(src).toHaveAttribute('aria-level', '1')
    expect(src).toHaveAttribute('aria-setsize', '4')
    expect(src).toHaveAttribute('aria-posinset', '1')
    const components = item('components')
    expect(components).toHaveAttribute('aria-level', '2')
    expect(components).toHaveAttribute('aria-expanded', 'false')
    // o grupo de filhos é associado ao item pai por aria-owns (padrão APG)
    const group = components.closest('[role="group"]')!
    expect(group).not.toBeNull()
    expect(src).toHaveAttribute('aria-owns', group.id)
    expect(components.parentElement).toHaveAttribute('role', 'none')
    // folha não tem aria-expanded
    expect(item('index.ts')).not.toHaveAttribute('aria-expanded')
    // filhos de itens recolhidos não são renderizados
    expect(screen.queryByRole('treeitem', { name: 'Button.tsx' })).not.toBeInTheDocument()
    expect(item('LICENSE')).toHaveAttribute('aria-disabled', 'true')
  })

  it('o nome do item não inclui o texto dos filhos', () => {
    renderTree({ defaultExpanded: ['src', 'components'] })
    expect(item('components')).toHaveAccessibleName('components')
  })

  it('apenas um item fica na ordem de tabulação (roving tabindex)', async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpanded: ['src'] })
    const tabbable = screen.getAllByRole('treeitem').filter((el) => el.tabIndex === 0)
    expect(tabbable).toHaveLength(1)
    await user.tab()
    expect(item('src')).toHaveFocus()
  })

  it('o item selecionado recebe o foco ao entrar na árvore', async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpanded: ['src'], defaultSelected: ['index'] })
    await user.tab()
    expect(item('index.ts')).toHaveFocus()
  })

  it('setas ↑/↓ percorrem os itens visíveis e Home/End vão às pontas', async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpanded: ['src'] })
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(item('components')).toHaveFocus()
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    expect(item('docs')).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(item('index.ts')).toHaveFocus()
    await user.keyboard('{End}')
    expect(item('LICENSE')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(item('LICENSE')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(item('src')).toHaveFocus()
  })

  it('→ expande e depois entra no primeiro filho; ← recolhe e depois volta ao pai', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    renderTree({ onExpandedChange })
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(item('src')).toHaveAttribute('aria-expanded', 'true')
    expect(onExpandedChange).toHaveBeenLastCalledWith(['src'])
    expect(item('src')).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(item('components')).toHaveFocus()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(item('index.ts')).toHaveFocus()
    // folha: → não faz nada
    await user.keyboard('{ArrowRight}')
    expect(item('index.ts')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(item('src')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(item('src')).toHaveAttribute('aria-expanded', 'false')
    expect(onExpandedChange).toHaveBeenLastCalledWith([])
  })

  it('grupos animam ao expandir (não na montagem) e saem do DOM ao recolher', async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpanded: ['src'] })
    const srcGroup = document.getElementById(item('src').getAttribute('aria-owns')!)!
    const srcCollapse = srcGroup.parentElement!
    // aberto na montagem: sem animação de entrada
    expect(srcCollapse).toHaveClass('or-tree__collapse', 'or-tree__collapse--static')
    expect(srcCollapse).toHaveAttribute('data-state', 'open')
    expect(srcCollapse).not.toHaveAttribute('inert')

    await user.click(screen.getByText('docs'))
    const docsCollapse = document.getElementById(item('docs').getAttribute('aria-owns')!)!.parentElement!
    expect(docsCollapse).toHaveAttribute('data-state', 'open')
    expect(docsCollapse).not.toHaveClass('or-tree__collapse--static')

    await user.click(screen.getByText('docs'))
    // sem CSS de animação (jsdom), o grupo desmonta na hora
    expect(screen.queryByRole('treeitem', { name: 'Guia de início.md' })).not.toBeInTheDocument()
    expect(item('docs')).not.toHaveAttribute('aria-owns')
  })

  it('* expande todos os irmãos do item focado', async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpanded: ['src'] })
    await user.tab()
    await user.keyboard('{ArrowDown}*')
    expect(item('components')).toHaveAttribute('aria-expanded', 'true')
    expect(item('hooks')).toHaveAttribute('aria-expanded', 'true')
    expect(item('components')).toHaveFocus()
  })

  it('busca por digitação foca o próximo item que começa com o texto, sem diferenciar acentos', async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpanded: ['src', 'docs'] })
    await user.tab()
    await user.keyboard('r')
    expect(item('README.md')).toHaveFocus()
    await user.keyboard('{Home}')
    await new Promise((r) => setTimeout(r, 520))
    await user.keyboard('gui')
    expect(item('Guia de início.md')).toHaveFocus()
    await new Promise((r) => setTimeout(r, 520))
    await user.keyboard('{Home}h')
    expect(item('hooks')).toHaveFocus()
  })

  it('seleção única com Enter, Espaço e clique', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const onAction = vi.fn()
    renderTree({ defaultExpanded: ['src'], onSelectedChange, onAction })
    await user.tab()
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}')
    expect(item('index.ts')).toHaveAttribute('aria-selected', 'true')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['index'])
    expect(onAction).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'index' }))
    // no modo single, itens não selecionados não recebem aria-selected
    expect(item('src')).not.toHaveAttribute('aria-selected')

    await user.keyboard('{ArrowDown}{ArrowDown} ')
    expect(item('README.md')).toHaveAttribute('aria-selected', 'true')
    expect(item('index.ts')).not.toHaveAttribute('aria-selected')

    await user.click(screen.getByText('hooks'))
    expect(item('hooks')).toHaveAttribute('aria-selected', 'true')
    expect(item('hooks')).toHaveAttribute('aria-expanded', 'true')
    expect(item('hooks')).toHaveFocus()
  })

  it('item desabilitado não é selecionado nem expandido, mas recebe foco', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    renderTree({ onSelectedChange })
    await user.click(screen.getByText('LICENSE'))
    expect(item('LICENSE')).toHaveFocus()
    await user.keyboard('{Enter} ')
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('o chevron só alterna a expansão; expandOnClick=false preserva a pasta ao clicar na linha', async () => {
    const user = userEvent.setup()
    const { container } = renderTree({ expandOnClick: false })
    await user.click(screen.getByText('docs'))
    expect(item('docs')).toHaveAttribute('aria-expanded', 'false')
    expect(item('docs')).toHaveAttribute('aria-selected', 'true')
    const toggle = item('docs').querySelector('.or-tree__toggle')!
    await user.click(toggle)
    expect(item('docs')).toHaveAttribute('aria-expanded', 'true')
    expect(container.querySelectorAll('[aria-selected="true"]')).toHaveLength(1)
  })

  it('seleção múltipla: Espaço alterna, Shift+↓ estende e Ctrl+A seleciona tudo', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    renderTree({ selectionMode: 'multiple', defaultExpanded: ['src'], onSelectedChange })
    expect(screen.getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true')
    expect(item('src')).toHaveAttribute('aria-selected', 'false')
    await user.tab()
    await user.keyboard(' ')
    expect(item('src')).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['src', 'components', 'hooks'])
    await user.keyboard(' ')
    expect(item('hooks')).toHaveAttribute('aria-selected', 'false')
    await user.click(screen.getByText('README.md'))
    expect(item('README.md')).toHaveAttribute('aria-selected', 'true')
    expect(item('src')).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{Control>}a{/Control}')
    const all = onSelectedChange.mock.lastCall![0] as string[]
    expect(all).toContain('button')
    expect(all).not.toContain('licenca')
  })

  it('selectionMode="none": Enter alterna pastas e não há aria-selected', async () => {
    const user = userEvent.setup()
    renderTree({ selectionMode: 'none' })
    await user.tab()
    await user.keyboard('{Enter}')
    expect(item('src')).toHaveAttribute('aria-expanded', 'true')
    expect(item('src')).not.toHaveAttribute('aria-selected')
  })

  it('funciona controlado (expanded/selected)', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [expanded, setExpanded] = useState<string[]>(['docs'])
      const [selected, setSelected] = useState<string[]>([])
      return (
        <>
          <TreeView
            aria-label="Docs"
            items={items}
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelectedChange={setSelected}
          />
          <output data-testid="state">{`${expanded.join(',')}|${selected.join(',')}`}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(item('Guia de início.md')).toBeInTheDocument()
    await user.click(screen.getByText('Guia de início.md'))
    expect(screen.getByTestId('state')).toHaveTextContent('docs|guia')
    await user.click(screen.getByText('docs'))
    expect(screen.getByTestId('state')).toHaveTextContent('|docs')
  })

  it('usa ícones padrão de pasta/arquivo e permite ícones próprios', () => {
    const { container, rerender } = render(
      <TreeView aria-label="x" items={[{ id: 'a', label: 'A', children: [] }, { id: 'b', label: 'B' }]} />,
    )
    expect(container.querySelector('[data-icon="folder"]')).not.toBeNull()
    expect(container.querySelector('[data-icon="file"]')).not.toBeNull()
    rerender(<TreeView aria-label="x" defaultIcons={false} items={[{ id: 'b', label: 'B' }]} />)
    expect(container.querySelector('.or-tree__icon')).toBeNull()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <TreeView aria-label="Arquivos" items={items} defaultExpanded={['src', 'components']} defaultSelected={['card']} />
        <TreeView aria-label="Seleção" items={items} selectionMode="multiple" defaultSelected={['readme']} />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
