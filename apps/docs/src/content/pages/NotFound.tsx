import { buttonClassName } from '@orange/ui'
import { Link } from 'react-router-dom'
import { useLang } from '../../i18n'
import { DocPage } from '../../kit'

export default function NotFound() {
  const { t, to } = useLang()
  return (
    <DocPage
      eyebrow={{ pt: 'Erro 404', en: 'Error 404' }}
      title={{ pt: 'Página não encontrada.', en: 'Page not found.' }}
      lead={{
        pt: 'O endereço pode ter mudado ou a página ainda não existe.',
        en: 'The address may have changed or the page does not exist yet.',
      }}
      toc={false}
    >
      <p style={{ marginTop: 32 }}>
        <Link to={to('/')} className={buttonClassName({ variant: 'primary', size: 'md' })} style={{ textDecoration: 'none' }}>
          <span className="or-button__label">{t({ pt: 'Voltar para o início', en: 'Back to home' })}</span>
        </Link>
      </p>
    </DocPage>
  )
}
