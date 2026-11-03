import { Tab, TabList, TabPanel, Tabs } from '@orange/ui'

export default function Basic() {
  return (
    <Tabs defaultValue="geral" style={{ width: '100%' }}>
      <TabList aria-label="Configurações do projeto">
        <Tab value="geral">Visão geral</Tab>
        <Tab value="membros">Membros</Tab>
        <Tab value="integracoes">Integrações</Tab>
        <Tab value="faturamento" disabled>
          Faturamento
        </Tab>
      </TabList>
      <TabPanel value="geral">
        <p style={{ margin: 0 }}>Resumo do projeto Checkout 2.0: 3 metas no trimestre, 12 tarefas abertas.</p>
      </TabPanel>
      <TabPanel value="membros">
        <p style={{ margin: 0 }}>8 pessoas têm acesso a este projeto. Convide alguém pelo e-mail.</p>
      </TabPanel>
      <TabPanel value="integracoes">
        <p style={{ margin: 0 }}>Conecte o Slack para receber alertas de deploy no canal #checkout.</p>
      </TabPanel>
      <TabPanel value="faturamento">
        <p style={{ margin: 0 }}>Disponível no plano Pro.</p>
      </TabPanel>
    </Tabs>
  )
}
