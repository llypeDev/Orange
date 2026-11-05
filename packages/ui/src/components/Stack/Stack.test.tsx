import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { expectNoA11yViolations } from '../../test/axe'
import { Stack } from './Stack'

describe('Stack', () => {
  it('renderiza um <div> com as classes padrão e sem estilo inline', () => {
    render(
      <Stack data-testid="stack">
        <span>Nome</span>
        <span>E-mail</span>
      </Stack>,
    )
    const stack = screen.getByTestId('stack')
    expect(stack.tagName).toBe('DIV')
    expect(stack).toHaveClass('or-stack', 'or-stack--align-stretch', 'or-stack--justify-start')
    expect(stack).not.toHaveAttribute('style')
    expect(stack).not.toHaveAttribute('role')
  })

  it('com as="ul" mantém a semântica de lista (role="list" para o Safari)', () => {
    render(
      <Stack as="ul" aria-label="Integrações">
        <li>Slack</li>
        <li>GitHub</li>
        <li>Notion</li>
      </Stack>,
    )
    const list = screen.getByRole('list', { name: 'Integrações' })
    expect(list.tagName).toBe('UL')
    expect(list).toHaveAttribute('role', 'list')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('com as="nav" e as="section" vira um landmark nomeado', () => {
    render(
      <>
        <Stack as="nav" direction="horizontal" aria-label="Seções da conta">
          <a href="#perfil">Perfil</a>
          <a href="#seguranca">Segurança</a>
        </Stack>
        <Stack as="section" aria-labelledby="titulo-plano">
          <h2 id="titulo-plano">Plano</h2>
        </Stack>
      </>,
    )
    expect(screen.getByRole('navigation', { name: 'Seções da conta' }).tagName).toBe('NAV')
    expect(screen.getByRole('region', { name: 'Plano' }).tagName).toBe('SECTION')
  })

  it('valores simples viram só as variáveis base, sem classes de breakpoint', () => {
    render(<Stack data-testid="stack" direction="horizontal" gap={8} />)
    const stack = screen.getByTestId('stack')
    expect(stack.style.getPropertyValue('--_stack-dir')).toBe('row')
    expect(stack.style.getPropertyValue('--_stack-gap')).toBe('var(--or-space-8)')
    expect(stack.className).not.toMatch(/or-stack--(dir|gap)-/)
  })

  it('direção responsiva: variável e classe só nos breakpoints informados', () => {
    render(<Stack data-testid="stack" direction={{ base: 'vertical', md: 'horizontal' }} />)
    const stack = screen.getByTestId('stack')
    expect(stack.style.getPropertyValue('--_stack-dir')).toBe('column')
    expect(stack.style.getPropertyValue('--_stack-dir-md')).toBe('row')
    expect(stack).toHaveClass('or-stack--dir-md')
    expect(stack).not.toHaveClass('or-stack--dir-sm')
    expect(stack.style.getPropertyValue('--_stack-dir-sm')).toBe('')
  })

  it('gap responsivo sem base usa o padrão do CSS no celular', () => {
    render(<Stack data-testid="stack" gap={{ sm: 2, lg: 6, xl: 10 }} />)
    const stack = screen.getByTestId('stack')
    expect(stack.style.getPropertyValue('--_stack-gap')).toBe('')
    expect(stack.style.getPropertyValue('--_stack-gap-sm')).toBe('var(--or-space-2)')
    expect(stack.style.getPropertyValue('--_stack-gap-lg')).toBe('var(--or-space-6)')
    expect(stack.style.getPropertyValue('--_stack-gap-xl')).toBe('var(--or-space-10)')
    expect(stack).toHaveClass('or-stack--gap-sm', 'or-stack--gap-lg', 'or-stack--gap-xl')
  })

  it('aplica alinhamento, distribuição e quebra de linha', () => {
    render(
      <Stack data-testid="stack" direction="horizontal" align="center" justify="between" wrap />,
    )
    expect(screen.getByTestId('stack')).toHaveClass(
      'or-stack--align-center',
      'or-stack--justify-between',
      'or-stack--wrap',
    )
  })

  it('separator insere linhas decorativas só entre os filhos renderizados', () => {
    const { container } = render(
      <Stack separator data-testid="stack">
        <p>Notificações</p>
        {false}
        <p>Privacidade</p>
        {null}
        <p>Faturamento</p>
      </Stack>,
    )
    const stack = screen.getByTestId('stack')
    expect(stack).toHaveClass('or-stack--separated')
    const separators = container.querySelectorAll('.or-stack__separator')
    expect(separators).toHaveLength(2)
    separators.forEach((sep) => {
      expect(sep.tagName).toBe('SPAN')
      expect(sep).toHaveAttribute('aria-hidden', 'true')
    })
    // separadores ficam entre os filhos, nunca nas pontas
    expect(stack.firstElementChild).toHaveTextContent('Notificações')
    expect(stack.lastElementChild).toHaveTextContent('Faturamento')
  })

  it('em listas, o separador é um <li> oculto e a contagem de itens não muda', () => {
    const { container } = render(
      <Stack as="ol" separator aria-label="Etapas">
        <li>Dados da loja</li>
        <li>Pagamento</li>
        <li>Revisão</li>
      </Stack>,
    )
    expect(container.querySelectorAll('li.or-stack__separator')).toHaveLength(2)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('repassa ref, atributos e mescla o style do usuário', () => {
    const ref = createRef<HTMLElement>()
    render(<Stack ref={ref} as="section" id="resumo" gap={2} style={{ padding: 8 }} />)
    expect(ref.current?.tagName).toBe('SECTION')
    expect(ref.current).toHaveAttribute('id', 'resumo')
    expect(ref.current?.style.padding).toBe('8px')
    expect(ref.current?.style.getPropertyValue('--_stack-gap')).toBe('var(--or-space-2)')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <Stack as="ul" separator aria-label="Preferências">
          <li>E-mail semanal</li>
          <li>Alertas de estoque</li>
        </Stack>
        <Stack as="nav" direction={{ base: 'vertical', md: 'horizontal' }} aria-label="Conta">
          <a href="#perfil">Perfil</a>
          <a href="#plano">Plano</a>
        </Stack>
        <Stack as="dl" separator>
          <div>
            <dt>Plano</dt>
            <dd>Pro anual</dd>
          </div>
          <div>
            <dt>Renovação</dt>
            <dd>12 de março</dd>
          </div>
        </Stack>
        <Stack direction="horizontal" separator align="center">
          <span>Editar</span>
          <span>Duplicar</span>
        </Stack>
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
