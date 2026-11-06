import { ConsentBanner } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

const categories = [
  {
    id: 'necessarios',
    label: 'Necessários',
    description: 'Sessão, segurança e carrinho.',
    required: true,
  },
  {
    id: 'desempenho',
    label: 'Desempenho e analytics',
    description: 'Visitas e tempo de carregamento, em dados agregados.',
  },
  {
    id: 'publicidade',
    label: 'Publicidade',
    description: 'Ofertas de café de acordo com os seus interesses, em sites parceiros.',
  },
]

export default function CustomText() {
  return (
    <ConsentBanner
      placement="inline"
      title="Sua privacidade na Torrefação Aurora"
      categories={categories}
      policyHref="/privacidade/cookies"
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
    >
      <p>
        Usamos cookies para manter o seu carrinho e, se você permitir, para entender como o site é
        usado e mostrar ofertas do seu interesse. Recusar não muda preços, frete nem o acesso à
        loja.
      </p>
    </ConsentBanner>
  )
}
