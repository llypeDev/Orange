import { Checkbox, CheckboxGroup } from '@orange/ui'

export default function Horizontal() {
  return (
    <CheckboxGroup label="Dias de entrega" orientation="horizontal" defaultValue={['seg', 'qua', 'sex']}>
      <Checkbox value="seg" label="Seg" />
      <Checkbox value="ter" label="Ter" />
      <Checkbox value="qua" label="Qua" />
      <Checkbox value="qui" label="Qui" />
      <Checkbox value="sex" label="Sex" />
      <Checkbox value="sab" label="Sáb" />
    </CheckboxGroup>
  )
}
