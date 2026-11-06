import { Button, Disclosure, Select, Stack, Switch, TextField } from '@orangesys/ui'

const regioes = [
  { value: 'sa-east-1', label: 'São Paulo (sa-east-1)' },
  { value: 'us-east-1', label: 'Virgínia do Norte (us-east-1)' },
  { value: 'eu-west-1', label: 'Irlanda (eu-west-1)' },
]

export default function AdvancedOptions() {
  return (
    <form style={{ width: '100%', maxWidth: 420 }} onSubmit={(event) => event.preventDefault()}>
      <Stack gap={5}>
        <TextField label="Nome do projeto" defaultValue="Portal do cliente" />
        <Disclosure label="Opções avançadas">
          <Stack gap={4}>
            <Select label="Região do servidor" options={regioes} defaultValue="sa-east-1" />
            <Switch
              label="Backups diários"
              description="Mantidos por 30 dias. Desligue só em ambientes de teste."
              defaultChecked
            />
          </Stack>
        </Disclosure>
        <div>
          <Button type="submit">Criar projeto</Button>
        </div>
      </Stack>
    </form>
  )
}
