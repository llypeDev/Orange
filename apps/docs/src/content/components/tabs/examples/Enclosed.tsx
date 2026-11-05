import { Icon, Tab, TabList, TabPanel, Tabs } from '@orangesys/ui'

export default function Enclosed() {
  return (
    <Tabs variant="enclosed" defaultValue="pendentes" style={{ width: '100%' }}>
      <TabList aria-label="Pedidos por status">
        <Tab value="todos" icon={<Icon name="inbox" />} badge={128}>
          Todos
        </Tab>
        <Tab value="pendentes" icon={<Icon name="clock" />} badge={12}>
          Pendentes
        </Tab>
        <Tab value="enviados" icon={<Icon name="send" />} badge={96}>
          Enviados
        </Tab>
        <Tab value="cancelados" icon={<Icon name="x-circle" />}>
          Cancelados
        </Tab>
      </TabList>
      <TabPanel value="todos">128 pedidos nos últimos 30 dias.</TabPanel>
      <TabPanel value="pendentes">12 pedidos aguardando confirmação de pagamento.</TabPanel>
      <TabPanel value="enviados">96 pedidos a caminho do cliente.</TabPanel>
      <TabPanel value="cancelados">Nenhum pedido cancelado neste período.</TabPanel>
    </Tabs>
  )
}
