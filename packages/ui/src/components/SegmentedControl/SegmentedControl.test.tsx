import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl'

const periods: SegmentedControlOption[] = [
  { value: 'day', label: 'Dia' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
]

describe('SegmentedControl', () => {
  it('renderiza um radiogroup rotulado com radios nativos', () => {
    render(<SegmentedControl label="Período" options={periods} />)
    const group = screen.getByRole('radiogroup', { name: 'Período' })
    expect(group).toBeInTheDocument()
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    expect(radios[0]).toHaveAttribute('type', 'radio')
    // Sem defaultValue, a primeira opção habilitada fica selecionada.
    expect(screen.getByRole('radio', { name: 'Dia' })).toBeChecked()
    // Todos compartilham o mesmo name.
    expect(new Set(radios.map((r) => r.getAttribute('name'))).size).toBe(1)
  })

  it('seleciona com o mouse e chama onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        label="Período"
        options={periods}
        defaultValue="week"
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('radio', { name: 'Semana' })).toBeChecked()
    await user.click(screen.getByText('Mês'))
    expect(onChange).toHaveBeenCalledWith('month')
    expect(screen.getByRole('radio', { name: 'Mês' })).toBeChecked()
    expect(screen.getByText('Mês').closest('label')).toHaveAttribute('data-checked')
  })

  it('Tab entra pela opção selecionada e as setas mudam a seleção', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Antes</button>
        <SegmentedControl label="Período" options={periods} defaultValue="week" />
      </>,
    )
    await user.tab()
    await user.tab()
    expect(screen.getByRole('radio', { name: 'Semana' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Mês' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Mês' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Semana' })).toBeChecked()
  })

  it('opções desabilitadas não podem ser escolhidas', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        label="Plano"
        options={[
          { value: 'free', label: 'Gratuito', disabled: true },
          { value: 'pro', label: 'Pro' },
        ]}
        onChange={onChange}
      />,
    )
    expect(screen.getByRole('radio', { name: 'Gratuito' })).toBeDisabled()
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked()
    await user.click(screen.getByText('Gratuito'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('month')
      return (
        <>
          <SegmentedControl label="Período" options={periods} value={value} onChange={setValue} />
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)
    expect(screen.getByRole('radio', { name: 'Mês' })).toBeChecked()
    await user.click(screen.getByText('Dia'))
    expect(screen.getByRole('status')).toHaveTextContent('day')
    expect(screen.getByRole('radio', { name: 'Dia' })).toBeChecked()
  })

  it('iconOnly mantém os rótulos para leitores de tela; descrição é vinculada', () => {
    render(
      <SegmentedControl
        label="Visualização"
        hideLabel
        description="Escolha como listar os projetos"
        iconOnly
        options={[
          { value: 'list', label: 'Lista', icon: 'list' },
          { value: 'grid', label: 'Grade', icon: 'grid' },
        ]}
      />,
    )
    const group = screen.getByRole('radiogroup', { name: 'Visualização' })
    expect(group).toHaveAccessibleDescription('Escolha como listar os projetos')
    expect(screen.getByRole('radio', { name: 'Lista' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Grade' })).toBeInTheDocument()
  })

  it('disabled desabilita o grupo inteiro', () => {
    render(<SegmentedControl label="Período" options={periods} disabled size="sm" block />)
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled()
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveAttribute('aria-disabled', 'true')
    expect(group.parentElement).toHaveClass(
      'or-segmented-control--sm',
      'or-segmented-control--full-width',
    )
  })

  it('liga a transição do indicador só depois da primeira medição', async () => {
    render(<SegmentedControl label="Período" options={periods} defaultValue="week" />)
    const track = screen.getByRole('radiogroup')
    const indicator = track.querySelector('.or-segmented-control__indicator')
    expect(indicator).toHaveAttribute('aria-hidden', 'true')
    expect(track).toHaveAttribute('data-ready')
    await waitFor(() => expect(track).toHaveAttribute('data-animate'))
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <SegmentedControl label="Período" options={periods} defaultValue="week" />
        <SegmentedControl
          label="Tema"
          hideLabel
          iconOnly
          options={[
            { value: 'light', label: 'Claro', icon: 'sun' },
            { value: 'dark', label: 'Escuro', icon: 'moon' },
            { value: 'system', label: 'Sistema', icon: 'monitor', disabled: true },
          ]}
        />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
