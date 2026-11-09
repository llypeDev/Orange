import { Icon, Stack, TextField } from '@orangesys/ui'

export default function Adornments() {
  return (
    <Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
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
    </Stack>
  )
}
