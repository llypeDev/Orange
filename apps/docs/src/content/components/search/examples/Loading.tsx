import { Search } from '@orangesys/ui'
import { useState } from 'react'

export default function Loading() {
  const [buscando, setBuscando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  const buscar = (termo: string) => {
    if (!termo.trim()) return
    setBuscando(true)
    setMensagem('')
    setTimeout(() => {
      setBuscando(false)
      setMensagem(`3 clientes encontrados para “${termo}”.`)
    }, 1200)
  }

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <Search
        label="Buscar clientes"
        placeholder="Nome, e-mail ou CNPJ"
        loading={buscando}
        onSearch={buscar}
        onClear={() => setMensagem('')}
      />
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-subtle)' }}>
        {buscando ? 'Buscando…' : mensagem}
      </p>
    </div>
  )
}
