import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { MultiSelect, type MultiSelectOption } from './MultiSelect'

const skills: MultiSelectOption[] = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'a11y', label: 'Acessibilidade', description: 'WCAG e WAI-ARIA' },
  { value: 'design', label: 'Design de interfaces', disabled: true },
]

function setup(props: Partial<React.ComponentProps<typeof MultiSelect>> = {}) {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(
    <MultiSelect label="Habilidades" options={skills} onChange={onChange} {...props} />,
  )
  const input = screen.getByRole('combobox', { name: 'Habilidades' })
  return { user, onChange, input, ...utils }
}

describe('MultiSelect', () => {
  it('expõe combobox + listbox multiselecionável', async () => {
    const { user, input } = setup()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    input.focus()
    await user.keyboard('{ArrowDown}')
    const listbox = screen.getByRole('listbox', { name: 'Habilidades' })
    expect(listbox).toHaveAttribute('aria-multiselectable', 'true')
    expect(within(listbox).getAllByRole('option')).toHaveLength(5)
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      within(listbox).getAllByRole('option')[0].id,
    )
  })

  it('alterna opções com Enter mantendo a lista aberta', async () => {
    const { user, input, onChange } = setup()
    input.focus()
    await user.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(['react', 'ts'], [skills[0], skills[1]])
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('option', { name: 'React' })).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowUp}{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(['ts'], [skills[1]])
    const chips = screen.getByRole('list', { name: 'Itens selecionados' })
    expect(within(chips).getAllByRole('listitem')).toHaveLength(1)
    expect(await screen.findByText('Removido: React')).toBeInTheDocument()
  })

  it('busca ignorando acentos e limpa a busca após escolher', async () => {
    const { user, input, onChange } = setup()
    await user.type(input, 'acess')
    expect(screen.getAllByRole('option')).toHaveLength(1)
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(['a11y'], [skills[3]])
    expect(input).toHaveValue('')
    expect(screen.getAllByRole('option')).toHaveLength(5)
  })

  it('seleciona com o mouse e remove pelo botão do chip, movendo o foco', async () => {
    const { user, input } = setup({ defaultValue: ['react', 'ts', 'node'] })
    const remove = screen.getByRole('button', { name: 'Remover TypeScript' })
    await user.click(remove)
    expect(
      screen.queryByText('TypeScript', { selector: '.or-multi-select__chip-label' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remover Node.js' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Mostrar opções' }))
    expect(input).toHaveFocus()
    await user.click(screen.getByRole('option', { name: /Acessibilidade/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    await user.click(screen.getByRole('option', { name: /Design de interfaces/ }))
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('Backspace com o campo vazio remove o último item', async () => {
    const { user, input, onChange } = setup({ defaultValue: ['react', 'node'] })
    await user.click(input)
    await user.keyboard('{Backspace}')
    expect(onChange).toHaveBeenLastCalledWith(['react'], [skills[0]])
    expect(input).toHaveFocus()
    await user.type(input, 'ab{Backspace}')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('"Limpar tudo" remove todos e foca o campo', async () => {
    const { user, input, onChange } = setup({ defaultValue: ['react', 'ts'] })
    await user.click(screen.getByRole('button', { name: 'Limpar tudo' }))
    expect(onChange).toHaveBeenLastCalledWith([], [])
    expect(input).toHaveFocus()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('respeita maxSelected', async () => {
    const { user, input, onChange } = setup({ maxSelected: 2, defaultValue: ['react', 'ts'] })
    input.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Limite de 2 itens atingido')).toBeInTheDocument()
    const node = screen.getByRole('option', { name: 'Node.js' })
    expect(node).toHaveAttribute('aria-disabled', 'true')
    await user.click(node)
    expect(onChange).not.toHaveBeenCalled()
    // opções selecionadas continuam podendo ser desmarcadas
    await user.click(screen.getByRole('option', { name: 'React' }))
    expect(onChange).toHaveBeenLastCalledWith(['ts'], [skills[1]])
  })

  it('Escape fecha a lista e depois limpa a busca', async () => {
    const { user, input } = setup()
    await user.type(input, 'no')
    await user.keyboard('{Escape}')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(input).toHaveValue('no')
    await user.keyboard('{Escape}')
    expect(input).toHaveValue('')
  })

  it('funciona controlado e envia valores com name', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [value, setValue] = useState<string[]>(['node'])
      return (
        <form aria-label="Perfil">
          <MultiSelect
            label="Habilidades"
            name="skills"
            options={skills}
            value={value}
            onChange={setValue}
          />
          <output>{value.join(',')}</output>
        </form>
      )
    }
    const { container } = render(<Controlled />)
    const input = screen.getByRole('combobox')
    input.focus()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(container.querySelector('output')).toHaveTextContent('node,react')
    expect(container.querySelectorAll('input[type="hidden"][name="skills"]')).toHaveLength(2)
  })

  it('desabilitado não abre e não mostra botões de remoção', async () => {
    const user = userEvent.setup()
    render(<MultiSelect label="Habilidades" options={skills} defaultValue={['react']} disabled />)
    const input = screen.getByRole('combobox')
    expect(input).toBeDisabled()
    await user.click(input)
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('button', { name: /Remover/ })).not.toBeInTheDocument()
  })

  it('movimento: só chips adicionados depois da montagem animam a entrada', async () => {
    const { user, input } = setup({ defaultValue: ['react'] })
    const initial = screen.getByText('React', { selector: '.or-multi-select__chip-label' }).closest('li')
    expect(initial).not.toHaveAttribute('data-enter')
    input.focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}')
    const added = screen.getByText('TypeScript', { selector: '.or-multi-select__chip-label' }).closest('li')
    expect(added).toHaveAttribute('data-enter')
    // o check da opção marcada com a lista aberta ganha o "pop"
    expect(screen.getByRole('option', { name: 'TypeScript' })).toHaveAttribute('data-pop')
    expect(screen.getByRole('option', { name: 'React' })).not.toHaveAttribute('data-pop')
  })

  it('não possui violações de acessibilidade (fechado e aberto)', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <div>
        <MultiSelect
          label="Habilidades"
          description="Escolha até 3"
          options={skills}
          defaultValue={['react', 'a11y']}
          maxSelected={3}
        />
        <MultiSelect label="Idiomas" options={skills} error="Escolha ao menos um" required />
      </div>,
    )
    await expectNoA11yViolations(container)
    await user.click(screen.getAllByRole('button', { name: 'Mostrar opções' })[0])
    await act(async () => {})
    await expectNoA11yViolations(document.body)
  })
})
