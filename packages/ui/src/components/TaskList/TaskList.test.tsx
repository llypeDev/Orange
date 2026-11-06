import { createRef } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { TaskList, TaskListItem, type TaskListProps } from './TaskList'

function Loja(props: Partial<TaskListProps>) {
  return (
    <TaskList title="Configure sua loja" {...props}>
      <TaskListItem href="#/empresa" status="complete">
        Dados da empresa
      </TaskListItem>
      <TaskListItem href="#/pagamentos" status="in-progress" description="Pix, boleto e cartão">
        Formas de pagamento
      </TaskListItem>
      <TaskListItem href="#/frete" status="not-started">
        Frete
      </TaskListItem>
      <TaskListItem
        href="#/dominio"
        status="cannot-start"
        statusLabel="Disponível após configurar o frete"
      >
        Domínio
      </TaskListItem>
      <TaskListItem href="#/catalogo" status="error" description="2 produtos sem preço">
        Catálogo
      </TaskListItem>
    </TaskList>
  )
}

const list = () => screen.getByRole('list', { name: 'Configure sua loja' })
const row = (name: string) =>
  within(list())
    .getAllByRole('listitem')
    .find((li) => li.textContent?.includes(name))!

describe('TaskList', () => {
  describe('semântica', () => {
    it('é uma lista (ul/li) nomeada pelo título, que é um heading', () => {
      render(<Loja />)
      const heading = screen.getByRole('heading', { level: 2, name: 'Configure sua loja' })
      expect(list().tagName).toBe('UL')
      expect(list()).toHaveAttribute('aria-labelledby', heading.id)
      expect(within(list()).getAllByRole('listitem')).toHaveLength(5)
    })

    it('headingLevel troca o nível do título', () => {
      render(<Loja headingLevel={4} />)
      expect(
        screen.getByRole('heading', { level: 4, name: 'Configure sua loja' }),
      ).toBeInTheDocument()
    })

    it('sem título, aria-label nomeia a lista e não há resumo', () => {
      render(
        <TaskList aria-label="Pendências do cadastro">
          <TaskListItem status="not-started">Frete</TaskListItem>
        </TaskList>,
      )
      expect(screen.getByRole('list', { name: 'Pendências do cadastro' })).toBeInTheDocument()
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    it('o link tem o título como nome e é descrito pela descrição e pelo status', () => {
      render(<Loja />)
      const link = screen.getByRole('link', { name: 'Formas de pagamento' })
      expect(link).toHaveAttribute('href', '#/pagamentos')
      expect(link).toHaveAccessibleDescription('Pix, boleto e cartão Em andamento')
      // Sem descrição, só o status descreve o link.
      expect(screen.getByRole('link', { name: 'Dados da empresa' })).toHaveAccessibleDescription(
        'Concluído',
      )
    })

    it('o status é texto visível dentro da linha', () => {
      render(<Loja />)
      expect(row('Frete')).toHaveTextContent('Não iniciado')
      expect(row('Catálogo')).toHaveTextContent('Com erro')
    })
  })

  describe('status e tons', () => {
    it('cada status usa o tom de tag da biblioteca', () => {
      render(<Loja />)
      const tag = (name: string) => row(name).querySelector('.or-tag')
      expect(tag('Dados da empresa')).toHaveClass('or-tag--success')
      expect(tag('Formas de pagamento')).toHaveClass('or-tag--info')
      expect(tag('Frete')).toHaveClass('or-tag--neutral')
      expect(tag('Catálogo')).toHaveClass('or-tag--danger')
      expect(row('Dados da empresa')).toHaveAttribute('data-status', 'complete')
    })

    it('cannot-start mostra texto simples, sem tag', () => {
      render(<Loja />)
      const li = row('Domínio')
      expect(li.querySelector('.or-tag')).toBeNull()
      expect(li).toHaveTextContent('Disponível após configurar o frete')
    })

    it('statusLabel substitui o texto padrão', () => {
      render(
        <TaskList aria-label="Tarefas">
          <TaskListItem href="#/nf" status="in-progress" statusLabel="Rascunho salvo">
            Nota fiscal
          </TaskListItem>
        </TaskList>,
      )
      expect(screen.getByRole('link', { name: 'Nota fiscal' })).toHaveAccessibleDescription(
        'Rascunho salvo',
      )
    })

    it('rótulos padrão no idioma do provider', () => {
      render(
        <OrangeProvider locale="en-US">
          <TaskList title="Set up your store">
            <TaskListItem status="complete">Company details</TaskListItem>
            <TaskListItem status="in-progress">Payments</TaskListItem>
            <TaskListItem status="not-started">Shipping</TaskListItem>
            <TaskListItem status="cannot-start">Domain</TaskListItem>
            <TaskListItem status="error">Catalog</TaskListItem>
          </TaskList>
        </OrangeProvider>,
      )
      const texts = screen
        .getAllByRole('listitem')
        .map((li) => li.querySelector('.or-task-list__status')?.textContent)
      expect(texts).toEqual([
        'Completed',
        'In progress',
        'Not started',
        'Cannot start yet',
        'Error',
      ])
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '1 of 5 completed')
    })
  })

  describe('links, botões e linhas sem ação', () => {
    it('cannot-start nunca é link, mesmo com href', () => {
      render(<Loja />)
      expect(screen.queryByRole('link', { name: 'Domínio' })).not.toBeInTheDocument()
      expect(row('Domínio')).not.toHaveClass('or-task-list__item--actionable')
      expect(screen.getAllByRole('link')).toHaveLength(4)
    })

    it('sem href nem onClick, o nome é texto simples', () => {
      render(
        <TaskList aria-label="Tarefas">
          <TaskListItem status="complete">Dados da empresa</TaskListItem>
        </TaskList>,
      )
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('onClick sem href vira um botão acionável por mouse e teclado', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <TaskList aria-label="Tarefas">
          <TaskListItem
            status="not-started"
            description="Convide quem cuida do estoque"
            onClick={onClick}
          >
            Equipe
          </TaskListItem>
        </TaskList>,
      )
      const button = screen.getByRole('button', { name: 'Equipe' })
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAccessibleDescription('Convide quem cuida do estoque Não iniciado')
      await user.click(button)
      await user.keyboard('{Enter}')
      await user.keyboard(' ')
      expect(onClick).toHaveBeenCalledTimes(3)
    })

    it('cannot-start ignora onClick', () => {
      render(
        <TaskList aria-label="Tarefas">
          <TaskListItem status="cannot-start" onClick={() => {}}>
            Domínio
          </TaskListItem>
        </TaskList>,
      )
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('os links entram na ordem do Tab', async () => {
      const user = userEvent.setup()
      render(<Loja />)
      await user.tab()
      expect(screen.getByRole('link', { name: 'Dados da empresa' })).toHaveFocus()
      await user.tab()
      expect(screen.getByRole('link', { name: 'Formas de pagamento' })).toHaveFocus()
      await user.tab()
      await user.tab()
      // Domínio (cannot-start) é pulado.
      expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveFocus()
    })

    it('renderLink recebe href, classe, descrição e o nome', () => {
      const renderLink = vi.fn(({ href, ...props }) => (
        <a data-router="" href={`/app${href}`} {...props} />
      ))
      render(
        <TaskList aria-label="Tarefas" renderLink={renderLink}>
          <TaskListItem href="/frete" status="not-started">
            Frete
          </TaskListItem>
        </TaskList>,
      )
      const link = screen.getByRole('link', { name: 'Frete' })
      expect(link).toHaveAttribute('data-router')
      expect(link).toHaveAttribute('href', '/app/frete')
      expect(link).toHaveClass('or-task-list__link')
      expect(link).toHaveAccessibleDescription('Não iniciado')
      expect(renderLink).toHaveBeenCalledWith(expect.objectContaining({ href: '/frete' }))
    })
  })

  describe('resumo de progresso', () => {
    it('conta as tarefas concluídas a partir dos filhos', () => {
      render(<Loja />)
      const bar = screen.getByRole('progressbar', { name: 'Configure sua loja' })
      expect(bar).toHaveAttribute('aria-valuenow', '1')
      expect(bar).toHaveAttribute('aria-valuemax', '5')
      expect(bar).toHaveAttribute('aria-valuetext', '1 de 5 concluídas')
      // O texto visível repete o valor anunciado: fica fora da árvore de acessibilidade.
      expect(screen.getByText('1 de 5 concluídas')).toHaveAttribute('aria-hidden', 'true')
    })

    it('conta itens gerados com .map()', () => {
      const tarefas = ['complete', 'complete', 'complete', 'in-progress', 'not-started'] as const
      render(
        <TaskList title="Configure sua loja">
          {tarefas.map((status, i) => (
            <TaskListItem key={i} status={status}>
              Tarefa {i + 1}
            </TaskListItem>
          ))}
        </TaskList>,
      )
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 de 5 concluídas')
    })

    it('completed e total substituem a contagem (com limites)', () => {
      const { rerender } = render(<Loja completed={3} total={8} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '3 de 8 concluídas')
      rerender(<Loja completed={12} total={8} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '8')
    })

    it('fica verde quando tudo está concluído', () => {
      render(
        <TaskList title="Configure sua loja">
          <TaskListItem status="complete">Dados da empresa</TaskListItem>
          <TaskListItem status="complete">Frete</TaskListItem>
        </TaskList>,
      )
      expect(document.querySelector('.or-progress-bar')).toHaveClass('or-progress-bar--success')
    })

    it('showProgress={false} esconde a barra; showProgress sem título usa um nome padrão', () => {
      const { rerender } = render(<Loja showProgress={false} />)
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Configure sua loja' })).toBeInTheDocument()
      rerender(<Loja title={undefined} aria-label="Configure sua loja" showProgress />)
      expect(screen.getByRole('progressbar', { name: 'Progresso das tarefas' })).toHaveAttribute(
        'aria-valuetext',
        '1 de 5 concluídas',
      )
    })

    it('sem tarefas, não mostra progresso', () => {
      render(<TaskList title="Configure sua loja" />)
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  describe('movimento', () => {
    it('o status só anima quando muda depois de montado', () => {
      const { rerender } = render(
        <TaskList aria-label="Tarefas">
          <TaskListItem status="in-progress">Frete</TaskListItem>
        </TaskList>,
      )
      const status = () => document.querySelector('.or-task-list__status')!
      expect(status()).not.toHaveAttribute('data-changed')
      rerender(
        <TaskList aria-label="Tarefas">
          <TaskListItem status="complete">Frete</TaskListItem>
        </TaskList>,
      )
      expect(status()).toHaveAttribute('data-changed')
      expect(status()).toHaveTextContent('Concluído')
    })
  })

  it('repassa ref e props para a raiz e para os itens', () => {
    const rootRef = createRef<HTMLDivElement>()
    const itemRef = createRef<HTMLLIElement>()
    render(
      <TaskList ref={rootRef} aria-label="Tarefas" className="extra" data-testid="raiz">
        <TaskListItem ref={itemRef} status="complete" className="item-extra">
          Frete
        </TaskListItem>
      </TaskList>,
    )
    expect(rootRef.current).toBe(screen.getByTestId('raiz'))
    expect(rootRef.current).toHaveClass('or-task-list', 'extra')
    expect(itemRef.current?.tagName).toBe('LI')
    expect(itemRef.current).toHaveClass('or-task-list__item', 'item-extra')
  })

  it('não tem violações de acessibilidade', async () => {
    const { container } = render(<Loja />)
    await expectNoA11yViolations(container)
  })

  it('não tem violações de acessibilidade com botões e sem título', async () => {
    const { container } = render(
      <TaskList aria-label="Tarefas" showProgress>
        <TaskListItem status="not-started" onClick={() => {}}>
          Equipe
        </TaskListItem>
        <TaskListItem status="cannot-start">Domínio</TaskListItem>
      </TaskList>,
    )
    await expectNoA11yViolations(container)
  })
})
