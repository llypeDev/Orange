import { Combobox, type ComboboxOption } from '@orange/ui'
import { useEffect, useState } from 'react'

const clientes: ComboboxOption[] = [
  { value: 'c-101', label: 'Ana Beatriz Souza', description: 'ana.souza@lumen.com.br' },
  { value: 'c-102', label: 'Bruno Carvalho', description: 'bruno@padariadobairro.com' },
  { value: 'c-103', label: 'Carla Menezes', description: 'carla.menezes@vertice.io' },
  { value: 'c-104', label: 'Diego Ramos', description: 'diego@ramosarquitetura.com' },
  { value: 'c-105', label: 'Elaine Toledo', description: 'elaine.toledo@clinicavida.med.br' },
  { value: 'c-106', label: 'Fábio Nogueira', description: 'fabio@nogueiraeassociados.adv.br' },
]

const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Simula uma chamada à API com 700 ms de latência. */
function buscarClientes(termo: string): Promise<ComboboxOption[]> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          clientes.filter((c) =>
            normalizar(`${c.label} ${c.description}`).includes(normalizar(termo)),
          ),
        ),
      700,
    ),
  )
}

export default function Async() {
  const [termo, setTermo] = useState('')
  const [opcoes, setOpcoes] = useState<ComboboxOption[]>([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (termo.trim().length < 2) {
      setOpcoes([])
      return
    }
    let ativo = true
    setCarregando(true)
    buscarClientes(termo).then((resultado) => {
      if (!ativo) return
      setOpcoes(resultado)
      setCarregando(false)
    })
    return () => {
      ativo = false
    }
  }, [termo])

  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Combobox
        label="Cliente"
        placeholder="Nome ou e-mail"
        options={opcoes}
        filter={false}
        loading={carregando}
        onInputChange={setTermo}
        emptyMessage={termo.trim().length < 2 ? 'Digite ao menos 2 letras' : undefined}
      />
    </div>
  )
}
