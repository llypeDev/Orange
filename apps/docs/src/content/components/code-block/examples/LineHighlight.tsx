import { CodeBlock } from '@orange/ui'

const code = `import { OrangeProvider } from '@orange/ui'
import '@orange/ui/styles.css'

export function App({ children }) {
  return (
    <OrangeProvider defaultTheme="dark" locale="pt-BR">
      {children}
    </OrangeProvider>
  )
}`

export default function LineHighlight() {
  return (
    <CodeBlock
      title="src/App.tsx"
      language="tsx"
      code={code}
      showLineNumbers
      highlightLines={[1, 2, 6]}
      style={{ width: '100%' }}
    />
  )
}
