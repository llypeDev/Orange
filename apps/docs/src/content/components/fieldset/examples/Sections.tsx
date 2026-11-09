import { Fieldset, RadioGroup, Stack, Switch, TextField } from '@orangesys/ui'

export default function Sections() {
  return (
    <Stack gap={10} style={{ width: '100%', maxWidth: 520 }}>
      <Fieldset legend="Dados da equipe" gap="sm">
        <TextField label="Nome da equipe" defaultValue="Design de produto" />
        <TextField label="Identificador" prefix="orange.app/" defaultValue="design" />
      </Fieldset>
      <Fieldset legend="Privacidade" gap="lg">
        <RadioGroup
          label="Quem pode ver os projetos?"
          defaultValue="equipe"
          options={[
            { value: 'equipe', label: 'Somente a equipe' },
            { value: 'org', label: 'Toda a organização' },
            { value: 'publico', label: 'Qualquer pessoa com o link' },
          ]}
        />
        <Switch label="Permitir convites de pessoas de fora" />
      </Fieldset>
    </Stack>
  )
}
