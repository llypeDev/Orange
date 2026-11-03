import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { Combobox, type ComboboxOption } from './Combobox'

const cities: ComboboxOption[] = [
  { value: 'sp', label: 'São Paulo', description: 'SP' },
  { value: 'rj', label: 'Rio de Janeiro', description: 'RJ' },
  { value: 'bh', label: 'Belo Horizonte', description: 'MG' },
  { value: 'bsb', label: 'Brasília', description: 'DF', disabled: true },
  { value: 'sal', label: 'Salvador', description: 'BA' },
]

function setup(props: Partial<React.ComponentProps<typeof Combobox>> = {}) {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(<Combobox label="Cidade" options={cities} onChange={onChange} {...props} />)
  const input = screen.getByRole('combobox', { name: 'Cidade' })
  return { user, onChange, input, ...utils }
}

describe('Combobox', () => {
  it('expõe o padrão combobox do WAI-ARIA', () => {
    const { input } = setup()
    expect(input).toHaveAttribute('aria-autocomplete', 'list')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).not.toHaveAttribute('aria-controls')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('filtra ignorando acentos, destaca a primeira opção e seleciona com Enter', async () => {
    const { user, input, onChange } = setup()
    await user.type(input, 'sao')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    const listbox = screen.getByRole('listbox', { name: 'Cidade' })
    expect(input).toHaveAttribute('aria-controls', listbox.id)
    const options = within(listbox).getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id)
    expect(options[0].querySelector('mark')).toHaveTextContent('São')
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith('sp', cities[0])
    expect(input).toHaveValue('São Paulo')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('navega com setas, Home e End pulando opções desabilitadas', async () => {
    const { user, input } = setup()
    input.focus()
    await user.keyboard('{ArrowDown}')
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(5)
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id)
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')
    // Brasília (índice 3) está desabilitada e é pulada
    expect(input).toHaveAttribute('aria-activedescendant', options[4].id)
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id)
    await user.keyboard('{End}')
    expect(input).toHaveAttribute('aria-activedescendant', options[4].id)
    await user.keyboard('{Home}')
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id)
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveAttribute('aria-activedescendant', options[4].id)
    expect(options[3]).toHaveAttribute('aria-disabled', 'true')
  })

  it('ArrowUp abre na última opção e Alt+ArrowDown abre sem mover o foco visual', async () => {
    const { user, input } = setup()
    input.focus()
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(input).not.toHaveAttribute('aria-activedescendant')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard('{ArrowUp}')
    const options = screen.getAllByRole('option')
    expect(input).toHaveAttribute('aria-activedescendant', options[4].id)
  })

  it('Escape fecha a lista e, com ela fechada, limpa o valor', async () => {
    const { user, input, onChange } = setup({ defaultValue: 'rj' })
    expect(input).toHaveValue('Rio de Janeiro')
    input.focus()
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveValue('Rio de Janeiro')
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('')
    expect(onChange).toHaveBeenCalledWith(null, null)
  })

  it('abre pelo botão e seleciona com o mouse', async () => {
    const { user, input, onChange } = setup()
    await user.click(screen.getByRole('button', { name: 'Mostrar opções' }))
    expect(input).toHaveFocus()
    await user.click(screen.getByRole('option', { name: /Belo Horizonte/ }))
    expect(onChange).toHaveBeenCalledWith('bh', cities[2])
    expect(input).toHaveValue('Belo Horizonte')
    expect(input).toHaveFocus()
  })

  it('não seleciona opção desabilitada pelo mouse', async () => {
    const { user, onChange } = setup()
    await user.click(screen.getByRole('button', { name: 'Mostrar opções' }))
    await user.click(screen.getByRole('option', { name: /Brasília/ }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('marca a opção escolhida com aria-selected ao reabrir', async () => {
    const { user, input } = setup({ defaultValue: 'sal' })
    input.focus()
    await user.keyboard('{ArrowDown}')
    const selected = screen.getByRole('option', { name: /Salvador/ })
    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveAttribute('aria-activedescendant', selected.id)
    expect(screen.getByRole('option', { name: /Rio/ })).toHaveAttribute('aria-selected', 'false')
  })

  it('limpa pelo botão e devolve o foco ao campo', async () => {
    const { user, input, onChange } = setup({ defaultValue: 'sp' })
    await user.click(screen.getByRole('button', { name: 'Limpar' }))
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
    expect(onChange).toHaveBeenCalledWith(null, null)
  })

  it('mostra "nenhum resultado" e anuncia a contagem', async () => {
    const { user, input } = setup()
    await user.type(input, 'xyz')
    expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument()
    expect(await screen.findByText('Nenhum resultado encontrado', { selector: '[role="status"]' })).toBeInTheDocument()
    await user.clear(input)
    await user.type(input, 'ri')
    expect(await screen.findByText('2 resultados disponíveis')).toBeInTheDocument()
    await user.type(input, 'o')
    expect(await screen.findByText('1 resultado disponível')).toBeInTheDocument()
  })

  it('ao sair do campo reverte texto inválido e aceita texto idêntico a uma opção', async () => {
    const { user, input, onChange } = setup({ defaultValue: 'sp' })
    await user.clear(input)
    await user.type(input, 'abc')
    await user.tab()
    expect(input).toHaveValue('São Paulo')
    await user.click(input)
    await user.clear(input)
    await user.type(input, 'salvador')
    await user.tab()
    expect(input).toHaveValue('Salvador')
    expect(onChange).toHaveBeenLastCalledWith('sal', cities[4])
  })

  it('apagar todo o texto e sair do campo limpa o valor', async () => {
    const { user, input, onChange } = setup({ defaultValue: 'rj' })
    await user.clear(input)
    expect(onChange).not.toHaveBeenCalled()
    await user.tab()
    expect(onChange).toHaveBeenCalledWith(null, null)
    expect(input).toHaveValue('')
  })

  it('funciona controlado e avisa a digitação com onInputChange', async () => {
    const user = userEvent.setup()
    const onInputChange = vi.fn()
    function Controlled() {
      const [value, setValue] = useState<string | null>('bh')
      return (
        <>
          <Combobox label="Cidade" options={cities} value={value} onChange={setValue} onInputChange={onInputChange} />
          <button type="button" onClick={() => setValue('rj')}>
            Definir Rio
          </button>
          <output>{value ?? 'vazio'}</output>
        </>
      )
    }
    render(<Controlled />)
    const input = screen.getByRole('combobox')
    expect(input).toHaveValue('Belo Horizonte')
    await user.click(screen.getByRole('button', { name: 'Definir Rio' }))
    expect(input).toHaveValue('Rio de Janeiro')
    await user.clear(input)
    await user.type(input, 'sal{Enter}')
    expect(onInputChange).toHaveBeenLastCalledWith('sal')
    expect(screen.getByText('sal', { selector: 'output' })).toBeInTheDocument()
  })

  it('mostra carregamento com aria-busy e aceita opções filtradas fora (filter={false})', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<Combobox label="Cidade" options={[]} loading filter={false} />)
    const input = screen.getByRole('combobox')
    await user.type(input, 'be')
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByText('Carregando…').length).toBeGreaterThan(0)
    rerender(<Combobox label="Cidade" options={[cities[2]]} filter={false} />)
    expect(screen.getByRole('option', { name: /Belo Horizonte/ })).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option').id)
  })

  it('envia o valor em um input oculto com name', async () => {
    const { container } = render(<Combobox label="Cidade" options={cities} defaultValue="rj" name="cidade" />)
    expect(container.querySelector('input[type="hidden"][name="cidade"]')).toHaveValue('rj')
  })

  it('respeita disabled', async () => {
    const user = userEvent.setup()
    render(<Combobox label="Cidade" options={cities} disabled defaultValue="sp" />)
    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
    await user.click(input)
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: 'Limpar' })).not.toBeInTheDocument()
  })

  it('usa as mensagens do idioma do provider', async () => {
    const user = userEvent.setup()
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <Combobox label="City" options={cities} />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Show options' })).toBeInTheDocument()
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('não possui violações de acessibilidade (fechado e aberto)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <Combobox label="Cidade" description="Comece a digitar" options={cities} defaultValue="sp" />
        <Combobox label="Estado" options={cities} error="Campo obrigatório" required />
        <Combobox aria-label="Busca de cidade" options={cities} disabled />
      </div>,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getAllByRole('button', { name: 'Mostrar opções' })[0])
    await user.keyboard('{ArrowDown}')
    await act(async () => {})
    await expectNoA11yViolations(document.body)
  })
})
