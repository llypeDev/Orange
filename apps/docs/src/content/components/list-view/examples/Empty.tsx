import { Button, EmptyState, Icon, ListView, ListViewItem, Search } from '@orangesys/ui'
import { useState } from 'react'

const arquivos = [
  { id: 'briefing', nome: 'Briefing da campanha.pdf', detalhe: 'Atualizado hoje · 2,4 MB' },
  { id: 'cronograma', nome: 'Cronograma de entregas.xlsx', detalhe: 'Atualizado ontem · 380 KB' },
  { id: 'roteiro', nome: 'Roteiro do vídeo.docx', detalhe: 'Atualizado há 3 dias · 96 KB' },
  { id: 'logotipo', nome: 'Logotipo vetorizado.svg', detalhe: 'Atualizado há 1 semana · 48 KB' },
]

const normalizar = (texto: string) => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export default function Empty() {
  const [busca, setBusca] = useState('contrato')
  const visiveis = arquivos.filter((arquivo) =>
    normalizar(arquivo.nome).includes(normalizar(busca.trim())),
  )

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 560 }}>
      <Search
        label="Buscar arquivos do projeto"
        placeholder="Buscar arquivos…"
        value={busca}
        onChange={setBusca}
      />
      <ListView
        aria-label="Arquivos do projeto"
        size="sm"
        selectionMode="single"
        emptyState={
          <EmptyState
            variant="compact"
            headingLevel={4}
            icon="search"
            title="Nenhum arquivo encontrado"
            description={`Nada corresponde a "${busca}". Confira a grafia ou limpe a busca.`}
            action={
              <Button size="sm" variant="outline" onClick={() => setBusca('')}>
                Limpar busca
              </Button>
            }
          />
        }
      >
        {visiveis.map((arquivo) => (
          <ListViewItem
            key={arquivo.id}
            id={arquivo.id}
            icon={<Icon name="file" size="sm" />}
            description={arquivo.detalhe}
          >
            {arquivo.nome}
          </ListViewItem>
        ))}
      </ListView>
    </div>
  )
}
