import { Button, Icon, Popover } from '@orangesys/ui'

export default function Help() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span>Plano Pro</span>
      <Popover
        aria-label="Sobre o plano Pro"
        placement="right"
        arrow
        trigger={
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label="Sobre o plano Pro"
            startIcon={<Icon name="help-circle" />}
          />
        }
      >
        <p style={{ margin: '0 0 8px' }}>
          Inclui 10 projetos, domínio próprio e suporte prioritário.
        </p>
        <a href="#comparar-planos">Comparar planos</a>
      </Popover>
    </div>
  )
}
