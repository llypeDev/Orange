import { Icon, TextField } from '@orange/ui'

export default function Adornments() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TextField
        label="Buscar pedidos"
        type="search"
        startIcon={<Icon name="search" />}
        placeholder="Número do pedido ou nome do cliente"
      />
      <TextField label="Site da empresa" type="url" prefix="https://" placeholder="laranja.com.br" />
      <TextField label="Subdomínio" prefix="https://" suffix=".orange.app" defaultValue="minha-loja" />
      <TextField label="Peso do pacote" inputMode="decimal" suffix="kg" style={{ maxWidth: 200 }} />
      <TextField label="E-mail para contato" type="email" endIcon={<Icon name="mail" />} placeholder="contato@empresa.com" />
    </div>
  )
}
