import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './Tabs'

function Example(props: Partial<TabsProps>) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Configurações da conta">
        <Tab value="perfil">Perfil</Tab>
        <Tab value="seguranca">Segurança</Tab>
        <Tab value="faturas" disabled>
          Faturas
        </Tab>
        <Tab value="notificacoes" badge={3}>
          Notificações
        </Tab>
      </TabList>
      <TabPanel value="perfil">Dados do perfil</TabPanel>
      <TabPanel value="seguranca">Senha e 2FA</TabPanel>
      <TabPanel value="faturas">Histórico de faturas</TabPanel>
      <TabPanel value="notificacoes">Preferências de e-mail</TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renderiza tablist, tabs e painel com os vínculos ARIA', () => {
    render(<Example />)
    const tablist = screen.getByRole('tablist', { name: 'Configurações da conta' })
    expect(tablist).not.toHaveAttribute('aria-orientation')
    const perfil = screen.getByRole('tab', { name: 'Perfil' })
    expect(perfil).toHaveAttribute('aria-selected', 'true')
    expect(perfil).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Segurança' })).toHaveAttribute('tabindex', '-1')
    const panel = screen.getByRole('tabpanel', { name: 'Perfil' })
    expect(panel).toHaveTextContent('Dados do perfil')
    expect(perfil).toHaveAttribute('aria-controls', panel.id)
    expect(panel).toHaveAttribute('tabindex', '0')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
  })

  it('seleciona a primeira aba habilitada quando não há defaultValue', () => {
    render(
      <Tabs>
        <TabList aria-label="Relatórios">
          <Tab value="a" disabled>
            Anual
          </Tab>
          <Tab value="b">Mensal</Tab>
        </TabList>
        <TabPanel value="a">A</TabPanel>
        <TabPanel value="b">B</TabPanel>
      </Tabs>,
    )
    expect(screen.getByRole('tab', { name: 'Mensal' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('B')
  })

  it('troca de aba com o mouse e chama onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Example defaultValue="perfil" onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: 'Segurança' }))
    expect(onChange).toHaveBeenCalledWith('seguranca')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Senha e 2FA')
    await user.click(screen.getByRole('tab', { name: 'Faturas' }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('ativação automática: setas, Home e End movem o foco, pulam desabilitadas e selecionam', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.tab()
    expect(screen.getByRole('tab', { name: 'Perfil' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Segurança' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Senha e 2FA')
    await user.keyboard('{ArrowRight}')
    const notificacoes = screen.getByRole('tab', { name: /Notificações/ })
    expect(notificacoes).toHaveFocus()
    expect(notificacoes).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Perfil' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(notificacoes).toHaveFocus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Perfil' })).toHaveFocus()
    await user.keyboard('{End}')
    expect(notificacoes).toHaveFocus()
    // Tab sai da lista e vai para o painel
    await user.tab()
    expect(screen.getByRole('tabpanel')).toHaveFocus()
  })

  it('ativação manual: setas só movem o foco; Enter e Espaço selecionam', async () => {
    const user = userEvent.setup()
    render(<Example activation="manual" />)
    await user.tab()
    await user.keyboard('{ArrowRight}')
    const seguranca = screen.getByRole('tab', { name: 'Segurança' })
    expect(seguranca).toHaveFocus()
    expect(seguranca).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Dados do perfil')
    await user.keyboard('{Enter}')
    expect(seguranca).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowRight}')
    await user.keyboard(' ')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Preferências de e-mail')
  })

  it('orientação vertical usa ↑/↓ e expõe aria-orientation', async () => {
    const user = userEvent.setup()
    render(<Example orientation="vertical" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')
    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Perfil' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Segurança' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('tab', { name: 'Perfil' })).toHaveFocus()
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('seguranca')
      return (
        <>
          <Example value={value} onChange={setValue} />
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('tab', { name: 'Segurança' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: /Notificações/ }))
    expect(screen.getByRole('status')).toHaveTextContent('notificacoes')
  })

  it('só aponta aria-controls para painéis que existem', () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Filtros">
          <Tab value="a">Todos</Tab>
          <Tab value="b">Favoritos</Tab>
        </TabList>
        <TabPanel value="a">Lista</TabPanel>
      </Tabs>,
    )
    expect(screen.getByRole('tab', { name: 'Todos' })).toHaveAttribute('aria-controls')
    expect(screen.getByRole('tab', { name: 'Favoritos' })).not.toHaveAttribute('aria-controls')
  })

  it('line tem um indicador único (decorativo) que acompanha a aba ativa; enclosed não', () => {
    const { container, unmount } = render(<Example />)
    const indicator = container.querySelector('.or-tabs__indicator')
    expect(indicator).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('tablist')).toContainElement(indicator as HTMLElement)
    unmount()
    const enclosed = render(<Example variant="enclosed" />)
    expect(enclosed.container.querySelector('.or-tabs__indicator')).toBeNull()
  })

  it('painéis só entram animados depois da primeira troca de aba', async () => {
    const user = userEvent.setup()
    render(<Example />)
    expect(screen.getByRole('tabpanel')).not.toHaveAttribute('data-motion')
    await user.click(screen.getByRole('tab', { name: 'Segurança' }))
    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-motion')
  })

  it('aplica variante, tamanho e fitted', () => {
    const { container } = render(<Example variant="enclosed" size="lg" fitted />)
    expect(container.firstChild).toHaveClass('or-tabs--enclosed', 'or-tabs--lg', 'or-tabs--fitted')
  })

  it('keepMounted mantém painéis inativos montados e escondidos', () => {
    render(
      <Tabs defaultValue="a">
        <TabList aria-label="Seções">
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">Conteúdo A</TabPanel>
        <TabPanel value="b" keepMounted>
          Conteúdo B
        </TabPanel>
      </Tabs>,
    )
    const hiddenPanel = screen.getByText('Conteúdo B')
    expect(hiddenPanel).not.toBeVisible()
  })

  describe('lista com rolagem horizontal', () => {
    // Layout simulado: abas de 120px lado a lado numa lista de 300px que rola (4 abas = 480px).
    function mockLayout() {
      vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
        this: HTMLElement,
      ) {
        const list = this.closest<HTMLElement>('[role="tablist"]')
        const isTab = this.getAttribute('role') === 'tab'
        const left =
          isTab && list ? Array.from(list.children).indexOf(this) * 120 - list.scrollLeft : 0
        const width = this === list ? 300 : isTab ? 120 : 0
        return {
          left,
          right: left + width,
          top: 0,
          bottom: 40,
          width,
          height: 40,
          x: left,
          y: 0,
        } as DOMRect
      })
    }

    it('setas, Home e End rolam só a lista até a aba focada', async () => {
      const user = userEvent.setup()
      mockLayout()
      const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
      render(<Example />)
      const tablist = screen.getByRole('tablist')
      await user.tab()
      await user.keyboard('{End}')
      expect(screen.getByRole('tab', { name: /Notificações/ })).toHaveFocus()
      // A última aba termina em 480px: a lista rola 180px para mostrá-la inteira.
      expect(tablist.scrollLeft).toBe(180)
      await user.keyboard('{Home}')
      expect(tablist.scrollLeft).toBe(0)
      // ← na primeira aba volta para a última.
      await user.keyboard('{ArrowLeft}')
      expect(tablist.scrollLeft).toBe(180)
      // Nunca rola a página (scrollIntoView rolaria também os ancestrais).
      expect(scrollIntoView).not.toHaveBeenCalled()
    })

    it('ativação manual: a aba focada (ainda não selecionada) também fica visível', async () => {
      const user = userEvent.setup()
      mockLayout()
      render(<Example activation="manual" />)
      await user.tab()
      await user.keyboard('{End}')
      expect(screen.getByRole('tab', { name: /Notificações/ })).toHaveAttribute(
        'aria-selected',
        'false',
      )
      expect(screen.getByRole('tablist').scrollLeft).toBe(180)
    })

    it('a aba selecionada por clique, valor inicial ou mudança controlada fica visível', async () => {
      const user = userEvent.setup()
      mockLayout()
      const { unmount } = render(<Example defaultValue="notificacoes" />)
      expect(screen.getByRole('tablist').scrollLeft).toBe(180)
      await user.click(screen.getByRole('tab', { name: 'Perfil' }))
      expect(screen.getByRole('tablist').scrollLeft).toBe(0)
      unmount()
      const { rerender } = render(<Example value="perfil" />)
      expect(screen.getByRole('tablist').scrollLeft).toBe(0)
      rerender(<Example value="notificacoes" />)
      expect(screen.getByRole('tablist').scrollLeft).toBe(180)
    })
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Example />
        <Example variant="enclosed" orientation="vertical" />
        <Tabs defaultValue="x">
          <TabList aria-label="Somente abas">
            <Tab value="x">Dia</Tab>
            <Tab value="y">Semana</Tab>
          </TabList>
        </Tabs>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
