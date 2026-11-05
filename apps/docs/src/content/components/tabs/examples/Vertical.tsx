import { Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

const sections = [
  { value: 'conta', label: 'Conta', text: 'Nome, e-mail e foto exibidos para a sua equipe.' },
  { value: 'notificacoes', label: 'Notificações', text: 'Escolha o que chega por e-mail e o que fica só no app.' },
  { value: 'privacidade', label: 'Privacidade', text: 'Controle quem vê seu status e sua atividade recente.' },
  { value: 'acessibilidade', label: 'Acessibilidade', text: 'Reduza animações e aumente o contraste da interface.' },
]

export default function Vertical() {
  return (
    <Tabs orientation="vertical" defaultValue="conta" style={{ width: '100%', minHeight: 200 }}>
      <TabList aria-label="Preferências" style={{ minWidth: 180 }}>
        {sections.map((s) => (
          <Tab key={s.value} value={s.value}>
            {s.label}
          </Tab>
        ))}
      </TabList>
      {sections.map((s) => (
        <TabPanel key={s.value} value={s.value}>
          <h4 style={{ margin: '0 0 8px' }}>{s.label}</h4>
          <p style={{ margin: 0, color: 'var(--or-color-text-muted)' }}>{s.text}</p>
        </TabPanel>
      ))}
    </Tabs>
  )
}
