import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { List, ListItem } from './List'

describe('List', () => {
  it('renderiza <ul> com marcadores por padrão e mantém o papel de lista', () => {
    render(
      <List aria-label="Benefícios">
        <ListItem>Suporte em português</ListItem>
        <ListItem>Exportação em CSV</ListItem>
      </List>,
    )
    const list = screen.getByRole('list', { name: 'Benefícios' })
    expect(list.tagName).toBe('UL')
    expect(list).toHaveClass('or-list', 'or-list--bullet', 'or-list--md')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
  })

  it('numbered usa <ol>, respeita start e reinicia o contador', () => {
    render(
      <List variant="numbered" start={3}>
        <ListItem>Configure o domínio</ListItem>
        <ListItem>Convide a equipe</ListItem>
      </List>,
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(list).toHaveAttribute('start', '3')
    expect(list).toHaveStyle({ counterReset: 'or-list 2' })
  })

  it('permite trocar o elemento com `as`', () => {
    render(
      <List variant="divided" as="ol">
        <ListItem>Primeiro</ListItem>
      </List>,
    )
    expect(screen.getByRole('list').tagName).toBe('OL')
  })

  it('variante icon mostra o ícone da lista ou do item, oculto de leitores de tela', () => {
    const { container } = render(
      <List variant="icon" icon={<Icon name="check" />}>
        <ListItem>Backups diários</ListItem>
        <ListItem icon={<Icon name="lock" />}>Criptografia ponta a ponta</ListItem>
      </List>,
    )
    const icons = container.querySelectorAll('.or-list__icon')
    expect(icons).toHaveLength(2)
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true')
    expect(icons[0].querySelector('[data-icon="check"]')).not.toBeNull()
    expect(icons[1].querySelector('[data-icon="lock"]')).not.toBeNull()
  })

  it('ícones só aparecem na variante icon', () => {
    const { container } = render(
      <List icon={<Icon name="check" />}>
        <ListItem>Item</ListItem>
      </List>,
    )
    expect(container.querySelector('.or-list__icon')).toBeNull()
  })

  it('ListItem exibe descrição secundária', () => {
    render(
      <List variant="divided">
        <ListItem description="Último acesso há 2 horas">Ana Souza</ListItem>
      </List>,
    )
    const item = screen.getByRole('listitem')
    expect(within(item).getByText('Ana Souza')).toHaveClass('or-list__label')
    expect(within(item).getByText('Último acesso há 2 horas')).toHaveClass('or-list__description')
  })

  it('aplica tamanho e variante inline', () => {
    render(
      <List variant="inline" size="sm">
        <ListItem>Termos</ListItem>
        <ListItem>Privacidade</ListItem>
      </List>,
    )
    expect(screen.getByRole('list')).toHaveClass('or-list--inline', 'or-list--sm')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <List>
          <ListItem>Um</ListItem>
        </List>
        <List variant="numbered">
          <ListItem description="Leva 2 minutos">Crie a conta</ListItem>
          <ListItem>
            Configure a equipe
            <List variant="bullet" size="sm">
              <ListItem>Convide pessoas</ListItem>
            </List>
          </ListItem>
        </List>
        <List variant="icon" icon={<Icon name="check" />}>
          <ListItem>Com ícone</ListItem>
        </List>
        <List variant="inline">
          <ListItem>A</ListItem>
          <ListItem>B</ListItem>
        </List>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
