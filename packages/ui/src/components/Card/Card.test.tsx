import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { Card, CardBody, CardFooter, CardHeader, CardLink, CardMedia } from './Card'

describe('Card', () => {
  it('renderiza as partes com variante e tamanho', () => {
    render(
      <Card as="article" variant="accent" size="lg" data-testid="card">
        <CardHeader eyebrow="Plano" title="Profissional" description="Para equipes em crescimento" />
        <CardBody>Até 20 usuários e suporte prioritário.</CardBody>
        <CardFooter divider>
          <Button>Assinar</Button>
        </CardFooter>
      </Card>,
    )
    const card = screen.getByTestId('card')
    expect(card.tagName).toBe('ARTICLE')
    expect(card).toHaveClass('or-card', 'or-card--accent', 'or-card--lg')
    expect(screen.getByRole('heading', { level: 3, name: 'Profissional' })).toHaveClass('or-card__title')
    expect(screen.getByText('Plano')).toHaveClass('or-eyebrow')
    expect(screen.getByText('Até 20 usuários e suporte prioritário.')).toHaveClass('or-card__body')
    expect(screen.getByRole('button', { name: 'Assinar' }).parentElement).toHaveClass('or-card__footer--divider')
  })

  it('título com href vira link dentro do heading; nível configurável', () => {
    render(
      <Card>
        <CardHeader title="Relatório de vendas" href="/relatorios/vendas" headingLevel={2} />
      </Card>,
    )
    const heading = screen.getByRole('heading', { level: 2, name: 'Relatório de vendas' })
    const link = screen.getByRole('link', { name: 'Relatório de vendas' })
    expect(heading).toContainElement(link)
    expect(link).toHaveAttribute('href', '/relatorios/vendas')
    expect(link).toHaveClass('or-card__link')
  })

  it('interactive: o cartão é clicável pelo link do título e outras ações continuam funcionando', async () => {
    const user = userEvent.setup()
    const onFavorite = vi.fn()
    render(
      <Card interactive data-testid="card">
        <CardHeader
          title="Campanha de Black Friday"
          href="#campanha"
          actions={<Button iconOnly aria-label="Favoritar" variant="ghost" onClick={onFavorite} />}
        />
        <CardBody>Resultados até 30/11.</CardBody>
      </Card>,
    )
    expect(screen.getByTestId('card')).toHaveClass('or-card--interactive')
    await user.tab()
    expect(screen.getByRole('link', { name: 'Campanha de Black Friday' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Favoritar' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(onFavorite).toHaveBeenCalledTimes(1)
  })

  it('CardLink aceita um componente de roteador via as', () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
      function RouterLink({ to, ...props }, ref) {
        return <a ref={ref} href={`/app${to}`} data-router="" {...props} />
      },
    )
    render(
      <Card interactive>
        <CardHeader title={<CardLink as={RouterLink} to="/clientes/42">Padaria Aurora</CardLink>} />
      </Card>,
    )
    const link = screen.getByRole('link', { name: 'Padaria Aurora' })
    expect(link).toHaveAttribute('href', '/app/clientes/42')
    expect(link).toHaveClass('or-card__link')
  })

  it('CardMedia renderiza a imagem com alt e proporção', () => {
    render(
      <Card>
        <CardMedia src="/capa.jpg" alt="Equipe reunida no escritório" ratio="4/3" data-testid="media" />
      </Card>,
    )
    expect(screen.getByRole('img', { name: 'Equipe reunida no escritório' })).toHaveAttribute('src', '/capa.jpg')
    expect(screen.getByTestId('media').style.aspectRatio).toBe('4/3')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <ul>
        <Card as="li" interactive>
          <CardMedia src="/capa.jpg" alt="" />
          <CardHeader eyebrow="Guia" title="Como emitir notas fiscais" href="#nf" />
          <CardBody>Passo a passo para emitir NF-e.</CardBody>
          <CardFooter>
            <Button variant="outline" size="sm">
              Salvar
            </Button>
          </CardFooter>
        </Card>
        <Card as="li" variant="raised">
          <CardHeader title="Uso de armazenamento" />
          <CardBody>72% de 100 GB.</CardBody>
        </Card>
      </ul>,
    )
    await expectNoA11yViolations(container)
  })
})
