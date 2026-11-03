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

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Example />
        <Example variant="enclosed" orientation="vertical" />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
