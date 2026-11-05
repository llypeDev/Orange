import { Footer } from '@orange/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real:
// import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function WithRouter() {
  return (
    <Footer
      // Links internos usam o roteador; os externos continuam <a> com nova aba.
      renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      navLabel="Links do painel"
      columns={[
        {
          title: 'Conta',
          links: [
            { label: 'Plano e faturas', href: '/configuracoes/faturamento' },
            { label: 'Equipe e permissões', href: '/configuracoes/equipe' },
            { label: 'Notificações', href: '/configuracoes/notificacoes' },
          ],
        },
        {
          title: 'Ajuda',
          links: [
            { label: 'Primeiros passos', href: '/ajuda/primeiros-passos' },
            { label: 'Status do serviço', href: 'https://status.example.com', external: true },
          ],
        },
      ]}
      bottom={
        <>
          <span>Aurora Commerce · versão 4.12</span>
          <span>Dados atualizados há 2 minutos</span>
        </>
      }
    />
  )
}
