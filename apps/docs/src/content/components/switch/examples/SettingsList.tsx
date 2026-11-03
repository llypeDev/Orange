import { Switch } from '@orange/ui'

const settings = [
  { id: 'comentarios', label: 'Comentários', description: 'Quando alguém comentar nos seus projetos.', on: true },
  { id: 'mencoes', label: 'Menções', description: 'Quando alguém mencionar você.', on: true },
  { id: 'convites', label: 'Convites', description: 'Quando você for adicionado a uma equipe.', on: false },
  { id: 'resumo', label: 'Resumo semanal', description: 'Um e-mail toda segunda-feira.', on: false },
]

export default function SettingsList() {
  return (
    <div style={{ width: '100%', maxWidth: 480, borderTop: '1px solid var(--or-color-border)' }}>
      {settings.map((item) => (
        <div key={item.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--or-color-border)' }}>
          <Switch labelPosition="start" label={item.label} description={item.description} defaultChecked={item.on} />
        </div>
      ))}
    </div>
  )
}
