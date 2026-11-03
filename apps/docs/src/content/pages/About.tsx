import { DocPage, Prose } from '../../kit'

// TODO: conteúdo completo desta página.
export default function Page() {
  return (
    <DocPage eyebrow={{ pt: 'Orange', en: 'Orange' }} title={{ pt: 'Sobre', en: 'About' }}>
      <Prose>
        <p>…</p>
      </Prose>
    </DocPage>
  )
}
