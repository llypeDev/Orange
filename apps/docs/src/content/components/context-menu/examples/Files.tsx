import { ContextMenu, DropdownItem, DropdownSeparator, Icon } from '@orange/ui'
import { useState } from 'react'

const arquivosIniciais = ['briefing-campanha.pdf', 'fotos-evento.zip', 'orcamento-2026.xlsx']

export default function Files() {
  const [arquivos, setArquivos] = useState(arquivosIniciais)
  const [aviso, setAviso] = useState('Clique com o botão direito em um arquivo (ou foque e use Shift+F10).')

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 480 }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--or-color-border)' }}>
        {arquivos.map((nome) => (
          <ContextMenu
            key={nome}
            aria-label={`Ações de ${nome}`}
            content={
              <>
                <DropdownItem icon="external-link" onSelect={() => setAviso(`Abrindo ${nome}…`)}>
                  Abrir
                </DropdownItem>
                <DropdownItem icon="download" onSelect={() => setAviso(`Baixando ${nome}…`)}>
                  Baixar
                </DropdownItem>
                <DropdownItem icon="link" onSelect={() => setAviso(`Link de ${nome} copiado.`)}>
                  Copiar link
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  icon="trash"
                  tone="danger"
                  shortcut="Del"
                  onSelect={() => {
                    setArquivos((lista) => lista.filter((a) => a !== nome))
                    setAviso(`${nome} foi para a lixeira.`)
                  }}
                >
                  Mover para a lixeira
                </DropdownItem>
              </>
            }
          >
            <li
              tabIndex={0}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderBottom: '1px solid var(--or-color-border)' }}
            >
              <Icon name="file" />
              {nome}
            </li>
          </ContextMenu>
        ))}
      </ul>
      <p role="status" style={{ margin: 0, fontSize: 13, color: 'var(--or-color-text-muted)' }}>
        {aviso}
      </p>
    </div>
  )
}
