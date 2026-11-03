import { BottomNavigation, Icon } from '@orange/ui'

export default function Badges() {
  return (
    <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--or-color-border-strong)' }}>
      <BottomNavigation
        aria-label="Navegação do banco"
        defaultValue="extrato"
        items={[
          { value: 'extrato', label: 'Extrato', icon: <Icon name="chart-bar" /> },
          { value: 'pix', label: 'Pix', icon: <Icon name="zap" /> },
          { value: 'mensagens', label: 'Mensagens', icon: <Icon name="mail" />, badge: 12, badgeLabel: '12 não lidas' },
          { value: 'perfil', label: 'Perfil', icon: <Icon name="user" />, badge: true, badgeLabel: 'atualização pendente' },
        ]}
      />
    </div>
  )
}
