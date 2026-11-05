import { Splitter, SplitterHandle, SplitterPanel, TextArea } from '@orangesys/ui'
import { useState } from 'react'

const initialText =
  'Café especial de torra média, com notas de chocolate e caramelo. Grãos 100% arábica do sul de Minas, torrados na semana do envio.'

export default function EditorPreview() {
  const [text, setText] = useState(initialText)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const logs = [
    '09:41:02  rascunho carregado (versão 3)',
    `09:41:05  ${text.length} caracteres · ${words} palavras`,
    text.length > 160
      ? '09:41:05  aviso: acima de 160 caracteres, o resumo da vitrine será cortado'
      : '09:41:05  ok: o resumo cabe no card da vitrine',
    '09:41:06  prévia atualizada',
  ]

  return (
    <div style={{ height: 460, border: '1px solid var(--or-color-border)' }}>
      {/* Divisão vertical: editor e prévia em cima, console recolhível embaixo. */}
      <Splitter orientation="vertical" label="Edição da descrição" defaultSizes={[68, 32]}>
        <SplitterPanel label="Editor e prévia" minSize={40}>
          <Splitter label="Editor e prévia" defaultSizes={[50, 50]} stackBelow="sm">
            <SplitterPanel label="Descrição do produto" minSize={30}>
              <div style={{ padding: 16 }}>
                <TextArea
                  label="Descrição do produto"
                  description="Aparece na página do produto e no card da vitrine."
                  rows={6}
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
            </SplitterPanel>
            <SplitterHandle />
            <SplitterPanel label="Prévia" minSize={30}>
              <article style={{ display: 'grid', gap: 8, padding: 16 }}>
                <p className="or-eyebrow" style={{ margin: 0 }}>
                  Prévia
                </p>
                <h4 style={{ margin: 0 }}>Café especial torra média — 250 g</h4>
                <p style={{ margin: 0, color: 'var(--or-color-text-muted)', overflowWrap: 'anywhere' }}>
                  {text || 'Sem descrição.'}
                </p>
                <strong>R$ 42,90</strong>
              </article>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
        <SplitterHandle />
        <SplitterPanel
          label="Console de logs"
          collapsible
          minSize={18}
          style={{ display: 'flex', flexDirection: 'column', background: 'var(--or-color-bg-subtle)' }}
        >
          <p className="or-eyebrow" style={{ margin: 0, padding: '8px 16px 0' }}>
            Console de logs
          </p>
          {/* Região rolável focável: quem usa teclado também consegue rolar os logs. */}
          <pre
            tabIndex={0}
            style={{
              flex: '1 1 auto',
              minHeight: 0,
              margin: 0,
              padding: '8px 16px 12px',
              overflow: 'auto',
              fontFamily: 'var(--or-font-mono)',
              fontSize: 'var(--or-text-xs)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {logs.join('\n')}
          </pre>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
