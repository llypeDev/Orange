import { Listbox, ListboxOption } from '@orange/ui'

export default function Horizontal() {
  return (
    <Listbox
      label="Tamanho"
      description="GG esgotado. Use ← e → para navegar."
      orientation="horizontal"
      defaultValue="m"
      name="tamanho"
    >
      <ListboxOption value="p">P</ListboxOption>
      <ListboxOption value="m">M</ListboxOption>
      <ListboxOption value="g">G</ListboxOption>
      <ListboxOption value="gg" disabled>
        GG
      </ListboxOption>
    </Listbox>
  )
}
