import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { TagInput } from './TagInput'

function setup(props: Partial<React.ComponentProps<typeof TagInput>> = {}) {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const utils = render(<TagInput label="Palavras-chave" onChange={onChange} {...props} />)
  const input = screen.getByRole('textbox', { name: 'Palavras-chave' })
  return { user, onChange, input, ...utils }
}

const tagLabels = () =>
  within(screen.getByRole('list'))
    .getAllByRole('listitem')
    .map((li) => li.querySelector('.or-tag-input__tag-label')?.textContent)

describe('TagInput', () => {
  it('cria tags com Enter e vírgula', async () => {
    const { user, input, onChange } = setup()
    await user.type(input, 'design{Enter}acessibilidade,')
    expect(onChange).toHaveBeenLastCalledWith(['design', 'acessibilidade'])
    expect(tagLabels()).toEqual(['design', 'acessibilidade'])
    expect(input).toHaveValue('')
    expect(await screen.findByText('Adicionado: acessibilidade')).toBeInTheDocument()
  })

  it('Tab cria tag quando configurado e, com campo vazio, segue a navegação', async () => {
    const { user, input } = setup({ separators: ['Enter', 'Tab'] })
    await user.type(input, 'react')
    await user.tab()
    expect(tagLabels()).toEqual(['react'])
    expect(input).toHaveFocus()
    await user.tab()
    expect(input).not.toHaveFocus()
  })

  it('Backspace com o campo vazio remove a última tag', async () => {
    const { user, input, onChange } = setup({ defaultValue: ['ux', 'ui'] })
    await user.click(input)
    await user.keyboard('{Backspace}')
    expect(onChange).toHaveBeenLastCalledWith(['ux'])
    expect(input).toHaveFocus()
  })

  it('remove pelo botão acessível e move o foco para a próxima tag', async () => {
    const { user, input } = setup({ defaultValue: ['vendas', 'marketing', 'suporte'] })
    await user.click(screen.getByRole('button', { name: 'Remover marketing' }))
    expect(tagLabels()).toEqual(['vendas', 'suporte'])
    expect(screen.getByRole('button', { name: 'Remover suporte' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Remover suporte' }))
    expect(screen.getByRole('button', { name: 'Remover vendas' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Remover vendas' }))
    expect(input).toHaveFocus()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('recusa duplicadas com mensagem de erro', async () => {
    const { user, input, onChange } = setup({ defaultValue: ['Design'] })
    await user.type(input, 'design{Enter}')
    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('"design" já está na lista')
    expect(input).toHaveValue('design')
    await user.type(input, 's')
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('valida cada tag com validate', async () => {
    const { user, input, onChange } = setup({
      validate: (tag) => (/^\S+@\S+\.\S+$/.test(tag) ? true : 'Digite um e-mail válido'),
    })
    await user.type(input, 'ana{Enter}')
    expect(input).toHaveAccessibleDescription('Digite um e-mail válido')
    expect(screen.getByRole('status')).toHaveTextContent('Digite um e-mail válido')
    await user.clear(input)
    await user.type(input, 'ana@empresa.com{Enter}')
    expect(onChange).toHaveBeenLastCalledWith(['ana@empresa.com'])
  })

  it('respeita maxTags e mostra o contador', async () => {
    const { user, input, onChange } = setup({ maxTags: 2, defaultValue: ['a'] })
    expect(screen.getByText('1/2')).toBeInTheDocument()
    await user.type(input, 'b{Enter}c{Enter}')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByText('2/2')).toBeInTheDocument()
    expect(input).toHaveAccessibleDescription('Limite de 2 itens atingido')
  })

  it('colar texto separado por vírgula cria várias tags', async () => {
    const { user, input, onChange } = setup({ defaultValue: ['vue'] })
    await user.click(input)
    await user.paste('react, angular,  svelte, vue')
    expect(onChange).toHaveBeenLastCalledWith(['vue', 'react', 'angular', 'svelte'])
    // a duplicada fica no campo com o erro
    expect(input).toHaveValue('vue')
    expect(input).toHaveAccessibleDescription('"vue" já está na lista')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Adicionado: react, angular, svelte. "vue" já está na lista',
    )
  })

  it('addOnBlur adiciona o texto pendente ao sair', async () => {
    const { user, input, onChange } = setup({ addOnBlur: true })
    await user.type(input, 'pendente')
    await user.tab()
    expect(onChange).toHaveBeenLastCalledWith(['pendente'])
  })

  it('funciona controlado e envia com name', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [tags, setTags] = useState(['alpha'])
      return (
        <>
          <TagInput label="Tags" name="tags" value={tags} onChange={setTags} />
          <output>{tags.join('|')}</output>
        </>
      )
    }
    const { container } = render(<Controlled />)
    await user.type(screen.getByRole('textbox'), 'beta{Enter}')
    expect(container.querySelector('output')).toHaveTextContent('alpha|beta')
    expect(container.querySelectorAll('input[type="hidden"][name="tags"]')).toHaveLength(2)
  })

  it('desabilitado não mostra botões de remover', () => {
    render(<TagInput label="Tags" defaultValue={['x']} disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <TagInput
          label="Palavras-chave"
          description="Pressione Enter para adicionar"
          defaultValue={['design', 'ux']}
          maxTags={5}
        />
        <TagInput label="E-mails" error="Informe ao menos um e-mail" required />
        <TagInput label="Desabilitado" defaultValue={['fixo']} disabled />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
