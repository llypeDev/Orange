import { BackToTop } from '@orange/ui'

export default function Page() {
  // Fixo no canto inferior direito da janela. Ao clicar, o foco vai para o <main>.
  return (
    <>
      <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>
        Role esta página: depois de 600px, o botão aparece no canto inferior direito.
      </p>
      <BackToTop threshold={600} />
    </>
  )
}
