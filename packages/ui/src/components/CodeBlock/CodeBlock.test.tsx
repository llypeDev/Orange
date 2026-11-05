import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrangeProvider } from '../../providers'
import { expectNoA11yViolations } from '../../test/axe'
import { CodeBlock } from './CodeBlock'

const sample = `import { Button } from '@orangesys/ui'

export function Salvar() {
  return <Button>Salvar</Button>
}
`

describe('CodeBlock', () => {
  it('renderiza o código em uma área rolável focável com nome acessível', () => {
    render(<CodeBlock code={sample} title="Salvar.tsx" language="tsx" />)
    const region = screen.getByRole('group', { name: 'Código: Salvar.tsx' })
    expect(screen.getByRole('button', { name: 'Copiar' })).toHaveAccessibleDescription('Salvar.tsx')
    expect(region.tagName).toBe('PRE')
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveTextContent("import { Button } from '@orangesys/ui'")
    expect(screen.getByText('Salvar.tsx')).toBeInTheDocument()
    expect(screen.getByText('tsx')).toHaveClass('or-code-block__language')
  })

  it('remove quebras de linha finais e preserva linhas vazias', () => {
    const { container } = render(<CodeBlock code={sample} />)
    const lines = container.querySelectorAll('.or-code-block__line')
    expect(lines).toHaveLength(5)
    expect(lines[1].textContent).toBe('\n')
  })

  it('usa um rótulo genérico quando não há título nem linguagem', () => {
    render(<CodeBlock code="pnpm add @orangesys/ui" />)
    expect(screen.getByRole('group', { name: 'Bloco de código' })).toBeInTheDocument()
  })

  it('o ícone de copiar não anima na primeira renderização', () => {
    render(<CodeBlock code="x" />)
    const icon = document.querySelector('.or-code-block__copy-icon')!
    expect(icon).not.toHaveClass('or-code-block__copy-icon--return')
    expect(icon).not.toHaveClass('or-code-block__copy-icon--check')
  })

  it('copia o código com mouse e teclado e anuncia o resultado', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    const onCopy = vi.fn()
    render(<CodeBlock code={'pnpm add @orangesys/ui\n\n'} language="bash" onCopy={onCopy} />)
    const button = screen.getByRole('button', { name: 'Copiar' })
    expect(button).toHaveAccessibleDescription('bash')

    await user.click(button)
    expect(writeText).toHaveBeenCalledWith('pnpm add @orangesys/ui')
    expect(onCopy).toHaveBeenCalledWith('pnpm add @orangesys/ui')
    expect(screen.getByRole('status')).toHaveTextContent('Copiado!')
    expect(screen.getByRole('button', { name: 'Copiado!' })).toBeInTheDocument()
    // o check entra com animação ("pop")
    expect(button.querySelector('.or-code-block__copy-icon--check [data-icon="check"]')).not.toBeNull()

    button.focus()
    await user.keyboard('{Enter}')
    expect(writeText).toHaveBeenCalledTimes(2)
    writeText.mockRestore()
  })

  it('volta ao rótulo original depois do tempo de confirmação', async () => {
    // Relógio totalmente falso e clique síncrono: o teste não depende do tempo real.
    userEvent.setup() // instala a área de transferência simulada do user-event
    vi.useFakeTimers()
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(<CodeBlock code="npm test" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    await act(async () => {
      await Promise.resolve()
    })
    expect(screen.getByRole('button', { name: 'Copiado!' })).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(2100)
    })
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument()
    // na volta, o ícone de copiar reaparece com fade (só depois da primeira cópia)
    expect(document.querySelector('.or-code-block__copy-icon--return [data-icon="copy"]')).not.toBeNull()
    vi.useRealTimers()
  })

  it('mostra numeração (oculta de leitores de tela) a partir de startingLineNumber', () => {
    const { container } = render(
      <CodeBlock code={'a\nb\nc'} showLineNumbers startingLineNumber={10} highlightLines={[11]} />,
    )
    const numbers = container.querySelectorAll('.or-code-block__line-number')
    expect(numbers).toHaveLength(3)
    expect(numbers[0]).toHaveAttribute('aria-hidden', 'true')
    expect(numbers[0]).toHaveAttribute('data-line', '10')
    expect(numbers[2]).toHaveAttribute('data-line', '12')
    // a numeração não entra no texto copiado/lido
    expect(screen.getByRole('group').textContent).toBe('a\nb\nc\n')
  })

  it('destaca linhas com <mark>', () => {
    const { container } = render(<CodeBlock code={'const a = 1\nconst b = 2\nconst c = 3'} highlightLines={[2]} />)
    const marks = container.querySelectorAll('mark')
    expect(marks).toHaveLength(1)
    expect(marks[0]).toHaveTextContent('const b = 2')
    // a linha (elemento estável) recebe o destaque visual e pode transicionar
    expect(marks[0].closest('.or-code-block__line')).toHaveClass('or-code-block__line--highlighted')
    expect(container.querySelectorAll('.or-code-block__line--highlighted')).toHaveLength(1)
  })

  it('aplica wrap, maxHeight e permite ocultar o botão de copiar', () => {
    const { container } = render(<CodeBlock code="x" wrap maxHeight={200} copyable={false} />)
    expect(container.firstChild).toHaveClass('or-code-block--wrap')
    expect(screen.getByRole('group')).toHaveStyle({ maxHeight: '200px' })
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelector('.or-code-block__header')).toBeNull()
  })

  it('traduz os textos internos pelo locale do provider', () => {
    render(
      <OrangeProvider locale="en-US" themeTarget="scoped">
        <CodeBlock code="npm test" language="bash" />
      </OrangeProvider>,
    )
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Code: bash' })).toBeInTheDocument()
  })

  it('aceita codeLabel e repassa props ao elemento raiz', () => {
    render(<CodeBlock code="x" codeLabel="Exemplo de instalação" data-testid="raiz" />)
    expect(screen.getByRole('group', { name: 'Exemplo de instalação' })).toBeInTheDocument()
    expect(screen.getByTestId('raiz')).toHaveClass('or-code-block')
  })

  it('não possui violações de acessibilidade', async () => {
    const { container } = render(
      <div>
        <CodeBlock code={sample} title="Salvar.tsx" language="tsx" showLineNumbers highlightLines={[4]} />
        <CodeBlock code="pnpm add @orangesys/ui" language="bash" wrap />
      </div>,
    )
    await expectNoA11yViolations(container)
  })
})
