import { CheckboxGroup } from '@orange/ui'

export default function Group() {
  return (
    <CheckboxGroup
      label="Como prefere ser avisado?"
      description="Você pode mudar isso depois em Configurações."
      name="canais"
      defaultValue={['email']}
      options={[
        { value: 'email', label: 'E-mail' },
        { value: 'sms', label: 'SMS', description: 'Pode haver cobrança da sua operadora.' },
        { value: 'push', label: 'Notificação no aplicativo' },
        { value: 'whatsapp', label: 'WhatsApp', description: 'Em breve.', disabled: true },
      ]}
    />
  )
}
