import { LineChart } from '@orange/ui'

export default function WithGaps() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        title="Pedidos por dia"
        description="Unidades · a integração do marketplace ficou fora do ar na quarta"
        categoryLabel="Dia"
        height={240}
        series={[
          { key: 'site', label: 'Site' },
          { key: 'app', label: 'App' },
          { key: 'marketplace', label: 'Marketplace' },
        ]}
        data={[
          { label: 'seg', values: { site: 214, app: 162, marketplace: 120 } },
          { label: 'ter', values: { site: 231, app: 170, marketplace: 134 } },
          { label: 'qua', values: { site: 226, app: 181, marketplace: null } },
          { label: 'qui', values: { site: 248, app: 176, marketplace: 141 } },
          { label: 'sex', values: { site: 273, app: 198, marketplace: 158 } },
          { label: 'sáb', values: { site: 301, app: 227, marketplace: 176 } },
          { label: 'dom', values: { site: 262, app: 214, marketplace: 149 } },
        ]}
      />
    </div>
  )
}
