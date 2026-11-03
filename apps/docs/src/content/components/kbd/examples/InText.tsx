import { Kbd } from '@orange/ui'

export default function InText() {
  return (
    <p style={{ margin: 0, maxWidth: '60ch', lineHeight: 1.8 }}>
      Pressione <Kbd keys={['Ctrl', 'K']} /> para abrir a busca, <Kbd>/</Kbd> para filtrar a lista e <Kbd>Esc</Kbd>{' '}
      para fechar qualquer janela.
    </p>
  )
}
