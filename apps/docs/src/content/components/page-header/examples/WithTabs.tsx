import { Button, PageHeader, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function WithTabs() {
  return (
    // O Tabs envolve o cabeçalho e os painéis: a TabList fica no slot navigation.
    <Tabs defaultValue="geral">
      <PageHeader
        headingLevel={2}
        eyebrow="Configurações"
        title="Loja Aurora"
        description="Ajustes que valem para todas as unidades da loja."
        divider
        actions={<Button>Salvar alterações</Button>}
        navigation={
          <TabList aria-label="Seções das configurações">
            <Tab value="geral">Geral</Tab>
            <Tab value="faturamento">Faturamento</Tab>
            <Tab value="equipe">Equipe</Tab>
            <Tab value="integracoes">Integrações</Tab>
          </TabList>
        }
      />
      <TabPanel value="geral">Nome da loja, fuso horário e moeda.</TabPanel>
      <TabPanel value="faturamento">Plano Pro · próxima fatura em 5 de maio.</TabPanel>
      <TabPanel value="equipe">8 pessoas com acesso ao painel.</TabPanel>
      <TabPanel value="integracoes">2 marketplaces e 1 meio de pagamento conectados.</TabPanel>
    </Tabs>
  )
}
