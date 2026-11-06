import { TaskList, TaskListItem } from '@orangesys/ui'
import type { AnchorHTMLAttributes } from 'react'

// Em um app real: import { Link as RouterLink } from 'react-router-dom'
function RouterLink({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={`#${to}`} {...props} />
}

export default function RouterLinks() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <TaskList
        title="Emissão de notas fiscais"
        headingLevel={4}
        renderLink={({ href, ...props }) => <RouterLink to={href} {...props} />}
      >
        <TaskListItem
          href="/fiscal/certificado"
          status="complete"
          description="Certificado A1 enviado"
        >
          Certificado digital
        </TaskListItem>
        <TaskListItem
          href="/fiscal/tributacao"
          status="in-progress"
          description="Regime tributário e alíquotas"
        >
          Regras de tributação
        </TaskListItem>
        <TaskListItem status="cannot-start" statusLabel="Disponível após a tributação">
          Nota de teste em homologação
        </TaskListItem>
      </TaskList>
    </div>
  )
}
