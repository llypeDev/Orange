import { Icon, Tag } from '@orange/ui'

export default function WithIcons() {
  return (
    <>
      <Tag tone="info" icon={<Icon name="clock" />}>
        Agendado para 08/11
      </Tag>
      <Tag tone="success" icon={<Icon name="check-circle" />}>
        Verificado
      </Tag>
      <Tag icon={<Icon name="lock" />}>Privado</Tag>
      <Tag variant="solid" tone="accent" marker={false}>
        Sem marcador
      </Tag>
    </>
  )
}
