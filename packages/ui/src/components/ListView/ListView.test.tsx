import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Dropdown, DropdownItem } from '../Dropdown'
import { IconButton } from '../IconButton'
import { ListView, ListViewItem, type ListViewProps } from './ListView'

interface Member {
  id: string
  name: string
  role: string
  disabled?: boolean
}

const members: Member[] = [
  { id: 'ana', name: 'Ana Souza', role: 'Administradora' },
  { id: 'bruno', name: 'Bruno Lima', role: 'Editor' },
  { id: 'carla', name: 'Carla Dias', role: 'Convite pendente', disabled: true },
  { id: 'diego', name: 'Diego Alves', role: 'Editor' },
  { id: 'elisa', name: 'Élisa Moraes', role: 'Leitora' },
]

function renderList(props: Partial<ListViewProps> = {}, list: Member[] = members) {
  return render(
    <>
      <button type="button">Antes</button>
      <ListView aria-label="Membros da equipe" {...props}>
        {list.map((member) => (
          <ListViewItem
            key={member.id}
            id={member.id}
            description={member.role}
            disabled={member.disabled}
            actions={
              <>
                <IconButton
                  size="sm"
                  icon="edit"
                  label={`Editar ${member.name}`}
                  disabled={member.disabled}
                />
                <IconButton
                  size="sm"
                  icon="trash"
                  label={`Remover ${member.name}`}
                  disabled={member.disabled}
                />
              </>
            }
          >
            {member.name}
          </ListViewItem>
        ))}
      </ListView>
      <button type="button">Depois</button>
    </>,
  )
}

const row = (name: string) => screen.getByRole('row', { name })
const button = (name: string) => screen.getByRole('button', { name })
const focusRow = (name: string) => act(() => row(name).focus())

describe('ListView', () => {
  it('renderiza a grade com linhas, células, nomes e descrições', () => {
    renderList()
    const grid = screen.getByRole('grid', { name: 'Membros da equipe' })
    expect(grid).not.toHaveAttribute('aria-multiselectable')
    const rows = within(grid).getAllByRole('row')
    expect(rows).toHaveLength(5)
    expect(within(rows[0]).getByRole('gridcell')).toBeInTheDocument()
    // nome só do título; a descrição vem de aria-describedby
    expect(rows[0]).toHaveAccessibleName('Ana Souza')
    expect(rows[0]).toHaveAccessibleDescription('Administradora')
    // sem seleção, as linhas não expõem aria-selected
    expect(rows[0]).not.toHaveAttribute('aria-selected')
    expect(row('Carla Dias')).toHaveAttribute('aria-disabled', 'true')
  })

  it('repassa ref, className e demais props ao elemento raiz', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ListView ref={ref} aria-label="Arquivos" className="extra" data-testid="lista">
        <ListViewItem id="a">Relatório.pdf</ListViewItem>
      </ListView>,
    )
    expect(ref.current).toBe(screen.getByRole('grid'))
    expect(ref.current).toHaveClass('or-list-view', 'or-list-view--md', 'extra')
    expect(ref.current).toHaveAttribute('data-testid', 'lista')
  })

  it('tem uma única parada de Tab: as ações ficam fora da ordem de tabulação', async () => {
    const user = userEvent.setup()
    renderList()
    const tabbable = screen.getAllByRole('row').filter((el) => el.tabIndex === 0)
    expect(tabbable).toHaveLength(1)
    expect(button('Editar Ana Souza')).toHaveAttribute('tabindex', '-1')
    await user.tab()
    await user.tab()
    expect(row('Ana Souza')).toHaveFocus()
    await user.tab()
    expect(button('Depois')).toHaveFocus()
    // ao voltar, o foco retorna à última linha visitada
    focusRow('Diego Alves')
    await user.tab()
    await user.tab({ shift: true })
    expect(row('Diego Alves')).toHaveFocus()
  })

  it('a linha selecionada é a parada de Tab ao entrar na lista', async () => {
    const user = userEvent.setup()
    renderList({ selectionMode: 'single', defaultSelected: ['diego'] })
    await user.tab()
    await user.tab()
    expect(row('Diego Alves')).toHaveFocus()
  })

  it('↑/↓ movem entre as linhas, inclusive as desabilitadas, sem dar a volta', async () => {
    const user = userEvent.setup()
    renderList()
    focusRow('Ana Souza')
    await user.keyboard('{ArrowUp}')
    expect(row('Ana Souza')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(row('Bruno Lima')).toHaveFocus()
    // como no Listbox e no TreeView, a linha desabilitada recebe foco
    await user.keyboard('{ArrowDown}')
    expect(row('Carla Dias')).toHaveFocus()
    expect(row('Carla Dias')).toHaveAttribute('tabindex', '0')
    expect(row('Ana Souza')).toHaveAttribute('tabindex', '-1')
    await user.keyboard('{ArrowDown}')
    expect(row('Diego Alves')).toHaveFocus()
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(row('Bruno Lima')).toHaveFocus()
  })

  it('Home/End e PageUp/PageDown vão às pontas da lista', async () => {
    const user = userEvent.setup()
    renderList()
    focusRow('Bruno Lima')
    await user.keyboard('{End}')
    expect(row('Élisa Moraes')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(row('Ana Souza')).toHaveFocus()
    // sem layout (jsdom) uma "página" cobre a lista inteira
    await user.keyboard('{PageDown}')
    expect(row('Élisa Moraes')).toHaveFocus()
    await user.keyboard('{PageUp}')
    expect(row('Ana Souza')).toHaveFocus()
  })

  it('→/← entram nas ações da linha e voltam para ela', async () => {
    const user = userEvent.setup()
    renderList()
    focusRow('Bruno Lima')
    await user.keyboard('{ArrowRight}')
    expect(button('Editar Bruno Lima')).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(button('Remover Bruno Lima')).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(row('Bruno Lima')).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(button('Remover Bruno Lima')).toHaveFocus()
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(row('Bruno Lima')).toHaveFocus()
    // de dentro de uma ação, ↓ vai para a próxima linha e Tab sai da lista
    await user.keyboard('{ArrowRight}{ArrowDown}')
    expect(row('Carla Dias')).toHaveFocus()
    // a linha desabilitada não tem o que focar (ações desabilitadas): → não sai dela
    await user.keyboard('{ArrowRight}')
    expect(row('Carla Dias')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(row('Diego Alves')).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    await user.tab()
    expect(button('Depois')).toHaveFocus()
  })

  it('Enter e Espaço numa ação ficam com a ação', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onEdit = vi.fn()
    render(
      <ListView aria-label="Integrações" selectionMode="multiple" onAction={onAction}>
        <ListViewItem
          id="slack"
          actions={<IconButton icon="edit" label="Configurar Slack" onClick={onEdit} />}
        >
          Slack
        </ListViewItem>
      </ListView>,
    )
    focusRow('Slack')
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(button('Configurar Slack')).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onEdit).toHaveBeenCalledTimes(2)
    expect(onAction).not.toHaveBeenCalled()
    expect(row('Slack')).toHaveAttribute('aria-selected', 'false')
    await user.click(button('Configurar Slack'))
    expect(onAction).not.toHaveBeenCalled()
  })

  it('seleção única: Espaço, Enter e clique selecionam e substituem (não controlado)', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    renderList({ selectionMode: 'single', onSelectedChange })
    expect(row('Ana Souza')).toHaveAttribute('aria-selected', 'false')
    expect(row('Carla Dias')).toHaveAttribute('aria-selected', 'false')
    // sem onAction não há indicador de seleção na seleção única
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    focusRow('Ana Souza')
    await user.keyboard(' ')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana'])
    expect(row('Ana Souza')).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowDown}{Enter}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['bruno'])
    expect(row('Ana Souza')).toHaveAttribute('aria-selected', 'false')
    await user.click(screen.getByText('Élisa Moraes'))
    expect(row('Élisa Moraes')).toHaveFocus()
    expect(onSelectedChange).toHaveBeenLastCalledWith(['elisa'])
    expect(onSelectedChange).toHaveBeenCalledTimes(3)
  })

  it('seleção única: Espaço, Enter e clique na linha já selecionada a mantêm selecionada', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    renderList({ selectionMode: 'single', defaultSelected: ['bruno'], onSelectedChange })
    focusRow('Bruno Lima')
    await user.keyboard(' ')
    await user.keyboard('{Enter}')
    await user.click(screen.getByText('Bruno Lima'))
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(row('Bruno Lima')).toHaveAttribute('aria-selected', 'true')
    // selecionar outra linha substitui a seleção
    await user.keyboard('{ArrowUp} ')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana'])
    expect(row('Bruno Lima')).toHaveAttribute('aria-selected', 'false')
  })

  it('seleção múltipla: caixas de seleção acessíveis que alternam só a própria linha', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const { container } = renderList({
      selectionMode: 'multiple',
      defaultSelected: ['diego'],
      onSelectedChange,
    })
    expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true')
    const checkbox = screen.getByRole('checkbox', { name: 'Selecionar Ana Souza' })
    expect(checkbox).not.toBeChecked()
    expect(checkbox).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('checkbox', { name: 'Selecionar Diego Alves' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Selecionar Carla Dias' })).toBeDisabled()
    await user.click(checkbox)
    // a seleção segue a ordem das linhas
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'diego'])
    expect(row('Ana Souza')).toHaveAttribute('aria-selected', 'true')
    expect(row('Diego Alves')).toHaveAttribute('aria-selected', 'true')
    // a caixa entra na navegação por → como o primeiro elemento da linha
    focusRow('Bruno Lima')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('checkbox', { name: 'Selecionar Bruno Lima' })).toHaveFocus()
    await user.keyboard(' ')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'bruno', 'diego'])
    await user.keyboard('{ArrowLeft}')
    expect(row('Bruno Lima')).toHaveFocus()
    await user.keyboard(' ')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'diego'])
    await expectNoA11yViolations(container)
  })

  it('Ctrl/Cmd + A seleciona todas as linhas habilitadas e, de novo, limpa', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    renderList({ selectionMode: 'multiple', onSelectedChange })
    focusRow('Ana Souza')
    await user.keyboard('{Control>}a{/Control}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'bruno', 'diego', 'elisa'])
    // a linha desabilitada fica de fora (mesmo com Ctrl + A pressionado nela)
    expect(row('Carla Dias')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('status')).toHaveTextContent('4 itens selecionados')
    focusRow('Carla Dias')
    await user.keyboard('{Meta>}a{/Meta}')
    expect(onSelectedChange).toHaveBeenLastCalledWith([])
    expect(screen.getByRole('status')).toHaveTextContent('Nenhum item selecionado')
  })

  it('Shift + ↑/↓ estende a seleção a partir da linha focada', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    renderList({ selectionMode: 'multiple', onSelectedChange })
    focusRow('Ana Souza')
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'bruno'])
    // o foco passa pela linha desabilitada, que fica fora da faixa
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
    expect(row('Carla Dias')).toHaveFocus()
    expect(row('Carla Dias')).toHaveAttribute('aria-selected', 'false')
    expect(onSelectedChange).toHaveBeenCalledTimes(1)
    await user.keyboard('{Shift>}{ArrowDown}{ArrowDown}{/Shift}')
    expect(row('Élisa Moraes')).toHaveFocus()
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'bruno', 'diego', 'elisa'])
    // voltar em direção à âncora encolhe a faixa
    await user.keyboard('{Shift>}{ArrowUp}{/Shift}')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'bruno', 'diego'])
    // sem Shift, a extensão termina: só move o foco
    await user.keyboard('{ArrowUp}')
    expect(onSelectedChange).toHaveBeenCalledTimes(4)
  })

  it('onAction: Enter e clique no fundo da linha disparam a ação; Espaço seleciona', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onSelectedChange = vi.fn()
    renderList({ selectionMode: 'multiple', onAction, onSelectedChange })
    focusRow('Bruno Lima')
    await user.keyboard('{Enter}')
    expect(onAction).toHaveBeenLastCalledWith('bruno')
    expect(onSelectedChange).not.toHaveBeenCalled()
    await user.click(
      screen.getByText('Editor', { selector: '#' + row('Diego Alves').id + '-description' }),
    )
    expect(onAction).toHaveBeenLastCalledWith('diego')
    expect(row('Diego Alves')).toHaveFocus()
    await user.keyboard(' ')
    expect(onSelectedChange).toHaveBeenLastCalledWith(['diego'])
    // a caixa de seleção alterna sem disparar a ação
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Ana Souza' }))
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana', 'diego'])
    expect(onAction).toHaveBeenCalledTimes(2)
  })

  it('seleção única com onAction mostra botões de opção para o mouse', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onSelectedChange = vi.fn()
    const { container } = renderList({ selectionMode: 'single', onAction, onSelectedChange })
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    const bruno = screen.getByRole('radio', { name: 'Selecionar Bruno Lima' })
    expect(bruno).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('radio', { name: 'Selecionar Carla Dias' })).toBeDisabled()
    await user.click(bruno)
    expect(onSelectedChange).toHaveBeenLastCalledWith(['bruno'])
    expect(bruno).toBeChecked()
    // clicar de novo não desmarca
    await user.click(bruno)
    expect(onSelectedChange).toHaveBeenCalledTimes(1)
    expect(bruno).toBeChecked()
    await user.click(screen.getByRole('radio', { name: 'Selecionar Ana Souza' }))
    expect(onSelectedChange).toHaveBeenLastCalledWith(['ana'])
    expect(bruno).not.toBeChecked()
    expect(onAction).not.toHaveBeenCalled()
    await expectNoA11yViolations(container)
  })

  it('sem seleção, Enter, Espaço e clique disparam onAction', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    renderList({ onAction })
    focusRow('Ana Souza')
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onAction).toHaveBeenCalledTimes(2)
    expect(onAction).toHaveBeenLastCalledWith('ana')
    await user.click(screen.getByText('Bruno Lima'))
    expect(onAction).toHaveBeenLastCalledWith('bruno')
  })

  it('seleção controlada: reflete `selected` e só muda quando o pai atualiza', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const { rerender } = render(
      <ListView
        aria-label="Arquivos"
        selectionMode="multiple"
        selected={['b']}
        onSelectedChange={onSelectedChange}
      >
        <ListViewItem id="a">Contrato.pdf</ListViewItem>
        <ListViewItem id="b">Proposta.docx</ListViewItem>
      </ListView>,
    )
    expect(row('Proposta.docx')).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByText('Contrato.pdf'))
    expect(onSelectedChange).toHaveBeenLastCalledWith(['a', 'b'])
    expect(row('Contrato.pdf')).toHaveAttribute('aria-selected', 'false')
    rerender(
      <ListView
        aria-label="Arquivos"
        selectionMode="multiple"
        selected={['a']}
        onSelectedChange={onSelectedChange}
      >
        <ListViewItem id="a">Contrato.pdf</ListViewItem>
        <ListViewItem id="b">Proposta.docx</ListViewItem>
      </ListView>,
    )
    expect(row('Contrato.pdf')).toHaveAttribute('aria-selected', 'true')
    expect(row('Proposta.docx')).toHaveAttribute('aria-selected', 'false')
  })

  it('funciona com estado controlado pelo pai', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [selected, setSelected] = useState<string[]>([])
      return (
        <>
          <ListView
            aria-label="Arquivos"
            selectionMode="multiple"
            selected={selected}
            onSelectedChange={setSelected}
          >
            <ListViewItem id="a">Contrato.pdf</ListViewItem>
            <ListViewItem id="b">Proposta.docx</ListViewItem>
          </ListView>
          <p>{selected.join(',') || 'nada'}</p>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('checkbox', { name: 'Selecionar Proposta.docx' }))
    await user.click(screen.getByText('Contrato.pdf'))
    expect(screen.getByText('a,b')).toBeInTheDocument()
  })

  it('linhas desabilitadas recebem foco, mas não seleção nem ação', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onSelectedChange = vi.fn()
    renderList({ selectionMode: 'multiple', onAction, onSelectedChange })
    const carla = row('Carla Dias')
    expect(carla).toHaveAttribute('tabindex', '-1')
    expect(carla).toHaveAttribute('aria-disabled', 'true')
    expect(carla).toHaveAttribute('aria-selected', 'false')
    // clique: foca a linha, sem ação nem seleção
    await user.click(screen.getByText('Carla Dias'))
    expect(carla).toHaveFocus()
    expect(carla).toHaveAttribute('tabindex', '0')
    await user.keyboard(' ')
    await user.keyboard('{Enter}')
    expect(onAction).not.toHaveBeenCalled()
    expect(onSelectedChange).not.toHaveBeenCalled()
    expect(carla).toHaveAttribute('aria-selected', 'false')
  })

  it('sem seleção, a linha desabilitada não dispara onAction (Enter, Espaço, clique)', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    renderList({ onAction })
    focusRow('Bruno Lima')
    await user.keyboard('{ArrowDown}')
    expect(row('Carla Dias')).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    await user.click(screen.getByText('Carla Dias'))
    expect(onAction).not.toHaveBeenCalled()
  })

  it('linhas desabilitadas nas pontas: Home/End, PageUp/PageDown e a parada de Tab as alcançam', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Antes</button>
        <ListView aria-label="Planos">
          <ListViewItem id="gratis" disabled>
            Grátis
          </ListViewItem>
          <ListViewItem id="pro">Pro</ListViewItem>
          <ListViewItem id="empresa" disabled>
            Empresa
          </ListViewItem>
        </ListView>
      </>,
    )
    // sem seleção, a parada de Tab é a primeira linha, mesmo desabilitada (como no Listbox)
    await user.tab()
    await user.tab()
    expect(row('Grátis')).toHaveFocus()
    await user.keyboard('{End}')
    expect(row('Empresa')).toHaveFocus()
    await user.keyboard('{Home}')
    expect(row('Grátis')).toHaveFocus()
    await user.keyboard('{PageDown}')
    expect(row('Empresa')).toHaveFocus()
    await user.keyboard('{PageUp}')
    expect(row('Grátis')).toHaveFocus()
  })

  it('busca por digitação pelo título ou textValue, ignorando acentos', async () => {
    const user = userEvent.setup()
    render(
      <ListView aria-label="Integrações">
        <ListViewItem id="github">GitHub</ListViewItem>
        <ListViewItem id="slack">Slack</ListViewItem>
        <ListViewItem id="sentry" textValue="Sentry">
          <strong>Sentry</strong> (beta)
        </ListViewItem>
        <ListViewItem id="eletronica">Émissão eletrônica</ListViewItem>
        <ListViewItem id="segment" disabled>
          Segment
        </ListViewItem>
      </ListView>,
    )
    focusRow('GitHub')
    await user.keyboard('s')
    expect(row('Slack')).toHaveFocus()
    await user.keyboard('s')
    expect(row('Sentry (beta)')).toHaveFocus()
    // a linha desabilitada também é alcançada (como no Listbox e no TreeView)
    await user.keyboard('s')
    expect(row('Segment')).toHaveFocus()
    await user.keyboard('s')
    expect(row('Slack')).toHaveFocus()
    await new Promise((resolve) => setTimeout(resolve, 600))
    await user.keyboard('em')
    expect(row('Émissão eletrônica')).toHaveFocus()
  })

  it('mostra o estado vazio numa linha da grade', async () => {
    const { container, rerender } = render(<ListView aria-label="Integrações">{[]}</ListView>)
    expect(screen.getByRole('gridcell')).toHaveTextContent('Nenhum resultado encontrado')
    rerender(
      <ListView
        aria-label="Integrações"
        emptyState={<button type="button">Conectar integração</button>}
      >
        {[]}
      </ListView>,
    )
    // o conteúdo do estado vazio continua na ordem de Tab
    expect(button('Conectar integração')).not.toHaveAttribute('tabindex')
    await expectNoA11yViolations(container)
  })

  it('devolve o foco à linha vizinha quando a linha focada é removida', async () => {
    const user = userEvent.setup()
    function Team() {
      const [list, setList] = useState(members)
      return (
        <ListView aria-label="Membros da equipe">
          {list.map((member) => (
            <ListViewItem
              key={member.id}
              id={member.id}
              actions={
                <IconButton
                  icon="trash"
                  label={`Remover ${member.name}`}
                  onClick={() => setList((prev) => prev.filter((m) => m.id !== member.id))}
                />
              }
            >
              {member.name}
            </ListViewItem>
          ))}
        </ListView>
      )
    }
    render(<Team />)
    focusRow('Bruno Lima')
    await user.keyboard('{ArrowRight}{Enter}')
    expect(screen.queryByRole('row', { name: 'Bruno Lima' })).not.toBeInTheDocument()
    expect(row('Carla Dias')).toHaveFocus()
    expect(row('Carla Dias')).toHaveAttribute('tabindex', '0')
  })

  it('menus das ações (em portal) não disparam a ação nem a navegação da lista', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onProfile = vi.fn()
    render(
      <ListView aria-label="Membros da equipe" onAction={onAction}>
        <ListViewItem
          id="ana"
          actions={
            <Dropdown trigger={<IconButton icon="more-horizontal" label="Ações de Ana Souza" />}>
              <DropdownItem onSelect={onProfile}>Ver perfil</DropdownItem>
              <DropdownItem>Alterar função</DropdownItem>
            </Dropdown>
          }
        >
          Ana Souza
        </ListViewItem>
        <ListViewItem id="bruno">Bruno Lima</ListViewItem>
      </ListView>,
    )
    focusRow('Ana Souza')
    await user.keyboard('{ArrowRight}')
    expect(button('Ações de Ana Souza')).toHaveFocus()
    // ↓ no gatilho abre o menu (o Dropdown trata a tecla antes da lista)
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Ver perfil' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Alterar função' })).toHaveFocus()
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onProfile).toHaveBeenCalledTimes(1)
    expect(onAction).not.toHaveBeenCalled()
    expect(button('Ações de Ana Souza')).toHaveFocus()
    await user.click(button('Ações de Ana Souza'))
    await user.click(screen.getByRole('menuitem', { name: 'Alterar função' }))
    expect(onAction).not.toHaveBeenCalled()
  })

  it('aria-label e aria-describedby da linha vindos das props têm prioridade', () => {
    render(
      <ListView aria-label="Arquivos">
        <ListViewItem
          id="a"
          aria-label="Contrato assinado"
          aria-describedby="dica"
          description="PDF · 2 MB"
        >
          Contrato.pdf
        </ListViewItem>
        <ListViewItem id="b" textValue="Planilha de custos" />
      </ListView>,
    )
    expect(row('Contrato assinado')).toHaveAttribute(
      'aria-describedby',
      expect.stringContaining('dica'),
    )
    expect(row('Contrato assinado')).toHaveAccessibleDescription('PDF · 2 MB')
    // sem children, textValue vira o nome da linha
    expect(row('Planilha de custos')).toBeInTheDocument()
  })

  it('tamanho sm aplica a classe de densidade', () => {
    renderList({ size: 'sm' })
    expect(screen.getByRole('grid')).toHaveClass('or-list-view--sm')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = renderList({
      selectionMode: 'single',
      onAction: () => {},
      defaultSelected: ['ana'],
    })
    await expectNoA11yViolations(container)
  })

  it('não tem violações de acessibilidade sem seleção', async () => {
    const { container } = renderList()
    await expectNoA11yViolations(container)
  })
})
