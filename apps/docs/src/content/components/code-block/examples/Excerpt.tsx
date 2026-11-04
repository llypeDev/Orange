import { CodeBlock } from '@orange/ui'

const excerpt = `  const { t } = useLocale()
  const [open, setOpen] = useState(false)

  return (
    <nav aria-label={t('menu')}>`

export default function Excerpt() {
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%' }}>
      <p style={{ margin: 0 }}>
        A linha 43 cria o estado do menu; a numeração continua a partir do arquivo original.
      </p>
      <CodeBlock
        title="src/components/Header.tsx"
        language="tsx"
        code={excerpt}
        showLineNumbers
        startingLineNumber={42}
        highlightLines={[43]}
      />
    </div>
  )
}
