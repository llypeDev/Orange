import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import { ToggleButton } from './ToggleButton'
import { ToggleButtonGroup } from './ToggleButtonGroup'

describe('ToggleButton', () => {
  it('alterna aria-pressed com o mouse (não controlado)', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    render(<ToggleButton onPressedChange={onPressedChange}>Remoto</ToggleButton>)
    const button = screen.getByRole('button', { name: 'Remoto' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('data-state', 'off')
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('data-state', 'on')
    expect(onPressedChange).toHaveBeenLastCalledWith(true)
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(onPressedChange).toHaveBeenLastCalledWith(false)
  })

  it('alterna com Enter e Espaço', async () => {
    const user = userEvent.setup()
    render(<ToggleButton defaultPressed>Notificações</ToggleButton>)
    const button = screen.getByRole('button', { name: 'Notificações' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
    button.focus()
    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    await user.keyboard(' ')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('modo controlado só muda quando o pai atualiza', async () => {
    const user = userEvent.setup()
    const onPressedChange = vi.fn()
    const { rerender } = render(
      <ToggleButton pressed={false} onPressedChange={onPressedChange}>
        Seguir
      </ToggleButton>,
    )
    const button = screen.getByRole('button', { name: 'Seguir' })
    await user.click(button)
    expect(onPressedChange).toHaveBeenCalledWith(true)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    rerender(
      <ToggleButton pressed onPressedChange={onPressedChange}>
        Seguir
      </ToggleButton>,
    )
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('mostra o check em botões com texto e não em botões só com ícone', () => {
    const { container } = render(
      <>
        <ToggleButton defaultPressed>Híbrido</ToggleButton>
        <ToggleButton iconOnly aria-label="Negrito" startIcon={<Icon name="bold" />} />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Híbrido' })).toHaveClass(
      'or-toggle-button--with-check',
    )
    expect(screen.getByRole('button', { name: 'Negrito' })).not.toHaveClass(
      'or-toggle-button--with-check',
    )
    const indicators = container.querySelectorAll('.or-toggle-button__check')
    expect(indicators).toHaveLength(1)
    // Espaço fixo com os dois ícones (+ solto, check pressionado): a largura não muda.
    expect(indicators[0]).toHaveAttribute('aria-hidden', 'true')
    expect(indicators[0].querySelector('[data-icon="plus"]')).toHaveClass(
      'or-toggle-button__check-off',
    )
    expect(indicators[0].querySelector('[data-icon="check"]')).toHaveClass(
      'or-toggle-button__check-on',
    )
  })

  it('respeita preventDefault no onClick e o estado desabilitado', async () => {
    const user = userEvent.setup()
    render(
      <>
        <ToggleButton onClick={(e) => e.preventDefault()}>Bloqueado</ToggleButton>
        <ToggleButton disabled>Desabilitado</ToggleButton>
      </>,
    )
    await user.click(screen.getByRole('button', { name: 'Bloqueado' }))
    expect(screen.getByRole('button', { name: 'Bloqueado' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    await user.click(screen.getByRole('button', { name: 'Desabilitado' }))
    expect(screen.getByRole('button', { name: 'Desabilitado' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})

describe('ToggleButtonGroup', () => {
  it('type="single": no máximo um pressionado e clicar de novo solta', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ToggleButtonGroup
        type="single"
        aria-label="Alinhamento"
        defaultValue="left"
        onChange={onChange}
      >
        <ToggleButton value="left">Esquerda</ToggleButton>
        <ToggleButton value="center">Centro</ToggleButton>
        <ToggleButton value="right">Direita</ToggleButton>
      </ToggleButtonGroup>,
    )
    expect(screen.getByRole('group', { name: 'Alinhamento' })).toBeInTheDocument()
    const left = screen.getByRole('button', { name: 'Esquerda' })
    const center = screen.getByRole('button', { name: 'Centro' })
    expect(left).toHaveAttribute('aria-pressed', 'true')
    await user.click(center)
    expect(onChange).toHaveBeenLastCalledWith('center')
    expect(center).toHaveAttribute('aria-pressed', 'true')
    expect(left).toHaveAttribute('aria-pressed', 'false')
    await user.click(center)
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(center).toHaveAttribute('aria-pressed', 'false')
  })

  it('type="multiple": combina vários valores', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ToggleButtonGroup type="multiple" aria-label="Formatação" onChange={onChange}>
        <ToggleButton value="bold">Negrito</ToggleButton>
        <ToggleButton value="italic">Itálico</ToggleButton>
      </ToggleButtonGroup>,
    )
    await user.click(screen.getByRole('button', { name: 'Negrito' }))
    expect(onChange).toHaveBeenLastCalledWith(['bold'])
    await user.click(screen.getByRole('button', { name: 'Itálico' }))
    expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic'])
    expect(screen.getByRole('button', { name: 'Negrito' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Negrito' }))
    expect(onChange).toHaveBeenLastCalledWith(['italic'])
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string | null>('week')
      return (
        <>
          <ToggleButtonGroup
            type="single"
            aria-label="Período"
            value={value}
            onChange={(v) => v && setValue(v)}
          >
            <ToggleButton value="day">Dia</ToggleButton>
            <ToggleButton value="week">Semana</ToggleButton>
          </ToggleButtonGroup>
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)
    await user.click(screen.getByRole('button', { name: 'Dia' }))
    expect(screen.getByRole('status')).toHaveTextContent('day')
    // O pai ignora `null`: clicar no pressionado não solta.
    await user.click(screen.getByRole('button', { name: 'Dia' }))
    expect(screen.getByRole('button', { name: 'Dia' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('repassa size, variant e disabled aos botões', () => {
    render(
      <ToggleButtonGroup
        type="multiple"
        aria-label="Filtros"
        size="sm"
        variant="ghost"
        disabled
        attached
      >
        <ToggleButton value="a">Abertos</ToggleButton>
        <ToggleButton value="b" size="lg">
          Fechados
        </ToggleButton>
      </ToggleButtonGroup>,
    )
    const open = screen.getByRole('button', { name: 'Abertos' })
    expect(open).toHaveClass('or-button--sm', 'or-button--ghost')
    expect(open).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Fechados' })).toHaveClass('or-button--lg')
    expect(screen.getByRole('group')).toHaveClass('or-button-group--attached')
  })

  it('opera pelo teclado com Tab e Espaço', async () => {
    const user = userEvent.setup()
    render(
      <ToggleButtonGroup type="multiple" aria-label="Formatação">
        <ToggleButton value="bold">Negrito</ToggleButton>
        <ToggleButton value="italic">Itálico</ToggleButton>
      </ToggleButtonGroup>,
    )
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Itálico' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('button', { name: 'Itálico' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ToggleButton defaultPressed>Remoto</ToggleButton>
        <ToggleButton
          variant="ghost"
          iconOnly
          aria-label="Favoritar"
          startIcon={<Icon name="star" />}
        />
        <ToggleButtonGroup type="single" aria-label="Alinhamento" defaultValue="center" attached>
          <ToggleButton
            value="left"
            iconOnly
            aria-label="Alinhar à esquerda"
            startIcon={<Icon name="align-left" />}
          />
          <ToggleButton
            value="center"
            iconOnly
            aria-label="Centralizar"
            startIcon={<Icon name="align-center" />}
          />
        </ToggleButtonGroup>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
