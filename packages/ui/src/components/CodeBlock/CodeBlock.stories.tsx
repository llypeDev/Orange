import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeBlock } from './CodeBlock'

const component = `import { Button, OrangeProvider } from '@orangesys/ui'
import '@orangesys/ui/styles.css'

export function App() {
  return (
    <OrangeProvider defaultTheme="dark" locale="pt-BR">
      <Button>Criar conta</Button>
    </OrangeProvider>
  )
}`

const meta = {
  title: 'Componentes/CodeBlock',
  component: CodeBlock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Exibe trechos de código em fonte monoespaçada sobre fundo escuro, com botão de copiar, numeração e destaque de linhas. Não faz realce de sintaxe.',
      },
    },
  },
  argTypes: {
    language: { control: 'text' },
    title: { control: 'text' },
    showLineNumbers: { control: 'boolean' },
    wrap: { control: 'boolean' },
    copyable: { control: 'boolean' },
    maxHeight: { control: 'number' },
    onCopy: { action: 'copy' },
  },
  args: {
    code: component,
    language: 'tsx',
    title: 'src/App.tsx',
    showLineNumbers: false,
    wrap: false,
    copyable: true,
  },
} satisfies Meta<typeof CodeBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LineNumbers: Story = {
  args: { showLineNumbers: true, highlightLines: [6, 7, 8] },
}

export const Snippet: Story = {
  args: {
    title: 'src/components/Header.tsx',
    code: `  const { t } = useLocale()\n  const [open, setOpen] = useState(false)\n  return <nav aria-label={t('menu')}>{children}</nav>`,
    showLineNumbers: true,
    startingLineNumber: 42,
    highlightLines: [43],
  },
}

export const Terminal: Story = {
  args: { title: undefined, language: 'bash', code: 'pnpm add @orangesys/ui @orangesys/tokens' },
}

export const Wrap: Story = {
  args: {
    language: 'json',
    title: 'package.json',
    wrap: true,
    code: `{\n  "description": "Sistema de design do Orange com componentes React acessíveis, tokens de design e documentação bilíngue para equipes de produto.",\n  "license": "MIT"\n}`,
  },
}

export const MaxHeight: Story = {
  args: {
    maxHeight: 180,
    showLineNumbers: true,
  },
}

/** Clique em "Copiar": o ícone troca para um check com "pop". Mude highlightLines nos controles para ver a transição. */
export const CopyAndHighlight: Story = {
  args: { showLineNumbers: true, highlightLines: [2] },
}
