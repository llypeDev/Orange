import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Select } from './Select'

const states = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais', disabled: true },
]

describe('Select', () => {
  it('renderiza um <select> nativo ligado ao rótulo e à descrição', () => {
    render(<Select label="Estado" description="Onde fica a sua empresa" options={states} />)
    const select = screen.getByRole('combobox', { name: 'Estado' })
    expect(select.tagName).toBe('SELECT')
    expect(select).toHaveClass('or-control', 'or-control--md', 'or-select__control')
    expect(select).toHaveAccessibleDescription('Onde fica a sua empresa')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Minas Gerais' })).toBeDisabled()
  })

  it('mostra o placeholder como opção vazia selecionada', () => {
    render(<Select label="Estado" placeholder="Selecione um estado" options={states} />)
    const select = screen.getByRole<HTMLSelectElement>('combobox')
    expect(select.value).toBe('')
    expect(select).toHaveAttribute('data-placeholder-shown')
    expect(screen.getByRole('option', { name: 'Selecione um estado' })).not.toBeDisabled()
  })

  it('desabilita o placeholder quando o campo é obrigatório', () => {
    render(<Select label="Estado" placeholder="Selecione" required options={states} />)
    expect(screen.getByRole('combobox')).toBeRequired()
    expect(screen.getByRole('option', { name: 'Selecione' })).toBeDisabled()
  })

  it('funciona sem controle e dispara onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Estado" placeholder="Selecione" options={states} onChange={onChange} />)
    const select = screen.getByRole<HTMLSelectElement>('combobox')
    await user.selectOptions(select, 'rj')
    expect(select.value).toBe('rj')
    expect(select).not.toHaveAttribute('data-placeholder-shown')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('funciona controlado', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState('sp')
      return (
        <>
          <Select
            label="Estado"
            options={states}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <output>{value}</output>
        </>
      )
    }
    render(<Controlled />)
    await user.selectOptions(screen.getByRole('combobox'), 'Rio de Janeiro')
    expect(screen.getByRole('status')).toHaveTextContent('rj')
  })

  it('aceita grupos de opções e children nativos', () => {
    render(
      <>
        <Select
          label="Plano"
          options={[
            { label: 'Mensal', options: [{ value: 'm-basic', label: 'Básico mensal' }] },
            { label: 'Anual', options: [{ value: 'a-basic', label: 'Básico anual' }] },
          ]}
        />
        <Select label="Moeda">
          <option value="brl">Real</option>
          <option value="usd">Dólar</option>
        </Select>
      </>,
    )
    expect(screen.getAllByRole('group')).toHaveLength(2)
    expect(screen.getByRole('combobox', { name: 'Moeda' })).toHaveValue('brl')
  })

  it('expõe erro, invalidez e desabilitado', () => {
    render(
      <>
        <Select label="Cidade" options={states} error="Escolha uma cidade" />
        <Select label="País" options={states} disabled />
      </>,
    )
    const city = screen.getByRole('combobox', { name: 'Cidade' })
    expect(city).toHaveAttribute('aria-invalid', 'true')
    expect(city).toHaveAccessibleDescription('Escolha uma cidade')
    expect(screen.getByRole('combobox', { name: 'País' })).toBeDisabled()
  })

  it('aplica tamanho e encaminha a ref para o <select>', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} label="Estado" size="lg" options={states} />)
    expect(ref.current).toBe(screen.getByRole('combobox'))
    expect(ref.current).toHaveClass('or-control--lg')
  })

  it('é operável por teclado', async () => {
    const user = userEvent.setup()
    render(<Select label="Estado" options={states} />)
    await user.tab()
    expect(screen.getByRole('combobox')).toHaveFocus()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Select
          label="Estado"
          description="Usado no endereço"
          placeholder="Selecione"
          options={states}
        />
        <Select label="Cidade" error="Obrigatório" required options={states} />
        <Select label="Oculto" hideLabel options={states} disabled />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
