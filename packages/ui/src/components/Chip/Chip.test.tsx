import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { Icon } from '../../icons'
import { expectNoA11yViolations } from '../../test/axe'
import {
  Chip,
  ChipGroup,
  type ChipGroupMultipleProps,
  type ChipGroupProps,
  type ChipGroupSingleProps,
} from './Chip'

describe('Chip', () => {
  it('é um botão de alternância com aria-pressed', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(<Chip onSelectedChange={onSelectedChange}>Frete grátis</Chip>)
    const chip = screen.getByRole('button', { name: 'Frete grátis' })
    expect(chip).toHaveAttribute('type', 'button')
    expect(chip).toHaveAttribute('aria-pressed', 'false')
    await user.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'true')
    expect(onSelectedChange).toHaveBeenLastCalledWith(true)
    await user.keyboard(' ')
    expect(chip).toHaveAttribute('aria-pressed', 'false')
    await user.keyboard('{Enter}')
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })

  it('mostra o check quando selecionado, no lugar do ícone', async () => {
    const user = userEvent.setup()
    const { container } = render(<Chip icon={<Icon name="star" />}>Favoritos</Chip>)
    expect(container.querySelector('[data-icon="star"]')).not.toBeNull()
    await user.click(screen.getByRole('button'))
    expect(container.querySelector('[data-icon="check"]')).not.toBeNull()
    expect(container.querySelector('[data-icon="star"]')).toBeNull()
  })

  it('motion: o check só anima depois de uma interação', async () => {
    const user = userEvent.setup()
    render(<Chip defaultSelected>Promoções</Chip>)
    const chip = screen.getByRole('button')
    expect(chip).not.toHaveAttribute('data-touched')
    await user.click(chip)
    await user.click(chip)
    expect(chip).toHaveAttribute('data-touched')
  })

  it('inclui a contagem no nome acessível', () => {
    render(<Chip count={12}>Ativos</Chip>)
    expect(screen.getByRole('button', { name: 'Ativos (12)' })).toBeInTheDocument()
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <Chip selected={false} onSelectedChange={onSelectedChange}>
        Promoções
      </Chip>,
    )
    await user.click(screen.getByRole('button'))
    expect(onSelectedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('ChipGroup', () => {
  it('é um group rotulado com seleção múltipla', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ChipGroup label="Status do pedido" onChange={onChange} defaultValue={['pago']}>
        <Chip value="pago">Pago</Chip>
        <Chip value="pendente">Pendente</Chip>
        <Chip value="cancelado">Cancelado</Chip>
      </ChipGroup>,
    )
    expect(screen.getByRole('group', { name: 'Status do pedido' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pago' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Pendente' }))
    expect(onChange).toHaveBeenLastCalledWith(['pago', 'pendente'])
    await user.click(screen.getByRole('button', { name: 'Pago' }))
    expect(onChange).toHaveBeenLastCalledWith(['pendente'])
  })

  it('type (depreciado) ainda define o modo e avisa no console', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onChange = vi.fn()
    render(
      <ChipGroup type="single" label="Período" onChange={onChange}>
        <Chip value="7d">7 dias</Chip>
        <Chip value="30d">30 dias</Chip>
      </ChipGroup>,
    )
    await user.click(screen.getByRole('button', { name: '7 dias' }))
    await user.click(screen.getByRole('button', { name: '30 dias' }))
    expect(onChange).toHaveBeenLastCalledWith('30d')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`type` está depreciado'))
    warn.mockRestore()
  })

  it('tipos: onChange recebe string | null no modo single e string[] por padrão', () => {
    expectTypeOf<ChipGroupSingleProps['onChange']>().toEqualTypeOf<
      ((value: string | null) => void) | undefined
    >()
    expectTypeOf<Extract<ChipGroupProps, { type: 'single' }>['onChange']>().toEqualTypeOf<
      ((value: string | null) => void) | undefined
    >()
    expectTypeOf<ChipGroupMultipleProps['onChange']>().toEqualTypeOf<
      ((value: string[]) => void) | undefined
    >()
  })

  it('seleção única: selecionar outro troca; clicar no selecionado desmarca', async () => {
    const user = userEvent.setup()
    function Period() {
      const [value, setValue] = useState<string | null>('7d')
      return (
        <>
          <ChipGroup
            selectionMode="single"
            label="Período"
            hideLabel
            value={value}
            onChange={setValue}
          >
            <Chip value="7d">7 dias</Chip>
            <Chip value="30d">30 dias</Chip>
          </ChipGroup>
          <output>{value ?? 'nenhum'}</output>
        </>
      )
    }
    render(<Period />)
    expect(screen.getByRole('group', { name: 'Período' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '30 dias' }))
    expect(screen.getByRole('button', { name: '30 dias' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '7 dias' })).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', { name: '30 dias' }))
    expect(screen.getByRole('status')).toHaveTextContent('nenhum')
  })

  it('repassa tamanho e disabled aos chips; Tab percorre os chips', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <ChipGroup label="Categorias" size="sm">
        <Chip value="a">Moda</Chip>
        <Chip value="b">Casa</Chip>
      </ChipGroup>,
    )
    expect(screen.getByRole('button', { name: 'Moda' })).toHaveClass('or-chip--sm')
    await user.tab()
    expect(screen.getByRole('button', { name: 'Moda' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Casa' })).toHaveFocus()
    rerender(
      <ChipGroup label="Categorias" disabled>
        <Chip value="a">Moda</Chip>
        <Chip value="b">Casa</Chip>
      </ChipGroup>,
    )
    expect(screen.getByRole('button', { name: 'Moda' })).toBeDisabled()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <ChipGroup label="Marcas" defaultValue={['orange']}>
          <Chip value="orange" count={42}>
            Orange
          </Chip>
          <Chip value="lemon" icon={<Icon name="star" />}>
            Lemon
          </Chip>
          <Chip value="lime" disabled>
            Lime
          </Chip>
        </ChipGroup>
        <Chip defaultSelected>Somente em estoque</Chip>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
