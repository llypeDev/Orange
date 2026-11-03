import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { Button } from '../Button'
import { IconButton } from '../IconButton/IconButton'
import { ButtonGroup } from './ButtonGroup'

describe('ButtonGroup', () => {
  it('renderiza role="group" com nome acessível', () => {
    render(
      <ButtonGroup aria-label="Ações do documento">
        <Button>Salvar</Button>
        <Button>Publicar</Button>
      </ButtonGroup>,
    )
    const group = screen.getByRole('group', { name: 'Ações do documento' })
    expect(group).toHaveClass('or-button-group', 'or-button-group--horizontal')
    expect(group).toHaveAttribute('data-orientation', 'horizontal')
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('repassa size e variant aos Buttons sem sobrescrever o que foi definido', () => {
    render(
      <ButtonGroup aria-label="Edição" size="sm" variant="outline">
        <Button>Cortar</Button>
        <Button variant="primary" size="lg">
          Colar
        </Button>
      </ButtonGroup>,
    )
    expect(screen.getByRole('button', { name: 'Cortar' })).toHaveClass(
      'or-button--outline',
      'or-button--sm',
    )
    expect(screen.getByRole('button', { name: 'Colar' })).toHaveClass(
      'or-button--primary',
      'or-button--lg',
    )
  })

  it('repassa size e variant via contexto para IconButton', () => {
    render(
      <ButtonGroup aria-label="Zoom" size="lg" variant="outline">
        <IconButton icon="minus" label="Diminuir zoom" />
        <IconButton icon="plus" label="Aumentar zoom" variant="ghost" />
      </ButtonGroup>,
    )
    expect(screen.getByRole('button', { name: 'Diminuir zoom' })).toHaveClass(
      'or-button--outline',
      'or-button--lg',
    )
    expect(screen.getByRole('button', { name: 'Aumentar zoom' })).toHaveClass(
      'or-button--ghost',
      'or-button--lg',
    )
  })

  it('aplica attached e orientation vertical', () => {
    render(
      <ButtonGroup aria-label="Alinhamento" attached orientation="vertical">
        <Button>Topo</Button>
        <Button>Base</Button>
      </ButtonGroup>,
    )
    const group = screen.getByRole('group')
    expect(group).toHaveClass('or-button-group--attached', 'or-button-group--vertical')
    expect(group).toHaveAttribute('data-orientation', 'vertical')
  })

  it('disabled desabilita todos os botões, que não disparam clique', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ButtonGroup aria-label="Navegação" disabled>
        <Button onClick={onClick}>Anterior</Button>
        <IconButton icon="chevron-right" label="Próximo" onClick={onClick} />
      </ButtonGroup>,
    )
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('mantém a ordem de Tab natural entre os botões', async () => {
    const user = userEvent.setup()
    render(
      <ButtonGroup aria-label="Ações">
        <Button>Um</Button>
        <Button>Dois</Button>
      </ButtonGroup>,
    )
    await user.tab()
    expect(screen.getByRole('button', { name: 'Um' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Dois' })).toHaveFocus()
  })

  it('avisa em desenvolvimento quando falta nome acessível', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <ButtonGroup>
        <Button>Sem nome</Button>
      </ButtonGroup>,
    )
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('aria-label'))
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ButtonGroup aria-label="Exportar">
          <Button variant="outline" startIcon={<Icon name="download" />}>
            CSV
          </Button>
          <Button variant="outline">PDF</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Zoom" attached variant="outline">
          <IconButton icon="minus" label="Diminuir zoom" />
          <Button>100%</Button>
          <IconButton icon="plus" label="Aumentar zoom" />
        </ButtonGroup>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
