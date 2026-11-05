import { Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function Fitted() {
  return (
    <Tabs fitted size="lg" defaultValue="entrar" style={{ width: '100%', maxWidth: 400 }}>
      <TabList aria-label="Acesso">
        <Tab value="entrar">Entrar</Tab>
        <Tab value="criar">Criar conta</Tab>
      </TabList>
      <TabPanel value="entrar">Use seu e-mail corporativo e senha.</TabPanel>
      <TabPanel value="criar">Leva menos de um minuto. Não pedimos cartão.</TabPanel>
    </Tabs>
  )
}
