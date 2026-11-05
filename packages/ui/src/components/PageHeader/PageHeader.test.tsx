import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Breadcrumb } from '../Breadcrumb'
import { Button } from '../Button'
import { Tab, TabList, TabPanel, Tabs } from '../Tabs'
import { Tag } from '../Tag'
import { PageHeader } from './PageHeader'

function mockReducedMotion(reduced: boolean) {
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    ...original(query),
    matches: reduced && query.includes('prefers-reduced-motion'),
  })) as typeof window.matchMedia
  return () => {
    window.matchMedia = original
  }
}

describe('PageHeader', () => {
  it('renderiza o título como h1 por padrão, com descrição e eyebrow', () => {
    const { container } = render(
      <PageHeader eyebrow="Vendas" title="Pedidos" description="Acompanhe pagamentos, envios e devoluções." />,
    )
    const heading = screen.getByRole('heading', { level: 1, name: 'Pedidos' })
    expect(heading).toHaveClass('or-page-header__title')
    expect(screen.getByText('Vendas')).toHaveClass('or-eyebrow')
    expect(screen.getByText('Acompanhe pagamentos, envios e devoluções.')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('or-page-header', 'or-page-header--h1')
    expect(container.firstChild).not.toHaveClass('or-page-header--divider')
  })

  it('aceita headingLevel 2 e 3', () => {
    const { rerender } = render(<PageHeader title="Notificações" headingLevel={2} />)
    expect(screen.getByRole('heading', { level: 2, name: 'Notificações' })).toBeInTheDocument()
    rerender(<PageHeader title="Notificações" headingLevel={3} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Notificações' })).toBeInTheDocument()
  })

  it('renderiza os slots de trilha, selos, ações e navegação', () => {
    const { container } = render(
      <PageHeader
        title="Pedido #4821"
        divider
        breadcrumbs={
          <Breadcrumb
            items={[
              { label: 'Início', href: '/' },
              { label: 'Pedidos', href: '/pedidos' },
              { label: 'Pedido #4821' },
            ]}
          />
        }
        meta={<Tag tone="success">Pago</Tag>}
        actions={
          <>
            <Button variant="outline">Imprimir</Button>
            <Button>Enviar pedido</Button>
          </>
        }
        navigation={<nav aria-label="Seções do pedido">Resumo</nav>}
      />,
    )
    expect(screen.getByRole('navigation', { name: 'Trilha de navegação' })).toBeInTheDocument()
    expect(screen.getByText('Pago')).toBeInTheDocument()
    const actions = container.querySelector('.or-page-header__actions') as HTMLElement
    expect(within(actions).getAllByRole('button').map((b) => b.textContent)).toEqual(['Imprimir', 'Enviar pedido'])
    expect(screen.getByRole('navigation', { name: 'Seções do pedido' }).parentElement).toHaveClass(
      'or-page-header__navigation',
    )
    expect(container.firstChild).toHaveClass('or-page-header--divider', 'or-page-header--with-navigation')
  })

  it('ações respondem a mouse e teclado', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()
    render(<PageHeader title="Pedidos" actions={<Button onClick={onExport}>Exportar</Button>} />)
    await user.click(screen.getByRole('button', { name: 'Exportar' }))
    await user.tab()
    await user.tab({ shift: true })
    expect(screen.getByRole('button', { name: 'Exportar' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onExport).toHaveBeenCalledTimes(2)
  })

  it('renderiza o link de volta com seta decorativa', () => {
    render(<PageHeader title="Pedido #4821" back={{ href: '/pedidos', label: 'Pedidos' }} />)
    const back = screen.getByRole('link', { name: 'Pedidos' })
    expect(back).toHaveAttribute('href', '/pedidos')
    expect(back).toHaveClass('or-page-header__back')
    expect(back.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('usa renderLink no link de volta', () => {
    const renderLink = vi.fn(({ href, ...props }) => <a data-router="" href={`#${href}`} {...props} />)
    render(<PageHeader title="Pedido #4821" back={{ href: '/pedidos', label: 'Pedidos' }} renderLink={renderLink} />)
    const back = screen.getByRole('link', { name: 'Pedidos' })
    expect(back).toHaveAttribute('href', '#/pedidos')
    expect(back).toHaveAttribute('data-router')
    expect(renderLink).toHaveBeenCalledWith(expect.objectContaining({ href: '/pedidos' }))
  })

  it('reveal liga a entrada em sequência e é desligado por padrão', () => {
    const { container, rerender } = render(<PageHeader eyebrow="Vendas" title="Pedidos" description="Resumo" />)
    expect(container.firstChild).not.toHaveClass('or-page-header--reveal')
    rerender(<PageHeader reveal eyebrow="Vendas" title="Pedidos" description="Resumo" actions={<Button>Novo</Button>} />)
    expect(container.firstChild).toHaveClass('or-page-header--reveal')
    const order = ['eyebrow', 'title-row', 'description', 'actions'].map((part) =>
      (container.querySelector(`.or-page-header__${part}`) as HTMLElement).style.getPropertyValue('--_i'),
    )
    expect(order).toEqual(['0', '1', '2', '3'])
  })

  it('reveal não faz nada com movimento reduzido', () => {
    const restore = mockReducedMotion(true)
    const { container } = render(<PageHeader reveal eyebrow="Vendas" title="Pedidos" />)
    expect(container.firstChild).not.toHaveClass('or-page-header--reveal')
    expect((container.querySelector('.or-page-header__eyebrow') as HTMLElement).getAttribute('style')).toBeNull()
    restore()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <Tabs defaultValue="resumo">
        <PageHeader
          eyebrow="Configurações"
          title="Conta da loja"
          description="Dados da empresa, faturamento e integrações."
          back={{ href: '/configuracoes', label: 'Configurações' }}
          meta={<Tag tone="info">Plano Pro</Tag>}
          actions={<Button>Salvar alterações</Button>}
          divider
          reveal
          navigation={
            <TabList aria-label="Seções da conta">
              <Tab value="resumo">Resumo</Tab>
              <Tab value="faturamento">Faturamento</Tab>
            </TabList>
          }
        />
        <TabPanel value="resumo">Resumo da conta</TabPanel>
        <TabPanel value="faturamento">Faturas</TabPanel>
      </Tabs>,
    )
    await expectNoA11yViolations(container)
  })
})
