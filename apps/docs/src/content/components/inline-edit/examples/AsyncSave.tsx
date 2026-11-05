import { InlineEdit } from '@orangesys/ui'
import { useState } from 'react'

const nomesEmUso = ['financeiro', 'marketing']

// Simula uma chamada à API que leva 1 segundo.
const salvarNaApi = (nome: string) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => {
      if (nomesEmUso.includes(nome.trim().toLowerCase()))
        reject(new Error(`Já existe um time chamado "${nome}".`))
      else resolve()
    }, 1000),
  )

export default function AsyncSave() {
  const [nome, setNome] = useState('Plataforma')

  return (
    <InlineEdit
      label="Nome do time"
      showLabel
      value={nome}
      onSave={async (novo) => {
        await salvarNaApi(novo)
        setNome(novo)
      }}
      validate={(valor) => (valor.trim() ? null : 'O nome não pode ficar vazio.')}
    />
  )
}
