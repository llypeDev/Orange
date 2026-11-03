import { Button, CommandPalette, Icon, type CommandGroup } from '@orange/ui'
import { useState } from 'react'

export default function Basic() {
  const [ultimo, setUltimo] = useState('nenhum')

  const executar = (nome: string) => () => setUltimo(nome)

  const grupos: CommandGroup[] = [
    {
      label: 'Navegação',
      items: [
        {
          id: 'inicio',
          label: 'Ir para o painel',
          icon: 'home',
          shortcut: 'G P',
          onSelect: executar('Ir para o painel'),
        },
        {
          id: 'projetos',
          label: 'Ir para projetos',
          icon: 'folder',
          shortcut: 'G R',
          onSelect: executar('Ir para projetos'),
        },
        {
          id: 'configuracoes',
          label: 'Abrir configurações',
          description: 'Conta, notificações e segurança',
          icon: 'sliders',
          onSelect: executar('Abrir configurações'),
        },
      ],
    },
    {
      label: 'Criar',
      items: [
        {
          id: 'projeto',
          label: 'Criar projeto',
          icon: 'plus',
          shortcut: 'C',
          onSelect: executar('Criar projeto'),
        },
        {
          id: 'convidar',
          label: 'Convidar pessoas',
          icon: 'users',
          keywords: ['equipe', 'membros', 'time'],
          onSelect: executar('Convidar pessoas'),
        },
        {
          id: 'importar',
          label: 'Importar planilha',
          description: 'Disponível no plano Pro',
          icon: 'upload',
          disabled: true,
        },
      ],
    },
    {
      label: 'Ajuda',
      items: [
        {
          id: 'atalhos',
          label: 'Ver atalhos de teclado',
          icon: 'keyboard',
          shortcut: '?',
          onSelect: executar('Ver atalhos'),
        },
        {
          id: 'suporte',
          label: 'Falar com o suporte',
          icon: 'mail',
          onSelect: executar('Falar com o suporte'),
        },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <CommandPalette
        groups={grupos}
        hotkey="mod+k"
        trigger={
          <Button variant="outline" startIcon={<Icon name="search" />}>
            Buscar comandos
            <kbd
              style={{
                marginLeft: 12,
                fontFamily: 'var(--or-font-mono)',
                fontSize: 11,
                opacity: 0.7,
              }}
            >
              Ctrl K
            </kbd>
          </Button>
        }
      />
      <span>Último comando: {ultimo}</span>
    </div>
  )
}
