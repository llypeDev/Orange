import { Icon, Listbox, ListboxOption } from '@orangesys/ui'

export default function Warehouses() {
  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <Listbox
        label="Armazém de origem"
        description="De onde sai a mercadoria deste pedido. As setas já selecionam."
        defaultValue="cajamar"
        selectionFollowsFocus
      >
        <ListboxOption
          value="cajamar"
          icon={<Icon name="layers" size="sm" />}
          description="Cajamar, SP · 1.240 unidades em estoque"
        >
          CD Cajamar
        </ListboxOption>
        <ListboxOption
          value="extrema"
          icon={<Icon name="layers" size="sm" />}
          description="Extrema, MG · 860 unidades em estoque"
        >
          CD Extrema
        </ListboxOption>
        <ListboxOption
          value="recife"
          icon={<Icon name="alert-triangle" size="sm" />}
          description="Em manutenção até 18/11 — indisponível para novos pedidos"
          disabled
        >
          CD Recife
        </ListboxOption>
        <ListboxOption
          value="canoas"
          icon={<Icon name="layers" size="sm" />}
          description="Canoas, RS · 312 unidades em estoque"
        >
          CD Canoas
        </ListboxOption>
      </Listbox>
    </div>
  )
}
